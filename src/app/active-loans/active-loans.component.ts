import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NotificationComponent } from '../notification/notification.component';

enum StateType {
  Available,
  OfferPlaced,
  LenderAccepted,
  Confirmed,
  Active,
  AwaitingValidation,
  Delinquent,
  Terminated,
  Withdrawn
}

interface Loan {
  amount: number,
  borrower: number,
  created_on: Date,
  loan_id: number,
  interest: number,
  lender: number,
  months: number,
  balance: number,
  state: number,
  platform: number,
  offers: any[],
  paymentNumber: number
}

interface Offer {
  offer_id: number,
  loan_id: number,
  borrower_id: number,
  lender_id: number,
  amount: number,
  months: number,
  interest: number,
  accepted: number,
  expiration_date: Date,
  rejected: boolean,
  username: string,
  eth_address: string,
  amount_orig: number,
  months_orig: number,
  interest_orig: number
}

@Component({
  selector: 'app-active-loans',
  templateUrl: './active-loans.component.html',
  styleUrls: ['./active-loans.component.css']
})
export class ActiveLoansComponent implements OnInit {

  @Input() loans: Loan[] = [];
  @Input() pending_offers: Offer[] = [];
  error = "null";
  curr_loan: Loan = {
    amount: 0,
    borrower: 0,
    created_on: new Date(),
    loan_id: 0,
    interest: 1,
    lender: 0,
    months: 1,
    balance: 0,
    state: 0,
    platform: 0,
    offers: [],
    paymentNumber: 0
  }

  curr_offer = {} as Offer; 
  user_id = this.authService.user.getValue()!.id;
  isLoading = false;

  monthly_repayment = 0;
  est_total_interest = 0.0;
  est_yield = 0.0;

  edited_loan = {} as Loan;

  platform = ['', 'Venmo', 'ATH Movil', 'PayPal']

  constructor(
    private authService: AuthService,
    private router: Router,
    private HttpClient: HttpClient,
    private notificationService: NotificationComponent
  ) { }

  ngOnInit(): void {
  }

  loadLoanInfo(index: number): void {
    this.curr_loan = this.loans[index];
  }

  withdraw() {
    if (this.user_id) {
      this.HttpClient.post<any>(
        '/api/withdraw-loan',
        {
          // lender: this.authService.user.getValue()!.wallet,
          loan_id: this.curr_loan.loan_id
        }
      ).subscribe(resData => {
        window.location.reload();
        console.log("lender withdrew loan, do something here...");
      });
    }
  }

  isActiveLoansURLAddress() {
    return this.router.url == '/active-loans';
  }

  send_payment() {
    
  }  
  
  update_offer(index: number) {
    this.curr_offer = this.curr_loan.offers[index]; 
  }
  
  accept_offer() {
    this.HttpClient.put<any>(
      '/api/accept-offer',
      {
        offer_id: this.curr_offer.offer_id,
        contractHash: this.curr_offer.eth_address     
      }
    ).subscribe(resData => {
      this.notificationService.insert_nofitication(this.curr_offer.borrower_id, 3);
    });

    this.HttpClient.put<any>(
      '/api/update-loan-state',
      {
        loan_id: this.curr_offer.loan_id,
        state: 2    
      }
    ).subscribe(resData => {
      window.location.reload(); 
    });
  }

  reject_offer() {
    this.HttpClient.put<any>(
      '/api/reject-offer',
      {
        offer_id: this.curr_offer.offer_id
      }
    ).subscribe(resData => {
      this.notificationService.insert_nofitication(this.curr_offer.borrower_id, 0);
      window.location.reload(); 
    });
  }

  recalculateEstimates(loan: Loan) {
    if (loan.interest <= 0 || loan.months < 3) return

    this.est_total_interest = 0; // reset
    this.monthly_repayment = 0
    loan.balance = 0

    this.monthly_repayment = (((loan.interest/100) / 12) * loan.amount) / (1 - (1 + ((loan.interest/100) / 12)) ** (-loan.months))

    // this.loan.balance = this.loan.amount - this.loan.monthly_repayment
    loan.balance = loan.amount
    // this.loan.est_total_interest = ((this.loan.interest) / 12) * this.loan.amount

    for (var i = 1; i <= loan.months; i++) {
      this.est_total_interest += ((loan.interest/100) / 12) * loan.balance
      loan.balance -= (this.monthly_repayment - ((loan.interest/100) / 12) * loan.balance)
    }
  }

  loadEditedLoan() {
    this.edited_loan = JSON.parse(JSON.stringify(this.curr_loan)); 
    this.edited_loan.interest = this.edited_loan.interest * 100;
  }

  confirmLoanChanges() {
    this.HttpClient.put<any>(
      '/api/user-loan',
      {
        loan_id: this.edited_loan.loan_id,
        amount: this.edited_loan.amount,
        interest: this.edited_loan.interest,
        months: this.edited_loan.months,
        platform: this.edited_loan.platform,
      }
    ).subscribe(resData => {
      this.edited_loan.offers.forEach(offer => {
        this.notificationService.insert_nofitication(offer.borrower_id, 8);
      });
      window.location.reload(); 
    });
  }

}

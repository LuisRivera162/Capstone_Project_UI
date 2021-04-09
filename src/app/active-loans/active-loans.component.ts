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
  borrower: string,
  created_on: Date,
  eth_address: string,
  interest: number,
  lender: string,
  months: number,
  balance: number,
  state: number,
  offers: any[]
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
  curr_loan: Loan = {
    amount: 0,
    borrower: '',
    created_on: new Date(),
    eth_address: '',
    interest: 1,
    lender: '',
    months: 1,
    balance: 0,
    state: 0,
    offers: []
  }

  curr_offer = {} as Offer; 
  user_id = this.authService.user.getValue()!.id;
  isLoading = false;


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
    // console.log(this.curr_loan)
    // this.recalculateEstimates();
  }

  confirm() {
    // if (this.user_id) {
    //   this.HttpClient.post<any>(
    //     '/api/eth/accept-loan-request',
    //     {
          
    //       sender: this.authService.user.getValue()!.wallet,
    //       contractHash: this.curr_loan.eth_address
    //     }
    //   ).subscribe(resData => {
    //     console.log("lender accepted, do something here...");
    //   });
    // }
  }

  reject() {
    // if (this.user_id) {
    //   this.HttpClient.post<any>(
    //     '/api/eth/reject-loan-request',
    //     {
    //       sender: this.authService.user.getValue()!.wallet,
    //       contractHash: this.curr_loan.eth_address
    //     }
    //   ).subscribe(resData => {
    //     console.log("lender rejected, do something here...");
    //   });
    // }
  }

  withdraw() {
    if (this.user_id) {
      this.HttpClient.post<any>(
        '/api/withdraw-loan',
        {
          lender: this.authService.user.getValue()!.wallet,
          reason: '',
          contractHash: this.curr_loan.eth_address
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

  // recalculateEstimates() {
  //   if (this.curr_loan.interest <= 0 || this.curr_loan.months < 3) return

  //   this.curr_loan.est_total_interest = 0; // reset
  //   this.curr_loan.monthly_repayment = 0
  //   this.curr_loan.balance = 0

  //   this.curr_loan.monthly_repayment = (((this.curr_loan.interest) / 12) * this.curr_loan.amount) / (1 - (1 + ((this.curr_loan.interest) / 12)) ** (-this.curr_loan.months))

  //   // this.curr_loan.balance = this.curr_loan.amount - this.curr_loan.monthly_repayment
  //   this.curr_loan.balance = this.curr_loan.amount
  //   // this.curr_loan.est_total_interest = ((this.curr_loan.interest) / 12) * this.curr_loan.amount

  //   for (var i = 1; i <= this.curr_loan.months; i++) {
  //     this.curr_loan.est_total_interest += ((this.curr_loan.interest) / 12) * this.curr_loan.balance
  //     this.curr_loan.balance -= (this.curr_loan.monthly_repayment - ((this.curr_loan.interest) / 12) * this.curr_loan.balance)
  //   }

  // }

}

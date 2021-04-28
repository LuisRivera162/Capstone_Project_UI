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
  borrower_username: string,
  lender_username: string,
  created_on: Date,
  loan_id: number,
  interest: number,
  lender: number,
  months: number,
  balance: number,
  state: number,
  platform: number,
  offers: any[],
  payment_number: number,
  monthly_repayment: number,
  rcvd_interest: number,
  eth_address: string
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
    borrower_username: '',
    lender_username: '',
    created_on: new Date(),
    loan_id: 0,
    interest: 1,
    lender: 0,
    months: 1,
    balance: 0,
    state: 0,
    platform: 0,
    offers: [],
    payment_number: 0,
    monthly_repayment: 0,
    rcvd_interest: 0,
    eth_address: ''
  }

  curr_offer = {} as Offer; 
  user_id = this.authService.user.getValue()!.id;
  isLoading = false;

  monthly_repayment = 0;
  est_total_interest = 0.0;
  est_yield = 0.0;

  edited_loan = {} as Loan;

  platform = ['Venmo', 'ATH Movil', 'PayPal']

  constructor(
    private authService: AuthService,
    private router: Router,
    private HttpClient: HttpClient,
    private notificationService: NotificationComponent
  ) { }

  /**
   * Initial code ran when component is loaded. 
   */
  ngOnInit(): void {
  }

  /**
   * 
   * Sets the value of the instance variable 'curr_loan' to the 
   * Loan in the index provided within the array 'loans'. 
   * Called when a users clicks on a loan in order to load the 
   * values of the Loan. 
   * 
   * @param index Index of the loan selected by the user.
   */
  loadLoanInfo(index: number): void {
    this.curr_loan = this.loans[index];
  }

  /**
   * Sends an http post request to the serverside with the 
   * 'curr_loan.loan_id' in order to withdraw the loan 
   * from the database. 
   */
  withdraw() {
    this.isLoading = true; 
    if (this.user_id) {
      this.HttpClient.post<any>(
        '/api/withdraw-loan',
        {
          // lender: this.authService.user.getValue()!.wallet,
          loan_id: this.curr_loan.loan_id
        }
      ).subscribe(resData => {
        this.notificationService.insert_nofitication(Number(this.authService.user_id), 11);
        window.location.reload();
        console.log("lender withdrew loan, do something here...");
        this.isLoading = false; 
      });
    }
  }

  /**
   * 
   * Used to determine if the current page address is '/active-loans'.
   * 
   * @returns true if the current url on the page is '/active-loans'
   * otherwise, false. 
   */
  isActiveLoansURLAddress() {
    return this.router.url == '/active-loans';
  }
  
  /**
   * 
   * Sets the value of the instance variable 'curr_offer' to the 
   * offer in the index provided within the array 'curr_loan.offers'. 
   * Called when a users clicks on an offer in order to load the 
   * values of the offer. 
   * 
   * @param index Index of the offer selected by the user.
   */
  update_offer(index: number) {
    this.curr_offer = this.curr_loan.offers[index]; 
  }
  
  /**
   * Sends an http PUT request to '/api/accept-offer' 
   * and '/api/update-loan-state' in order to finalize
   * the process of accepting an offer and adds the 
   * notification to the borrower who's offer was accepted. 
   */
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
      this.notificationService.insert_nofitication(this.curr_offer.borrower_id, 2);
      this.notificationService.insert_nofitication(this.curr_offer.borrower_id, 3);
      this.notificationService.insert_nofitication(this.curr_offer.lender_id, 3);
      window.location.reload(); 
    });
  }

  /**
   * Sends an http PUT request to '/api/reject-offer'
   * in order to finalize the process of a lender 
   * rejecting an offer and sending a notification 
   * to the borrower who's offer got rejected. 
   */
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

  /**
   * 
   * This method calculates the estimated total interest to be
   * gained from a loan depending on its interest, amount and 
   * monthly repayment parameters, in order for the lender to 
   * recognize the pottential profits to be made from his loan. 
   * 
   * @param loan The loan object to be used for the evaluation 
   * of profit returns. 
   * @returns Null if invalid values. 
   */
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

  /**
   * This method is used to create a copy of an edited loan in 
   * order to contrast the new edited values of the loan with 
   * the older values before a user decides to procede with 
   * editing the loan. 
   */
  loadEditedLoan() {
    this.edited_loan = JSON.parse(JSON.stringify(this.curr_loan)); 
    this.edited_loan.interest = Number(this.edited_loan.interest*100);
    this.recalculateEstimates(this.edited_loan)
  }

  /**
   * Loads the changes made when a loan edit is confirmed by the user.
   */
  confirmLoanChanges() {
    this.curr_loan.state = -2
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
      // window.location.reload(); 
      this.curr_loan.amount = this.edited_loan.amount
      this.curr_loan.interest = this.edited_loan.interest/100
      this.curr_loan.months = this.edited_loan.months
      this.curr_loan.platform = this.edited_loan.platform

      this.curr_loan.state = 0
    });
  }

  send_payment(){

  }

}

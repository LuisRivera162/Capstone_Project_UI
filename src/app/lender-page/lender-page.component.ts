import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NotificationComponent } from '../notification/notification.component';
import { timer } from 'rxjs';

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
  monthly_repayment: number,
  offers: any[],
  payment_number: number,
  rcvd_interest: number
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
  selector: 'app-lender-page',
  templateUrl: './lender-page.component.html',
  styleUrls: ['./lender-page.component.css']
})

export class LenderPageComponent implements OnInit {
  
  available_loans = 0;
  active_loans = 0;
  active_loans_balance = 0;
  pending_loans = 0;

  overall_gain = 0;

  error: string = "null";

  loans: Loan[] = [];
  pending_offers: Offer[] = [];
  curr_offer: Offer = {} as Offer;

  offer_accept_isprocessing = 0

  loans_processing = 0;

  loan = {
    amount: 1000,
    balance: 0,
    interest: 3,
    months: 3,
    platform: 0,
    monthly_repayment: 0,
    est_total_interest: 0.0,
    est_yield: 0.0
  }

  user_id = this.authService.user.getValue()!.id;

  constructor(
    private authService: AuthService,
    private router: Router,
    private HttpClient: HttpClient,
    private notificationService: NotificationComponent
  ) { }

  ngOnInit(): void {

    const params = new HttpParams().append('user_id', this.user_id);
    this.HttpClient.get<any>(
      '/api/user-loans',
      {
        params
      }
    ).subscribe(resData => {
      resData.forEach((loan: Loan) => {
        this.loans.push(loan);

        

        if (loan.state == 0) {
          this.available_loans++;
        }
        else if (loan.state == 2 || loan.state == 3) {
          this.active_loans++;
          this.active_loans_balance += loan.balance;
          this.overall_gain += loan.rcvd_interest
        }
      });

      console.log(this.loans)
    });

    this.HttpClient.get<any>(
      '/api/pending-offers',
      {
        params
      }
    ).subscribe((pendingOffers: any) => {
      this.pending_offers = pendingOffers.Offers;
    });
  }

  onSubmit(form: NgForm) {

    if (!form.valid) {
      this.error = "Form is not valid, make sure you fill all fields."
      return;
    }

    this.error = "null";

    let loan_amount = form.value.loan_amount;
    let interest = form.value.interest;
    let time_frame = form.value.time_frame;
    let platform = form.value.platform;
    let user_data: {
      email: string;
      id: number;
      wallet: string;
    } = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!user_data.email && !user_data.id && !user_data.wallet) {
      return;
    }

    let newLoan = {} as Loan
    newLoan.lender = user_data.id;
    newLoan.amount = loan_amount;
    newLoan.interest = interest/100;
    newLoan.months = time_frame;
    newLoan.borrower = 0;
    newLoan.loan_id = 0;
    newLoan.state = -1;
    newLoan.payment_number = 0;

    this.loans.push(newLoan);

    return this.HttpClient.post(
      '/api/create-loan',
      {
        loan_amount: loan_amount, 
        interest: interest, 
        time_frame: time_frame,
        platform: platform, 
        lender: user_data.id,
        lender_eth: user_data.wallet,
        monthly_repayment: this.loan.monthly_repayment,
        est_total_interest: this.loan.est_total_interest
      }).subscribe((resData: any) => {
        window.location.reload();
      });
  }

  recalculateEstimates() {
    if (this.loan.interest <= 0 || this.loan.months < 3) return

    this.loan.est_total_interest = 0; // reset
    this.loan.monthly_repayment = 0
    this.loan.balance = 0

    this.loan.monthly_repayment = (((this.loan.interest/100) / 12) * this.loan.amount) / (1 - (1 + ((this.loan.interest/100) / 12)) ** (-this.loan.months))

    // this.loan.balance = this.loan.amount - this.loan.monthly_repayment
    this.loan.balance = this.loan.amount
    // this.loan.est_total_interest = ((this.loan.interest) / 12) * this.loan.amount

    for (var i = 1; i <= this.loan.months; i++) {
      this.loan.est_total_interest += ((this.loan.interest/100) / 12) * this.loan.balance
      this.loan.balance -= (this.loan.monthly_repayment - ((this.loan.interest/100) / 12) * this.loan.balance)
    }
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

  accept_offer() {
    this.offer_accept_isprocessing = -1
    this.HttpClient.put<any>(
      '/api/accept-offer',
      {
        offer_id: this.curr_offer.offer_id,
        contractHash: this.curr_offer.eth_address     
      }
    ).subscribe(resData => {
      this.offer_accept_isprocessing = 1.

      this.HttpClient.put<any>(
        '/api/update-loan-state',
        {
          loan_id: this.curr_offer.loan_id,
          state: 2    
        }
      ).subscribe(resData => {
        timer(2)
        window.location.reload(); 
      });
      
      this.notificationService.insert_nofitication(this.curr_offer.borrower_id, 3);
    });

    
  }

  loadOfferInfo(index: number) {
    this.curr_offer = this.pending_offers[index]
  }

}

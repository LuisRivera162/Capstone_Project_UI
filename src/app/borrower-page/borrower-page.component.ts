import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

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
  offers: any[],
  platform: number,
  paymentNumber: number,
  est_total_interest: number,
  monthly_repayment: number
}

interface Offer {
  offer_id: number,
  loan_id: number,
  borrower_id: number,
  lender_id: number,
  amount: number,
  months: number,
  interest: number,
  accepted: boolean,
  rejected: boolean
  expiration_date: Date,
  username: string,
  eth_address: string,
  platform: number,
  amount_orig: number,
  months_orig: number,
  interest_orig: number
}

interface UserResponseData {
  'user_id': number
  'username': string
  'first_name': string
  'last_name': string
  'email': string
  'age': string
  'phone': string
}

@Component({
  selector: 'app-borrower-page',
  templateUrl: './borrower-page.component.html',
  styleUrls: ['./borrower-page.component.css']
})
export class BorrowerPageComponent implements OnInit {
  user_id = this.authService.user.getValue()!.id;
  firstname = '';
  platforms = ['Venmo', 'ATH Movil', 'PayPal'];

  currentLoan: Loan = {} as Loan;
  isParticipant = false;

  total_loan_balance = 0;
  payment_due = 0;
  payment_due_date = new Date();

  pending_offers: Offer[] = [];
  rejected_offers: Offer[] = [];

  latestActivity: any[] = []

  curr_offer: Offer = {} as Offer;
  offer_accepted = false;

  paymentTable: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private HttpClient: HttpClient
  ) { }

  ngOnInit(): void {
    const params = new HttpParams().append('user_id', this.user_id);

    this.HttpClient.get<UserResponseData>(
      '/api/user',
      {
        params
      }
    ).subscribe(resData => {
      this.firstname = resData.first_name
    });

    this.HttpClient.get<any>(
      '/api/user-loans',
      {
        params
      }
    ).subscribe(userLoans => {
      // if an active loan is found, hide table and show active loan dashboard..
      if (userLoans.length) {
        this.currentLoan = userLoans[0]
        this.loadPaymentSchedule()
      }

      console.log(this.currentLoan)

    });

    this.HttpClient.get<any>(
      '/api/get-participant',
      {
        params
      }
    ).subscribe(resData => {

      if (resData.Participant) {
        this.isParticipant = true;
      }
      // console.log(resData)

    });

    this.HttpClient.get<any>(
      '/api/pending-offers',
      {
        params
      }
    ).subscribe((pendingOffers: any) => {
      this.pending_offers = pendingOffers.Offers

      pendingOffers.Offers.forEach((offer: Offer) => {
        if (offer.accepted) {
          this.offer_accepted = true;
        }
      });
    });

    this.HttpClient.get<any>(
      '/api/rejected-offers',
      {
        params
      }
    ).subscribe((rejectedOffers: any) => {
      this.rejected_offers = rejectedOffers.rejectedOffers;
    });

  }

  onSubmit() {
    const params = new HttpParams().append('offer_id', '' + this.curr_offer.offer_id);
    // console.log(params)
    this.HttpClient.delete<any>(
      '/api/withdraw-offer',
      {
        params
      }
    ).subscribe(resData => {
      window.location.reload();
    });
  }

  loadOfferInfo(index: number) {
    this.curr_offer = this.pending_offers[index]
  }

  loadRejectedOfferInfo(index: number) {
    this.curr_offer = this.rejected_offers[index]
  }

  loadPaymentSchedule() {
    const params = new HttpParams().append('loan_id', this.currentLoan.loan_id.toString());
    this.HttpClient.get(
      '/api/loan-payments',
      {
        params
      }
    ).subscribe((resData: any) => {
      console.log(resData)
      var core_transfer_date = new Date(resData.Payments[0].payment_date)

      console.log(core_transfer_date.getMonth(), core_transfer_date.getDay(), core_transfer_date.getFullYear())

      var month = core_transfer_date.getMonth()
      var day = core_transfer_date.getDay()
      var year = core_transfer_date.getFullYear()

      var balance = this.currentLoan.amount

      this.currentLoan.est_total_interest = 0; // reset
      this.currentLoan.monthly_repayment = 0

      this.currentLoan.monthly_repayment = (((this.currentLoan.interest / 100) / 12) * this.currentLoan.amount) / (1 - (1 + ((this.currentLoan.interest / 100) / 12)) ** (-this.currentLoan.months))

      for (var i = 1; i <= this.currentLoan.months; i++) {
        if (month == 11) {
          month = 0
          year++
        } else {
          month++
        }
        

        this.currentLoan.est_total_interest += ((this.currentLoan.interest / 100) / 12) * balance
        balance -= (this.currentLoan.monthly_repayment - ((this.currentLoan.interest / 100) / 12) * balance)

        let payload = {
          date: new Date(year, month, day),
          payment: Math.round(this.currentLoan.monthly_repayment * 100) / 100,
          balance: Math.round(balance * 100) / 100
        }

        this.paymentTable.push(payload)
      }

      this.payment_due_date = new Date(this.paymentTable[0].date)
      this.payment_due = this.paymentTable[0].payment

    });

    

  }

}

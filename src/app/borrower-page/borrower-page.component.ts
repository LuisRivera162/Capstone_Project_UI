import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NotificationComponent } from '../notification/notification.component';

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
  payment_number: number,
  rcvd_interest: number,
  est_interest: number,
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
  interest_orig: number,
  withdrawn: boolean,
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
    private HttpClient: HttpClient,
    private notificationService: NotificationComponent
  ) { }


  /**
   * Initial code ran when component is loaded. 
   * In this case, gets the user logged in user, 
   * user-loans, checks to see if the user is in 
   * a current loan, pending offers, and rejected 
   * offers the user may have from the back-end 
   * server. 
   */
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

  /**
   * On submission of the main form, this method sends an
   * http 'PUT' request to the route '/api/withdraw-offer'
   * on the back-end server in order to set the offer to 
   * the 'withdrawn' state upon user request. 
   */
  onSubmit() {
    this.HttpClient.put<any>(
      '/api/withdraw-offer',
      {
        offer_id: this.curr_offer.offer_id
      }
    ).subscribe(resData => {
      this.notificationService.insert_nofitication(this.curr_offer.borrower_id, 9); 
      window.location.reload();
    });
  }

  /**
   * 
   * Sets the value of the instance variable 'curr_offer' to the 
   * offer in the index provided within the array 'pending_offers'. 
   * Called when a users clicks on an offer in order to load the 
   * values of the offer. 
   * 
   * @param index Index of the offer selected by the user.
   */
  loadOfferInfo(index: number) {
    this.curr_offer = this.pending_offers[index];
  }

  /**
   * 
   * Sets the value of the instance variable 'curr_offer' to the 
   * offer in the index provided within the array 'rejected_offers'. 
   * Called when a users clicks on an offer in order to load the 
   * values of the offer. 
   * 
   * @param index Index of the offer selected by the user.
   */
  loadRejectedOfferInfo(index: number) {
    this.curr_offer = this.rejected_offers[index]
  }

  /**
   * Loads the payment schedule a borrower may have based on the
   * loan's number of months to pay, payments due, and interest rate, 
   * for the user to see which days he has to pay. 
   */
  loadPaymentSchedule() {
    const params = new HttpParams().append('loan_id', this.currentLoan.loan_id.toString());
    this.HttpClient.get(
      '/api/loan-payments',
      {
        params
      }
    ).subscribe((resData: any) => {
      if (resData.Payments.length) {
        var core_transfer_date = new Date(resData.Payments[0].payment_date)

        var month = core_transfer_date.getMonth()
        var day = core_transfer_date.getDate()
        var year = core_transfer_date.getFullYear()

        var balance = this.currentLoan.amount

        this.currentLoan.est_interest = 0; // reset
        this.currentLoan.monthly_repayment = 0

        this.currentLoan.monthly_repayment = Number(((((this.currentLoan.interest) / 12) * this.currentLoan.amount) / (1 - (1 + ((this.currentLoan.interest) / 12)) ** (-this.currentLoan.months))).toFixed(2))

        for (var i = 1; i <= this.currentLoan.months; i++) {
          if (month == 11) {
            month = 0
            year++
          } else {
            month++
          }

          var oldbalance = balance
          this.currentLoan.est_interest += ((this.currentLoan.interest) / 12) * balance
          balance -= (this.currentLoan.monthly_repayment - ((this.currentLoan.interest) / 12) * balance)

          let payload = {
            date: new Date(year, month, day),
            payment: Math.round(this.currentLoan.monthly_repayment * 100) / 100,
            balance: Math.round(balance * 100) / 100,
            interest: ((this.currentLoan.interest) / 12) * oldbalance,
            state: 0
          }

          if (resData.Payments[i] !== undefined) {
            // found payment for period
            if (resData.Payments[i].validated) {
              payload.state = 1 // found payment is validated
            } else {
              payload.state = -1 // payment exists but not validated yet
            }
          }

          this.paymentTable.push(payload)
        }

        for (let i = 0; i < this.paymentTable.length; i++) {
          if (this.paymentTable[i].state == 0) {
            this.payment_due_date = new Date(this.paymentTable[i].date)
            this.payment_due = this.paymentTable[i].payment
            break
          }
        }
      }
    });
  }

}

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
  platform: number
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

  currentLoan: Loan = {} as Loan;

  total_loan_balance = 0;
  payment_due = 0;
  payment_due_date = new Date();

  pending_offers: Offer[] = [];
  rejected_offers: Offer[] = [];

  latestActivity: any[] = []

  curr_offer: Offer = {} as Offer;
  offer_accepted = false;

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
      }

      console.log(this.currentLoan)
      
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

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NgForm } from '@angular/forms';

interface OfferResponseData {
  Offers: {
    'offer_id': number,
    'loan_id': number,
    'borrower_id': number,
    'lender_id': number,
    'amount': number,
    'months': number,
    'interest': number,
    'accepted': boolean,
    'expiration_date': Date
    'username': string,
    'eth_address': string
  }[];
}

@Component({
  selector: 'app-pending-offers',
  templateUrl: './pending-offers.component.html',
  styleUrls: ['./pending-offers.component.css']
})
export class PendingOffersComponent implements OnInit {

  offers: {
    'offer_id': number,
    'loan_id': number,
    'borrower_id': number,
    'lender_id': number,
    'amount': number,
    'months': number,
    'interest': number,
    'accepted': boolean,
    'expiration_date': Date
    'username': string,
    'eth_address': string
  }[] | any;

  curr_offer = {
    'offer_id': 0,
    'loan_id': 0,
    'borrower_id': 0,
    'lender_id': 0,
    'amount': 0,
    'months': 0,
    'interest': 0,
    'accepted': false,
    'expiration_date': "",
    'username': "",
    'eth_address': ""
  }; 

  constructor(
    private authService: AuthService, 
    private router: Router,
    private HttpClient: HttpClient
    ) { }

  ngOnInit(): void {
    const params = new HttpParams().append('user_id', this.authService.user.getValue()!.id);
    this.HttpClient.get<OfferResponseData>(
      '/api/pending-offers',
    {
      params
    }).subscribe(resData => {
      this.offers = resData.Offers; 
    });
  }

  loadOfferInfo(index: number): void {
    this.curr_offer = this.offers[index];
  }

}

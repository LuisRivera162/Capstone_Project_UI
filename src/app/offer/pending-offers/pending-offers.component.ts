import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NgForm } from '@angular/forms';


interface Offer {
  offer_id: number,
  loan_id: number,
  borrower_id: number,
  lender_id: number,
  amount: number,
  months: number,
  interest: number,
  accepted: boolean,
  expiration_date: Date
  username: string,
  eth_address: string
};

@Component({
  selector: 'app-pending-offers',
  templateUrl: './pending-offers.component.html',
  styleUrls: ['./pending-offers.component.css']
})
export class PendingOffersComponent implements OnInit {

  offers: Offer[] = []

  curr_offer: Offer = {} as Offer;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private HttpClient: HttpClient
    ) { }

  ngOnInit(): void {
    const params = new HttpParams().append('user_id', this.authService.user.getValue()!.id);
    this.HttpClient.get<any>(
      '/api/pending-offers',
    {
      params
    }).subscribe((resData:any) => {
      this.offers = resData.Offers; 
    });


  }

  loadOfferInfo(index: number): void {
    this.curr_offer = this.offers[index];
  }

  getURL(){
    return this.router.url == '/pending-offers'
  }

}

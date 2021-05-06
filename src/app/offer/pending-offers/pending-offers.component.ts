import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { NotificationComponent } from 'src/app/notification/notification.component';


interface Offer {
  offer_id: number,
  loan_id: number,
  borrower_id: number,
  lender_id: number,
  amount: number,
  months: number,
  interest: number,
  accepted: boolean,
  expiration_date: Date,
  rejected: boolean,
  username: string,
  eth_address: string,
  platform: number
};

@Component({
  selector: 'app-pending-offers',
  templateUrl: './pending-offers.component.html',
  styleUrls: ['./pending-offers.component.css']
})
export class PendingOffersComponent implements OnInit {

  offers: Offer[] = []
  curr_offer: Offer = {} as Offer;
  platforms = ['Venmo', 'ATH Movil', 'PayPal'];

  constructor(
    private authService: AuthService,
    private router: Router,
    private HttpClient: HttpClient,
    private notificationService: NotificationComponent
    ) { }

  /**
   * Initial code ran when component is loaded. 
   * In this case, sends an http 'GET' request 
   * to the route '/api/pending-offers' in order 
   * to retrieve from the server all the pending 
   * offers a user has. 
   */
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

  /**
   * 
   * Sets the value of the instance variable 'curr_offer' to the 
   * offer in the index provided within the array 'offers'. 
   * Called when a users clicks on an offer in order to load the 
   * values of the offer. 
   * 
   * @param index Index of the offer selected by the user.
   */
  loadOfferInfo(index: number): void {
    this.curr_offer = this.offers[index];
  }

  /**
   * Method to check the current web page irl. Used to modify 
   * the style of the page. 
   * 
   * @returns True if the current url is '/pending-offers', 
   * False otherwise.
   */
  getURL(){
    return this.router.url == '/pending-offers'
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

}

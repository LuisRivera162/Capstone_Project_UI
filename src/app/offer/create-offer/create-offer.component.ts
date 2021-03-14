import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-create-offer',
  templateUrl: './create-offer.component.html',
  styleUrls: ['./create-offer.component.css']
})
export class CreateOfferComponent implements OnInit {
  @Input() loan_id: number = -1;
  @Input() lender_id = -1; 
  @Input() isEdit = false; 
  @Input() curr_offer: Offer = {} as Offer;

  user_id: number | String = this.authService.user.getValue()!.id;  
  error: string = "null";

  loan = {
    amount: 0,
    balance: 0,
    interest: 0,
    months: 0,
    platform: 0,
    monthly_repayment: 0,
    est_total_interest: 0.0,
    est_yield: 0.0
  };

  constructor(
    private authService: AuthService, 
    private router: Router,
    private HttpClient: HttpClient
  ) {}

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    
    if (!form.valid){
      this.error = "Form is not valid, make sure you fill all fields."
      return;
    }

    this.error = "null"; 

    if (this.isEdit){
      let loan_amount = form.value.loan_amount;
      let interest = form.value.interest;
      let time_frame = form.value.time_frame;
      let platform = form.value.platform;

      this.HttpClient.put(
        '/api/create-offer',
        {
          offer_id: this.curr_offer.offer_id, loan_amount: loan_amount, 
          interest: interest, time_frame: time_frame,
          platform: platform, borrower_id: this.user_id
        }
        ).subscribe(resData => {
          form.reset(); 
          window.location.reload(); 
          this.isEdit = false; 
      });
      return;
    }
    
    if (this.loan_id != -1){

      let loan_amount = form.value.loan_amount;
      let interest = form.value.interest;
      let time_frame = form.value.time_frame;
      let platform = form.value.platform;
      console.log(this.lender_id);

      this.HttpClient.post(
        '/api/create-offer',
        {
          loan_id: this.loan_id, loan_amount: loan_amount, 
          interest: interest, time_frame: time_frame,
          platform: platform, borrower_id: this.user_id,
          lender_id: this.lender_id
        }
        ).subscribe(resData => {
          form.reset(); 
          this.router.navigate(['/pending-offers']);
      });
    }

    else {
      console.log('fail');
    }
  }
}

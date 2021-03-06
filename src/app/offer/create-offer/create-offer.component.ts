import { Component, Injectable, Input, NgModule, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NgForm } from '@angular/forms';

interface LoanResponseData {
  
  Loan: { 'username': string,
          'interest': number, 
          'accepted': boolean, 
          'loan_amount': number,
          'loan_id': number,
          'time_frame': Date,
          'user_id': number
        };

}

@Component({
  selector: 'app-create-offer',
  templateUrl: './create-offer.component.html',
  styleUrls: ['./create-offer.component.css']
})
export class CreateOfferComponent implements OnInit {
  @Input() loan_id: number = -1;
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
    private HttpClient: HttpClient,
    private activatedroute: ActivatedRoute
  ) {}

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    if (!form.valid){
      console.log(form);
      this.error = "Form is not valid, make sure you fill all fields."
      return;
    }

    this.error = "null"; 
    
    if (this.loan_id){
      const params = new HttpParams().append('loan_id', this.loan_id.toString());

      let loan_amount = form.value.loan_amount;
      let interest = form.value.interest;
      let time_frame = form.value.time_frame;
      let platform = form.value.platform;

      this.HttpClient.post(
        '/api/create-offer',
        {
          loan_id: this.loan_id, loan_amount: loan_amount, 
          interest: interest, time_frame: time_frame,
          platform: platform, borrower_id: this.user_id
        }
        ).subscribe(resData => {
          console.log(resData)
          form.reset(); 
          this.router.navigate(['/pending-offers'])
      });
    }

    else {
      console.log('fail');
    }
  }
}

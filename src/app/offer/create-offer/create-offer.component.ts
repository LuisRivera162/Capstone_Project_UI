import { Component, Injectable, NgModule, OnInit } from '@angular/core';
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

  user_id: number | String = this.authService.user.getValue()!.id;  
  loan_id: number | String = this.activatedroute.snapshot.paramMap.get('loan_id')!;
  prev_interest: number = -1;
  prev_loan_amount: number = -1;
  prev_time_frame: Date | String = "";
  error: string = "null";

  constructor(
    private authService: AuthService, 
    private router: Router,
    private HttpClient: HttpClient,
    private activatedroute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.loan_id){
      const params = new HttpParams().append('loan_id', this.loan_id.toString());

      this.HttpClient.get<LoanResponseData>(
        '/api/user-loan',
        {
          params
        }
        ).subscribe(resData => {
        this.prev_interest = resData.Loan.interest * 100;
        this.prev_loan_amount = resData.Loan.loan_amount;
        this.prev_time_frame = resData.Loan.time_frame;
      });
    }

    else {
      console.log('fail');
    }

  }

  onSubmit(form: NgForm) {
    if (!form.valid){
      console.log(form);
      this.error = "Form is not valid, make sure you fill all fields."
      return;
    }

    this.error = "null"; 

    let loan_amount = form.value.loan_amount;
    let interest = form.value.interest;
    let time_frame = form.value.time_frame;
    let platform = form.value.platform;
  }
  
  
}

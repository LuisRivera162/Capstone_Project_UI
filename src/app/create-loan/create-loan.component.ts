import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-create-loan',
  templateUrl: './create-loan.component.html',
  styleUrls: ['./create-loan.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class CreateLoanComponent implements OnInit {

  error: string = "null";

  loan = {
    amount: 0,
    balance: 0,
    interest: 0.0,
    months: 0,
    platform: "",
    monthly_repayment: 0,
    est_total_interest: 0.0
  }
  

  constructor(
    private authService: AuthService,
    private router: Router,
    private HttpClient: HttpClient
  ) { }

  ngOnInit(): void {
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
      id: string;
    } = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!user_data.email && !user_data.id) {
      return;
    }

    this.router.navigate(['/search']);

    return this.HttpClient.post(
      '/api/create-loan',
      {
        loan_amount: loan_amount, interest: interest, time_frame: time_frame,
        platform: platform, user_id: user_data.id
      }).subscribe();
  }

  recalculateEstimates() {
    if (this.loan.interest <= 0 || this.loan.amount < 100 || this.loan.months <=0) return
    
    this.loan.monthly_repayment = (((this.loan.interest/100)/12)*this.loan.amount) / (1-(1+((this.loan.interest/100)/12))**(-this.loan.months))
    
    this.loan.balance = this.loan.amount - this.loan.monthly_repayment
    this.loan.est_total_interest = ((this.loan.interest/100)/12) * this.loan.amount

    for (var i = 1; i <= this.loan.months; i++) {
      this.loan.est_total_interest += ((this.loan.interest/100)/12) * this.loan.balance
      this.loan.balance -= (this.loan.monthly_repayment - ((this.loan.interest/100)/12) * this.loan.balance)
    }

  }

}

import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NotificationComponent } from '../notification/notification.component';

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
    amount: 1000,
    balance: 0,
    interest: 3,
    months: 3,
    platform: 0,
    monthly_repayment: 0,
    est_total_interest: 0.0,
    est_yield: 0.0
  }


  constructor(
    private authService: AuthService,
    private router: Router,
    private HttpClient: HttpClient,
    private notificationService: NotificationComponent
  ) { }

  ngOnInit(): void {
    this.recalculateEstimates();
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
      wallet: string;
    } = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!user_data.email && !user_data.id && !user_data.wallet) {
      return;
    }

    return this.HttpClient.post(
      '/api/create-loan',
      {
        loan_amount: loan_amount,
        interest: interest,
        time_frame: time_frame,
        platform: platform,
        lender: user_data.id,
        lender_eth: user_data.wallet,
        monthly_repayment: this.loan.monthly_repayment,
        est_total_interest: this.loan.est_total_interest
      }).subscribe((resData) => {
        this.router.navigate(['/active-loans']);
      });
  }

  recalculateEstimates() {
    if (this.loan.interest <= 0 || this.loan.months < 3) return

    this.loan.est_total_interest = 0; // reset
    this.loan.monthly_repayment = 0
    this.loan.balance = 0

    this.loan.monthly_repayment = (((this.loan.interest/100) / 12) * this.loan.amount) / (1 - (1 + ((this.loan.interest/100) / 12)) ** (-this.loan.months))

    this.loan.balance = this.loan.amount

    for (var i = 1; i <= this.loan.months; i++) {
      this.loan.est_total_interest += ((this.loan.interest/100) / 12) * this.loan.balance
      this.loan.balance -= (this.loan.monthly_repayment - ((this.loan.interest/100) / 12) * this.loan.balance)
    }

  }

}

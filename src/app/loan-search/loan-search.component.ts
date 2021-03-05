import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';

interface LoanResponseData {
  Loans: {
    'interest': number,
    'accepted': boolean,
    'amount': number,
    'loan_id': number,
    'months': number,
    'user_id': number,
    'eth_address': string,
    'monthly_repayment': number,
    'balance': number,
    'est_total_interest': number,
    'username': string
  }[];
}

@Component({
  selector: 'app-loan-search',
  templateUrl: './loan-search.component.html',
  styleUrls: ['./loan-search.component.css']
})
export class LoanSearchComponent implements OnInit {

  loans: {
    'interest': number,
    'accepted': boolean,
    'amount': number,
    'loan_id': number,
    'months': number,
    'user_id': number,
    'eth_address': string,
    'monthly_repayment': number,
    'balance': number,
    'est_total_interest': number,
    'username': string
  }[] = [];

  curr_loan: {
    'interest': number,
    'accepted': boolean,
    'amount': number,
    'loan_id': number,
    'months': number,
    'user_id': number
    'eth_address': string,
    'monthly_repayment': number,
    'balance': number,
    'est_total_interest': number,
    'username': string
  } = {
      'interest': 0,
      'accepted': false,
      'amount': 0,
      'loan_id': 0,
      'months': 0,
      'user_id': 0,
      'eth_address': '0x0',
      'monthly_repayment': 0,
      'balance': 0,
      'est_total_interest': 0,
      'username': ""
    };

  constructor(
    private authService: AuthService,
    private router: Router,
    private HttpClient: HttpClient
  ) { }

  ngOnInit(): void {
    const params = new HttpParams().append('user_id', this.authService.user.getValue()!.id);
    this.HttpClient.get<LoanResponseData>(
      '/api/loans',
    {
      params
    }).subscribe(resData => {
      this.loans = resData.Loans;
    });
  }

  loadLoanInfo(index: number): void {
    this.curr_loan = this.loans[index];
  }

  recalculateEstimates() {
    if (this.curr_loan.interest <= 0 || this.curr_loan.amount < 100 || this.curr_loan.months <= 0) return

    this.curr_loan.monthly_repayment = (((this.curr_loan.interest / 100) / 12) * this.curr_loan.amount) / (1 - (1 + ((this.curr_loan.interest / 100) / 12)) ** (-this.curr_loan.months))

    this.curr_loan.balance = this.curr_loan.amount - this.curr_loan.monthly_repayment
    this.curr_loan.est_total_interest = ((this.curr_loan.interest / 100) / 12) * this.curr_loan.amount

    for (var i = 1; i <= this.curr_loan.months; i++) {
      this.curr_loan.est_total_interest += ((this.curr_loan.interest / 100) / 12) * this.curr_loan.balance
      this.curr_loan.balance -= (this.curr_loan.monthly_repayment - ((this.curr_loan.interest / 100) / 12) * this.curr_loan.balance)
    }

    // this.curr_loan.est_total_interest / this.curr_loan.amount;

  }

}

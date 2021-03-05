import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';

interface LoanResponseData {

  Loans: {
    'loan_id': number,
    'lender': string,
    'borrower': string,
    'amount': number,
    'months': number,
    'eth_address': string,
    'interest': number,
    'accepted': boolean,
    'created_on': Date,
    'monthly_repayment': number,
    'balance': number,
    'est_total_interest': number,
  }[];
}

@Component({
  selector: 'app-active-loans',
  templateUrl: './active-loans.component.html',
  styleUrls: ['./active-loans.component.css']
})
export class ActiveLoansComponent implements OnInit {

  loans: {
    'loan_id': number,
    'lender': string,
    'borrower': string,
    'amount': number,
    'months': number,
    'eth_address': string,
    'interest': number,
    'accepted': boolean,
    'created_on': Date,
    'monthly_repayment': number,
    'balance': number,
    'est_total_interest': number,
  }[] = [];

  curr_loan: {
    'loan_id': number,
    'lender': string,
    'borrower': string,
    'amount': number,
    'months': number,
    'eth_address': string,
    'interest': number,
    'accepted': boolean,
    'created_on': Date,
    'monthly_repayment': number,
    'balance': number,
    'est_total_interest': number,
  } = {
      'loan_id': 0,
      'lender': '',
      'borrower': '',
      'amount': 0,
      'months': 0,
      'eth_address': '',
      'interest': 0,
      'accepted': false,
      'created_on': new Date(),
      'monthly_repayment': 0,
      'balance': 0,
      'est_total_interest': 0,
    };

  user_id = this.authService.user.getValue()!.id;
  isLoading = false;


  constructor(
    private authService: AuthService,
    private router: Router,
    private HttpClient: HttpClient
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    const params = new HttpParams().append('user_id', this.user_id);

    this.HttpClient.get<LoanResponseData>(
      '/api/user-loans',
      {
        params
      }
    ).subscribe(resData => {
      this.loans = resData.Loans;
    });
    this.isLoading = false;

  }

  loadLoanInfo(index: number): void {
    this.curr_loan = this.loans[index];
  }

  isActiveLoansURLAddress() {
    return this.router.url == '/active-loans';
  }

}

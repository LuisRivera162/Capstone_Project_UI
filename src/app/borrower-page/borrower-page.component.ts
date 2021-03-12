import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

interface Loan {
  loan_id: number,
  lender: number,
  borrower: number,
  lender_eth: string,
  borrower_eth: string,
  amount: number,
  months: number,
  eth_address: string,
  interest: number,
  accepted: boolean,
  created_on: Date,
  monthly_repayment: number,
  balance: number,
  est_total_interest: number,
}

interface Loan2 {
  amount: number,
  borrower: string,
  created_on: Date,
  eth_address: string,
  interest: number,
  lender: string,
  months: number,
  paymentNumber: number,
  state: number
}

@Component({
  selector: 'app-borrower-page',
  templateUrl: './borrower-page.component.html',
  styleUrls: ['./borrower-page.component.css']
})
export class BorrowerPageComponent implements OnInit {

  currentLoan: Loan2 = {} as Loan2;
  user_id = this.authService.user.getValue()!.id;
  total_loan_balance = 0;
  payment_due = 0;
  payment_due_date = new Date();


  constructor(
      private authService: AuthService, 
      private router: Router,
      private HttpClient: HttpClient
    ) { }

  ngOnInit(): void {
    const params = new HttpParams().append('user_id', this.user_id);
    this.HttpClient.get<any>(
      '/api/user-loans',
      {
        params
      }
    ).subscribe(resData => {
      resData.forEach((loan: Loan2) => {
        // if (loan.borrower && loan.accepted) {
        //   this.total_loan_balance += loan.balance // TODO: Needs balance to be saved in the DB (or blockchain)
        //   this.currentLoan = loan;
        // }
      });
    });
  }

  

}

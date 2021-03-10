import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';

interface Loan {
  loan_id: number,
  lender: string,
  borrower: string,
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

@Component({
  selector: 'app-lender-page',
  templateUrl: './lender-page.component.html',
  styleUrls: ['./lender-page.component.css']
})

export class LenderPageComponent implements OnInit {
  
  available_loans = 0;
  active_loans = 0;
  active_loans_balance = 0;
  pending_offers = 0;

  user_id = this.authService.user.getValue()!.id;

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
      resData.Loans.forEach((loan: Loan) => {
        if (loan.borrower && loan.accepted) {
          this.active_loans++
          this.active_loans_balance += loan.balance // TODO: Needs balance to be saved in the DB (or blockchain)
        }
        else if (loan.borrower && !loan.accepted) this.pending_offers++
        else this.available_loans++
      });
      
    });

    this.HttpClient.get<any>(
      '/api/total-offers',
      {
        params
      }
    ).subscribe(resData => {
      console.log(resData);
      this.pending_offers = resData.result;
    });

  }

}

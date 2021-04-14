import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';

enum StateType {
  Available,
  OfferPlaced,
  LenderAccepted,
  Confirmed,
  Active,
  AwaitingValidation,
  Delinquent,
  Terminated,
  Withdrawn
}

interface Loan {
  amount: number,
  borrower: string,
  created_on: Date,
  eth_address: string,
  interest: number,
  lender: string,
  months: number,
  balance: number,
  state: number,
  offers: any[]
}

@Component({
  selector: 'app-active-loans',
  templateUrl: './active-loans.component.html',
  styleUrls: ['./active-loans.component.css']
})
export class ActiveLoansComponent implements OnInit {

  @Input() loans: Loan[] = [];

  curr_loan: Loan = {
    amount: 0,
    borrower: '',
    created_on: new Date(),
    eth_address: '',
    interest: 1,
    lender: '',
    months: 1,
    balance: 0,
    state: 0,
    offers: []
  }

  user_id = this.authService.user.getValue()!.id;
  isLoading = false;


  constructor(
    private authService: AuthService,
    private router: Router,
    private HttpClient: HttpClient
  ) { }

  ngOnInit(): void {
  }

  loadLoanInfo(index: number): void {
    this.curr_loan = this.loans[index];
  }

  confirm() {
    if (this.user_id) {
      this.HttpClient.post<any>(
        '/api/eth/accept-loan-request',
        {
          sender: this.authService.user.getValue()!.wallet,
          contractHash: this.curr_loan.eth_address
        }
      ).subscribe(resData => {
      });
    }
  }

  reject() {

  }

  withdraw() {
    if (this.user_id) {
      this.HttpClient.post<any>(
        '/api/withdraw-loan',
        {
          lender: this.authService.user.getValue()!.wallet,
          reason: '',
          contractHash: this.curr_loan.eth_address
        }
      ).subscribe(resData => {
        window.location.reload();
      });
    }
  }

  isActiveLoansURLAddress() {
    return this.router.url == '/active-loans';
  }

  send_payment() {

  }

}

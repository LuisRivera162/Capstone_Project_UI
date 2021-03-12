import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';

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

interface Loan2 {
  amount: number,
  borrower: string,
  created_on: Date,
  eth_address: string,
  interest: number,
  lender: string,
  months: number,
  balance: number,
  state: number
}

@Component({
  selector: 'app-active-loans',
  templateUrl: './active-loans.component.html',
  styleUrls: ['./active-loans.component.css']
})
export class ActiveLoansComponent implements OnInit {

  @Input() loans: Loan2[] = [];

  curr_loan: Loan2 = {} as Loan2

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
    // this.recalculateEstimates();
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
        console.log("lender accepted, do something here...");
      });
    }
  }

  reject() {
    if (this.user_id) {
      this.HttpClient.post<any>(
        '/api/eth/reject-loan-request',
        {
          sender: this.authService.user.getValue()!.wallet,
          contractHash: this.curr_loan.eth_address
        }
      ).subscribe(resData => {
        console.log("lender rejected, do something here...");
      });
    }
  }

  withdraw() {
    if (this.user_id) {
      this.HttpClient.post<any>(
        '/api/eth/withdraw-loan',
        {
          sender: this.authService.user.getValue()!.wallet,
          contractHash: this.curr_loan.eth_address
        }
      ).subscribe(resData => {
        console.log("lender withdrew loan, do something here...");
      });
    }
  }

  isActiveLoansURLAddress() {
    return this.router.url == '/active-loans';
  }

  // recalculateEstimates() {
  //   if (this.curr_loan.interest <= 0 || this.curr_loan.months < 3) return

  //   this.curr_loan.est_total_interest = 0; // reset
  //   this.curr_loan.monthly_repayment = 0
  //   this.curr_loan.balance = 0

  //   this.curr_loan.monthly_repayment = (((this.curr_loan.interest) / 12) * this.curr_loan.amount) / (1 - (1 + ((this.curr_loan.interest) / 12)) ** (-this.curr_loan.months))

  //   // this.curr_loan.balance = this.curr_loan.amount - this.curr_loan.monthly_repayment
  //   this.curr_loan.balance = this.curr_loan.amount
  //   // this.curr_loan.est_total_interest = ((this.curr_loan.interest) / 12) * this.curr_loan.amount

  //   for (var i = 1; i <= this.curr_loan.months; i++) {
  //     this.curr_loan.est_total_interest += ((this.curr_loan.interest) / 12) * this.curr_loan.balance
  //     this.curr_loan.balance -= (this.curr_loan.monthly_repayment - ((this.curr_loan.interest) / 12) * this.curr_loan.balance)
  //   }

  // }

}

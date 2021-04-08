import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NotificationComponent } from '../notification/notification.component';

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

@Component({
  selector: 'app-loan-search',
  templateUrl: './loan-search.component.html',
  styleUrls: ['./loan-search.component.css']
})
export class LoanSearchComponent implements OnInit {

  loans: Loan[] = []
  curr_loan: Loan = {} as Loan

  constructor(
    private authService: AuthService,
    private router: Router,
    private HttpClient: HttpClient,
    private notificationService: NotificationComponent
  ) { }

  ngOnInit(): void {
    const params = new HttpParams().append('user_id', this.authService.user.getValue()!.id);
    this.HttpClient.get<any>(
      '/api/loans',
    {
      params
    }).subscribe(resData => {
      this.loans = resData.Loans as Loan[];
    });
  }

  loadLoanInfo(index: number): void {
    this.curr_loan = this.loans[index];
    this.monthlyPayment()
  }

  requestLoan() {
    this.HttpClient.post(
      '/api/create-offer',
      {
        loan_id: this.curr_loan.loan_id, 
        loan_amount: this.curr_loan.amount, 
        interest: this.curr_loan.interest, 
        time_frame:  this.curr_loan.months,
        platform: null, 
        borrower_id:  this.authService.user.getValue()!.id,
        lender_id: this.curr_loan.lender
      }
      ).subscribe(resData => {
        this.notificationService.insert_nofitication(this.curr_loan.lender, 6); 
        this.router.navigate(['/pending-offers']);
        // alert('offer submited!')
    });
  }

  monthlyPayment() {
    this.curr_loan.monthly_repayment = (((this.curr_loan.interest) / 12) * this.curr_loan.amount) / (1 - (1 + ((this.curr_loan.interest) / 12)) ** (-this.curr_loan.months))
  }

}

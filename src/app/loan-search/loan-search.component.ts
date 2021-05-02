import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NotificationComponent } from '../notification/notification.component';

interface Loan {
  loan_id: number,
  lender: number,
  username: string,
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
  platform: number
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

  /**
   * Initial code ran when component is loaded. 
   * In this case, sends an http 'GET' request 
   * in order to retrieve all available loans
   * for the borrower to check out.
   */
  ngOnInit(): void {
    this.HttpClient.get<any>(
      '/api/loans',
    { }).subscribe(resData => {
      this.loans = resData.Loans as Loan[];
    });
  }

  /**
   * Sets the value of the instance variable 'curr_loan' to the 
   * loan in the index provided within the array 'loans'. 
   * Called when a users clicks on an loan in order to load the 
   * values of the loan. 
   * 
   * @param index Index of the loan selected by the user.
   */
  loadLoanInfo(index: number): void {
    this.curr_loan = this.loans[index];
    this.monthlyPayment()
  }

  /**
   * This method sends an http 'POST' to the '/api/create-offer' 
   * route with the original loan parameters in order to create
   * an offer with identical parameters to the original loan. 
   */
  requestLoan() {
    this.HttpClient.post<any>(
      '/api/create-offer',
      {
        loan_id: this.curr_loan.loan_id,
        loan_amount: this.curr_loan.amount,
        interest: this.curr_loan.interest,
        time_frame:  this.curr_loan.months,
        platform: this.curr_loan.platform, 
        borrower_id:  this.authService.user.getValue()!.id,
        lender_id: this.curr_loan.lender
      }
      ).subscribe(resData => {
        if (resData.Status == 'Edited'){
          this.notificationService.insert_nofitication(Number(this.authService.user_id), 13); 
          this.notificationService.insert_nofitication(this.curr_loan.lender, 6); 
        }
        else{
          this.notificationService.insert_nofitication(Number(this.authService.user_id), 12); 
          this.notificationService.insert_nofitication(this.curr_loan.lender, 14); 
        }
        this.router.navigate(['/borrower']);
    });
  }

  /**
   * Calculates the monthly repayment based on the 
   * loan clicked by the borrower. 
   */
  monthlyPayment() {
    this.curr_loan.monthly_repayment = (((this.curr_loan.interest) / 12) * this.curr_loan.amount) / (1 - (1 + ((this.curr_loan.interest) / 12)) ** (-this.curr_loan.months))
  }

}

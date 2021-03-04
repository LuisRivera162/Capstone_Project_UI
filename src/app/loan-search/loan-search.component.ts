import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

interface LoanResponseData {
  Loans: {'interest': number, 
          'accepted': boolean, 
          'loan_amount': number,
          'loan_id': number,
          'time_frame': number,
          'user_id': number
          }[];
}

@Component({
  selector: 'app-loan-search',
  templateUrl: './loan-search.component.html',
  styleUrls: ['./loan-search.component.css']
})
export class LoanSearchComponent implements OnInit {

  loans: {'interest': number, 
          'accepted': boolean, 
          'loan_amount': number,
          'loan_id': number,
          'time_frame': number,
          'user_id': number
          }[] = []; 

  curr_loan : {'interest': number, 
              'accepted': boolean, 
              'loan_amount': number,
              'loan_id': number,
              'time_frame': number,
              'user_id': number
              } = {
                'interest': 0, 
                'accepted': false, 
                'loan_amount': 0,
                'loan_id': 0,
                'time_frame': 0,
                'user_id': 0
              };

  constructor(
      private authService: AuthService, 
      private router: Router,
      private HttpClient: HttpClient
    ) {}

  ngOnInit(): void {
    this.HttpClient.get<LoanResponseData>('/api/loans').subscribe(resData => {
      this.loans = resData.Loans;
    });
  }

  loadLoanInfo(index: number): void{
    this.curr_loan = this.loans[index]; 
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

interface LoanResponseData {
  Loans: {'interest': number, 
          'accepted': boolean, 
          'loan_amount': number,
          'loan_id': number,
          'time_frame': Date,
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
          'time_frame': Date,
          'user_id': number
          }[] = []; 

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



}

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';

interface LoanResponseData {
  
  Loans: {'username': string,
          'interest': number, 
          'accepted': boolean, 
          'loan_amount': number,
          'loan_id': number,
          'time_frame': Date,
          'user_id': number
          }[];
}

@Component({
  selector: 'app-active-loans',
  templateUrl: './active-loans.component.html',
  styleUrls: ['./active-loans.component.css']
})
export class ActiveLoansComponent implements OnInit {

  loans: {'username': string,
          'interest': number, 
          'accepted': boolean, 
          'loan_amount': number,
          'loan_id': number,
          'time_frame': Date,
          'user_id': number
          }[] = []; 
    
  user_id = this.authService.user.getValue()!.id;  
  isLoading = false;


  constructor(
    private authService: AuthService, 
    private router: Router,
    private HttpClient: HttpClient
  ) {}

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

}

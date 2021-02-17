import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActiveLoansComponent } from '../active-loans.component';

interface LoanResponseData {
  
  Loan: { 'username': string,
          'interest': number, 
          'accepted': boolean, 
          'loan_amount': number,
          'loan_id': number,
          'time_frame': Date,
          'user_id': number
          };
}

@Component({
  selector: 'app-loan-info',
  templateUrl: './loan-info.component.html',
  styleUrls: ['./loan-info.component.css']
})
export class LoanInfoComponent implements OnInit, OnDestroy {
  user_id: number | String = this.authService.user.getValue()!.id;  
  loan_id: number | String = this.activatedroute.snapshot.paramMap.get('loan_id')!;
  interest: number | String = this.activatedroute.snapshot.paramMap.get('interest')!;
  loan_amount: number | String = this.activatedroute.snapshot.paramMap.get('loan_amount')!;
  time_frame: Date | String = this.activatedroute.snapshot.paramMap.get('time_frame')!;
  username: String = this.activatedroute.snapshot.paramMap.get('username')!;
  isMyLoan = false; 
  
  constructor(
    private authService: AuthService, 
    private router: Router,
    private HttpClient: HttpClient,
    private activatedroute: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
    this.isMyLoan = false;
  }

  ngOnInit(): void {
    const params = new HttpParams().append('loan_id', this.loan_id.toString())
    .append('user_id', this.user_id.toString());

    if (this.loan_id){
      this.HttpClient.get<LoanResponseData>(
        '/api/user-loan',
        {
          params
        }
        ).subscribe(resData => {
        this.loan_id = resData.Loan.loan_id;
        this.interest = resData.Loan.interest * 100;
        this.loan_amount = resData.Loan.loan_amount;
        this.time_frame = resData.Loan.time_frame;
        this.username = resData.Loan.username;

        if(this.user_id === resData.Loan.user_id){
          this.isMyLoan = true;
        }
      });
    }
  }

  GoBack(): void {
    console.log(this.router.url);
    let url = this.router.url;

    if(url.startsWith('/search')){
      this.router.navigate(['/search']);
    }
    else if(url.startsWith('/active-loans')){
      this.router.navigate(['/active-loans']);
    }
  }

}

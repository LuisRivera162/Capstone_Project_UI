import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActiveLoansComponent } from '../active-loans.component';
import { NgForm } from '@angular/forms';

interface LoanResponseData {
  
  Loan: { 'username': string,
          'interest': number, 
          'accepted': boolean, 
          'amount': number,
          'loan_id': number,
          'months': Date,
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
  loan_amount: number | String = this.activatedroute.snapshot.paramMap.get('amount')!;
  time_frame: Date | String = this.activatedroute.snapshot.paramMap.get('months')!;
  username: String = this.activatedroute.snapshot.paramMap.get('username')!;
  isMyLoan = false; 
  editMode = false; 
  error = "";
  
  constructor(
    private authService: AuthService, 
    private router: Router,
    private HttpClient: HttpClient,
    private activatedroute: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
    this.isMyLoan = false;
    this.editMode = false; 
  }

  ngOnInit(): void {
    const params = new HttpParams().append('loan_id', this.loan_id.toString());

    if (this.loan_id){
      this.HttpClient.get<LoanResponseData>(
        '/api/user-loan',
        {
          params
        }
        ).subscribe(resData => {
        this.loan_id = resData.Loan.loan_id;
        this.interest = resData.Loan.interest * 100;
        this.loan_amount = resData.Loan.amount;
        this.time_frame = resData.Loan.months;
        this.username = resData.Loan.username;
        
        if(this.user_id === resData.Loan.user_id){
          this.isMyLoan = true;
        }
      });
    }
  }

  goBack(): void {
    console.log(this.router.url);
    let url = this.router.url;

    if(url.startsWith('/search')){
      this.router.navigate(['/search']);
    }
    else if(url.startsWith('/active-loans')){
      this.router.navigate(['/active-loans']);
    }
  }

  onSubmit(form: NgForm){
  
    if (!form.valid){
      this.error = "Form is not valid, make sure you fill all fields."
      return;
    }

    this.error = "null"; 
    
    let loan_amount = form.value.loan_amount;
    let interest = form.value.interest;
    let time_frame = form.value.time_frame;
    let platform = form.value.platform;
  
    this.HttpClient.put(
      '/api/user-loan',
      {loan_amount: loan_amount, interest: interest, time_frame: time_frame,
        platform: platform, loan_id: this.loan_id}
    ).subscribe();

    this.goBack();

  }

}

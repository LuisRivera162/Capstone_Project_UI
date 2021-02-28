import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-create-loan',
  templateUrl: './create-loan.component.html',
  styleUrls: ['./create-loan.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class CreateLoanComponent implements OnInit {

  error: string = "null";

  constructor(
    private authService: AuthService, 
    private router: Router,
    private HttpClient: HttpClient
    ) { }

  ngOnInit(): void {
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
    let user_data: {
      email: string;
      id: string;
    } = JSON.parse(localStorage.getItem('userData') || '{}');
    if(!user_data.email && !user_data.id){
      return; 
    }

    this.router.navigate(['/search']);

    return this.HttpClient.post(
      '/api/create-loan',
      {loan_amount: loan_amount, interest: interest, time_frame: time_frame,
      platform: platform, user_id: user_data.id}).subscribe();

    
  }

}

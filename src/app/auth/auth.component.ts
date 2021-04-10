import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router';
import { AuthService } from './auth.service'
import {HttpClient, HttpParams} from '@angular/common/http';

interface ResultData {
  'Result1': string
  'Result2': string
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})

export class AuthComponent implements OnInit {

  error: string = "null";
  check: string = "True";
  isLoading = false;
  isLoginMode = false;
  lender = false;
  loginStyle = "440px"
  errorOnUsername = false
  errorOnEmail = false
  errorOnLogin = false
  errorOnRegister = false

  constructor(
    private authService: AuthService,
    private router: Router,
    private HttpClient: HttpClient
  ) {}

  onSwitchMode(mode: boolean){
    this.isLoginMode = mode;
    this.loginStyle = mode ? "750px" : "440px";
  }

  check_email(email: string, password: any, age: any, first_name: any, last_name: any, conf_password: string, username: any, phone: any){
    const params = new HttpParams().append('email', email).append("username",username);
    this.errorOnEmail = false
    this.errorOnUsername = false
    this.HttpClient.get<ResultData>(
      '/api/check-emails_user',
      {
        params
      }
    ).subscribe(resData => {
      this.check = ((resData.Result1) || (resData.Result2))
      console.log(resData)
      if(!this.check){
        this.sign_up(email,password,age,first_name,last_name,conf_password,username,phone)
      }else{
        if (resData.Result1){
          console.log("cant register this user as the email already exist")
          this.errorOnEmail = true
        }
        if (resData.Result2) {
          console.log("cant register this user as the username already exist")
          this.errorOnUsername = true
        }
      }
    });
  }

  onSubmit(form: NgForm){

    if (!form.valid){
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    const age = form.value.age;
    const first_name = form.value.first_name;
    const last_name = form.value.last_name;
    const conf_password = form.value.conf_password;
    const username = form.value.username;
    const phone = form.value.phone;
    this.isLoading = true;

    if (this.isLoginMode){
      this.check_email(email,password,age,first_name,last_name,conf_password,username,phone)
    }
    else{
      this.errorOnLogin = false
      this.authService.login(email, password).subscribe(
        resData => {
          this.isLoading = false;
          this.error = "null";
          if(resData.lender){
            this.router.navigate(['/lender']);
          }else{
            this.router.navigate(['/borrower']);
          }
        },
        errorRes => {
          console.log(errorRes);
          this.errorOnLogin = true
          this.isLoading = false;
          this.error = "The username or password entered is incorrect.";
          // need to check where in the response is the message sent from the back end
        }
      );
    }
    // form.reset();
  }

  ngOnInit(): void {
    window.scrollTo(0,0)
  }

  onItemChange(target: boolean) {
    this.lender = target
  }

  private sign_up(email: any, password: any, age: any, first_name: any, last_name: any, conf_password: string, username: any, phone: any) {
    this.errorOnRegister = false;
    this.authService.signUp(username, first_name, last_name, email, password, conf_password, age, phone, this.lender).subscribe(
      resData => {
        if (resData.status == 'failure'){
          this.errorOnRegister = true
          return
        }
        this.isLoading = false;
        this.error = "null";
        if(this.lender){
          this.router.navigate(['/lender']);
        }else{
          this.router.navigate(['/borrower']);
        }
      },
      errorRes => {
        console.log(errorRes);
        this.isLoading = false;
        this.error = "An error has occured.";
      }
    );
  }
}

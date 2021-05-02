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

  constructor(
    private authService: AuthService,
    private router: Router,
    private HttpClient: HttpClient
  ) {}

  /**
   * 
   * Used in order to dynamically change the login component height due 
   * to the amount of fields in each form. 
   * 
   * @param mode The mode it is in, true if in the register interface,
   * false if in the login interface. 
   */
  onSwitchMode(mode: boolean){
    this.isLoginMode = mode;
  }

  /**
   * 
   * Method used in order to confirm if the credentials upon register 
   * are valid. In the case a user email or username already exists,
   * it is considered invalid. 
   * 
   * @param email User email
   * @param password User password
   * @param age User age
   * @param first_name User first name
   * @param last_name User last name
   * @param conf_password User confirmed password
   * @param username User username
   * @param phone User phone
   */
  check_email(email: string, password: any, age: any, first_name: any, last_name: any, conf_password: string, username: any, phone: any){
    const params = new HttpParams().append('email', email).append("username",username);
    this.HttpClient.get<ResultData>(
      '/api/check-emails-user',
      {
        params
      }
    ).subscribe(resData => {
      this.check = ((resData.Result1) || (resData.Result2))
      if(!this.check){
        this.sign_up(email,password,age,first_name,last_name,conf_password,username,phone)
      }else{
        if (resData.Result1){
          console.log("Cannot register this user as the email already exist")
        }
        if (resData.Result2) {
          console.log("Cannot register this user as the username already exist")
        }
      }
    });
  }

  /**
   * 
   * On submit method when users sends in the login form,
   * detects valid form, if correct sends a login 
   * request to the authentification 
   * service component. 
   * 
   * @param form User submitted form
   * @returns Null if the form is not valid. 
   */
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
          this.isLoading = false;
          this.error = "The username or password entered is incorrect.";
          // need to check where in the response is the message sent from the back end
        }
      );
    }
    form.reset();
  }

  /**
   * Initial code ran when component is loaded. 
   * In this case, scrolls the page to the top.
   */
  ngOnInit(): void {
    window.scrollTo(0,0)
  }

  /**
   * 
   * Method in order to choose if a user wants to be a lender or a borrower, 
   * within the register page. 
   * 
   * @param target True in order to check for lender, false for borrower.
   * 
   */
  onItemChange(target: boolean) {
    this.lender = target
  }

  /**
   * 
   * Method in order to sign up in the application, sends the form 
   * credentials to the authentication service component. 
   * 
   * @param email User email
   * @param password User password
   * @param age User age
   * @param first_name User first name
   * @param last_name User last name
   * @param conf_password User confirmed password
   * @param username User username
   * @param phone User phone
   */
  private sign_up(email: any, password: any, age: any, first_name: any, last_name: any, conf_password: string, username: any, phone: any) {
    this.authService.signUp(username, first_name, last_name, email, password, conf_password, age, phone, this.lender).subscribe(
      resData => {
        if (resData.status == 'failure'){
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

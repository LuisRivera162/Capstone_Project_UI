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
    this.error = 'null';
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

    if (!this.isLoginMode){
      this.authService.login(email, password).subscribe(
        resData => {
          if(resData.Error){
            this.error = resData.Error;
          }
          else {
            this.isLoading = false;
            this.error = "null";
            if(resData.lender){
              this.router.navigate(['/lender']);
            }else{
              this.router.navigate(['/borrower']);
            }
          }
        },
        errorRes => {
          this.isLoading = false;
          this.error = "The email or password entered is incorrect.";
        }
      );
    }
    else {
      this.authService.signUp(username, first_name, last_name, email, password,
        conf_password, age, phone, this.lender).subscribe(
          resData => {
            if(resData.Error){
              this.error = resData.Error;
            }
            else{
              this.isLoading = false;
              this.error = "null";
              if(resData.lender){
                this.router.navigate(['/lender']);
              }else{
                this.router.navigate(['/borrower']);
              }
            }
          },
          errorRes => {
            this.isLoading = false;
            this.error = errorRes.error;
          }
        );
    }
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
}

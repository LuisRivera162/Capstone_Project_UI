import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router';
import { AuthService } from './auth.service'


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  error: string = "null";
  isLoading = false;
  isLoginMode = true;

  constructor(
    private authService: AuthService, 
    private router: Router
    ) {}

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
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

    if (!this.isLoginMode){
      this.authService.signUp(username, first_name, last_name, email, password, conf_password, age, phone).subscribe(
        resData => {
          console.log(resData);
          this.isLoading = false;
          this.error = "null"; 
          this.router.navigate(['/home']);
        },
        errorRes => {
          console.log(errorRes);
          this.isLoading = false;
          this.error = "An error has occured.";
        }
      );
    }
    else{
      this.authService.login(email, password).subscribe(
        resData => {
          console.log(resData);
          this.isLoading = false;
          this.error = "null"; 
          this.router.navigate(['/home']);
        },
        errorRes => {
          console.log(errorRes);
          this.isLoading = false;
          this.error = "The username or password entered is incorrect.";
          // need to check where in the response is the message sent from the back end
        }
      );
    }
    // form.reset();
  }

  ngOnInit(): void {
  }

}

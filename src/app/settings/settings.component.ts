import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";
import {HttpClient, HttpParams} from '@angular/common/http';
import {NgForm} from "@angular/forms";
import {User} from "../auth/user.model";

interface UserResponseData {
  'user_id': number
  'username': string
  'first_name': string
  'last_name': string
  'email': string
  'age': string
  'phone': string
}

interface ResultData {
  'Result1': string
  'Result2': string
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {

  check: string = "True";

  constructor(
    private authService: AuthService,
    private router: Router,
    private HttpClient: HttpClient
  ) { }

  user_id = this.authService.user.getValue()!.id;
  user_email = this.authService.user.getValue()!.email;
  username = ""
  firstname = ""
  lastname = ""
  age = ""
  phone = ""

  ngOnInit(): void {
    const params = new HttpParams().append('user_id', this.user_id);

    this.HttpClient.get<UserResponseData>(
      '/api/user',
      {
        params
      }
    ).subscribe(resData => {
      console.log(resData)
      this.username = resData.username
      this.user_email = resData.email
      this.firstname = resData.first_name
      this.lastname = resData.last_name
      this.age = resData.age
      this.phone = resData.phone
    });
  }

  onSaveChanges(form: NgForm, type: any) {
    let email = form.value.email;
    let username = form.value.username;
    let firstname = form.value.firstname;
    let lastname = form.value.lastname;
    let phone = form.value.phone;

    if (type == 'profile'){
      const params = new HttpParams().append('email', email).append("username", username);
      this.HttpClient.get<ResultData>(
        '/api/check-emails_user',
        {
          params
        }
      ).subscribe(resData => {
        this.check = ((resData.Result1) || (resData.Result2))

        if(!this.check){
          this.updateUser(username,email,firstname,lastname, this.phone)
        }else{
          if (resData.Result1){
            console.log("cant update this user as the email already exist")
            if (!resData.Result2){
              this.updateUser(username,this.authService.user.getValue()!.email,firstname,lastname,phone)
              this.username = username
            }
          }
          if (resData.Result2) {
            console.log("cant update this user as the username already exist")
            if (!resData.Result1){
              this.updateUser(this.username,email,firstname,lastname,phone)
              this.user_email = email
            }
          }
        }
      });

    }else if (type == 'password'){

    }else {

    }

  }

  updateUser(username:string, email:string, first_name:string, last_name:string, phone: string){
    this.HttpClient.put(
      '/api/edituser',
      {user_id: this.user_id, username: username, email: email, first_name: first_name, last_name : last_name, phone: phone}
    ).subscribe();
    const user = new User(
      email,
      this.authService.user.getValue()!.id,
      this.authService.user.getValue()!.wallet,
      this.authService.user.getValue()!.lender
    );
    localStorage.setItem('userData', JSON.stringify(user));
    this.user_email = email
  }

}

import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private HttpClient: HttpClient
  ) { }

  check: string = "True";
  user_id = this.authService.user.getValue()!.id;
  user_email = this.authService.user.getValue()!.email;
  username = ""
  firstname = ""
  lastname = ""
  age = ""
  phone = ""
  editMode = false

  ngOnInit(): void {

    const params = new HttpParams().append('user_id', this.user_id);

    this.HttpClient.get<UserResponseData>(
      '/api/user',
      {
        params
      }
    ).subscribe(resData => {
      this.username = resData.username
      this.firstname = resData.first_name
      this.lastname = resData.last_name
      this.age = resData.age
      this.phone = resData.phone
    });
  }


  onSaveProfile(form: NgForm){
    let email = form.value.email;
    let needToCheckEmail = true
    if(email.empty){
      email = this.user_email
      needToCheckEmail = false
    }else{
      needToCheckEmail = true
    }

    let first_name = form.value.first_name;
    if(first_name.empty){
      first_name = this.firstname
    }

    let last_name = form.value.last_name;
    if(last_name.empty){
      last_name = this.lastname
    }

    let username = form.value.username;
    if(username.empty){
      username = this.username
    }

    let phone = form.value.phone;
    if(phone.empty){
      phone = this.phone
    }

    if(needToCheckEmail){
      const params = new HttpParams().append('email', email).append("username",username);
      this.HttpClient.get<ResultData>(
        '/api/check-emails_user',
        {
          params
        }
      ).subscribe(resData => {
        console.log(resData)
        this.check = ((resData.Result1) || (resData.Result2))

        if(!this.check){
          this.updateUser(username,email,first_name,last_name,phone)
          this.editMode = false

        }else{
          if (resData.Result1){
            console.log("cant update this user as the email already exist")
            if (!resData.Result2){
              this.updateUser(username,this.authService.user.getValue()!.email,first_name,last_name,phone)
              this.username = username
            }
          }
          if (resData.Result2){
            if (!resData.Result1){
              this.updateUser(this.username,email,first_name,last_name,phone)
              this.user_email = email
            }
            console.log("cant update this user as the username already exist")
          }

        }
      });
    }else{
      this.updateUser(username,email,first_name,last_name,phone)
      this.editMode = false
    }

  }

  updateUser(username:string, email:string, first_name:string, last_name:string, phone:string){
    this.HttpClient.put(
      '/api/edituser',
      {user_id: this.user_id, username: username, email: email, first_name: first_name, last_name : last_name, phone : phone}
    ).subscribe();
    const user = new User(
      email,
      this.authService.user.getValue()!.id,
      this.authService.user.getValue()!.wallet,
      this.authService.user.getValue()!.lender
    );
    localStorage.setItem('userData', JSON.stringify(user));
  }

}

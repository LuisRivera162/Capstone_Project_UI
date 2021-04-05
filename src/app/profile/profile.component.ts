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

interface ResponseInterface {
  'email': number
  'localId': string
  'status': string

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

  user_id = this.authService.user.getValue()!.id;
  passwordError = false
  passwordChanged = false
  check: string = "True";
  email = this.authService.user.getValue()!.email;
  username = ""
  firstname = ""
  lastname = ""
  age = ""
  phone = ""
  editMode = false
  errorOnEmail = false
  errorOnUsername = false

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
      this.email = resData.email
    });
  }

  onSaveChanges(form: NgForm) {
    let user_id = this.user_id
    let email = form.value.email;
    let phone = form.value.phone;
    let old_password = form.value.password;
    let new_password = form.value.newpass;
    let newpass_conf = form.value.newpass_conf;
    this.passwordError = false
    this.passwordChanged = false
    if (new_password != newpass_conf){
      this.passwordError = true
      console.log("not matching")
    }else{
      console.log("matching")

      this.HttpClient.put<ResponseInterface>(
        '/api/editpass',
        {user_id: user_id, email: this.email, old_password : old_password, new_password: new_password }
      ).subscribe(resData => {
        console.log(resData.status)
        if (resData.status == "fail"){
          this.passwordError = true
        }else if (resData.status == "success"){
          this.passwordChanged = true

        }
      });
    }


  }

  onSaveProfile(form: NgForm){
    this.errorOnEmail = false;
    this.errorOnUsername = false;
    let email = form.value.email;
    let needToCheckEmail = true;
    if(email.empty){
      email = this.email
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
        this.check = ((resData.Result1) || (resData.Result2))

        if(!this.check){
          this.updateUser(username,email,first_name,last_name,phone)
          this.editMode = false

        }else{
          if (resData.Result1){

            console.log("cant update this user as the email already exist")
            this.errorOnEmail = true
            if (!resData.Result2){
              this.updateUser(username,this.email,first_name,last_name,phone)
              this.username = username
            }

          }
          if (resData.Result2){
            console.log("cant update this user as the username already exist")
            this.errorOnUsername = true
            if (!resData.Result1){
              this.updateUser(this.username,email,first_name,last_name,phone)
              this.email = email
            }
          }
          this.editMode = false

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

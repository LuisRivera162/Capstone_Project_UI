import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";
import {HttpClient, HttpParams} from '@angular/common/http';
import {NgForm} from "@angular/forms";

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


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private HttpClient: HttpClient
  ) { }

  user_id = this.authService.user.getValue()!.id;
  email = ""
  age = ""
  phone = ""
  passwordError = false
  passwordChanged = false

  ngOnInit(): void {
    const params = new HttpParams().append('user_id', this.user_id);

    this.HttpClient.get<UserResponseData>(
      '/api/user',
      {
        params
      }
    ).subscribe(resData => {
      this.email = resData.email
      this.age = resData.age
      this.phone = resData.phone
    });
  }

  onSaveChanges(form: NgForm, type: any) {
    let user_id = this.user_id
    let email = form.value.email;
    let phone = form.value.phone;
    let old_password = form.value.password;
    let new_password = form.value.newpass;
    let newpass_conf = form.value.newpass_conf;

    if (type == 'profile'){

    }else if (type == 'password'){
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
    }else {

    }

  }

}

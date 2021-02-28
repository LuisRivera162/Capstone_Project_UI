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
    if(email.empty){
      email = this.user_email
    }

    let first_name = form.value.first_name;
    console.log(first_name)
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
    this.editMode = false
    this.HttpClient.put(
      '/api/edituser',
      {user_id: this.user_id, username: username, email: email, first_name: first_name, last_name : last_name, phone : phone}
    ).subscribe();
    const user = new User(
      email,
      this.authService.user.getValue()!.id,
      this.authService.user.getValue()!.lender
    );
    localStorage.setItem('userData', JSON.stringify(user));
    // window.location.reload()
  }

}

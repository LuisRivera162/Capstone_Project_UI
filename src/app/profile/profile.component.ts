import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

interface UserResponseData {
  user: {
    'user_id': number,
    'username': string,
    'first_name': string,
    'last_name': string,
    'email': string,
    'age': string
  }[];
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: {
  'user_id': number,
  'username': string,
  'first_name': string,
  'last_name': string,
  'email': string,
  'age': string
}[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private HttpClient: HttpClient
  ) { }

  user_id = this.authService.user.getValue()!.id;
  user_email = this.authService.user.getValue()!.email;

  ngOnInit(): void {

    let headers = new HttpHeaders().append('header', 'value');
    const params = new HttpParams().append('user_id', this.user_id);

    this.HttpClient.get<UserResponseData>(
      '/api/user',
      {
        headers, params
      }
    ).subscribe(resData => {
      this.user = resData.user;
    });
    console.log(this.user)
  }



}

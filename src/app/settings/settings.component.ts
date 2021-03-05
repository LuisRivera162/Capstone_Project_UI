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
      this.username = resData.username
      this.firstname = resData.first_name
      this.lastname = resData.last_name
      this.age = resData.age
      this.phone = resData.phone
    });
  }

  onSaveChanges(form: NgForm, type: any) {

    if (type == 'profile'){

    }else if (type == 'password'){

    }else {

    }

  }
}

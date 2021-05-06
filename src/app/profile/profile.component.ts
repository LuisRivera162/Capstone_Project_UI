import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";
import {HttpClient, HttpParams} from '@angular/common/http';
import {NgForm} from "@angular/forms";
import {User} from "../auth/user.model";
import { WSAEINVALIDPROCTABLE } from 'constants';

interface UserResponseData {
  'user_id': number
  'username': string
  'first_name': string
  'last_name': string
  'email': string
  'age': string
  'phone': string,
  'wallet': string
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
  passwordError = false;
  passwordChanged = false;
  check: string = "True";
  email = this.authService.user.getValue()!.email;
  username = "";
  firstname = "";
  lastname = "";
  age = "";
  phone = "";
  wallet = "";
  editMode = false;
  error = 'null';
  

  /**
   * Initial code ran when component is loaded. 
   * In this case, sends an http 'GET' request 
   * to the route '/api/user' in order to 
   * retrieve from the server all the user
   * information. 
   */
  ngOnInit(): void {
    const params = new HttpParams().append('user_id', this.user_id);

    this.HttpClient.get<UserResponseData>(
      '/api/user',
      {
        params
      }
    ).subscribe(resData => {
      this.username = resData.username;
      this.firstname = resData.first_name;
      this.lastname = resData.last_name;
      this.age = resData.age;
      this.phone = resData.phone;
      this.email = resData.email;
      this.wallet = resData.wallet;
    });
  }

  /**
   * This method is used in order to validate user credentials
   * when trying to change passwords. If successfull it will
   * send an http 'PUT' request to the route '/api/editpass'
   * with the user credentials in order to request a password
   * change. 
   * 
   * @param form The user submitted form in order to change password.
   */
  onSaveChanges(form: NgForm) {
    let user_id = this.user_id;
    let email = form.value.email;
    let phone = form.value.phone;
    let old_password = form.value.password;
    let new_password = form.value.newpass;
    let newpass_conf = form.value.newpass_conf;
    this.passwordError = false;
    this.passwordChanged = false;
    if (new_password != newpass_conf){
      this.passwordError = true;
    }else{
      this.HttpClient.put<ResponseInterface>(
        '/api/editpass',
        {user_id: user_id, email: this.email, old_password : old_password, new_password: new_password }
      ).subscribe(resData => {
        if (resData.status == "fail"){
          this.passwordError = true;
        }else if (resData.status == "success"){
          this.passwordChanged = true;
        }
      });
    }
  }

  /**
   * Verifies input form credentials in order to perform a profile
   * information change, if successful, calls the updateUser method.
   * 
   * @param form User submitted form.
   */
  onSaveProfile(form: NgForm){
    let email = form.value.email;
    if(email.empty){
      email = this.email;
    }

    let first_name = form.value.first_name;
    if(first_name.empty){
      first_name = this.firstname;
    }

    let last_name = form.value.last_name;
    if(last_name.empty){
      last_name = this.lastname;
    }

    let username = form.value.username;
    if(username.empty){
      username = this.username;
    }

    let phone = form.value.phone;
    if(phone.empty){
      phone = this.phone;
    }

    this.HttpClient.put<any>(
      '/api/edituser',
      {user_id: this.user_id, username: username, email: email, 
        first_name: first_name, last_name : last_name, phone : phone}
    ).subscribe(resData => {
      if(resData.Error){
        this.error = resData.Error; 
      }
      else{
        const user = new User(
          email,
          this.authService.user.getValue()!.id,
          this.authService.user.getValue()!.wallet,
          this.authService.user.getValue()!.lender
        );
        this.error = 'null';
        localStorage.setItem('userData', JSON.stringify(user));
        window.location.reload();
      }
    });
  }
}

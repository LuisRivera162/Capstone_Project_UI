import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { User } from './user.model';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

interface AuthResponseData {
  email: string;
  localId: string;
  status?: string;
  wallet: string;
  lender: boolean;
  Error: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<null | User>(null);
  user_id: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
    ) {}


  /**
   * 
   * Method used in order to sign up users. Sends and http 'POST' 
   * request to the back-end route '/api/register', and locally
   * stores the user object returned upon success to the browser. 
   * 
   * @param username username to submit
   * @param first_name  first_name to submit
   * @param last_name  last_name to submit
   * @param email  email to submit
   * @param password  password to submit
   * @param conf_password  conf_password to submit
   * @param age  age to submit
   * @param phone  phone to submit
   * @param lender  lender to submit
   * @returns server response from the back-end. 
   */
  signUp(username: string, first_name: string, last_name: string, email: string, password: string,
    conf_password: string, age: BigInteger, phone: string, lender: boolean) {
    return this.http.post<AuthResponseData>(
      '/api/register',
      {username: username, first_name: first_name, last_name: last_name, email: email,
        password: password, conf_password: conf_password, age: age, phone: phone, lender: lender}
      ).pipe(tap(resData => {
        if (!resData.Error){
          const user = new User(
            resData.email,
            resData.localId,
            "0x0000000000000000000000000000000000000000",
            resData.lender
            );
            this.user.next(user);
            localStorage.setItem('userData', JSON.stringify(user));
        }
      }));
  }

  /**
   * 
   * Method used in order to login users. Sends and http 'POST' 
   * request to the back-end route '/api/login', and locally
   * stores the user object returned upon success to the browser.
   * 
   * @param email email to submit
   * @param password password to submit
   * @returns server response from the back-end. 
   */
  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      '/api/login',
      {
        email: email,
        password: password,
      }
    )
    .pipe(tap(resData => {
      if (!resData.Error){
        const user = new User(
          resData.email,
          resData.localId,
          resData.wallet,
          resData.lender
          );
          this.user.next(user);
          localStorage.setItem('userData', JSON.stringify(user));
      }
    }));
  }


  /**
   * Method used in order to auto login user when 
   * user credentials are located within the browser. 
   * 
   * @returns -1, when no user credentials are found, 
   * 0 when user credentials are found within the browser. 
   */
  autoLogin(){
    const userData: {
      email: string;
      id: string;
      wallet: string;
      lender: boolean;
    } = JSON.parse(localStorage.getItem('userData') || '{}');
    if(!userData.email && !userData.id && !userData.lender){
      return -1;
    }
    const loadedUser = new User(userData.email, userData.id, userData.wallet, userData.lender);
    this.user.next(loadedUser);
    this.user_id =  this.user.getValue()!.id;
    return 0
  }

  /**
   * Removes user credentials found in the local browser 
   * upon logout. 
   */
  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);
  }
}

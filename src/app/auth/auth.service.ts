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
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<null | User>(null); 
  uid: number = -1; 

  constructor(
    private http: HttpClient,
    private router: Router
    ) {}
  
  signUp(username: string, first_name: string, last_name: string, email: string, password: string,
    conf_password: string, age: BigInteger, phone: string) {
    return this.http.post<AuthResponseData>(
      '/api/register',
      {username: username, first_name: first_name, last_name: last_name, email: email, 
        password: password, conf_password: conf_password, age: age, phone: phone}
      ).pipe(tap(resData => {
        const user = new User(
          resData.email, 
          resData.localId
          );
          this.user.next(user);
          localStorage.setItem('userData', JSON.stringify(user)); 
      }));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      '/api/login',
      {
        email: email, 
        password: password
      }
    )
    .pipe(tap(resData => {
      const user = new User(
        resData.email, 
        resData.localId
        );
        this.user.next(user);
        localStorage.setItem('userData', JSON.stringify(user)); 
    }));
  }

  autoLogin(){
    const userData: {
      email: string;
      id: string;
    } = JSON.parse(localStorage.getItem('userData') || '{}');
    if(!userData.email && !userData.id){
      return; 
    }
    const loadedUser = new User(userData.email, userData.id); 
    this.user.next(loadedUser);
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData'); 
    this.router.navigate(['/auth']);
  }
}

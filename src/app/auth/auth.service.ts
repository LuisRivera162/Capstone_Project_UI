import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface AuthResponseData {
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}
  
  signUp(username: string, first_name: string, last_name: string, email: string, password: string,
    conf_password: string, age: BigInteger) {
    return this.http.post<AuthResponseData>(
      '/api/register',
      {username: username, first_name: first_name, last_name: last_name, email: email, 
        password: password, conf_password: conf_password, age: age}
      );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      '/api/login',
      {email: email, password: password}
      );
  }
}

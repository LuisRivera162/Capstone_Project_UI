import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

interface UserResponseData {
  'lender': any
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private HttpClient: HttpClient
  ) { }

  user_type = this.authService.user.getValue()!.lender;

  ngOnInit(): void {
    console.log(this.authService.user)
    if(this.user_type){
      this.router.navigate(['/lender']);
    }else{
      this.router.navigate(['/borrower']);
    }
  }


}

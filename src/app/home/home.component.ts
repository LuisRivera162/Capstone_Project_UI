import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Location } from '@angular/common';

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
    private router: Router
  ) { }

  user_type = this.authService.user.getValue()!.lender;

  /**
   * 
   * Initial code ran when component is loaded. 
   * in this case, re-routes the user to the 
   * corresponding page, depending if the user 
   * is a lender or a borrower. 
   * 
   */
  ngOnInit(): void {
    if(this.user_type){
      this.router.navigate(['/lender']);
    }else{
      this.router.navigate(['/borrower']);
    }
  }


}

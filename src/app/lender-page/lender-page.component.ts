import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-lender-page',
  templateUrl: './lender-page.component.html',
  styleUrls: ['./lender-page.component.css']
})
export class LenderPageComponent implements OnInit {

  loan_num = 0;
  user_id = this.authService.user.getValue()!.id; 

  constructor(
    private authService: AuthService, 
    private router: Router,
    private HttpClient: HttpClient
  ) { }

  ngOnInit(): void {

    const params = new HttpParams().append('user_id', this.user_id);
    this.HttpClient.get<number>(
      '/api/user-loan-count',
      {
        params
      }
      ).subscribe(resData => {
      this.loan_num = resData;
    });


  }

}

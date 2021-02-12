import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-lender-page',
  templateUrl: './lender-page.component.html',
  styleUrls: ['./lender-page.component.css']
})
export class LenderPageComponent implements OnInit {

  constructor(
    private authService: AuthService, 
    private router: Router
  ) { }

  ngOnInit(): void {
  }

}

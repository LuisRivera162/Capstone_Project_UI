import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import {Router} from "@angular/router";
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router,
              private location: Location
  ) {}

  ngOnInit() {
    let login = this.authService.autoLogin();
    if (this.location.path() == '/' && login == 0){
      this.router.navigate(['/home']);
    }
    else if (login != 0){
      this.router.navigate(['/entry']);
    }
  }

}

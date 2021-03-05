import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService,
  private router: Router) {}

  ngOnInit() {
    this.router.navigate(['/entry']);
    if (this.authService.autoLogin() == 0){
      this.router.navigate(['/home']);

    }
  }

}

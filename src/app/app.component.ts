import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from "@angular/router";
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  // @HostListener('window:beforeunload', ['$event'])
  // beforeunloadHandler($event: any) {
  //   $event.preventDefault();
  //   $event.returnValue = "Unsaved modifications";
  // }


  constructor(private authService: AuthService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    let login = this.authService.autoLogin();
    if (this.location.path() == '/' || this.location.path() == '' && login == 0) {
      this.router.navigate(['/home']);
    }
    else if (login != 0) {
      if (this.location.path() == '/investor') {
        this.router.navigate(['/investor'])
      } else if (this.location.path() != '/auth') {
        this.router.navigate(['/entry']);
      }

    }
  }

}

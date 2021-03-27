import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit, OnDestroy {
  isAuthenticated = false; 
  notifications:any = [] as any; 
  
  private userSub!: Subscription; 
  userData: {
    email: string;
    id: string;
    lender: boolean;
  } = JSON.parse(localStorage.getItem('userData') || '{}');

  lender = this.userData.lender;

  constructor(private authService: AuthService,
              public notificationService: NotificationComponent) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    }); 
    this.load_notifications()
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe(); 
  }

  onLogout() {
    this.authService.logout(); 
    this.isAuthenticated = false; 
  }

  load_notifications(){
    this.notifications = this.notificationService.get_notifications(); 
  }
  
  dateAsYYYYMMDDHHNNSS(date: Date): string {
    const datepipe: DatePipe = new DatePipe('en-US');
    let formattedDate = datepipe.transform(date, 'M/d/yy - h:mm a');
    return String(formattedDate);
  }
  
  leftpad(val: any, resultLength = 2, leftpadChar = '0'): string {
    return (String(leftpadChar).repeat(resultLength)
          + String(val)).slice(String(val).length);
  }


}

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
              private notificationService: NotificationComponent) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    }); 
    this.notifications = this.notificationService.get_notifications(); 
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

}

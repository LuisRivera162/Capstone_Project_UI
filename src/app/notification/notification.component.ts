import { Component, Injectable, OnInit } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";
import { HttpClient, HttpParams } from '@angular/common/http';

interface Notification {
  notification_id: number,
  user_id: number,
  message: string,
  created_on: Date,
  dismissed: boolean
};

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class NotificationComponent implements OnInit {
  
  // Notification Types: 
  // 1. Loan Created 
  // 2. Accepted 
  // 3. Loan Started 
  // 4. Payment Sent 
  // 5. Payment Validated 
  // 6. Loan Closed/Withdrawn
  notificationMessage = [
    'Your Loan was successfully created!',
    'Your Offer was successfully created!',
    'One of your loans was accepted by a Borrower!',
    'One of your offers was accepted by a Lender!',
    'Your Loan term has now started!',
    'Your Offer term has now started!',
    'Your payment was sent and waiting for validation.',
    'Your payment was successfully validated!',
    'You have a new pending offer!',
    'A payment was made towards one of your loan terms!',
    'Your Loan has been closed.',
    'Your Loan has been withdrawn.'
  ]; 

  notifications: Notification[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private HttpClient: HttpClient
  ) { }

  ngOnInit(): void {
  }

  get_notifications(){
    const params = new HttpParams().append('user_id', this.authService.user.getValue()!.id);
    this.HttpClient.get<any>(
      '/api/notifications',
      {
        params
      }
    ).subscribe(resData => {
      this.notifications = resData.Notifications; 
    });
    return this.notifications;
  }

  insert_nofitication(notificationType: String){



  }

}

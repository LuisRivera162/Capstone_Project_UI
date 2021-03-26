import { Component, Injectable, OnInit } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";
import { HttpClient, HttpParams } from '@angular/common/http';

interface Notification {
  notification_id: number,
  user_id: number,
  message: string,
  created_on: Date,
  dismissed: boolean,
  notification_type: number
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
    'Your loan was successfully created!', // 0
    'Your offer was successfully created!', //1
    'One of your offers was rejected.', //2
    'One of your loans was accepted by a Borrower!', //3
    'One of your offers was accepted by a Lender!', //4
    'Your Loan term has now started!', //5
    'Your Offer was successfully withdrawn!', //6
    'Your Offer was successfully edited!', //7 
    'Your Loan was successfully withdrawn!', //8
    'Your payment was sent and waiting for validation.',
    'Your payment was successfully validated!',
    'Your loan request has been sent to the lender!',
    'You have a new pending offer!',
    'A payment was made towards one of your loan terms!',
    'Your Loan has been closed.'
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

  insert_nofitication(userID: string, notificationType: number){
    console.log(userID);
    console.log(notificationType);
    return this.HttpClient.post(
    '/api/notifications',
    {
      user_id: userID, 
      message: this.notificationMessage[notificationType], 
      notification_type: notificationType
    }).subscribe((resData) => {
      
    });

  }

}

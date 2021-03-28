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
    'One of your offers was rejected by a lender.',   //1
    'One of your loans was accepted by a Borrower!',  //2
    'One of your offers was accepted by a Lender!',   //3
    'Your loan term has now started!',                //4 
    'Your payment was successfully validated!',       //5
    'You have a new pending offer!',                  //6
    'One of your pending offers has changed.',        //7
    'Your loan has been closed.'                      //8
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

  insert_nofitication(userID: number, notificationType: number){
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

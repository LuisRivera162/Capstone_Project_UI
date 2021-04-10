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
  notificationMessage = [
    'One of your offers was rejected by a lender.',   //0
    'One of your loans was accepted by a Borrower!',  //1
    'One of your offers was accepted by a Lender!',   //2
    'Your loan term has now started!',                //3 
    'Your payment was successfully validated!',       //4
    'You have a new pending offer!',                  //5
    'One of your pending offers has changed.',        //6
    'Your loan has been closed.',                     //7
    'A loan you made an offer to has changed!'        //8
  ]; 

  notifications: Notification[] = [];
  notificationCount = 0; 

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
      this.notificationCount = this.notifications.length;
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
      this.get_notifications()
    });

  }

}

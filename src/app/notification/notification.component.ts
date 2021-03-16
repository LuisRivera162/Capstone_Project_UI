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

}

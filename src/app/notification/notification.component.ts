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
    'One of your offers was rejected by a lender.',           //0
    'One of your loans was accepted by a Borrower!',          //1
    'One of your offers was accepted by a Lender!',           //2
    'Your loan term has now started!',                        //3 
    'Your payment was successfully validated!',               //4
    'You have a new pending offer!',                          //5
    'One of your pending offers has changed.',                //6
    'Your loan has been closed.',                             //7
    'A loan you made an offer to has changed!',               //8
    'Your offer was successfully withdrawn.',                 //9
    'Your loan was successfully created.',                    //10
    'Your loan was successfully withdrawn.',                  //11
    'Your offer was successfully created.',                   //12
    'Your offer was successfully edited.',                    //13
    'A new offer on one of your loans was created.',          //14
    'You have received a payment from your active lender.',   //15
    'The payment was successfully validated!',                //16
    'Your Loan term has now ended!',                          //17
    'One of your loans was completely paid by a borrower!',   //18
  ]; 

  notifications: Notification[] = [];
  notificationCount = 0; 

  constructor(
    private authService: AuthService,
    private router: Router,
    private HttpClient: HttpClient
  ) { }


  /**
   * A callback method that is invoked immediately after 
   * the default change detector has checked the directive's 
   * data-bound properties for the first time, and before any 
   * of the view or content children have been checked. It is 
   * invoked only once when the directive is instantiated.
   */
  ngOnInit(): void {
  }

  /**
   * This method sends an http 'GET' request to the route 
   * '/api/notifications' in order to retrieve all notifications
   * that belong to the logged in user. 
   * 
   * @returns An array of notifications if successfull, empty array if none found.
   */
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

  /**
   * This method sends an http 'POST' request to '/api/notifications' 
   * in order to post a new notification to the user with the 'user_id'
   * provided and with a message depending on the 'notificationType'
   * index passed.
   * 
   * @param userID User ID of the user that will receive the notification.
   * @param notificationType Index denoting the type of message to be used 
   * in the notification.
   * 
   * @returns The http response from the back-end.
   */
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

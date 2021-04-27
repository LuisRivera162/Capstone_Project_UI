import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-latest-payments',
  templateUrl: './latest-payments.component.html',
  styleUrls: ['./latest-payments.component.css']
})
export class LatestPaymentsComponent implements OnInit {

  @Input() isLender: boolean = false;

  user_id = this.authService.user.getValue()!.id;
  payments: any[] = []; 
  toValidatePayments: any[] = []; 
  activities: any[] = []; 
  
  paymentToValidate = {
    payment_id: 0,
    receiver_id: 0,
    sender_id: 0,
    lender: 0,
    borrower: 0,
    amount: 0, 
    payment_date: new Date,
    offer_id: 0,
    loan_id: 0,
    validation: 0,
    validation_hash: 0
  }

  constructor(
    private authService: AuthService, 
    private router: Router,
    private HttpClient: HttpClient,
    private notificationService: NotificationComponent
    ) { }

  /**
   * 
   * Initial code ran when component is loaded. 
   * In this case, retrieves all user payments
   * from the database and loads the http 
   * 'GET' response to the variable 'payments'. 
   * 
   */
  ngOnInit(): void {
    const params = new HttpParams().append('user_id', this.user_id);
    this.HttpClient.get<any>(
      '/api/user-payments',
      {
        params
      }
    ).subscribe(resData => {
      this.activities = resData.Payments;
      this.activities.forEach(activity => {
        if (activity.payment_id && !activity.validated && activity.validation_hash != ''){
          this.toValidatePayments.push(activity); 
        }
        if (activity.payment_id){
          this.payments.push(activity); 
        }
      });
    });
  }

  /**
   * 
   * Method used in order to determine the bootstrap 
   * class to be used when considering a payment. 
   * In this case the validation of the payment. 
   * 
   * @param validation boolean denoting the validation of the payment. 
   * @param validation_hash validation hash of the payment if any. 
   * @param sender_id User ID of the user that sent the payment.
   * @returns The corresponding bootstrap class to be used for the payment view. 
   */
  get_validation_class(validation: boolean, validation_hash: string, sender_id: number){
    if (validation == false && Number(this.authService.user_id) == sender_id){
      return "text-warning";
    }
    else if(validation && validation_hash != ""){
      return "text-success";
    }
    else {
      return "text-danger";
    }
  }

  /**
   * 
   * Used to determine the bootstrap class to be used
   * based on if the user received or sent a payment. 
   * 
   * @param receiver_id The user_id of the receiver. 
   * @returns The bootstrap class to be used. 
   */
  get_relative_payment(receiver_id: string){
    return this.user_id == receiver_id ? "mb-1 text-success" : "mb-1 text-danger"; 
  }

  /**
   * 
   * Method used in order to determine which modal to be used based 
   * on a set of variables, passed on as parameters. 
   * 
   * @param i Index of the payment clicked. 
   * @param validation Payment validated clause. 
   * @param validation_hash Payment validation hash, if any.
   * @param payment_id The payment_id of the clicked payment. 
   * @param activities Array to be taken in consideration.
   * @returns The modal to be displayed upon click. 
   * 
   */
  get_modal(i: number, validation: boolean, validation_hash: string, payment_id: number, activities: any[]){
    if (payment_id == null){
      return "";
    }
    else if (validation && validation_hash == ""){
      return "#txReceiptModal";
    }
    else if((validation && validation_hash != "") || this.activities[i].sender_id == this.authService.user_id){
      return "";
    }
    else {
      return "#validateModal";
    }
  }

  /**
   * 
   * Method used to determine the validation message based on the
   * current status of a payment. 
   * 
   * @param validation Payment validated clause. 
   * @param validation_hash Payment validation hash, if any.
   * @param sender_id User ID of the user that sent the payment.
   * @returns Validation message to be displayed. 
   */
  get_validation_message(validation: boolean, validation_hash: string, sender_id: number){
    if (validation == false && Number(this.authService.user_id) == sender_id){
      return "Waiting Validation";
    }
    else if(validation && validation_hash != ""){
      return "Validated";
    }
    else {
      return "Validation Required";
    }
  }

  /**
   * 
   * Sets the value of the instance variable 'paymentToValidate' to the 
   * payment in the index provided within the array 'payments'. 
   * Called when a users clicks on a payment in order to load the 
   * values of the payment. 
   * 
   * @param index Index of the payment selected by the user.
   * @param activities Array to be taken in consideration.
   */
  update_payment(index: number, activities: any[]){
    this.paymentToValidate = this.activities[index];
  }

}

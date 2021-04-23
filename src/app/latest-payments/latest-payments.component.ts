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

  ngOnInit(): void {
    const params = new HttpParams().append('user_id', this.user_id);
    this.HttpClient.get<any>(
      '/api/user-payments',
      {
        params
      }
    ).subscribe(resData => {
      this.payments = resData.Payments;
      console.log(this.payments);
    });
  }

  get_validation_class(validation: boolean, validation_hash: string){
    
    if (validation && validation_hash == ""){
      return "text-warning";
    }
    else if(validation && validation_hash != ""){
      return "text-success";
    }
    else {
      return "text-danger";
    }
  }

  get_relative_payment(receiver_id: string){
    return this.user_id == receiver_id ? "mb-1 text-success" : "mb-1 text-danger"; 
  }

  get_modal(i: number, validation: boolean, validation_hash: string, payment_id: number){
    if (payment_id == null){
      return "";
    }
    else if (validation && validation_hash == ""){
      return "#txReceiptModal";
    }
    else if((validation && validation_hash != "") || this.payments[i].sender_id == this.authService.user_id){
      return "";
    }
    else {
      return "#validateModal";
    }
  }

  get_validation_message(validation: boolean, validation_hash: string){
    if (validation && validation_hash == ""){
      return "Validation Pending";
    }
    else if(validation && validation_hash != ""){
      return "Validated";
    }
    else {
      return "Validation Required";
    }
  }

  update_payment(index: number){
    this.paymentToValidate = this.payments[index];
  }

}

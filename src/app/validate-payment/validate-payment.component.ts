import { HttpClient } from '@angular/common/http';
import { Component, Injectable, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-validate-payment',
  templateUrl: './validate-payment.component.html',
  styleUrls: ['./validate-payment.component.css']
})
export class ValidatePaymentComponent implements OnInit {

  error: string = "null";

  validation_in_progress = 0

  @Input() paymentToValidate = {
    payment_id: 0,
    receiver_id: 0,
  }
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private HttpClient: HttpClient,
    private notificationService: NotificationComponent
  ) { }

  validationPayload = {
    payment_id: 0,
    contractHash: "",
    evidenceHash: "",
    isvalid: false
  }

  /**
   * A callback method that is invoked immediately after the default 
   * change detector has checked the directive's data-bound properties 
   * for the first time, and before any of the view or content children 
   * have been checked. It is invoked only once when the directive is 
   * instantiated.
   */
  ngOnInit(): void {
  }

  /**
   * Main cubmission form method, called when requesting a payment validation. 
   * sends an http 'POST' request to the '/api/validate-payment' route with 
   * submitted credentials in order to post the payment, if successful it will
   * validate the payment and send a notification to the receiver, otherwise it
   * will display an error message. 
   * 
   * @param form User submitted validation form.
   * @returns Null, upon invalid form. 
   */
  onSubmit(form: NgForm) {

    if (!form.valid) {
      this.error = "Make sure you enter your evidence code, before submitting."
      return;
    }

    this.error = "null";

    let evidenceHash = form.value.evidenceHash;

    console.log(this.paymentToValidate)
    
    let user_data: {
      email: string;
      id: string;
    } = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!user_data.email && !user_data.id) {
      return;
    }

    this.validation_in_progress = 1;
    
    return this.HttpClient.post(
      '/api/validate-payment',
      {
        sender_id: user_data.id,
        payment_id: this.paymentToValidate.payment_id,
        evidenceHash: this.validationPayload.evidenceHash
      }
      ).subscribe((resData: any) => {
        if (resData.isvalid) {
          this.validationPayload.isvalid = true;
          this.notificationService.insert_nofitication(this.paymentToValidate.receiver_id, 16);
          window.location.reload();
        }
        else{
          this.error = 'Validation failed, make sure you are entering the correct Evidence Code.';
          this.validation_in_progress = 0;
        }
      });
  }

}

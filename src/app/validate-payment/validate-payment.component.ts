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

  ngOnInit(): void {
  }

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
          this.notificationService.insert_nofitication(this.paymentToValidate.receiver_id, 4);
          window.location.reload();
        }

      });
  }

}

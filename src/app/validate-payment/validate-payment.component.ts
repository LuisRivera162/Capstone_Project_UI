import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-validate-payment',
  templateUrl: './validate-payment.component.html',
  styleUrls: ['./validate-payment.component.css']
})
export class ValidatePaymentComponent implements OnInit {

  error: string = "null";
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private HttpClient: HttpClient
  ) { }

  validationPayload = {
    payment_id: 3,
    contractHash: "",
    evidenceHash: "",
    isvalid: false
  }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {

    if (!form.valid) {
      this.error = "Form is not valid, make sure you fill all fields."
      return;
    }

    this.error = "null";

    let evidenceHash = form.value.evidenceHash;

    console.log(evidenceHash);
    
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
        payment_id: this.validationPayload.payment_id,
        evidenceHash: this.validationPayload.evidenceHash
      }
      ).subscribe((resData: any) => {
        if (resData.isvalid) this.validationPayload.isvalid = true;
      });
  }

}

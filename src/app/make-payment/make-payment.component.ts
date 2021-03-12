import { HttpClient } from '@angular/common/http';
import { Component, Injectable, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

interface Loan {
  loan_id: number,
  lender: number,
  lender_eth: string,
  borrower: number,
  borrower_eth: string,
  amount: number,
  months: number,
  eth_address: string,
  interest: number,
  accepted: boolean,
  created_on: Date,
  monthly_repayment: number,
  balance: number,
  est_total_interest: number,
}

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.css']
})

export class MakePaymentComponent implements OnInit {

  error: string = "null";

  @Input() loan: Loan = {} as Loan;

  constructor(
    private authService: AuthService,
    private router: Router,
    private HttpClient: HttpClient
  ) { }

  payment = {
    amount: 0,
    date: Date.now(),
    source: 0,
    paymentNumber: 0,
    evidence: "",
    contractHash: "",
  }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {

    console.log("form sent..")

    if (!form.valid) {
      this.error = "Form is not valid, make sure you fill all fields."
      console.log(this.error)
      return;
    }

    this.error = "null";

    let user_data: {
      email: string;
      id: string;
      wallet: string;
    } = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!user_data.email && !user_data.id && !user_data.wallet) {
      return;
    }

    return this.HttpClient.post(
      '/api/payment/send',
      {
        sender: user_data.id,
        receiver: this.loan.borrower,
        sender_eth: user_data.wallet,
        receiver_eth: this.loan.borrower_eth, 
        amount: this.payment.amount,
        paymentNumber: this.payment.paymentNumber, 
        contractHash: this.payment.contractHash, 
        evidenceHash: this.payment.evidence
      }).subscribe((resData) => {
        console.log(resData)
      });
  }

}

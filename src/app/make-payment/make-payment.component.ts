import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

interface Loan {
  amount: number,
  borrower: string,
  created_on: Date,
  eth_address: string,
  interest: number,
  lender: string,
  months: number,
  balance: number,
  state: number,
  offers: any[]
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
    source: 0,
    paymentNumber: 0,
    evidence: "",
  }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {


    if (!form.valid) {
      this.error = "Form is not valid, make sure you fill all fields."
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
        sender_eth: user_data.wallet,
        amount: this.payment.amount,
        paymentNumber: this.payment.paymentNumber,
        contractHash: this.loan.eth_address,
        evidenceHash: this.payment.evidence
      }).subscribe((resData) => {
      });
  }

}

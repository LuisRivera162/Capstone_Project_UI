import { HttpClient } from '@angular/common/http';
import { Component, Injectable, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NotificationComponent } from '../notification/notification.component';

interface Loan {
  amount: number,
  borrower: number,
  created_on: Date,
  loan_id: number,
  interest: number,
  lender: number,
  months: number,
  balance: number,
  state: number,
  platform: number,
  offers: any[],
  payment_number: number,
  monthly_repayment: number
}

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.css']
})

export class MakePaymentComponent implements OnInit {

  error: string = "null";
  platform = ['Venmo', 'PayPal', 'ATH Movil'];

  @Input() loan: Loan = {} as Loan;

  constructor(
    private authService: AuthService,
    private router: Router,
    private HttpClient: HttpClient,
    private notificationService: NotificationComponent
  ) { }

  payment = {
    amount: 0,
    source: 0,
    paymentNumber: 0,
    evidence: "",
    state: 0
  }

  ngOnInit(): void {
    console.log(this.loan.platform)
  }

  reloadPage() {
    window.location.reload()
  }

  onSubmit(form: NgForm) {

    // console.log(form)

    // if (!form.valid) {
    //   this.error = "Form is not valid, make sure you fill all fields."
    //   console.log(this.error)
    //   console.log(this.loan.platform)
    //   console.log(this.loan)
    //   return;
    // }

    this.error = "null";

    let user_data: {
      email: string;
      id: number;
      wallet: string;
    } = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!user_data.email && !user_data.id && !user_data.wallet) {
      return;
    }

    console.log( ((this.loan.payment_number == 0) ? this.loan.amount : this.loan.monthly_repayment))

    this.payment.state = -1

    return this.HttpClient.post(
      '/api/send-payment',
      {
        sender_id: user_data.id,
        receiver_id: ((user_data.id == this.loan.borrower) ? this.loan.lender : this.loan.borrower),
        amount: ((this.loan.payment_number == 0) ? this.loan.amount : this.loan.monthly_repayment),
        paymentNumber: this.loan.payment_number, 
        loan_id: this.loan.loan_id, 
        evidenceHash: this.payment.evidence
      }).subscribe((resData) => {
        this.HttpClient.put<any>(
          '/api/update-loan-state',
          {
            loan_id: this.loan.loan_id,
            state: 3  
          }
        ).subscribe(resData => {
          this.payment.state = 1
        });
      });
  }

}

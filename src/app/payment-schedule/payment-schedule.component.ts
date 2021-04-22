import { Component, OnInit, Input } from '@angular/core';

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
  offers: any[],
  platform: number,
  payment_number: number,
  rcvd_interest: number,
  monthly_repayment: number
}

@Component({
  selector: 'app-payment-schedule',
  templateUrl: './payment-schedule.component.html',
  styleUrls: ['./payment-schedule.component.css']
})
export class PaymentScheduleComponent implements OnInit {

  @Input() loan: Loan = {} as Loan
  @Input() paymentTable: any[] = []

  constructor() { }

  ngOnInit(): void {}

}

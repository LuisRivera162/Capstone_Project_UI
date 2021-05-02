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

  /**
   * A callback method that is invoked immediately after 
   * the default change detector has checked the directive's 
   * data-bound properties for the first time, and before any 
   * of the view or content children have been checked. It is 
   * invoked only once when the directive is instantiated.
   */
  ngOnInit(): void {}

}

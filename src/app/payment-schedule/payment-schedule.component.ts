import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-schedule',
  templateUrl: './payment-schedule.component.html',
  styleUrls: ['./payment-schedule.component.css']
})
export class PaymentScheduleComponent implements OnInit {

  loan = {
    amount: 1000,
    balance: 0,
    interest: 3,
    months: 3,
    platform: 0,
    monthly_repayment: 0,
    est_total_interest: 0.0,
    est_yield: 0.0
  }

  payment_schedule = new Array()

  constructor() { }

  ngOnInit(): void {
    this.generateRepaymentTable()
  }

  generateRepaymentTable() {
    if (this.loan.interest <= 0 || this.loan.months < 3) return

    this.loan.est_total_interest = 0; // reset
    this.loan.monthly_repayment = 0
    this.loan.balance = 0

    this.loan.monthly_repayment = (((this.loan.interest/100) / 12) * this.loan.amount) / (1 - (1 + ((this.loan.interest/100) / 12)) ** (-this.loan.months))

    // this.loan.balance = this.loan.amount - this.loan.monthly_repayment
    this.loan.balance = this.loan.amount
    // this.loan.est_total_interest = ((this.loan.interest) / 12) * this.loan.amount

    for (var i = 1; i <= this.loan.months; i++) {
      this.loan.est_total_interest += ((this.loan.interest/100) / 12) * this.loan.balance
      this.loan.balance -= (this.loan.monthly_repayment - ((this.loan.interest/100) / 12) * this.loan.balance)

      this.payment_schedule.push(
        {
          payment: Math.round(this.loan.monthly_repayment * 100)/100,
          balance: Math.round(this.loan.balance * 100)/100
        })
    }

  }

}

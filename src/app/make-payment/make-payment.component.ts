import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
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

  /**
   * Initial code ran when component is loaded. 
   */
  ngOnInit(): void {
  }

  /**
   * Reloades current page. 
   */
  reloadPage() {
    window.location.reload()
  }

  /**
   * 
   * @param form Submission form when sending payment. 
   * @returns Payment ID created upon success, Null object upon failure. 
   */
  onSubmit(form: NgForm) {

    this.error = "null";

    let user_data: {
      email: string;
      id: number;
      wallet: string;
    } = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!user_data.email && !user_data.id && !user_data.wallet) {
      return;
    }

    if (!this.payment.evidence || this.payment.evidence.length == 0){
      this.error = "Make sure you enter your Evidence (Transaction ID Hash), before submitting.";
      return;
    }

    this.payment.state = -1

    return this.HttpClient.post<any>(
      '/api/send-payment',
      {
        sender_id: user_data.id,
        receiver_id: ((user_data.id == this.loan.borrower) ? this.loan.lender : this.loan.borrower),
        amount: ((this.loan.payment_number == 0) ? this.loan.amount : this.loan.monthly_repayment),
        paymentNumber: this.loan.payment_number, 
        loan_id: this.loan.loan_id, 
        evidenceHash: this.payment.evidence
      }).subscribe(resData => {

        if (resData.Error){
          this.error = resData.Error;
          this.payment.state = 0;
        }
        else{

          let loan_state = 2; 
          if (this.loan.payment_number == 0) {
            loan_state = 3; 
            this.notificationService.insert_nofitication(this.loan.borrower, 15);
          }
  
          this.notificationService.insert_nofitication(Number(this.authService.user_id), 20);
          
          if(this.authService.user.getValue()!.lender){
            this.notificationService.insert_nofitication(this.loan.borrower, 24);
          }
          else{
            this.notificationService.insert_nofitication(this.loan.lender, 24);
          }
  
          this.HttpClient.put<any>(
            '/api/update-loan-state',
            {
              loan_id: this.loan.loan_id,
              state: loan_state  
            }
          ).subscribe(resData => {
            this.payment.state = 1
          });
        }
      });
  }

}

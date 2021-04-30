import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { NotificationComponent } from 'src/app/notification/notification.component';

interface Offer {
  offer_id: number,
  loan_id: number,
  borrower_id: number,
  lender_id: number,
  amount: number,
  months: number,
  interest: number,
  accepted: boolean,
  expiration_date: Date
  username: string,
  eth_address: string,
  platform: number
};

@Component({
  selector: 'app-create-offer',
  templateUrl: './create-offer.component.html',
  styleUrls: ['./create-offer.component.css']
})
export class CreateOfferComponent implements OnInit {
  @Input() loan_id: number = -1;
  @Input() isEdit = false; 
  @Input() curr_offer: Offer = {} as Offer;
  @Input() lender_id: number = -1;

  user_id: number | String = this.authService.user.getValue()!.id;  
  error: string = "null";
  platforms = ['Venmo', 'ATH Movil', 'PayPal']

  loan = {
    amount: 1500,
    balance: 0,
    interest: 3,
    months: 3,
    platform: 0,
    monthly_repayment: 0,
    est_total_interest: 0.0,
    est_yield: 0.0
  };

  constructor(
    private authService: AuthService, 
    private router: Router,
    private HttpClient: HttpClient,
    private notificationService: NotificationComponent
  ) {}

  /**
   * A callback method that is invoked immediately after 
   * the default change detector has checked the directive's 
   * data-bound properties for the first time, and before any 
   * of the view or content children have been checked. It is 
   * invoked only once when the directive is instantiated.
   */
  ngOnInit(): void {
  }

  /**
   * Main submit of the component, in this case used to send
   * and http 'POST' request to the route '/api/create-offer' 
   * with the desired offer parameters requested from the form
   * and provided by the user in order to create an offer. 
   * If the user attempts to create an offer to a loan that 
   * the user has already made an offer it will send a 'PUT' 
   * request instead.  
   * 
   * @param form Form submitted by the user.
   * @returns Null, if invalid form. void when the user edits 
   * a loan. 
   */
  onSubmit(form: NgForm) {
    if (!form.valid){
      this.error = "Form is not valid, make sure you fill all fields."
      return;
    }

    this.error = "null"; 

    if (this.isEdit){
      let loan_amount = form.value.loan_amount;
      let interest = form.value.interest;
      let time_frame = form.value.time_frame;
      let platform = this.loan.platform;

      
    if (loan_amount < 1500 || interest < 3 || time_frame < 1){
      this.error = "Form is not valid, make sure all values are valid.";
      return;
    }

      this.HttpClient.put(
        '/api/create-offer',
        {
          offer_id: this.curr_offer.offer_id, loan_amount: loan_amount, 
          interest: interest / 100, time_frame: time_frame,
          platform: platform, borrower_id: this.user_id,
          lender_id: this.lender_id
        }
        ).subscribe(resData => {
          form.reset(); 
          this.isEdit = false; 
          this.notificationService.insert_nofitication(this.lender_id, 6); 
          this.notificationService.insert_nofitication(Number(this.user_id), 13); 
          window.location.reload(); 
      });
      return;
    }
    
    if (this.loan_id != -1){
      let loan_amount = form.value.loan_amount;
      let interest = form.value.interest;
      let time_frame = form.value.time_frame;
      let platform = form.value.platform;

      if (loan_amount < 1500 || interest < 3 || time_frame < 1){
        this.error = "Form is not valid, make sure all values are valid.";
        return;
      }

      this.HttpClient.post(
        '/api/create-offer',
        {
          loan_id: this.loan_id, loan_amount: loan_amount, 
          interest: interest / 100, time_frame: time_frame,
          platform: platform, borrower_id: this.user_id,
          lender_id: this.lender_id
        }
        ).subscribe(resData => {
          this.error = "null"; 
          form.reset(); 
          this.notificationService.insert_nofitication(Number(this.authService.user_id), 12);
          this.router.navigate(['/pending-offers']);
      });
    }

    else {
      console.log('fail');
    }
  }

  /**
   * Method used in order to verify dismiss modal function, depending on error.
   * @returns the modal-dimiss to dismiss into. 
   */
  find_dismiss_modal(){
    if (this.error != 'null'){
      return ''; 
    }

    if (this.isEdit){
      return '#createOfferModal'; 
    }

    return 'modal';
  }

  /**
   * Method used in order to verify target modal function, depending on error.
   * @returns the modal-target to re-direct into. 
   */
  find_target_modal(){
    if (this.loan.amount < 1500 || this.loan.interest < 3 || this.loan.months < 1){
      return ''; 
    }
    return '#offerConfirmModal';
  }

  /**
   * Verifies if the edit form is valid, if not sets error message to the 
   * corresponding one. 
   */
  check_valid_form(){
    if (this.loan.amount < 1500 || this.loan.interest < 3 || this.loan.months < 1){
      this.error = "Form is not valid, make sure all values are valid.";
    }
    else{
      this.error = 'null';
    }
  }

}

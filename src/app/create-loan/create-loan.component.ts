import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-create-loan',
  templateUrl: './create-loan.component.html',
  styleUrls: ['./create-loan.component.css']
})
export class CreateLoanComponent implements OnInit {

  error: string = "null";

  constructor(
    private authService: AuthService, 
    private router: Router
    ) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm){

    if (!form.valid){
      this.error = "Form is not valid, make sure you fill all fields."
      return;
    }
    
    let loan_amount = form.value.loan_amount;
    let interest = form.value.interest;
    let time_frame = form.value.time_frame;
    let platform = form.value.platform;

    console.log(loan_amount);
    console.log(interest);
    console.log(time_frame);
    console.log(platform);
  }

}

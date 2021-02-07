import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  template: `
    <input [(ngModel)]="loginForm.email" type="text"> {{loginForm.email}}
  `
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup | undefined;
  loading = false;
  submitted = false;
  returnUrl: string | undefined;
  error = '';
  postId: any;

  constructor(
    private http: HttpClient,  
    private formBuilder: FormBuilder,
  ) {

   }

  ngOnInit(): void {  
    
    this.loginForm = this.formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required]
    });

    

  }
    // // Simple POST request with a JSON body and response type <any>
    // this.http.post<any>('http://127.0.0.1:5000/login'}).subscribe(data => {
    //     this.postId = data.id;
    // })

    onSubmit() {
      console.log(this.loginForm?.value)
    }

}

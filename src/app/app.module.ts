import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from './auth/auth.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner/loading-spinner.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { HomeComponent } from './home/home.component';
import { BorrowerPageComponent } from './borrower-page/borrower-page.component';
import { LenderPageComponent } from './lender-page/lender-page.component';
import { LoanSearchComponent } from './loan-search/loan-search.component';
import { CreateLoanComponent } from './create-loan/create-loan.component';
import { ActiveLoansComponent } from './active-loans/active-loans.component';
import { LoanInfoComponent } from './active-loans/loan-info/loan-info.component';
import { EntryComponent } from './entry/entry.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { NotificationComponent } from './notification/notification.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LoadingSpinnerComponent,
    NavigationBarComponent,
    HomeComponent,
    BorrowerPageComponent,
    LenderPageComponent,
    LoanSearchComponent,
    CreateLoanComponent,
    ActiveLoansComponent,
    LoanInfoComponent,
    ActiveLoansComponent,
    ActiveLoansComponent,
    LoanInfoComponent,
    ActiveLoansComponent,
    EntryComponent,
    ProfileComponent,
    SettingsComponent,
    NotificationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: 'auth', component: AuthComponent},
      {path: 'home', component: HomeComponent},
      {path: 'borrower', component: BorrowerPageComponent},
      {path: 'lender', component: LenderPageComponent},
      {path: 'search', component: LoanSearchComponent},
      {path: 'create', component: CreateLoanComponent},
      {path: 'active-loans', component: ActiveLoansComponent},
      {path: 'active-loans/loan-info/:loan_id', component: LoanInfoComponent},
      {path: 'search/loan-info/:loan_id', component: LoanInfoComponent},




      {path: 'active-loans/loan-info/:loan_id', component: LoanInfoComponent},
      {path: 'search/loan-info/:loan_id', component: LoanInfoComponent},


      {path: 'entry', component: EntryComponent},
      {path: 'profile', component: ProfileComponent},
      {path: 'notifications', component: NotificationComponent},
      {path: 'settings', component: SettingsComponent},


      // {path: '', redirectTo: '/login', pathMatch: 'full'},
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

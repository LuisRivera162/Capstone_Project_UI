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
import { AuthGuard } from './auth/auth.guard';
import { LatestPaymentsComponent } from './latest-payments/latest-payments.component';

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
    NotificationComponent,
    LatestPaymentsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: 'auth', component: AuthComponent},
      {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
      {path: 'borrower', component: BorrowerPageComponent, canActivate: [AuthGuard]},
      {path: 'lender', component: LenderPageComponent,},
      {path: 'search', component: LoanSearchComponent, canActivate: [AuthGuard]},
      {path: 'create', component: CreateLoanComponent, canActivate: [AuthGuard]},
      {path: 'active-loans', component: ActiveLoansComponent, canActivate: [AuthGuard]},
      {path: 'active-loans/loan-info/:loan_id', component: LoanInfoComponent, canActivate: [AuthGuard]},
      {path: 'active-loans/loan-info/:loan_id', component: LoanInfoComponent, canActivate: [AuthGuard]},
      {path: 'search/loan-info/:loan_id', component: LoanInfoComponent, canActivate: [AuthGuard]},
      {path: 'search/loan-info/:loan_id', component: LoanInfoComponent, canActivate: [AuthGuard]},
      {path: 'entry', component: EntryComponent, canActivate: [AuthGuard]},
      {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
      {path: 'notifications', component: NotificationComponent, canActivate: [AuthGuard]},
      {path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

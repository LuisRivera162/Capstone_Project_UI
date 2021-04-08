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
import { NotificationComponent } from './notification/notification.component';
import { AuthGuard } from './auth/auth.guard';
import { LenderGuard } from './auth/lender.guard';
import { BorrowerGuard } from './auth/borrower.guard';
import { LatestPaymentsComponent } from './latest-payments/latest-payments.component';
import { TxReceiptComponent } from './tx-receipt/tx-receipt.component';
import { LoanDetailComponent } from './loan-detail/loan-detail.component';
import { CreateOfferComponent } from './offer/create-offer/create-offer.component';
import { ValidatePaymentComponent } from './validate-payment/validate-payment.component';
import { MakePaymentComponent } from './make-payment/make-payment.component';
import { NotificationsActionitemsComponent } from './notifications-actionitems/notifications-actionitems.component';
import { PaymentScheduleComponent } from './payment-schedule/payment-schedule.component';
import { PendingOffersComponent } from './offer/pending-offers/pending-offers.component';

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
    NotificationComponent,
    LatestPaymentsComponent,
    TxReceiptComponent,
    LoanDetailComponent,
    CreateOfferComponent,
    ValidatePaymentComponent,
    MakePaymentComponent,
    NotificationsActionitemsComponent,
    PaymentScheduleComponent,
    PendingOffersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: 'auth', component: AuthComponent},
      {path: 'home', component: HomeComponent, canActivate: []},
      {path: 'borrower', component: BorrowerPageComponent, canActivate: []},
      {path: 'lender', component: LenderPageComponent, canActivate: []},
      {path: 'search', component: LoanSearchComponent, canActivate: []},
      {path: 'active-loans', component: ActiveLoansComponent, canActivate: []},
      {path: 'entry', component: EntryComponent, canActivate: []},
      {path: 'profile', component: ProfileComponent, canActivate: []},
      {path: 'pending-offers', component: PendingOffersComponent, canActivate: []},


    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

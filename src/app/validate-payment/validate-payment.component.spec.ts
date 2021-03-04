import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatePaymentComponent } from './validate-payment.component';

describe('ValidatePaymentComponent', () => {
  let component: ValidatePaymentComponent;
  let fixture: ComponentFixture<ValidatePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidatePaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

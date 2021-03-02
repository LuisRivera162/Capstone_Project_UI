import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestPaymentsComponent } from './latest-payments.component';

describe('LatestPaymentsComponent', () => {
  let component: LatestPaymentsComponent;
  let fixture: ComponentFixture<LatestPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatestPaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

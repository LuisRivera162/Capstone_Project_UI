import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LenderPageComponent } from './lender-page.component';

describe('LenderPageComponent', () => {
  let component: LenderPageComponent;
  let fixture: ComponentFixture<LenderPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LenderPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LenderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

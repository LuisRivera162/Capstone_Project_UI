import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsActionitemsComponent } from './notifications-actionitems.component';

describe('NotificationsActionitemsComponent', () => {
  let component: NotificationsActionitemsComponent;
  let fixture: ComponentFixture<NotificationsActionitemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationsActionitemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsActionitemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

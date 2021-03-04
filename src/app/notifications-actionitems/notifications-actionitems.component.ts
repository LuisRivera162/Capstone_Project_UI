import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications-actionitems',
  templateUrl: './notifications-actionitems.component.html',
  styleUrls: ['./notifications-actionitems.component.css']
})
export class NotificationsActionitemsComponent implements OnInit {

  @Input() isLender: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}

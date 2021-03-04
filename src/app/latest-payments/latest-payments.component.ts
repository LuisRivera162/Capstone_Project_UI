import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-latest-payments',
  templateUrl: './latest-payments.component.html',
  styleUrls: ['./latest-payments.component.css']
})
export class LatestPaymentsComponent implements OnInit {

  @Input() isLender: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders.container',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class OrdersComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin.container',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AdminComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
}

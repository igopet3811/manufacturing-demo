import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-yields.container',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class YieldsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

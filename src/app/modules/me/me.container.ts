import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-me.container',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class MeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

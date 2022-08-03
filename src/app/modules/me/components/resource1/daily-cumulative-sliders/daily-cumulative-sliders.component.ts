import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-daily-cumulative-sliders',
  templateUrl: './daily-cumulative-sliders.component.html',
  styleUrls: ['./daily-cumulative-sliders.component.scss']
})
export class DailyCumulativeSlidersComponent implements OnInit {

  @Input() cfnTargets;
  @Output() newTargets = new EventEmitter();

  constructor() { }

  ngOnInit() {

  }

  onApply(evt) {
    this.newTargets.emit(evt);
  }

  trackByFn(index: any, item: any) {
    return index;
 }
}

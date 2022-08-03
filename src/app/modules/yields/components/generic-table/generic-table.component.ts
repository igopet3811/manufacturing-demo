import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector:'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss']
})
export class GenericTableComponent implements OnInit {

  @Input() data: any;
  @Input() columns: any;
  displayedColumns: any;

  constructor() { }

  ngOnInit() {
    this.displayedColumns = this.columns.map(c => c.name);
  }
}

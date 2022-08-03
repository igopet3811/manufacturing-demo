import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { LineDescription } from '../../../../shared/data/line-description.data';
import { ProductList, getProductGeographies, getProductSizes } from '../../../../shared/data/product-list.data';

@Component({
  selector: 'app-yields-line-filter',
  templateUrl: './yields-line-filter.component.html',
  styleUrls: ['./yields-line-filter.component.scss']
})
export class YieldsLineFilterComponent implements OnInit {

  @Output() filter = new EventEmitter();

  yieldsLineFilter: FormGroup;
  public geo = getProductGeographies();
  public ordersDisplay = [50, 100, 'All'];
  public sizes = getProductSizes().sort();
  public prodList = ProductList;
  public lineSelect = LineDescription.concat().sort((a,b) => (a.description > b.description) ? 1 : ((b.description > a.description) ? -1 : 0));

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.yieldsLineFilter = this.fb.group({
      line: new FormControl('LINE1'),
      ordersDisplay: new FormControl(50),
      geographies: new FormControl(['EU', 'OEU']),
      sizes: new FormControl([...this.sizes])
    });
  }

  onFilterSubmit() {
    this.filter.emit(this.yieldsLineFilter.value);
  }

  disableFilter() {
    if (this.yieldsLineFilter.controls.geographies.value.length === 0
      || !this.yieldsLineFilter.controls.line.value
      || this.yieldsLineFilter.controls.sizes.value.length === 0) {
      return true;
    } else {
      return false;
    }
  }
}
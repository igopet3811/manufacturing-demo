import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { ProductList, getProductGeographies, getProductFamilies, getProductSizes, getCfnsFromFamiliesGeo } from '../../../../shared/data/product-list.data';

@Component({
  selector: 'app-yields-graph-filter',
  templateUrl: './yields-graph-filter.component.html',
  styleUrls: ['./yields-graph-filter.component.scss']
})
export class YieldsGraphFilterComponent implements OnInit {

  @Output() filter = new EventEmitter();

  yieldsGraphFilter: FormGroup;
  public geo = getProductGeographies();
  public ordersDisplay = [50, 100, 'All'];
  public families = getProductFamilies();
  public sizes = getProductSizes().sort();
  public prodList = ProductList;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.yieldsGraphFilter = this.fb.group({
      geographies: new FormControl(['EU', 'OEU']),
      ordersDisplay: new FormControl(50),
      families: new FormControl([...this.families]),
      sizes: new FormControl([...this.sizes])
    });
  }

  onFilterSubmit() {
    this.filter.emit(this.yieldsGraphFilter.value);
  }

  disableFilter() {
    if (this.yieldsGraphFilter.controls.geographies.value.length === 0 
      || getCfnsFromFamiliesGeo(this.yieldsGraphFilter.value.families, this.yieldsGraphFilter.value.geographies, this.yieldsGraphFilter.value.sizes).length === 0) {
      return true;
    } else {
      return false;
    }
  }
}
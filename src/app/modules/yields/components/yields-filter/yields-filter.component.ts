import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatOption } from '@angular/material';

import { ProductList, getProductGeographies } from '../../../../shared/data/product-list.data';
import { getYearsFilter } from '../../../../shared/data/date-helpers';

@Component({
  selector: 'app-yields-filter',
  templateUrl: './yields-filter.component.html',
  styleUrls: ['./yields-filter.component.scss']
})
export class YieldsFilterComponent implements OnInit {

  @ViewChild('allGeoSelected', { static: false }) private allGeoSelected: MatOption;
  @ViewChild('allYearsSelected', { static: false }) private allYearsSelected: MatOption;
  @Output() filter = new EventEmitter();

  yieldsFilter: FormGroup;
  public geo = getProductGeographies();
  public years = getYearsFilter(2017);
  public prodList = ProductList;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.yieldsFilter = this.fb.group({
      geographies: new FormControl([0, 'EU', 'OEU']),
      years: new FormControl([2019])
    });
  }

  onFilterSubmit() {
    for (let key in this.yieldsFilter.value) {
      this.yieldsFilter.value[key] = this.yieldsFilter.value[key].filter(val => val !== 0);
    }
    this.filter.emit(this.yieldsFilter.value);
  }

  tosslePerOne(){ 
    if (this.allGeoSelected.selected) {  
      this.allGeoSelected.deselect();
      return false;
    }
    if(this.yieldsFilter.controls.geographies.value.length === this.geo.length)
      this.allGeoSelected.select();
  }

  tosslePerOneYear(){ 
    if (this.allYearsSelected.selected) {  
      this.allYearsSelected.deselect();
      return false;
    }
    if(this.yieldsFilter.controls.years.value.length === this.years.length)
      this.allYearsSelected.select();
  }

  toggleAllGeos() {
    if (this.allGeoSelected.selected) {
      this.yieldsFilter.controls.geographies.patchValue([...this.geo, 0]);
    } else {
      this.yieldsFilter.controls.geographies.patchValue([]);
    }
  }

  toggleAllYears() {
    if (this.allYearsSelected.selected) {
      this.yieldsFilter.controls.years.patchValue([...this.years, 0]);
    } else {
      this.yieldsFilter.controls.years.patchValue([]);
    }
  }

  disableFilter() {
    if (this.yieldsFilter.controls.years.value.length === 0 || this.yieldsFilter.controls.geographies.value.length === 0) {
      return true;
    } else {
      return false;
    }
  }
}

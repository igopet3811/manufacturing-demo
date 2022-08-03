import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { getLineDetails } from '../../../../shared/data/line-description.data';
import { getSingleGeoByCfn } from '../../../../shared/data/product-list.data';
import { stdev, average } from '../../../../shared/data/stats';

@Component({
    selector: 'app-order-details',
    templateUrl: './order-details.component.html',
    styleUrls: ['./order-details.component.scss']

})
export class OrderDetailsComponent implements OnInit {

  private _data = new BehaviorSubject<any>([]);
  public order = null;
  public shift = null;
  public prodTime = {
    start: null,
    end: null
  };
  public productDesc;
  public stDev = null;
  public runAvg = null;
  private options = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };

  @Input()
  set data(value) {
    this._data.next(value);
  };

  get data() {
    return this._data.getValue();
}

  constructor(){ }

  ngOnInit() {
    this._data.subscribe(po => {
      if(po) {
        this.order = po;
        let statsData = po.filter(el => el.rejectCode === null).map(item => item.wpp);
        this.stDev = stdev(statsData);
        this.runAvg = average(statsData, this.order[0].targetDry)*100;
        this.shift = Array.from(new Set(po.map(item => item.shift))).join(' ');
        this.prodTime = this.getProdTime(po);
        this.getLineInfo(this.order[0].line);
        this.productDesc = getSingleGeoByCfn(this.order[0].cfn);
      }
    });
  }

  padBatchNumber(b: string){
    return b.padStart(10,'0');
  }

  getProdTime(items) {
    let start, end;
    
    for(let i in items) {
      if(items[i].prodTime !== null) {
        start = items[i].prodTime;
        break;
      }
    }

    for(let i in items) {
      if(items[i].prodTime !== null) {
        end = items[i].prodTime;
      } else {
        continue;
      }
    }
    
    return { start: new Date(start).toLocaleString('en-GB', this.options), end: new Date(end).toLocaleString('en-GB', this.options) };
  }

  getLineInfo(line: string) {
    return getLineDetails(line);
  }
}
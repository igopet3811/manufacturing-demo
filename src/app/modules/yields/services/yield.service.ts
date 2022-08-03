import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Orders } from '../../../shared/dummy-data/yield-order';
import { WeeklyYields, ExpandableRow } from '../../../shared/dummy-data/yield-weekly';

@Injectable()
export class YieldsService {

    private orders = Orders;
    public weekly = WeeklyYields;
    public sampleExpandable = ExpandableRow;

  constructor() { }

  getYieldsData(): Observable<any> {
    const observable = Observable.of(this.orders);

    return observable
      .map(res => res)
      .catch((error:any) => {
        return Observable.throw(error.json().error || 'Server error')
      });
  }

  getWeeklyLines(): Observable<any> {
    const observable = Observable.of(this.weekly);

    return observable
      .map(res => res)
      .catch((error:any) => {
        return Observable.throw(error.json().error || 'Server error')
      });
  }

  getSampleExpandable(): Observable<any> {
    const observable = Observable.of(this.sampleExpandable);

    return observable
      .map(res => res)
      .catch((error:any) => {
        return Observable.throw(error.json().error || 'Server error')
      });
  }
}

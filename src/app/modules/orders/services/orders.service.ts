import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { OrderTimeline } from '../../../shared/dummy-data/order_timeline';
import { OrderFails} from '../../../shared/dummy-data/order_fails';

@Injectable()
export class OrdersService {

  private timeline = OrderTimeline;
  private fails = OrderFails;

  constructor() { }

  /* get order details */
  getOrderData(): Observable<any> {

    const observable = Observable.of(this.timeline);
    return observable
      .map(res => res)
      .catch((error: any) => {
        return Observable.throw(error.json().error || 'Server error');
      });
  }

  getOrderRejects(): Observable<any> {

    const observable = Observable.of(this.fails);
    return observable
      .map(res => res)
      .catch((error: any) => {
        return Observable.throw(error.json().error || 'Server error');
      });
  }
}

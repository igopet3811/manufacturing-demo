import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { DailyCumulative } from '../../../shared/dummy-data/me-daily-cumulative';
import { WeeklyThroughput } from '../../../shared/dummy-data/weekly-throughput';
import { DailyShift } from '../../../shared/dummy-data/me-daily-shift';


@Injectable()
export class MeService {

  private currDate: Date = new Date();
  private dc = DailyCumulative;
  private wt = WeeklyThroughput;
  private ds = DailyShift;

  constructor() { }

  getDailyTimestamps(): Observable<any> {
    const observable = Observable.of(this.ds);
    return observable
      .map(res => res)
      .catch((error: any) => {
        return Observable.throw(error.json().error || 'Server error');
      });
  }

  getWeekly(req): Observable<any> {
    const observable = Observable.of(this.wt);
    return observable
      .map(res => res)
      .catch((error: any) => {
        return Observable.throw(error.json().error || 'Server error');
      });
  }

  getDailyCumulative(): Observable<any> {
    const observable = Observable.of(this.dc);
    return observable
      .map(res => res)
      .catch((error: any) => {
        return Observable.throw(error.json().error || 'Server error');
      });
  }

  getLastTimestamp(): Observable<any> {
    const observable = Observable.of(this.currDate);
    return observable
      .map(res => res)
      .catch((error: any) => {
        return Observable.throw(error.json().error || 'Server error');
      });
  }
}

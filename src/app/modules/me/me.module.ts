import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { MatNativeDateModule, MatDatepickerModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MY_FORMATS } from '../../shared/adapters/date-adapter';

import { MeRoutingModule } from './me-routing.module';

/* components */
import { MeComponent } from './me.container';
import { MeOverviewComponent } from './components/me-overview.component';
import { MeService } from './services/me.service';
import { WeeklyThroughputComponent } from './components/resource1/weekly-throughput/weekly-throughput.component';
import { WeeklyThroughputFilterComponent } from './components/resource1/weekly-throughput-filter/weekly-throughput-filter.component';
import { DailyTimestampsComponent } from './components/resource1/daily-timestamps/daily-timestamps.component';
import { DailyTimestampsFilterComponent } from './components/resource1/daily-timestamps-filter/daily-timestamps-filter.component';
import { DailyCumulativeComponent } from './components/resource1/daily-cumulative/daily-cumulative.component';
import { DailyCumulativeSlidersComponent } from './components/resource1/daily-cumulative-sliders/daily-cumulative-sliders.component';

@NgModule({
  imports: [
    CommonModule,
    MeRoutingModule,
    MaterialModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  declarations: [
    MeComponent,
    MeOverviewComponent,
    WeeklyThroughputComponent,
    WeeklyThroughputFilterComponent,
    DailyTimestampsComponent,
    DailyTimestampsFilterComponent,
    DailyCumulativeComponent,
    DailyCumulativeSlidersComponent
  ],
  providers:[
    MeService,
    MatDatepickerModule,
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class MeModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { YieldsRoutingModule } from './yields-routing.module';
import { YieldsService } from './services/yield.service';
import { YieldsComponent } from './yields.container';
import { YieldsOverviewComponent } from './components/yields-overview.component';
import { YieldsTableComponent } from './components/yields-table/yields-table.component';
import { YieldsGraphComponent } from './components/yields-graph/yields-graph.component';
import { YieldsLineComponent } from './components/yields-line/yields-line.component';
import { WeeklyMultiComponent } from './components/weekly-multi/weekly-multi.component';
import { YieldsFilterComponent } from './components/yields-filter/yields-filter.component';
import { YieldsGraphFilterComponent } from './components/yields-graph-filter/yields-graph-filter.component';
import { YieldsLineFilterComponent } from './components/yields-line-filter/yields-line-filter.component';
import { PoRowDetailDirective } from 'src/app/shared/directives/expandable-row.directive';
import { GenericTableComponent } from './components/generic-table/generic-table.component';

@NgModule({
  imports: [
    CommonModule,
    YieldsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  declarations: [
    YieldsOverviewComponent,
    YieldsComponent,
    YieldsTableComponent,
    YieldsGraphComponent,
    YieldsLineComponent,
    WeeklyMultiComponent,
    YieldsFilterComponent,
    YieldsGraphFilterComponent,
    YieldsLineFilterComponent,
    PoRowDetailDirective,
    GenericTableComponent,
  ],
  providers:[
    YieldsService
  ]
})
export class YieldsModule { }

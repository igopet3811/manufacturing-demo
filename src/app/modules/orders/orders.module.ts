import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { OrdersRoutingModule } from './orders-routing.module';
/* services */
import { OrdersService } from './services/orders.service';
/* components */
import { OrdersComponent } from './orders.container';
import { OrdersOverviewComponent } from './components/orders-overview.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { OrderGraphComponent } from './components/order-dry-graph/order-dry-graph.component';
import { OrderWetWeightGraphComponent } from './components/order-wet-graph/order-wet-graph.component';
import { OrderSelectComponent } from './components/order-select/order-select.component';
import { OrderPieChartComponent } from './components/yield-pie-chart/yield-pie-chart.component';
import { RejectsPieChartComponent } from './components/rejects-pie-chart/rejects-pie-chart.component';

@NgModule({
  imports: [
    CommonModule,
    OrdersRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  declarations: [
    OrdersOverviewComponent,
    OrdersComponent,
    OrderDetailsComponent,
    OrderGraphComponent,
    OrderWetWeightGraphComponent,
    OrderSelectComponent,
    OrderPieChartComponent,
    RejectsPieChartComponent
  ],
  providers:[
    OrdersService
  ]
})
export class OrdersModule { }

import { Component, OnInit } from '@angular/core';

import { OrdersService } from '../services/orders.service';
import { LoaderService } from '../../../shared/services/loader.service';

@Component({
  selector: 'app-orders-overview',
  templateUrl: './orders-overview.html',
  styleUrls: ['./orders-overview.component.scss']
})

export class OrdersOverviewComponent implements OnInit {
  data = null;
  rejects = null;
  po = null;
  private displayGraph: boolean = true;

  constructor(
    private ordersService: OrdersService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {}

  poSubmitted(po: number) {
    this.loaderService.display(true);
    this.ordersService.getOrderData().subscribe(
      success => {
        this.loaderService.display(false);
        if(success.length === 0) {
          this.data = null;
          this.po = po;
        }
        else {
          this.data = success;
        }
      },
      err => {

      }
    )
  }

  poRejects(po: number) {
    this.ordersService.getOrderRejects().subscribe(
      success => {
        if(success.length === 0) {
          this.rejects = null;
        }
        else {
          this.rejects = success;
          this.displayGraph = this.rejects.length > 1;
        }
      },
      err => {

      }
    )
  }
}

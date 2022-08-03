import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdersComponent } from './orders.container';
import { OrdersOverviewComponent } from './components/orders-overview.component';

const routes: Routes = [
    {
        path:'orders',
        component: OrdersComponent,
        children: [
            {
                path:'details',
                pathMatch: 'full',
                component: OrdersOverviewComponent,
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'details'
            },
            {
                path: '**',
                pathMatch: 'full',
                redirectTo: 'details'
            }
        ]
    }
];

@NgModule({
  imports: [
      RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }

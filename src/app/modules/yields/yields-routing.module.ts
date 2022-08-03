import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { YieldsComponent } from './yields.container';
import { YieldsOverviewComponent } from './components/yields-overview.component';

const routes: Routes = [
    {
        path:'yields',
        component: YieldsComponent,
        children: [
            {
                path:'overview',
                pathMatch: 'full',
                component: YieldsOverviewComponent
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'overview'
            },
            {
                path: '**',
                pathMatch: 'full',
                redirectTo: 'overview'
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
export class YieldsRoutingModule { }

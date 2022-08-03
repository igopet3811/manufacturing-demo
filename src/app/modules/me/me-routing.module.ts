import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeComponent } from './me.container';
import { MeOverviewComponent } from './components/me-overview.component';

const routes: Routes = [
    {
        path:'me',
        component: MeComponent,
        children: [
            {
                path:'resource1',
                pathMatch: 'full',
                component: MeOverviewComponent,
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'resource1'
            },
            {
                path: '**',
                pathMatch: 'full',
                redirectTo: 'resource1'
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
export class MeRoutingModule { }

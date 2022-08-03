import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.container';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AdminOverviewComponent } from './components/admin-overview.component';

const routes: Routes = [
    {
        path:'admin',
        component: AdminComponent,
        children: [
            {
                path:'users',
                pathMatch: 'full',
                component: AdminOverviewComponent,
            },
            {
                path: 'profile',
                pathMatch: 'full',
                component: UserProfileComponent,
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'users'
            },
            {
                path: '**',
                pathMatch: 'full',
                redirectTo: 'users'
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
export class AdminRoutingModule { }

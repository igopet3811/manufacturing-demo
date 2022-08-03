import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from './auth.container';
import { LoginComponent } from './components/login.component';

const routes: Routes = [
    {
        path:'auth',
        component: AuthComponent,
        children: [
            {
                path:'login',
                pathMatch: 'full',
                component: LoginComponent
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'login'
            },
            {
                path: '**',
                pathMatch: 'full',
                redirectTo: 'login'
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
export class AuthRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    redirectTo: 'yields/overview',
    pathMatch: 'full'
  },
  {
    path:'me/resource1',
    redirectTo: 'me/resource1',
    pathMatch: 'full'
  },
  {
    path:'yields',
    redirectTo: 'yields/overview',
    pathMatch: 'full'
  },
  {
    path:'orders',
    redirectTo: 'orders',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    redirectTo: 'admin/users',
    pathMatch: 'full'
  },
  {
    path: 'admin/profile',
    redirectTo: 'admin/profile',
    pathMatch: 'full'
  },
  {
    path:'**',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

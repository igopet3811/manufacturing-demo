import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
/* services */
import { AdminService } from './services/admin.services';
/* components */
import { AdminComponent } from './admin.container';
import { UsersComponent } from './components/users/users.component';
import { AdminOverviewComponent } from './components/admin-overview.component';
import { UserDialogComponent } from './components/user-dialog//user-dialog.component';
import { UserDialogEditComponent } from './components/user-dialog-edit/user-dialog-edit.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserProfileDetailsComponent } from './components/user-profile/user-profile-details/user-profile-details.component';
import { UserProfilePswChangeComponent } from './components/user-profile/user-profile-psw-change/user-profile-psw-change.component';
import { RolesComponent } from './components/roles/roles.component';

@NgModule({
  imports: [
    AdminRoutingModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  declarations: [
    AdminComponent,
    AdminOverviewComponent,
    UsersComponent,
    UserDialogComponent,
    UserDialogEditComponent,
    UserProfileComponent,
    UserProfileDetailsComponent,
    UserProfilePswChangeComponent,
    RolesComponent,
  ],
  providers: [
    AdminService
  ],
  bootstrap : [
    UserDialogComponent,
    UserDialogEditComponent
  ]
})
export class AdminModule { }

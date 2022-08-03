import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AuthRoutingModule } from './auth-routing.module';
/* components */
import { LoginComponent } from './components/login.component';
import { AuthComponent } from './auth.container';


@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialFileInputModule,
    FlexLayoutModule
  ],
  declarations: [
    LoginComponent,
    AuthComponent
  ],
  providers:[
  ]
})
export class AuthModule { }

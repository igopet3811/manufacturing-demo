import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LayoutModule } from "@angular/cdk/layout";
import { FlexLayoutModule } from '@angular/flex-layout';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './modules/material/material.module';
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './shared/module/shared.module';
import { YieldsModule } from './modules/yields/yields.module';
import { OrdersModule } from './modules/orders/orders.module';
import { MeModule } from './modules/me/me.module';
import { AdminModule } from './modules/admin/admin.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppRoutingModule,
    AuthModule,
    BrowserAnimationsModule,
    BrowserModule,
    FlexLayoutModule,
    LayoutModule,
    MaterialModule,
    MeModule,
    OrdersModule,
    SharedModule,
    YieldsModule,
    AdminModule,
    ToastrModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

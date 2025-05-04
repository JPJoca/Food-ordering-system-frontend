import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import {LoginComponent} from "./components/login/login.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { UsersComponent } from './components/users/users.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import {EditUserComponent} from "./components/edit-user/edit-user.component";
import { OrdersComponent } from './components/orders/orders.component';
import { ErrorsComponent } from './components/errors/errors.component';
import { OrderPlaceComponent } from './components/order-place/order-place.component';
import { ScheduleOrderComponent } from './components/schedule-order/schedule-order.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsersComponent,
    AddUserComponent,
    EditUserComponent,
    OrdersComponent,
    ErrorsComponent,
    OrderPlaceComponent,
    ScheduleOrderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

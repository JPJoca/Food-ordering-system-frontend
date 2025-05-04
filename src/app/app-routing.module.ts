import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {UsersComponent} from "./components/users/users.component";
import {AuthGuard} from "./auth.guard";
import {AddUserComponent} from "./components/add-user/add-user.component";
import {EditUserComponent} from "./components/edit-user/edit-user.component";
import {OrdersComponent} from "./components/orders/orders.component";
import {ErrorsComponent} from "./components/errors/errors.component";
import {OrderPlaceComponent} from "./components/order-place/order-place.component";

const routes: Routes = [
  {
    path:"",
    component: UsersComponent,
    canActivate:[AuthGuard],
    canDeactivate: [AuthGuard]
  },
  {
    path: 'add',
    component: AddUserComponent,
    canActivate: [AuthGuard],
    data: { permissions: ['can_create_users'] },
  },
  {
    path: 'edit/:id',
    component: EditUserComponent,
    canActivate:[AuthGuard],
    canDeactivate: [AuthGuard],
    data: { permissions: ['can_update_users'] },
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path:"orders",
    component: OrdersComponent,
    canActivate:[AuthGuard],
    canDeactivate: [AuthGuard],
    data: { permissions: ['can_search_order','can_place_order'] },
  }
  ,
  {
    path:"errors",
    component: ErrorsComponent,
    canActivate:[AuthGuard],
    canDeactivate: [AuthGuard],
  }
  ,
  {
    path:"orders-place",
    component: OrderPlaceComponent,
    canActivate:[AuthGuard],
    canDeactivate: [AuthGuard],
    data: { permissions: ['can_place_order'] },
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { UserDashboardComponent } from './user-dashboard/user-dashboard';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard';
import { AddProductComponent } from './admin-dashboard/components/add-product/add-product';
import { UpdateProductComponent } from './admin-dashboard/components/update-product/update-product';
import { DeleteProductComponent } from './admin-dashboard/components/delete-product/delete-product';
import { ViewProductsComponent } from './admin-dashboard/components/view-products/view-products';
import { SalesReportComponent } from './admin-dashboard/components/sales-report/sales-report';
import { UpdateOrderStatusComponent } from './admin-dashboard/components/update-order-status/update-order-status';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'user-dashboard', component: UserDashboardComponent, canActivate: [authGuard] },
  { 
    path: 'admin-dashboard', 
    component: AdminDashboardComponent,
    canActivate: [adminGuard],
    children: [
      // { path: '', redirectTo: 'view-products', pathMatch: 'full' },
      { path: 'add-product', component: AddProductComponent },
      { path: 'update-product', component: UpdateProductComponent },
      { path: 'delete-product', component: DeleteProductComponent },
      { path: 'view-products', component: ViewProductsComponent },
      { path: 'sales-report', component: SalesReportComponent },
      { path: 'order-status', component: UpdateOrderStatusComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/Guards/auth.guard';
import { AddProductComponent } from '../order/add-product/add-product.component';
import { OrderMasterComponent } from '../order/order-master/order-master.component';
import { ProductListComponent } from '../order/product-list/product-list.component';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { UserOrdersComponent } from '../order/user-orders/user-orders.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';



const routes: Routes = [
  { path: '', redirectTo: '/Products/ProductsList', pathMatch: 'full' },
  { path: 'ProductsList', component: ProductListComponent },
  { path: 'ProductDetails/:productId', component: ProductDetailsComponent },
  { path: 'AddProduct', component: AddProductComponent },
  { path: 'EditProduct/:productId', component: AddProductComponent },
  { path: 'Order', component: OrderMasterComponent, canActivate: [AuthGuard] },
  { path: 'UserOrders', component: UserOrdersComponent, canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent }
]

@NgModule({
  declarations: [
    AddProductComponent,
    UserOrdersComponent,
    ProductDetailsComponent,
    OrderMasterComponent,
    ProductListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatProgressBarModule
  ]
})
export class ProductsModule { }

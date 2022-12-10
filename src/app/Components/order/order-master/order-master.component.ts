import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ICategory } from 'src/app/Models/icategory';
import { IOrder } from 'src/app/Models/iorder';
import { IProduct } from 'src/app/Models/iproduct';
import { CategoriesService } from 'src/app/Services/categories.service';
import { OrdersService } from 'src/app/Services/orders.service';
import { ProductsService } from 'src/app/Services/products.service';
import { UserAuthService } from 'src/app/Services/user-auth.service';
import { IOrderDetailsViewModel } from 'src/app/ViewModels/order-details-view-model';
import { ProductListComponent } from '../product-list/product-list.component';

@Component({
  selector: 'app-order-master',
  templateUrl: './order-master.component.html',
  styleUrls: ['./order-master.component.scss']
})
export class OrderMasterComponent implements OnInit, AfterViewInit, OnDestroy {
  categories: ICategory[] = [];
  allOrders: IOrderDetailsViewModel[] = [];
  isThereAnyOrderYet = false;
  // sendOrderAfterConfermation?: IOrderDetailsViewModel;
  selectedCategoryId: number = 0;
  selectedMaxPrice?: number;
  orderTotalPrice: number = 0;
  NewProductsAfterConfirmation: IProduct[] = [];
  @ViewChild(ProductListComponent) productListComponent!: ProductListComponent;
  allSubscriptions: Subscription[] = [];

  constructor(private categoriesService: CategoriesService, private orderService: OrdersService,
    private authService: UserAuthService, private snackBar: MatSnackBar, private productService: ProductsService) {
    // this.categories = [
    //   { id: 1, name: 'Laptop' },
    //   { id: 2, name: 'Mobile' },
    //   { id: 3, name: 'Computer' }
    // ]
  }

  ngOnInit(): void {
    this.allSubscriptions.push(this.categoriesService.GetAllCategories().subscribe(cat => {
      this.categories = cat
    }));
  }
  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    for (let i = 0; i < this.allSubscriptions.length; i++) {
      this.allSubscriptions[i].unsubscribe();

    }
  }

  // OnTotalPriceChanged(totalPrice: number) {
  //   this.orderTotalPrice = totalPrice;
  // }

  HandelOrdersDetails(orderDetail: IOrderDetailsViewModel): void {
    orderDetail.total += orderDetail.count * orderDetail.price;


    for (let i = 0; i < this.allOrders.length; i++) {
      if (this.allOrders[i].productId === orderDetail.productId) {
        this.allOrders[i].AVQuantity = orderDetail.AVQuantity;
        this.allOrders[i].count += orderDetail.count;
        this.allOrders[i].name = orderDetail.name;
        this.allOrders[i].price = orderDetail.price;
        this.allOrders[i].total += orderDetail.total;
        return;
      }
    }
    this.allOrders.push(orderDetail);

    this.CheckIfThereIsOrder();
  }

  OrderTrackBy(index: number, order: IOrderDetailsViewModel): number {
    return order.productId;
  }

  RemoveOrder(productId: number) {
    if (confirm("Are you sure to delete this Item..!!!")) {
      this.HandelDeletedProduct(productId);
    }
    this.CheckIfThereIsOrder();
  }

  async ConfirmOrder(order: IOrderDetailsViewModel) {

    if (order.count <= 0) {
      this.SnackBarAlert("Invalid order Detail..!");
      return;
    }

    let product = {} as IProduct;
    await this.productService.GetProductByIdAsPromise(order.productId).then(prod => {
      product = prod
    });

    // this.productService.GetAllProducts().then(products => {
    //   for (let i = 0; i < products.length; i++) {
    //     if(order.productId === products[i].id){
    //       product = products[i];
    //       break;
    //     }

    //   }
    // })

    if (order.AVQuantity < order.count) {
      this.SnackBarAlert("This quantity isn't available");
    }
    else if (product.quantity < order.count) {
      this.productService.GetAllProducts().then(prods => { this.NewProductsAfterConfirmation = prods });
      this.SnackBarAlert("There is a reduce of quantity, This quantity isn't available");
    }
    else {
      this.orderTotalPrice += Number(order.total);
      // this.sendOrderAfterConfermation = order;
      this.productListComponent.UpdateQuantityAfterConfirmation(order);

      let nextOrderId = 0;
      await this.orderService.GetAllOrders().then(orders => {
        nextOrderId = orders[0].id + 1
      });

      let sendOrder = {
        id: nextOrderId,
        name: order.name,
        price: order.total,
        quantity: order.count,
        imageUrl: order.imageUrl,
        date: Date.now().toString(),
        userEmail: this.authService.getUserEmail
      }
      this.allSubscriptions.push(this.orderService.AddOrder(sendOrder).subscribe({
        next: (order: IOrder) => {
          this.SnackBarAlert(`${order.name} bought successfuly`);
        },
        error: (err: Error) => {
          this.SnackBarAlert(err.message);
        }
      }))

      this.HandelDeletedProduct(order.productId);
    }
  }

  UpdateOrder(productId: number, orderUpdatedCount: number) {
    for (let i = 0; i < this.allOrders.length; i++) {
      if (this.allOrders[i].productId === productId) {
        this.allOrders[i].count = orderUpdatedCount;
      }
    }
    this.SnackBarAlert("Product Updated successfully")
  }

  HandelDeletedProduct(productId: number) {
    this.allOrders = this.allOrders.filter(o => o.productId != productId);
    this.CheckIfThereIsOrder();
  }

  // ResetCategoryId() {
  //   this.selectedCategoryId = 1;
  // }

  private CheckIfThereIsOrder() {
    if (this.allOrders.length > 0)
      this.isThereAnyOrderYet = true;
    else
      this.isThereAnyOrderYet = false;
  }

  private SnackBarAlert(message: string) {
    this.snackBar.open(message, 'Ok', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }
}

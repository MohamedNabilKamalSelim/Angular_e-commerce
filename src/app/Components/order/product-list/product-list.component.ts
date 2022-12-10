import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IProduct } from 'src/app/Models/iproduct';
import { ProductsService } from 'src/app/Services/products.service';
import { StaticProductService } from 'src/app/Services/static-product-service.service';
import { UserAuthService } from 'src/app/Services/user-auth.service';
import { IOrderDetailsViewModel } from 'src/app/ViewModels/order-details-view-model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnChanges, OnDestroy {
  selectedCategoryProducts: IProduct[] = [];
  totalPrice: number = 0;
  @Input() reciveCategoryId: number = 0;
  @Input() reciveMaxPrice?: number;
  @Input() reciveNewProductsAfterConfirmation: IProduct[] = [];
  // @Output() totalPriceChanged: EventEmitter<number>;
  @Output() sendOrderDetail: EventEmitter<IOrderDetailsViewModel>;
  @Output() sendDeletedProduct: EventEmitter<number>;
  // @Input() reciveOrderAfterConfermation?: IOrderDetailsViewModel;
  isUserLoggedIn: string | null = null;
  private allSubscriptions: Subscription[] = [];


  constructor(private productsService: ProductsService, private authService: UserAuthService,
    private router: Router, private snackBar: MatSnackBar) {

    // this.totalPriceChanged = new EventEmitter<number>();
    this.sendOrderDetail = new EventEmitter<IOrderDetailsViewModel>();
    this.sendDeletedProduct = new EventEmitter<number>();
  }

  ngOnInit(): void {

    this.allSubscriptions.push(this.productsService.GetAllProducts$().subscribe(products => {
      this.selectedCategoryProducts = products
    }));

    this.authService.isUserLoggedInWithSubject().subscribe(value => {
      this.isUserLoggedIn = value;
    });
  }

  ngOnChanges(): void {
    this.ViewSelectedCategoryItems();

    this.selectedCategoryProducts = this.reciveNewProductsAfterConfirmation;

    // this.selectedCategoryProducts.forEach(p => {
    //   if (p.id == this.reciveOrderAfterConfermation?.productId) {
    //     p.quantity -= this.reciveOrderAfterConfermation?.count;
    //   }
    // });

  }

  ngOnDestroy(): void {
    for (let i = 0; i < this.allSubscriptions.length; i++) {
      this.allSubscriptions[i].unsubscribe();
    }
  }

  UpdateQuantityAfterConfirmation(order: IOrderDetailsViewModel) {
    let product = {} as IProduct;
    let newCount = 0;
    for (let i = 0; i < this.selectedCategoryProducts.length; i++) {
      if (this.selectedCategoryProducts[i].id == order.productId) {
        newCount = this.selectedCategoryProducts[i].quantity - order.count;
        product = this.selectedCategoryProducts[i];
        break;
      }
    }

    product.quantity = newCount;
    this.productsService.EditProduct(product.id, product).subscribe()
  }

  ViewSelectedCategoryItems() {
    this.allSubscriptions.push(this.productsService.GetProductsByCategoryId(this.reciveCategoryId).subscribe(products => {
      this.selectedCategoryProducts = products.filter(p => this.reciveMaxPrice ? (p.price <= this.reciveMaxPrice) : p.price);
    }));
  }

  Bye(orderDetail: IOrderDetailsViewModel) {
    // this.totalPrice += orderDetail.count * orderDetail.price;

    // Execute the event when
    // this.totalPriceChanged.emit(this.totalPrice);

    this.sendOrderDetail.emit(
      {
        productId: orderDetail.productId,
        name: orderDetail.name,
        price: orderDetail.price,
        count: orderDetail.count,
        total: 0,
        AVQuantity: orderDetail.AVQuantity,
        imageUrl: orderDetail.imageUrl
      });
  }

  DeleteProduct(productId: number) {
    if (confirm('Are you sure that you want to delete this product.!')) {
      this.allSubscriptions.push(this.productsService.DeleteProduct(productId).subscribe());
      window.location.reload();
      this.SnackBarAlert("The product deleted successfully.");

      this.sendDeletedProduct.emit(productId);
    }
  }

  private SnackBarAlert(message: string) {
    this.snackBar.open(message, 'Ok', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }

  ProductTrackByFunc(index: number, product: IProduct): number {
    return product.id;
  }
}

import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IProduct } from 'src/app/Models/iproduct';
import { ProductsService } from 'src/app/Services/products.service';
import { StaticProductService } from 'src/app/Services/static-product-service.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  CurrentProductId: number = 0;
  currentProduct: IProduct | null = null;
  allProductsId: number[] = [];
  currentproductIndex: number = 0;
  paramMapSubscribtion!: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private productService: ProductsService, private location: Location) { }

  ngOnInit(): void {
    this.productService.GetAllProducts$().subscribe(products => {
      this.allProductsId = products.map(p => p.id)
    });

    //   this.ProductId = Number(this.activatedRoute.snapshot.paramMap.get('productId'));
    //   this.currentProduct = this.productService.GetProductById(this.ProductId);

    this.paramMapSubscribtion = this.activatedRoute.paramMap.subscribe(urlParameters => {
      this.CurrentProductId = Number(urlParameters.get('productId'));
      this.productService.GetProductByIdAsObservable(this.CurrentProductId).subscribe(product => {
        this.currentProduct = product
      })
      this.currentproductIndex = this.allProductsId.findIndex(id => id == this.CurrentProductId);
    });
  }

  ngOnDestroy(): void {
    this.paramMapSubscribtion.unsubscribe();
  }

  GoBack() {
    this.location.back();
  }

  PreviousItem() {
    if (!this.CheckFirstIndex()) {
      this.DisplayDemandedProducts(this.currentproductIndex - 1);
    }
  }

  NextItem() {
    if (!this.CheckLastIndex()) {
      this.DisplayDemandedProducts(this.currentproductIndex + 1);
    }
  }

  private DisplayDemandedProducts(index: number) {
    this.CurrentProductId = this.allProductsId[index];
    this.router.navigate(['/Products/ProductDetails', this.CurrentProductId]);
  }

  CheckFirstIndex(): boolean {
    return this.currentproductIndex == 0;
  }

  CheckLastIndex(): boolean {
    return this.currentproductIndex == this.allProductsId.length - 1;
  }
}

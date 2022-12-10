import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ICategory } from 'src/app/Models/icategory';
import { IProduct } from 'src/app/Models/iproduct';
import { CategoriesService } from 'src/app/Services/categories.service';
import { ProductsService } from 'src/app/Services/products.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit, OnDestroy {
  productIdForEdit: number = 0;
  private allSubscriptions: Subscription[] = [];
  categories: ICategory[] = [];
  ProductForEditing?: IProduct;
  productFG: FormGroup;
  //@ViewChild('submitBtn') submitBtn!: ElementRef;
  submitBtnText: string;
  constructor(private productService: ProductsService, private router: Router,
    private snackBar: MatSnackBar, private activatedRoute: ActivatedRoute,
    private categoryService: CategoriesService, private fb: FormBuilder) {
    this.submitBtnText = "Add";
    // this.productIdForEdit = Number(this.activatedRoute.snapshot.paramMap.get('productId'));
    this.productFG = this.fb.group({
      id: [''],
      name: [''],
      price: [''],
      quantity: [''],
      imageUrl: [''],
      categoryId: ['']
    });
  }

  ngOnInit(): void {
    this.allSubscriptions.push(this.categoryService.GetAllCategories().subscribe(cat => {
      this.categories = cat
    }));

    this.activatedRoute.paramMap.subscribe(params => {
      this.productIdForEdit = Number(params.get('productId'));
      if (this.productIdForEdit != 0) {
        this.ChangeTheViewForEdit();


        // this.productService.GetProductByIdAsObservable(this.productIdForEdit).subscribe(p => {
        //   this.ProductForEditing = p
        // });
        // alert(this.ProductForEditing)
        // alert(JSON.stringify(this.ProductForEditing))
        // if (this.ProductForEditing) {
        //   this.productFG.setValue(this.ProductForEditing);
        // }
      }

    })
    if (this.ProductForEditing == undefined)
      this.ProductForEditing = {} as IProduct;


  }

  ngOnDestroy(): void {
    for (let i = 0; i < this.allSubscriptions.length; i++) {
      this.allSubscriptions[i].unsubscribe();
    }
  }
  ChangeTheViewForEdit() {
    // this.productFG.get('productId')?.setValue(this.productIdForEdit);

    this.productService.GetProductByIdAsPromise(this.productIdForEdit).then((res) => {
      if (res) {
        this.ProductForEditing = res;
        this.productFG.setValue(res);
      }
    });
    this.submitBtnText = "Edit";

    // this.submitBtn.nativeElement.innerText = 'Edit';
  }

  get prodId() {
    return this.productFG.controls['id'];
  }
  get prodName() {
    return this.productFG.controls['name'];
  }
  get prodQuant() {
    return this.productFG.controls['quantity'];
  }
  get prodPrice() {
    return this.productFG.controls['price'];
  }
  get prodCatId() {
    return this.productFG.controls['categoryId'];
  }
  get prodImgUrl() {
    return this.productFG.controls['imageUrl'];
  }

  async AddProduct() {

    let nextProductId = 0;
    await this.productService.GetAllProducts().then(products => {
      nextProductId = products[0].id + 1
    });

    let product = {
      "id": nextProductId,
      "name": this.prodName.value,
      "price": this.prodPrice.value,
      "quantity": this.prodQuant.value,
      "imageUrl": this.prodImgUrl.value,
      "categoryId": this.prodCatId.value
    }

    let observer = {
      next: (prod: IProduct) => {
        this.SnackBarAlert(`Product ${prod.name} added successfuly`);
        this.router.navigateByUrl('/Products/ProductsList');
      },
      error: (err: Error) => {
        this.SnackBarAlert(err.message);
      }
    }
    this.allSubscriptions.push(this.productService.AddProduct(product).subscribe(observer));

  }

  private SnackBarAlert(message: string) {
    this.snackBar.open(message, 'Ok', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }

  EditProduct() {
    // let product = {
    //   "id": 9,
    //   "name": "LapMap",
    //   "price": 21,
    //   "quantity": 0,
    //   "imageUrl": "https://picsum.photos/150/100",
    //   "categoryId": 1
    // }
    let observer = {
      next: (prod: IProduct) => {
        this.SnackBarAlert(`Product ${prod.name} updated successfuly`);
        this.router.navigateByUrl('/Products/ProductsList');
      },
      error: (err: Error) => {
        this.SnackBarAlert(err.message);
      }
    }
    this.allSubscriptions.push(this.productService.EditProduct(Number(this.productIdForEdit), this.productFG.value).subscribe(observer));
  }
}

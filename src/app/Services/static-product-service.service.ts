import { Injectable } from '@angular/core';
import { IProduct } from '../Models/iproduct';

@Injectable({
  providedIn: 'root'
})
export class StaticProductService {
  products: IProduct[];
  constructor() {
    this.products = [
      {
        id: 1,
        name: 'Lenove E6',
        price: 3500,
        quantity: 3,
        imageUrl: 'https://picsum.photos/150/100',
        categoryId: 1,
      },
      {
        id: 7,
        name: 'Samsung G13',
        price: 2000,
        quantity: 0,
        imageUrl: 'https://picsum.photos/100/75',
        categoryId: 2,
      },
      {
        id: 13,
        name: 'Dell native7',
        price: 4200,
        quantity: 3,
        imageUrl: 'https://picsum.photos/150/100',
        categoryId: 1,
      },
      {
        id: 88,
        name: 'Tosheba',
        price: 3800,
        quantity: 7,
        imageUrl: 'https://picsum.photos/170/100',
        categoryId: 3,
      },
      {
        id: 22,
        name: 'Infinix hot5',
        price: 2500,
        quantity: 5,
        imageUrl: 'https://picsum.photos/100/75',
        categoryId: 2,
      },
      {
        id: 5,
        name: 'Accer',
        price: 4500,
        quantity: 2,
        imageUrl: 'https://picsum.photos/170/100',
        categoryId: 3,
      }
    ];
  }

  GetProductById(productId: number): IProduct | null {
    let product = this.products.find(p => p.id == productId);
    return product ? product : null;
  }

  GetAllProducts(): IProduct[] {
    return this.products;
  }

  GetProductsByCategoryId(categoryId: number, maxPrice?: number): IProduct[] {
    if (categoryId == 0) {
      return this.products.filter(p => {
        return maxPrice ? (p.price <= maxPrice) : p.price;
      });
    }
    else {
      return this.products.filter(p => {
        return maxPrice ? (p.categoryId == categoryId && p.price <= maxPrice) : p.categoryId == categoryId;
      });
    }

    // if (categoryId == 0) {
    //   return this.products;
    // }
    // else {
    //   return this.products.filter(p => p.categoryId == categoryId);
    // }
  }

  GetAllProductsId(): number[] {
    return this.products.map(p => p.id);
  }
}

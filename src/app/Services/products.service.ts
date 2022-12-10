import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, filter, lastValueFrom, Observable, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IProduct } from '../Models/iproduct';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly productsUrl: string;
  private readonly httpOptions;

  constructor(private httpClient: HttpClient) {

    this.productsUrl = `${environment.apiUrl}/products`;

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        //Authorization: 'my-auth-token'
      })
    };

  }

  GetAllProducts$(): Observable<IProduct[]> {
    return this.httpClient.get<IProduct[]>(this.productsUrl).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  async GetAllProducts() {
    return await lastValueFrom(this.httpClient.get<IProduct[]>(`${this.productsUrl}?_sort=id&_order=desc`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    ));
  }

  GetProductByIdAsObservable(productId: number): Observable<IProduct> {
    return this.httpClient.get<IProduct>(`${this.productsUrl}/${productId}`).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  async GetProductByIdAsPromise(productId: number): Promise<IProduct> {
    return await lastValueFrom(this.httpClient.get<IProduct>(`${this.productsUrl}/${productId}`).pipe(
      retry(2),
      catchError(this.handleError)
    ));
  }

  GetProductsByCategoryId(CategoryId: number): Observable<IProduct[]> {
    let result;
    if (CategoryId == 0) result = this.GetAllProducts$();
    else {
      result = this.httpClient.get<IProduct[]>(`${this.productsUrl}?categoryId=${CategoryId}&_sort=price`).pipe(
        retry(2),
        catchError(this.handleError)
      );
    }
    return result;
  }

  AddProduct(product: IProduct): Observable<IProduct> {
    return this.httpClient.post<IProduct>(this.productsUrl, JSON.stringify(product), this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  EditProduct(productId: number, product: IProduct): Observable<IProduct> {
    return this.httpClient.put<IProduct>(`${this.productsUrl}/${productId}`, JSON.stringify(product), this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  DeleteProduct(productId: number) {
    return this.httpClient.delete(`${this.productsUrl}/${productId}`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}

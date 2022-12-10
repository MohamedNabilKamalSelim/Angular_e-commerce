import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IOrder } from '../Models/iorder';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  ordersUrl: string;
  private readonly httpOptions;

  constructor(private httpClient: HttpClient) {
    this.ordersUrl = `${environment.apiUrl}/orders`;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
        //Authorization: 'my-auth-token'
      })
    };
  }
  async GetAllOrders() {
    return await lastValueFrom(
      this.httpClient.get<IOrder[]>(`${this.ordersUrl}?_sort=id&_order=desc`).pipe(retry(2), catchError(this.handleError))
    );
  }

  async GetAllOrdersByUserEmail(email: string) {
    return await lastValueFrom(
      this.httpClient.get<IOrder[]>(`${this.ordersUrl}?userEmail=${email}`).pipe(retry(2), catchError(this.handleError))
    );
  }

  AddOrder(order: IOrder) {
    return this.httpClient.post<IOrder>(this.ordersUrl, JSON.stringify(order), this.httpOptions).pipe(
      retry(2), catchError(this.handleError)
    )
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

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICategory } from '../Models/icategory';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private readonly categoriesUrl: string;
  private readonly httpOptions;

  constructor(private httpClient: HttpClient) {

    this.categoriesUrl = `${environment.apiUrl}/categories`;

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        //Authorization: 'my-auth-token'
      })
    };

  }

  GetAllCategories(): Observable<ICategory[]> {
    return this.httpClient.get<ICategory[]>(this.categoriesUrl).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  GetCategoryById(categoryId: number): Observable<ICategory> {
    return this.httpClient.get<ICategory>(`${this.categoriesUrl}/${categoryId}`).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  AddCategory(category: ICategory): Observable<ICategory> {
    return this.httpClient.post<ICategory>(this.categoriesUrl, JSON.stringify(category), this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  EditCategory(categoryId: number, category: ICategory): Observable<ICategory> {
    return this.httpClient.put<ICategory>(`${this.categoriesUrl}/${categoryId}`, JSON.stringify(category), this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  DeleteCategory(categoryId: number) {
    return this.httpClient.delete(`${this.categoriesUrl}/${categoryId}`).pipe(
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

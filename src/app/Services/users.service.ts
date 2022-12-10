import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, catchError, lastValueFrom, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginViewModel } from '../ViewModels/login-view-model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly usersUrl;
  private readonly httpOptions;

  constructor(private httpClient: HttpClient) {
    this.usersUrl = `${environment.apiUrl}/users`;

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
        //Authorization: 'my-auth-token'
      })
    };
  }
  GetAllUsers(): Observable<LoginViewModel[]> {
    return this.httpClient.get<LoginViewModel[]>(this.usersUrl, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }
  async GetAllUsersPromise() {
    return await lastValueFrom(this.httpClient.get<LoginViewModel[]>(`${this.usersUrl}?_sort=id&_order=desc`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    ));
  }

  async GetUserById(id: number) {
    return await lastValueFrom(this.httpClient.get<LoginViewModel>(`${this.usersUrl}/${id}`).pipe(
      retry(2),
      catchError(this.handleError),
    ));
  }

  GetUserByEmail(email: string): Observable<LoginViewModel> {
    return this.httpClient.get<LoginViewModel>(`${this.usersUrl}?email=${email}`).pipe(
      retry(2),
      catchError(this.handleError),
    );
  }

  Register(user: LoginViewModel): Observable<LoginViewModel> {

    return this.httpClient.post<LoginViewModel>(this.usersUrl, user, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));

  }

  async CheckIfEmailExists(email: string): Promise<boolean> {

    let checkEmailExist = false;
    await this.GetAllUsersPromise().then((users) => {
      for (let i = 0; i < users.length; i++) {
        if (users[i].email === email) {
          checkEmailExist = true;
          break;
        }
      }
    });
    // alert(checkEmailExist)
    return checkEmailExist;
  }

  async GetUserByEmailFromAllUsers(email: string): Promise<LoginViewModel | null> {
    // this.GetAllUsers().subscribe(users => {
    //   this.currentUsers = users
    // })
    // this.currentUsers.forEach(u => {
    //   if (u.email == user.email)
    //     this.currentUser = u
    // })

    // this.GetUserByEmail(user.email).subscribe(us => {
    //   this.currentUser = us
    // });


    let currentUser = null;
    await this.GetAllUsersPromise().then(users => {
      for (let i = 0; i < users.length; i++) {
        if (users[i].email == email) {
          currentUser = users[i];
          break;
        }
      }
      // users.filter(u => {
      //   // alert(JSON.stringify(u));
      //   if (u.email == user.email) {
      //     this.currentUser = u;
      //     return;
      //   }
      // })
    });

    return currentUser;
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

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, filter, first, lastValueFrom, map, Observable, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginViewModel } from '../ViewModels/login-view-model';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService implements OnInit {
  private isLoggedSubject: BehaviorSubject<string | null>;
  private currentUser: LoginViewModel | null = null;


  constructor(private usersService: UsersService) {
    this.isLoggedSubject = new BehaviorSubject(this.getUserEmail);


  }

  ngOnInit(): void {
  }

  async Login(user: LoginViewModel): Promise<string> {

    await this.usersService.GetUserByEmailFromAllUsers(user.email).then(user => {
      this.currentUser = user;
    });

    //alert(JSON.stringify(this.currentUser));
    if (this.currentUser?.password === user.password) {
      localStorage.setItem('userInfo', this.currentUser?.email);
      this.isLoggedSubject.next(localStorage.getItem('userInfo'));
      return "Login Success";
    }
    else return "Invalid Login Information";
  }

  Logout() {
    localStorage.removeItem('userInfo');
    this.isLoggedSubject.next(null);
  }

  get isUserLoggedIn() {
    return localStorage.getItem('userInfo') ? true : false;
  }

  isUserLoggedInWithSubject(): Observable<string | null> {
    return this.isLoggedSubject.asObservable();
  }

  get getUserEmail(): string | null {
    return localStorage.getItem('userInfo');
  }

}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuthService } from 'src/app/Services/user-auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  AlwaysCheckLogin: string | null = null;
  AllSubscriptions: Subscription[] = [];
  constructor(private authService: UserAuthService, private router: Router) {

  }
  ngOnInit(): void {

    this.AllSubscriptions.push(this.authService.isUserLoggedInWithSubject().subscribe(value => {
      this.AlwaysCheckLogin = value
    }));

  }

  ngOnDestroy(): void {
    for (let i = 0; i < this.AllSubscriptions.length; i++) {
      this.AllSubscriptions[i].unsubscribe();
    }
  }

  get getUserEmail(): string | null {
    return this.authService.getUserEmail;
  }

  Logout() {
    this.authService.Logout();
    this.router.navigate(['/Login']);
  }

}

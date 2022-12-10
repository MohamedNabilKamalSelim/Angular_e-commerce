import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserAuthService } from 'src/app/Services/user-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userLoginFG: FormGroup;

  constructor(private authService: UserAuthService, private location: Location,
    private fb: FormBuilder, private snackBar: MatSnackBar, private router: Router) {
    this.userLoginFG = this.fb.group({
      email: ['', Validators.email],
      password: [''],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
  }

  async Login() {
    let result = await this.authService.Login(this.userLoginFG.value);
    if (result.includes('Success'))
      this.router.navigateByUrl('/Products/Order');
    this.SnackBarAlert(result);
  }


  get email() {
    return this.userLoginFG.controls['email'];
  }
  get password() {
    return this.userLoginFG.controls['password'];
  }
  get rememberMe() {
    return this.userLoginFG.controls['rememberMe'];
  }

  private SnackBarAlert(message: string) {
    this.snackBar.open(message, 'Ok', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }

}

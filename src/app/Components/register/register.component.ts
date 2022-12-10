import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/Services/users.service';
import { LoginViewModel } from 'src/app/ViewModels/login-view-model';
import { PasswordMatchValidator } from '../Validators/PasswordMatchValidator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnDestroy {

  registerForm: FormGroup;
  AllSubscription: Subscription[] = [];

  constructor(private fb: FormBuilder,
    private snackBar: MatSnackBar, private router: Router, private usersService: UsersService) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validators: PasswordMatchValidator });
  }
  ngOnDestroy(): void {
    for (let i = 0; i < this.AllSubscription.length; i++) {
      this.AllSubscription[i].unsubscribe();

    }
  }

  get email() {
    return this.registerForm.controls['email'];
  }

  get password() {
    return this.registerForm.controls['password'];
  }

  get confirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }


  async Register() {

    let nextId = 0;

    await this.usersService.GetAllUsersPromise().then(users => {
      nextId = Number(users[0].id) + 1
    })


    let user = {
      id: nextId,
      email: this.email.value,
      password: this.password.value,
      rememberMe: false
    };

    let emailExist = false;
    await this.usersService.CheckIfEmailExists(user.email).then(res => {
      emailExist = res
    });

    if (emailExist) {
      this.SnackBarAlert(`${user.email} is already exists!`);
      return;
    }
    else {
      this.AddNewUser(user);
    }
  }


  private AddNewUser(user: LoginViewModel) {
    this.AllSubscription.push(this.usersService.Register(user).subscribe({
      next: (user: LoginViewModel) => {
        this.SnackBarAlert(`${user.email} Registered successfuly`);
        this.router.navigateByUrl('/Login');
      },
      error: (err: Error) => {
        this.SnackBarAlert(err.message);
      }
    }));
  }

  private SnackBarAlert(message: string) {
    this.snackBar.open(message, 'Ok', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }
}

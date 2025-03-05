import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/Authentication/auth.service';
import { ForgotPasswordService } from '../../core/services/auth/forgot-password.service';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  private readonly forgotPasswordService = inject(ForgotPasswordService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  loading: boolean = false;

  changePasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),

    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/), // Upper, lower, special char
    ]),
  });

  showAlert = false;
  errorMessage = '';

  submit() {
    this.showAlert = false;
    this.errorMessage = '';
    this.loading = true;

    this.forgotPasswordService.forgotPassword(this.changePasswordForm.value).subscribe({
      next: () => {

        // ✅ Log out the user
        this.authService.logout();
        this.loading = false;

        // ✅ Redirect to Login Page
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.showAlert = true;
        this.loading = false;

        this.errorMessage = err.error?.message || 'Something went wrong!';
      }
    });
  }
}

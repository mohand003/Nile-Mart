import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ForgotPasswordService } from '../../core/services/auth/forgot-password.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  private readonly forgotPasswordService = inject(ForgotPasswordService);
  private readonly router = inject(Router);
  loading:boolean = false;

  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  showAlert = false;
  errorMessage = '';

  submit() {
    this.showAlert = false;
    this.errorMessage = '';
    this.loading = true;

    this.forgotPasswordService.forgotPassword(this.forgotPasswordForm.value).subscribe({
      next: (response) => {
        this.loading = false;


        this.router.navigate(['/verify-reset-code']);
      },
      error: (err) => {
        this.showAlert = true;
        this.loading = false;

        this.errorMessage = err.error?.message || 'Something went wrong!';
      }
    });
  }
}

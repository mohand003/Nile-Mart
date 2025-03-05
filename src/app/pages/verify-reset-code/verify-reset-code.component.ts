import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ForgotPasswordService } from '../../core/services/auth/forgot-password.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-reset-code',
  imports: [ReactiveFormsModule],
  templateUrl: './verify-reset-code.component.html',
  styleUrl: './verify-reset-code.component.scss'
})
export class VerifyResetCodeComponent {
  private readonly forgotPasswordService = inject(ForgotPasswordService);
  private readonly router = inject(Router);
  loading:boolean = false;

  verifyCodeForm = new FormGroup({
    resetCode: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  showAlert = false;
  errorMessage = '';

  submit() {
    this.showAlert = false;
    this.errorMessage = '';
    this.loading = true;

    this.forgotPasswordService.verifyResetCode(this.verifyCodeForm.value).subscribe({
      next: () => {

        this.router.navigate(['/change-password']);
        this.loading = false;

      },
      error: (err) => {
        this.showAlert = true;
        this.errorMessage = err.error?.message || 'Invalid reset code!';
        this.loading = false;

      }
    });
  }
}

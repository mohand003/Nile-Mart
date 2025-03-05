import { SignupService } from './../../core/services/signup/signup.service';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/Authentication/auth.service';
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
loading:boolean = false;
  private readonly signupService = inject(SignupService);
    private readonly router = inject(Router)
  private readonly authService = inject(AuthService)
  registerForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/), // Upper, lower, special char
    ]),
    rePassword: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required, Validators.pattern('^01[0125][0-9]{8}$')]),
    
  },{ validators: this.matchPassword });

  errorMessage = ''

  showAlert = false; // Control visibility of alert
  matchPassword(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const rePassword = control.get('rePassword')?.value;
    return password === rePassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    this.showAlert = false;
    this.errorMessage = '';
    this.loading = true;

    if (this.registerForm.invalid) {
      this.showAlert = true;
      this.errorMessage = 'Please fill in all required fields or correct the errors.';
      this.loading = false;
      return;
    }

    this.signupService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.loading = false;

        // ✅ Store Token
        if (response.token) {
          this.authService.saveToken(response.token); 

          // ✅ Redirect to Home Page if Token Exists
          this.router.navigate(['/home']);
        } else {
          // ✅ If No Token, Redirect to Login
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        console.error('Registration failed:', err);
        this.showAlert = true;
        this.errorMessage = err.error?.message || 'Registration failed. Try again!';
        this.loading = false;
      }
    });
  }

}

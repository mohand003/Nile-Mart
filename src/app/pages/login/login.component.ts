import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { SigninService } from '../../core/services/signin/signin.service';
import { AuthService } from '../../core/services/Authentication/auth.service';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  showAlert=false
  errorMessage = '';
 loading = false;
  private readonly router = inject(Router)
  private readonly signinService = inject(SigninService);
  private readonly authService = inject(AuthService);
  loginform: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),

    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/), // Upper, lower, special char
    ]),


  }, );


  Submit() {
    this.showAlert = false;
    this.errorMessage = '';
    this.loading = true;

  console.log(this.loginform.value);
  

    this.signinService.login(this.loginform.value).subscribe({
      next: (response) => {
        

    
        if (this.loginform.valid) {
          if (response.token) {
            this.authService.saveToken(response.token); 
          }
         
          this.loading = false;
          // ✅ Redirect to Home Page if Token Exists
          this.router.navigate(['/home']);
        } 
      },
      error: (err) => {
        console.error('Registration failed:', err);
        this.showAlert = true;
        this.errorMessage = err.error?.message || 'Registration failed. Try again!';
        this.loading = false;
      }
      
    });
  }}

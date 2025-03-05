import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/Authentication/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      // 🚨 If Token is Missing, Redirect to Login
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}

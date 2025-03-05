import { Component, inject, Input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/Authentication/auth.service';
import { CartService } from '../../core/services/cart/cart.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);

  @Input() isLogin: boolean = false;
  cartItemCount: number = 0; // To store the number of cart items

  ngOnInit(): void {
    this.getCartItems();
  }

  Login(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getCartItems(): void {
    if (this.Login()) { // Only fetch cart if user is logged in
      this.cartService.getCart().subscribe({
        next: (response) => {
          this.cartItemCount = response.numOfCartItems || 0;
        },
        error: (error) => {
          console.error('Failed to fetch cart items:', error);
          this.cartItemCount = 0;
        }
      });
    }
  }
}

import { Component, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { log } from 'console';
import { PaymentService } from '../../core/services/Payment/payment.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);
  private readonly paymentService = inject(PaymentService);

  userToken: string = localStorage.getItem('userToken') || '';
  cart: any[] = [];
  totalCartPrice: number = 0;
  loading: boolean = true;
  updating: boolean = false;

  constructor() {
    this.getCart();
  }

  getCart() {
    if (!this.userToken) {
      console.warn("No user token found!");
      return;
    }

    const headers = new HttpHeaders().set('token', this.userToken);
    this.http.get(`${environment.apiUrl}/cart`, { headers })
      .subscribe({
        next: (res: any) => {
          console.log("Cart Data Received:", res);

          if (res && res.data) {
            this.cart = res.data.products || [];
            this.totalCartPrice = res.data.totalCartPrice || 0;
          } else {
            this.cart = [];
            this.totalCartPrice = 0;
            console.warn("Unexpected cart response structure", res);
          }

          this.loading = false;
        },
        error: (err) => {
          console.error("Failed to load cart:", err);
          this.loading = false;
          alert("Failed to load cart. Please try again.");
        }
      });
  }

  updateQuantity(cartItem: any, quantity: number) {
    if (!cartItem || !cartItem.product?._id) {
      return;
    }


    this.cartService.updateProductQuantity(cartItem.product._id, quantity).subscribe({
      next: (response) => {
        this.getCart(); // Refresh cart after update
      },
      error: (err) => {
        console.error("❌ Failed to update quantity:", err);
      }
    });
  }

  processCashPayment() {
    const shippingDetails = {
      details: 'Your shipping address here',
      phone: 'Your phone number here',
      city: 'Your city here'
    };
  

  }



  
  

  removeFromCart(cartItemId: string) {
    if (!this.userToken) return;

    const headers = new HttpHeaders().set('token', this.userToken);
    this.http.delete(`${environment.apiUrl}/cart/${cartItemId}`, { headers })
      .subscribe({
        next: () => this.getCart(),
        error: (err) => console.error("Failed to remove item", err)
      });
  }

  clearCart() {
    if (!this.userToken) return;

    const headers = new HttpHeaders().set('token', this.userToken);
    this.http.delete(`${environment.apiUrl}/cart`, { headers })
      .subscribe({
        next: () => {
          this.cart = [];
          this.totalCartPrice = 0;
        },
        error: (err) => console.error("Failed to clear cart", err)
      });
  }

  paymentroute(){

    this.router.navigate(['/payment'])
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PaymentService } from '../../core/services/Payment/payment.service';
import { AuthService } from '../../core/services/Authentication/auth.service';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  imports: [ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {
  paymentMethod: string = '';
  loading: boolean = false;
  showAlert: boolean = false;
  errorMessage: string = '';
  cartId: string = ''; // Will be dynamically set
  userId: string = ''; // Extracted from token

  private readonly paymentService = inject(PaymentService);
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  shippingForm: FormGroup = new FormGroup({
    details: new FormControl('', Validators.required),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{10,15}$/) // Valid phone number format
    ]),
    city: new FormControl('', Validators.required)
  });

  ngOnInit() {
    this.fetchCartId();
    this.extractUserId();
  }

  // ✅ Fetch the cart ID dynamically
  fetchCartId() {
    this.cartService.getCart().subscribe({
      next: (res) => {
        if (res && res.data && res.data._id) {
          this.cartId = res.data._id;
          console.log("🛒 Cart ID:", this.cartId);
        }
      },
      error: (err) => {
        console.error("❌ Failed to fetch cart ID:", err);
      }
    });
  }

  // ✅ Extract user ID from token
  extractUserId() {
    const token = this.authService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT
      this.userId = payload.id; // Extract user ID from token payload
      console.log("👤 User ID:", this.userId);
    }
  }

  // ✅ Set the payment method when the user selects an option
  setPaymentMethod(method: string) {
    this.paymentMethod = method;
    console.log(`Payment method selected: ${method}`);
  }

  // ✅ Handle form submission
  submitForm() {
    if (this.shippingForm.invalid) {
      this.showAlert = true;
      this.errorMessage = "Please fill in all shipping details correctly.";
      return;
    }

    this.showAlert = false;
    this.loading = true;

    if (this.paymentMethod === 'cash') {
      this.processCashPayment();
    } else if (this.paymentMethod === 'card') {
      this.processCardPayment();
    }
  }

  processCashPayment() {
    if (!this.cartId) {
        this.showAlert = true;
        this.errorMessage = "Cart ID is missing. Please try again.";
        return;
    }

    this.loading = true;
    this.showAlert = false;

    const apiUrl = `https://ecommerce.routemisr.com/api/v1/orders/${this.cartId}`;
    
    const headers = new HttpHeaders().set('token', this.authService.getToken() || '');
    const requestBody = {
        shippingAddress: this.shippingForm.value,
    };

    this.paymentService.createCashOrder(apiUrl, headers, requestBody).subscribe({
        next: (res) => {
            if (res.status === "success" && res.data) {
                
                // ✅ Navigate and force a reload
                this.router.navigate(['/allorders']).then(() => {
                    window.location.reload(); // Ensure orders are refreshed
                });
            } else {
                console.error("❌ Cash order failed:", res);
                this.showAlert = true;
                this.errorMessage = "Failed to place order. Please try again.";
                this.loading = false;
            }
        },
        error: (err) => {
            this.showAlert = true;
            this.errorMessage = "Order processing failed. Try again later.";
            this.loading = false;
        }
    });
}



  processCardPayment() {
    if (!this.cartId) {
        this.showAlert = true;
        this.errorMessage = "Cart ID is missing. Please try again.";
        return;
    }

    this.loading = true;
    this.showAlert = false;

    const apiUrl = `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${this.cartId}?url=http://localhost:4200`;
    
    const headers = new HttpHeaders().set('token', this.authService.getToken() || '');
    
    this.paymentService.createCheckoutSession(apiUrl, headers).subscribe({
        next: (res) => {
            if (res.status === "success" && res.session?.url) {
                window.location.href = res.session.url; 
            } else {
                this.showAlert = true;
                this.errorMessage = "Failed to initiate payment. Please try again.";
                this.loading = false;
            }
        },
        error: (err) => {
            this.showAlert = true;
            this.errorMessage = "Payment initiation failed. Try again later.";
            this.loading = false;
        }
    });
}

}

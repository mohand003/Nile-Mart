import { Component, inject, OnInit } from '@angular/core';
import { PaymentService } from '../../core/services/Payment/payment.service';
import { AuthService } from '../../core/services/Authentication/auth.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { log } from 'console';

@Component({
  selector: 'app-allorders',
  imports:[RouterLink],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.scss'
})
export class AllOrdersComponent implements OnInit {
  orders: any[] = [];
  
  errorMessage = '';
loading:boolean=true;
  private readonly paymentService = inject(PaymentService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

ngOnInit(): void {
  this.fetchOrders()
}
  // ✅ Fetch all orders
  fetchOrders() {
    this.loading = true;
    this.paymentService.getUserOrders().subscribe({
      next: (response) => {
  
        if (Array.isArray(response) && response.length > 0) {
          this.orders = response;  // ✅ Assigning orders
        } else {
          this.orders = [];  // Ensure empty UI when no orders exist
        }
  
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load orders. Please try again.';
        this.loading = false;
      }
    });
  }
  
  
  
  

 
}

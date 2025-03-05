import { Component, inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  products: any[] = [];
  selectedProduct: any = null;
  loading: boolean = true;
  addingToCart: string | null = null;  // Tracks which product is being added
  showNotification: boolean = false;   // Controls notification visibility
  userToken: string | null = null;

  ngOnInit() {
    this.userToken = localStorage.getItem('userToken');
    this.getProducts();
  }

  getProducts() {
    this.http.get(`${environment.apiUrl}/products`).subscribe({
      next: (res: any) => {
        this.products = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  viewDetails(productId: string) {
    this.router.navigate(['/details', productId]); 
}

  viewProduct(product: any) {
    this.selectedProduct = product;
  }

  closeModal() {
    this.selectedProduct = null;
  }

  addToCart(productId: string) {
    if (!this.userToken) {
      this.router.navigate(['/login']);
      return;
    }

    this.addingToCart = productId;
    const headers = new HttpHeaders().set('token', this.userToken);
    const body = { productId, quantity: 1 };

    this.http.post(`${environment.apiUrl}/cart`, body, { headers }).subscribe({
      next: () => {
        this.addingToCart = null;
        this.showNotification = true;
        setTimeout(() => this.showNotification = false, 3000);
      },
      error: () => {
        this.addingToCart = null;
        alert("❌ Failed to add product to cart.");
      }
    });
  }
}

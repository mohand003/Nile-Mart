import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-product-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  product: any = null;
  addingToCart: boolean = false;
  userToken: string | null = localStorage.getItem('userToken');
  loading: boolean = true


  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (!productId) {
      this.router.navigate(['/not-found']);
      return;
    }

    this.http.get(`${environment.apiUrl}/products/${productId}`).subscribe({
      next: (res: any) => {
        this.product = res.data; // Ensure API response has "data"
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/not-found']); // Redirect if product doesn't exist
      }
    });
  }

  addToCart(productId: string) {
    if (!this.userToken) {
      this.router.navigate(['/login']);
      return;
    }

    this.addingToCart = true;
    this.http.post(`${environment.apiUrl}/cart`, { productId: this.product._id, quantity: 1 }, { headers: new HttpHeaders().set('token', this.userToken) }).subscribe(() => {
      this.addingToCart = false;
    });
  }

  goBack() {
    this.router.navigate(['/products']);
  }
}

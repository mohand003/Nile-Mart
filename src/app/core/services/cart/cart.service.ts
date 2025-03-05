import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../Authentication/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private apiUrl = 'https://ecommerce.routemisr.com/api/v1/cart'; // ✅ API URL

  constructor() {}

  updateProductQuantity(productId: string, newCount: number): Observable<any> {
    const headers = new HttpHeaders().set('token', this.authService.getToken() || '');

    const body = {
        productId: productId, // Ensure this matches cart response
        count: newCount
    };


    return this.http.put(`https://ecommerce.routemisr.com/api/v1/cart`, body, { headers });
}

getCart(): Observable<any> {
  const headers = new HttpHeaders().set('token', this.authService.getToken() || '');
  return this.http.get(this.apiUrl, { headers });
}
}

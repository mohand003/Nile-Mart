import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { AuthService } from '../Authentication/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private userToken: string = localStorage.getItem('userToken') || '';

  constructor() {}




  createCheckoutSession(apiUrl: string, headers: HttpHeaders): Observable<any> {
    return this.http.post(apiUrl, {}, { headers });
}

createCashOrder(apiUrl: string, headers: HttpHeaders, body: any): Observable<any> {
  return this.http.post(apiUrl, body, { headers });
}
getUserOrders(): Observable<any> {
  const userId = this.authService.getUserId();
  
  if (!userId) {
    return new Observable(observer => observer.error("User ID not found in token"));
  }

  const headers = new HttpHeaders().set('token', this.authService.getToken() || '');
  const apiUrl = `${environment.apiUrl}/orders/user/${userId}`;

  return this.http.get(apiUrl, { headers });
}

}

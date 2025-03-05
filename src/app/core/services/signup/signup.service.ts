import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private baseUrl = 'https://ecommerce.routemisr.com/api/v1/auth/signup';

  constructor(private http: HttpClient) {}

  // ✅ Register User
  register(userData: any): Observable<any> {
    return this.http.post(this.baseUrl, userData);
  }
}

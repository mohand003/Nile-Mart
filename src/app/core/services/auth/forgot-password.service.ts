import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Request a reset code
  forgotPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/forgotPasswords`, data);
  }

  // Verify the reset code
  verifyResetCode(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/verifyResetCode`, data);
  }

  // Reset the password
  resetPassword(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/auth/resetPassword`, data);
  }
}

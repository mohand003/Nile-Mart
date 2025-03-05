import { isPlatformBrowser } from '@angular/common';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(@Inject (PLATFORM_ID) private platformId:object) {}

  saveToken(token: string) {
    localStorage.setItem('userToken', token);
  }
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('userToken');
    }
    return null;
  }
  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      // Decode the payload from the JWT
      const payload = JSON.parse(atob(token.split('.')[1]));  
      return payload.id || payload.userId || null;  // Adjust key based on backend response
    } catch (error) {
      return null;
    }
  }
  isLoggedIn(): boolean {
    return !!this.getToken(); // ✅ Check if token exists
  }

  logout() {
    localStorage.removeItem('userToken'); // ✅ Clear Token
  }
}

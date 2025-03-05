import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://ecommerce.routemisr.com/api/v1/brands';

  // Get All Brands
  getAllBrands(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  // Get Specific Brand by ID
  getBrandById(brandId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${brandId}`);
  }
}

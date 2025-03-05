import { Component, OnInit, inject } from '@angular/core';
import { BrandsService } from '../../core/services/brands/brands.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {
  private readonly brandsService = inject(BrandsService);
  private readonly router = inject(Router);

  brands: any[] = [];
  selectedBrand: any = null;
  isLoading: boolean = true;

  ngOnInit(): void {
    this.getBrands();
  }

  // Fetch all brands
  getBrands() {
    this.brandsService.getAllBrands().subscribe({
      next: (res) => {
        this.brands = res.data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
  viewBrandDetails(brandId: string) {
    this.router.navigate(['/brands', brandId]);
  }
  // Fetch a specific brand by ID
  getBrandDetails(brandId: string) {
    this.brandsService.getBrandById(brandId).subscribe({
      next: (res) => {
        this.selectedBrand = res;
      },
      error: () => {
      }
    });
  }
}

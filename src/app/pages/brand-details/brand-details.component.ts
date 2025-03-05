import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BrandsService } from '../../core/services/brands/brands.service';
import { log } from 'console';

@Component({
  selector: 'app-brand-details',
  
  templateUrl: './brand-details.component.html',
  styleUrls: ['./brand-details.component.scss']
})
export class BrandDetailsComponent implements OnInit {
  private readonly brandsService = inject(BrandsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  brand: any = null;
  isLoading: boolean = true;

  ngOnInit() {
    const brandId = this.route.snapshot.paramMap.get('id');
    if (brandId) {
      this.getBrandDetails(brandId);
    }
  }
  Backtobrands(){

    this.router.navigate(['/brands'])
  }
  // Fetch brand details
  getBrandDetails(brandId: string) {
    this.brandsService.getBrandById(brandId).subscribe({
      next: (res) => {
        this.brand = res.data;  // ✅ Extract the "data" object
        this.isLoading = false;
      },
      error: () => {
        this.router.navigate(['/brands']);
      }
    });
}

}

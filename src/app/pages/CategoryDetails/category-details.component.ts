import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../../core/services/Categories/categories.service';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.scss']
})
export class CategoryDetailsComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  category: any = null;
  isLoading: boolean = true;

  ngOnInit() {
    const categoryId = this.route.snapshot.paramMap.get('id');
    if (categoryId) {
      this.getCategoryDetails(categoryId);
    }
  }

  getCategoryDetails(categoryId: string) {
    this.categoriesService.getSpecificCatogires(categoryId).subscribe({
      next: (res) => {
        this.category = res.data;  // ✅ Fix: Extract "data"
        console.log('Category Data:', this.category);
        this.isLoading = false;
      },
      error: () => {
        this.router.navigate(['/categories']);
      }
    });
  }

  backToCategories() {
    this.router.navigate(['/categories']);
  }
}

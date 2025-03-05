import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService } from '../../core/services/Categories/categories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  private readonly router = inject(Router);

  categories: any[] = [];
  isLoading: boolean = true;

  ngOnInit() {
    this.fetchCategories();
  }

  fetchCategories() {
    this.categoriesService.getAllCatogires().subscribe({
      next: (res) => {
        this.categories = res.data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        alert('Failed to load categories');
      }
    });
  }

  // Navigate to category details
  viewCategory(categoryId: string) {
    this.router.navigate(['/categories', categoryId]);
  }
}

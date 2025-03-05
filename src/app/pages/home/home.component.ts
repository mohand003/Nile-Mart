import { CategoriesService } from './../../core/services/Categories/categories.service';
import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { iproduct } from '../../shared/interfaces/iproduct';
import { Icatogry } from '../../shared/interfaces/icatogry';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';




@Component({
  selector: 'app-home',
  imports: [CarouselModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

 loading:boolean=true

  userToken: string | null = localStorage.getItem('userToken');
  addingToCart: string | null = null;
  showNotification: boolean = false;

  customMainSlider: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    navSpeed: 700,
    navText: ['', ''],
    items: 1,
    nav: false
  }


  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 6
      }
    },
    nav: false
  }


  isLoading: boolean = true;
  products: iproduct[] = []
  catogries: Icatogry[] = []
  ngOnInit(): void {
    this.getProductsData()
    this.getCategoryData()
  }
  addToCart(productId: string) {
    if (!this.userToken) {
      this.router.navigate(['/login']);
      return;
    }

    this.addingToCart = productId;
    const headers = new HttpHeaders().set('token', this.userToken);
    const body = { productId, quantity: 1 };

    this.http.post(`${environment.apiUrl}/cart`, body, { headers }).subscribe({
      next: () => {
        this.addingToCart = null;
        this.showNotification = true;
        setTimeout(() => this.showNotification = false, 3000);
      },
      error: () => {
        this.addingToCart = null;
        alert("❌ Failed to add product to cart.");
      }
    });
  }


  getProductsData(): void {

    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res.data.slice(0, 10);
this.loading=false
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getCategoryData(): void {

    this.categoriesService.getAllCatogires().subscribe({

      next: (res) => {


        this.catogries = res.data



      },
      error: (err) => {

        console.log(err);


      },
    })
  }



  viewDetails(productId: string) {
    this.router.navigate(['/details', productId]);
  }



}

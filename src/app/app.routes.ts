import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { AuthGuard } from './core/guards/auth/auth.guard';

export const routes: Routes = [  // ✅ Exporting the routes
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    {
        path: '', component: AuthLayoutComponent, children: [
            { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent), title: 'login' },
            { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent), title: 'register' },
            { path: 'forgot-password', loadComponent: () => import('./pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent), title: 'forgot-password' },
            { path: 'change-password', loadComponent: () => import('./pages/change-password/change-password.component').then(m => m.ChangePasswordComponent), title: 'change-password' },
            { path: 'verify-reset-code', loadComponent: () => import('./pages/verify-reset-code/verify-reset-code.component').then(m => m.VerifyResetCodeComponent), title: 'verify-reset-code' },

        ]
    },

    {
        path: '', component: BlankLayoutComponent,
        children: [
            { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent), title: 'home' },
            { path: 'cart', loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent), title: 'cart', canActivate: [AuthGuard] },
            { path: 'brands', loadComponent: () => import('./pages/brands/brands.component').then(m => m.BrandsComponent), title: 'brands', canActivate: [AuthGuard] },
            {
                path: 'brands/:id',
                loadComponent: () => import('./pages/brand-details/brand-details.component')
                    .then(m => m.BrandDetailsComponent),
                title: 'brands-Detail',
                canActivate: [AuthGuard],
            }, { path: 'products', loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent), title: 'products', canActivate: [AuthGuard] },
            { path: 'categories', loadComponent: () => import('./pages/categories/categories.component').then(m => m.CategoriesComponent), title: 'categories', canActivate: [AuthGuard] },
            {
                path: 'categories/:id',
                loadComponent: () => import('./pages/CategoryDetails/category-details.component')
                    .then(m => m.CategoryDetailsComponent),
                title: 'categories',
                canActivate: [AuthGuard],
            }, { path: 'payment', loadComponent: () => import('./pages/payment/payment.component').then(m => m.PaymentComponent), title: 'payment', canActivate: [AuthGuard] },
            { path: 'allorders', loadComponent: () => import('./pages/allorders/allorders.component').then(m => m.AllOrdersComponent), title: 'Orders', canActivate: [AuthGuard] },

            {
                path: 'details/:id',
                loadComponent: () => import('./pages/details/details.component')
                    .then(m => m.ProductDetailsComponent),
                title: 'Product Details',
                canActivate: [AuthGuard],
            },
            { path: '**', loadComponent: () => import('./pages/notfound/notfound.component').then(m => m.NotfoundComponent) },
        ]
    }
];

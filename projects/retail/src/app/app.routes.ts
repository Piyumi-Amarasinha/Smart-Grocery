import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/product-list/product-list.component').then((m) => m.ProductListComponent),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./pages/product-detail/product-detail.component').then((m) => m.ProductDetailComponent),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout/checkout.component').then((m) => m.CheckoutComponent),
  },
  {
    path: 'order-confirmed/:id',
    loadComponent: () =>
      import('./pages/order-confirmed/order-confirmed.component').then((m) => m.OrderConfirmedComponent),
  },
  { path: '**', redirectTo: 'products' },
];

import { Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { ViewProductDetailsComponent } from './components/view-product-details/view-product-details.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent },
  { path: 'products/new', component: AddProductComponent },
  { path: 'products/:id/edit', component: EditProductComponent },
  { path: 'products/:id', component: ViewProductDetailsComponent },
];

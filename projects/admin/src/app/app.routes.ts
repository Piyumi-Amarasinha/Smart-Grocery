import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProductsComponent } from './components/products/products.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { ViewProductDetailsComponent } from './components/view-product-details/view-product-details.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'products', component: ProductsComponent, canActivate: [authGuard] },
  { path: 'products/new', component: AddProductComponent, canActivate: [authGuard] },
  { path: 'products/:id/edit', component: EditProductComponent, canActivate: [authGuard] },
  { path: 'products/:id', component: ViewProductDetailsComponent, canActivate: [authGuard] },
];

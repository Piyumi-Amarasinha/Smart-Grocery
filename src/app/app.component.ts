import { Component } from '@angular/core';
import { ProductsComponent } from './components/products/products.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { ViewProductDetailsComponent } from './components/view-product-details/view-product-details.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ProductsComponent,
    AddProductComponent,
    EditProductComponent,
    ViewProductDetailsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Smart-Grocery';
}

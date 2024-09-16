import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductsComponent } from './components/products/products.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';

@NgModule({
  declarations: [
    // AppComponent,
    // ProductsComponent,
    // AddProductComponent,
    // EditProductComponent,
  ],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [],
})
export class AppModule {}

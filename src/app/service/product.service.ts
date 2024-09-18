import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { from } from 'rxjs';
import { Product } from '../model/product.model';
import { AddProductResponse } from '../model/add-product-response.model';
import { ProductResponse } from '../model/product-response.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://192.168.8.1/html/home.html';

  // Method to add a product using fetch
  addProduct(product: Product): Observable<AddProductResponse> {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    };

    // Using from() to convert promise to observable
    return from(
      fetch(`${this.baseUrl}/api/product`, options)
        .then((response) => response.json())
        .then((data) => data as AddProductResponse)
    );
  }

  // Method to get products using fetch
  getProducts(): Observable<ProductResponse> {
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };
    // Using from() to convert promise to observable
    return from(
      fetch(`${this.baseUrl}/api/product`, options)
        .then((response) => response.json())
        .then((data) => data as ProductResponse)
    );
  }

  // Method to put products using fetch
  updateProducts(product: Product): Observable<ProductResponse> {
    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    };
    // Using from() to convert promise to observable
    return from(
      fetch(`${this.baseUrl}/api/product`, options)
        .then((response) => response.json())
        .then((data) => data as ProductResponse)
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductDetailResponse, ProductResponse, AddProductResponse } from '../models/product.model';
import { OrderRequest, OrderResponse } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  private readonly base = '/api/products';
  private readonly ordersBase = '/api/orders';

  constructor(private readonly http: HttpClient) {}

  getProducts(): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(this.base);
  }

  getProduct(id: number): Observable<ProductDetailResponse> {
    return this.http.get<ProductDetailResponse>(`${this.base}/${id}`);
  }

  addProduct(product: Partial<Product>): Observable<AddProductResponse> {
    return this.http.post<AddProductResponse>(this.base, product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<ProductDetailResponse> {
    return this.http.put<ProductDetailResponse>(`${this.base}/${id}`, product);
  }

  deleteProduct(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }

  placeOrder(order: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.ordersBase, order);
  }
}

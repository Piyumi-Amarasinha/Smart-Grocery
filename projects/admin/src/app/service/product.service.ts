import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Product } from '../model/product.model';
import { AddProductResponse } from '../model/add-product-response.model';
import { ProductResponse } from '../model/product-response.model';
import { ProductDetailResponse } from '../model/product-detail-response.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = '/api/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductResponse> {
    return this.http
      .get<ProductResponse>(this.baseUrl)
      .pipe(catchError(this.handleError));
  }

  getProduct(id: number): Observable<ProductDetailResponse> {
    return this.http
      .get<ProductDetailResponse>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  addProduct(product: Product): Observable<AddProductResponse> {
    return this.http
      .post<AddProductResponse>(this.baseUrl, product)
      .pipe(catchError(this.handleError));
  }

  updateProduct(
    id: number,
    product: Product
  ): Observable<ProductDetailResponse> {
    return this.http
      .put<ProductDetailResponse>(`${this.baseUrl}/${id}`, product)
      .pipe(catchError(this.handleError));
  }

  deleteProduct(id: number): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: unknown) {
    return throwError(() => error);
  }
}

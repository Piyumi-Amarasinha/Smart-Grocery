import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../model/product.model';
import { ProductService } from '../../service/product.service';
import {
  isExpired,
  isExpiringSoon,
  isLowStock,
} from '../../utils/inventory.utils';

@Component({
  selector: 'app-view-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './view-product-details.component.html',
  styleUrl: './view-product-details.component.css',
})
export class ViewProductDetailsComponent implements OnInit {
  product: Product | null = null;
  isLoading = false;
  loadError: string | null = null;

  readonly isLowStock = isLowStock;
  readonly isExpiringSoon = isExpiringSoon;
  readonly isExpired = isExpired;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoading = true;
    this.productService.getProduct(id).subscribe({
      next: (res) => {
        this.product = res.data;
        this.isLoading = false;
      },
      error: () => {
        this.loadError = 'Could not load this product.';
        this.isLoading = false;
      },
    });
  }
}

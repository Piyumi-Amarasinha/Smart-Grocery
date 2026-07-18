import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product, ProductApiService } from 'shared';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | null>(null);
  isLoading = signal(true);
  loadError = signal<string | null>(null);
  qty = signal(1);
  added = signal(false);

  constructor(
    private route: ActivatedRoute,
    private api: ProductApiService,
    public cart: CartService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getProduct(id).subscribe({
      next: (res) => { this.product.set(res.data); this.isLoading.set(false); },
      error: () => { this.loadError.set('Product not found.'); this.isLoading.set(false); },
    });
  }

  increment(): void { this.qty.set(this.qty() + 1); }
  decrement(): void { if (this.qty() > 1) this.qty.set(this.qty() - 1); }

  addToCart(): void {
    const p = this.product();
    if (!p) return;
    this.cart.addItem(p, this.qty());
    this.added.set(true);
    setTimeout(() => this.added.set(false), 1500);
  }
}

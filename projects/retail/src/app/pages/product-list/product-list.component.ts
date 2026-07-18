import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product, ProductApiService } from 'shared';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products = signal<Product[]>([]);
  isLoading = signal(true);
  loadError = signal<string | null>(null);
  searchTerm = signal('');
  selectedCategory = signal('all');
  addedIds = signal<Set<number>>(new Set());

  categories = computed(() => {
    const unique = new Set(this.products().map((p) => p.category));
    return Array.from(unique).sort();
  });

  filtered = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const cat = this.selectedCategory();
    return this.products().filter((p) => {
      const matchesTerm = !term || p.productName.toLowerCase().includes(term) || p.category.toLowerCase().includes(term);
      const matchesCat = cat === 'all' || p.category === cat;
      return matchesTerm && matchesCat;
    });
  });

  constructor(private api: ProductApiService, public cart: CartService) {}

  ngOnInit(): void {
    this.api.getProducts().subscribe({
      next: (res) => { this.products.set(res.data); this.isLoading.set(false); },
      error: () => { this.loadError.set('Could not load products.'); this.isLoading.set(false); },
    });
  }

  onSearch(e: Event): void {
    this.searchTerm.set((e.target as HTMLInputElement).value);
  }

  onCategory(e: Event): void {
    this.selectedCategory.set((e.target as HTMLSelectElement).value);
  }

  addToCart(product: Product): void {
    this.cart.addItem(product);
    const ids = new Set(this.addedIds());
    ids.add(product.productId);
    this.addedIds.set(ids);
    setTimeout(() => {
      const updated = new Set(this.addedIds());
      updated.delete(product.productId);
      this.addedIds.set(updated);
    }, 1500);
  }

  isAdded(id: number): boolean {
    return this.addedIds().has(id);
  }
}

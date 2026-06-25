import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../model/product.model';
import { ProductService } from '../../service/product.service';
import {
  isExpired,
  isExpiringSoon,
  isLowStock,
} from '../../utils/inventory.utils';

type StockFilter = 'all' | 'low' | 'expiring' | 'expired';
type SortKey = 'productName' | 'quantity' | 'unitPrice' | 'expireDate';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  constructor(private productService: ProductService) {}

  readonly pageSize = PAGE_SIZE;
  readonly isLowStock = isLowStock;
  readonly isExpiringSoon = isExpiringSoon;
  readonly isExpired = isExpired;

  products = signal<Product[]>([]);
  isLoading = signal(false);
  loadError = signal<string | null>(null);

  searchTerm = signal('');
  categoryFilter = signal('all');
  stockFilter = signal<StockFilter>('all');
  sortKey = signal<SortKey>('productName');
  sortDir = signal<'asc' | 'desc'>('asc');
  currentPage = signal(1);

  categories = computed(() => {
    const unique = new Set(this.products().map((p) => p.category));
    return Array.from(unique).sort();
  });

  summary = computed(() => {
    const products = this.products();
    return {
      lowStock: products.filter(isLowStock).length,
      expiringSoon: products.filter(isExpiringSoon).length,
      expired: products.filter(isExpired).length,
    };
  });

  filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const category = this.categoryFilter();
    const stock = this.stockFilter();

    return this.products().filter((product) => {
      const matchesTerm =
        !term ||
        product.productName.toLowerCase().includes(term) ||
        product.productDescription.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);

      const matchesCategory =
        category === 'all' || product.category === category;

      const matchesStock =
        stock === 'all' ||
        (stock === 'low' && isLowStock(product)) ||
        (stock === 'expiring' && isExpiringSoon(product)) ||
        (stock === 'expired' && isExpired(product));

      return matchesTerm && matchesCategory && matchesStock;
    });
  });

  sortedProducts = computed(() => {
    const key = this.sortKey();
    const dir = this.sortDir() === 'asc' ? 1 : -1;
    return [...this.filteredProducts()].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * dir;
      }
      return String(aVal).localeCompare(String(bVal)) * dir;
    });
  });

  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.sortedProducts().length / this.pageSize))
  );

  pagedProducts = computed(() => {
    const page = this.currentPage();
    const start = (page - 1) * this.pageSize;
    return this.sortedProducts().slice(start, start + this.pageSize);
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.loadError.set(null);
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products.set(res.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.loadError.set(
          'Could not load products. Is the API running (npm run api)?'
        );
        this.isLoading.set(false);
      },
    });
  }

  onSearchChange(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
    this.currentPage.set(1);
  }

  onCategoryChange(event: Event): void {
    this.categoryFilter.set((event.target as HTMLSelectElement).value);
    this.currentPage.set(1);
  }

  onStockFilterChange(event: Event): void {
    this.stockFilter.set(
      (event.target as HTMLSelectElement).value as StockFilter
    );
    this.currentPage.set(1);
  }

  toggleSort(key: SortKey): void {
    if (this.sortKey() === key) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }
    this.currentPage.set(page);
  }

  deleteProduct(product: Product): void {
    if (!confirm(`Delete "${product.productName}"? This cannot be undone.`)) {
      return;
    }
    this.productService.deleteProduct(product.productId).subscribe({
      next: () => this.loadProducts(),
      error: () => this.loadError.set('Failed to delete product.'),
    });
  }
}

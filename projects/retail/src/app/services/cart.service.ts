import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from 'shared';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly CART_KEY = 'sg_cart';
  private cartSubject = new BehaviorSubject<CartItem[]>(this.load());

  cart$ = this.cartSubject.asObservable();

  get items(): CartItem[] {
    return this.cartSubject.value;
  }

  get count(): number {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  get total(): number {
    return this.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  }

  addItem(product: { productId: number; productName: string; imageUrl?: string; unitPrice: number }, qty = 1): void {
    const items = [...this.items];
    const idx = items.findIndex((i) => i.productId === product.productId);
    if (idx >= 0) {
      items[idx] = { ...items[idx], quantity: items[idx].quantity + qty };
    } else {
      items.push({ ...product, quantity: qty });
    }
    this.save(items);
  }

  updateQty(productId: number, quantity: number): void {
    if (quantity < 1) return this.removeItem(productId);
    const items = this.items.map((i) => i.productId === productId ? { ...i, quantity } : i);
    this.save(items);
  }

  removeItem(productId: number): void {
    this.save(this.items.filter((i) => i.productId !== productId));
  }

  clearCart(): void {
    this.save([]);
  }

  private load(): CartItem[] {
    try {
      return JSON.parse(localStorage.getItem(this.CART_KEY) ?? '[]');
    } catch {
      return [];
    }
  }

  private save(items: CartItem[]): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(items));
    this.cartSubject.next(items);
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  constructor(public cart: CartService) {}

  updateQty(productId: number, e: Event): void {
    const qty = Number((e.target as HTMLInputElement).value);
    this.cart.updateQty(productId, qty);
  }
}

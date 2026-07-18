import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductApiService } from 'shared';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {
  form: FormGroup;
  isSubmitting = false;
  submitError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ProductApiService,
    public cart: CartService,
    private router: Router
  ) {
    this.form = this.fb.group({
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPhone: [''],
      deliveryAddress: ['', Validators.required],
    });
  }

  get f() { return this.form.controls; }

  onSubmit(): void {
    if (this.form.invalid || !this.cart.items.length) return;
    this.isSubmitting = true;
    this.submitError = null;

    this.api.placeOrder({
      ...this.form.value,
      items: this.cart.items,
      total: this.cart.total,
    }).subscribe({
      next: (res) => {
        this.cart.clearCart();
        this.router.navigate(['/order-confirmed', res.orderId]);
      },
      error: () => {
        this.isSubmitting = false;
        this.submitError = 'Failed to place order. Please try again.';
      },
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../../model/product.model';
import { ProductService } from '../../service/product.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  isSubmitting = false;
  submitError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      productDescription: ['', Validators.required],
      category: ['', Validators.required],
      brand: ['', Validators.required],
      batchNumber: ['', Validators.required],
      expireDate: ['', Validators.required],
      manufacturedDate: ['', Validators.required],
      unitPrice: ['', [Validators.required, Validators.min(1)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
    });
  }

  get f() {
    return this.productForm.controls;
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }
    const product = {
      ...this.productForm.value,
      createdDate: new Date().toISOString().slice(0, 10),
    } as Product;

    this.isSubmitting = true;
    this.submitError = null;
    this.productService.addProduct(product).subscribe({
      next: () => this.router.navigate(['/products']),
      error: () => {
        this.isSubmitting = false;
        this.submitError = 'Failed to add product. Please try again.';
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }
}

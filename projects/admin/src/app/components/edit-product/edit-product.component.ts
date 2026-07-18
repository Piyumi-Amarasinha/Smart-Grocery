import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../model/product.model';
import { ProductService } from '../../service/product.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent implements OnInit {
  productForm!: FormGroup;
  productId!: number;
  createdDate!: string;
  isLoading = false;
  isSubmitting = false;
  loadError: string | null = null;
  submitError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
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
      imageUrl: [''],
    });

    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoading = true;
    this.productService.getProduct(this.productId).subscribe({
      next: (res) => {
        this.productForm.patchValue(res.data);
        this.createdDate = res.data.createdDate;
        this.isLoading = false;
      },
      error: () => {
        this.loadError = 'Could not load this product.';
        this.isLoading = false;
      },
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
      productId: this.productId,
      createdDate: this.createdDate,
    } as Product;

    this.isSubmitting = true;
    this.submitError = null;
    this.productService.updateProduct(this.productId, product).subscribe({
      next: () => this.router.navigate(['/products']),
      error: () => {
        this.isSubmitting = false;
        this.submitError = 'Failed to update product. Please try again.';
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }
}

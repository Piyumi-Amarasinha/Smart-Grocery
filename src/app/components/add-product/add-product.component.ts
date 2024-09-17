import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Product } from '../../model/product.model';
import { ProductService } from '../../service/product.service';
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;

  isDataUploading = true;
  @Output() productAddEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() closeAddEvent: EventEmitter<void> = new EventEmitter<void>();
  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      brand: ['', Validators.required],
      expireDate: ['', Validators.required],
      manufacturedDate: ['', Validators.required],
      batchNumber: ['', Validators.required],
      unitPrice: ['', [Validators.required, Validators.min(1)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      createdDate: ['', Validators.required],
    });
  }

  get f() {
    return this.productForm.controls;
  }

  onSubmit() {
    const values = this.productForm.value as Product;
    values.createdDate = new Date().toDateString();
    this.isDataUploading = true;
    this.productService.addProduct(values as Product).subscribe((res) => {
      debugger;
      this.isDataUploading = false;
      this.productAddEvent.emit();
      this.productForm.reset();
    });
  }

  cancel() {
    this.closeAddEvent.emit();
  }
}

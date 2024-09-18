import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProductComponent } from '../add-product/add-product.component';
import { EventEmitter, Output } from '@angular/core';
import { Product } from '../../model/product.model';
import { ProductService } from '../../service/product.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    CommonModule,
    AddProductComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent implements OnInit {
  @Input() product!: Product;
  isDataUploading = false;
  @Output() editProductEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancelEditEvent: EventEmitter<void> = new EventEmitter<void>();
  constructor(private productService: ProductService) {}

  ngOnInit(): void {}
  cancel() {
    this.cancelEditEvent.emit();
  }

  onSubmit() {
    this.isDataUploading = true;
    this.productService.updateProducts(this.product).subscribe(() => {
      this.isDataUploading = false;
      this.editProductEvent.emit();
      this.cancelEditEvent.emit();
    });
  }
}

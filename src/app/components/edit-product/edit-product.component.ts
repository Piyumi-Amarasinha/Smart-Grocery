import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProductComponent } from '../add-product/add-product.component';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, AddProductComponent],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent {}

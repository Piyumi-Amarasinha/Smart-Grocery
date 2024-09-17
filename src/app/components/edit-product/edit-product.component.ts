import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProductComponent } from '../add-product/add-product.component';
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, AddProductComponent],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent implements OnInit {
  @Input() productId!: number;
  @Output() cancelEditEvent: EventEmitter<void> = new EventEmitter<void>();
  constructor() {}

  ngOnInit(): void {}
  cancel() {
    this.cancelEditEvent.emit();
  }
}

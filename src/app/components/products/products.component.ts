import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../model/product.model';
import { ProductService } from '../../service/product.service';
import { AddProductComponent } from '../add-product/add-product.component';
import { EditProductComponent } from '../edit-product/edit-product.component';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, AddProductComponent, EditProductComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  constructor(
    private cdr: ChangeDetectorRef,
    private productServise: ProductService
  ) {}

  public firstroductitemName = 'White Basmathi Rice';
  public isLowInventory = false;
  public dhalStorage = 10;
  // public isRowSelected: boolean;
  public rowIndex!: number;
  showAddProduct!: boolean;
  isLoading: boolean = false;
  showEditProduct!: boolean;

  ngOnInit(): void {
    this.checkDhalStorage();
    this.getProduct();
  }

  public products: Product[] = [];

  public selectProduct(selectedRow: number): void {
    // this.isRowSelected = true;
    this.rowIndex = selectedRow;
  }

  showAddProducts() {
    this.showAddProduct = true;
  }

  hideAddProducts() {
    this.showAddProduct = false;
  }

  getProduct() {
    this.isLoading = true;
    this.productServise.getProducts().subscribe((res) => {
      this.products = res.data;
      this.isLoading = false;
    });
  }

  refresh() {
    this.getProduct();
  }

  openEditProductView() {
    this.showEditProduct = true;
  }

  public getDhalStorage() {
    return this.dhalStorage;
  }

  public checkDhalStorage() {
    if (this.dhalStorage < 50) {
      this.isLowInventory = true;
      this.cdr.detectChanges();
    }
  }
}

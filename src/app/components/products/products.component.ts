import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {}

  public firstroductitemName = 'White Basmathi Rice';
  public isLowInventory = false;
  public dhalStorage = 10;

  ngOnInit(): void {
    this.checkDhalStorage();
  }

  public getDhalStorage() {
    return this.dhalStorage;
  }

  public checkDhalStorage() {
    if (this.dhalStorage < 50) {
      this.isLowInventory = true;
      this.cdr.detectChanges(); // Ensures change detection is triggered after updating the variable
    }
  }
}

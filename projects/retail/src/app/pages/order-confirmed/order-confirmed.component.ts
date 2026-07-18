import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-confirmed',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-confirmed.component.html',
  styleUrls: ['./order-confirmed.component.css'],
})
export class OrderConfirmedComponent {
  orderId: string;
  constructor(route: ActivatedRoute) {
    this.orderId = route.snapshot.paramMap.get('id') ?? '';
  }
}

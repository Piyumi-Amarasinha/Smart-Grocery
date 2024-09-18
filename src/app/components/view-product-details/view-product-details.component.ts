import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-product-details',
  standalone: true,
  imports: [],
  templateUrl: './view-product-details.component.html',
  styleUrl: './view-product-details.component.css',
})
export class ViewProductDetailsComponent implements OnInit {
  childMessage: string = 'message from child';
  constructor() {}

  ngOnInit(): void {}
}

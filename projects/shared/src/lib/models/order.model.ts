import { CartItem } from './cart-item.model';

export interface OrderRequest {
  items: CartItem[];
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  deliveryAddress: string;
}

export interface OrderResponse {
  message: string;
  orderId: number;
}

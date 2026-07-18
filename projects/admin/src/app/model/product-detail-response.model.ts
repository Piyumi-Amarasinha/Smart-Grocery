import { Product } from './product.model';

export interface ProductDetailResponse {
  message: string;
  data: Product;
}

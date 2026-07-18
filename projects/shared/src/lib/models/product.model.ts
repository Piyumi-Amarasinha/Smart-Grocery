export interface Product {
  productId: number;
  productName: string;
  productDescription: string;
  category: string;
  brand: string;
  batchNumber: string;
  expireDate: string;
  manufacturedDate: string;
  createdDate: string;
  quantity: number;
  unitPrice: number;
  imageUrl?: string;
}

export interface ProductResponse {
  message: string;
  data: Product[];
}

export interface ProductDetailResponse {
  message: string;
  data: Product;
}

export interface AddProductResponse {
  message: string;
  id: number;
}

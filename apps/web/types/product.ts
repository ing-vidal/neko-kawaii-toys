export type ProductCategory = string;

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image: string;
  stock: number;
  rating: number;
  reviews: number;
}

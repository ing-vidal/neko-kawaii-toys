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
  /** Si es true, el producto tiene un precio de oferta activo */
  hasOffer?: boolean;
  /** Precio de oferta. Solo válido cuando hasOffer === true */
  offerPrice?: number | null;
}

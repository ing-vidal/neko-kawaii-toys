export type ProductCategory = string;

export type ProductStatus = 'active' | 'inactive';

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
  /** SKU opcional para identificación en catálogo */
  sku?: string;
  /** Estado del producto: activo o inactivo */
  status?: ProductStatus;
  /** Fecha de creación ISO 8601 */
  createdAt?: string;
  /** Si es true, el producto tiene un precio de oferta activo */
  hasOffer?: boolean;
  /** Precio de oferta. Solo válido cuando hasOffer === true */
  offerPrice?: number | null;
  /** Indica si el producto tiene un Reel/Video asociado (Instagram) */
  hasReel?: boolean;
  /** URL del Reel (normalmente Instagram) */
  reelUrl?: string | null;
}

import type { Product } from '@product-types/product';

type PriceFields = Pick<Product, 'price' | 'hasOffer' | 'offerPrice'>;

/**
 * Devuelve true únicamente cuando el producto tiene una oferta válida:
 * hasOffer === true, offerPrice es número positivo y menor al precio normal.
 */
export function hasValidOffer(product: PriceFields): boolean {
  return (
    product.hasOffer === true &&
    typeof product.offerPrice === 'number' &&
    product.offerPrice > 0 &&
    product.offerPrice < product.price
  );
}

/**
 * Precio efectivo para ordenamiento, filtros y cálculos.
 * Usa offerPrice cuando la oferta es válida, de lo contrario price.
 */
export function getEffectivePrice(product: PriceFields): number {
  return hasValidOffer(product) ? (product.offerPrice as number) : product.price;
}

/**
 * Porcentaje de descuento redondeado (0 si no hay oferta válida).
 * Ejemplo: price=599, offerPrice=449 → 25
 */
export function getDiscountPercent(product: PriceFields): number {
  if (!hasValidOffer(product)) return 0;
  return Math.round((1 - (product.offerPrice as number) / product.price) * 100);
}

/**
 * Ahorro en dinero (0 si no hay oferta válida).
 * Ejemplo: price=599, offerPrice=449 → 150
 */
export function getSavings(product: PriceFields): number {
  if (!hasValidOffer(product)) return 0;
  return product.price - (product.offerPrice as number);
}

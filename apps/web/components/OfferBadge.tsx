'use client';

import { getDiscountPercent } from '@lib/offers';
import type { Product } from '@product-types/product';

interface OfferBadgeProps {
  product: Pick<Product, 'price' | 'hasOffer' | 'offerPrice'>;
  /** 'sm' for cards, 'md' for detail page */
  size?: 'sm' | 'md';
}

/**
 * Badge animado de oferta.
 * Aparece con un pequeño rebote al entrar al DOM (badge-pop CSS).
 * Queda estático después — no rebota continuamente.
 */
export function OfferBadge({ product, size = 'sm' }: OfferBadgeProps) {
  const pct = getDiscountPercent(product);
  if (pct === 0) return null;

  const base =
    'offer-badge inline-flex items-center gap-1 rounded-full font-black text-textPrimary ' +
    'bg-gradient-to-r from-softPink to-lavender border border-white/60 shadow-md ' +
    'select-none pointer-events-none';

  const sizes =
    size === 'md'
      ? 'px-3 py-1.5 text-xs sm:text-sm gap-1.5'
      : 'px-2.5 py-1 text-[10px] sm:text-xs';

  return (
    <span className={`${base} ${sizes}`}>
      🔥 -{pct}%
    </span>
  );
}

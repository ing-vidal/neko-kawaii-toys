'use client';

import { useReducedMotion } from 'framer-motion';
import type { Product } from '@product-types/product';
import React from 'react';
import { hasValidOffer, getDiscountPercent, getSavings } from '@lib/offers';

type PriceFields = Pick<Product, 'price' | 'hasOffer' | 'offerPrice'>;

interface PriceDisplayProps {
  product: PriceFields;
  /**
   * card   — compacto, para ProductCard
   * detail — completo, para ProductDetails (incluye "Ahorras $XX")
   */
  variant: 'card' | 'detail';
  reelButton?: React.ReactNode;
}

/**
 * Muestra el precio de un producto con soporte de ofertas.
 * Cuando hay oferta, el precio destaca con:
 * - animación "price-pop" al aparecer (CSS, una sola vez)
 * - glow rosa sutil permanente
 * Respeta prefers-reduced-motion mediante la clase CSS.
 */
export function PriceDisplay({ product, variant, reelButton }: PriceDisplayProps) {
  const isOffer = hasValidOffer(product);
  const shouldReduceMotion = useReducedMotion();

  const offerPriceClasses = [
    'offer-price-glow',
    !shouldReduceMotion ? 'price-pop' : '',
  ]
    .filter(Boolean)
    .join(' ');

  /* ─── VARIANTE CARD ────────────────────────────────────────────── */
  if (variant === 'card') {
    if (!isOffer) {
      return (
        <span className="block text-2xl font-black text-textPrimary">
          ${product.price}
        </span>
      );
    }

    const pct = getDiscountPercent(product);

    return (
      <div className="space-y-0.5 min-w-0">
        {/* Badge de descuento */}
        <span className="inline-flex items-center rounded-full bg-gradient-to-r from-softPink to-lavender px-2 py-0.5 text-[10px] font-black text-textPrimary border border-white/60 shadow-sm">
          🏷️ -{pct}%
        </span>
        {/* Precio normal tachado */}
        <span className="block text-sm font-semibold text-[#8C84A2] line-through">
          ${product.price}
        </span>
        {/* Precio de oferta destacado con pop + glow */}
        <span className={`block text-2xl font-black text-[#C44A70] ${offerPriceClasses}`}>
          ${product.offerPrice}
        </span>
      </div>
    );
  }

  /* ─── VARIANTE DETAIL ──────────────────────────────────────────── */
  if (!isOffer) {
    return (
      <div className="rounded-3xl bg-gradient-to-tr from-softPink/5 to-sky/5 border border-softPink/15 p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[#8C84A2] font-bold">Precio</p>
        <p className="mt-2 text-3xl font-black text-textPrimary">${product.price}</p>
      </div>
    );
  }

  const pct = getDiscountPercent(product);
  const savings = getSavings(product);

  return (
    <div className="rounded-3xl bg-gradient-to-tr from-softPink/5 to-sky/5 border border-softPink/15 p-5 space-y-2">
      {/* Encabezado con badge */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-xs uppercase tracking-[0.2em] text-[#8C84A2] font-bold">Precio</p>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-gradient-to-r from-softPink to-lavender px-2.5 py-1 text-[11px] font-black text-textPrimary border border-white/60 shadow-sm">
            🏷️ -{pct}%
          </span>
          {/** Render optional reel button next to badge */}
          {reelButton}
        </div>
      </div>
      {/* Precio normal tachado */}
      <p className="text-base font-semibold text-[#8C84A2] line-through">${product.price}</p>
      {/* Precio de oferta con pop + glow */}
      <p className={`text-3xl font-black text-[#C44A70] ${offerPriceClasses}`}>
        ${product.offerPrice}
      </p>
      {/* Ahorro */}
      <p className="text-sm font-bold text-[#5D4E6D]/70">
        ✨ Ahorras ${savings}
      </p>
    </div>
  );
}

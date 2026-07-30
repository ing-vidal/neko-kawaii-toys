'use client';

import { RatingStars } from './RatingStars';
import { Button } from './Button';
import { ImageOrFallback } from './ImageOrFallback';
import { useCart } from '@hooks/useCart';
import type { Product } from '@product-types/product';
import { PriceDisplay } from './PriceDisplay';

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const { addProduct } = useCart();

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] animate-fade-in-up">
      <div className="rounded-[32px] sm:rounded-[36px] border border-softPink/20 bg-white/70 backdrop-blur-sm p-6 shadow-soft">
        <div className="overflow-hidden rounded-[26px] bg-gradient-to-tr from-softPink/10 via-surface/40 to-sky/25 p-6 sm:p-8">
          <ImageOrFallback src={product.image} alt={product.name} width={540} height={540} className="mx-auto h-[420px] w-full object-contain transition-transform duration-500 hover:scale-105" />
        </div>
      </div>
      <div className="space-y-6">
        <div className="rounded-[32px] sm:rounded-[36px] border border-softPink/20 bg-white/70 backdrop-blur-sm p-8 shadow-soft">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] bg-gradient-to-r from-softPink via-[#5D4E6D] to-lavender bg-clip-text text-transparent">Detalle del producto</p>
              <h1 className="mt-3 text-3xl font-black text-textPrimary">{product.name}</h1>
            </div>
            <span className="rounded-full bg-softPink text-textPrimary px-4.5 py-2 text-xs sm:text-sm font-bold shadow-sm border border-white/40">{product.category}</span>
          </div>

          <div className="mt-6 space-y-5 text-[#5D4E6D]/85 leading-7 font-medium">
            <p>{product.description}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <PriceDisplay product={product} variant="detail" />
              <div className="rounded-3xl bg-gradient-to-tr from-softPink/5 to-sky/5 border border-softPink/15 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8C84A2] font-bold">Stock</p>
                <p className="mt-2 text-3xl font-black text-textPrimary">{product.stock}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2">
              <div className="flex items-center gap-3">
                <RatingStars rating={product.rating} />
                <span className="text-sm text-[#8C84A2] font-semibold">({product.reviews} reseñas)</span>
              </div>
            </div>
          </div>

          <Button type="button" onClick={() => addProduct(product)} className="mt-6 w-full py-4 text-base">
            Agregar al carrito
          </Button>
        </div>
      </div>
    </div>
  );
}

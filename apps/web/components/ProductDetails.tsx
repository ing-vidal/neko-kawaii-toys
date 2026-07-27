'use client';

import { RatingStars } from './RatingStars';
import { Button } from './Button';
import { ImageOrFallback } from './ImageOrFallback';
import { useCart } from '@hooks/useCart';
import type { Product } from '@product-types/product';

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const { addProduct } = useCart();

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[40px] bg-white p-6 shadow-soft">
        <div className="overflow-hidden rounded-[36px] bg-sky-50 p-6 sm:p-8">
          <ImageOrFallback src={product.image} alt={product.name} width={540} height={540} className="mx-auto h-[420px] w-full object-contain" />
        </div>
      </div>
      <div className="space-y-6">
        <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-soft">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-accent">Detalle del producto</p>
              <h1 className="mt-3 text-3xl font-bold text-textPrimary">{product.name}</h1>
            </div>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{product.category}</span>
          </div>

          <div className="mt-6 space-y-4 text-slate-600">
            <p>{product.description}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Precio</p>
                <p className="mt-2 text-3xl font-bold text-textPrimary">${product.price}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Stock</p>
                <p className="mt-2 text-3xl font-bold text-textPrimary">{product.stock}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <RatingStars rating={product.rating} />
                <span className="text-sm text-slate-500">{product.reviews} reseñas</span>
              </div>
            </div>
          </div>

          <Button type="button" onClick={() => addProduct(product)} className="mt-4 w-full">
            Agregar al carrito
          </Button>
        </div>
      </div>
    </div>
  );
}

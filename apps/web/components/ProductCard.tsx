'use client';

import Link from 'next/link';
import { useCart } from '@hooks/useCart';
import { Product } from '@product-types/product';
import { RatingStars } from './RatingStars';
import { Button } from './Button';
import { ImageOrFallback } from './ImageOrFallback';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addProduct } = useCart();

  return (
    <article className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/products/${product.id}`} className="block overflow-hidden rounded-3xl bg-sky-50 p-6">
        <ImageOrFallback src={product.image} alt={product.name} width={360} height={240} className="h-48 w-full object-contain" />
      </Link>
      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between gap-2 text-xs uppercase tracking-[0.18em] text-[#8C84A2]">
          <span>{product.category}</span>
          <span>{product.reviews}+ reseñas</span>
        </div>
        <Link href={`/products/${product.id}`} className="block text-lg font-semibold text-textPrimary hover:text-accent">
          {product.name}
        </Link>
        <p className="text-sm text-slate-600 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="block text-2xl font-bold text-textPrimary">${product.price}</span>
            <RatingStars rating={product.rating} />
          </div>
          <Button type="button" onClick={() => addProduct(product)} className="whitespace-nowrap">
            Agregar
          </Button>
        </div>
      </div>
    </article>
  );
}

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
    <article className="group rounded-[32px] border border-softPink/20 bg-white/70 backdrop-blur-sm p-5 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(248,200,220,0.2)] hover:bg-white">
      <Link href={`/products/${product.id}`} className="block overflow-hidden rounded-[24px] bg-gradient-to-tr from-softPink/10 via-surface/40 to-sky/20 p-6 transition-transform duration-300 group-hover:scale-[1.01]">
        <ImageOrFallback src={product.image} alt={product.name} width={360} height={240} className="h-48 w-full object-contain transition-transform duration-500 group-hover:scale-105" />
      </Link>
      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between gap-2 text-[10px] sm:text-xs uppercase tracking-[0.18em] text-[#8C84A2] font-semibold">
          <span className="text-lavender-700">🌸 {product.category}</span>
          <span>{product.reviews}+ reseñas</span>
        </div>
        <Link href={`/products/${product.id}`} className="block text-lg font-bold text-textPrimary transition hover:text-softPink duration-200">
          {product.name}
        </Link>
        <p className="text-sm text-[#5D4E6D]/75 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="block text-2xl font-black text-textPrimary">${product.price}</span>
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

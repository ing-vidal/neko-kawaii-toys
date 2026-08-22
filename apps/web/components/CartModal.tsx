'use client';

import Link from 'next/link';
import { ImageOrFallback } from './ImageOrFallback';
import type { Product } from '@product-types/product';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function CartModal({ isOpen, onClose, product }: CartModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3B3443]/40 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-[36px] border border-softPink/30 bg-white/90 backdrop-blur-xl p-7 shadow-[0_24px_60px_rgba(248,200,220,0.28)] animate-in zoom-in-95 duration-300">
        {/* Encabezado / Éxito */}
        <div className="flex items-center gap-3 text-[#5D4E6D] font-bold text-lg">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-softPink/30 text-textPrimary border border-softPink/20 text-sm shadow-sm">
            ✨
          </div>
          <span>¡Agregado al carrito!</span>
        </div>

        {/* Resumen de Producto */}
        <div className="mt-5 flex gap-4 rounded-[22px] bg-gradient-to-tr from-softPink/5 to-sky/10 p-4 border border-softPink/20">
          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-[16px] bg-white border border-softPink/20 p-2 flex items-center justify-center">
            <ImageOrFallback
              src={product.image}
              alt={product.name}
              width={80}
              height={80}
              className="max-h-full w-auto object-contain"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h4 className="text-sm font-bold text-textPrimary line-clamp-1">{product.name}</h4>
            <p className="text-xs text-[#8C84A2] mt-0.5 font-semibold">🌸 {product.category}</p>
            <p className="text-sm font-black text-[#5D4E6D] mt-1.5">${product.price}</p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-7 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-softPink/30 bg-white/80 px-5 py-3.5 text-sm font-bold text-textPrimary transition hover:bg-softPink/10 hover:border-softPink/50 active:scale-95 duration-200"
          >
            Seguir explorando
          </button>
          <Link
            href="/cart"
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-softPink to-lavender px-5 py-3.5 text-sm font-bold text-textPrimary border border-white/60 shadow-soft hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-200"
          >
            Continuar
          </Link>
        </div>
      </div>
    </div>
  );
}

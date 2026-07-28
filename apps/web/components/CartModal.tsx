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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft animate-in zoom-in-95 duration-200">
        {/* Encabezado / Éxito */}
        <div className="flex items-center gap-3 text-emerald-500 font-bold">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            ✓
          </div>
          <span>¡Agregado al carrito!</span>
        </div>

        {/* Resumen de Producto */}
        <div className="mt-4 flex gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100">
          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-white border border-slate-200 p-2 flex items-center justify-center">
            <ImageOrFallback
              src={product.image}
              alt={product.name}
              width={80}
              height={80}
              className="max-h-full w-auto object-contain"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h4 className="text-sm font-semibold text-textPrimary line-clamp-1">{product.name}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{product.category}</p>
            <p className="text-sm font-bold text-accent mt-1">${product.price}</p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-textPrimary transition hover:bg-slate-50"
          >
            Seguir explorando
          </button>
          <Link
            href="/cart"
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-soft hover:bg-[#6549ff] transition-all"
          >
            Ir al carrito
          </Link>
        </div>
      </div>
    </div>
  );
}

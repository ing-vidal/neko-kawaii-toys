'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Product } from '@product-types/product';
import { calculateCartTotal } from '@lib/utils';
import Link from 'next/link';
import { ImageOrFallback } from '@components/ImageOrFallback';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = 'neko-cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [addedProduct, setAddedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        setItems([]);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  const addProduct = (product: Product) => {
    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }
      return [...current, { product, quantity: 1 }];
    });
    setAddedProduct(product);
    setShowModal(true);
  };

  const removeProduct = (productId: string) => {
    setItems((current) => current.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((current) =>
      current
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(1, Math.min(quantity, item.product.stock)) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setItems([]);

  const subtotal = useMemo(() => calculateCartTotal(items), [items]);
  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  return (
    <CartContext.Provider value={{ items, totalItems, subtotal, addProduct, removeProduct, updateQuantity, clearCart }}>
      {children}

      {/* Ventana Modal Global de Confirmación (Estilo Amazon) */}
      {showModal && addedProduct && (
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
                  src={addedProduct.image}
                  alt={addedProduct.name}
                  width={80}
                  height={80}
                  className="max-h-full w-auto object-contain"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="text-sm font-semibold text-textPrimary line-clamp-1">{addedProduct.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{addedProduct.category}</p>
                <p className="text-sm font-bold text-accent mt-1">${addedProduct.price}</p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-textPrimary transition hover:bg-slate-50"
              >
                Seguir explorando
              </button>
              <Link
                href="/cart"
                onClick={() => setShowModal(false)}
                className="flex-1 inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-soft hover:bg-[#6549ff] transition-all"
              >
                Ir al carrito
              </Link>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

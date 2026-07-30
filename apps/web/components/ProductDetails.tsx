'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { RatingStars } from './RatingStars';
import { Button } from './Button';
import { ImageOrFallback } from './ImageOrFallback';
import { useCart } from '@hooks/useCart';
import type { Product } from '@product-types/product';
import { PriceDisplay } from './PriceDisplay';
import { OfferBadge } from './OfferBadge';
import { hasValidOffer } from '@lib/offers';

interface ProductDetailsProps {
  product: Product;
}

interface Petal {
  id: number;
  startX: number;
  startY: number;
  driftX: number;
  fallY: number;
  rotate: number;
  targetRotate: number;
  scale: number;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const { addProduct } = useCart();
  const [petals, setPetals] = useState<Petal[]>([]);
  const [mounted, setMounted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const isOffer = hasValidOffer(product);
  const isMotionEnabled = mounted && !shouldReduceMotion;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pétalos ocasionales — solo en oferta, baja frecuencia
  useEffect(() => {
    if (!isOffer || !isMotionEnabled) return;

    const spawnPetals = () => {
      const count = Math.floor(Math.random() * 2) + 2;
      const newPetals = Array.from({ length: count }).map((_, i) => {
        const id = Date.now() + i + Math.random();
        return {
          id,
          startX: Math.random() * 70 + 15,
          startY: Math.random() * 30 + 5,
          driftX: (Math.random() - 0.5) * 60,
          fallY: Math.random() * 60 + 60,
          rotate: Math.random() * 360,
          targetRotate: Math.random() * 360,
          scale: Math.random() * 0.4 + 0.5,
        };
      });

      setPetals((prev) => [...prev, ...newPetals]);

      setTimeout(() => {
        setPetals((prev) => prev.filter((p) => !newPetals.some((np) => np.id === p.id)));
      }, 1100);
    };

    // Primera aparición: 3s después de montar
    const initial = setTimeout(spawnPetals, 3000);

    // Luego cada ~12s
    intervalRef.current = setInterval(spawnPetals, 12000);

    return () => {
      clearTimeout(initial);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOffer, isMotionEnabled]);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] animate-fade-in-up">
      {/* Columna imagen */}
      <div className="rounded-[32px] sm:rounded-[36px] border border-softPink/20 bg-white/70 backdrop-blur-sm p-6 shadow-soft relative overflow-hidden">

        {/* Pétalos Sakura en detalle — solo oferta */}
        <AnimatePresence>
          {petals.map((petal) => (
            <motion.svg
              key={petal.id}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: petal.rotate }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, petal.scale, petal.scale, 0],
                x: petal.driftX,
                y: petal.fallY,
                rotate: petal.targetRotate,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut', times: [0, 0.2, 0.8, 1] }}
              viewBox="0 0 24 24"
              className="absolute pointer-events-none z-10 w-5 h-5 text-softPink fill-current"
              style={{ left: `${petal.startX}%`, top: `${petal.startY}%` }}
            >
              <path d="M12 4 C13 3 15 2 16 2 C19 2 21 5 21 9 C21 14 16 19 12 22 C8 19 3 14 3 9 C3 5 5 2 8 2 C9 2 11 3 12 4 Z" />
            </motion.svg>
          ))}
        </AnimatePresence>

        {/* Badge en imagen — esquina superior izquierda */}
        {isOffer && mounted && (
          <div className="absolute top-8 left-8 z-20">
            <OfferBadge product={product} size="md" />
          </div>
        )}

        <div className="overflow-hidden rounded-[26px] bg-gradient-to-tr from-softPink/10 via-surface/40 to-sky/25 p-6 sm:p-8">
          {/* Imagen flotante — solo en oferta y con motion habilitado */}
          <div className={isOffer && isMotionEnabled ? 'offer-float' : ''}>
            <ImageOrFallback
              src={product.image}
              alt={product.name}
              width={540}
              height={540}
              className="mx-auto h-[420px] w-full object-contain transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </div>

      {/* Columna info */}
      <div className="space-y-6">
        <div className="rounded-[32px] sm:rounded-[36px] border border-softPink/20 bg-white/70 backdrop-blur-sm p-8 shadow-soft">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] bg-gradient-to-r from-softPink via-[#5D4E6D] to-lavender bg-clip-text text-transparent">
                Detalle del producto
              </p>
              <h1 className="mt-3 text-3xl font-black text-textPrimary">{product.name}</h1>
            </div>
            <span className="rounded-full bg-softPink text-textPrimary px-4.5 py-2 text-xs sm:text-sm font-bold shadow-sm border border-white/40">
              {product.category}
            </span>
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

          {/* CTA con shine solo en oferta */}
          <Button
            type="button"
            onClick={() => addProduct(product)}
            className={`mt-6 w-full py-4 text-base ${isOffer ? 'offer-shine' : ''}`}
          >
            Agregar al carrito
          </Button>
        </div>
      </div>
    </div>
  );
}

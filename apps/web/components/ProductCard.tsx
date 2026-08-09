'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useMotionTemplate,
} from 'framer-motion';
import { useCart } from '@hooks/useCart';
import { Product } from '@product-types/product';
import { RatingStars } from './RatingStars';
import { Button } from './Button';
import { ImageOrFallback } from './ImageOrFallback';
import { PriceDisplay } from './PriceDisplay';
import { OfferBadge } from './OfferBadge';
import { OutOfStockOverlay } from './OutOfStockOverlay';
import { StockBadge } from './StockBadge';
import { hasValidOffer } from '@lib/offers';
import { isOutOfStock } from '@lib/stock';
// Reel modal handled on product detail page only

interface ProductCardProps {
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

export function ProductCard({ product }: ProductCardProps) {
  const { addProduct } = useCart();
  const [petals, setPetals] = useState<Petal[]>([]);
  const [supportsHover, setSupportsHover] = useState(false);
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Cursor spotlight — useMotionValue avoids React re-renders on every mousemove
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const spotlightBg = useMotionTemplate`radial-gradient(circle 150px at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.07) 0%, transparent 80%)`;

  const isOffer = hasValidOffer(product);
  const outOfStock = isOutOfStock(product.stock);
  const isMotionEnabled = mounted && !shouldReduceMotion;

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(hover: hover)');
    setSupportsHover(mq.matches);
    const handler = (e: MediaQueryListEvent) => setSupportsHover(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Petals — spawn only on offer products that are in stock
  const spawnPetals = () => {
    if (!isMotionEnabled || !isOffer || outOfStock) return;
    const count = Math.floor(Math.random() * 2) + 2;
    const newPetals = Array.from({ length: count }).map((_, i) => {
      const id = Date.now() + i + Math.random();
      return {
        id,
        startX: Math.random() * 60 + 20,
        startY: Math.random() * 25 + 15,
        driftX: (Math.random() - 0.5) * 50,
        fallY: Math.random() * 40 + 50,
        rotate: Math.random() * 360,
        targetRotate: Math.random() * 360,
        scale: Math.random() * 0.3 + 0.5,
      };
    });
    setPetals((prev) => [...prev, ...newPetals]);
    setTimeout(() => {
      setPetals((prev) => prev.filter((p) => !newPetals.some((np) => np.id === p.id)));
    }, 950);
  };

  // Mouse handlers
  const handleMouseMoveCard = (e: React.MouseEvent<HTMLElement>) => {
    if (!isOffer || !supportsHover || !isMotionEnabled || outOfStock) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeaveCard = () => {
    mouseX.set(-1000);
    mouseY.set(-1000);
  };

  // Card Framer Motion variants — offer cards elevate more and glow more on hover
  const cardVariants = {
    initial: {
      opacity: 0,
      y: 20,
      boxShadow: '0 12px 32px rgba(248, 200, 220, 0.18)',
    },
    animate: {
      opacity: 1,
      y: 0,
      boxShadow: '0 12px 32px rgba(248, 200, 220, 0.18)',
      transition: { duration: 0.45, ease: 'easeOut' as const },
    },
    hover: {
      y: isOffer ? -8 : -5,
      scale: isOffer ? 1.025 : 1.02,
      boxShadow: isOffer
        ? '0 28px 52px rgba(248, 200, 220, 0.50), 0 6px 20px rgba(216, 200, 255, 0.25)'
        : '0 20px 40px rgba(248, 200, 220, 0.35)',
      transition: { duration: 0.35, ease: 'easeOut' as const },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.12 },
    },
  };

  const reducedVariants = {
    initial: { opacity: 1, y: 0, boxShadow: '0 12px 32px rgba(248, 200, 220, 0.18)' },
    animate: { opacity: 1, y: 0, boxShadow: '0 12px 32px rgba(248, 200, 220, 0.18)' },
    hover: {},
    tap: {},
  };

  const article = (
    <motion.article
      variants={isMotionEnabled ? cardVariants : reducedVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      whileHover={isMotionEnabled && supportsHover ? 'hover' : undefined}
      whileTap={isMotionEnabled ? 'tap' : undefined}
      onHoverStart={() => { if (supportsHover) spawnPetals(); }}
      onMouseMove={handleMouseMoveCard}
      onMouseLeave={handleMouseLeaveCard}
      onTapStart={() => { if (!supportsHover) spawnPetals(); }}
      // Offer cards: no border (gradient border is the wrapper); normal cards: softPink border
      className={`relative rounded-[31px] bg-white/70 backdrop-blur-sm p-5 shadow-soft ${
        isOffer ? '' : 'border border-softPink/20 rounded-[32px]'
      }`}
    >
      {/* Cursor spotlight — desktop + offer only. useMotionTemplate avoids re-renders */}
      {isOffer && supportsHover && isMotionEnabled && (
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-[31px] pointer-events-none z-[1]"
          style={{ background: spotlightBg }}
        />
      )}

      {/* Sakura petals — offer only */}
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
            transition={{ duration: 0.9, ease: 'easeOut' as const, times: [0, 0.2, 0.8, 1] }}
            viewBox="0 0 24 24"
            className="absolute pointer-events-none z-10 w-4 h-4 text-softPink fill-current"
            style={{ left: `${petal.startX}%`, top: `${petal.startY}%` }}
          >
            <path d="M12 4 C13 3 15 2 16 2 C19 2 21 5 21 9 C21 14 16 19 12 22 C8 19 3 14 3 9 C3 5 5 2 8 2 C9 2 11 3 12 4 Z" />
          </motion.svg>
        ))}
      </AnimatePresence>

      {/* Image area with badge overlay */}
      <div className="relative z-[2]">
        {isOffer && mounted && !outOfStock && (
          <div className="absolute top-2 left-2 z-20">
            <OfferBadge product={product} size="sm" />
          </div>
        )}
        <Link
          href={`/products/${product.id}`}
          className="relative block overflow-hidden rounded-[24px] bg-gradient-to-tr from-softPink/10 via-surface/40 to-sky/20 p-6"
        >
          {/* Out-of-stock overlay */}
          <OutOfStockOverlay show={outOfStock} />

          <motion.div
            animate={isMotionEnabled && !outOfStock ? { y: [0, -4, 0] } : undefined}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' as const }}
            className="h-48 w-full flex items-center justify-center"
          >
            <motion.div
              variants={isMotionEnabled && !outOfStock ? { hover: { scale: 1.05 } } : {}}
              transition={{ duration: 0.35, ease: 'easeOut' as const }}
              className="h-full w-full"
            >
              <ImageOrFallback
                src={product.image}
                alt={product.name}
                width={360}
                height={240}
                className={`h-full w-full object-contain transition-all duration-300 ${
                  outOfStock ? 'opacity-55 grayscale-[30%]' : ''
                }`}
              />
            </motion.div>
          </motion.div>
        </Link>

        {/* Video button removed from catalog card; available on product detail page only */}
      </div>

      {/* Product info */}
      <div className="mt-5 space-y-3 relative z-[2]">
        <div className="flex items-center justify-between gap-2 text-[10px] sm:text-xs uppercase tracking-[0.18em] text-[#8C84A2] font-semibold">
          <span className="text-lavender-700">🌸 {product.category}</span>
          <span>{product.reviews}+ reseñas</span>
        </div>
        <Link
          href={`/products/${product.id}`}
          className="block text-lg font-bold text-textPrimary transition hover:text-softPink duration-200"
        >
          {product.name}
        </Link>
        <p className="text-sm text-[#5D4E6D]/75 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between gap-3">
          <div>
            <PriceDisplay product={product} variant="card" />
            <RatingStars rating={product.rating} />
            {/* Stock availability indicator */}
            <StockBadge stock={product.stock} variant="card" />
          </div>
          <div className="flex items-center gap-2">
            {outOfStock ? (
              <Button
                type="button"
                variant="disabled"
                disabled
                aria-disabled="true"
                className="whitespace-nowrap"
              >
                Agotado
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => addProduct(product)}
                className={`whitespace-nowrap ${isOffer ? 'offer-shine' : ''}`}
              >
                Agregar
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );

  // Offer cards: wrap with gradient border (padding technique) + ambient halo
  if (isOffer) {
    return (
      <div className="relative group">
        {/* Ambient halo — blurred glow BEHIND the card, not on it */}
        <div
          aria-hidden
          className="absolute -inset-3 rounded-[44px] bg-gradient-to-br from-softPink/20 via-transparent to-lavender/15 blur-2xl pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-85"
        />
        {/* Gradient border wrapper: 1.5px padding + animated gradient bg.
            Card's own bg-white/70 covers the interior — only the 1.5px strip shows. */}
        <div className="p-[1.5px] rounded-[32px] offer-border-gradient">
          {article}
        </div>
      </div>
    );
  }

  return article;
}

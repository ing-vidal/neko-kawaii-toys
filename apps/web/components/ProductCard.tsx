'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useCart } from '@hooks/useCart';
import { Product } from '@product-types/product';
import { RatingStars } from './RatingStars';
import { Button } from './Button';
import { ImageOrFallback } from './ImageOrFallback';

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

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia('(hover: hover)');
    setSupportsHover(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setSupportsHover(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const isMotionEnabled = mounted && !shouldReduceMotion;

  const spawnPetals = () => {
    if (!isMotionEnabled) return;

    const count = Math.floor(Math.random() * 2) + 2; // Genera 2 o 3 pétalos
    const newPetals = Array.from({ length: count }).map((_, i) => {
      const id = Date.now() + i + Math.random();
      const startX = Math.random() * 60 + 20; // 20% a 80% horizontal
      const startY = Math.random() * 25 + 15; // 15% a 40% vertical (área de la imagen)
      const driftX = (Math.random() - 0.5) * 50; // desplazamiento horizontal
      const fallY = Math.random() * 40 + 50; // caída lenta (50px a 90px)
      const rotate = Math.random() * 360;
      const targetRotate = rotate + (Math.random() - 0.5) * 180;
      const scale = Math.random() * 0.3 + 0.5; // escala entre 0.5 y 0.8

      return { id, startX, startY, driftX, fallY, rotate, targetRotate, scale };
    });

    setPetals((prev) => [...prev, ...newPetals]);

    // Limpieza después de que acabe la animación (900ms)
    setTimeout(() => {
      setPetals((prev) => prev.filter((p) => !newPetals.some((np) => np.id === p.id)));
    }, 950);
  };

  const handleHoverStart = () => {
    if (supportsHover) {
      spawnPetals();
    }
  };

  const handleTapStart = () => {
    if (!supportsHover) {
      spawnPetals();
    }
  };

  const cardVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      boxShadow: '0 12px 32px rgba(248, 200, 220, 0.18)'
    },
    animate: { 
      opacity: 1, 
      y: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      boxShadow: '0 12px 32px rgba(248, 200, 220, 0.18)',
      transition: { 
        duration: 0.45, 
        ease: 'easeOut' as const
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      backgroundColor: 'rgba(255, 255, 255, 1)',
      boxShadow: '0 20px 40px rgba(248, 200, 220, 0.35)', // Brillo sutil y difuminado (halo)
      transition: { 
        duration: 0.35, 
        ease: 'easeOut' as const
      }
    },
    tap: {
      scale: 0.98,
      transition: { 
        duration: 0.12 
      }
    }
  };

  const activeVariants = isMotionEnabled
    ? cardVariants
    : {
        initial: { opacity: 1, y: 0, backgroundColor: 'rgba(255, 255, 255, 0.7)', boxShadow: '0 12px 32px rgba(248, 200, 220, 0.18)' },
        animate: { opacity: 1, y: 0, backgroundColor: 'rgba(255, 255, 255, 0.7)', boxShadow: '0 12px 32px rgba(248, 200, 220, 0.18)' },
        hover: {},
        tap: {}
      };

  return (
    <motion.article
      variants={activeVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      whileHover={isMotionEnabled && supportsHover ? 'hover' : undefined}
      whileTap={isMotionEnabled ? 'tap' : undefined}
      onHoverStart={handleHoverStart}
      onTapStart={handleTapStart}
      className="group relative rounded-[32px] border border-softPink/20 bg-white/70 backdrop-blur-sm p-5 shadow-soft"
    >
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
            transition={{
              duration: 0.9,
              ease: 'easeOut' as const,
              times: [0, 0.2, 0.8, 1],
            }}
            viewBox="0 0 24 24"
            className="absolute pointer-events-none z-10 w-4 h-4 text-softPink fill-current"
            style={{
              left: `${petal.startX}%`,
              top: `${petal.startY}%`,
            }}
          >
            <path d="M12 4 C13 3 15 2 16 2 C19 2 21 5 21 9 C21 14 16 19 12 22 C8 19 3 14 3 9 C3 5 5 2 8 2 C9 2 11 3 12 4 Z" />
          </motion.svg>
        ))}
      </AnimatePresence>

      <Link
        href={`/products/${product.id}`}
        className="block overflow-hidden rounded-[24px] bg-gradient-to-tr from-softPink/10 via-surface/40 to-sky/20 p-6"
      >
        <motion.div
          animate={isMotionEnabled ? { y: [0, -4, 0] } : undefined}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut' as const,
          }}
          className="h-48 w-full flex items-center justify-center"
        >
          <motion.div
            variants={isMotionEnabled ? { hover: { scale: 1.04 } } : {}}
            transition={{ duration: 0.35, ease: 'easeOut' as const }}
            className="h-full w-full"
          >
            <ImageOrFallback
              src={product.image}
              alt={product.name}
              width={360}
              height={240}
              className="h-full w-full object-contain"
            />
          </motion.div>
        </motion.div>
      </Link>

      <div className="mt-5 space-y-3">
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
            <span className="block text-2xl font-black text-textPrimary">${product.price}</span>
            <RatingStars rating={product.rating} />
          </div>
          <Button type="button" onClick={() => addProduct(product)} className="whitespace-nowrap">
            Agregar
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

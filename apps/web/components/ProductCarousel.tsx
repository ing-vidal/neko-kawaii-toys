'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '@product-types/product';
import { ImageOrFallback } from './ImageOrFallback';

interface ProductCarouselProps {
  products: Product[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filtrar productos que tengan imágenes válidas y limitar a un máximo de 5 para el carrusel
  const carouselProducts = products.filter((p) => p.image).slice(0, 6);

  useEffect(() => {
    if (carouselProducts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselProducts.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [carouselProducts.length]);

  if (carouselProducts.length === 0) return null;

  const currentProduct = carouselProducts[currentIndex];

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-2.5 shadow-soft h-[360px] group transition-all duration-300 hover:shadow-lg">
      <Link href={`/products/${currentProduct.id}`} className="relative block h-full w-full overflow-hidden rounded-[22px] bg-slate-50">
        
        {/* Imagen del producto animada */}
        <div className="relative flex h-full w-full items-center justify-center p-6 pb-28 transition-all duration-700 ease-out group-hover:scale-105">
          <ImageOrFallback
            src={currentProduct.image}
            alt={currentProduct.name}
            width={400}
            height={300}
            className="max-h-full w-auto object-contain"
          />
        </div>

        {/* Gradiente oscuro inferior para legibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-950/20 to-transparent" />

        {/* Información del producto superpuesta (Glassmorphism parcial) */}
        <div className="absolute bottom-0 inset-x-0 p-6 text-white space-y-2">
          <span className="inline-block rounded-full bg-accent/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            {currentProduct.category}
          </span>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold tracking-tight">{currentProduct.name}</h3>
              <p className="text-sm text-slate-200/90 line-clamp-1 mt-1 max-w-[220px] sm:max-w-none">
                {currentProduct.description}
              </p>
            </div>
            <div className="text-right">
              <span className="block text-2xl font-black">${currentProduct.price}</span>
              <span className="text-xs text-accent/20 font-semibold underline text-[#FFD700] hover:text-white transition-colors duration-200">
                Ver detalles
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Indicadores de navegación (Puntos) */}
      {carouselProducts.length > 1 && (
        <div className="absolute top-5 right-5 flex gap-1.5 z-10 bg-slate-900/30 p-2 rounded-full backdrop-blur-md">
          {carouselProducts.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                setCurrentIndex(index);
              }}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white w-4' : 'bg-white/40'
              }`}
              aria-label={`Ir al producto ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

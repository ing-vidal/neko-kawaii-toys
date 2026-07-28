'use client';

import { Button } from './Button';
import { useAdminConfig } from '@hooks/useAdminConfig';
import { ImageOrFallback } from './ImageOrFallback';

export function Hero() {
  const { bannerUrl } = useAdminConfig();

  return (
    <section className="relative overflow-hidden rounded-[32px] sm:rounded-[48px] border border-white/80 bg-gradient-to-tr from-softPink/30 via-white/50 to-sky/30 p-8 shadow-soft sm:p-14 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(248,200,220,0.22)]">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full bg-white/90 px-5 py-2 text-xs sm:text-sm font-bold text-[#5D4E6D] shadow-sm border border-softPink/20 tracking-wide">
            🌸 Tienda kawaii premium
          </span>
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-textPrimary sm:text-5xl leading-[1.15] sm:leading-[1.15]">
              Neko Kawaii Toys: colección, ternura y <span className="bg-gradient-to-r from-[#D8C8FF] to-[#F8C8DC] bg-clip-text text-transparent">estilo japonés</span>.
            </h1>
            <p className="max-w-xl text-base leading-8 text-[#5D4E6D]/85 sm:text-lg">
              Descubre figuras exclusivas, peluches suaves y accesorios únicos con una experiencia de compra elegante, memorable y confiable.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button href="/products">Comprar ahora</Button>
            <Button href="#categories" variant="secondary">
              Ver colección
            </Button>
          </div>
        </div>
        <div className="relative rounded-[40px] bg-white/60 backdrop-blur-sm p-4 shadow-soft border border-white/90 sm:p-8 transition-transform duration-300 hover:scale-[1.01]">
          <div className="absolute -right-6 -top-8 h-28 w-28 rounded-full bg-softPink/60 blur-3xl" />
          <div className="absolute -left-6 -bottom-8 h-28 w-28 rounded-full bg-sky/60 blur-3xl" />
          <ImageOrFallback
            src={bannerUrl || '/images/hero-product.svg'}
            alt="Productos kawaii"
            width={640}
            height={640}
            className="relative mx-auto h-96 w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}

'use client';

import { Button } from './Button';
import { useAdminConfig } from '@hooks/useAdminConfig';
import { ImageOrFallback } from './ImageOrFallback';

export function Hero() {
  const { bannerUrl } = useAdminConfig();

  return (
    <section className="relative overflow-hidden rounded-[40px] border border-white/60 bg-gradient-to-br from-softPink via-white to-sky-100 p-8 shadow-soft sm:p-14">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-accent shadow-sm">
            Tienda kawaii premium
          </span>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-textPrimary sm:text-5xl">
              Neko Kawaii Toys: colección, ternura y estilo japonés.
            </h1>
            <p className="max-w-xl text-base leading-8 text-slate-700 sm:text-lg">
              Descubre figuras exclusivas, peluches suaves y accesorios únicos con una experiencia de compra elegante y confiable.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button href="/products">Comprar ahora</Button>
            <Button href="#categories" variant="secondary">
              Ver colección
            </Button>
          </div>
        </div>
        <div className="relative rounded-[36px] bg-white p-4 shadow-lg ring-1 ring-slate-200/70 sm:p-8">
          <div className="absolute -right-6 -top-8 h-28 w-28 rounded-full bg-blush/80 blur-2xl" />
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

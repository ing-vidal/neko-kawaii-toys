'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ProductForm } from '../../components/ProductForm';

const DEFAULT_CATEGORIES = ['Figuras', 'Peluches', 'Anime', 'Accesorios', 'Coleccionables'];

export default function NewProductPage() {
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    fetch('/api/admin/categories', { cache: 'no-store' })
      .then((r) => r.json())
      .then((cats: string[]) => {
        if (Array.isArray(cats) && cats.length > 0) {
          setCategories(Array.from(new Set([...DEFAULT_CATEGORIES, ...cats])));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/admin/products" className="hover:text-slate-700 transition">Productos</Link>
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-800 font-medium">Nuevo producto</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Crear producto</h1>
        <p className="mt-1 text-sm text-slate-500">
          Completa la información para agregar un nuevo producto al catálogo.
        </p>
      </div>

      {/* Form card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <ProductForm categories={categories} mode="create" />
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductForm } from '../../components/ProductForm';
import type { Product } from '@product-types/product';

const DEFAULT_CATEGORIES = ['Figuras', 'Peluches', 'Anime', 'Accesorios', 'Coleccionables'];

type PageState =
  | { status: 'loading' }
  | { status: 'found'; product: Product; categories: string[] }
  | { status: 'not-found'; id: string }
  | { status: 'error'; message: string; id: string };

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;

  // Single state object avoids the "impossible" intermediate states that caused the flash
  const [state, setState] = useState<PageState>({ status: 'loading' });

  // Abort controller ref to cancel stale requests on re-renders / Strict Mode double-invoke
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!id) return;

    // Cancel any in-flight request from a previous render
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // Always reset to loading when id changes — prevents stale "not found" flash
    setState({ status: 'loading' });

    const load = async () => {
      try {
        const [productRes, catsRes] = await Promise.all([
          fetch(`/api/admin/products/${encodeURIComponent(id)}`, {
            cache: 'no-store',
            signal: controller.signal,
          }),
          fetch('/api/admin/categories', {
            cache: 'no-store',
            signal: controller.signal,
          }),
        ]);

        // Aborted — don't update state at all
        if (controller.signal.aborted) return;

        if (productRes.status === 404) {
          setState({ status: 'not-found', id });
          return;
        }

        if (!productRes.ok) {
          setState({
            status: 'error',
            message: `Error ${productRes.status} al cargar el producto.`,
            id,
          });
          return;
        }

        const product = (await productRes.json()) as Product;

        let categories = DEFAULT_CATEGORIES;
        if (catsRes.ok) {
          const cats = (await catsRes.json()) as string[];
          if (Array.isArray(cats) && cats.length > 0) {
            categories = Array.from(new Set([...DEFAULT_CATEGORIES, ...cats]));
          }
        }

        // Only update state if this request is still the current one
        if (!controller.signal.aborted) {
          setState({ status: 'found', product, categories });
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return; // Expected — not an error
        setState({
          status: 'error',
          message: err instanceof Error ? err.message : 'Error desconocido.',
          id,
        });
      }
    };

    load();

    return () => {
      controller.abort();
    };
  }, [id]);

  // ── Render states ────────────────────────────────────────────────────────

  if (state.status === 'loading') {
    return (
      <div className="space-y-6">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 animate-pulse">
          <div className="h-3.5 w-20 rounded bg-slate-100" />
          <div className="h-3.5 w-3 rounded bg-slate-100" />
          <div className="h-3.5 w-32 rounded bg-slate-200" />
        </div>
        {/* Title skeleton */}
        <div className="h-9 w-64 rounded-xl bg-slate-200 animate-pulse" />
        {/* Form skeleton */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3.5 w-24 rounded bg-slate-100 animate-pulse" />
                  <div className="h-10 rounded-xl bg-slate-100 animate-pulse" />
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="h-44 rounded-2xl bg-slate-100 animate-pulse" />
              <div className="h-20 rounded-2xl bg-slate-100 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state.status === 'not-found') {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
          🔍
        </div>
        <h2 className="text-xl font-bold text-slate-700">Producto no encontrado</h2>
        <p className="text-sm text-slate-500">
          El ID{' '}
          <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs">
            {state.id}
          </code>{' '}
          no existe en el catálogo.
        </p>
        <Link
          href="/admin/products"
          className="mt-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
        >
          Volver a productos
        </Link>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-3xl">
          ⚠️
        </div>
        <h2 className="text-xl font-bold text-slate-700">Error al cargar</h2>
        <p className="text-sm text-slate-500">{state.message}</p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => setState({ status: 'loading' })}
            className="rounded-xl bg-gradient-to-r from-softPink to-lavender px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:opacity-90 transition"
          >
            Reintentar
          </button>
          <Link
            href="/admin/products"
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  // status === 'found'
  const { product, categories } = state;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/admin/products" className="hover:text-slate-700 transition">
          Productos
        </Link>
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-800 font-medium truncate max-w-[200px]">{product.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold text-slate-800 truncate">{product.name}</h1>
          <div className="mt-1.5 flex items-center gap-2 flex-wrap">
            <span className="rounded-full bg-lavender/20 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {product.category}
            </span>
            {product.sku && (
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-slate-600">
                {product.sku}
              </code>
            )}
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                (product.status ?? 'active') === 'active'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {(product.status ?? 'active') === 'active' ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
      </div>

      {/* Form card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <ProductForm initialProduct={product} categories={categories} mode="edit" />
      </div>
    </div>
  );
}

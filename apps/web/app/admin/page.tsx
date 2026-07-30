'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { StatsCard } from './components/StatsCard';
import { SkeletonCards } from './components/SkeletonTable';
import type { Product } from '@product-types/product';

interface DashboardStats {
  total: number;
  categories: number;
  active: number;
  outOfStock: number;
  recentProducts: Product[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/products', { cache: 'no-store' });
        if (!res.ok) return;
        const products: Product[] = await res.json();

        const categorySet = new Set(products.map((p) => p.category));
        setStats({
          total: products.length,
          categories: categorySet.size,
          active: products.filter((p) => (p.status ?? 'active') === 'active').length,
          outOfStock: products.filter((p) => p.stock === 0).length,
          recentProducts: [...products]
            .sort((a, b) => {
              const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return db - da;
            })
            .slice(0, 6),
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Panel de administración
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-800">Dashboard</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 self-start rounded-xl bg-gradient-to-r from-softPink to-lavender px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:opacity-90 hover:shadow-md transition active:scale-[0.98]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo producto
        </Link>
      </div>

      {/* Stats */}
      {loading ? (
        <SkeletonCards count={4} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            label="Total productos"
            value={stats?.total ?? 0}
            color="lavender"
            description="En el catálogo"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
          />
          <StatsCard
            label="Categorías"
            value={stats?.categories ?? 0}
            color="sky"
            description="Distintas categorías"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            }
          />
          <StatsCard
            label="Activos"
            value={stats?.active ?? 0}
            color="emerald"
            description="Productos visibles"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatsCard
            label="Sin stock"
            value={stats?.outOfStock ?? 0}
            color="rose"
            description="Requieren atención"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
          />
        </div>
      )}

      {/* Recent products */}
      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-bold text-slate-800">Últimos productos agregados</h2>
          <Link href="/admin/products" className="text-xs font-semibold text-lavender hover:underline underline-offset-2">
            Ver todos →
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-slate-100" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-2/3 rounded bg-slate-100" />
                  <div className="h-3 w-1/3 rounded bg-slate-50" />
                </div>
                <div className="h-4 w-14 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : stats?.recentProducts.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">
            No hay productos todavía.{' '}
            <Link href="/admin/products/new" className="text-lavender hover:underline font-medium">
              Crear el primero
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-slate-50">
            {stats?.recentProducts.map((p) => (
              <li key={p.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/60 transition-colors">
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300 text-xs">?</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.category}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-sm font-semibold text-slate-700">${p.price}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      (p.status ?? 'active') === 'active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {(p.status ?? 'active') === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-xs font-medium text-slate-400 hover:text-slate-600 transition"
                  >
                    Editar
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-3">
        <QuickLink
          href="/admin/products"
          label="Gestionar productos"
          description="Ver, editar, filtrar y exportar"
          icon="📦"
        />
        <QuickLink
          href="/admin/products/new"
          label="Crear producto"
          description="Agregar nuevo al catálogo"
          icon="✨"
        />
        <QuickLink
          href="/admin/settings"
          label="Configuración"
          description="WhatsApp, branding y categorías"
          icon="⚙️"
        />
      </div>
    </div>
  );
}

function QuickLink({
  href,
  label,
  description,
  icon,
}: {
  href: string;
  label: string;
  description: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-lavender/50 hover:shadow-md hover:shadow-slate-100"
    >
      <span className="text-2xl flex-shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800 group-hover:text-slate-900">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>
      <svg className="ml-auto h-4 w-4 flex-shrink-0 text-slate-300 group-hover:text-slate-400 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

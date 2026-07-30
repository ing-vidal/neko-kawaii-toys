'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useProducts } from '@hooks/useProducts';
import { useToast } from '@hooks/useToast';
import { AdminSearchBar } from '../components/AdminSearchBar';
import { ProductFilters } from '../components/ProductFilters';
import { ProductTable } from '../components/ProductTable';
import { BulkActions } from '../components/BulkActions';
import { Pagination } from '../components/Pagination';
import { SkeletonTable } from '../components/SkeletonTable';
import { EmptyState } from '../components/EmptyState';
import { CsvImporter } from '../components/CsvImporter';
import { CsvExporter } from '../components/CsvExporter';

/** Categories fetched once on mount */
const DEFAULT_CATEGORIES = ['Figuras', 'Peluches', 'Anime', 'Accesorios', 'Coleccionables'];

export default function ProductsPage() {
  const { addToast } = useToast();
  const { data, loading, error, params, setPage, setSearch, setFilters, refresh } =
    useProducts({ page: 1, limit: 20, sortBy: 'createdAt', sortDir: 'desc' });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);

  // Load extra categories from API on first render
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

  const handleDelete = useCallback(async (id: string) => {
    const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  }, []);

  const handleDuplicate = useCallback(async (id: string) => {
    const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}/duplicate`, { method: 'POST' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  }, []);

  const handleSelectAll = (ids: string[]) => setSelectedIds(ids);
  const handleSelectOne = (id: string, checked: boolean) =>
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((i) => i !== id)));

  const handleFilter = (filters: {
    category: string; status: string; minPrice: string; maxPrice: string;
    stock: string; dateFrom: string; dateTo: string; sortBy: string; sortDir: string;
  }) => {
    setSelectedIds([]);
    setFilters(filters);
  };

  const products = data?.products ?? [];
  const hasActiveFilters = !!(params.category || params.status || params.minPrice || params.maxPrice || params.stock);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Catálogo</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-800">Productos</h1>
          {data && (
            <p className="mt-0.5 text-sm text-slate-500">
              {data.total} producto{data.total !== 1 ? 's' : ''} en total
            </p>
          )}
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

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <AdminSearchBar
          onSearch={setSearch}
          initialValue={params.search ?? ''}
          placeholder="Buscar por nombre, SKU, categoría…"
        />
        <ProductFilters
          categories={categories}
          onFilter={handleFilter}
          initialValues={{
            category: params.category,
            status: params.status,
            minPrice: params.minPrice,
            maxPrice: params.maxPrice,
            stock: params.stock,
            dateFrom: params.dateFrom,
            dateTo: params.dateTo,
            sortBy: params.sortBy,
            sortDir: params.sortDir,
          }}
        />
        <div className="ml-auto flex items-center gap-2">
          <CsvImporter onSuccess={refresh} />
          <CsvExporter activeFilters={{ category: params.category, status: params.status }} />
        </div>
      </div>

      {/* Bulk actions */}
      {selectedIds.length > 0 && (
        <BulkActions
          selectedIds={selectedIds}
          availableCategories={categories}
          onSuccess={refresh}
          onClear={() => setSelectedIds([])}
        />
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          Error al cargar productos: {error}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <SkeletonTable rows={10} />
      ) : products.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? 'Sin resultados' : 'Sin productos'}
          description={
            hasActiveFilters
              ? 'Ningún producto coincide con los filtros actuales.'
              : 'Aún no has creado ningún producto.'
          }
          action={
            !hasActiveFilters ? (
              <Link
                href="/admin/products/new"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-softPink to-lavender px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:opacity-90 transition"
              >
                Crear primer producto
              </Link>
            ) : undefined
          }
        />
      ) : (
        <ProductTable
          products={products}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onRefresh={refresh}
        />
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          total={data.total}
          limit={params.limit ?? 20}
          hasNextPage={data.hasNextPage}
          hasPreviousPage={data.hasPreviousPage}
          onPageChange={(p) => { setPage(p); setSelectedIds([]); }}
        />
      )}
    </div>
  );
}

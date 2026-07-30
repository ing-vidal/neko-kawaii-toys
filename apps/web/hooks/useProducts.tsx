'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Product } from '@product-types/product';

export interface ProductsPage {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  sortBy?: string;
  sortDir?: string;
  minPrice?: string;
  maxPrice?: string;
  stock?: string;
  dateFrom?: string;
  dateTo?: string;
}

function buildQuery(params: ProductsParams): string {
  const q = new URLSearchParams();
  q.set('page', String(params.page ?? 1));
  q.set('limit', String(params.limit ?? 20));
  if (params.search) q.set('search', params.search);
  if (params.category) q.set('category', params.category);
  if (params.status) q.set('status', params.status);
  if (params.sortBy) q.set('sortBy', params.sortBy);
  if (params.sortDir) q.set('sortDir', params.sortDir);
  if (params.minPrice) q.set('minPrice', params.minPrice);
  if (params.maxPrice) q.set('maxPrice', params.maxPrice);
  if (params.stock) q.set('stock', params.stock);
  if (params.dateFrom) q.set('dateFrom', params.dateFrom);
  if (params.dateTo) q.set('dateTo', params.dateTo);
  return q.toString();
}

export function useProducts(initialParams: ProductsParams = {}) {
  const [params, setParams] = useState<ProductsParams>({ page: 1, limit: 20, ...initialParams });
  const [data, setData] = useState<ProductsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetch_ = useCallback(async (p: ProductsParams) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/products?${buildQuery(p)}`, {
        signal: controller.signal,
        cache: 'no-store',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as ProductsPage;
      setData(json);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_(params);
  }, [params, fetch_]);

  const setPage = (page: number) => setParams((prev) => ({ ...prev, page }));

  const setSearch = useCallback((search: string) => {
    setParams((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const setFilters = useCallback((filters: Partial<ProductsParams>) => {
    setParams((prev) => ({ ...prev, ...filters, page: 1 }));
  }, []);

  const refresh = useCallback(() => fetch_(params), [params, fetch_]);

  return { data, loading, error, params, setPage, setSearch, setFilters, refresh };
}

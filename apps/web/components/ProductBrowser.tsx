'use client';

import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { Button } from './Button';
import { ProductGrid } from './ProductGrid';
import { SearchBar } from './SearchBar';
import { ProductCarousel } from './ProductCarousel';
import type { Product } from '@product-types/product';
import { useLocalCatalog } from '@hooks/useLocalCatalog';
import { getEffectivePrice } from '@lib/offers';

const defaultCategories = ['Todos', 'Figuras', 'Peluches', 'Anime', 'Accesorios', 'Coleccionables'] as const;

interface ProductBrowserProps {
  products?: Product[];
}

interface CatalogApiResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function ProductBrowser({ products = [] }: ProductBrowserProps) {
  const [isMobile, setIsMobile] = useState(false);
  const PAGE_SIZE = isMobile ? 12 : 24;
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [category, setCategory] = useState<string>('Todos');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [catalog, setCatalog] = useState<CatalogApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const { products: mergedProducts, categories: adminCategories } = useLocalCatalog(products);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(max-width: 640px)');
    const apply = () => setIsMobile(media.matches);
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(['Todos', ...defaultCategories.slice(1), ...adminCategories])) as string[],
    [adminCategories]
  );

  // Dynamic absolute min and max prices (based on effective price)
  const { absoluteMinPrice, absoluteMaxPrice } = useMemo(() => {
    if (mergedProducts.length === 0) return { absoluteMinPrice: 0, absoluteMaxPrice: 100 };
    const prices = mergedProducts.map((p) => getEffectivePrice(p));
    return {
      absoluteMinPrice: Math.floor(Math.min(...prices)),
      absoluteMaxPrice: Math.ceil(Math.max(...prices)),
    };
  }, [mergedProducts]);

  // Price range filters state (null means using defaults)
  const [minPriceState, setMinPriceState] = useState<number | null>(null);
  const [maxPriceState, setMaxPriceState] = useState<number | null>(null);

  const currentMinPrice = minPriceState ?? absoluteMinPrice;
  const currentMaxPrice = maxPriceState ?? absoluteMaxPrice;

  // Manual input values state
  const [minInput, setMinInput] = useState<string>('');
  const [maxInput, setMaxInput] = useState<string>('');

  // Sync inputs with state changes
  useEffect(() => {
    setMinInput(currentMinPrice.toString());
  }, [currentMinPrice]);

  useEffect(() => {
    setMaxInput(currentMaxPrice.toString());
  }, [currentMaxPrice]);

  // Sort option state
  const [sortBy, setSortBy] = useState<string>('name-asc');

  // Slider change handlers
  const handleMinSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), currentMaxPrice);
    setMinPriceState(val);
  };

  const handleMaxSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), currentMinPrice);
    setMaxPriceState(val);
  };

  // Manual input change handlers
  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMinInput(val);
    const num = Number(val);
    if (!isNaN(num) && val !== '') {
      setMinPriceState(Math.max(absoluteMinPrice, Math.min(num, currentMaxPrice)));
    }
  };

  const handleMinInputBlur = () => {
    let num = Number(minInput);
    if (isNaN(num) || minInput === '') {
      num = absoluteMinPrice;
    }
    const clamped = Math.max(absoluteMinPrice, Math.min(num, currentMaxPrice));
    setMinPriceState(clamped);
    setMinInput(clamped.toString());
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMaxInput(val);
    const num = Number(val);
    if (!isNaN(num) && val !== '') {
      setMaxPriceState(Math.min(absoluteMaxPrice, Math.max(num, currentMinPrice)));
    }
  };

  const handleMaxInputBlur = () => {
    let num = Number(maxInput);
    if (isNaN(num) || maxInput === '') {
      num = absoluteMaxPrice;
    }
    const clamped = Math.min(absoluteMaxPrice, Math.max(num, currentMinPrice));
    setMaxPriceState(clamped);
    setMaxInput(clamped.toString());
  };

  // Percentages for slider styling
  const minPercent = ((currentMinPrice - absoluteMinPrice) / (absoluteMaxPrice - absoluteMinPrice || 1)) * 100;
  const maxPercent = ((currentMaxPrice - absoluteMinPrice) / (absoluteMaxPrice - absoluteMinPrice || 1)) * 100;

  const currentPageProducts = catalog?.products ?? [];
  const totalResults = catalog?.total ?? 0;
  const pageCount = Math.max(1, catalog?.totalPages ?? 1);

  useEffect(() => {
    setPage(1);
  }, [deferredQuery, category, currentMinPrice, currentMaxPrice, sortBy]);

  useEffect(() => {
    if (page > pageCount) setPage(1);
  }, [page, pageCount]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(PAGE_SIZE));
    params.set('sortBy', sortBy);

    if (deferredQuery.trim()) {
      params.set('search', deferredQuery.trim());
    }
    if (category && category !== 'Todos') {
      params.set('category', category);
    }
    if (minPriceState !== null) {
      params.set('minPrice', String(currentMinPrice));
    }
    if (maxPriceState !== null) {
      params.set('maxPrice', String(currentMaxPrice));
    }

    const controller = new AbortController();

    const fetchCatalog = async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const response = await fetch(`/api/products?${params.toString()}`, {
          signal: controller.signal,
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const json = (await response.json()) as CatalogApiResponse;
        setCatalog(json);
      } catch (error) {
        if ((error as Error).name === 'AbortError') return;
        setLoadError('No se pudieron cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();

    return () => controller.abort();
  }, [category, currentMaxPrice, currentMinPrice, deferredQuery, maxPriceState, minPriceState, page, PAGE_SIZE, sortBy]);

  return (
    <section className="space-y-8">
      {/* Filtro de Categorías Horizontal */}
      <div className="flex flex-nowrap overflow-x-auto gap-2 pb-2 -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap items-center">
        {categories.map((categoryItem) => (
          <Button
            key={categoryItem}
            type="button"
            variant={categoryItem === category ? 'primary' : 'secondary'}
            className="whitespace-nowrap px-4 py-2.5 text-xs sm:px-5 sm:py-2.5 sm:text-sm font-medium"
            onClick={() => setCategory(categoryItem)}
          >
            {categoryItem}
          </Button>
        ))}
      </div>

      {/* Buscador y Carrusel de Ancho Completo */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <SearchBar value={query} onChange={setQuery} />
          </div>
          <Button
            type="button"
            variant="secondary"
            className="sm:hidden px-4 py-2 text-xs font-black"
            onClick={() => setShowFilters((value) => !value)}
          >
            {showFilters ? 'Ocultar' : 'Filtrar'}
          </Button>
        </div>
        <div className="hidden sm:block">
          <ProductCarousel products={mergedProducts} />
        </div>
      </div>

      <div className="rounded-[36px] sm:rounded-[40px] border border-softPink/20 bg-white/70 backdrop-blur-sm p-6 sm:p-8 shadow-soft">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-softPink/10 pb-6">
          <div>
            <h2 className="text-2xl font-black text-textPrimary">Resultados</h2>
            <p className="mt-2 text-sm text-[#5D4E6D]/80 font-medium">
              🌸 {totalResults} productos encontrados{' '}
              {deferredQuery ? `para «${deferredQuery}»` : 'en el catálogo'}.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end lg:items-center">
            <Button
              type="button"
              variant="secondary"
              className="sm:hidden px-4 py-2 text-xs font-black"
              onClick={() => setShowFilters((value) => !value)}
            >
              {showFilters ? 'Cerrar filtros' : 'Abrir filtros'}
            </Button>
          </div>
        </div>

        <div className={showFilters ? 'block sm:block' : 'hidden sm:block'}>
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-softPink/10 pb-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end lg:items-center">
              {/* Rango de Precios */}
              <div className="flex flex-col gap-2 min-w-[280px]">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#8C84A2] uppercase tracking-wider">Precio</span>
                  {(minPriceState !== null || maxPriceState !== null) && (
                    <button
                      onClick={() => {
                        setMinPriceState(null);
                        setMaxPriceState(null);
                      }}
                      className="text-xs font-bold text-softPink hover:text-lavender transition-colors duration-200"
                    >
                      Limpiar rango
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center">
                    <span className="absolute left-2.5 text-xs text-slate-400 font-medium">$</span>
                    <input
                      type="number"
                      value={minInput}
                      onChange={handleMinInputChange}
                      onBlur={handleMinInputBlur}
                      className="w-16 rounded-xl border border-softPink/20 bg-white/90 py-1.5 pl-5 pr-1.5 text-center text-xs font-semibold text-textPrimary focus:border-softPink focus:outline-none focus:ring-1 focus:ring-softPink/40"
                    />
                  </div>

                  {/* Slider bar */}
                  <div className="relative flex-1 px-1 py-4">
                    <div className="dual-range-slider relative w-full">
                      {/* Track background */}
                      <div className="absolute top-1/2 left-0 h-1.5 w-full -translate-y-1/2 rounded bg-softPink/10" />
                      {/* Highlighted track */}
                      <div
                        className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded bg-gradient-to-r from-softPink to-lavender"
                        style={{
                          left: `${minPercent}%`,
                          right: `${100 - maxPercent}%`,
                        }}
                      />
                      {/* Intersecting native range inputs */}
                      <input
                        type="range"
                        min={absoluteMinPrice}
                        max={absoluteMaxPrice}
                        value={currentMinPrice}
                        onChange={handleMinSliderChange}
                        className="absolute w-full"
                      />
                      <input
                        type="range"
                        min={absoluteMinPrice}
                        max={absoluteMaxPrice}
                        value={currentMaxPrice}
                        onChange={handleMaxSliderChange}
                        className="absolute w-full"
                      />
                    </div>
                  </div>

                  <div className="relative flex items-center">
                    <span className="absolute left-2.5 text-xs text-slate-400 font-medium">$</span>
                    <input
                      type="number"
                      value={maxInput}
                      onChange={handleMaxInputChange}
                      onBlur={handleMaxInputBlur}
                      className="w-16 rounded-xl border border-softPink/20 bg-white/90 py-1.5 pl-5 pr-1.5 text-center text-xs font-semibold text-textPrimary focus:border-softPink focus:outline-none focus:ring-1 focus:ring-softPink/40"
                    />
                  </div>
                </div>
              </div>

              {/* Ordenación */}
              <div className="flex flex-col gap-2 min-w-[180px]">
                <span className="text-xs font-bold text-[#8C84A2] uppercase tracking-wider">Ordenar por</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-xl border border-softPink/20 bg-white/90 px-3 py-2 text-sm text-textPrimary outline-none focus:border-softPink focus:ring-1 focus:ring-softPink/40 transition duration-200"
                >
                  <option value="name-asc">Nombre: A-Z</option>
                  <option value="name-desc">Nombre: Z-A</option>
                  <option value="price-asc">Precio: Min-Max</option>
                  <option value="price-desc">Precio: Max-Min</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="mt-5 text-sm font-bold text-[#8C84A2]">Cargando productos...</div>
        )}

        {loadError && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
            {loadError}
          </div>
        )}

        <ProductGrid products={currentPageProducts} />

        {pageCount > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button
              type="button"
              variant="secondary"
              className="px-4 py-2 text-xs font-black"
              disabled={page === 1 || loading}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              Anterior
            </Button>
            <span className="rounded-full border border-softPink/30 bg-white/80 px-4 py-2 text-xs font-black text-textPrimary">
              Página {page} / {pageCount}
            </span>
            <Button
              type="button"
              variant="secondary"
              className="px-4 py-2 text-xs font-black"
              disabled={page >= pageCount || loading}
              onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}


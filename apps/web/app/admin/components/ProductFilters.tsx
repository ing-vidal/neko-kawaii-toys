'use client';

import { useState } from 'react';

interface ProductFiltersProps {
  categories: string[];
  onFilter: (filters: {
    category: string;
    status: string;
    minPrice: string;
    maxPrice: string;
    stock: string;
    dateFrom: string;
    dateTo: string;
    sortBy: string;
    sortDir: string;
  }) => void;
  initialValues?: {
    category?: string;
    status?: string;
    minPrice?: string;
    maxPrice?: string;
    stock?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortDir?: string;
  };
}

const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Más recientes' },
  { value: 'createdAt-asc', label: 'Más antiguos' },
  { value: 'name-asc', label: 'Nombre A-Z' },
  { value: 'name-desc', label: 'Nombre Z-A' },
  { value: 'price-asc', label: 'Precio ↑' },
  { value: 'price-desc', label: 'Precio ↓' },
  { value: 'stock-asc', label: 'Stock ↑' },
  { value: 'stock-desc', label: 'Stock ↓' },
];

export function ProductFilters({ categories, onFilter, initialValues = {} }: ProductFiltersProps) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(initialValues.category ?? '');
  const [status, setStatus] = useState(initialValues.status ?? '');
  const [minPrice, setMinPrice] = useState(initialValues.minPrice ?? '');
  const [maxPrice, setMaxPrice] = useState(initialValues.maxPrice ?? '');
  const [stock, setStock] = useState(initialValues.stock ?? '');
  const [dateFrom, setDateFrom] = useState(initialValues.dateFrom ?? '');
  const [dateTo, setDateTo] = useState(initialValues.dateTo ?? '');
  const [sortValue, setSortValue] = useState(
    `${initialValues.sortBy ?? 'createdAt'}-${initialValues.sortDir ?? 'desc'}`
  );

  const activeCount = [category, status, minPrice, maxPrice, stock, dateFrom, dateTo].filter(Boolean).length;

  const apply = (overrides: Record<string, string> = {}) => {
    const [sortBy, sortDir] = (overrides.sortValue ?? sortValue).split('-');
    onFilter({
      category: overrides.category ?? category,
      status: overrides.status ?? status,
      minPrice: overrides.minPrice ?? minPrice,
      maxPrice: overrides.maxPrice ?? maxPrice,
      stock: overrides.stock ?? stock,
      dateFrom: overrides.dateFrom ?? dateFrom,
      dateTo: overrides.dateTo ?? dateTo,
      sortBy,
      sortDir,
    });
  };

  const reset = () => {
    setCategory(''); setStatus(''); setMinPrice(''); setMaxPrice('');
    setStock(''); setDateFrom(''); setDateTo(''); setSortValue('createdAt-desc');
    onFilter({ category: '', status: '', minPrice: '', maxPrice: '', stock: '', dateFrom: '', dateTo: '', sortBy: 'createdAt', sortDir: 'desc' });
    setOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Sort (always visible) */}
      <select
        value={sortValue}
        onChange={(e) => { setSortValue(e.target.value); apply({ sortValue: e.target.value }); }}
        className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/20 transition"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* Filter toggle */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className={`flex h-9 items-center gap-2 rounded-xl border px-3 text-sm font-medium transition ${
            activeCount > 0
              ? 'border-lavender bg-lavender/10 text-slate-700'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filtros
          {activeCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-lavender text-[10px] font-bold text-slate-700">
              {activeCount}
            </span>
          )}
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-11 z-20 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/60 space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Filtros</p>

              <FilterRow label="Categoría">
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-8 rounded-lg border border-slate-200 bg-slate-50 px-2 text-sm text-slate-700 outline-none focus:border-lavender">
                  <option value="">Todas</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </FilterRow>

              <FilterRow label="Estado">
                <select value={status} onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-8 rounded-lg border border-slate-200 bg-slate-50 px-2 text-sm text-slate-700 outline-none focus:border-lavender">
                  <option value="">Todos</option>
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </FilterRow>

              <FilterRow label="Precio ($)">
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} min="0"
                    className="w-full h-8 rounded-lg border border-slate-200 bg-slate-50 px-2 text-sm text-slate-700 outline-none focus:border-lavender" />
                  <span className="text-slate-400">–</span>
                  <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} min="0"
                    className="w-full h-8 rounded-lg border border-slate-200 bg-slate-50 px-2 text-sm text-slate-700 outline-none focus:border-lavender" />
                </div>
              </FilterRow>

              <FilterRow label="Stock">
                <select value={stock} onChange={(e) => setStock(e.target.value)}
                  className="w-full h-8 rounded-lg border border-slate-200 bg-slate-50 px-2 text-sm text-slate-700 outline-none focus:border-lavender">
                  <option value="">Todos</option>
                  <option value="out">Sin stock (0)</option>
                  <option value="low">Stock bajo (1-5)</option>
                  <option value="in">Con stock (&gt;5)</option>
                </select>
              </FilterRow>

              <FilterRow label="Fecha de creación">
                <div className="flex items-center gap-2">
                  <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full h-8 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-700 outline-none focus:border-lavender" />
                  <span className="text-slate-400">–</span>
                  <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                    className="w-full h-8 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-700 outline-none focus:border-lavender" />
                </div>
              </FilterRow>

              <div className="flex gap-2 pt-1 border-t border-slate-100">
                <button onClick={reset} className="flex-1 h-8 rounded-lg border border-slate-200 text-xs text-slate-500 hover:bg-slate-50 transition">
                  Limpiar
                </button>
                <button onClick={() => { apply(); setOpen(false); }}
                  className="flex-1 h-8 rounded-lg bg-gradient-to-r from-softPink to-lavender text-xs font-semibold text-slate-700 shadow-sm hover:opacity-90 transition">
                  Aplicar
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-600">{label}</label>
      {children}
    </div>
  );
}

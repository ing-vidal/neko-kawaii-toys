'use client';

import { useMemo, useState } from 'react';
import { Button } from './Button';
import { ProductGrid } from './ProductGrid';
import { SearchBar } from './SearchBar';
import type { Product } from '@product-types/product';
import { useLocalCatalog } from '@hooks/useLocalCatalog';

const defaultCategories = ['Todos', 'Figuras', 'Peluches', 'Anime', 'Accesorios', 'Coleccionables'] as const;

interface ProductBrowserProps {
  products: Product[];
}

export function ProductBrowser({ products }: ProductBrowserProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('Todos');
  const { products: mergedProducts, categories: adminCategories } = useLocalCatalog(products);

  const categories = useMemo(
    () => Array.from(new Set(['Todos', ...defaultCategories.slice(1), ...adminCategories])) as string[],
    [adminCategories]
  );

  const filteredProducts = useMemo(
    () =>
      mergedProducts.filter((product) => {
        const matchesCategory = category === 'Todos' || product.category === category;
        const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase());
        return matchesCategory && matchesQuery;
      }),
    [category, mergedProducts, query]
  );

  return (
    <section className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <SearchBar value={query} onChange={setQuery} />
        <div className="grid gap-3 rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Filtrar</p>
          <div className="grid gap-2">
            {categories.map((categoryItem) => (
              <Button
                key={categoryItem}
                type="button"
                variant={categoryItem === category ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setCategory(categoryItem)}
              >
                {categoryItem}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[40px] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-textPrimary">Resultados</h2>
            <p className="mt-2 text-sm text-slate-600">
              {filteredProducts.length} productos encontrados{' '}
              {query ? `para «${query}»` : 'en el catálogo'}.
            </p>
          </div>
        </div>
        <ProductGrid products={filteredProducts} />
      </div>
    </section>
  );
}

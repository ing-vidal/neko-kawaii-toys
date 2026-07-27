'use client';

import { useAdminCatalog } from '@hooks/useAdminCatalog';
import { ProductGrid } from './ProductGrid';
import type { Product } from '@product-types/product';

interface CategoryPageClientProps {
  category: string;
  staticProducts: Product[];
}

export function CategoryPageClient({ category, staticProducts }: CategoryPageClientProps) {
  const { products } = useAdminCatalog(staticProducts);

  const categoryProducts = products.filter((product) => product.category === category);

  return (
    <div className="space-y-8">
      <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-soft">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Categoría</p>
          <h1 className="text-4xl font-bold text-textPrimary sm:text-5xl">{category}</h1>
          <p className="max-w-2xl text-slate-600">Explora productos seleccionados de la categoría {category}.</p>
        </div>
      </div>

      {categoryProducts.length === 0 ? (
        <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-soft text-center text-slate-600">
          No se encontraron productos en esta categoría.
        </div>
      ) : (
        <ProductGrid products={categoryProducts} />
      )}
    </div>
  );
}

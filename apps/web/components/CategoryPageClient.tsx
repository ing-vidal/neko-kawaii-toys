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
    <div className="space-y-8 animate-fade-in-up">
      <div className="rounded-[32px] sm:rounded-[36px] border border-softPink/20 bg-white/70 backdrop-blur-sm p-8 shadow-soft">
        <div className="space-y-3">
          <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] bg-gradient-to-r from-softPink via-[#5D4E6D] to-lavender bg-clip-text text-transparent">Categoría</p>
          <h1 className="text-4xl font-black text-textPrimary sm:text-5xl">{category}</h1>
          <p className="max-w-2xl text-[#5D4E6D]/80 font-medium mt-2">Explora productos seleccionados de la categoría {category}.</p>
        </div>
      </div>

      {categoryProducts.length === 0 ? (
        <div className="rounded-[32px] sm:rounded-[36px] border border-softPink/20 bg-white/70 backdrop-blur-sm p-10 shadow-soft text-center text-[#5D4E6D]/80 font-semibold">
          🌸 No se encontraron productos en esta categoría.
        </div>
      ) : (
        <ProductGrid products={categoryProducts} />
      )}
    </div>
  );
}

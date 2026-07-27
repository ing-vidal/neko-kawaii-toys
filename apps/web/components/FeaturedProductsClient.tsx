'use client';

import { useMemo } from 'react';
import { ProductGrid } from './ProductGrid';
import { useLocalCatalog } from '@hooks/useLocalCatalog';
import type { Product } from '@product-types/product';

interface FeaturedProductsClientProps {
  initialProducts: Product[];
}

export function FeaturedProductsClient({ initialProducts }: FeaturedProductsClientProps) {
  const { products } = useLocalCatalog(initialProducts);

  const featuredProducts = useMemo(() => {
    return products.slice(0, 8);
  }, [products]);

  return <ProductGrid products={featuredProducts} />;
}

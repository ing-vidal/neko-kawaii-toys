'use client';

import { useMemo } from 'react';
import { useAdminCatalog } from '@hooks/useAdminCatalog';
import type { Product } from '@product-types/product';
import { getCategories } from '@lib/utils';

export function useLocalCatalog(initialProducts: Product[]) {
  const { products: adminCatalogProducts, categories: adminCategories } = useAdminCatalog(initialProducts);

  const products = useMemo(() => {
    return adminCatalogProducts;
  }, [adminCatalogProducts]);

  const categories = useMemo(
    () => Array.from(new Set([...getCategories(), ...adminCategories])),
    [adminCategories]
  );

  return { products, categories };
}

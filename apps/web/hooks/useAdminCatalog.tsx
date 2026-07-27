'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Product } from '@product-types/product';
import { getCategories } from '@lib/utils';

async function fetchJson<T>(input: string, init?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(input, { ...init, cache: 'no-store' });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export function useAdminCatalog(initialProducts: Product[]) {
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [deletedProductIds, setDeletedProductIds] = useState<string[]>([]);
  const [adminCategories, setAdminCategories] = useState<string[]>([]);

  const refreshCatalog = async () => {
    const [productsResponse, categoriesResponse, deletedResponse] = await Promise.all([
      fetchJson<Product[]>('/api/admin/products'),
      fetchJson<string[]>('/api/admin/categories'),
      fetchJson<string[]>('/api/admin/deleted-products'),
    ]);

    if (productsResponse) setAdminProducts(productsResponse);
    if (categoriesResponse) setAdminCategories(categoriesResponse);
    if (deletedResponse) setDeletedProductIds(deletedResponse);
  };

  useEffect(() => {
    refreshCatalog();
  }, []);

  const addProduct = async (product: Product) => {
    const response = await fetchJson<Product[]>('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });

    if (response) {
      setAdminProducts(response);
      setDeletedProductIds((current) => current.filter((id) => id !== product.id));
      if (!adminCategories.includes(product.category)) {
        setAdminCategories((current) => Array.from(new Set([...current, product.category])));
      }
    }
  };

  const deleteProduct = async (productId: string) => {
    const response = await fetch(`/api/admin/products/${encodeURIComponent(productId)}`, {
      method: 'DELETE',
      cache: 'no-store',
    });

    if (response.ok) {
      await refreshCatalog();
    }
  };

  const products = useMemo(() => {
    const productMap = new Map<string, Product>();

    initialProducts.forEach((product) => productMap.set(product.id, product));
    adminProducts.forEach((product) => productMap.set(product.id, product));

    return Array.from(productMap.values()).filter((product) => !deletedProductIds.includes(product.id));
  }, [initialProducts, adminProducts, deletedProductIds]);

  const categories = useMemo(
    () => Array.from(new Set([...getCategories(), ...adminCategories])),
    [adminCategories]
  );

  return {
    adminProducts,
    deletedProductIds,
    products,
    categories,
    addProduct,
    deleteProduct,
    refreshCatalog,
  };
}

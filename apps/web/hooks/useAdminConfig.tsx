'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@product-types/product';

interface AdminConfig {
  whatsappNumber: string;
  categories: string[];
  products: Product[];
  logoUrl: string;
  bannerUrl: string;
  setWhatsappNumber: (value: string) => Promise<void>;
  addCategory: (value: string) => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  removeProduct: (productId: string) => Promise<void>;
  setLogoUrl: (value: string) => Promise<void>;
  setBannerUrl: (value: string) => Promise<void>;
}

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(input, { ...init, cache: 'no-store' });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export function useAdminConfig(): AdminConfig {
  const [whatsappNumber, setWhatsappNumberState] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [logoUrl, setLogoUrlState] = useState('');
  const [bannerUrl, setBannerUrlState] = useState('');

  useEffect(() => {
    const loadConfig = async () => {
      const config = await fetchJson<{ whatsappNumber: string; logoUrl: string; bannerUrl: string }>('/api/admin/config');
      const serverCategories = await fetchJson<string[]>('/api/admin/categories');
      const serverProducts = await fetchJson<Product[]>('/api/admin/products');

      if (config) {
        setWhatsappNumberState(config.whatsappNumber || '');
        setLogoUrlState(config.logoUrl || '');
        setBannerUrlState(config.bannerUrl || '');
      }

      if (serverCategories) {
        setCategories(serverCategories);
      }

      if (serverProducts) {
        setProducts(serverProducts);
      }
    };

    loadConfig();
  }, []);

  const setWhatsappNumber = async (value: string) => {
    const response = await fetchJson<{ whatsappNumber: string }>('/api/admin/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ whatsappNumber: value }),
    });

    if (response) {
      setWhatsappNumberState(response.whatsappNumber || '');
    }
  };

  const setLogoUrl = async (value: string) => {
    const response = await fetchJson<{ logoUrl: string }>('/api/admin/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logoUrl: value }),
    });

    if (response) {
      setLogoUrlState(response.logoUrl || '');
    }
  };

  const setBannerUrl = async (value: string) => {
    const response = await fetchJson<{ bannerUrl: string }>('/api/admin/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bannerUrl: value }),
    });

    if (response) {
      setBannerUrlState(response.bannerUrl || '');
    }
  };

  const addCategory = async (value: string) => {
    const normalized = value.trim();
    if (!normalized) return;
    const response = await fetchJson<string[]>('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: normalized }),
    });

    if (response) {
      setCategories(response);
    }
  };

  const addProduct = async (product: Product) => {
    const normalized = { ...product, id: product.id.trim() };
    const response = await fetchJson<Product[]>('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalized),
    });

    if (response) {
      setProducts(response);
    }
  };

  const removeProduct = async (productId: string) => {
    const response = await fetch(`/api/admin/products/${encodeURIComponent(productId)}`, {
      method: 'DELETE',
      cache: 'no-store',
    });

    if (response.ok) {
      setProducts((current) => current.filter((product) => product.id !== productId));
    }
  };

  return {
    whatsappNumber,
    categories,
    products,
    logoUrl,
    bannerUrl,
    setWhatsappNumber,
    addCategory,
    addProduct,
    removeProduct,
    setLogoUrl,
    setBannerUrl,
  };
}

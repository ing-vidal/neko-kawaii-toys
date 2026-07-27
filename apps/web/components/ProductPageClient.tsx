'use client';

import { useMemo } from 'react';
import { ProductDetails } from './ProductDetails';
import type { Product } from '@product-types/product';
import { useAdminCatalog } from '@hooks/useAdminCatalog';

interface ProductPageClientProps {
  productId: string;
  staticProduct?: Product;
}

export function ProductPageClient({ productId, staticProduct }: ProductPageClientProps) {
  const { products } = useAdminCatalog(staticProduct ? [staticProduct] : []);

  const product = useMemo(() => {
    return products.find((item) => item.id === productId);
  }, [products, productId]);

  if (!product) {
    return (
      <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-soft text-center text-slate-600">
        <p className="text-lg font-semibold text-textPrimary">Producto no encontrado</p>
        <p className="mt-2 text-sm">Verifica el ID o crea primero ese producto en el panel de administrador.</p>
      </div>
    );
  }

  return <ProductDetails product={product} />;
}

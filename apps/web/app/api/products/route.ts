import { NextResponse } from 'next/server';
import { getProducts } from '@lib/utils';
import { getEffectivePrice } from '@lib/offers';
import type { Product } from '@product-types/product';
import { readAdminProducts, readDeletedProducts } from '../admin/utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const staticProducts = getProducts();
    const adminProducts = await readAdminProducts();
    const deletedProductIds = await readDeletedProducts();

    const catalogMap = new Map<string, Product>();
    staticProducts.forEach((product) => catalogMap.set(product.id, product));
    adminProducts.forEach((product) => {
      if (!deletedProductIds.includes(product.id)) {
        catalogMap.set(product.id, product);
      }
    });

    const products = Array.from(catalogMap.values()).filter((product) => {
      return !deletedProductIds.includes(product.id);
    });

    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const limit = Math.min(80, Math.max(1, Number(searchParams.get('limit') ?? 24)));
    const rawQuery = (searchParams.get('search') ?? '').trim().toLowerCase();
    const category = (searchParams.get('category') ?? 'Todos').trim();
    const sortBy = searchParams.get('sortBy') ?? 'name-asc';

    const minPrice = searchParams.get('minPrice')
      ? Number(searchParams.get('minPrice'))
      : null;
    const maxPrice = searchParams.get('maxPrice')
      ? Number(searchParams.get('maxPrice'))
      : null;

    const filtered = products.filter((product: Product) => {
      const matchesCategory = category === 'Todos' || product.category === category;
      const matchesQuery =
        rawQuery.length === 0 ||
        [product.name, product.category, product.description, product.sku ?? '']
          .some((value) => String(value).toLowerCase().includes(rawQuery));

      const effectivePrice = getEffectivePrice(product);
      const matchesPrice =
        (minPrice === null || effectivePrice >= minPrice) &&
        (maxPrice === null || effectivePrice <= maxPrice);

      return matchesCategory && matchesQuery && matchesPrice;
    });

    filtered.sort((a: Product, b: Product) => {
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'price-asc') return getEffectivePrice(a) - getEffectivePrice(b);
      if (sortBy === 'price-desc') return getEffectivePrice(b) - getEffectivePrice(a);
      return a.name.localeCompare(b.name);
    });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * limit;

    return NextResponse.json({
      products: filtered.slice(start, start + limit),
      total,
      page: safePage,
      totalPages,
      limit,
      hasNextPage: safePage < totalPages,
      hasPreviousPage: safePage > 1,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

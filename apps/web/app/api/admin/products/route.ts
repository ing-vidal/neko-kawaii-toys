import { NextResponse } from 'next/server';
import { readAdminProducts, writeAdminProducts, readDeletedProducts, writeDeletedProducts } from '../utils';
import type { Product } from '@product-types/product';

/** Filtra, ordena y pagina el array de productos en memoria */
function queryProducts(
  products: Product[],
  params: URLSearchParams
): {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
} {
  const search = (params.get('search') ?? '').toLowerCase().trim();
  const category = params.get('category') ?? '';
  const status = params.get('status') ?? '';
  const sortBy = params.get('sortBy') ?? 'createdAt';
  const sortDir = params.get('sortDir') ?? 'desc';
  const minPrice = params.get('minPrice') ? Number(params.get('minPrice')) : null;
  const maxPrice = params.get('maxPrice') ? Number(params.get('maxPrice')) : null;
  const stockFilter = params.get('stock') ?? '';
  const dateFrom = params.get('dateFrom') ?? '';
  const dateTo = params.get('dateTo') ?? '';
  const page = Math.max(1, Number(params.get('page') ?? 1));
  const limit = Math.min(100, Math.max(1, Number(params.get('limit') ?? 20)));

  let filtered = [...products];

  // Búsqueda por texto
  if (search) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        (p.description ?? '').toLowerCase().includes(search) ||
        (p.sku ?? '').toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search)
    );
  }

  // Filtro por categoría
  if (category) {
    filtered = filtered.filter((p) => p.category === category);
  }

  // Filtro por estado
  if (status === 'active') {
    filtered = filtered.filter((p) => (p.status ?? 'active') === 'active');
  } else if (status === 'inactive') {
    filtered = filtered.filter((p) => p.status === 'inactive');
  }

  // Filtro por rango de precio
  if (minPrice !== null) {
    filtered = filtered.filter((p) => p.price >= minPrice);
  }
  if (maxPrice !== null) {
    filtered = filtered.filter((p) => p.price <= maxPrice);
  }

  // Filtro por stock
  if (stockFilter === 'out') {
    filtered = filtered.filter((p) => p.stock === 0);
  } else if (stockFilter === 'low') {
    filtered = filtered.filter((p) => p.stock > 0 && p.stock <= 5);
  } else if (stockFilter === 'in') {
    filtered = filtered.filter((p) => p.stock > 5);
  }

  // Filtro por fecha
  if (dateFrom) {
    const from = new Date(dateFrom).getTime();
    filtered = filtered.filter((p) => {
      const d = p.createdAt ? new Date(p.createdAt).getTime() : 0;
      return d >= from;
    });
  }
  if (dateTo) {
    const to = new Date(dateTo).getTime() + 86400000; // inclusive
    filtered = filtered.filter((p) => {
      const d = p.createdAt ? new Date(p.createdAt).getTime() : 0;
      return d <= to;
    });
  }

  // Ordenamiento
  filtered.sort((a, b) => {
    let cmp = 0;
    switch (sortBy) {
      case 'name':
        cmp = a.name.localeCompare(b.name, 'es');
        break;
      case 'price':
        cmp = a.price - b.price;
        break;
      case 'stock':
        cmp = a.stock - b.stock;
        break;
      case 'createdAt':
      default: {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        cmp = da - db;
        break;
      }
    }
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return {
    products: paginated,
    total,
    page: safePage,
    totalPages,
    hasNextPage: safePage < totalPages,
    hasPreviousPage: safePage > 1,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Soporte legacy: clear=true
    if (searchParams.get('clear') === 'true') {
      await writeAdminProducts([]);
      await writeDeletedProducts([]);
      return NextResponse.json([]);
    }

    const products = await readAdminProducts();

    // Si no hay parámetros de paginación, devolver lista plana (compatibilidad)
    if (!searchParams.has('page') && !searchParams.has('limit') && !searchParams.has('search')) {
      return NextResponse.json(products);
    }

    const result = queryProducts(products, searchParams);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const product = (await request.json()) as Product;
    const currentProducts = await readAdminProducts();

    // Asegurar campos nuevos al crear
    const now = new Date().toISOString();
    const upserted: Product = {
      ...product,
      id: product.id.trim(),
      status: product.status ?? 'active',
      createdAt: product.createdAt ?? now,
    };

    const nextProducts = [...currentProducts.filter((item) => item.id !== upserted.id), upserted];
    await writeAdminProducts(nextProducts);

    const deletedProducts = await readDeletedProducts();
    const nextDeletedProducts = deletedProducts.filter((id) => id !== upserted.id);
    if (nextDeletedProducts.length !== deletedProducts.length) {
      await writeDeletedProducts(nextDeletedProducts);
    }

    return NextResponse.json(nextProducts);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error adding product:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** Bulk actions: activate, deactivate, delete, change category */
export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as {
      ids: string[];
      action: 'activate' | 'deactivate' | 'delete' | 'changeCategory';
      category?: string;
    };

    const { ids, action, category } = body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'ids requerido' }, { status: 400 });
    }

    const products = await readAdminProducts();

    if (action === 'delete') {
      const nextProducts = products.filter((p) => !ids.includes(p.id));
      await writeAdminProducts(nextProducts);
      const deletedProducts = await readDeletedProducts();
      const nextDeleted = Array.from(new Set([...deletedProducts, ...ids]));
      await writeDeletedProducts(nextDeleted);
      return NextResponse.json({ success: true, affected: ids.length });
    }

    const nextProducts = products.map((p) => {
      if (!ids.includes(p.id)) return p;
      if (action === 'activate') return { ...p, status: 'active' as const };
      if (action === 'deactivate') return { ...p, status: 'inactive' as const };
      if (action === 'changeCategory' && category) return { ...p, category };
      return p;
    });

    await writeAdminProducts(nextProducts);
    return NextResponse.json({ success: true, affected: ids.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

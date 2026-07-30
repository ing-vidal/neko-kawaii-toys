import { NextResponse } from 'next/server';
import { readAdminProducts } from '../../utils';
import type { Product } from '@product-types/product';

function escapeCSV(value: string | number | undefined | null): string {
  const str = value == null ? '' : String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') ?? '';
    const status = searchParams.get('status') ?? '';

    let products = await readAdminProducts();

    if (category) products = products.filter((p) => p.category === category);
    if (status === 'active') products = products.filter((p) => (p.status ?? 'active') === 'active');
    if (status === 'inactive') products = products.filter((p) => p.status === 'inactive');

    const headers = ['nombre', 'descripcion', 'precio', 'stock', 'categoria', 'imagen', 'estado', 'sku', 'rating', 'resenas', 'id', 'createdAt'];
    const rows = products.map((p: Product) => [
      escapeCSV(p.name),
      escapeCSV(p.description),
      escapeCSV(p.price),
      escapeCSV(p.stock),
      escapeCSV(p.category),
      escapeCSV(p.image),
      escapeCSV(p.status ?? 'active'),
      escapeCSV(p.sku),
      escapeCSV(p.rating),
      escapeCSV(p.reviews),
      escapeCSV(p.id),
      escapeCSV(p.createdAt),
    ].join(','));

    const csv = [headers.join(','), ...rows].join('\r\n');
    const filename = `productos-${new Date().toISOString().slice(0, 10)}.csv`;

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

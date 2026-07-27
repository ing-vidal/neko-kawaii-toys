import { NextResponse } from 'next/server';
import { readDeletedProducts, writeDeletedProducts } from '../utils';

export async function GET() {
  const deletedProducts = await readDeletedProducts();
  return NextResponse.json(deletedProducts);
}

export async function POST(request: Request) {
  const body = (await request.json()) as { productId?: string };
  const productId = body.productId?.trim();
  if (!productId) {
    return NextResponse.json(await readDeletedProducts());
  }

  const deletedProducts = await readDeletedProducts();
  const nextDeletedProducts = Array.from(new Set([...deletedProducts, productId]));
  await writeDeletedProducts(nextDeletedProducts);
  return NextResponse.json(nextDeletedProducts);
}

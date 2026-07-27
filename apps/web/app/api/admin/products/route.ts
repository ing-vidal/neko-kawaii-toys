import { NextResponse } from 'next/server';
import { readAdminProducts, writeAdminProducts, readDeletedProducts, writeDeletedProducts } from '../utils';
import type { Product } from '@product-types/product';

export async function GET() {
  const products = await readAdminProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const product = (await request.json()) as Product;
  const currentProducts = await readAdminProducts();
  const upserted = { ...product, id: product.id.trim() };
  const nextProducts = [...currentProducts.filter((item) => item.id !== upserted.id), upserted];
  await writeAdminProducts(nextProducts);

  const deletedProducts = await readDeletedProducts();
  const nextDeletedProducts = deletedProducts.filter((id) => id !== upserted.id);
  if (nextDeletedProducts.length !== deletedProducts.length) {
    await writeDeletedProducts(nextDeletedProducts);
  }

  return NextResponse.json(nextProducts);
}

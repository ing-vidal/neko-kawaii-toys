import { NextResponse } from 'next/server';
import { readAdminProducts, writeAdminProducts, readDeletedProducts, writeDeletedProducts } from '../utils';
import type { Product } from '@product-types/product';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    if (searchParams.get('clear') === 'true') {
      await writeAdminProducts([]);
      await writeDeletedProducts([]);
      return NextResponse.json([]);
    }
    const products = await readAdminProducts();
    return NextResponse.json(products);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error adding product:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

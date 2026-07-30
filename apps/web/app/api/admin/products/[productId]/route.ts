import { NextResponse } from 'next/server';
import {
  readAdminProducts,
  writeAdminProducts,
  readDeletedProducts,
  writeDeletedProducts,
} from '../../utils';
import type { Product } from '@product-types/product';

export async function GET(request: Request, { params }: { params: { productId: string } }) {
  const products = await readAdminProducts();
  const product = products.find((item: Product) => item.id === params.productId);
  if (!product) {
    return new NextResponse('Product not found', { status: 404 });
  }
  return NextResponse.json(product);
}

/** Actualización completa del producto */
export async function PUT(request: Request, { params }: { params: { productId: string } }) {
  try {
    const updated = (await request.json()) as Product;
    const products = await readAdminProducts();
    const exists = products.some((p) => p.id === params.productId);
    if (!exists) {
      return new NextResponse('Product not found', { status: 404 });
    }
    const nextProducts = products.map((p: Product) =>
      p.id === params.productId ? { ...updated, id: params.productId } : p
    );
    await writeAdminProducts(nextProducts);
    return NextResponse.json(nextProducts.find((p) => p.id === params.productId));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { productId: string } }) {
  try {
    const productId = params.productId;
    const products = await readAdminProducts();
    const deletedProducts = await readDeletedProducts();

    const nextProducts = products.filter((item: Product) => item.id !== productId);
    await writeAdminProducts(nextProducts);

    if (!deletedProducts.includes(productId)) {
      await writeDeletedProducts([...deletedProducts, productId]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

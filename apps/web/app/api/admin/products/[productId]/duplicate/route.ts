import { NextResponse } from 'next/server';
import { readAdminProducts, writeAdminProducts } from '../../../utils';
import type { Product } from '@product-types/product';

/** Duplica un producto con un nuevo ID */
export async function POST(request: Request, { params }: { params: { productId: string } }) {
  try {
    const products = await readAdminProducts();
    const original = products.find((p) => p.id === params.productId);
    if (!original) {
      return new NextResponse('Product not found', { status: 404 });
    }

    const timestamp = Date.now();
    const newId = `${original.id}-copy-${timestamp}`;
    const duplicate: Product = {
      ...original,
      id: newId,
      name: `${original.name} (Copia)`,
      sku: original.sku ? `${original.sku}-COPY` : undefined,
      createdAt: new Date().toISOString(),
    };

    const nextProducts = [...products, duplicate];
    await writeAdminProducts(nextProducts);
    return NextResponse.json(duplicate, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import {
  readAdminProducts,
  writeAdminProducts,
  readDeletedProducts,
  writeDeletedProducts,
} from '../../utils';

export async function GET(request: Request, { params }: { params: { productId: string } }) {
  const products = await readAdminProducts();
  const product = products.find((item) => item.id === params.productId);
  if (!product) {
    return new NextResponse('Product not found', { status: 404 });
  }
  return NextResponse.json(product);
}

export async function DELETE(request: Request, { params }: { params: { productId: string } }) {
  const productId = params.productId;
  const products = await readAdminProducts();
  const deletedProducts = await readDeletedProducts();

  const nextProducts = products.filter((item) => item.id !== productId);
  await writeAdminProducts(nextProducts);

  if (!deletedProducts.includes(productId)) {
    await writeDeletedProducts([...deletedProducts, productId]);
  }

  return NextResponse.json({ success: true });
}

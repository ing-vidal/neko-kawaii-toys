import { NextResponse } from 'next/server';
import { readAdminCategories, writeAdminCategories } from '../utils';

export async function GET() {
  const categories = await readAdminCategories();
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const body = (await request.json()) as { category?: string };
  const currentCategories = await readAdminCategories();
  const normalized = body.category?.trim();

  if (!normalized) {
    return NextResponse.json(currentCategories);
  }

  const nextCategories = Array.from(new Set([...currentCategories, normalized]));
  await writeAdminCategories(nextCategories);
  return NextResponse.json(nextCategories);
}

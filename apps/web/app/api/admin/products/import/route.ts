import { NextResponse } from 'next/server';
import { readAdminProducts, writeAdminProducts, readAdminCategories } from '../../utils';
import type { Product } from '@product-types/product';



function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    // Handle quoted fields
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') {
        inQuotes = !inQuotes;
      } else if (line[i] === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += line[i];
      }
    }
    values.push(current.trim());

    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i] ?? '';
    });
    return row;
  });
}

export async function POST(request: Request) {
  try {
    const text = await request.text();
    const rows = parseCSV(text);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'CSV vacío o sin datos' }, { status: 400 });
    }

    const existingCategories = await readAdminCategories();
    const currentProducts = await readAdminProducts();
    const now = new Date().toISOString();

    const imported: Product[] = [];
    const errors: { row: number; error: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // +2 porque la fila 1 es el header

      const nombre = row['nombre']?.trim();
      const precio = Number(row['precio']);
      const stock = Number(row['stock']);
      const categoria = row['categoria']?.trim();
      const estado = row['estado']?.trim().toLowerCase();

      if (!nombre) {
        errors.push({ row: rowNum, error: 'nombre requerido' });
        continue;
      }
      if (isNaN(precio) || precio < 0) {
        errors.push({ row: rowNum, error: `precio inválido: "${row['precio']}"` });
        continue;
      }
      if (isNaN(stock) || stock < 0) {
        errors.push({ row: rowNum, error: `stock inválido: "${row['stock']}"` });
        continue;
      }
      if (categoria && !existingCategories.includes(categoria) && existingCategories.length > 0) {
        // Warning only — we allow new categories
      }

      const id = slugify(nombre) + '-' + Date.now() + '-' + i;
      const product: Product = {
        id,
        name: nombre,
        description: row['descripcion']?.trim() || '',
        price: precio,
        stock,
        category: categoria || existingCategories[0] || 'General',
        image: row['imagen']?.trim() || '',
        rating: 0,
        reviews: 0,
        sku: row['sku']?.trim() || undefined,
        status: (estado === 'inactivo' || estado === 'inactive') ? 'inactive' : 'active',
        createdAt: now,
      };
      imported.push(product);
    }

    if (imported.length > 0) {
      const productMap = new Map(currentProducts.map((p) => [p.id, p]));
      imported.forEach((p) => productMap.set(p.id, p));
      await writeAdminProducts(Array.from(productMap.values()));
    }

    return NextResponse.json({
      imported: imported.length,
      errors: errors.length,
      errorDetails: errors,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

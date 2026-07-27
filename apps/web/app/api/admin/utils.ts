import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import type { Product } from '@product-types/product';

let dataDirectory = '';
try {
  const cwd = process.cwd();
  if (cwd.includes('apps/web') || cwd.includes('apps\\web')) {
    dataDirectory = path.join(cwd, 'data');
  } else {
    dataDirectory = path.join(cwd, 'apps/web/data');
  }
} catch {
  try {
    dataDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../../data');
  } catch {
    dataDirectory = './data';
  }
}

const isKvEnabled = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

async function ensureDataDir() {
  await fs.mkdir(dataDirectory, { recursive: true });
}

async function readJson<T>(filename: string, defaultValue: T): Promise<T> {
  if (isKvEnabled) {
    try {
      const key = `neko_kawaii:${filename}`;
      const response = await fetch(`${process.env.KV_REST_API_URL}/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(['GET', key]),
        cache: 'no-store',
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.result !== null) {
          const val = data.result;
          return typeof val === 'string' ? (JSON.parse(val) as T) : (val as T);
        }
      } else {
        const errText = await response.text();
        console.error(`Vercel KV read returned non-OK: ${response.status} ${errText}`);
      }
    } catch (e) {
      console.error('Error reading from Vercel KV:', e);
    }
  }

  const filePath = path.join(dataDirectory, filename);
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

async function writeJson<T>(filename: string, data: T): Promise<void> {
  if (isKvEnabled) {
    const key = `neko_kawaii:${filename}`;
    const response = await fetch(`${process.env.KV_REST_API_URL}/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['SET', key, JSON.stringify(data)]),
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Vercel KV write failed: ${response.status} ${errText}`);
    }
    return;
  }

  // Check if we are running in Vercel production without KV
  if (process.env.VERCEL) {
    throw new Error('No se pueden guardar cambios: Vercel KV no está configurado (faltan KV_REST_API_URL y KV_REST_API_TOKEN en las variables de entorno de Vercel).');
  }

  const filePath = path.join(dataDirectory, filename);
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export interface AdminConfigData {
  whatsappNumber: string;
  logoUrl: string;
  bannerUrl: string;
}

export const defaultAdminConfig: AdminConfigData = {
  whatsappNumber: '',
  logoUrl: '',
  bannerUrl: '',
};

export async function readAdminConfig(): Promise<AdminConfigData> {
  return readJson<AdminConfigData>('admin-config.json', defaultAdminConfig);
}

export async function writeAdminConfig(config: AdminConfigData): Promise<void> {
  await writeJson('admin-config.json', config);
}

export async function readAdminCategories(): Promise<string[]> {
  return readJson<string[]>('admin-categories.json', []);
}

export async function writeAdminCategories(categories: string[]): Promise<void> {
  await writeJson('admin-categories.json', categories);
}

export async function readAdminProducts(): Promise<Product[]> {
  return readJson<Product[]>('admin-products.json', []);
}

export async function writeAdminProducts(products: Product[]): Promise<void> {
  await writeJson('admin-products.json', products);
}

export async function readDeletedProducts(): Promise<string[]> {
  return readJson<string[]>('admin-deleted-products.json', []);
}

export async function writeDeletedProducts(productIds: string[]): Promise<void> {
  await writeJson('admin-deleted-products.json', productIds);
}

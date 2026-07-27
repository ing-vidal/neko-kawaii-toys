import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import type { Product } from '@product-types/product';

const dataDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../../data');

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
      }
    } catch (e) {
      console.error('Error reading from Vercel KV:', e);
    }
  }

  const filePath = path.join(dataDirectory, filename);
  try {
    await ensureDataDir();
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    try {
      await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
    } catch {
      // Ignore write errors on read-only environments
    }
    return defaultValue;
  }
}

async function writeJson<T>(filename: string, data: T): Promise<void> {
  if (isKvEnabled) {
    try {
      const key = `neko_kawaii:${filename}`;
      const response = await fetch(`${process.env.KV_REST_API_URL}/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(['SET', key, JSON.stringify(data)]),
      });
      if (response.ok) {
        return;
      }
    } catch (e) {
      console.error('Error writing to Vercel KV:', e);
    }
  }

  const filePath = path.join(dataDirectory, filename);
  await ensureDataDir();
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    if (!isKvEnabled) {
      throw err;
    }
  }
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

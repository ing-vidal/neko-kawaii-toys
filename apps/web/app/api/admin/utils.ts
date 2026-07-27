import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import type { Product } from '@product-types/product';

const dataDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../../data');

async function ensureDataDir() {
  await fs.mkdir(dataDirectory, { recursive: true });
}

async function readJson<T>(filename: string, defaultValue: T): Promise<T> {
  const filePath = path.join(dataDirectory, filename);
  try {
    await ensureDataDir();
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
    return defaultValue;
  }
}

async function writeJson<T>(filename: string, data: T): Promise<void> {
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

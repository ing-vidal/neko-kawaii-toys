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
  emailIconUrl: string;
  instagramIconUrl: string;
  facebookIconUrl: string;
  whatsappIconUrl: string;
}

export const defaultAdminConfig: AdminConfigData = {
  whatsappNumber: '',
  logoUrl: '',
  bannerUrl: '',
  emailIconUrl: '',
  instagramIconUrl: '',
  facebookIconUrl: '',
  whatsappIconUrl: '',
};

export async function readAdminConfig(): Promise<AdminConfigData> {
  const config = await readJson<AdminConfigData>('admin-config.json', defaultAdminConfig);
  let needsWriteBack = false;
  const cleanedConfig = { ...config };

  if (config.logoUrl && config.logoUrl.startsWith('data:') && config.logoUrl.length > 300000) {
    needsWriteBack = true;
    console.log(`Auto-healing config logo: too large (${config.logoUrl.length} chars). Replacing with empty string.`);
    cleanedConfig.logoUrl = '';
  }

  if (config.bannerUrl && config.bannerUrl.startsWith('data:') && config.bannerUrl.length > 500000) {
    needsWriteBack = true;
    console.log(`Auto-healing config banner: too large (${config.bannerUrl.length} chars). Replacing with empty string.`);
    cleanedConfig.bannerUrl = '';
  }

  if (needsWriteBack) {
    try {
      await writeAdminConfig(cleanedConfig);
      console.log('Successfully wrote back cleaned config to database.');
    } catch (e) {
      console.error('Failed to write back cleaned config:', e);
    }
  }

  return cleanedConfig;
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
  const products = await readJson<Product[]>('admin-products.json', []);
  let needsWriteBack = false;
  const cleanedProducts = products.map((product) => {
    if (product.image && product.image.startsWith('data:') && product.image.length > 300000) {
      needsWriteBack = true;
      console.log(`Auto-healing product ${product.id}: image too large (${product.image.length} chars). Replacing with empty string.`);
      return {
        ...product,
        image: '',
      };
    }
    return product;
  });

  if (needsWriteBack) {
    try {
      await writeAdminProducts(cleanedProducts);
      console.log('Successfully wrote back cleaned products to database.');
    } catch (e) {
      console.error('Failed to write back cleaned products:', e);
    }
  }

  return cleanedProducts;
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

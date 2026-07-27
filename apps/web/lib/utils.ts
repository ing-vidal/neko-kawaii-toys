import { Product, ProductCategory } from '@product-types/product';
import products from '@data/products';

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);

export const getProducts = (): Product[] => products;

export const getProductById = (id: string): Product | undefined =>
  products.find((product) => product.id === id);

export const getProductsByCategory = (category: ProductCategory): Product[] =>
  products.filter((product) => product.category === category);

export const getFeaturedProducts = (): Product[] => products.slice(0, 8);

export const getCategories = (): ProductCategory[] => [
  'Figuras',
  'Peluches',
  'Anime',
  'Accesorios',
  'Coleccionables'
];

export const calculateCartTotal = (items: Array<{ product: Product; quantity: number }>) =>
  items.reduce((total, item) => total + item.product.price * item.quantity, 0);

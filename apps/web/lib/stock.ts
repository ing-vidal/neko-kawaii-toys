/**
 * stock.ts — Lógica centralizada de disponibilidad de inventario.
 *
 * Esta es la fuente de verdad única para determinar el estado de stock.
 * Catálogo, detalle de producto y panel de administración deben importar
 * desde aquí para garantizar un comportamiento 100% consistente.
 */

export type StockStatus = 'available' | 'low' | 'out';

/**
 * Retorna true si el producto está agotado (stock <= 0).
 */
export function isOutOfStock(stock: number): boolean {
  return stock <= 0;
}

/**
 * Retorna el estado de disponibilidad del inventario en tres niveles:
 * - 'out'       → stock <= 0  (Agotado)
 * - 'low'       → 1 <= stock <= 5  (Últimas piezas)
 * - 'available' → stock > 5  (Disponible)
 */
export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) return 'out';
  if (stock <= 5) return 'low';
  return 'available';
}

/**
 * Retorna la etiqueta de texto que corresponde al estado del stock.
 * Ejemplos: "Producto agotado", "Últimas 3 piezas", "Disponible"
 */
export function getStockLabel(stock: number): string {
  const status = getStockStatus(stock);
  if (status === 'out') return 'Producto agotado';
  if (status === 'low') return `Últimas ${stock} ${stock === 1 ? 'pieza' : 'piezas'}`;
  return 'Disponible';
}

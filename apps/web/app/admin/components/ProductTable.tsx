'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@hooks/useToast';
import { DeleteDialog } from './DeleteDialog';
import { StockBadge } from '@components/StockBadge';
import type { Product } from '@product-types/product';


interface ProductTableProps {
  products: Product[];
  selectedIds: string[];
  onSelectAll: (ids: string[]) => void;
  onSelectOne: (id: string, checked: boolean) => void;
  onDelete: (id: string) => Promise<void>;
  onDuplicate: (id: string) => Promise<void>;
  onRefresh: () => void;
}

const STATUS_LABELS: Record<string, { label: string; classes: string }> = {
  active: { label: 'Activo', classes: 'bg-emerald-100 text-emerald-700' },
  inactive: { label: 'Inactivo', classes: 'bg-slate-100 text-slate-500' },
};

export function ProductTable({
  products,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onDelete,
  onDuplicate,
  onRefresh,
}: ProductTableProps) {
  const { addToast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingLoading, setDeletingLoading] = useState(false);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  const allSelected = products.length > 0 && selectedIds.length === products.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setDeletingLoading(true);
    try {
      await onDelete(deletingId);
      addToast('Producto eliminado.', 'success');
      onRefresh();
    } catch {
      addToast('Error al eliminar el producto.', 'error');
    } finally {
      setDeletingLoading(false);
      setDeletingId(null);
    }
  };

  const handleDuplicate = async (id: string) => {
    setDuplicatingId(id);
    try {
      await onDuplicate(id);
      addToast('Producto duplicado.', 'success');
      onRefresh();
    } catch {
      addToast('Error al duplicar el producto.', 'error');
    } finally {
      setDuplicatingId(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="w-10 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => { if (el) el.indeterminate = someSelected; }}
                  onChange={(e) =>
                    onSelectAll(e.target.checked ? products.map((p) => p.id) : [])
                  }
                  className="h-4 w-4 rounded accent-lavender cursor-pointer"
                  aria-label="Seleccionar todos"
                />
              </th>
              <th className="w-12 px-2 py-3" />
              <Th>Nombre</Th>
              <Th>SKU</Th>
              <Th>Categoría</Th>
              <Th>Precio</Th>
              <Th>Stock</Th>
              <Th>Estado</Th>
              <Th>Creado</Th>
              <th className="px-4 py-3 text-right">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const isSelected = selectedIds.includes(product.id);
              const status = product.status ?? 'active';
              const statusInfo = STATUS_LABELS[status] ?? STATUS_LABELS.active;

              return (
                <tr
                  key={product.id}
                  className={`border-b border-slate-50 transition-colors last:border-0 ${
                    isSelected
                      ? 'bg-lavender/5'
                      : product.stock <= 0
                      ? 'admin-row-out-of-stock hover:bg-rose-50/70'
                      : 'hover:bg-slate-50/60'
                  }`}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => onSelectOne(product.id, e.target.checked)}
                      className="h-4 w-4 rounded accent-lavender cursor-pointer"
                      aria-label={`Seleccionar ${product.name}`}
                    />
                  </td>

                  {/* Image */}
                  <td className="px-2 py-3">
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-300">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Name */}
                  <td className="px-3 py-3 max-w-[180px]">
                    <p className="font-medium text-slate-800 truncate">{product.name}</p>
                    {product.description && (
                      <p className="text-xs text-slate-400 truncate mt-0.5">{product.description}</p>
                    )}
                  </td>

                  {/* SKU */}
                  <td className="px-3 py-3">
                    {product.sku ? (
                      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600 font-mono">
                        {product.sku}
                      </code>
                    ) : (
                      <span className="text-slate-300 text-xs">—</span>
                    )}
                  </td>

                  {/* Category */}
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-lavender/20 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                      {product.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    {product.hasOffer && product.offerPrice != null ? (
                      <div>
                        <span className="text-rose-600 font-semibold">${product.offerPrice}</span>
                        <span className="ml-1.5 text-xs text-slate-400 line-through">${product.price}</span>
                      </div>
                    ) : (
                      <span className="font-medium text-slate-700">${product.price}</span>
                    )}
                  </td>

                  {/* Stock */}
                  <td className="px-3 py-3">
                    <StockBadge stock={product.stock} variant="admin" />
                  </td>

                  {/* Status */}
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusInfo.classes}`}>
                      {statusInfo.label}
                    </span>
                  </td>

                  {/* Created at */}
                  <td className="px-3 py-3 whitespace-nowrap text-xs text-slate-400">
                    {product.createdAt
                      ? new Date(product.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: '2-digit' })
                      : '—'}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
                        title="Editar"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>

                      <button
                        onClick={() => handleDuplicate(product.id)}
                        disabled={duplicatingId === product.id}
                        title="Duplicar"
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all disabled:opacity-40"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>

                      <button
                        onClick={() => setDeletingId(product.id)}
                        title="Eliminar"
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <DeleteDialog
        open={!!deletingId}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
        loading={deletingLoading}
      />
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
      {children}
    </th>
  );
}

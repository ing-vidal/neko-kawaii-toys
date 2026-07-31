'use client';

import { getStockStatus, getStockLabel } from '@lib/stock';

interface StockBadgeProps {
  stock: number;
  /**
   * 'card'   — compacto, para ProductCard (debajo del precio)
   * 'detail' — completo, para ProductDetails
   * 'admin'  — con icono solo, para la tabla de administración
   */
  variant?: 'card' | 'detail' | 'admin';
}

const STATUS_CONFIG = {
  available: {
    dot: '🟢',
    textClass: 'text-emerald-700',
    bgClass: 'bg-emerald-50 border-emerald-200',
  },
  low: {
    dot: '🟡',
    textClass: 'text-amber-700',
    bgClass: 'bg-amber-50 border-amber-200',
  },
  out: {
    dot: '🔴',
    textClass: 'text-rose-700',
    bgClass: 'bg-rose-50 border-rose-200',
  },
} as const;

export function StockBadge({ stock, variant = 'card' }: StockBadgeProps) {
  const status = getStockStatus(stock);
  const label = getStockLabel(stock);
  const config = STATUS_CONFIG[status];

  /* ── Admin variant: solo el dot + número (o "Agotado") ── */
  if (variant === 'admin') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tabular-nums ${config.bgClass} ${config.textClass}`}
      >
        <span aria-hidden="true">{config.dot}</span>
        {status === 'out' ? 'Agotado' : stock}
      </span>
    );
  }

  /* ── Card / Detail variant ── */
  return (
    <p
      className={`flex items-center gap-1.5 text-xs font-semibold ${config.textClass}`}
      aria-label={label}
    >
      <span aria-hidden="true">{config.dot}</span>
      {label}
    </p>
  );
}

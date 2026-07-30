'use client';

import { useState } from 'react';
import { useToast } from '@hooks/useToast';

interface BulkActionsProps {
  selectedIds: string[];
  availableCategories: string[];
  onSuccess: () => void;
  onClear: () => void;
}

export function BulkActions({ selectedIds, availableCategories, onSuccess, onClear }: BulkActionsProps) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [changingCategory, setChangingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  if (selectedIds.length === 0) return null;

  const runAction = async (action: string, extra?: Record<string, string>) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, action, ...extra }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { affected: number };
      addToast(`${data.affected} productos actualizados.`, 'success');
      onSuccess();
      onClear();
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Error al ejecutar la acción.', 'error');
    } finally {
      setLoading(false);
      setChangingCategory(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-lavender/40 bg-lavender/10 px-4 py-3">
      <span className="text-sm font-semibold text-slate-700">
        {selectedIds.length} seleccionado{selectedIds.length !== 1 ? 's' : ''}
      </span>

      <div className="flex flex-wrap items-center gap-2 ml-auto">
        {/* Activate */}
        <ActionButton
          label="Activar"
          color="emerald"
          disabled={loading}
          onClick={() => runAction('activate')}
          icon={
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          }
        />

        {/* Deactivate */}
        <ActionButton
          label="Desactivar"
          color="amber"
          disabled={loading}
          onClick={() => runAction('deactivate')}
          icon={
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          }
        />

        {/* Change category */}
        {!changingCategory ? (
          <ActionButton
            label="Cambiar categoría"
            color="slate"
            disabled={loading}
            onClick={() => setChangingCategory(true)}
            icon={
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            }
          />
        ) : (
          <div className="flex items-center gap-1.5">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-lavender"
            >
              <option value="">Categoría…</option>
              {availableCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button
              disabled={!newCategory || loading}
              onClick={() => runAction('changeCategory', { category: newCategory })}
              className="h-8 rounded-lg bg-slate-700 px-3 text-xs text-white font-medium disabled:opacity-50 hover:bg-slate-800 transition"
            >
              Aplicar
            </button>
            <button
              onClick={() => setChangingCategory(false)}
              className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-600 transition text-lg leading-none"
            >
              ×
            </button>
          </div>
        )}

        {/* Delete */}
        <ActionButton
          label="Eliminar"
          color="rose"
          disabled={loading}
          onClick={() => runAction('delete')}
          icon={
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          }
        />

        {/* Clear selection */}
        <button
          onClick={onClear}
          className="ml-1 text-xs text-slate-400 hover:text-slate-600 transition underline underline-offset-2"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

const colorClasses: Record<string, string> = {
  emerald: 'bg-emerald-500 hover:bg-emerald-600 text-white',
  amber: 'bg-amber-400 hover:bg-amber-500 text-white',
  rose: 'bg-rose-500 hover:bg-rose-600 text-white',
  slate: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
};

function ActionButton({
  label,
  color,
  disabled,
  onClick,
  icon,
}: {
  label: string;
  color: string;
  disabled: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg px-3 h-8 text-xs font-semibold transition-all active:scale-[0.97] disabled:opacity-50 ${colorClasses[color]}`}
    >
      {icon}
      {label}
    </button>
  );
}

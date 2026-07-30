'use client';

import { useEffect, useRef } from 'react';
import { useToast } from '@hooks/useToast';

const ICONS: Record<string, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};

const COLORS: Record<string, string> = {
  success: 'bg-emerald-500',
  error: 'bg-rose-500',
  info: 'bg-lavender',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onClose,
}: {
  toast: { id: string; message: string; type: string };
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.animate(
      [
        { opacity: 0, transform: 'translateX(100%) scale(0.95)' },
        { opacity: 1, transform: 'translateX(0) scale(1)' },
      ],
      { duration: 250, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'forwards' }
    );
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-white border border-slate-200 shadow-lg px-4 py-3 min-w-[280px] max-w-[380px]"
    >
      <span
        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-white text-xs font-bold ${COLORS[toast.type] ?? COLORS.info}`}
      >
        {ICONS[toast.type] ?? ICONS.info}
      </span>
      <p className="flex-1 text-sm text-slate-700 font-medium leading-snug">{toast.message}</p>
      <button
        onClick={onClose}
        className="ml-1 text-slate-400 hover:text-slate-600 transition-colors text-lg leading-none"
        aria-label="Cerrar notificación"
      >
        ×
      </button>
    </div>
  );
}

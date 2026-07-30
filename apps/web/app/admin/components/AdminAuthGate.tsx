'use client';

import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { useAdminAccess } from '@hooks/useAdminAccess';

export function AdminAuthGate({ children }: { children: ReactNode }) {
  const { authenticated, unlock, defaultPassword } = useAdminAccess();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (authenticated) return <>{children}</>;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!unlock(password)) {
      setError('Contraseña incorrecta. Intenta de nuevo.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-softPink to-lavender shadow-md">
              <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Panel de Administración</h1>
            <p className="mt-1 text-sm text-slate-500">
              Contraseña predeterminada:{' '}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-slate-600">
                {defaultPassword}
              </code>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                autoFocus
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-lavender focus:bg-white focus:ring-2 focus:ring-lavender/30"
              />
              {error && <p className="mt-1.5 text-xs font-medium text-rose-500">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-softPink to-lavender py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:opacity-90 hover:shadow-md active:scale-[0.98]"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

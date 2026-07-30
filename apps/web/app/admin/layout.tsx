import type { ReactNode } from 'react';
import { ToastProvider } from '@hooks/useToast';
import { AdminAuthGate } from './components/AdminAuthGate';
import { AdminShell } from './components/AdminShell';
import { ToastContainer } from './components/Toast';

export const metadata = {
  title: 'Admin — Neko Kawaii Toys',
  description: 'Panel de administración de productos y configuración de la tienda',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AdminAuthGate>
        <AdminShell>
          {children}
        </AdminShell>
        <ToastContainer />
      </AdminAuthGate>
    </ToastProvider>
  );
}

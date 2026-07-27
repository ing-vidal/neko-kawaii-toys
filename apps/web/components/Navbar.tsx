'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@hooks/useCart';
import { useAdminConfig } from '@hooks/useAdminConfig';
import { CartIcon } from './CartIcon';

const navItems = [
  { label: 'Inicio', href: '/' },
  { label: 'Productos', href: '/products' },
  { label: 'Categorías', href: '/categories/Figuras' },
  { label: 'Ofertas', href: '/products' },
  { label: 'Nosotros', href: '/about' },
  { label: 'Contacto', href: '/contact' }
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();

  const { logoUrl } = useAdminConfig();

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-lg font-bold text-textPrimary">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo de Neko Kawaii Toys" className="h-10 w-10 rounded-2xl object-cover" />
          ) : (
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blush text-2xl">🐾</span>
          )}
          Neko Kawaii Toys
        </Link>
        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-600 transition hover:text-accent">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <CartIcon count={totalItems} />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-xl text-textPrimary lg:hidden"
            aria-label="Abrir menú"
          >
            ☰
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-slate-200 bg-white/95 px-5 py-4 lg:hidden">
          <div className="space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-3xl px-4 py-3 text-sm font-medium text-textPrimary transition hover:bg-softPink"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

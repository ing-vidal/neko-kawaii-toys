'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@hooks/useCart';
import { useAdminConfig } from '@hooks/useAdminConfig';
import { CartIcon } from './CartIcon';

const navItems = [
  { label: 'Productos', href: '/products' },
  { label: 'Contacto', href: '/contact' }
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();

  const { logoUrl } = useAdminConfig();

  return (
    <header className="sticky top-0 z-40 navbar-glass transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
        <Link href="/products" className="flex items-center gap-3 text-lg font-black tracking-tight text-textPrimary transition hover:scale-[1.02] active:scale-95 duration-200">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo de Neko Kawaii Toys" className="h-10 w-10 rounded-[16px] border-2 border-softPink/40 object-cover shadow-sm" />
          ) : (
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-[16px] bg-gradient-to-br from-softPink via-white to-sky text-2xl shadow-sm border border-softPink/30">🌸</span>
          )}
          <span className="bg-gradient-to-r from-textPrimary via-[#5D4E6D] to-textPrimary bg-clip-text text-transparent font-extrabold">Neko Kawaii Toys</span>
        </Link>
        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="relative text-sm font-semibold text-[#5D4E6D] transition duration-200 hover:text-[#3B3443] group">
              {item.label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-softPink to-lavender transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <CartIcon count={totalItems} />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-softPink/20 bg-white/70 backdrop-blur-md text-xl text-textPrimary lg:hidden transition hover:bg-softPink/10 hover:border-softPink/50"
            aria-label="Abrir menú"
          >
            ☰
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-softPink/20 bg-white/90 backdrop-blur-xl px-5 py-4 lg:hidden">
          <div className="space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-3xl px-5 py-3 text-sm font-semibold text-textPrimary transition duration-200 hover:bg-gradient-to-r hover:from-softPink/20 hover:to-lavender/20"
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

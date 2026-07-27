import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { CartProvider } from '@hooks/useCart';
import { Navbar } from '@components/Navbar';
import { Footer } from '@components/Footer';

export const metadata: Metadata = {
  title: 'Neko Kawaii Toys',
  description: 'Tienda kawaii premium de figuras, peluches y accesorios kawaii.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[#F8F6FF] text-textPrimary">
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

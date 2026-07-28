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
      <body className="min-h-screen">
        <div className="washi-pattern" />
        <div className="sakura-container">
          <div className="sakura-petal" style={{ left: '5%', animationDelay: '0s', animationDuration: '12s', width: '14px', height: '9px' }} />
          <div className="sakura-petal" style={{ left: '15%', animationDelay: '3.5s', animationDuration: '14s', width: '10px', height: '7px' }} />
          <div className="sakura-petal" style={{ left: '30%', animationDelay: '1.2s', animationDuration: '11s', width: '16px', height: '11px' }} />
          <div className="sakura-petal" style={{ left: '45%', animationDelay: '6s', animationDuration: '15s', width: '12px', height: '8px' }} />
          <div className="sakura-petal" style={{ left: '60%', animationDelay: '2.5s', animationDuration: '13s', width: '15px', height: '10px' }} />
          <div className="sakura-petal" style={{ left: '75%', animationDelay: '8s', animationDuration: '16s', width: '11px', height: '7px' }} />
          <div className="sakura-petal" style={{ left: '90%', animationDelay: '4.5s', animationDuration: '12s', width: '13px', height: '9px' }} />
          <div className="sakura-petal" style={{ left: '22%', animationDelay: '9s', animationDuration: '13s', width: '14px', height: '9px' }} />
          <div className="sakura-petal" style={{ left: '52%', animationDelay: '11s', animationDuration: '15s', width: '12px', height: '8px' }} />
          <div className="sakura-petal" style={{ left: '83%', animationDelay: '5.5s', animationDuration: '14s', width: '15px', height: '10px' }} />
        </div>
        <CartProvider>
          <Navbar />
          <main className="relative z-10 min-h-screen animate-fade-in-up">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

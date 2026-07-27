import { CartSummary } from '@components/CartSummary';

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Carrito</p>
        <h1 className="text-4xl font-bold text-textPrimary sm:text-5xl">Tus productos favoritos</h1>
        <p className="max-w-2xl text-slate-600">
          Revisa los artículos que agregaste y completa tu compra cuando estés listo.
        </p>
      </div>
      <CartSummary />
    </div>
  );
}

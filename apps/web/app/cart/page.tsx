import { CartSummary } from '@components/CartSummary';

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 space-y-3">
        <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] bg-gradient-to-r from-softPink via-[#5D4E6D] to-lavender bg-clip-text text-transparent">Carrito</p>
        <h1 className="text-4xl font-black text-textPrimary sm:text-5xl">Tus productos favoritos</h1>
        <p className="max-w-2xl text-[#5D4E6D]/80 font-medium mt-2">
          Revisa los artículos que agregaste y completa tu compra cuando estés listo.
        </p>
      </div>
      <CartSummary />
    </div>
  );
}

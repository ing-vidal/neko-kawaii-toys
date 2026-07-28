import { ProductBrowser } from '@components/ProductBrowser';
import { getProducts } from '@lib/utils';

export default function ProductsPage() {
  const products = getProducts();

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 space-y-3">
        <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] bg-gradient-to-r from-softPink via-[#5D4E6D] to-lavender bg-clip-text text-transparent">Catálogo completo</p>
        <h1 className="text-4xl font-black text-textPrimary sm:text-5xl">Explora todas las novedades kawaii</h1>
        <p className="max-w-2xl text-[#5D4E6D]/80 font-medium mt-2">
          Descubre figuras, peluches y accesorios seleccionados para crear un estilo único y adorable.
        </p>
      </div>
      <ProductBrowser products={products} />
    </div>
  );
}

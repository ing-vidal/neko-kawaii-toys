import { ProductBrowser } from '@components/ProductBrowser';
import { getProducts } from '@lib/utils';

export default function ProductsPage() {
  const products = getProducts();

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Catálogo completo</p>
        <h1 className="text-4xl font-bold text-textPrimary sm:text-5xl">Explora todas las novedades kawaii</h1>
        <p className="max-w-2xl text-slate-600">
          Descubre figuras, peluches y accesorios seleccionados para crear un estilo único y adorable.
        </p>
      </div>
      <ProductBrowser products={products} />
    </div>
  );
}

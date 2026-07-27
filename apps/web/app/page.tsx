import Link from 'next/link';
import { CategoryCard } from '@components/CategoryCard';
import { Hero } from '@components/Hero';
import { Newsletter } from '@components/Newsletter';
import { ProductGrid } from '@components/ProductGrid';
import { getFeaturedProducts } from '@lib/utils';

const categories = [
  {
    title: 'Figuras',
    description: 'Piezas de colección con detalles premium, perfectas para vitrinas y regalos.',
    href: '/products'
  },
  {
    title: 'Peluches',
    description: 'Suaves, tiernos y con estilo para decorar cualquier rincón kawaii.',
    href: '/products'
  },
  {
    title: 'Accesorios',
    description: 'Complementos inspirados en el anime y la cultura japonesa para tu día a día.',
    href: '/products'
  }
];

export default function HomePage() {
  const products = getFeaturedProducts();

  return (
    <div className="bg-[#F8F6FF]">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <Hero />

        <section className="mt-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Categorías destacadas</p>
              <h2 className="mt-3 text-3xl font-bold text-textPrimary sm:text-4xl">Explora las piezas más adorables</h2>
            </div>
            <Link href="/products" className="text-sm font-semibold text-accent transition hover:text-[#6549ff]">
              Ver todo
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((item) => (
              <CategoryCard key={item.title} title={item.title} description={item.description} href={item.href} />
            ))}
          </div>
        </section>

        <section className="mt-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Colección seleccionada</p>
              <h2 className="mt-3 text-3xl font-bold text-textPrimary sm:text-4xl">Productos kawaii destacados</h2>
            </div>
            <Link href="/products" className="text-sm font-semibold text-accent transition hover:text-[#6549ff]">
              Ver catálogo completo
            </Link>
          </div>

          <div className="mt-8">
            <ProductGrid products={products} />
          </div>
        </section>

        <section className="mt-20">
          <Newsletter />
        </section>
      </div>
    </div>
  );
}

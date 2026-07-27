import { CategoryPageClient } from '@components/CategoryPageClient';
import { getProducts } from '@lib/utils';

const categories = ['Figuras', 'Peluches', 'Anime', 'Accesorios', 'Coleccionables'] as const;

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = params.category;
  const products = getProducts().filter((product) => product.category === category);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <CategoryPageClient category={category} staticProducts={products} />
    </div>
  );
}

export function generateStaticParams() {
  return categories.map((category) => ({ category }));
}

import { ProductPageClient } from '@components/ProductPageClient';
import { getProductById, getProducts } from '@lib/utils';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(params.id);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <ProductPageClient productId={params.id} staticProduct={product ?? undefined} />
    </div>
  );
}

export function generateStaticParams() {
  return getProducts().map((product) => ({ id: product.id }));
}

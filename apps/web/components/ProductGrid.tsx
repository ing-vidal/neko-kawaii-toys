import { Product } from '@product-types/product';
import { ProductCard } from './ProductCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import type { CampaignId } from '@lib/campaigns';

interface ProductGridProps {
  products: Product[];
  campaignId?: CampaignId | null;
}

export function ProductGrid({ products, campaignId = null }: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} campaignId={campaignId} />
      ))}
    </div>
  );
}

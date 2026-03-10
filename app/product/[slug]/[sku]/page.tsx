import { products } from '@/data/products';
import VariantDetailPage from './VariantPageClient';

export function generateStaticParams() {
  return products.flatMap(p =>
    p.variants.map(v => ({ slug: p.slug, sku: v.sku }))
  );
}

export default function Page() {
  return <VariantDetailPage />;
}

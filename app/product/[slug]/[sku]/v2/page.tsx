import { products } from '@/data/products';
import VariantDetailV2Page from './VariantV2PageClient';

export function generateStaticParams() {
  return products.flatMap(p =>
    p.variants.map(v => ({ slug: p.slug, sku: v.sku }))
  );
}

export default function Page() {
  return <VariantDetailV2Page />;
}

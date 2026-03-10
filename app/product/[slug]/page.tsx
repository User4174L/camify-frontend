import { products } from '@/data/products';
import ProductPage from './ProductPageClient';

export function generateStaticParams() {
  return products.map(p => ({ slug: p.slug }));
}

export default function Page() {
  return <ProductPage />;
}

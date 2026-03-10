import { products } from '@/data/products';
import BrandPage from './BrandPageClient';

export function generateStaticParams() {
  const brands = [...new Set(products.map(p => p.brand.toLowerCase()))];
  return brands.map(brand => ({ brand }));
}

export default function Page() {
  return <BrandPage />;
}

'use client';

import ProductCard from './ProductCard';
import type { Product } from '@/data/products';

export default function ProductGrid({
  products,
  onQuickView,
}: {
  products: Product[];
  onQuickView?: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
      ))}
    </div>
  );
}

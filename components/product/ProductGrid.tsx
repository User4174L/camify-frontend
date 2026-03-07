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
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 16,
      }}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
      ))}
    </div>
  );
}

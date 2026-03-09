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
    <div className="product-grid-responsive">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
      ))}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ProductGrid from '@/components/product/ProductGrid';
import QuickView from '@/components/product/QuickView';
import { products } from '@/data/products';

export default function BrandPage() {
  const params = useParams();
  const brandSlug = params.brand as string;
  const brandName = brandSlug.charAt(0).toUpperCase() + brandSlug.slice(1);
  const brandProducts = products.filter(p => p.brand.toLowerCase() === brandSlug.toLowerCase());
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const quickViewProduct = quickViewId ? products.find(p => p.id === quickViewId) ?? null : null;

  const cameraCount = brandProducts.filter(p => p.category === 'cameras').length;
  const lensCount = brandProducts.filter(p => p.category === 'lenses').length;
  const accessoryCount = brandProducts.filter(p => !['cameras', 'lenses'].includes(p.category)).length;

  return (
    <div className="container">
      <Breadcrumb items={[
        { label: 'Brands', href: '/brands' },
        { label: brandName },
      ]} />

      <div className="brand-hero">
        <div className="brand-hero__logo">
          <span style={{ fontSize: 20, fontWeight: 700 }}>{brandName.charAt(0)}</span>
        </div>
        <h1 className="brand-hero__title">{brandName}</h1>
      </div>

      <div className="brand-cats__grid">
        <Link href={`/brands/${brandSlug}/cameras`} className="brand-cat-card" style={{ background: 'var(--dark)' }}>
          <div className="brand-cat-card__count">{cameraCount || 42}</div>
          <div className="brand-cat-card__name">Cameras</div>
          <div className="brand-cat-card__sub">Camera bodies</div>
        </Link>
        <Link href={`/brands/${brandSlug}/lenses`} className="brand-cat-card" style={{ background: '#3d4263' }}>
          <div className="brand-cat-card__count">{lensCount || 86}</div>
          <div className="brand-cat-card__name">Lenses</div>
          <div className="brand-cat-card__sub">All lens mounts</div>
        </Link>
        <Link href={`/brands/${brandSlug}/accessories`} className="brand-cat-card" style={{ background: 'var(--accent)' }}>
          <div className="brand-cat-card__count">{accessoryCount || 124}</div>
          <div className="brand-cat-card__name">Accessories</div>
          <div className="brand-cat-card__sub">Grips, batteries, more</div>
        </Link>
      </div>

      <div className="results-bar">
        <span>Showing {brandProducts.length} results</span>
        <select defaultValue="relevance">
          <option value="relevance">Sort by: Relevance</option>
          <option value="price-low">Price: low → high</option>
          <option value="price-high">Price: high → low</option>
        </select>
      </div>

      <ProductGrid products={brandProducts} onQuickView={setQuickViewId} />

      <QuickView product={quickViewProduct} onClose={() => setQuickViewId(null)} />
    </div>
  );
}

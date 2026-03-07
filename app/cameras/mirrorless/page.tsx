'use client';

import { useState } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ProductGrid from '@/components/product/ProductGrid';
import QuickView from '@/components/product/QuickView';
import { products } from '@/data/products';

const mirrorlessProducts = products.filter(p => p.category === 'cameras');

const mountFilters = [
  { label: 'All Mirrorless', href: '/cameras/mirrorless', active: true },
  { label: 'Canon R', href: '/cameras/mirrorless/canon-r', count: 124 },
  { label: 'Nikon Z', href: '/cameras/mirrorless/nikon-z', count: 98 },
  { label: 'Sony E / FE', href: '/cameras/mirrorless/sony-e-fe', count: 186 },
  { label: 'Fujifilm X', href: '/cameras/mirrorless/fujifilm-x', count: 112 },
  { label: 'Olympus / OM System', href: '/cameras/mirrorless/olympus-om-system', count: 67 },
  { label: 'Panasonic', href: '/cameras/mirrorless/panasonic-g', count: 45 },
  { label: 'Leica', href: '/cameras/mirrorless/leica-sl', count: 23 },
];

export default function MirrorlessPage() {
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const quickViewProduct = quickViewId ? products.find(p => p.id === quickViewId) ?? null : null;

  return (
    <div className="container">
      <Breadcrumb items={[
        { label: 'Cameras', href: '/cameras' },
        { label: 'Mirrorless' },
      ]} />

      <div style={{ marginBottom: 8 }}>
        <h1 className="section__title">Mirrorless Cameras</h1>
        <p className="section__subtitle">856 mirrorless cameras from top brands</p>
      </div>

      <div className="subcat-scroll">
        {mountFilters.map(m => (
          <Link key={m.href} href={m.href} className={`subcat-card${m.active ? ' subcat-card--active' : ''}`}>
            <div className="subcat-card__label">{m.label}</div>
            {m.count && <div className="subcat-card__count">{m.count}</div>}
          </Link>
        ))}
      </div>

      <div className="filter-bar">
        <div className="filter-dd-wrap">
          <button className="filter-dd-btn" onClick={() => setOpenFilter(openFilter === 'brand' ? null : 'brand')}>
            Brand <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          <div className={`filter-dd${openFilter === 'brand' ? ' is-open' : ''}`}>
            {['Canon', 'Nikon', 'Sony', 'Fujifilm', 'Leica', 'Panasonic', 'Olympus'].map(b => (
              <label key={b}><input type="checkbox" /> {b}</label>
            ))}
          </div>
        </div>
        <div className="filter-dd-wrap">
          <button className="filter-dd-btn" onClick={() => setOpenFilter(openFilter === 'condition' ? null : 'condition')}>
            Condition <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          <div className={`filter-dd${openFilter === 'condition' ? ' is-open' : ''}`}>
            {['As New', 'Excellent', 'Good', 'Used', 'Heavily Used'].map(c => (
              <label key={c}><input type="checkbox" /> {c}</label>
            ))}
          </div>
        </div>
      </div>

      <div className="results-bar">
        <span>Showing {mirrorlessProducts.length} results</span>
        <select defaultValue="relevance">
          <option value="relevance">Sort by: Relevance</option>
          <option value="price-low">Price: low → high</option>
          <option value="price-high">Price: high → low</option>
          <option value="newest">Newest first</option>
        </select>
      </div>

      <ProductGrid products={mirrorlessProducts} onQuickView={setQuickViewId} />

      <div className="pagination">
        <button className="pagination__btn">←</button>
        <button className="pagination__btn pagination__btn--active">1</button>
        <button className="pagination__btn">2</button>
        <button className="pagination__btn">3</button>
        <button className="pagination__btn">→</button>
      </div>

      <QuickView product={quickViewProduct} onClose={() => setQuickViewId(null)} />
    </div>
  );
}

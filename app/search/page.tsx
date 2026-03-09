'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ProductGrid from '@/components/product/ProductGrid';
import QuickView from '@/components/product/QuickView';
import { products } from '@/data/products';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const [notifyModal, setNotifyModal] = useState<string | null>(null);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  const quickViewProduct = quickViewId ? products.find(p => p.id === quickViewId) ?? null : null;

  let searchResults = query.length > 0
    ? products.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase())
      )
    : products;

  if (category.length > 0) {
    searchResults = searchResults.filter(p =>
      p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (sortBy === 'price-low') searchResults = [...searchResults].sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-high') searchResults = [...searchResults].sort((a, b) => b.price - a.price);

  return (
    <div className="container">
      <Breadcrumb items={[{ label: query ? `Search: "${query}"` : 'All Products' }]} />

      <h1 className="section__title" style={{ marginBottom: 8 }}>
        {query ? <>Results for &ldquo;{query}&rdquo;</> : 'All Products'}
      </h1>
      <p className="section__subtitle">{searchResults.length} results found</p>

      <div className="results-bar">
        <span>Showing {searchResults.length} results</span>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="relevance">Sort by: Relevance</option>
          <option value="price-low">Price: low → high</option>
          <option value="price-high">Price: high → low</option>
        </select>
      </div>

      <ProductGrid products={searchResults} onQuickView={setQuickViewId} />

      <QuickView product={quickViewProduct} onClose={() => setQuickViewId(null)} />

      {/* Notify Modal */}
      {notifyModal && (
        <div className="notify-modal-bg is-open" onClick={() => { setNotifyModal(null); setNotifySuccess(false); }}>
          <div className="notify-modal" onClick={e => e.stopPropagation()}>
            <button className="notify-modal__close" onClick={() => { setNotifyModal(null); setNotifySuccess(false); }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
            {!notifySuccess ? (
              <>
                <div className="notify-modal__title">Get notified</div>
                <div className="notify-modal__subtitle">We will email you when {notifyModal} becomes available.</div>
                <label>Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={notifyEmail}
                  onChange={e => setNotifyEmail(e.target.value)}
                />
                <button
                  className="notify-modal__submit"
                  onClick={() => { if (notifyEmail.includes('@')) setNotifySuccess(true); }}
                >
                  Notify me
                </button>
                <div className="notify-modal__disclaimer">You will receive an email each time a matching item is listed.</div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 48, height: 48, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width="24" height="24" fill="none" stroke="#166534" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
                </div>
                <div className="notify-modal__title">Alert created!</div>
                <p style={{ fontSize: 14, color: 'var(--text-sec)', marginTop: 8 }}>We will notify {notifyEmail} when available.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '48px 24px' }}>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}

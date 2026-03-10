'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ProductGrid from '@/components/product/ProductGrid';
import QuickView from '@/components/product/QuickView';
import { products } from '@/data/products';
import { assetPath } from '@/lib/utils';

const allMirrorless = products.filter(p => p.category === 'cameras');

const mountFilters = [
  { label: 'All Mirrorless', href: '/cameras/mirrorless', active: true, image: null, count: 856 },
  { label: 'Canon R', href: '/cameras/mirrorless/canon-r', active: false, image: '/images/canon-r5.jpg', count: 124 },
  { label: 'Nikon Z', href: '/cameras/mirrorless/nikon-z', active: false, image: '/images/nikon-z8.jpg', count: 98 },
  { label: 'Sony E / FE', href: '/cameras/mirrorless/sony-e-fe', active: false, image: '/images/sony-a7-iv.jpg', count: 186 },
  { label: 'Fujifilm X', href: '/cameras/mirrorless/fujifilm-x', active: false, image: '/images/fujifilm-x-t4.jpg', count: 112 },
  { label: 'Olympus / OM System', href: '/cameras/mirrorless/olympus-om-system', active: false, image: '/images/nikon-zf.jpg', count: 67 },
  { label: 'Panasonic', href: '/cameras/mirrorless/panasonic-g', active: false, image: '/images/sony-a1.jpg', count: 45 },
  { label: 'Leica', href: '/cameras/mirrorless/leica-sl', active: false, image: '/images/hasselblad-x2d-100c.jpg', count: 23 },
];

const brandOptions = ['Canon', 'Nikon', 'Sony', 'Fujifilm', 'Leica', 'Panasonic', 'Olympus'];
const conditionOptions = ['As New', 'Excellent', 'Good', 'Used', 'Heavily Used'];

const ArrowLeft = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ArrowRight = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export default function MirrorlessPage() {
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterBarRef.current && !filterBarRef.current.contains(e.target as Node)) {
        setOpenFilter(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    let result = [...allMirrorless];
    if (selectedBrands.length > 0) result = result.filter(p => selectedBrands.includes(p.brand));
    if (selectedConditions.length > 0) result = result.filter(p => p.variants.some(v => selectedConditions.includes(v.conditionLabel)));
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'newest') result.sort((a, b) => Number(b.id) - Number(a.id));
    return result;
  }, [selectedBrands, selectedConditions, sortBy]);

  const ITEMS_PER_PAGE = 16;
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const firstHalf = paginated.slice(0, 8);
  const secondHalf = paginated.slice(8);

  const quickViewProduct = quickViewId ? products.find(p => p.id === quickViewId) ?? null : null;

  const toggleBrand = (b: string) => setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  const toggleCondition = (c: string) => setSelectedConditions(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

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

      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '4px 0', marginBottom: 20, scrollbarWidth: 'none' }}>
        {mountFilters.map(m => (
          <Link
            key={m.href}
            href={m.href}
            style={{
              flex: '0 0 130px', width: 130, borderRadius: 12,
              border: m.active ? '2px solid #f97316' : '1.5px solid #e5e7eb',
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
              alignItems: 'center', textDecoration: 'none', color: 'inherit',
              background: '#fff', transition: 'border-color 0.2s',
            }}
          >
            <div style={{ width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10%', background: m.image ? '#fff' : '#1f2937' }}>
              {m.image ? (
                <img src={assetPath(m.image)} alt={m.label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              )}
            </div>
            <div style={{ padding: '8px 6px', textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.2 }}>{m.label}</div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{m.count} products</div>
            </div>
          </Link>
        ))}
      </div>

      <div ref={filterBarRef} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {[{ key: 'brand', label: 'Brand', options: brandOptions, selected: selectedBrands, toggle: toggleBrand },
          { key: 'condition', label: 'Condition', options: conditionOptions, selected: selectedConditions, toggle: toggleCondition }
        ].map(f => (
          <div key={f.key} style={{ position: 'relative' }}>
            <button
              onClick={() => setOpenFilter(openFilter === f.key ? null : f.key)}
              style={{
                display: 'inline-flex', alignItems: 'center', padding: '8px 16px', borderRadius: 999,
                border: f.selected.length > 0 ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
                background: openFilter === f.key ? 'var(--accent)' : f.selected.length > 0 ? 'rgba(249,115,22,0.1)' : 'transparent',
                color: openFilter === f.key ? '#fff' : 'var(--text)',
                fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              {f.label}{f.selected.length > 0 ? ` (${f.selected.length})` : ''}
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginLeft: 4 }}><path d="m6 9 6 6 6-6" /></svg>
            </button>
            {openFilter === f.key && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', left: 0, background: '#fff',
                border: '1.5px solid var(--border)', borderRadius: 12, padding: '8px 0',
                minWidth: 180, zIndex: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              }}>
                {f.options.map(opt => (
                  <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer' }}>
                    <input type="checkbox" checked={f.selected.includes(opt)} onChange={() => f.toggle(opt)} style={{ accentColor: 'var(--accent)' }} /> {opt}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, fontSize: 14, color: 'var(--text-secondary)' }}>
        <span>Showing {filtered.length} results</span>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
          padding: '6px 12px', borderRadius: 8, border: '1.5px solid var(--border)',
          background: '#fff', color: 'var(--text)', fontSize: 13, cursor: 'pointer',
        }}>
          <option value="relevance">Sort by: Relevance</option>
          <option value="price-low">Price: low → high</option>
          <option value="price-high">Price: high → low</option>
          <option value="newest">Newest first</option>
        </select>
      </div>

      <ProductGrid products={firstHalf} onQuickView={setQuickViewId} />

      {secondHalf.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, padding: '28px 0', margin: '24px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            {['12-month warranty', 'Professionally inspected', 'Free shipping from €50', '14-day returns'].map(text => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
                {text}
              </div>
            ))}
          </div>
          <ProductGrid products={secondHalf} onQuickView={setQuickViewId} />
        </>
      )}

      {/* Pagination */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4,
          margin: '32px 0',
        }}
      >
        <button
          onClick={() => {
            if (currentPage > 1) { setCurrentPage(currentPage - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
          }}
          disabled={currentPage <= 1}
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            border: '1.5px solid var(--border)',
            background: 'transparent',
            cursor: currentPage <= 1 ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: currentPage <= 1 ? 'var(--text-tertiary, #ccc)' : 'var(--text)',
            opacity: currentPage <= 1 ? 0.4 : 1,
          }}
        >
          <ArrowLeft />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: page === currentPage ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
              background: page === currentPage ? 'var(--accent)' : 'transparent',
              color: page === currentPage ? '#fff' : 'var(--text)',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: page === currentPage ? 600 : 400,
            }}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => {
            if (currentPage < totalPages) { setCurrentPage(currentPage + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
          }}
          disabled={currentPage >= totalPages}
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            border: '1.5px solid var(--border)',
            background: 'transparent',
            cursor: currentPage >= totalPages ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: currentPage >= totalPages ? 'var(--text-tertiary, #ccc)' : 'var(--text)',
            opacity: currentPage >= totalPages ? 0.4 : 1,
          }}
        >
          <ArrowRight />
        </button>
        <span style={{ marginLeft: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {/* OOS CTA */}
      <div style={{ textAlign: 'center', padding: '32px 0', borderTop: '1px solid var(--border)', marginTop: 16 }}>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 16 }}>
          Looking for a model that&apos;s currently unavailable?
        </p>
        <Link href="/cameras/mirrorless/out-of-stock" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '12px 28px', border: '2px solid var(--accent)',
          borderRadius: 999, background: 'transparent', color: 'var(--accent)',
          fontSize: 14, fontWeight: 600, textDecoration: 'none',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          View out of stock &amp; set alerts
        </Link>
      </div>

      {/* SEO text */}
      <div style={{ padding: '32px 0', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Buy Used Mirrorless Cameras</h2>
        <div style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)', maxWidth: 800 }}>
          <p>Mirrorless cameras have become the standard for modern photography. With electronic viewfinders, in-body stabilisation, and advanced autofocus systems, they outperform traditional DSLRs in nearly every way. At Camera-tweedehands.nl, every mirrorless camera is professionally inspected and backed by our 12-month warranty.</p>
          <p style={{ marginTop: 12 }}>Browse our collection from Canon, Nikon, Sony, Fujifilm, and more. Each listing includes accurate shutter counts, real photos, and detailed condition reports.</p>
        </div>
      </div>

      {/* FAQs */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Frequently asked questions</h2>
        <div className="accordion">
          {[
            { q: 'What is the advantage of mirrorless over DSLR?', a: 'Mirrorless cameras are generally lighter, more compact, and offer faster autofocus with better eye and subject tracking. They also provide real-time exposure preview through the electronic viewfinder.' },
            { q: 'Do all mirrorless cameras have in-body stabilisation?', a: 'Not all. Higher-end models from Sony, Nikon, Canon, and Fujifilm include IBIS (In-Body Image Stabilisation), but some entry-level models rely on lens-based stabilisation only. Check the specifications on each listing.' },
            { q: 'Can I use my DSLR lenses on a mirrorless camera?', a: 'In most cases, yes — with the right adapter. Canon EF lenses work on Canon RF bodies, Nikon F lenses on Nikon Z bodies, and so on. Adapted lenses may have slightly slower autofocus depending on the combination.' },
            { q: 'How do I choose the right mirrorless camera?', a: 'Consider your primary use (portraits, sports, landscape, video), budget, and preferred brand ecosystem. Full-frame models offer the best image quality, while APS-C and Micro Four Thirds systems are more compact and affordable.' },
          ].map((faq, i) => (
            <div key={i} className={`accordion__item${openFaq === i ? ' is-open' : ''}`}>
              <button className="accordion__trigger" aria-expanded={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {faq.q}
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <div className="accordion__body"><p>{faq.a}</p></div>
            </div>
          ))}
        </div>
      </div>

      <QuickView product={quickViewProduct} onClose={() => setQuickViewId(null)} />
    </div>
  );
}

'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ProductGrid from '@/components/product/ProductGrid';
import QuickView from '@/components/product/QuickView';
import { products } from '@/data/products';
import { assetPath } from '@/lib/utils';

const allCanon = products.filter(p => p.brand === 'Canon' && p.category === 'cameras');

const popularModels = [
  { name: 'Canon R5', image: '/images/canon-r5.jpg', count: 12, slug: 'canon-eos-r5' },
  { name: 'Canon R5 II', image: '/images/canon-r5.jpg', count: 8, slug: 'canon-eos-r5-ii' },
  { name: 'Canon R6 II', image: '/images/canon-r5.jpg', count: 15, slug: 'canon-eos-r6-ii' },
  { name: 'Canon R6', image: '/images/canon-r5.jpg', count: 18, slug: 'canon-eos-r6' },
  { name: 'Canon R3', image: '/images/canon-r5.jpg', count: 5, slug: 'canon-eos-r3' },
  { name: 'Canon R7', image: '/images/canon-r5.jpg', count: 9, slug: 'canon-eos-r7' },
  { name: 'Canon R8', image: '/images/canon-r5.jpg', count: 7, slug: 'canon-eos-r8' },
  { name: 'Canon R10', image: '/images/canon-r5.jpg', count: 11, slug: 'canon-eos-r10' },
  { name: 'Canon R50', image: '/images/canon-r5.jpg', count: 6, slug: 'canon-eos-r50' },
  { name: 'Canon R100', image: '/images/canon-r5.jpg', count: 4, slug: 'canon-eos-r100' },
  { name: 'Canon RP', image: '/images/canon-r5.jpg', count: 20, slug: 'canon-eos-rp' },
  { name: 'Canon R1', image: '/images/canon-r5.jpg', count: 1, slug: 'canon-eos-r1' },
  { name: 'Canon R', image: '/images/canon-r5.jpg', count: 3, slug: 'canon-eos-r' },
  { name: 'Canon R5 C', image: '/images/canon-r5.jpg', count: 2, slug: 'canon-eos-r5-c' },
  { name: 'Canon R6 III', image: '/images/canon-r5.jpg', count: 1, slug: 'canon-eos-r6-iii' },
  { name: 'Canon R7 II', image: '/images/canon-r5.jpg', count: 4, slug: 'canon-eos-r7-ii' },
];

const conditionOptions = ['As New', 'Excellent', 'Good', 'Used'];
const priceOptions = ['Under €1,000', '€1,000 – €2,000', '€2,000 – €3,000', '€3,000+'];
const sensorOptions = ['Full Frame', 'APS-C'];

function matchesPrice(price: number, range: string): boolean {
  if (range === 'Under €1,000') return price < 1000;
  if (range === '€1,000 – €2,000') return price >= 1000 && price <= 2000;
  if (range === '€2,000 – €3,000') return price >= 2000 && price <= 3000;
  if (range === '€3,000+') return price >= 3000;
  return false;
}

const orangeLink: React.CSSProperties = {
  color: 'var(--accent)',
  fontWeight: 600,
  textDecoration: 'none',
};

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

export default function CanonRPage() {
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [readMore, setReadMore] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);
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

  const filters = [
    { key: 'Condition', options: conditionOptions, selected: selectedConditions, toggle: (v: string) => setSelectedConditions(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]) },
    { key: 'Price', options: priceOptions, selected: selectedPrices, toggle: (v: string) => setSelectedPrices(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]) },
    { key: 'Sensor Size', options: sensorOptions, selected: selectedSensors, toggle: (v: string) => setSelectedSensors(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]) },
  ];

  const filtered = useMemo(() => {
    let result = [...allCanon];
    if (selectedConditions.length > 0) result = result.filter(p => p.variants.some(v => selectedConditions.includes(v.conditionLabel)));
    if (selectedPrices.length > 0) result = result.filter(p => selectedPrices.some(r => matchesPrice(p.price, r)));
    if (selectedSensors.length > 0) result = result.filter(p => {
      const s = p.specs?.['Sensor']?.toLowerCase() || '';
      return selectedSensors.some(f => f === 'Full Frame' ? s.includes('full frame') : s.includes('aps-c'));
    });
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'newest') result.sort((a, b) => Number(b.id) - Number(a.id));
    return result;
  }, [selectedConditions, selectedPrices, selectedSensors, sortBy]);

  const ITEMS_PER_PAGE = 16;
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const firstHalf = paginated.slice(0, 8);
  const secondHalf = paginated.slice(8);

  const quickViewProduct = quickViewId ? products.find(p => p.id === quickViewId) ?? null : null;

  return (
    <div className="container">
      <Breadcrumb items={[
        { label: 'Cameras', href: '/cameras' },
        { label: 'Mirrorless', href: '/cameras/mirrorless' },
        { label: 'Canon R' },
      ]} />

      {/* Title + SEO intro */}
      <div style={{ marginBottom: 24 }}>
        <h1 className="section__title" style={{ marginBottom: 8 }}>Canon R Mirrorless Cameras</h1>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: 800 }}>
          Discover our selection of used Canon EOS R mirrorless cameras. From the professional{' '}
          <Link href="/product/canon-eos-r5" style={orangeLink}>Canon R5</Link> and{' '}
          <Link href="/product/canon-eos-r3" style={orangeLink}>R3</Link> to the versatile{' '}
          <Link href="/product/canon-eos-r6-ii" style={orangeLink}>R6 II</Link> and affordable{' '}
          <Link href="/product/canon-eos-rp" style={orangeLink}>RP</Link> &mdash; every camera is professionally
          inspected, graded and backed by our 12-month warranty.
        </p>

        {!readMore && (
          <button
            onClick={() => setReadMore(true)}
            style={{
              background: 'none', border: 'none', color: 'var(--accent)',
              fontWeight: 600, fontSize: 14, cursor: 'pointer', padding: '8px 0 0',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}
          >
            Read more <span style={{ fontSize: 12 }}>&#8595;</span>
          </button>
        )}

        {readMore && (
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: 800, marginTop: 12 }}>
            Canon&apos;s EOS R system combines industry-leading autofocus with exceptional image quality.
            The full-frame R5 and R3 deliver professional-grade performance, while the APS-C R7 and R10 offer
            outstanding value. All Canon R mount cameras in our inventory include accurate shutter counts and
            detailed condition reports. Compatible with all Canon RF and RF-S lenses.
          </p>
        )}
      </div>

      {/* Popular models row */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Popular Models</h2>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '4px 0', scrollbarWidth: 'none' }}>
          {popularModels.map(m => (
            <Link key={m.slug} href={`/product/${m.slug}`} style={{
              flex: '0 0 130px', width: 130, borderRadius: 12,
              border: '1.5px solid #e5e7eb', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              textDecoration: 'none', color: 'inherit', background: '#fff',
              transition: 'border-color 0.2s',
            }}>
              <div style={{ width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10%', background: '#fff' }}>
                <img src={assetPath(m.image)} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ padding: '8px 6px', textAlign: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.2 }}>{m.name}</div>
                <div style={{ fontSize: 11, color: m.count <= 1 ? '#ef4444' : '#9ca3af', fontWeight: m.count <= 1 ? 600 : 400, marginTop: 2 }}>
                  {m.count <= 1 ? 'Last one!' : `${m.count} in stock`}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      <div ref={filterBarRef} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {filters.map(f => (
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
              {f.key}{f.selected.length > 0 ? ` (${f.selected.length})` : ''}
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginLeft: 4 }}><path d="m6 9 6 6 6-6" /></svg>
            </button>
            {openFilter === f.key && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', left: 0, background: '#fff',
                border: '1.5px solid var(--border)', borderRadius: 12, padding: '8px 0',
                minWidth: 180, zIndex: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              }}>
                {f.options.map(option => (
                  <label key={option} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer' }}>
                    <input type="checkbox" checked={f.selected.includes(option)} onChange={() => f.toggle(option)} style={{ accentColor: 'var(--accent)' }} /> {option}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Results bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 20, fontSize: 14, color: 'var(--text-secondary)',
      }}>
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

      {/* Product grid */}
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
        <Link href="/cameras/mirrorless/canon-r/out-of-stock" style={{
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
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Buy Used Canon R Cameras</h2>
        <div style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)', maxWidth: 800 }}>
          <p>
            The Canon EOS R system represents Canon&apos;s latest mirrorless technology. The{' '}
            <Link href="/product/canon-eos-r5" style={orangeLink}>Canon R5</Link> offers 45MP resolution with 8K video,
            while the <Link href="/product/canon-eos-r6-ii" style={orangeLink}>R6 II</Link> delivers exceptional
            low-light performance. For sports and wildlife, the{' '}
            <Link href="/product/canon-eos-r3" style={orangeLink}>R3</Link> provides unmatched autofocus speed.
          </p>
          <p style={{ marginTop: 12 }}>
            All Canon R cameras come with our 12-month warranty, detailed condition reports, and accurate shutter counts.
            Browse our full range of <Link href="/lenses/mirrorless/canon-rf" style={orangeLink}>Canon RF lenses</Link> to
            complete your system.
          </p>
        </div>
      </div>

      {/* FAQs */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Frequently asked questions</h2>
        <div className="accordion">
          {[
            { q: 'Which Canon R camera is best for beginners?', a: 'The Canon R10 and R50 are excellent entry points. They offer APS-C sensors with Canon\'s latest autofocus technology at an accessible price. The Canon RP is a great affordable full-frame option.' },
            { q: 'What is the difference between Canon RF and RF-S lenses?', a: 'RF lenses are designed for full-frame Canon R bodies, while RF-S lenses are designed for APS-C models like the R7 and R10. You can use RF lenses on APS-C bodies, but not RF-S on full-frame.' },
            { q: 'How accurate are the shutter counts?', a: 'We read Canon shutter counts using manufacturer service software. The exact count is listed on every product page so you know exactly how much use the camera has had.' },
            { q: 'Do Canon R cameras come with a warranty?', a: 'Yes, every Canon R camera from Camera-tweedehands.nl comes with our 12-month warranty covering manufacturing defects and mechanical failures.' },
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

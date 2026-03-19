'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';

/* ── Variant-level filters — completely different from category pages ── */
const allFilters = ['Condition', 'Price', 'Accessories', 'BTW type'];
const filterOptions: Record<string, string[]> = {
  Condition: ['As New', 'Excellent', 'Good', 'Used'],
  Price: ['Under €1,200', '€1,200 – €1,400', '€1,400 – €1,600', '€1,600+'],
  Accessories: ['Lens hood', 'Lens pouch', 'Original box', 'Front cap', 'Rear cap', 'UV filter'],
  'BTW type': ['Marge (no VAT reclaimable)', '21% BTW (reclaimable)'],
};

const variants = [
  { id: 'v1', condition: 'As New', conditionColor: '#22c55e', price: 1649, btw: 'Marge', sku: 'RF2470-001', shuttercount: null, note: 'Mint condition, barely used. Includes hood + pouch.', daysInStock: 3 },
  { id: 'v2', condition: 'Excellent', conditionColor: '#3b82f6', price: 1499, btw: '21%', sku: 'RF2470-002', shuttercount: null, note: 'Minor wear on zoom ring. Optics perfect. Hood included.', daysInStock: 8 },
  { id: 'v3', condition: 'Good', conditionColor: '#f59e0b', price: 1349, btw: 'Marge', sku: 'RF2470-003', shuttercount: null, note: 'Normal usage marks. IS fully functional. No hood.', daysInStock: 14 },
];

const specs: [string, string][] = [
  ['Mount', 'Canon RF'],
  ['Focal Length', '24-70mm'],
  ['Maximum Aperture', 'f/2.8'],
  ['Minimum Aperture', 'f/22'],
  ['Lens Type', 'Zoom'],
  ['Image Stabilisation', 'Yes (up to 5 stops)'],
  ['Autofocus', 'Nano USM + Ring USM (dual)'],
  ['Filter Thread', '82mm'],
  ['Minimum Focus Distance', '0.21m (wide) / 0.38m (tele)'],
  ['Weight', '900g'],
  ['Weather Sealing', 'Yes'],
  ['Aperture Blades', '9 (rounded)'],
  ['Year of Release', '2019'],
];

const ChevronDown = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginLeft: 4, flexShrink: 0 }}><path d="m6 9 6 6 6-6" /></svg>
);

export default function CanonRF2470Page() {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [filterSelections, setFilterSelections] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState('price-low');
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function h(e: MouseEvent) { if (filterBarRef.current && !filterBarRef.current.contains(e.target as Node)) setOpenFilter(null); }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const getSelected = (f: string) => filterSelections[f] || [];
  const toggleFilter = (f: string, v: string) => {
    setFilterSelections(prev => { const c = prev[f] || []; return { ...prev, [f]: c.includes(v) ? c.filter(x => x !== v) : [...c, v] }; });
  };
  const totalActive = Object.values(filterSelections).reduce((s, a) => s + a.length, 0);
  const allActive = Object.entries(filterSelections).flatMap(([g, sel]) => sel.map(v => ({ group: g, value: v })));

  return (
    <div className="container">
      <Breadcrumb items={[
        { label: 'Lenses', href: '/lenses' },
        { label: 'Mirrorless', href: '/lenses/mirrorless' },
        { label: 'Canon RF fit', href: '/lenses/mirrorless/canon-rf-fit' },
        { label: 'Canon RF 24-70mm f/2.8L IS USM' },
      ]} />

      {/* Product header */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 40 }}>
        {/* Image */}
        <div style={{ background: '#f8f8fa', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, aspectRatio: '1' }}>
          <Image src="/images/lenses/canon-rf-28-70-f2.webp" alt="Canon RF 24-70mm f/2.8L IS USM" width={400} height={400} style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }} />
        </div>

        {/* Product info */}
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 999, background: '#f3f4f6', color: '#6b7280', fontWeight: 500 }}>Canon RF</span>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 999, background: '#f3f4f6', color: '#6b7280', fontWeight: 500 }}>Zoom</span>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 999, background: '#dbeafe', color: '#3b82f6', fontWeight: 500 }}>IS</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4, lineHeight: 1.2 }}>Canon RF 24-70mm f/2.8L IS USM</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>Professional standard zoom with image stabilisation</p>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 24 }}>
            <span style={{ fontSize: 32, fontWeight: 700, color: 'var(--accent)' }}>from €1,349</span>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>— {variants.length} variants available</span>
          </div>

          {/* Key specs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'Focal Length', value: '24-70mm' },
              { label: 'Aperture', value: 'f/2.8' },
              { label: 'Mount', value: 'Canon RF' },
              { label: 'Stabilisation', value: '5 stops IS' },
              { label: 'Weight', value: '900g' },
              { label: 'Filter', value: '82mm' },
            ].map(s => (
              <div key={s.label} style={{ padding: 12, background: '#f8f8fa', borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', gap: 16, padding: '16px 0', borderTop: '1px solid var(--border)' }}>
            {['12-month warranty', 'Inspected by experts', '14-day returns'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Variant section */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Available variants</h2>

        {/* Variant filters — Condition, Price, BTW (grid style) */}
        <div ref={filterBarRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8, marginBottom: 12 }}>
          {allFilters.map(f => {
            const sel = getSelected(f);
            const hasActive = sel.length > 0;
            return (
              <div key={f} style={{ position: 'relative' }}>
                <button onClick={() => setOpenFilter(openFilter === f ? null : f)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                  padding: '10px 14px', borderRadius: 8,
                  border: hasActive ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
                  background: hasActive ? 'rgba(249,115,22,0.04)' : 'transparent',
                  color: 'var(--text)', fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
                }}>
                  <span>{f}{hasActive ? ` (${sel.length})` : ''}</span><ChevronDown />
                </button>
                {openFilter === f && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 10, padding: '6px 0', minWidth: 260, zIndex: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                    {filterOptions[f].map(option => (
                      <label key={option} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', fontSize: 13, cursor: 'pointer' }}>
                        <input type="checkbox" checked={sel.includes(option)} onChange={() => toggleFilter(f, option)} style={{ accentColor: 'var(--accent)' }} /> {option}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Results bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', marginBottom: 16, borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
            <span>Showing <strong style={{ color: 'var(--text)' }}>{variants.length}</strong> variants</span>
            {totalActive > 0 && (
              <button onClick={() => setFilterSelections({})} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>Clear all filters</button>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Sort by:</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '4px 8px', border: 'none', background: 'transparent', color: 'var(--text)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <option value="price-low">price low to high</option>
              <option value="price-high">price high to low</option>
              <option value="condition">best condition first</option>
            </select>
          </div>
        </div>

        {/* Variant cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {variants.map(v => (
            <div
              key={v.id}
              onClick={() => setSelectedVariant(selectedVariant === v.id ? null : v.id)}
              style={{
                border: selectedVariant === v.id ? '2px solid var(--accent)' : '1.5px solid var(--border)',
                borderRadius: 12,
                padding: 20,
                cursor: 'pointer',
                background: selectedVariant === v.id ? 'rgba(249,115,22,0.02)' : 'var(--bg-card, var(--bg))',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: v.conditionColor }} />
                    <span style={{ fontSize: 15, fontWeight: 600 }}>{v.condition}</span>
                    <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 999, background: v.btw === 'Marge' ? '#f3f4f6' : '#dbeafe', color: v.btw === 'Marge' ? '#6b7280' : '#3b82f6', fontWeight: 500 }}>{v.btw}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-tertiary, #999)' }}>SKU: {v.sku}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-tertiary, #999)' }}>{v.daysInStock}d in stock</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{v.note}</p>
                </div>
                <div style={{ textAlign: 'right', minWidth: 120 }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>€{v.price.toLocaleString('nl-NL')}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                    {v.btw === '21%' ? 'incl. 21% BTW' : 'marge regeling'}
                  </div>
                </div>
              </div>

              {selectedVariant === v.id && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', gap: 12 }}>
                  <button style={{
                    flex: 1, padding: '12px 24px', background: 'var(--accent)', color: '#fff', border: 'none',
                    borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  }}>
                    Add to cart — €{v.price.toLocaleString('nl-NL')}
                  </button>
                  <button style={{
                    padding: '12px 24px', background: 'transparent', color: 'var(--text)', border: '1.5px solid var(--border)',
                    borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer',
                  }}>
                    Ask a question
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Full specs */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Specifications</h2>
        <div style={{ border: '1.5px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          {specs.map(([label, value], i) => (
            <div key={label} style={{
              display: 'flex', padding: '12px 20px',
              background: i % 2 === 0 ? 'var(--bg-card, var(--bg))' : '#f8f8fa',
              borderBottom: i < specs.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <span style={{ width: 200, fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

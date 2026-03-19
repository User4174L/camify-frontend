'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/layout/Breadcrumb';

/* ── Filters for lens subcategorie — mount is important here ── */
const allFilters = ['Brand', 'Price', 'Mount', 'Focal length', 'Prime / Zoom', 'Max aperture', 'Stabilisation', 'Autofocus', 'Use case', 'Level', 'In stock'];

const filterOptions: Record<string, string[]> = {
  Brand: ['Canon', 'Nikon', 'Sony', 'Sigma', 'Tamron', 'Fujifilm', 'Zeiss', 'Samyang', 'Voigtlander'],
  Price: ['Under €250', '€250 – €500', '€500 – €1,000', '€1,000 – €2,000', '€2,000+'],
  Mount: ['Canon RF', 'Nikon Z', 'Sony E/FE', 'Fujifilm X', 'Micro Four Thirds', 'L-Mount', 'Leica M'],
  'Focal length': ['< 35mm (Wide)', '35 – 70mm (Standard)', '70 – 200mm (Tele)', '200mm+ (Super Tele)'],
  'Prime / Zoom': ['Prime', 'Zoom'],
  'Max aperture': ['f/1.2 – f/1.8', 'f/2 – f/2.8', 'f/3.5 – f/4', 'f/4.5+'],
  Stabilisation: ['With IS', 'Without IS'],
  Autofocus: ['Autofocus', 'Manual focus only'],
  'Use case': ['Portrait', 'Landscape', 'Wildlife', 'Macro', 'Street', 'Wedding', 'Sports', 'Allround'],
  Level: ['Entry', 'Enthusiast', 'Pro'],
  'In stock': ['In stock only'],
};

/* Mount categories as blocks — same pattern as cameras/mirrorless */
const mountCategories = [
  { label: 'All Mirrorless', href: '/lenses/mirrorless', active: true, image: null, count: 580 },
  { label: 'Canon RF fit', href: '/lenses/mirrorless/canon-rf-fit', active: false, image: '/images/lenses/canon-rf-24-105-f4.webp', count: 124 },
  { label: 'Nikon Z fit', href: '/lenses/mirrorless/nikon-z-fit', active: false, image: '/images/lenses/zeiss-batis-40-f2.webp', count: 89 },
  { label: 'Sony E/FE fit', href: '/lenses/mirrorless/sony-e-fe-fit', active: false, image: '/images/lenses/sony-fe-24-105-f4.webp', count: 156 },
  { label: 'Fujifilm X fit', href: '/lenses/mirrorless/fujifilm-x-fit', active: false, image: '/images/lenses/zeiss-batis-40-f2.webp', count: 78 },
  { label: 'MFT fit', href: '/lenses/mirrorless/mft-fit', active: false, image: '/images/lenses/zeiss-batis-40-f2.webp', count: 56 },
  { label: 'L-Mount fit', href: '/lenses/mirrorless/l-mount-fit', active: false, image: '/images/lenses/leica-90-f2.webp', count: 34 },
  { label: 'Leica M fit', href: '/lenses/mirrorless/leica-m-fit', active: false, image: '/images/lenses/leica-50-f24.webp', count: 23 },
];

const mockLenses = [
  { id: 'ml1', name: 'Canon RF 24-70mm f/2.8L IS USM', price: 1349, priceMax: 1649, stock: 3, image: '/images/lenses/canon-rf-28-70-f2.webp', href: '/lenses/mirrorless/canon-rf-fit/canon-rf-24-70-f28' },
  { id: 'ml2', name: 'Sony FE 24-105mm f/4 G OSS', price: 549, priceMax: 799, stock: 4, image: '/images/lenses/sony-fe-24-105-f4.webp', href: '/lenses/mirrorless' },
  { id: 'ml3', name: 'Canon RF 70-200mm f/2.8L IS USM', price: 1499, priceMax: 1799, stock: 2, image: '/images/lenses/canon-rf-70-200-f28.webp', href: '/lenses/mirrorless/canon-rf-fit' },
  { id: 'ml4', name: 'Sony FE 100-400mm f/4.5-5.6 GM OSS', price: 1199, priceMax: 1499, stock: 2, image: '/images/lenses/sony-fe-100-400-gm.webp', href: '/lenses/mirrorless' },
  { id: 'ml5', name: 'Canon RF 24-105mm f/4L IS USM', price: 599, priceMax: 849, stock: 5, image: '/images/lenses/canon-rf-24-105-f4.webp', href: '/lenses/mirrorless/canon-rf-fit' },
  { id: 'ml6', name: 'Zeiss Batis 40mm f/2 CF', price: 699, priceMax: 799, stock: 1, image: '/images/lenses/zeiss-batis-40-f2.webp', href: '/lenses/mirrorless' },
  { id: 'ml7', name: 'Canon RF 200-800mm f/6.3-9 IS USM', price: 1849, priceMax: 1849, stock: 1, image: '/images/lenses/canon-rf-200-800.webp', href: '/lenses/mirrorless/canon-rf-fit' },
  { id: 'ml8', name: 'Canon RF 28-70mm f/2L USM', price: 2099, priceMax: 2399, stock: 2, image: '/images/lenses/canon-rf-28-70-f2.webp', href: '/lenses/mirrorless/canon-rf-fit' },
];

function formatPrice(p: number) { return p.toLocaleString('nl-NL'); }

const ChevronDown = () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginLeft: 4, flexShrink: 0 }}><path d="m6 9 6 6 6-6" /></svg>;
const LensIcon = () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>;

export default function MirrorlessLensesPage() {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [filterSelections, setFilterSelections] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState('relevance');
  const filterBarRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="container">
      <Breadcrumb items={[{ label: 'Lenses', href: '/lenses' }, { label: 'Mirrorless' }]} />

      <div style={{ marginBottom: 24 }}>
        <h1 className="section__title" style={{ marginBottom: 8 }}>Mirrorless Lenses</h1>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: 800 }}>
          Second-hand mirrorless lenses for Canon RF, Nikon Z, Sony E/FE, Fujifilm X, Micro Four Thirds and more. Every lens is inspected for sharpness, coatings, and mechanical function.
        </p>
      </div>

      {/* Mount category tiles */}
      <div style={{ position: 'relative', marginBottom: 28 }}>
        <div ref={scrollRef} style={{ display: 'flex', gap: 12, overflowX: 'auto', scrollbarWidth: 'none', padding: '4px 0' }}>
          {mountCategories.map(sc => (
            <Link key={sc.href} href={sc.href} style={{
              flex: '0 0 140px', width: 140, height: 140, borderRadius: 12,
              border: sc.active ? '2px solid var(--accent)' : '1.5px solid var(--border)',
              overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              textDecoration: 'none', color: 'var(--text)', background: '#fff', gap: 6,
            }}>
              <div style={{ width: 60, height: 60, borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: sc.image ? '#fff' : '#1a1a2e' }}>
                {sc.image ? <Image src={sc.image} alt={sc.label} width={60} height={60} style={{ objectFit: 'contain', padding: 4 }} /> : <LensIcon />}
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>{sc.label}</span>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary, #999)' }}>{sc.count} products</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Filter grid */}
      <div ref={filterBarRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8, marginBottom: 12 }}>
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
                <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 10, padding: '6px 0', minWidth: 220, maxHeight: 320, overflowY: 'auto', zIndex: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', marginBottom: 20, borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
          <span>Showing <strong style={{ color: 'var(--text)' }}>{mockLenses.length}</strong> of 580+ results</span>
          {totalActive > 0 && <button onClick={() => setFilterSelections({})} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>Clear all filters</button>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <span style={{ color: 'var(--text-secondary)' }}>Sort by:</span>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '4px 8px', border: 'none', background: 'transparent', color: 'var(--text)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <option value="relevance">relevance</option>
            <option value="price-low">price low to high</option>
            <option value="price-high">price high to low</option>
          </select>
        </div>
      </div>

      {/* Product grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 48 }}>
        {mockLenses.map(lens => (
          <Link key={lens.id} href={lens.href} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ borderRadius: 12, overflow: 'hidden', background: '#fff', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', background: '#fff', aspectRatio: '1', overflow: 'hidden', borderRadius: '11px 11px 0 0' }}>
                <img src={lens.image} alt={lens.name} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', padding: '12%' }} />
                <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}>
                  <div style={{ background: '#fff', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
                    <svg width="16" height="16" fill="none" stroke="#888" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                  </div>
                </div>
              </div>
              <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#111', lineHeight: 1.3 }}>{lens.name}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>
                  <span style={{ fontSize: 13, fontWeight: 400, color: '#6b7280', marginRight: 4 }}>From</span>
                  &euro;{formatPrice(lens.price)}{lens.priceMax !== lens.price && <> &ndash; &euro;{formatPrice(lens.priceMax)}</>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  {lens.stock <= 2 ? (
                    <><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} /><span style={{ fontSize: 13, fontWeight: 600, color: '#ef4444' }}>{lens.stock === 1 ? 'Last one!' : `Last ${lens.stock} in stock!`}</span></>
                  ) : lens.stock <= 5 ? (
                    <><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} /><span style={{ fontSize: 13, fontWeight: 600, color: '#f59e0b' }}>Only {lens.stock} left</span></>
                  ) : (
                    <><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} /><span style={{ fontSize: 13, color: '#6b7280' }}>{lens.stock} in stock</span></>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

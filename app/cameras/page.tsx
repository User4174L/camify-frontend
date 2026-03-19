'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ProductGrid from '@/components/product/ProductGrid';
import QuickView from '@/components/product/QuickView';
import { products } from '@/data/products';

const inStockCameras = products.filter(p => p.category === 'cameras' && p.stock > 0);

/* ── Filter matching helpers ── */
function matchesPriceRange(price: number, range: string): boolean {
  if (range === 'Under €500') return price < 500;
  if (range === '€500 – €1,000') return price >= 500 && price <= 1000;
  if (range === '€1,000 – €2,000') return price >= 1000 && price <= 2000;
  if (range === '€2,000 – €5,000') return price >= 2000 && price <= 5000;
  if (range === '€5,000+') return price >= 5000;
  return false;
}

function matchesSensor(sensorSpec: string | undefined, filter: string): boolean {
  if (!sensorSpec) return false;
  const s = sensorSpec.toLowerCase();
  if (filter === 'Full Frame') return s.includes('full frame');
  if (filter === 'APS-C / DX') return s.includes('aps-c') || s.includes('dx');
  if (filter === 'Micro Four Thirds') return s.includes('micro four thirds');
  if (filter === 'Medium Format') return s.includes('medium format');
  if (filter === '1-inch') return s.includes('1-inch') || s.includes('1"');
  return false;
}

function matchesVideo(videoSpec: string | undefined, filter: string): boolean {
  if (!videoSpec) return false;
  const v = videoSpec.toLowerCase();
  if (filter === '4K') return v.includes('4k');
  if (filter === '6K') return v.includes('6k');
  if (filter === '8K') return v.includes('8k');
  if (filter === '4K 120fps') return v.includes('4k 120');
  if (filter === 'RAW Video') return v.includes('raw');
  return false;
}

const subcategories = [
  { label: 'All Cameras', href: '/cameras', count: '850+', active: true, image: null },
  { label: 'Mirrorless', href: '/cameras/mirrorless', count: '420+', active: false, image: '/images/nikon-z8.jpg' },
  { label: 'DSLR', href: '/cameras/dslr', count: '180+', active: false, image: '/images/canon-r5.jpg' },
  { label: 'Compact', href: '/cameras/compact', count: '95+', active: false, image: '/images/sony-a7-iv.jpg' },
  { label: 'Medium Format', href: '/cameras/medium-format', count: '34+', active: false, image: '/images/hasselblad-x2d-100c.jpg' },
  { label: 'Rangefinder', href: '/cameras/rangefinder', count: '18+', active: false, image: '/images/nikon-zf.jpg' },
  { label: 'Analog / Film', href: '/cameras/analog-film', count: '45+', active: false, image: '/images/nikon-zf.jpg' },
  { label: 'Bridge', href: '/cameras/bridge', count: '28+', active: false, image: '/images/fujifilm-x-t4.jpg' },
];

/* ── Filter config per category type ──
   In production these come from the backend based on actual product data.
   Filters only show if products in the current view have that attribute.
   Counts update dynamically (faceted search). */
const allFilters = ['Brand', 'Price', 'Camera type', 'Sensor', 'Mount', 'Megapixels', 'IBIS', 'Shuttercount', 'Use case', 'Level', 'In stock'];

const brandFilters = ['Canon', 'Nikon', 'Sony', 'Fujifilm', 'Leica', 'Hasselblad', 'Panasonic', 'Olympus'];
const priceFilters = ['Under €500', '€500 – €1,000', '€1,000 – €2,000', '€2,000 – €5,000', '€5,000+'];
const cameraTypeFilters = ['Mirrorless', 'DSLR', 'Compact', 'Medium Format', 'Rangefinder', 'Bridge'];
const sensorFilters = ['Full Frame', 'APS-C / DX', 'Micro Four Thirds', 'Medium Format', '1-inch'];
const megapixelFilters = ['< 20 MP', '20 – 30 MP', '30 – 40 MP', '40+ MP'];
const ibisFilters = ['With IBIS', 'Without IBIS'];
const shuttercountFilters = ['< 10,000', '10,000 – 50,000', '50,000 – 100,000', '100,000+'];
const useCaseFilters = ['Wildlife', 'Portrait', 'Landscape', 'Street', 'Travel', 'Wedding', 'Sports', 'Video', 'Vlogging', 'Astro', 'Macro', 'Allround'];
const levelFilters = ['Entry', 'Enthusiast', 'Pro'];
const inStockFilters = ['In stock only'];

const filterOptions: Record<string, string[]> = {
  Brand: brandFilters,
  Price: priceFilters,
  'Camera type': cameraTypeFilters,
  Sensor: sensorFilters,
  Megapixels: megapixelFilters,
  Mount: ['Canon RF', 'Canon EF', 'Nikon Z', 'Nikon F', 'Sony E/FE', 'Fujifilm X', 'Micro Four Thirds', 'Leica M', 'L-Mount'],
  IBIS: ibisFilters,
  Shuttercount: shuttercountFilters,
  'Use case': useCaseFilters,
  Level: levelFilters,
  'In stock': inStockFilters,
};

const orangeLink: React.CSSProperties = {
  color: 'var(--accent)',
  fontWeight: 600,
  textDecoration: 'none',
};

const ChevronDown = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginLeft: 4, flexShrink: 0 }}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const CameraIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

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


export default function CamerasPage() {
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
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
  const [readMore, setReadMore] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* ── Filter & sort state ── */
  /* Generic filter state for all filter types */
  const [filterSelections, setFilterSelections] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);

  const getSelected = (f: string) => filterSelections[f] || [];
  const toggleFilter = (f: string, v: string) => {
    setFilterSelections(prev => {
      const current = prev[f] || [];
      return { ...prev, [f]: current.includes(v) ? current.filter(x => x !== v) : [...current, v] };
    });
    setCurrentPage(1);
  };

  const filterStateMap: Record<string, { selected: string[]; toggle: (v: string) => void }> = {};
  for (const f of allFilters) {
    filterStateMap[f] = { selected: getSelected(f), toggle: (v) => toggleFilter(f, v) };
  }

  const totalActiveFilters = Object.values(filterSelections).reduce((sum, arr) => sum + arr.length, 0);
  const allActiveFilters = Object.entries(filterSelections).flatMap(([group, selected]) => selected.map(v => ({ group, value: v })));

  const clearAllFilters = () => {
    setFilterSelections({});
    setCurrentPage(1);
  };

  // Shortcuts for filter logic
  const selectedBrands = getSelected('Brand');
  const selectedPrices = getSelected('Price');
  const selectedSensors = getSelected('Sensor');

  /* ── Derived filtered + sorted list ── */
  const filteredSortedCameras = useMemo(() => {
    let result = [...inStockCameras];

    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }
    if (selectedPrices.length > 0) {
      result = result.filter(p => selectedPrices.some(range => matchesPriceRange(p.price, range)));
    }
    if (selectedSensors.length > 0) {
      result = result.filter(p =>
        selectedSensors.some(f => matchesSensor(p.specs?.['Sensor'], f))
      );
    }
    // Camera type is visual only for now (no data field yet)
    // Use case, Level, In stock are visual only for now

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => Number(b.id) - Number(a.id));
    }

    return result;
  }, [selectedBrands, selectedPrices, selectedSensors, sortBy]);

  const ITEMS_PER_PAGE = 16;
  const totalPages = Math.max(1, Math.ceil(filteredSortedCameras.length / ITEMS_PER_PAGE));
  const paginatedCameras = filteredSortedCameras.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const firstHalf = paginatedCameras.slice(0, 8);
  const secondHalf = paginatedCameras.slice(8);

  const quickViewProduct = quickViewId ? products.find(p => p.id === quickViewId) ?? null : null;

  const scrollBy = (dir: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' });
    }
  };


  return (
    <div className="container">
      <Breadcrumb items={[{ label: 'Cameras' }]} />

      {/* Title + SEO intro */}
      <div style={{ marginBottom: 24 }}>
        <h1 className="section__title" style={{ marginBottom: 12 }}>Cameras</h1>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: 800 }}>
          Discover our extensive collection of professionally inspected second-hand cameras. From{' '}
          <Link href="/cameras/mirrorless" style={orangeLink}>mirrorless systems</Link> by{' '}
          <Link href="/cameras?brand=sony" style={orangeLink}>Sony</Link>,{' '}
          <Link href="/cameras?brand=nikon" style={orangeLink}>Nikon</Link> and{' '}
          <Link href="/cameras?brand=canon" style={orangeLink}>Canon</Link> to{' '}
          <Link href="/cameras/medium-format" style={orangeLink}>medium format</Link> bodies by{' '}
          <Link href="/cameras?brand=hasselblad" style={orangeLink}>Hasselblad</Link> and{' '}
          <Link href="/cameras?brand=fujifilm" style={orangeLink}>Fujifilm</Link> — every camera is tested, graded and backed by our 12-month warranty.
        </p>

        {!readMore && (
          <button
            onClick={() => setReadMore(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent)',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              padding: '8px 0 0',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            Read more <span style={{ fontSize: 12 }}>&#8595;</span>
          </button>
        )}

        {readMore && (
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: 800, marginTop: 12 }}>
            Whether you&apos;re a hobbyist upgrading from a smartphone or a professional looking for a reliable backup body, our range covers every need and budget. All cameras come with detailed condition reports, accurate shutter counts, and are covered by our comprehensive warranty program. We ship across Europe with fast delivery and easy 14-day returns for online purchases.
          </p>
        )}
      </div>

      {/* Subcategory tiles */}
      <div style={{ position: 'relative', marginBottom: 28 }}>
        <button
          onClick={() => scrollBy(-1)}
          style={{
            position: 'absolute',
            left: -16,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '1.5px solid var(--border)',
            background: 'var(--bg)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
          aria-label="Scroll left"
        >
          <ArrowLeft />
        </button>

        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: 12,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            padding: '4px 0',
          }}
        >
          {subcategories.map(sc => (
            <Link
              key={sc.href}
              href={sc.href}
              style={{
                flex: '0 0 140px',
                width: 140,
                height: 140,
                borderRadius: 12,
                border: sc.active ? '2px solid var(--accent)' : '1.5px solid var(--border)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: 'var(--text)',
                background: 'var(--bg-card, var(--bg))',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 8,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: sc.image ? 'var(--bg-subtle, #f5f5f5)' : '#1a1a2e',
                  position: 'relative',
                }}
              >
                {sc.image ? (
                  <Image
                    src={sc.image}
                    alt={sc.label}
                    width={60}
                    height={60}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                ) : (
                  <CameraIcon />
                )}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>
                {sc.label}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary, #999)' }}>
                {sc.count} products
              </span>
            </Link>
          ))}
        </div>

        <button
          onClick={() => scrollBy(1)}
          style={{
            position: 'absolute',
            right: -16,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '1.5px solid var(--border)',
            background: 'var(--bg)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
          aria-label="Scroll right"
        >
          <ArrowRight />
        </button>
      </div>

      {/* Filter grid (MPB-style: equal width, grid rows) */}
      <div ref={filterBarRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8, marginBottom: 12 }}>
        {allFilters.map(f => {
          const activeCount = filterStateMap[f].selected.length;
          const hasActive = activeCount > 0;
          return (
            <div key={f} style={{ position: 'relative' }}>
              <button
                onClick={() => setOpenFilter(openFilter === f ? null : f)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: hasActive ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
                  background: hasActive ? 'rgba(249,115,22,0.04)' : 'transparent',
                  color: 'var(--text)',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>{f}{hasActive ? ` (${activeCount})` : ''}</span>
                <ChevronDown />
              </button>

              {openFilter === f && filterOptions[f] && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                  background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 10,
                  padding: '6px 0', minWidth: 220, maxHeight: 320, overflowY: 'auto', zIndex: 10,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                }}>
                  {filterOptions[f].map(option => (
                    <label key={option} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', fontSize: 13, cursor: 'pointer', color: 'var(--text)' }}>
                      <input
                        type="checkbox"
                        checked={filterStateMap[f].selected.includes(option)}
                        onChange={() => { filterStateMap[f].toggle(option); setCurrentPage(1); }}
                        style={{ accentColor: 'var(--accent)' }}
                      /> {option}
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Results bar + sort (separate line like MPB) */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 0', marginBottom: 16,
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
          <span>Showing <strong style={{ color: 'var(--text)' }}>{filteredSortedCameras.length}</strong> of {inStockCameras.length} results</span>
          {totalActiveFilters > 0 && (
            <button onClick={() => { clearAllFilters(); setCurrentPage(1); }} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
              Clear all filters
            </button>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <span style={{ color: 'var(--text-secondary)' }}>Sort by:</span>
          <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }} style={{ padding: '4px 8px', border: 'none', background: 'transparent', color: 'var(--text)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <option value="relevance">relevance</option>
            <option value="price-low">price low to high</option>
            <option value="price-high">price high to low</option>
            <option value="newest">newest first</option>
          </select>
        </div>
      </div>

      {/* Product grid */}
      {filteredSortedCameras.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No cameras match your filters</p>
          <p style={{ fontSize: 14 }}>Try removing some filters to see more results.</p>
        </div>
      ) : (
        <>
          <ProductGrid products={firstHalf} onQuickView={setQuickViewId} />

          {secondHalf.length > 0 && (
            <>
              {/* USP trust band */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 32, padding: '28px 0', margin: '24px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                {['12-month warranty', 'Professionally inspected', 'Free shipping from \u20AC50', '14-day returns'].map(text => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
                    {text}
                  </div>
                ))}
              </div>

              <ProductGrid products={secondHalf} onQuickView={setQuickViewId} />
            </>
          )}
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
        <Link
          href="/cameras/out-of-stock"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 28px', border: '2px solid var(--accent)',
            borderRadius: 999, background: 'transparent', color: 'var(--accent)',
            fontSize: 14, fontWeight: 600, textDecoration: 'none',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          View out of stock &amp; set alerts
        </Link>
      </div>

      {/* SEO text block */}
      <div
        style={{
          padding: '32px 0',
          borderTop: '1px solid var(--border)',
          marginTop: 16,
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Buy Used Cameras Online</h2>
        <div style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)', maxWidth: 800 }}>
          <p>
            At Camera-tweedehands.nl, we offer one of Europe&apos;s largest selections of professionally inspected second-hand cameras.
            Whether you&apos;re searching for a{' '}
            <Link href="/cameras/mirrorless" style={orangeLink}>mirrorless camera</Link>,
            a classic <Link href="/cameras/dslr" style={orangeLink}>DSLR</Link>,
            or a high-end <Link href="/cameras/medium-format" style={orangeLink}>medium format</Link> system,
            every camera in our inventory has been thoroughly tested and graded by our expert team.
          </p>
          <p style={{ marginTop: 12 }}>
            Popular choices include the{' '}
            <Link href="/cameras?brand=sony" style={orangeLink}>Sony Alpha</Link> series for versatile mirrorless performance,{' '}
            <Link href="/cameras?brand=canon" style={orangeLink}>Canon EOS R</Link> bodies for outstanding autofocus,
            and <Link href="/cameras?brand=nikon" style={orangeLink}>Nikon Z</Link> cameras for exceptional image quality.
            For medium format enthusiasts, we carry{' '}
            <Link href="/cameras?brand=hasselblad" style={orangeLink}>Hasselblad</Link> and{' '}
            <Link href="/cameras?brand=fujifilm" style={orangeLink}>Fujifilm GFX</Link> systems at competitive prices.
          </p>
          <p style={{ marginTop: 12 }}>
            Every camera comes with a detailed condition report, accurate shutter count, and our comprehensive 12-month warranty.
            We offer fast shipping across Europe, secure payments, and easy 14-day returns for online purchases.
            Browse our <Link href="/cameras/compact" style={orangeLink}>compact cameras</Link>,{' '}
            <Link href="/cameras/rangefinder" style={orangeLink}>rangefinders</Link>, or{' '}
            <Link href="/cameras/analog-film" style={orangeLink}>analog film cameras</Link> to find the perfect match for your photography.
          </p>
        </div>
      </div>

      {/* FAQs */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Frequently asked questions</h2>
        <div className="accordion">
          {[
            { q: 'What warranty do your cameras come with?', a: 'Every camera comes with a 12-month Camify warranty covering manufacturing defects and mechanical failures. This includes shutter mechanisms, autofocus systems, and sensor issues.' },
            { q: 'How do you determine the condition grade?', a: 'Our team inspects every camera using a standardized checklist. We check cosmetic condition, sensor cleanliness, autofocus accuracy, shutter mechanism, and all buttons and dials. The grade reflects the overall state of the camera.' },
            { q: 'Can I return a camera if I\'m not satisfied?', a: 'Yes. For online purchases you have 14 days after delivery to return the camera, no questions asked. The item must be in the same condition as received. We\'ll arrange a prepaid return label.' },
            { q: 'Are shutter counts accurate?', a: 'Yes. We read shutter counts directly from the camera\'s EXIF data using professional diagnostic tools. For Canon, we use manufacturer service software. The exact count is shown on every listing.' },
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

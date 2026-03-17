'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ProductGrid from '@/components/product/ProductGrid';
import QuickView from '@/components/product/QuickView';
import { products } from '@/data/products';

/* ── Filter helpers ── */
function matchesPriceRange(price: number, range: string): boolean {
  if (range === 'Under €500') return price < 500;
  if (range === '€500 – €1,000') return price >= 500 && price <= 1000;
  if (range === '€1,000 – €2,000') return price >= 1000 && price <= 2000;
  if (range === '€2,000 – €5,000') return price >= 2000 && price <= 5000;
  if (range === '€5,000+') return price >= 5000;
  return false;
}

const categoryFilters = [
  { key: 'all', label: 'All', image: null },
  { key: 'cameras', label: 'Cameras', image: '/images/canon-r5.jpg' },
  { key: 'lenses', label: 'Lenses', image: '/images/canon-rf-24-70mm-f28-l-is-usm.jpg' },
  { key: 'other', label: 'Other', image: '/images/dji-mavic-2-pro.jpg' },
];

const priceFilters = ['Under €500', '€500 – €1,000', '€1,000 – €2,000', '€2,000 – €5,000', '€5,000+'];
const conditionFilters = ['As New', 'Excellent', 'Good', 'Used', 'Heavily Used'];

const filterButtons = ['Price', 'Condition'];

const filterOptions: Record<string, string[]> = {
  Price: priceFilters,
  Condition: conditionFilters,
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

const AllIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

/* ── Brand-specific SEO data ── */
function getBrandIntro(brand: string): string {
  const intros: Record<string, string> = {
    canon: 'From legendary EOS DSLRs to the cutting-edge EOS R mirrorless system — Canon combines decades of optical innovation with modern performance. Every used Canon product in our catalogue is professionally inspected, graded, and backed by our 12-month warranty.',
    nikon: 'From iconic DSLRs to the revolutionary Z-mount mirrorless system — Nikon delivers outstanding image quality and reliability. Every used Nikon product is professionally inspected, graded, and backed by our 12-month warranty.',
    sony: 'Pioneering full-frame mirrorless with the Alpha series — Sony pushes the boundaries of autofocus, video, and sensor technology. Every used Sony product is professionally inspected, graded, and backed by our 12-month warranty.',
    fujifilm: 'Renowned for stunning colour science and intuitive controls — Fujifilm blends retro design with cutting-edge technology. Every used Fujifilm product is professionally inspected, graded, and backed by our 12-month warranty.',
    leica: 'The gold standard in precision optics and craftsmanship — Leica creates cameras and lenses that hold their value like no other. Every used Leica product is professionally inspected, graded, and backed by our 12-month warranty.',
  };
  return intros[brand.toLowerCase()] || `Explore our full range of professionally inspected, pre-owned ${brand} cameras, lenses, and accessories. Every product is graded, tested, and backed by our 12-month warranty.`;
}

function getBrandFaqs(brand: string) {
  return [
    { q: `What warranty do your used ${brand} products come with?`, a: `Every ${brand} product comes with a 12-month Camify warranty covering manufacturing defects and mechanical failures. This includes shutter mechanisms, autofocus systems, sensor issues, and lens elements.` },
    { q: `How do you grade ${brand} equipment?`, a: `Our team inspects every ${brand} product using a standardized checklist. We check cosmetic condition, optical clarity, autofocus accuracy, mechanical function, and all controls. The grade reflects the overall state of the product.` },
    { q: `Can I return a ${brand} product if I'm not satisfied?`, a: `Yes. For online purchases you have 14 days after delivery to return the product, no questions asked. The item must be in the same condition as received. We'll arrange a prepaid return label.` },
    { q: `Do you buy used ${brand} gear?`, a: `Absolutely! We buy and trade used ${brand} equipment. You can request a quote through our website or visit our store. We offer competitive prices and instant payment.` },
  ];
}

export default function BrandPage() {
  const params = useParams();
  const brandSlug = params.brand as string;
  const brandName = brandSlug.charAt(0).toUpperCase() + brandSlug.slice(1);
  const brandProducts = products.filter(p => p.brand.toLowerCase() === brandSlug.toLowerCase());

  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('relevance');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [readMore, setReadMore] = useState(false);
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

  const filterStateMap: Record<string, { selected: string[]; toggle: (v: string) => void }> = {
    Price: { selected: selectedPrices, toggle: (v) => setSelectedPrices(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]) },
    Condition: { selected: selectedConditions, toggle: (v) => setSelectedConditions(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]) },
  };

  const filteredProducts = useMemo(() => {
    let result = [...brandProducts];

    // Category filter
    if (activeCategory === 'cameras') {
      result = result.filter(p => p.category === 'cameras');
    } else if (activeCategory === 'lenses') {
      result = result.filter(p => p.category === 'lenses');
    } else if (activeCategory === 'other') {
      result = result.filter(p => !['cameras', 'lenses'].includes(p.category));
    }

    // Price filter
    if (selectedPrices.length > 0) {
      result = result.filter(p => selectedPrices.some(range => matchesPriceRange(p.price, range)));
    }

    // Condition filter
    if (selectedConditions.length > 0) {
      result = result.filter(p =>
        p.variants.some(v => selectedConditions.includes(v.conditionLabel))
      );
    }

    // Sort
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'newest') result.sort((a, b) => Number(b.id) - Number(a.id));

    return result;
  }, [brandProducts, activeCategory, selectedPrices, selectedConditions, sortBy]);

  const ITEMS_PER_PAGE = 16;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const firstHalf = paginatedProducts.slice(0, 8);
  const secondHalf = paginatedProducts.slice(8);

  const quickViewProduct = quickViewId ? products.find(p => p.id === quickViewId) ?? null : null;

  const cameraCount = brandProducts.filter(p => p.category === 'cameras').length;
  const lensCount = brandProducts.filter(p => p.category === 'lenses').length;
  const otherCount = brandProducts.filter(p => !['cameras', 'lenses'].includes(p.category)).length;
  const catCounts: Record<string, number> = { all: brandProducts.length, cameras: cameraCount, lenses: lensCount, other: otherCount };

  const faqs = getBrandFaqs(brandName);

  return (
    <div className="container">
      <Breadcrumb items={[
        { label: 'Brands', href: '/brands' },
        { label: brandName },
      ]} />

      {/* Title + SEO intro */}
      <div style={{ marginBottom: 28 }}>
        <h1 className="section__title" style={{ marginBottom: 12 }}>
          Premium Used {brandName} Gear
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: 800 }}>
          {getBrandIntro(brandName)}
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
            Whether you&apos;re upgrading your current setup or looking for a reliable backup, our range of used {brandName} equipment covers every need and budget. All products come with detailed condition reports and are covered by our comprehensive warranty program. We ship across Europe with fast delivery and easy 14-day returns for online purchases.
          </p>
        )}
      </div>

      {/* Category tiles (square buttons with product images like cameras page) */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {categoryFilters.map(cat => {
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => { setActiveCategory(cat.key); setCurrentPage(1); }}
              style={{
                flex: '0 0 auto',
                width: 140,
                height: 140,
                borderRadius: 12,
                border: isActive ? '2px solid var(--accent)' : '1.5px solid var(--border)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-card, var(--bg))',
                cursor: 'pointer',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                gap: 6,
                color: 'var(--text)',
              }}
            >
              <div style={{
                width: 60,
                height: 60,
                borderRadius: 8,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: cat.image ? 'var(--bg-subtle, #f5f5f5)' : '#1a1a2e',
                position: 'relative',
              }}>
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    width={60}
                    height={60}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                ) : (
                  <AllIcon />
                )}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>
                {cat.label}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary, #999)' }}>
                {catCounts[cat.key]} products
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter bar (dropdown style like cameras page) */}
      <div ref={filterBarRef} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {filterButtons.map(f => {
          const activeCount = filterStateMap[f].selected.length;
          const hasActive = activeCount > 0;
          return (
            <div key={f} style={{ position: 'relative' }}>
              <button
                onClick={() => setOpenFilter(openFilter === f ? null : f)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  borderRadius: 999,
                  border: hasActive ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
                  background: openFilter === f ? 'var(--accent)' : hasActive ? 'rgba(249,115,22,0.1)' : 'transparent',
                  color: openFilter === f ? '#fff' : 'var(--text)',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {f}{hasActive ? ` (${activeCount})` : ''}
                <ChevronDown />
              </button>

              {openFilter === f && filterOptions[f] && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    background: 'var(--bg)',
                    border: '1.5px solid var(--border)',
                    borderRadius: 12,
                    padding: '8px 0',
                    minWidth: 180,
                    zIndex: 10,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  }}
                >
                  {filterOptions[f].map(option => (
                    <label
                      key={option}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 16px',
                        fontSize: 13,
                        cursor: 'pointer',
                        color: 'var(--text)',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={filterStateMap[f].selected.includes(option)}
                        onChange={() => {
                          filterStateMap[f].toggle(option);
                          setCurrentPage(1);
                        }}
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

      {/* Results bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          fontSize: 14,
          color: 'var(--text-secondary)',
        }}
      >
        <span>Showing {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}</span>
        <select
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
          style={{
            padding: '6px 12px',
            borderRadius: 8,
            border: '1.5px solid var(--border)',
            background: 'var(--bg)',
            color: 'var(--text)',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          <option value="relevance">Sort by: Relevance</option>
          <option value="price-low">Price: low → high</option>
          <option value="price-high">Price: high → low</option>
          <option value="newest">Newest first</option>
        </select>
      </div>

      {/* Product grid */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No {brandName} products match your filters</p>
          <p style={{ fontSize: 14 }}>Try removing some filters to see more results.</p>
        </div>
      ) : (
        <>
          <ProductGrid products={firstHalf} onQuickView={setQuickViewId} />

          {secondHalf.length > 0 && (
            <>
              {/* USP trust band */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 32, padding: '28px 0', margin: '24px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
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
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
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
              width: 36, height: 36, borderRadius: 8,
              border: '1.5px solid var(--border)', background: 'transparent',
              cursor: currentPage <= 1 ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
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
                width: 36, height: 36, borderRadius: 8,
                border: page === currentPage ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
                background: page === currentPage ? 'var(--accent)' : 'transparent',
                color: page === currentPage ? '#fff' : 'var(--text)',
                cursor: 'pointer', fontSize: 14, fontWeight: page === currentPage ? 600 : 400,
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
              width: 36, height: 36, borderRadius: 8,
              border: '1.5px solid var(--border)', background: 'transparent',
              cursor: currentPage >= totalPages ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
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
      )}

      {/* SEO text block */}
      <div style={{ padding: '32px 0', borderTop: '1px solid var(--border)', marginTop: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
          Buy Used {brandName} Cameras &amp; Lenses
        </h2>
        <div style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)', maxWidth: 800 }}>
          <p>
            At Camera-tweedehands.nl, we offer one of the largest selections of professionally inspected second-hand {brandName} equipment in Europe.
            Whether you&apos;re searching for a {brandName} camera body, a versatile zoom lens, or a fast prime — every product has been thoroughly tested and graded by our expert team.
          </p>
          <p style={{ marginTop: 12 }}>
            All {brandName} products come with a detailed condition report and our comprehensive 12-month warranty.
            We offer fast shipping across Europe, secure payments, and easy 14-day returns for online purchases.
            Browse our full{' '}
            <Link href="/cameras" style={orangeLink}>cameras</Link>,{' '}
            <Link href="/lenses" style={orangeLink}>lenses</Link>, or{' '}
            <Link href="/brands" style={orangeLink}>other brands</Link> to find the perfect match for your photography.
          </p>
        </div>
      </div>

      {/* FAQs */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Frequently asked questions</h2>
        <div className="accordion">
          {faqs.map((faq, i) => (
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

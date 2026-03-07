'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ProductGrid from '@/components/product/ProductGrid';
import QuickView from '@/components/product/QuickView';
import { products } from '@/data/products';

const inStockCameras = products.filter(p => p.category === 'cameras' && p.stock > 0);
const oosProducts = products.filter(p => p.category === 'cameras' && p.stock === 0);

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

const filterButtons = ['Brand', 'Price', 'Condition', 'Sensor Size', 'Mount', 'Video'];

const brandFilters = ['Canon', 'Nikon', 'Sony', 'Fujifilm', 'Leica', 'Hasselblad', 'Panasonic', 'Olympus'];
const priceFilters = ['Under €500', '€500 – €1,000', '€1,000 – €2,000', '€2,000 – €5,000', '€5,000+'];
const conditionFilters = ['As New', 'Excellent', 'Good', 'Used', 'Heavily Used'];
const sensorFilters = ['Full Frame', 'APS-C / DX', 'Micro Four Thirds', 'Medium Format', '1-inch'];
const mountFilters = ['Sony E', 'Canon RF', 'Nikon Z', 'Fujifilm X', 'Leica M', 'Micro Four Thirds'];
const videoFilters = ['4K', '6K', '8K', '4K 120fps', 'RAW Video'];

const filterOptions: Record<string, string[]> = {
  Brand: brandFilters,
  Price: priceFilters,
  Condition: conditionFilters,
  'Sensor Size': sensorFilters,
  Mount: mountFilters,
  Video: videoFilters,
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
  const [readMore, setReadMore] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
            Whether you&apos;re a hobbyist upgrading from a smartphone or a professional looking for a reliable backup body, our range covers every need and budget. All cameras come with detailed condition reports, accurate shutter counts, and are covered by our comprehensive warranty program. We ship across Europe with fast delivery and easy 14-day returns.
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

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {filterButtons.map(f => (
          <div key={f} style={{ position: 'relative' }}>
            <button
              onClick={() => setOpenFilter(openFilter === f ? null : f)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '8px 16px',
                borderRadius: 999,
                border: '1.5px solid var(--border)',
                background: openFilter === f ? 'var(--accent)' : 'transparent',
                color: openFilter === f ? '#fff' : 'var(--text)',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {f}
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
                    <input type="checkbox" /> {option}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
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
        <span>Showing {inStockCameras.length > 0 ? inStockCameras.length : '850'} results</span>
        <select
          defaultValue="relevance"
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
      <ProductGrid products={inStockCameras} onQuickView={setQuickViewId} />

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
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            border: '1.5px solid var(--border)',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text)',
          }}
        >
          <ArrowLeft />
        </button>
        {[1, 2, 3, 4, 5].map(page => (
          <button
            key={page}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: page === 1 ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
              background: page === 1 ? 'var(--accent)' : 'transparent',
              color: page === 1 ? '#fff' : 'var(--text)',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: page === 1 ? 600 : 400,
            }}
          >
            {page}
          </button>
        ))}
        <button
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            border: '1.5px solid var(--border)',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text)',
          }}
        >
          <ArrowRight />
        </button>
      </div>

      {/* Out of stock section */}
      {oosProducts.length > 0 && (
        <div style={{ marginTop: 32 }}>
          {/* Divider */}
          <div style={{ borderTop: '1px solid #e5e7eb' }} />

          {/* Pill / badge */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                border: '1px solid #e5e7eb',
                borderRadius: 999,
                padding: '8px 20px',
                fontSize: 14,
                color: '#6b7280',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Out of stock models — create an alert to get notified
            </span>
          </div>

          {/* OOS product grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
            }}
          >
            {oosProducts.map(product => (
              <div
                key={product.id}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  background: '#fff',
                  overflow: 'hidden',
                }}
              >
                {/* Image container */}
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      aspectRatio: '1',
                      background: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '12%',
                    }}
                  >
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={300}
                      height={300}
                      style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                    />
                  </div>
                  {/* Out of stock badge on image */}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      background: '#1f2937',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: 999,
                    }}
                  >
                    Out of stock
                  </span>
                </div>

                {/* Card body */}
                <div style={{ padding: '12px 16px 16px' }}>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                    {product.title}
                  </div>
                  <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>
                    Out of stock
                  </div>
                  <button
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      background: '#f97316',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 999,
                      padding: '8px 18px',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    Notify me
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
            We offer fast shipping across Europe, secure payments, and easy 14-day returns.
            Browse our <Link href="/cameras/compact" style={orangeLink}>compact cameras</Link>,{' '}
            <Link href="/cameras/rangefinder" style={orangeLink}>rangefinders</Link>, or{' '}
            <Link href="/cameras/analog-film" style={orangeLink}>analog film cameras</Link> to find the perfect match for your photography.
          </p>
        </div>
      </div>

      <QuickView product={quickViewProduct} onClose={() => setQuickViewId(null)} />
    </div>
  );
}

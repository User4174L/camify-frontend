'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useRecentlyViewed } from '@/context/RecentlyViewedContext';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function conditionColor(condition: string): string {
  switch (condition) {
    case 'as-new': return '#059669';
    case 'excellent': return '#16a34a';
    case 'good': return '#65a30d';
    case 'used': return '#ca8a04';
    default: return '#6b7280';
  }
}

function InfoButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 20, height: 20, borderRadius: '50%',
        border: '1.5px solid #d1d5db', background: '#ffffff',
        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        padding: 0, flexShrink: 0, marginLeft: 4,
      }}
      aria-label="More info"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    </button>
  );
}

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.5)', display: open ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#ffffff', borderRadius: 16, padding: '28px 24px',
          maxWidth: 560, width: '100%', maxHeight: '85vh', overflowY: 'auto',
          position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            width: 32, height: 32, borderRadius: '50%',
            border: '1px solid #e5e7eb', background: '#ffffff',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
        {children}
      </div>
    </div>
  );
}

const conditionGrades = [
  { label: 'As New', color: '#059669', description: 'Virtually indistinguishable from a brand-new unit. No visible marks, scratches, or signs of use.' },
  { label: 'Excellent', color: '#16a34a', description: 'Only minimal cosmetic wear. May have very faint marks that are barely noticeable.' },
  { label: 'Good', color: '#65a30d', description: 'Light signs of normal use. May have minor scratches or marks.' },
  { label: 'Used', color: '#ca8a04', description: 'Clearly shows signs of regular use with visible marks and/or scratches.' },
];

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */
export default function VariantDetailV2Page() {
  const params = useParams();
  const slug = params?.slug as string;
  const sku = params?.sku as string;
  const { addItem } = useCart();
  const { markVariantViewed } = useRecentlyViewed();

  const product = products.find(p => p.slug === slug);
  const variant = product?.variants.find(v => v.sku === sku);

  useEffect(() => {
    if (sku) markVariantViewed(sku);
  }, [sku, markVariantViewed]);

  const [imgIdx, setImgIdx] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showConditionModal, setShowConditionModal] = useState(false);
  const [showShutterModal, setShowShutterModal] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  if (!product || !variant) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1f2937', marginBottom: 12 }}>Product not found</h1>
        <p style={{ color: '#6b7280', marginBottom: 24 }}>The variant you are looking for does not exist.</p>
        <Link href="/" style={{ color: '#f97316', fontWeight: 600 }}>Back to homepage</Link>
      </div>
    );
  }

  const images = variant.images.length > 0 ? variant.images : [product.image];
  const totalImages = images.length;
  const currentImage = images[imgIdx % totalImages];
  const maxShutter = 200000;
  const shutterPct = variant.shutterCount ? Math.min((variant.shutterCount / maxShutter) * 100, 100) : 0;
  const formattedPrice = variant.price.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleAddToCart = () => {
    addItem(
      { id: variant.sku, sku: variant.sku, name: product.title, price: variant.price, condition: variant.conditionLabel, image: product.image, inclVat: variant.inclVat ?? false },
      product
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px', paddingBottom: 80 }}>
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: product.category.charAt(0).toUpperCase() + product.category.slice(1), href: `/${product.category}` },
        { label: product.title, href: `/product/${slug}` },
        { label: `SKU ${sku}` },
      ]} />

      {/* Back link */}
      <Link
        href={`/product/${slug}`}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#f97316', fontWeight: 600, fontSize: 13, textDecoration: 'none', marginTop: 16, marginBottom: 8 }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
        Back
      </Link>

      {/* Title + condition + SKU badges */}
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1f2937', margin: '8px 0 10px', lineHeight: 1.2 }}>{product.title}</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 999, padding: '4px 12px', fontSize: 12, fontWeight: 600, color: '#ea580c' }}>
          SKU {sku}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 999, padding: '4px 12px', fontSize: 12, fontWeight: 600, color: '#ea580c' }}>
          12 months warranty
        </span>
        {/* Condition badge — right-aligned */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, background: '#f9fafb', borderRadius: 12, padding: '8px 14px', border: '1px solid #eeeef2' }}>
          <div>
            <div style={{ fontSize: 11, color: '#6b7280' }}>Condition</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: conditionColor(variant.condition) }}>{variant.conditionLabel}</div>
          </div>
          <InfoButton onClick={() => setShowConditionModal(true)} />
        </div>
      </div>

      {/* Full-width photo */}
      <div style={{ position: 'relative', background: '#ffffff', borderRadius: 16, overflow: 'hidden', marginBottom: 12, minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Image
          src={currentImage}
          alt={`${product.title} — ${variant.conditionLabel}`}
          width={900}
          height={600}
          priority
          onClick={() => { setLightboxIdx(imgIdx); setLightboxOpen(true); }}
          style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: 500, width: 'auto', height: 'auto', cursor: 'zoom-in' }}
        />

        {/* Prev / Next */}
        {totalImages > 1 && (
          <>
            <button
              onClick={() => setImgIdx(prev => (prev - 1 + totalImages) % totalImages)}
              style={{
                position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                width: 44, height: 44, borderRadius: '50%', border: 'none',
                background: '#ffffffdd', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button
              onClick={() => setImgIdx(prev => (prev + 1) % totalImages)}
              style={{
                position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                width: 44, height: 44, borderRadius: '50%', border: 'none',
                background: '#ffffffdd', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {totalImages > 1 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setImgIdx(i)}
              style={{
                width: 64, height: 64, borderRadius: 8, overflow: 'hidden', flexShrink: 0,
                border: i === imgIdx ? '2px solid #f97316' : '1px solid #e5e7eb',
                background: '#ffffff', cursor: 'pointer', padding: 0,
                opacity: i === imgIdx ? 1 : 0.6, transition: 'opacity 0.15s',
              }}
            >
              <Image src={img} alt={`View ${i + 1}`} width={56} height={56} style={{ objectFit: 'contain' }} />
            </button>
          ))}
        </div>
      )}

      {/* Price row + Add to Cart */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 36, fontWeight: 700, color: '#1f2937' }}>&euro; {formattedPrice}</span>
        <button
          onClick={handleAddToCart}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            background: addedToCart ? '#16a34a' : '#f97316', color: '#ffffff',
            border: 'none', borderRadius: 999, padding: '14px 48px',
            fontSize: 16, fontWeight: 700, cursor: 'pointer',
            transition: 'background 0.2s ease', minWidth: 280,
          }}
        >
          {addedToCart ? (
            <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg> Added!</>
          ) : (
            <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg> Add to Cart</>
          )}
        </button>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid #e5e7eb', marginBottom: 28 }} />

      {/* Two-column cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>

        {/* Card: Seller Notes */}
        {variant.cosmeticRemark && (
          <div style={{ background: '#fffbeb', borderRadius: 12, padding: '20px 24px' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937', marginTop: 0, marginBottom: 8 }}>Seller notes</h3>
            <p style={{ fontSize: 14, color: '#78350f', lineHeight: 1.6, margin: 0 }}>{variant.cosmeticRemark}</p>
          </div>
        )}

        {/* Card: What's Included */}
        {variant.accessories && variant.accessories.length > 0 && (
          <div style={{ background: '#fffbeb', borderRadius: 12, padding: '20px 24px' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937', marginTop: 0, marginBottom: 12 }}>What&apos;s included</h3>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#16a34a', fontWeight: 600 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                12 months warranty
              </li>
              {variant.accessories.map((acc, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#374151' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                  {acc}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Shutter Count — full width */}
      {variant.shutterCount !== undefined && (
        <div style={{ background: '#f9fafb', borderRadius: 12, padding: '20px 24px', marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shutter count</span>
            <InfoButton onClick={() => setShowShutterModal(true)} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1f2937', marginBottom: 10 }}>{variant.shutterCount.toLocaleString('nl-NL')} actuations</div>
          <div style={{ width: '100%', height: 6, background: '#e5e7eb', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: `${shutterPct}%`, height: '100%', background: shutterPct < 30 ? '#22c55e' : shutterPct < 60 ? '#3b82f6' : '#f59e0b', borderRadius: 999 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
            <span>0</span>
            <span style={{ color: shutterPct < 30 ? '#16a34a' : shutterPct < 60 ? '#2563eb' : '#d97706' }}>{Math.round(shutterPct)}% of rated shutter life used</span>
            <span>200.000</span>
          </div>
        </div>
      )}

      {/* ============ LIGHTBOX ============ */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <button onClick={() => setLightboxOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', cursor: 'pointer', zIndex: 10001 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          {totalImages > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIdx((lightboxIdx - 1 + totalImages) % totalImages); }}
                style={{ position: 'absolute', left: 20, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 48, height: 48, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIdx((lightboxIdx + 1) % totalImages); }}
                style={{ position: 'absolute', right: 20, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 48, height: 48, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </>
          )}
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: '85vw', maxHeight: '85vh' }}>
            <Image
              src={images[lightboxIdx % totalImages]}
              alt={`${product.title} — photo ${lightboxIdx + 1}`}
              width={1200}
              height={1200}
              style={{ objectFit: 'contain', maxWidth: '85vw', maxHeight: '85vh', width: 'auto', height: 'auto' }}
            />
          </div>
          {totalImages > 1 && (
            <div style={{ position: 'absolute', bottom: 20, display: 'flex', gap: 6 }}>
              {images.map((_, i) => (
                <button key={i} onClick={(e) => { e.stopPropagation(); setLightboxIdx(i); }} style={{ width: 10, height: 10, borderRadius: '50%', border: 'none', background: i === lightboxIdx ? '#fff' : 'rgba(255,255,255,0.4)', cursor: 'pointer' }} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============ MODALS ============ */}
      <Modal open={showConditionModal} onClose={() => setShowConditionModal(false)}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1f2937', textAlign: 'center', marginTop: 0, marginBottom: 20 }}>Condition Grades</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {conditionGrades.map((g, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: g.color, flexShrink: 0, marginTop: 6 }} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1f2937', marginBottom: 3 }}>{g.label}</div>
                <div style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.6 }}>{g.description}</div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
      <Modal open={showShutterModal} onClose={() => setShowShutterModal(false)}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1f2937', textAlign: 'center', marginTop: 0, marginBottom: 12 }}>Shutter Count</h2>
        <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7 }}>
          The shutter count indicates how many times the camera&apos;s shutter has been activated — a useful indicator of usage. All cameras are read by our specialists using professional tools. Every camera comes with our 12-month warranty, including the shutter mechanism.
        </p>
      </Modal>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useRecentlyViewed } from '@/context/RecentlyViewedContext';
import { assetPath } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function conditionColor(condition: string): string {
  switch (condition) {
    case 'as-new':
      return '#059669';
    case 'excellent':
      return '#16a34a';
    case 'good':
      return '#65a30d';
    case 'used':
      return '#ca8a04';
    default:
      return '#6b7280';
  }
}

function conditionBg(condition: string): string {
  switch (condition) {
    case 'as-new':
    case 'excellent':
      return '#f0fdf4';
    case 'good':
      return '#f7fee7';
    case 'used':
      return '#fefce8';
    default:
      return '#f3f4f6';
  }
}

function conditionDescription(title: string, conditionLabel: string, shutterCount?: number): string {
  const sc = shutterCount ? ` with only ${shutterCount.toLocaleString('nl-NL')} shutter actuations` : '';
  switch (conditionLabel.toLowerCase()) {
    case 'as new':
      return `This ${title} is in ${conditionLabel} condition${sc}. Virtually indistinguishable from a brand-new unit — no visible marks, scratches, or signs of use. Comes with 12 months warranty.`;
    case 'excellent':
      return `This ${title} is in ${conditionLabel} condition${sc}. Only minimal cosmetic wear that does not affect functionality. Sensor, autofocus, and all controls have been professionally tested. Comes with 12 months warranty.`;
    case 'good':
      return `This ${title} is in ${conditionLabel} condition${sc}. Light signs of normal use are visible, but the camera is fully functional and has been professionally checked. Comes with 12 months warranty.`;
    default:
      return `This ${title} is in ${conditionLabel} condition${sc}. Shows visible signs of use but remains fully operational. Sensor, autofocus, and metering have all been tested and verified. Comes with 12 months warranty.`;
  }
}

function Stars() {
  return (
    <span style={{ display: 'inline-flex', gap: 1 }}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill="#f59e0b">
          <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
        </svg>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  SEO texts                                                          */
/* ------------------------------------------------------------------ */
const seoTexts: Record<string, string[]> = {
  'sony-a7-iv': [
    'The Sony A7 IV is widely regarded as the best all-round full-frame mirrorless camera of its generation. Built around a 33MP Exmor R sensor and the BIONZ XR processor, it delivers excellent stills quality, reliable real-time Eye AF, and advanced 4K 60p video with 10-bit 4:2:2 colour depth.',
    'Every pre-owned Sony A7 IV in our store has been thoroughly tested and graded. We list the exact shutter count, include detailed photos, and back each sale with a 12-month warranty.',
  ],
  'canon-eos-r5': [
    'The Canon EOS R5 set a new benchmark for hybrid mirrorless cameras. Its 45MP full-frame CMOS sensor enables blistering 20fps bursts and class-leading 8K RAW video recording.',
    'At Camera-tweedehands.nl, each used Canon EOS R5 is inspected by our technicians, graded transparently, and protected by a 12-month warranty.',
  ],
  'nikon-z8': [
    'The Nikon Z8 packs the core technology of Nikon\'s flagship Z9 into a smaller, lighter body. With a 45.7MP stacked CMOS sensor and the EXPEED 7 processor, it delivers fast burst shooting and reliable autofocus tracking.',
    'Buying a second-hand Nikon Z8 from Camera-tweedehands.nl means every unit has been inspected, graded, and covered by our 12-month warranty.',
  ],
};

/* ------------------------------------------------------------------ */
/*  FAQ items                                                          */
/* ------------------------------------------------------------------ */
interface FaqItem { q: string; a: string }
const defaultFaqs: FaqItem[] = [
  { q: 'What warranty is included?', a: 'Every product sold by Camera-tweedehands.nl includes a 12-month warranty covering manufacturing defects and mechanical failures. Damage caused by the customer (water damage, drop damage) is not covered.' },
  { q: 'How is the shutter count determined?', a: 'We read the shutter actuation count directly from the camera\'s internal counter using professional diagnostic tools. The count listed is accurate at the time of intake.' },
  { q: 'What do the condition grades mean?', a: '"As New" means virtually no signs of use. "Excellent" shows only minimal cosmetic marks. "Good" may have light wear but is fully functional. "Used" has visible wear that does not affect performance.' },
  { q: 'Can I return my purchase?', a: 'Yes. We offer a 14-day return policy for online purchases. If you are not satisfied, you can return the item in the same condition for a full refund.' },
];

/* ------------------------------------------------------------------ */
/*  USP icons                                                          */
/* ------------------------------------------------------------------ */
function WarrantyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function ReturnsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}
function CheckedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
function ShippingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Info icon button                                                   */
/* ------------------------------------------------------------------ */
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
      aria-label="Meer informatie"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Modal overlay                                                      */
/* ------------------------------------------------------------------ */
function Modal({ open, onClose, children, className }: { open: boolean; onClose: () => void; children: React.ReactNode; className?: string }) {
  return (
    <div
      className={className}
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
          aria-label="Sluiten"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Condition modal content                                            */
/* ------------------------------------------------------------------ */
const conditionGrades = [
  { label: 'As New', color: '#059669', description: 'Virtually indistinguishable from a brand-new unit. No visible marks, scratches, or signs of use whatsoever.' },
  { label: 'Excellent', color: '#16a34a', description: 'Only minimal cosmetic wear that does not affect functionality. May have very faint marks that are barely noticeable.' },
  { label: 'Good', color: '#65a30d', description: 'Light signs of normal use. May have minor scratches or marks. For lenses, very small dust particles may be present but do not affect image quality.' },
  { label: 'Used', color: '#ca8a04', description: 'Clearly shows signs of regular use with visible marks and/or scratches. For lenses, dust particles or a small scratch on the glass may be present but have no impact on results.' },
  { label: 'Heavily Used', color: '#6b7280', description: 'Extensively used with significant wear. Fully functional unless stated otherwise. Lenses may have dust or scratches that could minimally affect results.' },
];

function ConditionModalContent() {
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1f2937', textAlign: 'center', marginTop: 0, marginBottom: 8 }}>
        Product Condition Grades
      </h2>
      <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, marginBottom: 24, textAlign: 'center' }}>
        Every product is assigned a condition grade by our specialists. Below you&apos;ll find a detailed explanation of each grade.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {conditionGrades.map((g, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{
              width: 10, height: 10, borderRadius: '50%', background: g.color,
              flexShrink: 0, marginTop: 6,
            }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1f2937', marginBottom: 3 }}>{g.label}</div>
              <div style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.6 }}>{g.description}</div>
            </div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, marginTop: 20 }}>
        When your product arrives, our specialists assess its condition based on these criteria. If we grade it differently than expected, we&apos;ll contact you. Not sure which grade applies? Check our FAQ or reach out to our team.
      </p>
    </div>
  );
}

function ShutterCountModalContent() {
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1f2937', textAlign: 'center', marginTop: 0, marginBottom: 12 }}>
        Shutter Count
      </h2>
      <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7 }}>
        The shutter count indicates how many times the camera&apos;s shutter has been activated — a useful indicator of usage, though not the only factor that determines condition. All cameras are read by our specialists using professional tools. If a direct readout isn&apos;t possible, we provide an estimate. Every camera comes with our 12-month warranty, including the shutter mechanism.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Upsell accessories data                                            */
/* ------------------------------------------------------------------ */
interface UpsellItem {
  name: string;
  price: number;
  image: string;
  slug: string;
}

const upsellsByBrand: Record<string, UpsellItem[]> = {
  Sony: [
    { name: 'Sony NP-FZ100 Battery', price: 49, image: 'https://m.media-amazon.com/images/I/51JTk2yBQzL._AC_SL1000_.jpg', slug: '#' },
    { name: 'Sony CFexpress Type A 80GB', price: 149, image: 'https://m.media-amazon.com/images/I/71gR1GQ+SQL._AC_SL1500_.jpg', slug: '#' },
    { name: 'Sony GP-VPT2BT Grip', price: 89, image: 'https://m.media-amazon.com/images/I/61FfpTTOURL._AC_SL1200_.jpg', slug: '#' },
  ],
  Canon: [
    { name: 'Canon LP-E6NH Battery', price: 59, image: 'https://m.media-amazon.com/images/I/61+rnZpOi4L._AC_SL1500_.jpg', slug: '#' },
    { name: 'SanDisk CFexpress 128GB', price: 159, image: 'https://m.media-amazon.com/images/I/71tsFoxEOJL._AC_SL1500_.jpg', slug: '#' },
    { name: 'Canon BG-R10 Battery Grip', price: 279, image: 'https://m.media-amazon.com/images/I/71bqx6CANOL._AC_SL1500_.jpg', slug: '#' },
  ],
  Nikon: [
    { name: 'Nikon EN-EL15c Battery', price: 55, image: 'https://m.media-amazon.com/images/I/61M6JUI8pyL._AC_SL1000_.jpg', slug: '#' },
    { name: 'Sony CFexpress Type B 128GB', price: 179, image: 'https://m.media-amazon.com/images/I/71-c5JCHbVL._AC_SL1500_.jpg', slug: '#' },
    { name: 'Nikon MB-N12 Battery Grip', price: 329, image: 'https://m.media-amazon.com/images/I/61bRMnfhUFL._AC_SL1200_.jpg', slug: '#' },
  ],
  Fujifilm: [
    { name: 'Fujifilm NP-W235 Battery', price: 65, image: 'https://m.media-amazon.com/images/I/61rHbMUbURL._AC_SL1200_.jpg', slug: '#' },
    { name: 'SanDisk SD UHS-II 128GB', price: 49, image: 'https://m.media-amazon.com/images/I/617NtexaW2L._AC_SL1500_.jpg', slug: '#' },
  ],
  default: [
    { name: 'SanDisk SD UHS-II 128GB', price: 49, image: 'https://m.media-amazon.com/images/I/617NtexaW2L._AC_SL1500_.jpg', slug: '#' },
    { name: 'Peak Design Slide Strap', price: 65, image: 'https://m.media-amazon.com/images/I/71J5UrFj2SL._AC_SL1500_.jpg', slug: '#' },
  ],
};

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */
export default function VariantDetailPage() {
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
  const [variantsOpen, setVariantsOpen] = useState(false);
  const [specsOpen, setSpecsOpen] = useState(false);
  const [faqOpenIdx, setFaqOpenIdx] = useState<number | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showCartPopup, setShowCartPopup] = useState(false);
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

  const otherVariants = product.variants.filter(v => v.sku !== variant.sku);
  const allVariantPrices = product.variants.map(v => v.price);
  const minPrice = Math.min(...allVariantPrices);

  const maxShutter = 200000;
  const shutterPct = variant.shutterCount ? Math.min((variant.shutterCount / maxShutter) * 100, 100) : 0;

  const descriptionTags: string[] = [];
  if (product.description) descriptionTags.push(product.description);
  if (product.specs?.Mount) descriptionTags.push(product.specs.Mount + ' mount');

  const faqs = defaultFaqs;
  const seo = seoTexts[slug];
  const specsEntries = product.specs ? Object.entries(product.specs) : [];

  const formattedPrice = variant.price.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleAddToCart = () => {
    addItem(
      {
        id: variant.sku,
        sku: variant.sku,
        name: product.title,
        price: variant.price,
        condition: variant.conditionLabel,
        image: product.image,
        inclVat: variant.inclVat ?? false,
      },
      product
    );
    setAddedToCart(true);
    setShowCartPopup(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const brand = product.title.split(' ')[0];
  const upsellItems = upsellsByBrand[brand] || upsellsByBrand['default'];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px', paddingBottom: 80 }}>
      {/* Breadcrumb — hide on mobile via CSS */}
      <div className="variant-detail__breadcrumb">
        <Breadcrumb items={[
          { label: product.category.charAt(0).toUpperCase() + product.category.slice(1), href: `/${product.category}` },
          { label: product.title, href: `/product/${slug}` },
          { label: `SKU ${sku}` },
        ]} />
      </div>

      {/* Two-column grid — stacks on mobile */}
      <div className="variant-detail-grid" style={{ display: 'grid', gridTemplateColumns: '60% 40%', gap: 40, marginTop: 24 }}>

        {/* ============ GALLERY ============ */}
        <div className="variant-detail__gallery">
          {/* Back link (mobile: compact above photo) */}
          <div className="variant-detail__back-mobile" style={{ display: 'none' }}>
            <Link
              href={`/product/${slug}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: '#f97316', fontWeight: 600, fontSize: 13, textDecoration: 'none', marginBottom: 6 }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              {product.title}
            </Link>
          </div>

          {/* Main image */}
          <div style={{
            position: 'relative',
            background: '#ffffff',
            borderRadius: 12,
            overflow: 'hidden',
            aspectRatio: '1 / 1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Image
              src={currentImage}
              alt={`${product.title} — ${variant.conditionLabel}`}
              width={600}
              height={600}
              priority
              onClick={() => { setLightboxIdx(imgIdx); setLightboxOpen(true); }}
              style={{ objectFit: 'contain', maxWidth: '85%', maxHeight: '85%', cursor: 'zoom-in' }}
            />

            {/* Prev / Next buttons */}
            {totalImages > 1 && (
              <>
                <button
                  onClick={() => setImgIdx(prev => (prev - 1 + totalImages) % totalImages)}
                  style={{
                    position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                    width: 36, height: 36, borderRadius: '50%', border: '1px solid #e5e7eb',
                    background: '#ffffffdd', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  }}
                  aria-label="Previous image"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  onClick={() => setImgIdx(prev => (prev + 1) % totalImages)}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    width: 36, height: 36, borderRadius: '50%', border: '1px solid #e5e7eb',
                    background: '#ffffffdd', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  }}
                  aria-label="Next image"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </>
            )}

            {/* Image counter */}
            {totalImages > 1 && (
              <span style={{
                position: 'absolute', bottom: 10, right: 10,
                background: 'rgba(31,41,55,0.75)', color: '#ffffff',
                fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
              }}>
                {imgIdx + 1} / {totalImages}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {totalImages > 1 && (
            <div style={{
              display: 'flex', gap: 8, marginTop: 10, overflowX: 'auto',
              paddingBottom: 4,
            }}>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  style={{
                    width: 56, height: 56, borderRadius: 8, overflow: 'hidden', flexShrink: 0,
                    border: i === imgIdx ? '2px solid #f97316' : '1px solid #e5e7eb',
                    background: '#ffffff', cursor: 'pointer', padding: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: i === imgIdx ? 1 : 0.6,
                    transition: 'opacity 0.15s, border-color 0.15s',
                  }}
                >
                  <Image src={img} alt={`View ${i + 1}`} width={48} height={48} style={{ objectFit: 'contain' }} />
                </button>
              ))}
            </div>
          )}

          {/* Photo notice */}
          <p style={{
            display: 'flex', alignItems: 'center', gap: 6,
            marginTop: 10, fontSize: 12, color: '#6b7280', lineHeight: 1.5,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            We photograph every unique item individually — what you see is exactly what you get.
          </p>

          {/* SKU under photo */}
          <p style={{ fontSize: 12, color: '#9ca3af', margin: '4px 0 0' }}>SKU: {sku}</p>
        </div>

        {/* ============ INFO COLUMN ============ */}
        <div className="variant-detail__info">
          {/* Title */}
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1f2937', margin: '0 0 8px', lineHeight: 1.2 }}>{product.title}</h1>

          {/* Condition label + badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#6b7280' }}>
              Condition: <span style={{ display: 'inline-block', background: conditionBg(variant.condition), color: conditionColor(variant.condition), borderRadius: 999, padding: '3px 12px', fontSize: 12, fontWeight: 600 }}>{variant.conditionLabel}</span>
              <InfoButton onClick={() => setShowConditionModal(true)} />
            </span>
            {product.badge && product.badge !== 'vat' && (
              <span style={{
                background: product.badge === 'sale' ? '#ef4444' : product.badge === 'new' ? '#22c55e' : product.badge === 'outlet' ? '#f97316' : '#6b7280',
                color: '#fff', borderRadius: 999, padding: '3px 12px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const,
              }}>
                {product.badge === 'sale' ? 'Sale' : product.badge === 'new' ? 'New' : product.badge === 'outlet' ? 'OUTLET' : product.badge}
              </span>
            )}
          </div>

          {/* Price */}
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 32, fontWeight: 700, color: '#1f2937' }}>&euro; {formattedPrice}</span>
          </div>

          {/* Add to cart */}
          <div className="variant-detail__cart-desktop" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="variant-detail__add-to-cart"
                onClick={handleAddToCart}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  background: addedToCart ? '#16a34a' : '#f97316', color: '#ffffff',
                  border: 'none', borderRadius: 999, padding: '14px 24px',
                  fontSize: 16, fontWeight: 700, cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
              >
                {addedToCart ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Added!
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                    Add to Cart
                  </>
                )}
              </button>
              <button
                style={{ width: 52, height: 52, borderRadius: 999, border: '1px solid #e5e7eb', background: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                aria-label="Add to wishlist"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              </button>
            </div>
            <Link href="/trade-in" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              marginTop: 8, fontSize: 13, color: '#f97316', fontWeight: 600, textDecoration: 'none',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
              Save when you trade in
            </Link>
          </div>

          {/* USPs */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px',
            padding: '12px 0', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb',
            marginBottom: 20,
          }}>
            {[
              { icon: <WarrantyIcon />, text: '12 Mo. Warranty' },
              { icon: <ReturnsIcon />, text: '14-Day Returns' },
              { icon: <CheckedIcon />, text: 'Professionally Checked' },
              { icon: <ShippingIcon />, text: 'Free Shipping NL' },
            ].map((usp, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {usp.icon}
                <span style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>{usp.text}</span>
              </div>
            ))}
          </div>

          {/* --- Detail cards --- */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>

            {/* Card: Shutter Count */}
            {variant.shutterCount !== undefined && (
              <div style={{ background: '#f9fafb', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Shutter count</span>
                  <InfoButton onClick={() => setShowShutterModal(true)} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#1f2937', marginBottom: 8 }}>{variant.shutterCount.toLocaleString('nl-NL')} actuations</div>
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

            {/* Card: Seller Notes */}
            {variant.cosmeticRemark && (
              <div style={{ background: '#fffbeb', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#92400e', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: 6 }}>Seller notes</div>
                <div style={{ fontSize: 13, color: '#78350f', lineHeight: 1.5 }}>{variant.cosmeticRemark}</div>
              </div>
            )}

            {/* Card: What's Included */}
            {variant.accessories && variant.accessories.length > 0 && (
              <div style={{ background: '#f9fafb', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: 8 }}>What&apos;s included</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#16a34a', fontWeight: 600 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                    12 months warranty
                  </span>
                  {variant.accessories.map((acc, i) => (
                    <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#374151' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                      {acc}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* View all variants (expandable) */}
          {product.variants.length > 1 && (
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', marginBottom: 16, marginTop: 8 }}>
              <button
                onClick={() => setVariantsOpen(!variantsOpen)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', background: '#ffffff', border: 'none', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1f2937' }}>
                    View all {product.title} variants
                  </div>
                  <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
                    {otherVariants.length} other {otherVariants.length !== 1 ? 'units' : 'unit'} available &middot; from &euro; {minPrice.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <svg
                  width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="variants-chevron"
                  style={{ transform: variantsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <div className="variants-panel" style={{ borderTop: '1px solid #e5e7eb', display: variantsOpen ? undefined : 'none' }}>
                  {product.variants.map((v) => {
                    const isCurrent = v.sku === variant.sku;
                    return (
                      <Link
                        key={v.sku}
                        href={`/product/${slug}/${v.sku}`}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '12px 16px', textDecoration: 'none',
                          borderBottom: '1px solid #f3f4f6',
                          borderLeft: isCurrent ? '3px solid #f97316' : '3px solid transparent',
                          background: isCurrent ? '#fff7ed' : '#ffffff',
                        }}
                      >
                        <div style={{
                          width: 48, height: 48, borderRadius: 8, overflow: 'hidden', flexShrink: 0,
                          background: '#ffffff', border: '1px solid #e5e7eb',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Image src={v.images[0] || product.image} alt={`${product.title} ${v.sku}`} width={40} height={40} style={{ objectFit: 'contain' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#1f2937' }}>SKU {v.sku}</span>
                            <span style={{
                              display: 'inline-block', padding: '2px 8px', borderRadius: 999,
                              fontSize: 11, fontWeight: 600,
                              color: conditionColor(v.condition),
                              background: conditionBg(v.condition),
                            }}>
                              {v.conditionLabel}
                            </span>
                          </div>
                          {v.shutterCount !== undefined && (
                            <div style={{ fontSize: 12, color: '#6b7280' }}>
                              {v.shutterCount.toLocaleString('nl-NL')} clicks
                            </div>
                          )}
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: '#1f2937' }}>
                            &euro; {v.price.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
            </div>
          )}
        </div>
      </div>

      {/* ============ BELOW THE GRID — left-aligned ============ */}
      <div className="variant-detail__below" style={{ maxWidth: 800, marginTop: 40 }}>

        {/* About section */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1f2937', marginBottom: 12 }}>About the {product.title}</h2>
          {seo ? (
            seo.map((para, i) => (
              <p key={i} style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7, marginBottom: 10 }}>{para}</p>
            ))
          ) : (
            <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7 }}>
              The {product.title} is a popular choice among photography enthusiasts and professionals.
              {product.description ? ` ${product.description}.` : ''}
              {' '}At Camera-tweedehands.nl, every unit is professionally inspected, transparently graded, and backed by our 12-month warranty.
            </p>
          )}
        </div>

        {/* Specs accordion */}
        {specsEntries.length > 0 && (
          <div className="accordion" style={{ marginBottom: 24 }}>
            <div className={`accordion__item${specsOpen ? ' is-open' : ''}`}>
              <button className="accordion__trigger" aria-expanded={specsOpen} onClick={() => setSpecsOpen(!specsOpen)}>
                Specifications
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <div className="accordion__body">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {specsEntries.map(([key, val]) => (
                      <tr key={key} style={{ borderBottom: '1px solid var(--border, #eeeef2)' }}>
                        <td style={{ padding: '10px 16px 10px 0', fontWeight: 600, fontSize: 14, width: '40%' }}>{key}</td>
                        <td style={{ padding: '10px 0', fontSize: 14, color: '#6b7280' }}>{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* FAQ accordion */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Frequently asked questions</h2>
          <div className="accordion">
            {faqs.map((faq, i) => (
              <div key={i} className={`accordion__item${faqOpenIdx === i ? ' is-open' : ''}`}>
                <button className="accordion__trigger" aria-expanded={faqOpenIdx === i} onClick={() => setFaqOpenIdx(faqOpenIdx === i ? null : i)}>
                  {faq.q}
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                <div className="accordion__body"><p>{faq.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ MOBILE STICKY CART BAR ============ */}
      <div className="variant-detail__sticky-cart" style={{ display: 'none' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1f2937' }}>&euro; {formattedPrice}</div>
        </div>
        <button
          onClick={handleAddToCart}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: addedToCart ? '#16a34a' : '#f97316', color: '#ffffff',
            border: 'none', borderRadius: 10, padding: '12px 20px',
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
            transition: 'background 0.2s ease',
          }}
        >
          {addedToCart ? 'Added!' : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Add to Cart
            </>
          )}
        </button>
      </div>

      {/* ============ MODALS ============ */}
      <Modal className="info-modal-condition" open={showConditionModal} onClose={() => setShowConditionModal(false)}>
        <ConditionModalContent />
      </Modal>
      <Modal className="info-modal-shutter" open={showShutterModal} onClose={() => setShowShutterModal(false)}>
        <ShutterCountModalContent />
      </Modal>

      {/* ============ LIGHTBOX ============ */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <button onClick={() => setLightboxOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: '#fff', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          {totalImages > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIdx((lightboxIdx - 1 + totalImages) % totalImages); }}
                style={{ position: 'absolute', left: 20, background: '#fff', border: 'none', borderRadius: '50%', width: 48, height: 48, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIdx((lightboxIdx + 1) % totalImages); }}
                style={{ position: 'absolute', right: 20, background: '#fff', border: 'none', borderRadius: '50%', width: 48, height: 48, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </>
          )}
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <Image
              src={images[lightboxIdx % totalImages]}
              alt={`${product.title} — photo ${lightboxIdx + 1}`}
              width={1200}
              height={1200}
              style={{ objectFit: 'contain', maxWidth: '80vw', maxHeight: '80vh', width: 'auto', height: 'auto' }}
            />
          </div>
          {totalImages > 1 && (
            <div style={{ position: 'absolute', bottom: 20, display: 'flex', gap: 8 }}>
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightboxIdx(i); }}
                  style={{ width: 10, height: 10, borderRadius: '50%', border: 'none', background: i === lightboxIdx ? '#f97316' : 'rgba(0,0,0,0.2)', cursor: 'pointer' }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============ CART POPUP ============ */}
        <div
          className="cart-popup-overlay"
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            zIndex: 9999, display: showCartPopup ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={() => setShowCartPopup(false)}
        >
          <div
            style={{
              background: '#fff', borderRadius: 16, width: '100%', maxWidth: 440,
              margin: '0 16px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px',
              background: '#f0fdf4', borderBottom: '1px solid #dcfce7',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#166534' }}>Added to cart</span>
              <button
                onClick={() => setShowCartPopup(false)}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
              >
                <svg width="18" height="18" fill="none" stroke="#6b7280" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Product summary */}
            <div style={{ display: 'flex', gap: 14, padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ width: 64, height: 64, borderRadius: 8, overflow: 'hidden', background: '#f9fafb', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={assetPath(product.image)} alt={product.title} style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1f2937', marginBottom: 2 }}>{product.title}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>{variant.conditionLabel} &middot; SKU {variant.sku}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1f2937', marginTop: 4 }}>&euro; {formattedPrice}</div>
              </div>
            </div>

            {/* Upsell accessories */}
            <div style={{ padding: '16px 20px' }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, marginTop: 0 }}>
                Complete your setup
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {upsellItems.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', border: '1px solid #eeeef2', borderRadius: 10,
                    cursor: 'pointer', transition: 'border-color 0.15s',
                  }}>
                    <div style={{ width: 48, height: 48, borderRadius: 6, background: '#f9fafb', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={assetPath(item.image)} alt={item.name} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#1f2937' }}>{item.name}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1f2937' }}>&euro; {item.price.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</div>
                    </div>
                    <button style={{
                      padding: '6px 14px', borderRadius: 999, border: '1.5px solid #e5e7eb',
                      background: '#fff', fontSize: 12, fontWeight: 600, color: '#1f2937',
                      cursor: 'pointer', whiteSpace: 'nowrap',
                    }}>
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, padding: '0 20px 20px' }}>
              <button
                onClick={() => setShowCartPopup(false)}
                style={{
                  flex: 1, padding: '12px 16px', borderRadius: 999,
                  border: '1.5px solid #e5e7eb', background: '#fff',
                  fontSize: 14, fontWeight: 600, color: '#1f2937', cursor: 'pointer',
                }}
              >
                Continue shopping
              </button>
              <Link
                href="/checkout"
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '12px 16px', borderRadius: 999,
                  background: '#f97316', color: '#fff', textDecoration: 'none',
                  fontSize: 14, fontWeight: 700,
                }}
              >
                Checkout
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        </div>
    </div>
  );
}

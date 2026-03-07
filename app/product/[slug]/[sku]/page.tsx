'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function conditionColor(condition: string): string {
  switch (condition) {
    case 'as-new':
    case 'excellent':
      return '#16a34a';
    case 'good':
      return '#d97706';
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
      return '#fffbeb';
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
/*  SEO texts (reuse from parent page pattern)                        */
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
  { q: 'What warranty is included?', a: 'Every product sold by Camera-tweedehands.nl includes a 12-month warranty covering manufacturing defects and mechanical failures.' },
  { q: 'How is the shutter count determined?', a: 'We read the shutter actuation count directly from the camera\'s internal counter using professional diagnostic tools. The count listed is accurate at the time of intake.' },
  { q: 'What do the condition grades mean?', a: '"As New" means virtually no signs of use. "Excellent" shows only minimal cosmetic marks. "Good" may have light wear but is fully functional. "Used" has visible wear that does not affect performance.' },
  { q: 'Can I return my purchase?', a: 'Yes. We offer a 14-day return policy on all products. If you are not satisfied, you can return the item in the same condition for a full refund.' },
];

/* ------------------------------------------------------------------ */
/*  USP icons (inline SVG)                                             */
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
/*  Page component                                                     */
/* ------------------------------------------------------------------ */
export default function VariantDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const sku = params?.sku as string;
  const { addItem } = useCart();

  const product = products.find(p => p.slug === slug);
  const variant = product?.variants.find(v => v.sku === sku);

  const [imgIdx, setImgIdx] = useState(0);
  const [variantsOpen, setVariantsOpen] = useState(false);
  const [specsOpen, setSpecsOpen] = useState(false);
  const [faqOpenIdx, setFaqOpenIdx] = useState<number | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

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
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const formattedPrice = variant.price.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: product.category.charAt(0).toUpperCase() + product.category.slice(1), href: `/${product.category}` },
        { label: product.title, href: `/product/${slug}` },
        { label: `SKU ${sku}` },
      ]} />

      {/* Two-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginTop: 24 }}>

        {/* ============ LEFT COLUMN — Gallery ============ */}
        <div>
          {/* Main image */}
          <div style={{
            position: 'relative',
            background: '#ffffff',
            borderRadius: 12,
            border: '1px solid #e5e7eb',
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
              style={{ objectFit: 'contain', maxWidth: '85%', maxHeight: '85%' }}
            />

            {/* Prev button */}
            <button
              onClick={() => setImgIdx(prev => (prev - 1 + totalImages) % totalImages)}
              style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                width: 40, height: 40, borderRadius: '50%', border: '1px solid #e5e7eb',
                background: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
              aria-label="Previous image"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Next button */}
            <button
              onClick={() => setImgIdx(prev => (prev + 1) % totalImages)}
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                width: 40, height: 40, borderRadius: '50%', border: '1px solid #e5e7eb',
                background: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
              aria-label="Next image"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Image counter badge */}
            <span style={{
              position: 'absolute', bottom: 12, right: 12,
              background: 'rgba(31,41,55,0.8)', color: '#ffffff',
              fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 6,
            }}>
              {imgIdx + 1} / {totalImages}
            </span>
          </div>

          {/* Photo notice */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 8,
            marginTop: 12, fontSize: 13, color: '#6b7280', lineHeight: 1.5,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>All photos are taken by us — what you see is exactly what you&apos;ll receive.</span>
          </div>
        </div>

        {/* ============ RIGHT COLUMN — Details ============ */}
        <div>
          {/* Back link */}
          <Link
            href={`/product/${slug}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#f97316', fontWeight: 600, fontSize: 14, textDecoration: 'none', marginBottom: 8 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            All {product.title} variants
          </Link>

          {/* SKU */}
          <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 8px' }}>SKU: {sku}</p>

          {/* Title */}
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1f2937', margin: '0 0 8px' }}>{product.title}</h1>

          {/* Description tags */}
          {descriptionTags.length > 0 && (
            <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 16px' }}>
              {descriptionTags.join(' · ')}
            </p>
          )}

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 20 }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: '#1f2937' }}>&euro; {formattedPrice}</span>
            <span style={{ fontSize: 14, color: '#6b7280' }}>{variant.inclVat ? 'incl. VAT' : 'excl. VAT'}</span>
          </div>

          {/* Condition box */}
          <div style={{
            background: '#f9fafb', borderRadius: 12, padding: '16px 20px', marginBottom: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{
                display: 'inline-block', padding: '4px 12px', borderRadius: 999,
                fontSize: 13, fontWeight: 600,
                color: conditionColor(variant.condition),
                background: conditionBg(variant.condition),
                border: `1px solid ${conditionColor(variant.condition)}20`,
              }}>
                {variant.conditionLabel}
              </span>
              <Stars />
            </div>
            <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
              {conditionDescription(product.title, variant.conditionLabel, variant.shutterCount)}
            </p>
          </div>

          {/* Shutter count */}
          {variant.shutterCount !== undefined && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <span style={{ fontSize: 14, color: '#6b7280' }}>Shutter count</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1f2937' }}>{variant.shutterCount.toLocaleString('nl-NL')} actuations</span>
              </div>
              <div style={{
                width: '100%', height: 8, background: '#e5e7eb', borderRadius: 999, overflow: 'hidden',
              }}>
                <div style={{
                  width: `${shutterPct}%`, height: '100%', background: '#3b82f6', borderRadius: 999,
                  transition: 'width 0.3s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                <span>0</span>
                <span>200.000</span>
              </div>
            </div>
          )}

          {/* Included accessories */}
          {variant.accessories && variant.accessories.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                Included accessories ({variant.accessories.length})
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {variant.accessories.map((acc, i) => (
                  <span key={i} style={{
                    display: 'inline-block', padding: '5px 12px', borderRadius: 999,
                    border: '1px solid #e5e7eb', fontSize: 13, color: '#374151',
                  }}>
                    {acc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Add to cart + wishlist */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <button
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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Added!
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  Add to Cart — &euro; {formattedPrice}
                </>
              )}
            </button>
            <button
              style={{
                width: 52, height: 52, borderRadius: 999,
                border: '1px solid #e5e7eb', background: '#ffffff',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
              aria-label="Add to wishlist"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>

          {/* USP strip */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px',
            padding: '16px 0', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb',
            marginBottom: 20,
          }}>
            {[
              { icon: <WarrantyIcon />, text: '12 Mo. Warranty' },
              { icon: <ReturnsIcon />, text: '14-Day Returns' },
              { icon: <CheckedIcon />, text: 'Professionally Checked' },
              { icon: <ShippingIcon />, text: 'Free Shipping NL' },
            ].map((usp, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {usp.icon}
                <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{usp.text}</span>
              </div>
            ))}
          </div>

          {/* View all variants (expandable) */}
          {product.variants.length > 1 && (
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
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
                    {otherVariants.length} other unit{otherVariants.length !== 1 ? 's' : ''} available &middot; from &euro; {minPrice.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <svg
                  width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: variantsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {variantsOpen && (
                <div style={{ borderTop: '1px solid #e5e7eb' }}>
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
                          borderLeft: isCurrent ? '3px solid #3b82f6' : '3px solid transparent',
                          background: isCurrent ? '#f0f7ff' : '#ffffff',
                        }}
                      >
                        {/* Thumbnail */}
                        <div style={{
                          width: 48, height: 48, borderRadius: 8, overflow: 'hidden', flexShrink: 0,
                          background: '#ffffff', border: '1px solid #e5e7eb',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Image
                            src={v.images[0] || product.image}
                            alt={`${product.title} ${v.sku}`}
                            width={40}
                            height={40}
                            style={{ objectFit: 'contain' }}
                          />
                        </div>

                        {/* Info */}
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
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b7280' }}>
                            {v.shutterCount !== undefined && (
                              <span>{v.shutterCount.toLocaleString('nl-NL')} clicks</span>
                            )}
                            {v.shutterCount !== undefined && <span>&middot;</span>}
                            <Stars />
                          </div>
                          {v.accessories && v.accessories.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                              {v.accessories.map((acc, i) => (
                                <span key={i} style={{
                                  fontSize: 10, padding: '2px 6px', borderRadius: 4,
                                  border: '1px solid #e5e7eb', color: '#6b7280',
                                }}>
                                  {acc}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: '#1f2937' }}>
                            &euro; {v.price.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div style={{ fontSize: 11, color: '#6b7280' }}>
                            {v.inclVat ? 'Incl. VAT' : 'Excl. VAT'}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ============ BELOW THE GRID ============ */}
      <div style={{ maxWidth: 800, margin: '48px auto 0' }}>

        {/* About section */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1f2937', marginBottom: 16 }}>About the {product.title}</h2>
          {seo ? (
            seo.map((para, i) => (
              <p key={i} style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.7, marginBottom: 12 }}>{para}</p>
            ))
          ) : (
            <p style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.7 }}>
              The {product.title} is a popular choice among photography enthusiasts and professionals alike.
              {product.description ? ` ${product.description}.` : ''}
              {' '}At Camera-tweedehands.nl, every unit is professionally inspected, graded transparently, and backed by our 12-month warranty.
              We include the exact shutter count and list all included accessories so you know precisely what you are getting.
            </p>
          )}
        </div>

        {/* Specs accordion */}
        {specsEntries.length > 0 && (
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
            <button
              onClick={() => setSpecsOpen(!specsOpen)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px', background: '#ffffff', border: 'none', cursor: 'pointer',
                fontSize: 16, fontWeight: 600, color: '#1f2937', textAlign: 'left',
              }}
            >
              Specifications
              <svg
                width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: specsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {specsOpen && (
              <div style={{ borderTop: '1px solid #e5e7eb' }}>
                {specsEntries.map(([key, val], i) => (
                  <div key={key} style={{
                    display: 'flex', justifyContent: 'space-between', padding: '12px 20px',
                    background: i % 2 === 0 ? '#f9fafb' : '#ffffff',
                    fontSize: 14,
                  }}>
                    <span style={{ color: '#6b7280' }}>{key}</span>
                    <span style={{ color: '#1f2937', fontWeight: 500 }}>{val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FAQ accordion */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', marginBottom: 48 }}>
          <div style={{
            padding: '16px 20px', fontSize: 16, fontWeight: 600, color: '#1f2937',
            borderBottom: '1px solid #e5e7eb',
          }}>
            Frequently Asked Questions
          </div>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: i < faqs.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
              <button
                onClick={() => setFaqOpenIdx(faqOpenIdx === i ? null : i)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 20px', background: '#ffffff', border: 'none', cursor: 'pointer',
                  fontSize: 14, fontWeight: 500, color: '#1f2937', textAlign: 'left',
                }}
              >
                {faq.q}
                <svg
                  width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ flexShrink: 0, transform: faqOpenIdx === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {faqOpenIdx === i && (
                <div style={{ padding: '0 20px 14px', fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductGrid from '@/components/product/ProductGrid';
import QuickView from '@/components/product/QuickView';
import type { Product } from '@/data/products';

/* ── Sale products as Product objects (each is a single variant) ── */
const SALE_PRODUCTS: Product[] = [
  {
    id: 'sale-1',
    slug: 'canon-r7',
    title: 'Canon R7',
    brand: 'Canon',
    category: 'cameras',
    price: 1049,
    stock: 1,
    image: 'https://cdn.webshopapp.com/shops/353975/files/492974959/1500x1500x2/canon-r7.jpg',
    badge: 'sale',
    variants: [{ sku: 'SALE-001', price: 1049, condition: 'excellent', conditionLabel: 'Excellent', shutterCount: 8200, images: ['https://cdn.webshopapp.com/shops/353975/files/492974959/1500x1500x2/canon-r7.jpg'], badges: ['sale'] }],
  },
  {
    id: 'sale-2',
    slug: 'sony-a7r-iiia',
    title: 'Sony A7R IIIA',
    brand: 'Sony',
    category: 'cameras',
    price: 1299,
    stock: 1,
    image: 'https://cdn.webshopapp.com/shops/353975/files/492569568/1500x1500x2/sony-sony-a7r-iiia.jpg',
    badge: 'sale',
    variants: [{ sku: 'SALE-002', price: 1299, condition: 'good', conditionLabel: 'Good', shutterCount: 34500, images: ['https://cdn.webshopapp.com/shops/353975/files/492569568/1500x1500x2/sony-sony-a7r-iiia.jpg'], badges: ['sale'] }],
  },
  {
    id: 'sale-3',
    slug: 'canon-ef-50mm-f14-usm',
    title: 'Canon EF 50mm F1.4 USM',
    brand: 'Canon',
    category: 'lenses',
    price: 149,
    stock: 1,
    image: 'https://cdn.webshopapp.com/shops/353975/files/492460168/1500x1500x2/canon-canon-ef-50mm-f14-usm.jpg',
    badge: 'sale',
    variants: [{ sku: 'SALE-003', price: 149, condition: 'excellent', conditionLabel: 'Excellent', images: ['https://cdn.webshopapp.com/shops/353975/files/492460168/1500x1500x2/canon-canon-ef-50mm-f14-usm.jpg'], badges: ['sale'] }],
  },
  {
    id: 'sale-4',
    slug: 'nikon-af-s-50mm-f18-g',
    title: 'Nikon AF-S 50mm F1.8 G',
    brand: 'Nikon',
    category: 'lenses',
    price: 119,
    stock: 1,
    image: 'https://cdn.webshopapp.com/shops/353975/files/493056896/1500x1500x2/nikon-nikon-af-s-50mm-f18-g.jpg',
    badge: 'sale',
    variants: [{ sku: 'SALE-004', price: 119, condition: 'good', conditionLabel: 'Good', images: ['https://cdn.webshopapp.com/shops/353975/files/493056896/1500x1500x2/nikon-nikon-af-s-50mm-f18-g.jpg'], badges: ['sale'] }],
  },
  {
    id: 'sale-5',
    slug: 'sigma-35mm-f14-dg-dn-art-sony-fe',
    title: 'Sigma 35mm F1.4 DG DN Art',
    brand: 'Sigma',
    category: 'lenses',
    price: 679,
    stock: 1,
    image: 'https://cdn.webshopapp.com/shops/353975/files/492881775/1500x1500x2/sigma-sigma-35mm-f14-dg-dn-art-sony-fe.jpg',
    badge: 'sale',
    variants: [{ sku: 'SALE-005', price: 679, condition: 'as-new', conditionLabel: 'As New', images: ['https://cdn.webshopapp.com/shops/353975/files/492881775/1500x1500x2/sigma-sigma-35mm-f14-dg-dn-art-sony-fe.jpg'], badges: ['sale'] }],
  },
  {
    id: 'sale-6',
    slug: 'canon-powershot-g5x-mark-ii',
    title: 'Canon Powershot G5x Mark II',
    brand: 'Canon',
    category: 'cameras',
    price: 999,
    stock: 1,
    image: 'https://cdn.webshopapp.com/shops/353975/files/493056895/1500x1500x2/canon-powershot-g5x-mark-ii.jpg',
    badge: 'sale',
    variants: [{ sku: 'SALE-006', price: 999, condition: 'excellent', conditionLabel: 'Excellent', images: ['https://cdn.webshopapp.com/shops/353975/files/493056895/1500x1500x2/canon-powershot-g5x-mark-ii.jpg'], badges: ['sale'] }],
  },
];

const AllIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const categoryTiles = [
  { key: 'all', label: 'Alles', image: null },
  { key: 'cameras', label: "Camera's", image: '/images/canon-r5.jpg' },
  { key: 'lenses', label: 'Lenzen', image: '/images/canon-rf-24-70mm-f28-l-is-usm.jpg' },
];

const orangeLink: React.CSSProperties = {
  color: 'var(--accent)',
  fontWeight: 600,
  textDecoration: 'none',
};

export default function SalePage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return SALE_PRODUCTS;
    return SALE_PRODUCTS.filter(p => p.category === activeFilter);
  }, [activeFilter]);

  const categoryCounts: Record<string, number> = {
    all: SALE_PRODUCTS.length,
    cameras: SALE_PRODUCTS.filter(p => p.category === 'cameras').length,
    lenses: SALE_PRODUCTS.filter(p => p.category === 'lenses').length,
  };

  const quickViewProduct = quickViewId ? SALE_PRODUCTS.find(p => p.id === quickViewId) ?? null : null;

  const faqs = [
    { q: 'Hoe lang zijn sale prijzen geldig?', a: 'Sale prijzen zijn geldig zolang de voorraad strekt. We raden aan om snel te beslissen — zodra een product verkocht is, vervalt de actieprijs.' },
    { q: 'Krijg ik ook garantie op sale producten?', a: 'Ja, alle sale producten komen met onze standaard 12 maanden garantie. Er is geen verschil in garantievoorwaarden tussen sale en reguliere producten.' },
    { q: 'Kan ik sale producten retourneren?', a: 'Ja. Voor online aankopen heb je 14 dagen na levering om het product te retourneren, zonder opgaaf van reden. Het product moet in dezelfde staat zijn als ontvangen.' },
    { q: 'Waarom zijn deze producten in de sale?', a: 'Sale producten zijn vaak items die we langer op voorraad hebben of producten waar een nieuwer model van beschikbaar is. De kwaliteit en garantie zijn identiek aan ons reguliere aanbod.' },
  ];

  return (
    <div className="container">
      {/* Hero banner */}
      <section
        style={{
          background: '#1E2133',
          color: '#fff',
          borderRadius: 'var(--rl)',
          padding: '48px 40px',
          marginBottom: 32,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(135deg, rgba(232,105,42,0.15) 0%, transparent 40%, transparent 60%, rgba(232,105,42,0.08) 100%)',
        }} />
        <div style={{
          position: 'absolute', top: -80, right: -40, width: 300, height: 300,
          borderRadius: '50%', border: '1px solid rgba(232,105,42,0.12)',
        }} />
        <div style={{
          position: 'absolute', bottom: -120, left: -60, width: 400, height: 400,
          borderRadius: '50%', border: '1px solid rgba(232,105,42,0.08)',
        }} />

        <div style={{ position: 'relative', maxWidth: 600 }}>
          <div
            style={{
              display: 'inline-block',
              background: '#dc2626',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '6px 16px',
              borderRadius: 6,
              marginBottom: 16,
            }}
          >
            Sale
          </div>
          <h1
            style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700,
              marginBottom: 12,
              lineHeight: 1.15,
            }}
          >
            Scherpe deals op tweedehands gear
          </h1>
          <p
            style={{
              fontSize: 16,
              color: 'rgba(255,255,255,.7)',
              lineHeight: 1.6,
            }}
          >
            Profiteer van scherpe prijzen op professioneel gecontroleerde camera&apos;s en lenzen.
            Alle sale producten zijn gegraded en komen met 12 maanden garantie.
          </p>
        </div>
      </section>

      {/* Category tiles */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        {categoryTiles.map(cat => {
          const isActive = activeFilter === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveFilter(cat.key)}
              style={{
                flex: '0 0 auto',
                width: 140,
                height: 140,
                borderRadius: 12,
                border: isActive ? '2px solid var(--accent)' : '1.5px solid var(--border, #EEEEF2)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fff',
                cursor: 'pointer',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                gap: 6,
                color: '#1E2133',
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
                background: cat.image ? '#f5f5f5' : '#1a1a2e',
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
              <span style={{ fontSize: 11, color: '#999' }}>
                {categoryCounts[cat.key]} products
              </span>
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 20 }}>
        {filtered.length} product{filtered.length !== 1 ? 'en' : ''} gevonden
      </div>

      {/* Product grid (same ProductCard as rest of site) */}
      <ProductGrid products={filtered} onQuickView={setQuickViewId} />

      {/* USP trust band */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 32, padding: '28px 0', margin: '32px 0', borderTop: '1px solid #EEEEF2', borderBottom: '1px solid #EEEEF2', flexWrap: 'wrap' }}>
        {['12 maanden garantie', 'Professioneel gecontroleerd', 'Gratis verzending v.a. €50', '14 dagen retour'].map(text => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: '#6b7280' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8692A" strokeWidth="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
            {text}
          </div>
        ))}
      </div>

      {/* SEO text block */}
      <div style={{ padding: '0 0 32px', marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
          Sale &amp; aanbiedingen op tweedehands camera&apos;s
        </h2>
        <div style={{ fontSize: 14, lineHeight: 1.8, color: '#6b7280', maxWidth: 800 }}>
          <p>
            Bij Camera-tweedehands.nl vind je regelmatig scherpe aanbiedingen op professioneel gecontroleerde tweedehands camera&apos;s en lenzen.
            Van <Link href="/brands/canon" style={orangeLink}>Canon</Link> en{' '}
            <Link href="/brands/sony" style={orangeLink}>Sony</Link> tot{' '}
            <Link href="/brands/nikon" style={orangeLink}>Nikon</Link> en{' '}
            <Link href="/brands/sigma" style={orangeLink}>Sigma</Link> — elk sale product is grondig getest, gegraded en wordt geleverd met onze 12 maanden garantie.
          </p>
          <p style={{ marginTop: 12 }}>
            Onze sale producten bieden dezelfde kwaliteit en garantie als ons reguliere aanbod, maar dan tegen een nog scherpere prijs.
            We bieden snelle verzending door heel Europa, veilig betalen en eenvoudig retourneren binnen 14 dagen.
            Bekijk ook onze volledige collectie{' '}
            <Link href="/cameras" style={orangeLink}>camera&apos;s</Link> en{' '}
            <Link href="/lenses" style={orangeLink}>lenzen</Link>.
          </p>
        </div>
      </div>

      {/* FAQs */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Veelgestelde vragen</h2>
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

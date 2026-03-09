'use client';

import { useState, useMemo } from 'react';
import Breadcrumb from '@/components/layout/Breadcrumb';

const products = [
  { name: 'Canon R1', price: 5999, image: 'https://cdn.webshopapp.com/shops/353975/files/492876557/1500x1500x2/canon-canon-r1.jpg', brand: 'Canon', addedDate: '2 days ago', condition: 'As New' },
  { name: 'Sony A7R IIIA', price: 1299, image: 'https://cdn.webshopapp.com/shops/353975/files/492569568/1500x1500x2/sony-sony-a7r-iiia.jpg', brand: 'Sony', addedDate: '3 days ago', condition: 'Good' },
  { name: 'Canon R7', price: 1049, image: 'https://cdn.webshopapp.com/shops/353975/files/492974959/1500x1500x2/canon-r7.jpg', brand: 'Canon', addedDate: 'Today', condition: 'Excellent' },
  { name: 'Sony FE 24-70mm F2.8 GM', price: 1199, image: 'https://cdn.webshopapp.com/shops/353975/files/492975217/1500x1500x2/sony-sony-fe-24-70mm-f28-gm.jpg', brand: 'Sony', addedDate: '1 day ago', condition: 'Excellent' },
  { name: 'Sigma 35mm F1.4 DG DN Art', price: 679, image: 'https://cdn.webshopapp.com/shops/353975/files/492881775/1500x1500x2/sigma-sigma-35mm-f14-dg-dn-art-sony-fe.jpg', brand: 'Sigma', addedDate: '4 days ago', condition: 'As New' },
  { name: 'Canon Powershot G5x Mark II', price: 999, image: 'https://cdn.webshopapp.com/shops/353975/files/493056895/1500x1500x2/canon-powershot-g5x-mark-ii.jpg', brand: 'Canon', addedDate: '5 days ago', condition: 'Excellent' },
  { name: 'Nikon AF-S 50mm F1.8 G', price: 119, image: 'https://cdn.webshopapp.com/shops/353975/files/493056896/1500x1500x2/nikon-nikon-af-s-50mm-f18-g.jpg', brand: 'Nikon', addedDate: '2 days ago', condition: 'Good' },
  { name: 'Canon EF 50mm F1.4 USM', price: 149, image: 'https://cdn.webshopapp.com/shops/353975/files/492460168/1500x1500x2/canon-canon-ef-50mm-f14-usm.jpg', brand: 'Canon', addedDate: '6 days ago', condition: 'Excellent' },
];

const BRANDS = ['All', ...Array.from(new Set(products.map(p => p.brand)))];
const CONDITIONS = ['All', 'As New', 'Excellent', 'Good'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

export default function NewArrivalsPage() {
  const [brandFilter, setBrandFilter] = useState('All');
  const [conditionFilter, setConditionFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const filtered = useMemo(() => {
    let result = products;
    if (brandFilter !== 'All') result = result.filter(p => p.brand === brandFilter);
    if (conditionFilter !== 'All') result = result.filter(p => p.condition === conditionFilter);
    if (sortBy === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [brandFilter, conditionFilter, sortBy]);

  const pillStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 16px',
    borderRadius: 999,
    border: active ? '1.5px solid #E8692A' : '1.5px solid #EEEEF2',
    background: active ? '#E8692A' : '#fff',
    color: active ? '#fff' : '#1E2133',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all .15s',
    fontFamily: 'inherit',
  });

  return (
    <div className="container">
      <Breadcrumb items={[{ label: 'New Arrivals' }]} />

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #1E2133 0%, #2a2d42 50%, #1E2133 100%)',
        color: '#fff',
        borderRadius: 'var(--rl)',
        padding: '48px 40px',
        marginBottom: 32,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,105,42,.08) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -20, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,105,42,.05) 0%, transparent 70%)' }} />
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, marginBottom: 12, position: 'relative' }}>New Arrivals</h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,.7)', maxWidth: 600, margin: '0 auto', position: 'relative' }}>
          Onze nieuwste producten &mdash; 12 toegevoegd deze week
        </p>
      </section>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 28 }}>
        {/* Brand pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {BRANDS.map(b => (
            <button key={b} onClick={() => setBrandFilter(b)} style={pillStyle(brandFilter === b)}>
              {b === 'All' ? 'All brands' : b}
            </button>
          ))}
        </div>

        <div style={{ width: 1, height: 24, background: '#EEEEF2', margin: '0 4px' }} />

        {/* Condition pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CONDITIONS.map(c => (
            <button key={c} onClick={() => setConditionFilter(c)} style={pillStyle(conditionFilter === c)}>
              {c === 'All' ? 'All conditions' : c}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div style={{ marginLeft: 'auto' }}>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1.5px solid #EEEEF2',
              fontSize: 13,
              color: '#1E2133',
              background: '#fff',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
        {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
      </div>

      {/* Product Grid */}
      <style>{`
        @media (max-width: 1024px) {
          .new-arrivals-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .new-arrivals-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
        }
      `}</style>
      <div className="new-arrivals-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 24,
        paddingBottom: 64,
      }}>
        {filtered.map((product) => {
          const isToday = product.addedDate === 'Today';
          return (
            <div
              key={product.name}
              className="new-arrivals-grid-item"
              style={{
                background: '#fff',
                borderRadius: 12,
                border: isToday ? '2px solid #E8692A' : '1px solid #EEEEF2',
                overflow: 'hidden',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Badges */}
              <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, zIndex: 2 }}>
                <span style={{
                  background: '#E8692A',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 6,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}>
                  NEW
                </span>
                {isToday && (
                  <span style={{
                    background: '#22c55e',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 6,
                  }}>
                    Just in
                  </span>
                )}
              </div>

              {/* Image */}
              <div style={{
                aspectRatio: '1',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 20,
              }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain' }}
                />
              </div>

              {/* Info */}
              <div style={{ padding: '16px 16px 20px' }}>
                <div style={{ fontSize: 12, color: '#888', fontWeight: 500, marginBottom: 4 }}>
                  {product.brand}
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1E2133', marginBottom: 8, lineHeight: 1.3 }}>
                  {product.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: '#1E2133' }}>
                    &euro;{product.price.toLocaleString('nl-NL')}
                  </span>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: product.condition === 'As New' ? '#22c55e' : product.condition === 'Excellent' ? '#3b82f6' : '#f59e0b',
                    background: product.condition === 'As New' ? 'rgba(34,197,94,.08)' : product.condition === 'Excellent' ? 'rgba(59,130,246,.08)' : 'rgba(245,158,11,.08)',
                    padding: '3px 8px',
                    borderRadius: 6,
                  }}>
                    {product.condition}
                  </span>
                </div>
                <div style={{
                  fontSize: 12,
                  color: isToday ? '#E8692A' : '#888',
                  fontWeight: isToday ? 600 : 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Added {product.addedDate.toLowerCase()}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 20px', color: '#6b7280', fontSize: 15 }}>
            No products match your filters.
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';

const SALE_PRODUCTS = [
  { name: 'Canon R7', oldPrice: 1199, salePrice: 1049, image: 'https://cdn.webshopapp.com/shops/353975/files/492974959/1500x1500x2/canon-r7.jpg', condition: 'Excellent', brand: 'Canon', category: 'Camera' },
  { name: 'Sony A7R IIIA', oldPrice: 1499, salePrice: 1299, image: 'https://cdn.webshopapp.com/shops/353975/files/492569568/1500x1500x2/sony-sony-a7r-iiia.jpg', condition: 'Good', brand: 'Sony', category: 'Camera' },
  { name: 'Canon EF 50mm F1.4 USM', oldPrice: 199, salePrice: 149, image: 'https://cdn.webshopapp.com/shops/353975/files/492460168/1500x1500x2/canon-canon-ef-50mm-f14-usm.jpg', condition: 'Excellent', brand: 'Canon', category: 'Lens' },
  { name: 'Nikon AF-S 50mm F1.8 G', oldPrice: 159, salePrice: 119, image: 'https://cdn.webshopapp.com/shops/353975/files/493056896/1500x1500x2/nikon-nikon-af-s-50mm-f18-g.jpg', condition: 'Good', brand: 'Nikon', category: 'Lens' },
  { name: 'Sigma 35mm F1.4 DG DN Art', oldPrice: 799, salePrice: 679, image: 'https://cdn.webshopapp.com/shops/353975/files/492881775/1500x1500x2/sigma-sigma-35mm-f14-dg-dn-art-sony-fe.jpg', condition: 'As New', brand: 'Sigma', category: 'Lens' },
  { name: 'Canon Powershot G5x Mark II', oldPrice: 1149, salePrice: 999, image: 'https://cdn.webshopapp.com/shops/353975/files/493056895/1500x1500x2/canon-powershot-g5x-mark-ii.jpg', condition: 'Excellent', brand: 'Canon', category: 'Camera' },
];

const FILTERS = ['All', 'Camera', 'Lens'];

function getDiscountPercent(oldPrice: number, salePrice: number) {
  return Math.round(((oldPrice - salePrice) / oldPrice) * 100);
}

export default function SalePage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? SALE_PRODUCTS
    : SALE_PRODUCTS.filter(p => p.category === activeFilter);

  return (
    <div className="container">
      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1E2133 0%, #2a2d42 50%, #1E2133 100%)',
          color: '#fff',
          borderRadius: 'var(--rl)',
          padding: '48px 40px',
          marginBottom: 40,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,105,42,.08) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -60,
            left: -20,
            width: 260,
            height: 260,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,105,42,.05) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            display: 'inline-block',
            background: '#E8692A',
            color: '#fff',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding: '6px 16px',
            borderRadius: 6,
            marginBottom: 16,
            position: 'relative',
          }}
        >
          Aanbiedingen
        </div>
        <h1
          style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 700,
            marginBottom: 12,
            position: 'relative',
          }}
        >
          Sale
        </h1>
        <p
          style={{
            fontSize: 16,
            color: 'rgba(255,255,255,.7)',
            maxWidth: 560,
            margin: '0 auto',
            lineHeight: 1.6,
            position: 'relative',
          }}
        >
          Scherpe deals op tweedehands camera&apos;s en lenzen. Alle producten zijn
          gecontroleerd, gegraded en worden geleverd met garantie.
        </p>
      </section>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 32,
          flexWrap: 'wrap',
        }}
      >
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              padding: '8px 20px',
              borderRadius: 8,
              border: `1px solid ${activeFilter === f ? '#E8692A' : '#EEEEF2'}`,
              background: activeFilter === f ? '#E8692A' : '#fff',
              color: activeFilter === f ? '#fff' : '#1E2133',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all .15s ease',
            }}
          >
            {f === 'All' ? 'Alles' : f === 'Camera' ? "Camera's" : 'Lenzen'}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div
        className="sale-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 24,
          paddingBottom: 64,
        }}
      >
        <style>{`
          @media (max-width: 1024px) {
            .sale-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media (max-width: 540px) {
            .sale-grid { grid-template-columns: 1fr !important; }
          }
          .sale-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 32px rgba(0,0,0,.10) !important;
          }
        `}</style>
        {filtered.map((product) => {
          const discount = getDiscountPercent(product.oldPrice, product.salePrice);
          return (
            <div
              key={product.name}
              className="sale-card"
              style={{
                background: '#fff',
                borderRadius: 12,
                border: '1px solid #EEEEF2',
                overflow: 'hidden',
                transition: 'transform .2s ease, box-shadow .2s ease',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Image wrapper */}
              <div
                style={{
                  position: 'relative',
                  background: '#fff',
                  aspectRatio: '1 / 1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '80%',
                    height: '80%',
                    objectFit: 'contain',
                  }}
                />
                {/* Sale badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: 12,
                    left: 0,
                    background: '#E8692A',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 13,
                    padding: '6px 14px 6px 10px',
                    borderRadius: '0 6px 6px 0',
                    boxShadow: '0 2px 8px rgba(232,105,42,.3)',
                  }}
                >
                  -{discount}%
                </div>
                {/* Condition badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'rgba(255,255,255,.92)',
                    backdropFilter: 'blur(4px)',
                    color: '#1E2133',
                    fontWeight: 600,
                    fontSize: 11,
                    padding: '4px 10px',
                    borderRadius: 6,
                    border: '1px solid #EEEEF2',
                  }}
                >
                  {product.condition}
                </div>
              </div>

              {/* Info */}
              <div
                style={{
                  padding: '16px 18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#E8692A',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginBottom: 4,
                  }}
                >
                  {product.brand}
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#1E2133',
                    marginBottom: 12,
                    lineHeight: 1.3,
                  }}
                >
                  {product.name}
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: '#1E2133',
                      }}
                    >
                      &euro;{product.salePrice.toLocaleString('nl-NL')}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        color: '#dc2626',
                        textDecoration: 'line-through',
                      }}
                    >
                      &euro;{product.oldPrice.toLocaleString('nl-NL')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

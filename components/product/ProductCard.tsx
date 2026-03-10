'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/data/products';
import { useRecentlyViewed } from '@/context/RecentlyViewedContext';
import { assetPath } from '@/lib/utils';

function formatPrice(price: number): string {
  return price.toLocaleString('nl-NL');
}

export default function ProductCard({
  product,
}: {
  product: Product;
  onQuickView?: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const { isProductViewed } = useRecentlyViewed();
  const recentlyViewed = isProductViewed(product.slug);

  /* Price range from variants */
  const prices = product.variants.map(v => v.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : product.price;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : product.price;
  const hasRange = minPrice !== maxPrice;

  return (
    <div
      style={{
        borderRadius: 12,
        overflow: 'hidden',
        background: '#fff',
        border: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Image Area */}
      <div
        style={{
          position: 'relative',
          background: '#fff',
          aspectRatio: '1',
          overflow: 'hidden',
          cursor: 'pointer',
          borderRadius: '11px 11px 0 0',
          isolation: 'isolate',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={assetPath(product.image)}
          alt={product.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
            padding: '12%',
          }}
        />

        {/* Recently viewed label — top-left, behind orange lines */}
        {recentlyViewed && (
          <div style={{ position: 'absolute', top: 0, left: 0, background: '#fff7ed', padding: '3px 10px 3px 6px', fontSize: 11, fontWeight: 600, color: '#f97316', zIndex: 2 }}>Recently viewed</div>
        )}

        {/* Orange border — continuous curve through corner, fades out */}
        {recentlyViewed && (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '65%', height: '55%',
            borderTop: '2px solid #f97316', borderLeft: '2px solid #f97316',
            borderBottom: 'none', borderRight: 'none',
            borderTopLeftRadius: 11, zIndex: 4, pointerEvents: 'none',
            WebkitMaskImage: 'linear-gradient(to right, black 60%, transparent), linear-gradient(to bottom, black 60%, transparent)',
            WebkitMaskComposite: 'intersect',
            maskImage: 'linear-gradient(to right, black 60%, transparent), linear-gradient(to bottom, black 60%, transparent)',
            maskComposite: 'intersect',
          }} />
        )}

        {/* Badge top-left */}
        {product.badge && product.badge !== 'vat' && (
          <span
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              zIndex: 2,
              background: product.badge === 'sale' ? '#ef4444' : product.badge === 'new' ? '#22c55e' : product.badge === 'outlet' ? '#f97316' : '#6b7280',
              color: '#fff',
              borderRadius: 999,
              padding: '3px 12px',
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {product.badge === 'sale' ? 'Sale' : product.badge === 'new' ? 'New' : product.badge === 'outlet' ? 'OUTLET' : product.badge}
          </span>
        )}

        {/* Hover overlay — links to product page */}
        <Link
          href={`/product/${product.slug}`}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.2s ease',
            pointerEvents: hovered ? 'auto' : 'none',
            textDecoration: 'none',
            zIndex: 5,
          }}
        >
          <span
            style={{
              background: '#f97316',
              color: '#fff',
              border: 'none',
              borderRadius: 999,
              padding: '10px 32px',
              fontSize: 14,
              fontWeight: 600,
              display: 'inline-block',
            }}
          >
            View
          </span>
        </Link>

        {/* Top-right: wishlist heart */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 6,
            zIndex: 2,
          }}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setWishlisted(prev => !prev);
            }}
            aria-label="Wishlist"
            style={{
              background: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            }}
          >
            <svg width="16" height="16" fill={wishlisted ? '#ef4444' : 'none'} stroke={wishlisted ? '#ef4444' : '#888'} strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

        </div>
      </div>

      {/* Info Area */}
      <Link
        href={`/product/${product.slug}`}
        style={{ textDecoration: 'none', color: 'inherit', padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}
      >
        {/* Title */}
        <div style={{ fontSize: 15, fontWeight: 600, color: '#111', lineHeight: 1.3 }}>
          {product.title}
        </div>

        {/* Price range */}
        <div style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>
          <span style={{ fontSize: 13, fontWeight: 400, color: '#6b7280', marginRight: 4 }}>
            From
          </span>
          &euro;{formatPrice(minPrice)}
          {hasRange && (
            <>
              {' '}&ndash; &euro;{formatPrice(maxPrice)}
            </>
          )}
        </div>

        {/* Stock indicator */}
        {product.stock > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            {product.stock <= 2 ? (
              <>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#ef4444' }}>
                  Last {product.stock} in stock!
                </span>
              </>
            ) : product.stock <= 5 ? (
              <>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#f59e0b' }}>
                  Only {product.stock} left
                </span>
              </>
            ) : (
              <>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#6b7280' }}>
                  {product.stock} in stock
                </span>
              </>
            )}
          </div>
        )}
      </Link>
    </div>
  );
}

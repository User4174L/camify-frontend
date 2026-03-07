'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CartItem } from '@/context/CartContext';
import type { Product } from '@/data/products';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';

interface UpsellItem {
  id: string;
  name: string;
  description: string;
  price: number;
}

function getUpsellItems(brand: string): UpsellItem[] {
  const b = brand.toLowerCase();
  if (b === 'nikon') {
    return [
      { id: 'upsell-nikon-battery', name: 'Nikon EN-EL15c Battery', description: 'Original Nikon rechargeable Li-ion battery', price: 59 },
      { id: 'upsell-nikon-card', name: 'Sony CFexpress Type B 128GB', description: 'High-speed memory card for 8K video', price: 149 },
      { id: 'upsell-nikon-adapter', name: 'Nikon FTZ II Mount Adapter', description: 'Use F-mount lenses on Z-mount bodies', price: 219 },
    ];
  }
  if (b === 'canon') {
    return [
      { id: 'upsell-canon-battery', name: 'Canon LP-E6NH Battery', description: 'High-capacity rechargeable battery pack', price: 59 },
      { id: 'upsell-canon-card', name: 'SanDisk CFexpress Type B 128GB', description: 'Professional-grade memory card', price: 149 },
      { id: 'upsell-canon-adapter', name: 'Canon Mount Adapter EF-EOS R', description: 'Use EF/EF-S lenses on RF-mount bodies', price: 99 },
    ];
  }
  if (b === 'sony') {
    return [
      { id: 'upsell-sony-battery', name: 'Sony NP-FZ100 Battery', description: 'Rechargeable battery for Alpha series', price: 59 },
      { id: 'upsell-sony-card', name: 'Sony CFexpress Type A 160GB', description: 'Compact high-speed memory card', price: 189 },
      { id: 'upsell-sony-adapter', name: 'Sony LA-EA5 Mount Adapter', description: 'Use A-mount lenses on E-mount bodies', price: 249 },
    ];
  }
  return [
    { id: 'upsell-default-battery', name: 'Extra Battery', description: 'Compatible replacement battery', price: 49 },
    { id: 'upsell-default-card', name: 'Memory Card 128GB', description: 'High-speed SD memory card', price: 99 },
    { id: 'upsell-default-bag', name: 'Camera Bag', description: 'Padded shoulder bag for your camera', price: 79 },
  ];
}

function formatPrice(price: number): string {
  return price.toLocaleString('nl-NL');
}

export default function UpsellPopup({
  item,
  product,
  onClose,
  onViewCart,
}: {
  item: CartItem;
  product: Product;
  onClose: () => void;
  onViewCart: () => void;
}) {
  const { addItem } = useCart();
  const [addedUpsells, setAddedUpsells] = useState<Set<string>>(new Set());

  const upsellItems = getUpsellItems(product.brand);

  // "You might also like" - products from same category, different brand if possible
  const sameCategory = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  );
  const differentBrand = sameCategory.filter((p) => p.brand !== product.brand);
  const alsoLikePool = differentBrand.length >= 3 ? differentBrand : sameCategory;
  const alsoLike = alsoLikePool.slice(0, 3);

  const handleAddUpsell = (upsell: UpsellItem) => {
    addItem({
      id: upsell.id,
      sku: upsell.id,
      name: upsell.name,
      price: upsell.price,
      condition: 'New',
      image: '',
      inclVat: true,
    });
    setAddedUpsells((prev) => new Set(prev).add(upsell.id));
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          width: '100%',
          maxWidth: 520,
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid #e5e7eb' }}>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#111' }}>Added to your cart</span>
          </div>

          <div style={{ fontSize: 14, color: '#374151' }}>
            {product.title} &mdash; &euro; {formatPrice(item.price)}
          </div>
        </div>

        {/* Complete Your Setup */}
        <div style={{ padding: '20px 24px' }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#9ca3af',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            Complete your setup
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {upsellItems.map((upsell) => {
              const isAdded = addedUpsells.has(upsell.id);
              return (
                <div
                  key={upsell.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: 10,
                  }}
                >
                  {/* Placeholder thumbnail */}
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      background: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{upsell.name}</div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 1 }}>{upsell.description}</div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 4 }}>
                      &euro; {formatPrice(upsell.price)}
                    </div>
                    <button
                      onClick={() => handleAddUpsell(upsell)}
                      disabled={isAdded}
                      style={{
                        background: isAdded ? '#dcfce7' : '#fff',
                        color: isAdded ? '#16a34a' : '#f97316',
                        border: isAdded ? '1px solid #16a34a' : '1px solid #f97316',
                        borderRadius: 999,
                        padding: '4px 14px',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: isAdded ? 'default' : 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {isAdded ? 'Added' : '+ Add'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* You Might Also Like */}
        {alsoLike.length > 0 && (
          <div style={{ padding: '4px 24px 20px' }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#9ca3af',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 14,
              }}
            >
              You might also like
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {alsoLike.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  onClick={onClose}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: 10,
                      overflow: 'hidden',
                      background: '#fff',
                    }}
                  >
                    <div
                      style={{
                        background: '#f3f4f6',
                        aspectRatio: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 8,
                      }}
                    >
                      <img
                        src={p.image}
                        alt={p.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </div>
                    <div style={{ padding: '8px 10px 10px' }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#111',
                          lineHeight: 1.3,
                          marginBottom: 4,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {p.title}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#f97316' }}>
                        {p.fromPrice && 'from '}
                        &euro; {formatPrice(p.price)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Bottom actions */}
        <div style={{ padding: '0 24px 24px' }}>
          <button
            onClick={onViewCart}
            style={{
              width: '100%',
              padding: '14px 24px',
              borderRadius: 999,
              border: 'none',
              background: '#f97316',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            View cart
          </button>

          <button
            onClick={onClose}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              padding: '12px 0 0',
              fontSize: 14,
              color: '#6b7280',
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  );
}

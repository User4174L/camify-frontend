'use client';

import { useState } from 'react';
import type { CartItem } from '@/context/CartContext';
import type { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';

interface UpsellItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

function getUpsellItems(brand: string): UpsellItem[] {
  const b = brand.toLowerCase();
  if (b === 'nikon') {
    return [
      { id: 'upsell-900001', name: 'Nikon EN-EL15c Battery', description: 'Original Nikon rechargeable Li-ion battery', price: 59, image: '/images/upsell-battery.png' },
      { id: 'upsell-900002', name: 'Sony CFexpress Type B 128GB', description: 'High-speed memory card for 8K video', price: 149, image: '/images/upsell-sd-card.png' },
      { id: 'upsell-900003', name: 'Nikon FTZ II Mount Adapter', description: 'Use F-mount lenses on Z-mount bodies', price: 219, image: '/images/upsell-adapter.png' },
    ];
  }
  if (b === 'canon') {
    return [
      { id: 'upsell-900004', name: 'Canon LP-E6NH Battery', description: 'High-capacity rechargeable battery pack', price: 59, image: '/images/upsell-battery.png' },
      { id: 'upsell-900005', name: 'SanDisk CFexpress Type B 128GB', description: 'Professional-grade memory card', price: 149, image: '/images/upsell-sd-card.png' },
      { id: 'upsell-900006', name: 'Canon Mount Adapter EF-EOS R', description: 'Use EF/EF-S lenses on RF-mount bodies', price: 99, image: '/images/upsell-adapter.png' },
    ];
  }
  if (b === 'sony') {
    return [
      { id: 'upsell-900007', name: 'Sony NP-FZ100 Battery', description: 'Rechargeable battery for Alpha series', price: 59, image: '/images/upsell-battery.png' },
      { id: 'upsell-900008', name: 'Sony CFexpress Type A 160GB', description: 'Compact high-speed memory card', price: 189, image: '/images/upsell-sd-card.png' },
      { id: 'upsell-900009', name: 'Sony LA-EA5 Mount Adapter', description: 'Use A-mount lenses on E-mount bodies', price: 249, image: '/images/upsell-adapter.png' },
    ];
  }
  return [
    { id: 'upsell-900010', name: 'Extra Battery', description: 'Compatible replacement battery', price: 49, image: '/images/upsell-battery.png' },
    { id: 'upsell-900011', name: 'Memory Card 128GB', description: 'High-speed SD memory card', price: 99, image: '/images/upsell-sd-card.png' },
    { id: 'upsell-900012', name: 'Camera Bag', description: 'Padded shoulder bag for your camera', price: 79, image: '/images/upsell-adapter.png' },
  ];
}

function getUpsellIcon(name: string): { bg: string; icon: React.ReactNode } {
  const n = name.toLowerCase();
  if (n.includes('battery') || n.includes('accu')) {
    return {
      bg: '#fff7ed',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="4" width="12" height="18" rx="2" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
          <line x1="10" y1="11" x2="14" y2="11" />
          <line x1="12" y1="9" x2="12" y2="13" />
        </svg>
      ),
    };
  }
  if (n.includes('memory') || n.includes('cfexpress') || n.includes('sd ') || n.includes('card')) {
    return {
      bg: '#eff6ff',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2h8l4 4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
          <line x1="8" y1="6" x2="8" y2="10" />
          <line x1="11" y1="6" x2="11" y2="10" />
          <line x1="14" y1="6" x2="14" y2="8" />
        </svg>
      ),
    };
  }
  if (n.includes('adapter') || n.includes('mount')) {
    return {
      bg: '#f5f3ff',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
    };
  }
  if (n.includes('bag') || n.includes('case') || n.includes('tas')) {
    return {
      bg: '#f0fdf4',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      ),
    };
  }
  // Fallback
  return {
    bg: '#f3f4f6',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
    ),
  };
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
                  {/* Product thumbnail */}
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 8,
                      background: '#f9fafb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      overflow: 'hidden',
                      border: '1px solid #f3f4f6',
                    }}
                  >
                    <img
                      src={upsell.image}
                      alt={upsell.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: 4,
                      }}
                    />
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
                        color: isAdded ? '#16a34a' : '#E8692A',
                        border: isAdded ? '1px solid #16a34a' : '1px solid #E8692A',
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

        {/* Bottom actions */}
        <div style={{ padding: '0 24px 24px' }}>
          <button
            onClick={onViewCart}
            style={{
              width: '100%',
              padding: '14px 24px',
              borderRadius: 999,
              border: 'none',
              background: '#E8692A',
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

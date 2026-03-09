'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/data/products';

function getConditionDescription(conditionLabel: string, shutterCount?: number): string {
  let base = '';
  switch (conditionLabel) {
    case 'As New':
      base = 'Camera is in near-perfect condition. No visible marks or scratches.';
      break;
    case 'Excellent':
      base = 'Minimal signs of use. Very light wear marks, fully functional.';
      break;
    case 'Good':
      base = 'Light wear visible. Some minor marks but fully functional.';
      break;
    case 'Used':
      base = 'Visible signs of use. Cosmetic wear but mechanically sound.';
      break;
    default:
      base = 'Fully functional.';
  }
  if (shutterCount) {
    base += ` Shutter count: ${shutterCount.toLocaleString('nl-NL')}.`;
  }
  return base;
}

function getConditionColor(condition: string): string {
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

function formatPrice(price: number): string {
  return price.toLocaleString('nl-NL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function QuickView({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { addItem } = useCart();
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const THUMB_COUNT = 6;

  useEffect(() => {
    setCurrentImage(0);
    setSelectedVariantIndex(0);
  }, [product]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (product) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [product, onClose]);

  if (!product || product.variants.length === 0) return null;

  const variant = product.variants[selectedVariantIndex];
  const thumbnails = Array.from({ length: THUMB_COUNT }, () => product.image);

  const prevImage = () => setCurrentImage(i => (i - 1 + THUMB_COUNT) % THUMB_COUNT);
  const nextImage = () => setCurrentImage(i => (i + 1) % THUMB_COUNT);

  return (
    <div
      className="qv-modal-bg is-open"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: '#fff',
          borderRadius: 16,
          overflow: 'hidden',
          maxWidth: 960,
          width: '95vw',
          maxHeight: '90vh',
          boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
          position: 'relative',
        }}
      >
        {/* Left column - Gallery */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Main image */}
          <div
            style={{
              position: 'relative',
              background: '#fff',
              borderRadius: 12,
              aspectRatio: '1 / 1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <img
              src={thumbnails[currentImage]}
              alt={product.title}
              style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }}
            />

            {/* Prev button */}
            <button
              onClick={prevImage}
              aria-label="Previous image"
              style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: '1px solid #ddd',
                background: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                color: '#333',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>

            {/* Next button */}
            <button
              onClick={nextImage}
              aria-label="Next image"
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: '1px solid #ddd',
                background: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                color: '#333',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>

            {/* Image counter */}
            <div
              style={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                background: 'rgba(0,0,0,0.55)',
                color: '#fff',
                fontSize: 12,
                fontWeight: 500,
                padding: '3px 10px',
                borderRadius: 12,
              }}
            >
              {currentImage + 1} / {THUMB_COUNT}
            </div>
          </div>

          {/* Thumbnails row */}
          <div style={{ display: 'flex', gap: 8 }}>
            {thumbnails.map((src, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                style={{
                  flex: 1,
                  aspectRatio: '1 / 1',
                  borderRadius: 8,
                  border: idx === currentImage ? '2px solid #f97316' : '2px solid #e5e7eb',
                  background: '#fff',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={src}
                  alt={`${product.title} thumbnail ${idx + 1}`}
                  style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right column - Details */}
        <div
          style={{
            padding: '32px 28px 24px',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            position: 'relative',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: 'none',
              background: '#f3f4f6',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>

          {/* SKU */}
          <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>SKU: {variant.sku}</div>

          {/* Title */}
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px', lineHeight: 1.2, color: '#111' }}>
            {product.title}
          </h2>

          {/* Price */}
          <div style={{ fontSize: 26, fontWeight: 700, color: '#111', marginBottom: 16 }}>
            &euro;{formatPrice(variant.price)}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: '#e5e7eb', marginBottom: 16 }} />

          {/* Variant selector */}
          {product.variants.length > 1 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: 10 }}>
                Choose Variant
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {product.variants.map((v, idx) => (
                  <button
                    key={v.sku}
                    onClick={() => setSelectedVariantIndex(idx)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 10,
                      border: idx === selectedVariantIndex ? '2px solid #f97316' : '1px solid #d1d5db',
                      background: idx === selectedVariantIndex ? '#fff7ed' : '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: 2,
                      minWidth: 0,
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{v.conditionLabel}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#f97316' }}>&euro;{formatPrice(v.price)}</span>
                  </button>
                ))}
              </div>
              {/* Divider */}
              <div style={{ height: 1, background: '#e5e7eb', marginBottom: 16 }} />
            </>
          )}

          {/* Condition section */}
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: 10 }}>
            Condition
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            {/* Condition badge */}
            <span
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                color: getConditionColor(variant.condition),
                background: (() => {
                  const c = variant.condition;
                  if (c === 'as-new' || c === 'excellent') return '#dcfce7';
                  if (c === 'good') return '#fef9c3';
                  if (c === 'used') return '#fefce8';
                  return '#f3f4f6';
                })(),
              }}
            >
              {variant.conditionLabel}
            </span>
          </div>
          <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5, margin: '0 0 16px' }}>
            {getConditionDescription(variant.conditionLabel, variant.shutterCount)}
          </p>

          {/* Divider */}
          <div style={{ height: 1, background: '#e5e7eb', marginBottom: 16 }} />

          {/* Included Accessories */}
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: 10 }}>
            Included Accessories
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {variant.accessories && variant.accessories.length > 0 ? (
              variant.accessories.map(a => (
                <span
                  key={a}
                  style={{
                    display: 'inline-block',
                    padding: '5px 14px',
                    borderRadius: 999,
                    fontSize: 13,
                    border: '1px solid #d1d5db',
                    color: '#374151',
                    background: '#fff',
                  }}
                >
                  {a}
                </span>
              ))
            ) : (
              <span style={{ fontSize: 13, color: '#9ca3af' }}>No accessories included</span>
            )}
          </div>

          {/* Spacer to push actions to bottom */}
          <div style={{ flex: 1 }} />

          {/* Add to Cart button */}
          <button
            onClick={() => {
              addItem({
                id: variant.sku,
                sku: variant.sku,
                name: product.title,
                price: variant.price,
                condition: variant.conditionLabel,
                image: product.image,
                inclVat: variant.inclVat ?? true,
              }, product);
              onClose();
            }}
            style={{
              width: '100%',
              padding: '14px 24px',
              borderRadius: 999,
              border: 'none',
              background: '#f97316',
              color: '#fff',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#ea580c')}
            onMouseLeave={e => (e.currentTarget.style.background = '#f97316')}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            Add to Cart
          </button>

          {/* View full product page link */}
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <a
              href={`/product/${product.slug}/${variant.sku}`}
              style={{
                fontSize: 14,
                color: '#6b7280',
                textDecoration: 'none',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f97316')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
            >
              View full product page &rarr;
            </a>
          </div>

          {/* USP strip */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
              marginTop: 20,
              paddingTop: 16,
              borderTop: '1px solid #e5e7eb',
              fontSize: 12,
              color: '#6b7280',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              12 Mo. Warranty
            </span>
            <span style={{ color: '#d1d5db' }}>&middot;</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9"/><polyline points="3 3 3 12 9 12"/></svg>
              14-Day Returns (online)
            </span>
            <span style={{ color: '#d1d5db' }}>&middot;</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
              Checked
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

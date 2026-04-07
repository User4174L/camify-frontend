'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/data/products';
import { assetPath, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, ChevronRight, X, Shield, RotateCcw, CheckCircle2, ShoppingBag } from 'lucide-react';

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

const conditionStyles: Record<string, string> = {
  'as-new': 'bg-emerald-100 text-emerald-700',
  excellent: 'bg-emerald-100 text-emerald-600',
  good: 'bg-yellow-100 text-yellow-700',
  used: 'bg-amber-100 text-amber-700',
};

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
  const thumbnails = Array.from({ length: THUMB_COUNT }, () => assetPath(product.image));

  const prevImage = () => setCurrentImage(i => (i - 1 + THUMB_COUNT) % THUMB_COUNT);
  const nextImage = () => setCurrentImage(i => (i + 1) % THUMB_COUNT);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative grid max-h-[90vh] w-[95vw] max-w-[960px] grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-2xl md:grid-cols-2"
      >
        {/* Left column - Gallery */}
        <div className="flex flex-col gap-3 p-6">
          {/* Main image */}
          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-white">
            <img
              src={thumbnails[currentImage]}
              alt={product.title}
              className="max-h-[80%] max-w-[80%] object-contain"
            />

            <button
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-lg"
            >
              <ChevronLeft className="h-4 w-4 text-gray-700" />
            </button>

            <button
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-lg"
            >
              <ChevronRight className="h-4 w-4 text-gray-700" />
            </button>

            <div className="absolute bottom-2.5 right-2.5 rounded-full bg-black/55 px-2.5 py-0.5 text-xs font-medium text-white">
              {currentImage + 1} / {THUMB_COUNT}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2">
            {thumbnails.map((src, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={cn(
                  'flex flex-1 items-center justify-center overflow-hidden rounded-lg border-2 bg-white p-1 transition-colors',
                  idx === currentImage ? 'border-[#E8692A]' : 'border-gray-200 hover:border-gray-300'
                )}
                style={{ aspectRatio: '1 / 1' }}
              >
                <img
                  src={src}
                  alt={`${product.title} thumbnail ${idx + 1}`}
                  className="max-h-[80%] max-w-[80%] object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right column - Details */}
        <div className="relative flex flex-col overflow-y-auto px-7 pb-6 pt-8">
          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="mb-1 text-xs text-gray-400">SKU: {variant.sku}</div>
          <h2 className="mb-2 text-2xl font-bold leading-tight text-gray-900">{product.title}</h2>
          <div className="mb-4 text-[26px] font-bold text-gray-900">&euro;{formatPrice(variant.price)}</div>

          <Separator className="mb-4" />

          {/* Variant selector */}
          {product.variants.length > 1 && (
            <>
              <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Choose Variant
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                {product.variants.map((v, idx) => (
                  <button
                    key={v.sku}
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={cn(
                      'flex flex-col items-start gap-0.5 rounded-[10px] px-3.5 py-2 transition-colors',
                      idx === selectedVariantIndex
                        ? 'border-2 border-[#E8692A] bg-orange-50'
                        : 'border border-gray-300 bg-white hover:border-gray-400'
                    )}
                  >
                    <span className="text-[13px] font-semibold text-gray-900">{v.conditionLabel}</span>
                    <span className="text-[13px] font-bold text-[#E8692A]">&euro;{formatPrice(v.price)}</span>
                  </button>
                ))}
              </div>
              <Separator className="mb-4" />
            </>
          )}

          {/* Condition */}
          <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Condition
          </div>
          <div className="mb-2 flex items-center gap-2.5">
            <Badge className={cn('rounded-full text-[13px] font-semibold', conditionStyles[variant.condition] || 'bg-gray-100 text-gray-500')}>
              {variant.conditionLabel}
            </Badge>
          </div>
          <p className="mb-4 text-[13px] leading-relaxed text-gray-500">
            {getConditionDescription(variant.conditionLabel, variant.shutterCount)}
          </p>

          <Separator className="mb-4" />

          {/* Accessories */}
          <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Included Accessories
          </div>
          <div className="mb-6 flex flex-wrap gap-2">
            {variant.accessories && variant.accessories.length > 0 ? (
              variant.accessories.map(a => (
                <span key={a} className="inline-block rounded-full border border-gray-300 bg-white px-3.5 py-1 text-[13px] text-gray-700">
                  {a}
                </span>
              ))
            ) : (
              <span className="text-[13px] text-gray-400">No accessories included</span>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Add to Cart */}
          <Button
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
            className="w-full rounded-full bg-[#E8692A] py-6 text-base font-semibold text-white transition-colors hover:bg-[#D15A20]"
          >
            <ShoppingBag className="mr-2 h-[18px] w-[18px]" />
            Add to Cart
          </Button>

          {/* View full page link */}
          <div className="mt-3 text-center">
            <a
              href={`/product/${product.slug}/${variant.sku}`}
              className="text-sm text-gray-500 transition-colors hover:text-[#E8692A]"
            >
              View full product page &rarr;
            </a>
          </div>

          {/* USP strip */}
          <div className="mt-5 flex justify-center gap-4 border-t border-gray-200 pt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" />
              12 Mo. Warranty
            </span>
            <span className="text-gray-300">&middot;</span>
            <span className="flex items-center gap-1">
              <RotateCcw className="h-3.5 w-3.5" />
              14-Day Returns
            </span>
            <span className="text-gray-300">&middot;</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Checked
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

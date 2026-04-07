'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/data/products';
import { useRecentlyViewed } from '@/context/RecentlyViewedContext';
import { assetPath } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

function formatPrice(price: number): string {
  return price.toLocaleString('nl-NL');
}

const badgeConfig: Record<string, { label: string; className: string }> = {
  sale: { label: 'Sale', className: 'bg-red-500 text-white hover:bg-red-500' },
  new: { label: 'New', className: 'bg-emerald-500 text-white hover:bg-emerald-500' },
  outlet: { label: 'Outlet', className: 'bg-orange-500 text-white hover:bg-orange-500' },
};

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

  const prices = product.variants.map(v => v.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : product.price;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : product.price;
  const hasRange = minPrice !== maxPrice;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      {/* Image Area */}
      <div
        className="relative aspect-square cursor-pointer overflow-hidden rounded-t-[11px] bg-white isolate"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={assetPath(product.image)}
          alt={product.title}
          className="block h-full w-full object-contain p-[12%]"
        />

        {/* Recently viewed label */}
        {recentlyViewed && (
          <div className="absolute left-0 top-0 z-2 bg-orange-50 px-2.5 py-0.5 text-[11px] font-semibold text-orange-500">
            Recently viewed
          </div>
        )}

        {/* Orange border for recently viewed */}
        {recentlyViewed && (
          <div
            className="pointer-events-none absolute left-0 top-0 z-4 h-[55%] w-[65%] rounded-tl-[11px] border-l-2 border-t-2 border-orange-500"
            style={{
              WebkitMaskImage: 'linear-gradient(to right, black 60%, transparent), linear-gradient(to bottom, black 60%, transparent)',
              WebkitMaskComposite: 'intersect',
              maskImage: 'linear-gradient(to right, black 60%, transparent), linear-gradient(to bottom, black 60%, transparent)',
              maskComposite: 'intersect',
            }}
          />
        )}

        {/* Badge */}
        {product.badge && product.badge !== 'vat' && badgeConfig[product.badge] && (
          <Badge className={`absolute left-2.5 top-2.5 z-2 rounded-full text-[11px] font-semibold ${badgeConfig[product.badge].className}`}>
            {badgeConfig[product.badge].label}
          </Badge>
        )}

        {/* Hover overlay */}
        <Link
          href={`/product/${product.slug}`}
          className={`absolute inset-0 z-5 flex items-center justify-center bg-black/55 transition-opacity duration-200 ${
            hovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <span className="inline-block rounded-full bg-[#E8692A] px-8 py-2.5 text-sm font-semibold text-white">
            View
          </span>
        </Link>

        {/* Wishlist heart */}
        <div className="absolute right-2 top-2 z-2 flex flex-col items-end gap-1.5">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setWishlisted(prev => !prev);
            }}
            aria-label="Wishlist"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition-transform hover:scale-110"
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
        className="flex flex-col gap-1 p-3 pb-3.5 no-underline text-inherit"
      >
        <div className="text-[15px] font-semibold leading-tight text-gray-900">
          {product.title}
        </div>

        <div className="flex items-baseline gap-1 text-base font-bold text-gray-900">
          <span className="text-[13px] font-normal text-gray-500">From</span>
          <span>&euro;{formatPrice(minPrice)}{hasRange && <>{' '}&ndash; &euro;{formatPrice(maxPrice)}</>}</span>
        </div>

        {/* Stock indicator */}
        {product.stock > 0 && (
          <div className="mt-0.5 flex items-center gap-1.5">
            {product.stock <= 2 ? (
              <>
                <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-red-500" />
                <span className="text-[13px] font-semibold text-red-500">
                  Last {product.stock} in stock!
                </span>
              </>
            ) : product.stock <= 5 ? (
              <>
                <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                <span className="text-[13px] font-semibold text-amber-500">
                  Only {product.stock} left
                </span>
              </>
            ) : (
              <>
                <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                <span className="text-[13px] text-gray-500">
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

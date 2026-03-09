'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

const MAX_ITEMS = 20;
const LS_PRODUCTS_KEY = 'camify_viewed_products';
const LS_VARIANTS_KEY = 'camify_viewed_variants';

interface RecentlyViewedContextValue {
  markProductViewed: (slug: string) => void;
  markVariantViewed: (sku: string) => void;
  isProductViewed: (slug: string) => boolean;
  isVariantViewed: (sku: string) => boolean;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextValue | null>(null);

function readFromStorage(key: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeToStorage(key: string, items: string[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // localStorage may be full or unavailable
  }
}

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [viewedProducts, setViewedProducts] = useState<string[]>([]);
  const [viewedVariants, setViewedVariants] = useState<string[]>([]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setViewedProducts(readFromStorage(LS_PRODUCTS_KEY));
    setViewedVariants(readFromStorage(LS_VARIANTS_KEY));
  }, []);

  const markProductViewed = useCallback((slug: string) => {
    setViewedProducts(prev => {
      const filtered = prev.filter(s => s !== slug);
      const next = [slug, ...filtered].slice(0, MAX_ITEMS);
      writeToStorage(LS_PRODUCTS_KEY, next);
      return next;
    });
  }, []);

  const markVariantViewed = useCallback((sku: string) => {
    setViewedVariants(prev => {
      const filtered = prev.filter(s => s !== sku);
      const next = [sku, ...filtered].slice(0, MAX_ITEMS);
      writeToStorage(LS_VARIANTS_KEY, next);
      return next;
    });
  }, []);

  const isProductViewed = useCallback(
    (slug: string) => viewedProducts.includes(slug),
    [viewedProducts],
  );

  const isVariantViewed = useCallback(
    (sku: string) => viewedVariants.includes(sku),
    [viewedVariants],
  );

  return (
    <RecentlyViewedContext.Provider value={{ markProductViewed, markVariantViewed, isProductViewed, isVariantViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed(): RecentlyViewedContextValue {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return ctx;
}

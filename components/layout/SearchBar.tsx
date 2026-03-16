'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { searchProducts, searchBlogPosts, products } from '@/data/products';
import { assetPath } from '@/lib/utils';

const popularSearches = ['Sony A1', 'Nikon Z8', 'Canon R5 II', 'Canon 70-200mm 2.8', 'Leica M11', 'Sony 24-70mm GM', 'Hasselblad', 'DJI Mavic'];

function conditionColor(condition: string): string {
  switch (condition) {
    case 'as-new': return '#059669';
    case 'excellent': return '#16a34a';
    case 'good': return '#65a30d';
    case 'used': return '#ca8a04';
    default: return '#6b7280';
  }
}

interface VariantResult {
  productSlug: string;
  productTitle: string;
  productImage: string;
  sku: string;
  price: number;
  condition: string;
  conditionLabel: string;
  shutterCount?: number;
}

function getPriceRange(slug: string): { min: number; max: number } | null {
  const product = products.find(p => p.slug === slug);
  if (!product || product.variants.length === 0) return null;
  const prices = product.variants.map(v => v.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

function useSearch(query: string) {
  const q = query.toLowerCase().trim();

  const matchingProducts = q.length > 0
    ? searchProducts.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.keywords.some(k => k.includes(q))
      )
    : [];

  const filteredProducts = matchingProducts.filter(p => p.stock !== 'Out of stock').slice(0, 4);
  const filteredOos = matchingProducts.filter(p => p.stock === 'Out of stock').slice(0, 3);

  const filteredVariants: VariantResult[] = q.length > 0
    ? products.flatMap(p =>
        p.variants
          .filter(v =>
            v.sku.includes(q) ||
            p.title.toLowerCase().includes(q) ||
            p.slug.includes(q)
          )
          .map(v => ({
            productSlug: p.slug,
            productTitle: p.title,
            productImage: p.image,
            sku: v.sku,
            price: v.price,
            condition: v.condition,
            conditionLabel: v.conditionLabel,
            shutterCount: v.shutterCount,
          }))
      ).slice(0, 5)
    : [];

  const filteredBlog = q.length > 0
    ? searchBlogPosts.filter(b => b.title.toLowerCase().includes(q)).slice(0, 2)
    : [];

  const hasResults = filteredProducts.length > 0 || filteredOos.length > 0 || filteredVariants.length > 0 || filteredBlog.length > 0;

  return { filteredProducts, filteredOos, filteredVariants, filteredBlog, hasResults };
}

function SearchDropdown({
  query,
  setQuery,
  setIsOpen,
  filteredProducts,
  filteredOos,
  filteredVariants,
  filteredBlog,
  hasResults,
}: {
  query: string;
  setQuery: (q: string) => void;
  setIsOpen: (v: boolean) => void;
  filteredProducts: ReturnType<typeof useSearch>['filteredProducts'];
  filteredOos: ReturnType<typeof useSearch>['filteredOos'];
  filteredVariants: VariantResult[];
  filteredBlog: ReturnType<typeof useSearch>['filteredBlog'];
  hasResults: boolean;
}) {
  if (query.length === 0) {
    return (
      <div className="search-dd__popular">
        <div className="search-dd__popular-title">Popular Searches</div>
        <div className="search-dd__tags">
          {popularSearches.map(s => (
            <span key={s} className="search-dd__tag" onClick={() => setQuery(s)}>{s}</span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 1. Products (in stock) */}
      {filteredProducts.length > 0 && (
        <div className="search-dd__section">
          <div className="search-dd__section-title">Products</div>
          {filteredProducts.map(p => {
            const range = getPriceRange(p.slug);
            return (
              <Link key={p.slug} href={`/product/${p.slug}`} className="search-dd__item" onClick={() => setIsOpen(false)}>
                <div className="search-dd__thumb">
                  <img src={assetPath(p.image)} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div className="search-dd__info">
                  <div className="search-dd__title">{p.title}</div>
                  <div className="search-dd__meta" style={{ color: '#16a34a' }}>{p.stock}</div>
                </div>
                {range && (
                  <div className="search-dd__price" style={{ textAlign: 'right', lineHeight: 1.3 }}>
                    {range.min === range.max
                      ? <>&euro;{range.min.toLocaleString('nl-NL')}</>
                      : <>&euro;{range.min.toLocaleString('nl-NL')} – &euro;{range.max.toLocaleString('nl-NL')}</>
                    }
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {/* 2. Variants */}
      {filteredVariants.length > 0 && (
        <>
          {filteredProducts.length > 0 && <div className="search-dd__divider" />}
          <div className="search-dd__section">
            <div className="search-dd__section-title">Variants</div>
            {filteredVariants.map(v => (
              <Link
                key={v.sku}
                href={`/product/${v.productSlug}/${v.sku}`}
                className="search-dd__item"
                onClick={() => setIsOpen(false)}
              >
                <div className="search-dd__thumb">
                  <img src={assetPath(v.productImage)} alt={v.productTitle} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div className="search-dd__info">
                  <div className="search-dd__title">{v.productTitle}</div>
                  <div className="search-dd__meta" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#6b7280' }}>#{v.sku}</span>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                    }}>
                      <span style={{
                        display: 'inline-block', width: 7, height: 7,
                        borderRadius: '50%', background: conditionColor(v.condition), flexShrink: 0,
                      }} />
                      {v.conditionLabel}
                    </span>
                    {v.shutterCount != null && (
                      <span style={{ color: '#9ca3af' }}>{v.shutterCount.toLocaleString('nl-NL')} clicks</span>
                    )}
                  </div>
                </div>
                <div className="search-dd__price">&euro;{v.price.toLocaleString('nl-NL')}</div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* 3. Out of stock */}
      {filteredOos.length > 0 && (
        <>
          {(filteredProducts.length > 0 || filteredVariants.length > 0) && <div className="search-dd__divider" />}
          <div className="search-dd__section">
            <div className="search-dd__section-title" style={{ color: '#9ca3af' }}>Out of stock</div>
            {filteredOos.map(p => (
              <Link key={p.slug} href={`/product/${p.slug}`} className="search-dd__item" onClick={() => setIsOpen(false)}>
                <div className="search-dd__thumb" style={{ opacity: 0.4 }}>
                  <img src={assetPath(p.image)} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'grayscale(100%)' }} />
                </div>
                <div className="search-dd__info" style={{ opacity: 0.5 }}>
                  <div className="search-dd__title">{p.title}</div>
                  <div className="search-dd__meta" style={{ color: '#9ca3af' }}>Out of stock</div>
                </div>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#fff',
                  background: '#E8692A',
                  padding: '4px 10px',
                  borderRadius: 4,
                  whiteSpace: 'nowrap',
                  alignSelf: 'center',
                  flexShrink: 0,
                }}>Notify</span>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* 4. Blog / News */}
      {filteredBlog.length > 0 && (
        <>
          {(filteredProducts.length > 0 || filteredVariants.length > 0 || filteredOos.length > 0) && <div className="search-dd__divider" />}
          <div className="search-dd__section">
            <div className="search-dd__section-title">From the Blog</div>
            {filteredBlog.map(b => (
              <Link key={b.slug} href={`/blog/${b.slug}`} className="search-dd__item" onClick={() => setIsOpen(false)}>
                <div className="search-dd__thumb" style={{ background: '#1E2133', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </div>
                <div className="search-dd__info">
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#E8692A', textTransform: 'uppercase', letterSpacing: '.04em' }}>{b.tag}</div>
                  <div className="search-dd__title">{b.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {!hasResults && (
        <div style={{ padding: '24px 20px', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
          No results for &ldquo;{query}&rdquo;
        </div>
      )}

      {hasResults && (
        <Link href={`/search?q=${encodeURIComponent(query)}`} className="search-dd__all" onClick={() => setIsOpen(false)}>
          See all results for &ldquo;{query}&rdquo;
        </Link>
      )}
    </>
  );
}

export default function SearchBar({ mobile = false }: { mobile?: boolean }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const { filteredProducts, filteredOos, filteredVariants, filteredBlog, hasResults } = useSearch(query);

  if (mobile) {
    return (
      <div className="header__mobile-search" ref={wrapRef}>
        <div className="header__mobile-search-row">
          <Link href="/brands" className="header__mobile-brands">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            Brands
          </Link>
          <div className="header__mobile-search-input">
            <input
              type="text"
              placeholder="Search cameras, lenses, accessories..."
              autoComplete="off"
              value={query}
              onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
              onFocus={() => setIsOpen(true)}
            />
            <button className="search-bar__btn" aria-label="Search">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
          </div>
        </div>
        <div className={`search-dd search-dd--mobile${isOpen ? ' is-open' : ''}`}>
          <SearchDropdown
            query={query}
            setQuery={setQuery}
            setIsOpen={setIsOpen}
            filteredProducts={filteredProducts}
            filteredOos={filteredOos}
            filteredVariants={filteredVariants}
            filteredBlog={filteredBlog}
            hasResults={hasResults}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="search-bar" ref={wrapRef}>
      <input
        type="text"
        placeholder="Search for cameras, lenses, accessories..."
        autoComplete="off"
        value={query}
        onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
        onFocus={() => setIsOpen(true)}
      />
      <button className="search-bar__btn" aria-label="Search">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      </button>

      <div className={`search-dd${isOpen ? ' is-open' : ''}`}>
        <SearchDropdown
          query={query}
          setQuery={setQuery}
          setIsOpen={setIsOpen}
          filteredProducts={filteredProducts}
          filteredOos={filteredOos}
          filteredVariants={filteredVariants}
          filteredBlog={filteredBlog}
          hasResults={hasResults}
        />
      </div>
    </div>
  );
}

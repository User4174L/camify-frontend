'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { searchProducts, searchBlogPosts } from '@/data/products';

const popularSearches = ['Sony A1', 'Nikon Z8', 'Canon R5 II', 'Canon 70-200mm 2.8', 'Leica M11', 'Sony 24-70mm GM', 'Hasselblad', 'DJI Mavic'];

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

  const filteredProducts = query.length > 0
    ? searchProducts.filter(p => p.keywords.some(k => k.includes(query.toLowerCase()))).slice(0, 4)
    : [];

  const filteredBlog = query.length > 0
    ? searchBlogPosts.filter(b => b.title.toLowerCase().includes(query.toLowerCase())).slice(0, 1)
    : [];

  if (mobile) {
    return (
      <div className="header__mobile-search">
        <div className="header__mobile-search-row">
          <div className="header__mobile-search-input">
            <input
              type="text"
              placeholder="Search cameras, lenses, accessories..."
              autoComplete="off"
            />
            <button className="search-bar__btn" aria-label="Search">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
          </div>
          <Link href="/brands" className="header__mobile-brands">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            Brands
          </Link>
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
        {query.length === 0 ? (
          <div className="search-dd__popular">
            <div className="search-dd__popular-title">Popular Searches</div>
            <div className="search-dd__tags">
              {popularSearches.map(s => (
                <span key={s} className="search-dd__tag" onClick={() => { setQuery(s); }}>{s}</span>
              ))}
            </div>
          </div>
        ) : (
          <>
            {filteredProducts.length > 0 && (
              <div className="search-dd__section">
                <div className="search-dd__section-title">Products</div>
                {filteredProducts.map(p => (
                  <Link key={p.slug} href={`/product/${p.slug}`} className="search-dd__item" onClick={() => setIsOpen(false)}>
                    <div className="search-dd__thumb">
                      <img src="/images/placeholder-camera.svg" alt={p.title} />
                    </div>
                    <div className="search-dd__info">
                      <div className="search-dd__title">{p.title}</div>
                      <div className="search-dd__meta">{p.stock} available</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {filteredBlog.length > 0 && (
              <>
                <div className="search-dd__divider" />
                <div className="search-dd__section">
                  <div className="search-dd__section-title">From the Blog</div>
                  {filteredBlog.map(b => (
                    <div key={b.slug} className="search-dd__item">
                      <div className="search-dd__thumb" style={{ background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                      </div>
                      <div className="search-dd__info">
                        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{b.tag}</div>
                        <div className="search-dd__title">{b.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            <Link href={`/search?q=${encodeURIComponent(query)}`} className="search-dd__all" onClick={() => setIsOpen(false)}>
              See all results for &ldquo;{query}&rdquo;
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

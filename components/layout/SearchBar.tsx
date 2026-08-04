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

// Mock-vangnet: zorgt dat elk zoekresultaat een van-tot prijs heeft, ook zonder echte data
function mockRange(slug: string): { min: number; max: number } {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  const min = 300 + (h % 2200);
  const max = Math.round((min * 1.12) / 10) * 10;
  return { min, max };
}

// Prijs per zoekresultaat: echte variant-range -> eigen priceMin/Max -> deterministische mock
function rangeFor(p: { slug: string; priceMin?: number; priceMax?: number }): { min: number; max: number } {
  return getPriceRange(p.slug)
    ?? (p.priceMin != null ? { min: p.priceMin, max: p.priceMax ?? p.priceMin } : mockRange(p.slug));
}

// Normaliseert notaties zodat f/2.8 = f2.8 = 2.8 = 2,8, 50mm = 50, hoofdletters/diakritieken genegeerd
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/ƒ/g, 'f')
    .replace(/(\d),(\d)/g, '$1.$2')  // NL-komma: 1,4 -> 1.4
    .replace(/f\/?(?=\d)/g, '')      // f/2.8, f2.8 -> 2.8
    .replace(/(\d)\s*mm\b/g, '$1')   // 50mm -> 50
    .replace(/[\/,]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(s: string): string[] {
  return normalize(s).split(' ').filter(Boolean);
}

// Korte tokens (1-2 tekens: R, M, Z8-los, 'a1') alleen als heel woord matchen — nooit als
// substring, anders matcht 'r' elk product met een r erin. Het laatste token mag tijdens het
// typen wel prefix zijn ('canon eos r' -> R5, R6, R10). Langere tokens matchen als substring
// binnen de tekst ('320' vindt 'd3200').
function tokenMatches(token: string, hay: string, hayWords: string[], isLast: boolean): boolean {
  if (token.length <= 2) {
    return hayWords.some(w => w === token || (isLast && w.startsWith(token)));
  }
  return hay.includes(token);
}

// Kleine edit-distance voor typo-tolerantie (Hasslblad -> Hasselblad)
function editDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 3;
  const prev = new Array(b.length + 1).fill(0).map((_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return prev[b.length];
}

// Fuzzy alleen als vangnet: tokens van 4+ tekens, afstand 1 (of 2 bij lange woorden)
function tokenMatchesFuzzy(token: string, hayWords: string[]): boolean {
  if (token.length < 4 || /^\d+$/.test(token)) return false;
  const maxD = token.length >= 7 ? 2 : 1;
  return hayWords.some(w => w.length >= 3 && editDistance(token, w) <= maxD);
}

function makeVariant(p: (typeof products)[number], v: (typeof products)[number]['variants'][number]): VariantResult {
  return {
    productSlug: p.slug,
    productTitle: p.title,
    productImage: p.image,
    sku: v.sku,
    price: v.price,
    condition: v.condition,
    conditionLabel: v.conditionLabel,
    shutterCount: v.shutterCount,
  };
}

function useSearch(query: string) {
  const raw = query.trim();
  const q = normalize(raw);
  const qTokens = tokenize(raw);

  // Cijfer-detectie voor SKU-gedrag. Producten blijven ALTIJD meezoeken ('3200' vindt de
  // D3200 als product), SKU-treffers komen er als eigen sectie bij:
  //  - 3-4 cijfers: waarschijnlijk een modelnummer (D3200, A6600) -> producten boven, SKU's eronder
  //  - 5+ cijfers: vrijwel zeker SKU-intentie (CT-SKU's zijn 5-cijferig, modelnamen nooit) -> SKU's boven
  const digits = raw.replace(/\s+/g, '');
  const isDigitQuery = /^\d{3,}$/.test(digits);
  const skuOnTop = /^\d{5,}$/.test(digits);

  // Producten: token-subset match — alle getypte woorden moeten voorkomen, nooit andersom
  // (weggelaten woorden als EF/STM verbergen niets). Gerankt op relevantie + populariteit.
  const matchWith = (fuzzy: boolean) => q.length === 0 ? [] : searchProducts
    .map((p, idx) => {
      const hay = normalize(p.title + ' ' + p.keywords.join(' '));
      const hayWords = hay.split(' ');
      const titleNorm = normalize(p.title);
      const titleWords = titleNorm.split(' ');
      const ok = qTokens.every((t, i) =>
        tokenMatches(t, hay, hayWords, i === qTokens.length - 1)
        || (fuzzy && tokenMatchesFuzzy(t, hayWords)));
      if (!ok) return null;
      let score = searchProducts.length - idx; // populariteit-proxy (lijstvolgorde = best verkocht eerst)
      if (titleNorm.startsWith(q)) score += 100;                          // exacte prefix op titel
      if (titleNorm === q) score += 100;                                  // exacte naam wint altijd
      if (qTokens[0] && titleWords[0] === qTokens[0]) score += 40;        // merk-match -> eigen merk eerst (Canon vóór Sigma)
      score += qTokens.filter(t => titleWords.some(w => w.startsWith(t))).length * 5;
      return { p, score, inStock: p.stock !== 'Out of stock' };
    })
    .filter((x): x is { p: (typeof searchProducts)[number]; score: number; inStock: boolean } => x !== null)
    .sort((a, b) => b.score - a.score);

  // Eerst exact; levert dat niets op, dan één fuzzy-herkansing (typo-vangnet: hasslblad -> hasselblad)
  let scored = matchWith(false);
  if (scored.length === 0 && qTokens.some(t => t.length >= 4)) scored = matchWith(true);

  // SKU-treffers (alleen bij cijfer-queries): exact > begint-met > bevat, over alle varianten
  let filteredVariants: VariantResult[] = [];
  if (isDigitQuery) {
    const all = products.flatMap(p => p.variants.map(v => ({ p, v })));
    const exact = all.filter(({ v }) => v.sku === digits);
    const starts = all.filter(({ v }) => v.sku !== digits && v.sku.startsWith(digits));
    const contains = all.filter(({ v }) => !v.sku.startsWith(digits) && v.sku.includes(digits));
    filteredVariants = [...exact, ...starts, ...contains]
      .slice(0, skuOnTop ? 8 : 5)
      .map(({ p, v }) => makeVariant(p, v));
  }

  // In-stock altijd eerst; met een SKU-sectie erbij max 5 producten, anders 8
  const productCap = filteredVariants.length > 0 ? 5 : 8;
  const inStockMatches = scored.filter(s => s.inStock);
  const filteredProducts = inStockMatches.map(s => s.p).slice(0, productCap);

  // OOS pas tonen als in-stock + SKU-treffers de dropdown niet vullen; vul dan aan met Notify.
  const oosSlots = Math.max(0, 8 - filteredProducts.length - filteredVariants.length);
  const filteredOos = oosSlots > 0
    ? scored.filter(s => !s.inStock).map(s => s.p).slice(0, oosSlots)
    : [];

  // Blog niet in dit voorbeeld (eventueel later als eigen gesegmenteerde groep)
  const filteredBlog = searchBlogPosts.slice(0, 0);

  const hasResults = filteredProducts.length > 0 || filteredOos.length > 0 || filteredVariants.length > 0 || filteredBlog.length > 0;

  return { filteredProducts, filteredOos, filteredVariants, filteredBlog, hasResults, skuOnTop };
}

// Bij precies één beschikbare variant: direct door naar de variantpagina (scheelt een klik
// waar niets te kiezen valt) en één prijs + '1 in stock' i.p.v. een van-tot-range.
function singleVariantFor(slug: string) {
  const p = products.find(pp => pp.slug === slug);
  return p && p.variants.length === 1 ? p.variants[0] : null;
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
  skuOnTop,
}: {
  query: string;
  setQuery: (q: string) => void;
  setIsOpen: (v: boolean) => void;
  filteredProducts: ReturnType<typeof useSearch>['filteredProducts'];
  filteredOos: ReturnType<typeof useSearch>['filteredOos'];
  filteredVariants: VariantResult[];
  filteredBlog: ReturnType<typeof useSearch>['filteredBlog'];
  hasResults: boolean;
  skuOnTop: boolean;
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

  // Producten-sectie: bij precies 1 beschikbare variant direct door naar de variantpagina
  // met één prijs en '1 in stock' i.p.v. een van-tot-range.
  const productsSection = filteredProducts.length > 0 && (
    <div className="search-dd__section">
      <div className="search-dd__section-title">Products</div>
      {filteredProducts.map(p => {
        const sv = singleVariantFor(p.slug);
        const range = rangeFor(p);
        return (
          <Link
            key={p.slug}
            href={sv ? `/product/${p.slug}/${sv.sku}` : `/product/${p.slug}`}
            className="search-dd__item"
            onClick={() => setIsOpen(false)}
          >
            <div className="search-dd__thumb">
              <img src={assetPath(p.image)} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div className="search-dd__info">
              <div className="search-dd__title">{p.title}</div>
              <div className="search-dd__meta" style={{ color: '#16a34a' }}>{sv ? '1 in stock' : p.stock}</div>
            </div>
            {sv ? (
              <div className="search-dd__price" style={{ textAlign: 'right', lineHeight: 1.3 }}>
                &euro;{sv.price.toLocaleString('nl-NL')}
              </div>
            ) : range && (
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
  );

  const variantsSection = filteredVariants.length > 0 && (
    <div className="search-dd__section">
      <div className="search-dd__section-title">SKU match</div>
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
  );

  return (
    <>
      {/* 1+2. Producten en SKU-treffers — SKU's boven bij 5+ cijfers (SKU-intentie),
          eronder bij 3-4 cijfers (waarschijnlijk een modelnummer zoals D3200) */}
      {skuOnTop ? variantsSection : productsSection}
      {(productsSection && variantsSection) && <div className="search-dd__divider" />}
      {skuOnTop ? productsSection : variantsSection}

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

  const { filteredProducts, filteredOos, filteredVariants, filteredBlog, hasResults, skuOnTop } = useSearch(query);

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
            skuOnTop={skuOnTop}
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
          skuOnTop={skuOnTop}
        />
      </div>
    </div>
  );
}

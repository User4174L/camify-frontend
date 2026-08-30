'use client';

import { useState, useRef, useEffect, useMemo, type ReactNode } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import type { LandingContent } from '@/data/landing-content';

/**
 * Landingspagina = categoriepagina (H1 + intro, filtergrid, results-bar,
 * productkaarten zoals /lenses en /cameras) met SEO-tekst + FAQ onderaan.
 */

function formatPrice(p: number) { return p.toLocaleString('nl-NL'); }

const ChevronDown = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginLeft: 4, flexShrink: 0 }}><path d="m6 9 6 6 6-6" /></svg>
);

/* Mini-markdown voor de SEO-tekst: ## koppen, alinea's, - lijsten, **vet** */
function bold(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') ? <strong key={i} style={{ color: 'var(--text)' }}>{part.slice(2, -2)}</strong> : <span key={i}>{part}</span>
  );
}
function SeoText({ source }: { source: string }) {
  const out: ReactNode[] = [];
  let list: string[] = [];
  const flush = (k: string) => {
    if (!list.length) return;
    out.push(<ul key={k} style={{ margin: '0 0 16px', paddingLeft: 22, display: 'grid', gap: 6 }}>{list.map((li, i) => <li key={i} style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)' }}>{bold(li)}</li>)}</ul>);
    list = [];
  };
  source.split('\n').forEach((raw, i) => {
    const line = raw.trim();
    const k = `l${i}`;
    if (line.startsWith('## ')) { flush(k); out.push(<h2 key={k} style={{ fontSize: 20, fontWeight: 700, margin: '28px 0 10px', color: 'var(--text)' }}>{line.slice(3)}</h2>); }
    else if (line.startsWith('- ')) list.push(line.slice(2));
    else if (line === '') flush(k);
    else { flush(k); out.push(<p key={k} style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)', margin: '0 0 14px' }}>{bold(line)}</p>); }
  });
  flush('end');
  return <div style={{ maxWidth: 800 }}>{out}</div>;
}

const ITEMS_PER_PAGE = 16;

/* Zelfde kaartontwerp als de categoriepagina */
function Kaart({ p }: { p: import('@/data/landing-content').LandingProduct }) {
  return (
    <Link href={p.href ?? '#'} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{ borderRadius: 12, overflow: 'hidden', background: '#fff', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'relative', background: '#fff', aspectRatio: '1', overflow: 'hidden', borderRadius: '11px 11px 0 0' }}>
          <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', padding: '12%' }} />
          <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}>
            <div style={{ background: '#fff', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
              <svg width="16" height="16" fill="none" stroke="#888" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            </div>
          </div>
        </div>
        <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#111', lineHeight: 1.3 }}>{p.name}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>
            <span style={{ fontSize: 13, fontWeight: 400, color: '#6b7280', marginRight: 4 }}>Vanaf</span>
            &euro;{formatPrice(p.price)}
            {p.priceMax !== p.price && <> &ndash; &euro;{formatPrice(p.priceMax)}</>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            {p.stock <= 2 ? (
              <><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} /><span style={{ fontSize: 13, fontWeight: 600, color: '#ef4444' }}>{p.stock === 1 ? 'Laatste!' : `Nog ${p.stock} op voorraad!`}</span></>
            ) : p.stock <= 5 ? (
              <><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} /><span style={{ fontSize: 13, fontWeight: 600, color: '#f59e0b' }}>Nog {p.stock} op voorraad</span></>
            ) : (
              <><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} /><span style={{ fontSize: 13, color: '#6b7280' }}>{p.stock} op voorraad</span></>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function LandingClient({ content: c }: { content: LandingContent }) {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [filterSelections, setFilterSelections] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const filterBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function h(e: MouseEvent) { if (filterBarRef.current && !filterBarRef.current.contains(e.target as Node)) setOpenFilter(null); }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const getSelected = (f: string) => filterSelections[f] || [];
  const toggleFilter = (f: string, v: string) => {
    setFilterSelections(prev => { const cur = prev[f] || []; return { ...prev, [f]: cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v] }; });
  };
  const totalActive = Object.values(filterSelections).reduce((s, a) => s + a.length, 0);

  const producten = useMemo(() => {
    const list = [...c.producten];
    if (sortBy === 'price-low') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') list.sort((a, b) => b.price - a.price);
    return list;
  }, [c.producten, sortBy]);

  const totalPages = Math.max(1, Math.ceil(producten.length / ITEMS_PER_PAGE));
  const paginated = producten.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const firstHalf = paginated.slice(0, 8);
  const secondHalf = paginated.slice(8);
  const goToPage = (p: number) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <div className="container">
      <Breadcrumb items={c.breadcrumb.map(b => ({ label: b.label, href: b.href }))} />

      {/* H1 + korte intro — exact zoals de categoriepagina */}
      <div style={{ marginBottom: 24 }}>
        <h1 className="section__title" style={{ marginBottom: 12 }}>{c.pagina}</h1>
        {c.intro_boven_producten && (
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: 800, margin: 0 }}>{c.intro_boven_producten}</p>
        )}
      </div>

      {/* Hub-tegels (merkpagina als shooter-hub) — zelfde tegelstijl als de categoriepagina */}
      {c.hub_tegels && c.hub_tegels.length > 0 && (
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '4px 0', marginBottom: 28 }}>
          {c.hub_tegels.map(t => (
            <Link key={t.titel} href={t.href} style={{
              flex: '0 0 210px', borderRadius: 12, border: '1.5px solid var(--border)', overflow: 'hidden',
              textDecoration: 'none', color: 'var(--text)', background: '#fff',
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ height: 110, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img src={t.image} alt="" style={{ maxWidth: '84%', maxHeight: '92%', objectFit: 'contain' }} />
              </div>
              <div style={{ padding: '10px 14px 12px', borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{t.titel}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{t.sub}</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Filtergrid — zelfde als de categoriepagina */}
      <div ref={filterBarRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8, marginBottom: 12 }}>
        {c.filters.map(f => {
          const sel = getSelected(f.naam);
          const hasActive = sel.length > 0;
          return (
            <div key={f.naam} style={{ position: 'relative' }}>
              <button onClick={() => setOpenFilter(openFilter === f.naam ? null : f.naam)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                padding: '10px 14px', borderRadius: 8,
                border: hasActive ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
                background: hasActive ? 'rgba(249,115,22,0.04)' : 'transparent',
                color: 'var(--text)', fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
              }}>
                <span>{f.naam}{hasActive ? ` (${sel.length})` : ''}</span><ChevronDown />
              </button>
              {openFilter === f.naam && f.opties.length > 0 && (
                <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 10, padding: '6px 0', minWidth: 220, maxHeight: 320, overflowY: 'auto', zIndex: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                  {f.opties.map(option => (
                    <label key={option} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', fontSize: 13, cursor: 'pointer', color: 'var(--text)' }}>
                      <input type="checkbox" checked={sel.includes(option)} onChange={() => toggleFilter(f.naam, option)} style={{ accentColor: 'var(--accent)' }} /> {option}
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Results bar + sort */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, padding: '12px 0', marginBottom: 20, borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
          <span>Toont <strong style={{ color: 'var(--text)' }}>{producten.length}</strong> van {c.aanbod.toLocaleString('nl-NL')} resultaten</span>
          {totalActive > 0 && (
            <button onClick={() => setFilterSelections({})} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>Wis alle filters</button>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <span style={{ color: 'var(--text-secondary)' }}>Sorteer op:</span>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '4px 8px', border: 'none', background: 'transparent', color: 'var(--text)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <option value="relevance">relevantie</option>
            <option value="price-low">prijs laag-hoog</option>
            <option value="price-high">prijs hoog-laag</option>
            <option value="newest">nieuwste eerst</option>
          </select>
        </div>
      </div>

      {/* Productkaarten — zelfde kaartontwerp en aantal (16/pagina) als de categoriepagina */}
      <div className="product-grid-responsive">
        {firstHalf.map(p => <Kaart key={p.id} p={p} />)}
      </div>

      {/* USP trust band tussen rij 2 en 3 — zelfde als de categoriepagina */}
      {secondHalf.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, padding: '28px 0', margin: '24px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
            {['12 maanden garantie', 'Professioneel getest', 'Gratis verzending vanaf €50', '14 dagen bedenktijd'].map(text => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>
                {text}
              </div>
            ))}
          </div>
          <div className="product-grid-responsive">
            {secondHalf.map(p => <Kaart key={p.id} p={p} />)}
          </div>
        </>
      )}

      {/* Paginering — zelfde als de categoriepagina */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, margin: '32px 0 48px' }}>
          <button onClick={() => currentPage > 1 && goToPage(currentPage - 1)} disabled={currentPage <= 1} style={{ width: 36, height: 36, borderRadius: 8, border: '1.5px solid var(--border)', background: 'transparent', cursor: currentPage <= 1 ? 'default' : 'pointer', color: currentPage <= 1 ? 'var(--text-tertiary, #ccc)' : 'var(--text)', opacity: currentPage <= 1 ? 0.4 : 1, fontSize: 15 }}>&lsaquo;</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button key={page} onClick={() => goToPage(page)} style={{ width: 36, height: 36, borderRadius: 8, border: page === currentPage ? '1.5px solid var(--accent)' : '1.5px solid var(--border)', background: page === currentPage ? 'var(--accent)' : 'transparent', color: page === currentPage ? '#fff' : 'var(--text)', cursor: 'pointer', fontSize: 14, fontWeight: page === currentPage ? 600 : 400 }}>{page}</button>
          ))}
          <button onClick={() => currentPage < totalPages && goToPage(currentPage + 1)} disabled={currentPage >= totalPages} style={{ width: 36, height: 36, borderRadius: 8, border: '1.5px solid var(--border)', background: 'transparent', cursor: currentPage >= totalPages ? 'default' : 'pointer', color: currentPage >= totalPages ? 'var(--text-tertiary, #ccc)' : 'var(--text)', opacity: currentPage >= totalPages ? 0.4 : 1, fontSize: 15 }}>&rsaquo;</button>
        </div>
      )}
      {totalPages <= 1 && <div style={{ marginBottom: 48 }} />}

      {/* SEO-tekst onderaan */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 32, marginBottom: 40 }}>
        <SeoText source={c.seo_tekst_onder_producten} />
      </div>

      {/* FAQ */}
      {c.faq.length > 0 && (
        <div style={{ maxWidth: 800, marginBottom: 56 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 14px', color: 'var(--text)' }}>Veelgestelde vragen</h2>
          <div style={{ border: '1.5px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            {c.faq.map((f, i) => (
              <details key={i} style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                <summary style={{ padding: '14px 18px', fontSize: 14, fontWeight: 600, color: 'var(--text)', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  {f.vraag}<span style={{ color: 'var(--text-secondary)' }}>+</span>
                </summary>
                <p style={{ padding: '0 18px 14px', fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0 }}>{f.antwoord}</p>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

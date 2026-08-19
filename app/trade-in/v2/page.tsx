'use client';

/**
 * Inruilflow — VERSIE 2 (concept, naast v1 op /trade-in)
 *
 * Verschillen t.o.v. v1:
 * - Header in de stijl van Quality & grading (licht, foto rechts), geen stappenrij in de hero.
 * - Drie stappen: Verkopen → Gegevens → Overzicht ("Kopen" is een inline optie onder je items).
 * - Per item alleen conditie (met ⓘ-criteria) + optionele shuttercount bij camera's. Geen lensvragen.
 * - Direct bod per item zodra de conditie gekozen is; drie toestanden (direct / binnen minuten / handmatig).
 * - Alles inline in de stap: geen modals. Kopen: product (voorraad, prijsrange) → uitklap varianten → kies.
 * - Telefoon optioneel; zakelijk = vestigingsland + BTW-nummer verplicht.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import VersionSwitch from '@/components/trade-in/VersionSwitch';
import {
  SELL_PRODUCTS, BUY_PRODUCTS, SHUTTER_RANGES, estimateBid,
  type BuyProduct, type BuyVariant, type BidCoverage,
} from '@/data/trade-in-mock';

/* ── Conditie-definities (teksten in lijn met /quality-grading) ── */
const CONDITIONS: { label: string; short: string; criteria: string; clicks: string }[] = [
  { label: 'Zo goed als nieuw', short: 'Als nieuw in de hand', criteria: 'Nagenoeg geen gebruikssporen, rubbers in topstaat. Glas perfect, hooguit 1–2 stofdeeltjes. Alles werkt.', clicks: 'tot 25.000 clicks' },
  { label: 'Zeer goed', short: 'Minimale sporen', criteria: 'Minimale gebruikssporen; hele kleine krasjes mogelijk. Enkele stofdeeltjes of zeer kleine glasbeschadiging mogelijk, zonder invloed op het resultaat.', clicks: 'tot 75.000 clicks' },
  { label: 'Goed', short: 'Zichtbaar gebruikt', criteria: 'Meerdere krasjes of gebruikssporen. Meerdere stofdeeltjes of kleine glasbeschadigingen mogelijk, zonder invloed op het resultaat. Alles werkt.', clicks: 'tot 150.000 clicks' },
  { label: 'Gebruikt', short: 'Duidelijke sporen', criteria: 'Duidelijke gebruikssporen zoals krasjes en slijtage op het LCD. Krasjes of stof mogelijk. Knoppen/zoom/focus kunnen iets stroever gaan; alles werkt.', clicks: 'meer dan 150.000 clicks kan' },
  { label: 'Zwaar gebruikt', short: 'Intensief gebruikt', criteria: 'Aanzienlijke slijtage of schade. Stof of krassen op de lens mogelijk met geringe invloed op het resultaat. Volledig functioneel en getest.', clicks: 'clicks niet bepalend' },
];

/* ── Types ── */
interface SellItem {
  id: number;
  name: string;
  category: string; // camera | lens | accessory
  condition?: string;
  shutter?: string;
  done: boolean;
}
interface BuyPick extends BuyVariant { name: string; productId: string }

/* ── Styles ── */
const C = { text: '#1E2133', sec: '#6B6D80', border: '#EEEEF2', surface: '#F8F8FA', accent: '#E8692A', accentSoft: '#FFF4EE' };
const input: React.CSSProperties = { width: '100%', padding: '12px 16px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, fontFamily: 'inherit', outline: 'none', background: '#fff', boxSizing: 'border-box', color: C.text };
const btnPrimary: React.CSSProperties = { background: C.accent, color: '#fff', border: 'none', borderRadius: 999, padding: '12px 26px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' };
const btnGhost: React.CSSProperties = { background: '#fff', color: C.text, border: `1px solid ${C.border}`, borderRadius: 999, padding: '11px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' };
const btnDark: React.CSSProperties = { ...btnPrimary, background: C.text };
const chip: React.CSSProperties = { fontSize: 12, borderRadius: 6, padding: '3px 8px', background: C.surface, color: C.text, fontWeight: 600 };

const fmt = (n: number) => `€ ${n.toLocaleString('nl-NL')}`;

/* ── Kleine bouwstenen ── */
function Info({ text }: { text: string }) {
  return (
    <span className="ti2-info" tabIndex={0} aria-label="Uitleg">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>
      <span className="ti2-pop">{text}</span>
    </span>
  );
}

function Thumb({ category }: { category: string }) {
  const src = category === 'lens' ? '/images/placeholder-lens.svg' : '/images/placeholder-camera.svg';
  return <img src={src} alt="" width={40} height={40} style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 8, background: C.surface, flexShrink: 0 }} />;
}

function BidBox({ name, condition, shutter, compact, align = 'right' }: { name: string; condition?: string; shutter?: string; compact?: boolean; align?: 'left' | 'right' }) {
  if (!condition) {
    return <div style={{ fontSize: 12, color: C.sec }}>Kies een conditie voor je bod</div>;
  }
  const bid = estimateBid(name, condition, shutter);
  const shutterNote = shutter ? shutter.toLowerCase() : 'tot 25.000 clicks';
  if (bid.coverage === 'instant' && bid.price) {
    return (
      <div style={{ textAlign: align }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em', color: C.sec, fontWeight: 700 }}>Indicatief bod</div>
        <div style={{ fontSize: compact ? 20 : 24, fontWeight: 800, color: C.text, lineHeight: 1.1 }}>{fmt(bid.price)}</div>
        <div style={{ fontSize: 11.5, color: C.sec, marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          bij {condition.toLowerCase()}, {shutterNote}
          <Info text="Wijkt je product bij ontvangst af van deze aannames, dan passen we het bod aan volgens onze vaste staffel. Je beslist daarna zelf — niet akkoord? Dan sturen we het gratis terug." />
        </div>
      </div>
    );
  }
  const isMinutes = bid.coverage === 'minutes';
  return (
    <div style={{ textAlign: align, maxWidth: 260 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 700, color: isMinutes ? C.accent : C.text, background: isMinutes ? C.accentSoft : C.surface, borderRadius: 999, padding: '5px 10px' }}>
        {isMinutes ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h10" /></svg>
        )}
        {isMinutes ? 'Bod binnen ± 5 min' : 'Bod binnen 2 werkdagen'}
      </div>
      <div style={{ fontSize: 11.5, color: C.sec, marginTop: 6 }}>
        {isMinutes ? 'We halen extra marktdata op en mailen je bod.' : 'Dit product beoordelen we handmatig.'}
      </div>
    </div>
  );
}

function StepShell({ num, title, meta, active, done, onOpen, children }: { num: number; title: string; meta?: string; active: boolean; done: boolean; onOpen?: () => void; children?: React.ReactNode }) {
  return (
    <div style={{ border: `1.5px solid ${active ? C.text : C.border}`, borderRadius: 16, background: '#fff', marginBottom: 12, boxShadow: active ? '0 2px 16px rgba(45,48,71,.06)' : 'none' }}>
      <div onClick={onOpen} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderRadius: active ? '14px 14px 0 0' : 14, cursor: onOpen ? 'pointer' : 'default', background: done && !active ? C.surface : 'transparent', borderBottom: active ? `1px solid ${C.border}` : 'none' }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, background: done && !active ? '#22c55e' : active ? C.accent : C.border, color: done || active ? '#fff' : C.sec }}>
          {done && !active ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg> : num}
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: C.text }}>{title}</div>
        {meta && <div style={{ marginLeft: 'auto', fontSize: 12.5, color: C.sec }}>{meta}</div>}
      </div>
      {active && <div style={{ padding: '22px 20px 20px' }}>{children}</div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
export default function TradeInV2Page() {
  const [step, setStep] = useState(1);
  const [highest, setHighest] = useState(1);
  const go = (n: number) => { setStep(n); setHighest(h => Math.max(h, n)); };

  /* Verkopen */
  const [items, setItems] = useState<SellItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [q, setQ] = useState('');
  const [results, setResults] = useState<typeof SELL_PRODUCTS>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (q.trim().length < 2) { setResults([]); return; }
    const t = q.toLowerCase().split(/\s+/).filter(Boolean);
    setResults(SELL_PRODUCTS.filter(p => t.every(w => p.name.toLowerCase().includes(w))).slice(0, 8));
  }, [q]);

  const addItem = (p: { name: string; category: string }) => {
    const id = Date.now();
    setItems(prev => [...prev, { id, name: p.name, category: p.category, done: false }]);
    setEditingId(id);
    setQ(''); setResults([]); setShowResults(false);
  };
  const patch = (id: number, data: Partial<SellItem>) => setItems(prev => prev.map(i => (i.id === id ? { ...i, ...data } : i)));
  const removeItem = (id: number) => { setItems(prev => prev.filter(i => i.id !== id)); if (editingId === id) setEditingId(null); };

  const doneItems = items.filter(i => i.done);
  const bids = doneItems.map(i => ({ item: i, bid: estimateBid(i.name, i.condition!, i.shutter) }));
  const instantTotal = bids.reduce((s, b) => s + (b.bid.coverage === 'instant' && b.bid.price ? b.bid.price : 0), 0);
  const nMinutes = bids.filter(b => b.bid.coverage === 'minutes').length;
  const nManual = bids.filter(b => b.bid.coverage === 'manual').length;

  /* Kopen (inline) */
  const [buyOpen, setBuyOpen] = useState(false);
  const [bq, setBq] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [picks, setPicks] = useState<BuyPick[]>([]);
  const buyResults = useMemo(() => {
    if (bq.trim().length < 2) return [] as BuyProduct[];
    const t = bq.toLowerCase().split(/\s+/).filter(Boolean);
    return BUY_PRODUCTS.filter(p => t.every(w => (p.name + ' ' + p.category + ' ' + p.variants.map(v => v.sku).join(' ')).toLowerCase().includes(w))).slice(0, 8);
  }, [bq]);
  const togglePick = (p: BuyProduct, v: BuyVariant) => setPicks(prev => (prev.some(x => x.id === v.id) ? prev.filter(x => x.id !== v.id) : [...prev, { ...v, name: p.name, productId: p.id }]));
  const buyTotal = picks.reduce((s, p) => s + p.price, 0);

  /* Gegevens */
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isBusiness, setIsBusiness] = useState(false);
  const [country, setCountry] = useState('NL');
  const [vat, setVat] = useState('');
  const NON_EU = ['GB', 'CH', 'NO', 'US', 'NON_EU'];
  const vatOk = !isBusiness || NON_EU.includes(country) || /^[A-Z]{2}[A-Z0-9]{8,12}$/.test(vat.replace(/[\s.-]/g, '').toUpperCase());
  const contactOk = firstName.trim() && lastName.trim() && /.+@.+\..+/.test(email) && vatOk;
  const vatLine = !isBusiness ? 'Particulier — bod is het bedrag dat je ontvangt' : country === 'NL' ? 'BTW wordt in rekening gebracht' : NON_EU.includes(country) ? '0% BTW (export)' : 'BTW verlegd (intracommunautaire levering)';

  const [submitted, setSubmitted] = useState(false);

  /* ── UI ── */
  return (
    <>
      <VersionSwitch active={2} />

      {/* Header — zelfde opzet als Quality & grading */}
      <div className="svc-header svc-header--photo" style={{ marginBottom: 24 }}>
        <div className="svc-header__photo" style={{ backgroundImage: 'url(/images/hero-photographer-1.jpg)' }} aria-hidden="true" />
        <div className="container">
          <div className="svc-header__inner">
            <Breadcrumb items={[{ label: 'Inruilen & verkopen' }]} />
            <div className="svc-eyebrow">Inruilen &amp; verkopen</div>
            <h1 className="svc-title">Verkoop je gear <span style={{ color: C.accent }}>snel en eerlijk</span></h1>
            <p className="svc-intro">Kies je product en conditie en zie direct wat we bieden. Gratis verzekerd opsturen, betaling binnen 3 werkdagen na ontvangst.</p>
            <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 16 }}>
              {['Direct een bod', 'Gratis verzekerd verzenden', 'Uitbetaling binnen 3 werkdagen'].map(u => (
                <span key={u} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13.5, fontWeight: 600, color: C.text }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  {u}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 64px' }}>
        {submitted ? (
          <div style={{ border: `1.5px solid ${C.border}`, borderRadius: 16, padding: 32, textAlign: 'center', background: '#fff' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px', color: C.text }}>Je bod is vastgelegd</h2>
            <p style={{ color: C.sec, margin: '0 auto 18px', maxWidth: 520, fontSize: 14.5, lineHeight: 1.6 }}>
              We hebben een bevestiging gestuurd naar <strong style={{ color: C.text }}>{email}</strong>.
              {instantTotal > 0 && <> Je directe bod van <strong style={{ color: C.text }}>{fmt(instantTotal)}</strong> staat 7 dagen vast; het gratis verzendlabel zit in de mail.</>}
              {nMinutes > 0 && <> Voor {nMinutes} item{nMinutes > 1 ? 's' : ''} volgt het bod binnen ± 5 minuten per mail.</>}
              {nManual > 0 && <> {nManual} item{nManual > 1 ? 's' : ''} beoordelen we handmatig — je hoort binnen 2 werkdagen van ons.</>}
            </p>
            <button style={btnGhost} onClick={() => window.location.reload()}>Nog een aanvraag</button>
          </div>
        ) : (
          <>
            {/* ── Stap 1: Verkopen ── */}
            <StepShell num={1} title="Verkopen" meta={items.length ? `${items.length} item${items.length > 1 ? 's' : ''}` : undefined} active={step === 1} done={highest > 1} onOpen={() => go(1)}>
              {/* Items */}
              {items.map(item => {
                const editing = editingId === item.id;
                const isCamera = item.category === 'camera';
                return (
                  <div key={item.id} style={{ border: `1.5px solid ${editing ? C.accent : C.border}`, borderRadius: 14, padding: 16, marginBottom: 10, background: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                      <Thumb category={item.category} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{item.name}</div>
                        {!editing && (
                          <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                            {item.condition && <span style={{ ...chip, background: C.accentSoft, color: C.accent }}>{item.condition}</span>}
                            {item.shutter && <span style={chip}>{item.shutter} clicks</span>}
                            {isCamera && !item.shutter && <span style={{ ...chip, fontWeight: 500, color: C.sec }}>shuttercount onbekend</span>}
                          </div>
                        )}
                      </div>
                      {!editing && <BidBox name={item.name} condition={item.condition} shutter={item.shutter} compact />}
                      <div style={{ display: 'flex', gap: 6, marginLeft: 8 }}>
                        {!editing && (
                          <button title="Wijzigen" onClick={() => setEditingId(item.id)} style={{ ...btnGhost, padding: 8, borderRadius: 8, lineHeight: 0 }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                          </button>
                        )}
                        <button title="Verwijderen" onClick={() => removeItem(item.id)} style={{ ...btnGhost, padding: 8, borderRadius: 8, lineHeight: 0 }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" /></svg>
                        </button>
                      </div>
                    </div>

                    {editing && (
                      <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>Wat is de staat?</div>
                        <div className="ti2-cond-grid">
                          {CONDITIONS.map(c => {
                            const sel = item.condition === c.label;
                            return (
                              <button key={c.label} onClick={() => patch(item.id, { condition: c.label })} className="ti2-cond" style={{ borderColor: sel ? C.accent : C.border, background: sel ? C.accentSoft : '#fff' }}>
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                                  <span style={{ fontWeight: 700, fontSize: 13.5, color: C.text }}>{c.label}</span>
                                  <Info text={`${c.criteria}${isCamera ? ` Aanname: ${c.clicks}.` : ''}`} />
                                </span>
                                <span style={{ fontSize: 11.5, color: C.sec }}>{c.short}</span>
                              </button>
                            );
                          })}
                        </div>

                        {isCamera && item.condition && (
                          <details className="ti2-details" open={!!item.shutter}>
                            <summary>
                              Weet je je shuttercount? <span style={{ color: C.accent, fontWeight: 700 }}>Vaak méér bod.</span>
                              <span style={{ color: C.sec, fontWeight: 500 }}> (optioneel)</span>
                            </summary>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                              {SHUTTER_RANGES.map(r => {
                                const sel = item.shutter === r.label;
                                return (
                                  <button key={r.label} onClick={() => patch(item.id, { shutter: sel ? undefined : r.label })} style={{ ...btnGhost, padding: '8px 14px', fontSize: 13, borderColor: sel ? C.accent : C.border, background: sel ? C.accentSoft : '#fff' }}>
                                    {r.label}
                                  </button>
                                );
                              })}
                              <a href="/shuttercount" target="_blank" rel="noreferrer" style={{ alignSelf: 'center', fontSize: 12.5, color: C.sec, textDecoration: 'underline' }}>Hoe vind ik dit?</a>
                            </div>
                          </details>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, gap: 12, flexWrap: 'wrap' }}>
                          <BidBox name={item.name} condition={item.condition} shutter={item.shutter} align="left" />
                          <button disabled={!item.condition} onClick={() => { patch(item.id, { done: true }); setEditingId(null); }} style={{ ...btnPrimary, opacity: item.condition ? 1 : 0.5, cursor: item.condition ? 'pointer' : 'default' }}>
                            Klaar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Zoekbalk — onder de items */}
              <div style={{ position: 'relative', marginTop: items.length ? 6 : 0 }}>
                <input
                  ref={searchRef}
                  value={q}
                  onChange={e => { setQ(e.target.value); setShowResults(true); }}
                  onFocus={() => setShowResults(true)}
                  onBlur={() => setTimeout(() => setShowResults(false), 180)}
                  placeholder={items.length ? 'Nog een item toevoegen — zoek op merk of model…' : 'Zoek je camera, lens of accessoire…'}
                  autoComplete="off"
                  style={{ ...input, borderRadius: 999, padding: '14px 52px 14px 20px', fontSize: 15 }}
                />
                <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, borderRadius: '50%', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                </div>
                {showResults && q.trim().length >= 2 && (
                  <div style={{ position: 'absolute', left: 0, right: 0, top: 'calc(100% + 8px)', zIndex: 20, background: '#fff', borderRadius: 14, boxShadow: '0 12px 32px rgba(45,48,71,.16)', overflow: 'hidden' }}>
                    {results.length ? results.map((p, i) => (
                      <div key={p.name} onMouseDown={() => addItem(p)} className="ti2-row" style={{ borderBottom: i < results.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                        <Thumb category={p.category} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{p.name}</div>
                          <div style={{ fontSize: 12, color: C.sec }}>{p.category === 'camera' ? 'Camera' : p.category === 'lens' ? 'Lens' : 'Accessoire'}</div>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.accent }}>Toevoegen</span>
                      </div>
                    )) : (
                      <div style={{ padding: 16, fontSize: 13.5, color: C.sec }}>
                        Niet gevonden. <button onMouseDown={() => addItem({ name: q.trim(), category: 'camera' })} style={{ background: 'none', border: 'none', color: C.accent, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>“{q.trim()}” handmatig toevoegen</button> — we beoordelen het dan handmatig.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Totaal + status */}
              {doneItems.length > 0 && (
                <div style={{ marginTop: 18, padding: '14px 18px', borderRadius: 14, background: C.surface, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 13, color: C.sec }}>
                    {instantTotal > 0 && <span>Direct bod voor {bids.filter(b => b.bid.coverage === 'instant').length} item{bids.filter(b => b.bid.coverage === 'instant').length > 1 ? 's' : ''}</span>}
                    {nMinutes > 0 && <span>{instantTotal > 0 ? ' · ' : ''}{nMinutes} bod binnen ± 5 min</span>}
                    {nManual > 0 && <span>{instantTotal > 0 || nMinutes > 0 ? ' · ' : ''}{nManual} handmatig</span>}
                  </div>
                  {instantTotal > 0 && (
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                      <span style={{ fontSize: 12.5, color: C.sec, fontWeight: 600 }}>Indicatief totaal</span>
                      <span style={{ fontSize: 22, fontWeight: 800, color: C.text }}>{fmt(instantTotal)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Kopen — inline optie */}
              {doneItems.length > 0 && (
                <div style={{ marginTop: 14, border: `1.5px dashed ${buyOpen ? C.accent : C.border}`, borderRadius: 14, padding: buyOpen ? 16 : 0, background: buyOpen ? '#fff' : 'transparent' }}>
                  {!buyOpen ? (
                    <button onClick={() => setBuyOpen(true)} style={{ width: '100%', background: 'none', border: 'none', padding: '14px 16px', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 26, height: 26, borderRadius: '50%', background: C.accentSoft, color: C.accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>+</span>
                      <span style={{ fontSize: 14, color: C.text }}><strong>Wil je er iets voor terug?</strong> <span style={{ color: C.sec }}>Kies iets uit onze voorraad — we verrekenen het met je bod.</span></span>
                    </button>
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>Kopen uit onze voorraad <span style={{ color: C.sec, fontWeight: 500 }}>(optioneel)</span></div>
                        <button onClick={() => { setBuyOpen(false); setPicks([]); setBq(''); setExpanded(null); }} style={{ background: 'none', border: 'none', color: C.sec, cursor: 'pointer', fontSize: 12.5, fontFamily: 'inherit', textDecoration: 'underline' }}>Toch niet</button>
                      </div>

                      {picks.map(p => (
                        <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', border: `1.5px solid ${C.border}`, borderLeft: `3px solid ${C.accent}`, borderRadius: 10, marginBottom: 8 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{p.name}</div>
                            <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                              <span style={{ ...chip, background: C.accentSoft, color: C.accent }}>{p.condition}</span>
                              <span style={chip}>SKU {p.sku}</span>
                              {p.shutterCount !== undefined && <span style={chip}>{p.shutterCount.toLocaleString('nl-NL')} clicks</span>}
                            </div>
                          </div>
                          <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>{fmt(p.price)}</div>
                          <button onClick={() => setPicks(prev => prev.filter(x => x.id !== p.id))} style={{ ...btnGhost, padding: 6, borderRadius: 8, lineHeight: 0 }} title="Verwijderen">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                          </button>
                        </div>
                      ))}

                      <input value={bq} onChange={e => { setBq(e.target.value); setExpanded(null); }} placeholder="Zoek op merk, model of SKU…" autoComplete="off" style={{ ...input, borderRadius: 999, padding: '12px 20px' }} />

                      {bq.trim().length >= 2 && (
                        <div style={{ marginTop: 10, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                          {buyResults.length ? buyResults.map((p, i) => {
                            const prices = p.variants.map(v => v.price);
                            const open = expanded === p.id;
                            return (
                              <div key={p.id} style={{ borderBottom: i < buyResults.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                                <div onClick={() => setExpanded(open ? null : p.id)} className="ti2-row" style={{ background: open ? C.surface : '#fff' }}>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{p.name}</div>
                                    <div style={{ fontSize: 12, color: C.sec }}>{p.category}</div>
                                  </div>
                                  <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 12, color: C.sec }}>{p.variants.length} op voorraad</div>
                                    <div style={{ fontWeight: 700, fontSize: 14.5, color: C.text }}>{fmt(Math.min(...prices))}{prices.length > 1 ? ` – ${fmt(Math.max(...prices))}` : ''}</div>
                                  </div>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.sec} strokeWidth="2" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}><path d="M6 9l6 6 6-6" /></svg>
                                </div>
                                {open && (
                                  <div style={{ padding: '6px 14px 12px', background: C.surface }}>
                                    {p.variants.map(v => {
                                      const sel = picks.some(x => x.id === v.id);
                                      return (
                                        <div key={v.id} onClick={() => togglePick(p, v)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', marginTop: 6, borderRadius: 10, border: `1.5px solid ${sel ? C.accent : C.border}`, background: sel ? C.accentSoft : '#fff', cursor: 'pointer' }}>
                                          <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                                              <span style={{ ...chip, background: sel ? '#fff' : C.accentSoft, color: C.accent }}>{v.condition}</span>
                                              <span style={{ fontSize: 12, color: C.sec }}>SKU {v.sku}</span>
                                              {v.shutterCount !== undefined && <span style={{ fontSize: 12, color: C.sec }}>· {v.shutterCount.toLocaleString('nl-NL')} clicks</span>}
                                            </div>
                                            <div style={{ fontSize: 12, color: C.sec, marginTop: 4 }}>Incl. {v.accessories.join(', ')}</div>
                                          </div>
                                          <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>{fmt(v.price)}</div>
                                          <span style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${sel ? C.accent : C.border}`, background: sel ? C.accent : '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {sel && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          }) : <div style={{ padding: 14, fontSize: 13.5, color: C.sec }}>Niets gevonden in onze voorraad.</div>}
                        </div>
                      )}

                      {picks.length > 0 && instantTotal > 0 && (
                        <div style={{ marginTop: 12, fontSize: 13, color: C.sec, textAlign: 'right' }}>
                          Kopen {fmt(buyTotal)} − bod {fmt(instantTotal)} = <strong style={{ color: C.text }}>{buyTotal - instantTotal >= 0 ? `${fmt(buyTotal - instantTotal)} bij te betalen` : `${fmt(instantTotal - buyTotal)} ontvang je`}</strong>
                          <span style={{ marginLeft: 6 }}><Info text="Indicatief; definitief na ontvangst en controle van je items. Items met een bod binnen minuten of handmatig tellen hier nog niet mee." /></span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
                <button disabled={!doneItems.length || editingId !== null} onClick={() => go(2)} style={{ ...btnPrimary, opacity: doneItems.length && editingId === null ? 1 : 0.5, cursor: doneItems.length && editingId === null ? 'pointer' : 'default' }}>
                  Doorgaan →
                </button>
              </div>
            </StepShell>

            {/* ── Stap 2: Gegevens ── */}
            <StepShell num={2} title="Gegevens" meta={highest > 2 ? email : undefined} active={step === 2} done={highest > 2} onOpen={highest >= 2 ? () => go(2) : undefined}>
              <div style={{ maxWidth: 560, margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <label className="ti2-label">Voornaam *<input value={firstName} onChange={e => setFirstName(e.target.value)} style={input} /></label>
                  <label className="ti2-label">Achternaam *<input value={lastName} onChange={e => setLastName(e.target.value)} style={input} /></label>
                  <label className="ti2-label">E-mailadres *<input type="email" value={email} onChange={e => setEmail(e.target.value)} style={input} placeholder="jij@voorbeeld.nl" /></label>
                  <label className="ti2-label"><span>Telefoon <span style={{ color: C.sec, fontWeight: 500 }}>(optioneel)</span></span><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} style={input} placeholder="06 12345678" /></label>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, padding: '12px 14px', border: `1.5px solid ${isBusiness ? C.accent : C.border}`, borderRadius: 10, cursor: 'pointer', fontSize: 14, color: C.text }}>
                  <input type="checkbox" checked={isBusiness} onChange={e => setIsBusiness(e.target.checked)} style={{ width: 16, height: 16, accentColor: C.accent }} />
                  Ik verkoop zakelijk
                </label>

                {isBusiness && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <label className="ti2-label">Vestigingsland *
                        <select value={country} onChange={e => setCountry(e.target.value)} style={input}>
                          {[['NL', 'Nederland'], ['BE', 'België'], ['DE', 'Duitsland'], ['FR', 'Frankrijk'], ['LU', 'Luxemburg'], ['AT', 'Oostenrijk'], ['ES', 'Spanje'], ['IT', 'Italië'], ['PL', 'Polen'], ['DK', 'Denemarken'], ['SE', 'Zweden'], ['GB', 'Verenigd Koninkrijk'], ['CH', 'Zwitserland'], ['NO', 'Noorwegen'], ['US', 'Verenigde Staten'], ['NON_EU', 'Ander land buiten de EU']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                        </select>
                      </label>
                      {!NON_EU.includes(country) && (
                        <label className="ti2-label">BTW-nummer *
                          <input value={vat} onChange={e => setVat(e.target.value)} style={{ ...input, borderColor: vat && !vatOk ? '#dc2626' : C.border }} placeholder={country === 'NL' ? 'NL123456789B01' : `${country}…`} />
                          {vat && !vatOk && <span style={{ fontSize: 12, color: '#dc2626', fontWeight: 500 }}>Controleer het BTW-nummer (landcode + 8–12 tekens).</span>}
                        </label>
                      )}
                    </div>
                    <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 10, background: '#EFF6FF', color: '#1e40af', fontSize: 13, display: 'flex', gap: 8, alignItems: 'center' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>
                      <span><strong>{vatLine}.</strong> Zakelijk verkopen met een geldig BTW-nummer: NL = BTW in rekening · EU = verlegd · buiten EU = 0%.</span>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                  <button style={btnGhost} onClick={() => go(1)}>← Vorige</button>
                  <button disabled={!contactOk} onClick={() => go(3)} style={{ ...btnPrimary, opacity: contactOk ? 1 : 0.5, cursor: contactOk ? 'pointer' : 'default' }}>Naar overzicht →</button>
                </div>
              </div>
            </StepShell>

            {/* ── Stap 3: Overzicht ── */}
            <StepShell num={3} title="Overzicht" active={step === 3} done={false} onOpen={highest >= 3 ? () => go(3) : undefined}>
              <div style={{ maxWidth: 720, margin: '0 auto' }}>
                <div className="ti2-card" style={{ borderLeftColor: C.accent }}>
                  <div className="ti2-card-h">Je verkoopt</div>
                  {doneItems.map(i => (
                    <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{i.name}</div>
                        <div style={{ fontSize: 12.5, color: C.sec }}>{i.condition}{i.shutter ? ` · ${i.shutter} clicks` : i.category === 'camera' ? ' · shuttercount onbekend' : ''}</div>
                      </div>
                      <BidBox name={i.name} condition={i.condition} shutter={i.shutter} compact />
                    </div>
                  ))}
                  {instantTotal > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, fontWeight: 800, color: C.text }}>
                      <span>Direct bod totaal</span><span>{fmt(instantTotal)}</span>
                    </div>
                  )}
                </div>

                {picks.length > 0 && (
                  <div className="ti2-card" style={{ borderLeftColor: '#22c55e' }}>
                    <div className="ti2-card-h">Je koopt</div>
                    {picks.map(p => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderBottom: `1px solid ${C.border}`, fontSize: 14 }}>
                        <span style={{ color: C.text }}>{p.name} <span style={{ color: C.sec, fontSize: 12.5 }}>· {p.condition} · SKU {p.sku}</span></span>
                        <strong style={{ color: C.text }}>{fmt(p.price)}</strong>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, fontWeight: 800, color: C.text }}>
                      <span>{buyTotal - instantTotal >= 0 ? 'Bij te betalen (indicatief)' : 'Je ontvangt (indicatief)'}</span><span>{fmt(Math.abs(buyTotal - instantTotal))}</span>
                    </div>
                  </div>
                )}

                <div className="ti2-card" style={{ borderLeftColor: C.sec }}>
                  <div className="ti2-card-h">Gegevens</div>
                  {[['Naam', `${firstName} ${lastName}`], ['E-mail', email], ['Telefoon', phone || '—'], ['Type', isBusiness ? 'Zakelijk' : 'Particulier'], ...(isBusiness ? [['Land', country], ['BTW-nummer', NON_EU.includes(country) ? 'n.v.t.' : vat.toUpperCase()], ['BTW', vatLine]] : [])].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '7px 0', borderBottom: `1px solid ${C.border}`, fontSize: 13.5 }}>
                      <span style={{ color: C.sec }}>{k}</span><span style={{ color: C.text, fontWeight: 600, textAlign: 'right' }}>{v}</span>
                    </div>
                  ))}
                </div>

                <p style={{ fontSize: 12.5, color: C.sec, lineHeight: 1.6, margin: '4px 0 16px' }}>
                  Je directe bod staat 7 dagen vast. Bij ontvangst controleren we conditie en shuttercount; wijkt het af, dan passen we het bod aan volgens onze vaste staffel en beslis jij — niet akkoord is gratis retour.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button style={btnGhost} onClick={() => go(2)}>← Vorige</button>
                  <button style={btnDark} onClick={() => setSubmitted(true)}>Bod vastleggen</button>
                </div>
              </div>
            </StepShell>
          </>
        )}
      </div>

      <style>{`
        .ti2-row{display:flex;align-items:center;gap:12px;padding:12px 16px;cursor:pointer;transition:background .15s}
        .ti2-row:hover{background:#FFFBF7}
        .ti2-cond-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
        @media(max-width:820px){.ti2-cond-grid{grid-template-columns:repeat(2,1fr)}}
        .ti2-cond{display:flex;flex-direction:column;gap:4px;text-align:left;border:1.5px solid #EEEEF2;border-radius:12px;padding:10px 12px;cursor:pointer;font-family:inherit;transition:border-color .15s,background .15s}
        .ti2-cond:hover{border-color:#E8692A}
        .ti2-info{position:relative;display:inline-flex;color:#6B6D80;cursor:help;vertical-align:middle}
        .ti2-info:hover{color:#E8692A}
        .ti2-pop{display:none;position:absolute;bottom:calc(100% + 8px);right:-8px;width:260px;background:#1E2133;color:#fff;font-size:12px;line-height:1.5;font-weight:500;padding:10px 12px;border-radius:10px;z-index:30;box-shadow:0 8px 24px rgba(0,0,0,.18);text-align:left;white-space:normal}
        .ti2-info:hover .ti2-pop,.ti2-info:focus .ti2-pop{display:block}
        .ti2-details{margin-top:14px;border:1px dashed #EEEEF2;border-radius:10px;padding:10px 14px}
        .ti2-details summary{cursor:pointer;font-size:13.5px;font-weight:600;color:#1E2133;list-style:none}
        .ti2-details summary::-webkit-details-marker{display:none}
        .ti2-details summary::before{content:"›";display:inline-block;margin-right:8px;color:#6B6D80;transition:transform .15s}
        .ti2-details[open] summary::before{transform:rotate(90deg)}
        .ti2-label{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:600;color:#1E2133}
        .ti2-card{border:1.5px solid #EEEEF2;border-left-width:3px;border-radius:14px;padding:14px 18px;margin-bottom:12px;background:#fff}
        .ti2-card-h{font-size:11.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#6B6D80;margin-bottom:6px}
      `}</style>
    </>
  );
}

'use client';

/**
 * Gedeelde bouwstenen voor inruilflow VERSIE 3 (/trade-in/v3, /gegevens, /bod).
 * Vlakke MPB-achtige opzet: grijze pagina, losse witte kaarten, drie schermen met eigen URL.
 * State leeft in sessionStorage zodat de schermen (en de terugknop) samenwerken.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import type { BuyVariant } from '@/data/trade-in-mock';

/* ── State ── */
export interface SellItem {
  id: number;
  name: string;
  category: string; // camera | lens | accessory
  condition: string;
  shutter?: string;
}
export interface BuyPick extends BuyVariant { name: string; productId: string }
export interface Contact {
  firstName: string; lastName: string; email: string; phone: string;
  isBusiness: boolean; country: string; vat: string;
}
export interface V3State {
  items: SellItem[];
  picks: BuyPick[];
  contact: Contact;
  editingId: number | null;
}
const EMPTY: V3State = {
  items: [], picks: [], editingId: null,
  contact: { firstName: '', lastName: '', email: '', phone: '', isBusiness: false, country: 'NL', vat: '' },
};
const KEY = 'ti3-state';

export function useV3State(): [V3State, (patch: Partial<V3State> | ((s: V3State) => V3State)) => void, boolean] {
  const [state, setState] = useState<V3State>(EMPTY);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) setState({ ...EMPTY, ...JSON.parse(raw) });
    } catch { /* ignore */ }
    setReady(true);
  }, []);
  const update = (patch: Partial<V3State> | ((s: V3State) => V3State)) => {
    setState(prev => {
      const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch };
      try { sessionStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };
  return [state, update, ready];
}
export function clearV3State() { try { sessionStorage.removeItem(KEY); } catch { /* ignore */ } }

/* ── Conditie-definities (teksten in lijn met /quality-grading) ── */
export const CONDITIONS: { label: string; short: string; criteria: string; clicks: string; maxClicks: string }[] = [
  { label: 'Zo goed als nieuw', short: 'Als nieuw in de hand', criteria: 'Nagenoeg geen gebruikssporen, rubbers in topstaat. Glas perfect, hooguit 1–2 stofdeeltjes. Alles werkt.', clicks: 'tot 25.000 clicks', maxClicks: 'max. 25.000 clicks' },
  { label: 'Zeer goed', short: 'Minimale sporen', criteria: 'Minimale gebruikssporen; hele kleine krasjes mogelijk. Enkele stofdeeltjes of zeer kleine glasbeschadiging mogelijk, zonder invloed op het resultaat.', clicks: 'tot 75.000 clicks', maxClicks: 'max. 75.000 clicks' },
  { label: 'Goed', short: 'Zichtbaar gebruikt', criteria: 'Meerdere krasjes of gebruikssporen. Meerdere stofdeeltjes of kleine glasbeschadigingen mogelijk, zonder invloed op het resultaat. Alles werkt.', clicks: 'tot 150.000 clicks', maxClicks: 'max. 150.000 clicks' },
  { label: 'Gebruikt', short: 'Duidelijke sporen', criteria: 'Duidelijke gebruikssporen zoals krasjes en slijtage op het LCD. Krasjes of stof mogelijk. Knoppen/zoom/focus kunnen iets stroever gaan; alles werkt.', clicks: 'meer dan 150.000 clicks kan', maxClicks: 'clicks: geen limiet' },
  { label: 'Zwaar gebruikt', short: 'Intensief gebruikt', criteria: 'Aanzienlijke slijtage of schade. Stof of krassen op de lens mogelijk met geringe invloed op het resultaat. Volledig functioneel en getest.', clicks: 'clicks niet bepalend', maxClicks: 'clicks: geen limiet' },
];

/* Wat we standaard inbegrepen verwachten bij het bod (per type) */
export const INCLUDED: Record<string, string[]> = {
  camera: ['Accu', 'Lader of USB-kabel', 'Bodydop', 'Draagriem'],
  lens: ['Voor- en achterdop', 'Zonnekap (indien origineel meegeleverd)'],
  accessory: ['Het product zelf, compleet en werkend'],
};

export const NON_EU = ['GB', 'CH', 'NO', 'US', 'NON_EU'];
export function vatLineFor(c: { isBusiness: boolean; country: string }) {
  if (!c.isBusiness) return 'Particulier — het bod is het bedrag dat je ontvangt';
  if (c.country === 'NL') return 'BTW wordt in rekening gebracht';
  if (NON_EU.includes(c.country)) return '0% BTW (export)';
  return 'BTW verlegd (intracommunautaire levering)';
}

/* ── Styles ── */
export const C = { text: '#1E2133', sec: '#6B6D80', border: '#EEEEF2', surface: '#F4F4F7', accent: '#E8692A', accentSoft: '#FFF4EE' };
export const input: React.CSSProperties = { width: '100%', padding: '12px 16px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, fontFamily: 'inherit', outline: 'none', background: '#fff', boxSizing: 'border-box', color: C.text };
export const btnPrimary: React.CSSProperties = { background: C.accent, color: '#fff', border: 'none', borderRadius: 999, padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 8 };
export const btnDark: React.CSSProperties = { ...btnPrimary, background: C.text };
/** Primaire CTA van de flow (groen: onderscheidt zich van al het oranje op de site) */
export const btnCta: React.CSSProperties = { ...btnPrimary, background: '#16A34A' };
export const btnGhost: React.CSSProperties = { background: '#fff', color: C.text, border: `1.5px solid ${C.text}`, borderRadius: 999, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 8 };
export const btnLight: React.CSSProperties = { ...btnGhost, border: `1px solid ${C.border}`, fontWeight: 600 };
export const card: React.CSSProperties = { background: '#fff', borderRadius: 14, padding: 20, boxShadow: '0 1px 2px rgba(30,33,51,.04)' };
export const fmt = (n: number) => `€ ${n.toLocaleString('nl-NL')}`;

/* ── Componenten ── */
export function Thumb({ category, size = 44 }: { category: string; size?: number }) {
  const src = category === 'lens' ? '/images/placeholder-lens.svg' : '/images/placeholder-camera.svg';
  return <img src={src} alt="" width={size} height={size} style={{ width: size, height: size, objectFit: 'contain', borderRadius: 8, background: C.surface, flexShrink: 0 }} />;
}

export function IconBtn({ onClick, title, kind }: { onClick: () => void; title: string; kind: 'edit' | 'trash' | 'close' }) {
  return (
    <button onClick={onClick} title={title} aria-label={title} style={{ width: 34, height: 34, borderRadius: '50%', border: `1.5px solid ${C.border}`, background: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: C.text }}>
      {kind === 'edit' && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>}
      {kind === 'trash' && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" /></svg>}
      {kind === 'close' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>}
    </button>
  );
}

/** Lichte header in de stijl van Quality & grading + stappenindicator */
export function V3Header({ step }: { step: 1 | 2 | 3 }) {
  const steps = ['Wat verkoop je', 'Je gegevens', 'Je bod'];
  return (
    <div className="svc-header svc-header--photo" style={{ marginBottom: 0 }}>
      <div className="svc-header__photo" style={{ backgroundImage: 'url(/images/hero-photographer-1.jpg)' }} aria-hidden="true" />
      <div className="container">
        <div className="svc-header__inner">
          <Breadcrumb items={[{ label: 'Inruilen & verkopen' }]} />
          <div className="svc-eyebrow">Inruilen &amp; verkopen</div>
          <h1 className="svc-title">Verkoop je gear <span style={{ color: C.accent }}>snel en eerlijk</span></h1>
          <div style={{ display: 'flex', gap: 6, marginTop: 20, flexWrap: 'wrap' }}>
            {steps.map((s, i) => {
              const n = (i + 1) as 1 | 2 | 3;
              const active = n === step; const done = n < step;
              return (
                <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px 6px 6px', borderRadius: 999, background: active ? C.text : '#fff', color: active ? '#fff' : done ? C.text : C.sec, border: `1px solid ${active ? C.text : C.border}`, fontSize: 12.5, fontWeight: 700 }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, background: done ? '#22c55e' : active ? C.accent : C.surface, color: done || active ? '#fff' : C.sec }}>
                    {done ? '✓' : n}
                  </span>
                  {s}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return <Link href={href} style={{ fontSize: 13.5, color: C.sec, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>← {label}</Link>;
}

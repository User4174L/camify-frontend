'use client';

/**
 * Gedeelde bouwstenen voor de inruilwizard, variant 2 en 3.
 *
 *   variant 3 = we geven direct een bod (schermen: verkopen → kopen → gegevens → bod)
 *   variant 2 = zelfde flow, maar zonder bod vooraf (… → gegevens → aanvraag verstuurd)
 *
 * Opzet: donkere banner met de genummerde stappen (vorm uit versie 1), daaronder een
 * witte pagina met omlijnde kaarten — geen grijs vlak meer.
 * State leeft per variant in sessionStorage, zodat de twee elkaar niet in de weg zitten.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import type { BuyVariant } from '@/data/trade-in-mock';

export type Variant = 2 | 3;
/** Beloofde doorlooptijd voor een handmatig bod (variant 2). Eén plek, zodat 2↔3 werkdagen makkelijk te wijzigen is. */
export const LEAD_TIME = '2 tot 3 werkdagen';

/** Toont deze variant een bod vóór verzending? */
export const hasBid = (v: Variant) => v === 3;
export const base = (v: Variant) => `/trade-in/v${v}`;
/** Laatste scherm heet anders per variant. */
export const lastPath = (v: Variant) => (hasBid(v) ? 'bod' : 'aanvraag');

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
export interface WizardState {
  items: SellItem[];
  picks: BuyPick[];
  contact: Contact;
  editingId: number | null;
  buySkipped: boolean;
}
const EMPTY: WizardState = {
  items: [], picks: [], editingId: null, buySkipped: false,
  contact: { firstName: '', lastName: '', email: '', phone: '', isBusiness: false, country: 'NL', vat: '' },
};

export function useWizardState(variant: Variant): [WizardState, (patch: Partial<WizardState> | ((s: WizardState) => WizardState)) => void, boolean] {
  const key = `ti-wizard-v${variant}`;
  const [state, setState] = useState<WizardState>(EMPTY);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(key);
      if (raw) setState({ ...EMPTY, ...JSON.parse(raw) });
    } catch { /* ignore */ }
    setReady(true);
  }, [key]);
  const update = (patch: Partial<WizardState> | ((s: WizardState) => WizardState)) => {
    setState(prev => {
      const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch };
      try { sessionStorage.setItem(key, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };
  return [state, update, ready];
}
export function clearWizardState(variant: Variant) { try { sessionStorage.removeItem(`ti-wizard-v${variant}`); } catch { /* ignore */ } }

/* ── Conditie-definities (teksten in lijn met /quality-grading) ── */
export const CONDITIONS: { label: string; short: string; criteria: string; clicks: string; maxClicks: string }[] = [
  { label: 'Zo goed als nieuw', short: 'Als nieuw in de hand', criteria: 'Nagenoeg geen gebruikssporen, rubbers in topstaat. Glas perfect, hooguit 1–2 stofdeeltjes. Alles werkt.', clicks: 'tot 25.000 clicks', maxClicks: 'max. 25.000 clicks' },
  { label: 'Zeer goed', short: 'Minimale sporen', criteria: 'Minimale gebruikssporen; hele kleine krasjes mogelijk. Enkele stofdeeltjes of zeer kleine glasbeschadiging mogelijk, zonder invloed op het resultaat.', clicks: 'tot 75.000 clicks', maxClicks: 'max. 75.000 clicks' },
  { label: 'Goed', short: 'Zichtbaar gebruikt', criteria: 'Meerdere krasjes of gebruikssporen. Meerdere stofdeeltjes of kleine glasbeschadigingen mogelijk, zonder invloed op het resultaat. Alles werkt.', clicks: 'tot 150.000 clicks', maxClicks: 'max. 150.000 clicks' },
  { label: 'Gebruikt', short: 'Duidelijke sporen', criteria: 'Duidelijke gebruikssporen zoals krasjes en slijtage op het LCD. Krasjes of stof mogelijk. Knoppen/zoom/focus kunnen iets stroever gaan; alles werkt.', clicks: 'meer dan 150.000 clicks kan', maxClicks: 'clicks: geen limiet' },
  { label: 'Zwaar gebruikt', short: 'Intensief gebruikt', criteria: 'Aanzienlijke slijtage of schade. Stof of krassen op de lens mogelijk met geringe invloed op het resultaat. Volledig functioneel en getest.', clicks: 'clicks niet bepalend', maxClicks: 'clicks: geen limiet' },
];

/* Wat we standaard inbegrepen verwachten (per type) */
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
export const C = { text: '#1E2133', sec: '#6B6D80', border: '#EEEEF2', tint: '#FAFAFC', accent: '#E8692A', accentSoft: '#FFF4EE' };
export const input: React.CSSProperties = { width: '100%', padding: '12px 16px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, fontFamily: 'inherit', outline: 'none', background: '#fff', boxSizing: 'border-box', color: C.text };
export const btnPrimary: React.CSSProperties = { background: C.accent, color: '#fff', border: 'none', borderRadius: 999, padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 8 };
export const btnDark: React.CSSProperties = { ...btnPrimary, background: C.text };
/** Primaire CTA van de flow (groen: onderscheidt zich van al het oranje op de site) */
export const btnCta: React.CSSProperties = { ...btnPrimary, background: '#16A34A' };
/** Secundaire CTA (item toevoegen, nog een product, iets anders kiezen) — merkoranje outline. */
export const btnGhost: React.CSSProperties = { background: '#fff', color: C.accent, border: `1.5px solid ${C.accent}`, borderRadius: 999, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 8 };
export const btnLight: React.CSSProperties = { ...btnGhost, border: `1px solid ${C.border}`, fontWeight: 600 };
/** Kaart op een witte pagina: dunne rand in plaats van schaduw op grijs. */
export const card: React.CSSProperties = { background: '#fff', borderRadius: 14, padding: 20, border: `1px solid ${C.border}` };
export const fmt = (n: number) => `€ ${n.toLocaleString('nl-NL')}`;

/* ── Kleine componenten ── */
export function Thumb({ category, size = 44 }: { category: string; size?: number }) {
  const src = category === 'lens' ? '/images/placeholder-lens.svg' : '/images/placeholder-camera.svg';
  return <img src={src} alt="" width={size} height={size} style={{ width: size, height: size, objectFit: 'contain', borderRadius: 8, background: C.tint, flexShrink: 0 }} />;
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

/* ── Banner ── */
export type Step = 1 | 2 | 3 | 4;

/**
 * Lichte foto-header in de stijl van Quality & grading, met een subtiele
 * stappenindicator. Afgeronde stappen zijn klikbaar terug.
 */
export function WizardBanner({ variant, step }: { variant: Variant; step: Step }) {
  const b = base(variant);
  const steps: { label: string; href: string }[] = [
    { label: 'Wat verkoop je', href: b },
    { label: 'Wil je iets kopen', href: `${b}/kopen` },
    { label: 'Je gegevens', href: `${b}/gegevens` },
    { label: hasBid(variant) ? 'Je bod' : 'Je aanvraag', href: `${b}/${lastPath(variant)}` },
  ];

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
              const n = (i + 1) as Step;
              const active = n === step; const done = n < step;
              const style: React.CSSProperties = {
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px 6px 6px', borderRadius: 999,
                background: active ? C.text : '#fff', color: active ? '#fff' : done ? C.text : C.sec,
                border: `1px solid ${active ? C.text : C.border}`, fontSize: 12.5, fontWeight: 700, textDecoration: 'none',
              };
              const inner = (
                <>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, background: done ? '#22c55e' : active ? C.accent : C.tint, color: done || active ? '#fff' : C.sec }}>
                    {done ? '✓' : n}
                  </span>
                  {s.label}
                </>
              );
              return done
                ? <Link key={s.label} href={s.href} style={style}>{inner}</Link>
                : <span key={s.label} style={style} aria-current={active ? 'step' : undefined}>{inner}</span>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Witte pagina-body — vervangt het oude grijze vlak. Start elk scherm bovenaan. */
export function Page({ children, width = 880 }: { children: React.ReactNode; width?: number }) {
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);
  return (
    <div style={{ background: '#fff', padding: '32px 0 88px' }}>
      <div style={{ maxWidth: width, margin: '0 auto', padding: '0 24px' }}>{children}</div>
      <style>{`
        .tiw-add{transition:background .15s ease,box-shadow .15s ease,transform .15s ease}
        .tiw-add:not(:disabled):hover{background:#FFF4EE;box-shadow:0 5px 16px rgba(232,105,42,.2);transform:translateY(-1px)}
      `}</style>
    </div>
  );
}

export function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <>
      <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-.02em', margin: '10px 0 0', color: C.text }}>{title}</h2>
      {sub && <p style={{ color: C.sec, margin: '6px 0 22px', fontSize: 15, lineHeight: 1.6 }}>{sub}</p>}
    </>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return <Link href={href} style={{ fontSize: 13.5, color: C.sec, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>← {label}</Link>;
}

/** Sticky onderbalk met de enige primaire CTA van het scherm. */
export function StickyBar({ note, cta, disabled, onClick, secondary }: {
  note: React.ReactNode; cta: string; disabled?: boolean; onClick: () => void; secondary?: React.ReactNode;
}) {
  return (
    <div style={{ position: 'sticky', bottom: 0, background: '#fff', borderTop: `1px solid ${C.border}`, padding: '14px 24px', zIndex: 15, boxShadow: '0 -6px 20px rgba(30,33,51,.05)' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 13.5, color: C.sec }}>{note}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {secondary}
          <button disabled={disabled} onClick={onClick} style={{ ...btnCta, opacity: disabled ? 0.45 : 1, cursor: disabled ? 'default' : 'pointer', padding: '15px 30px' }}>{cta} →</button>
        </div>
      </div>
    </div>
  );
}

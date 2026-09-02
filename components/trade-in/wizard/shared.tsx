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
  /** Vrije toelichting van de klant, bv. "autofocus werkt niet" — gaat mee naar de expert. */
  note?: string;
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
export const input: React.CSSProperties = { width: '100%', padding: '12px 16px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 16, fontFamily: 'inherit', outline: 'none', background: '#fff', boxSizing: 'border-box', color: C.text, scrollMarginBlock: 14 };
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

/* ── Productfoto's ──
 * Mockdata: waar we een echte foto hebben koppelen we die op naam, de rest krijgt
 * een vaste foto uit de pool van hetzelfde type. Zo heeft elk zoekresultaat beeld
 * en blijft dezelfde regel altijd dezelfde foto houden. */
const PHOTO_BY_NAME: Record<string, string> = {
  'sony a7 iv': '/images/sony-a7-iv.jpg',
  'sony a7r v': '/images/sony-a7r-v.jpg',
  'sony a1': '/images/sony-a1.jpg',
  'nikon z8': '/images/nikon-z8.jpg',
  'nikon zf': '/images/nikon-zf.jpg',
  'canon eos r5': '/images/canon-r5.jpg',
  'fujifilm x-t5': '/images/fujifilm-x-t4.jpg',
  'sony fe 24-70mm f/2.8 gm ii': '/images/sony-fe-24-70mm-f28-gm.jpg',
  'sony fe 70-200mm f/2.8 gm ii': '/images/sony-fe-70-200mm-f28-gm-oss-ii.jpg',
  'canon rf 24-70mm f/2.8l is usm': '/images/canon-rf-24-70mm-f28-l-is-usm.jpg',
  'canon rf 70-200mm f/2.8l is usm': '/images/lenses/canon-rf-70-200-f28.webp',
};

const POOL: Record<string, string[]> = {
  camera: ['/images/canon-r5.jpg', '/images/nikon-z8.jpg', '/images/nikon-zf.jpg', '/images/sony-a1.jpg', '/images/sony-a7-iv.jpg', '/images/sony-a7r-v.jpg', '/images/fujifilm-x-t4.jpg', '/images/hasselblad-x2d-100c.jpg'],
  lens: ['/images/lenses/canon-rf-24-105-f4.webp', '/images/lenses/canon-rf-28-70-f2.webp', '/images/lenses/canon-rf-70-200-f28.webp', '/images/lenses/canon-rf-200-800.webp', '/images/lenses/sony-fe-24-105-f4.webp', '/images/lenses/sony-fe-100-400-gm.webp', '/images/lenses/leica-50-f24.webp', '/images/lenses/leica-90-f2.webp', '/images/lenses/zeiss-batis-40-f2.webp'],
  accessory: ['/images/upsell-battery.png', '/images/upsell-sd-card.png', '/images/upsell-adapter.png'],
};

/** Stabiele keuze uit de pool: dezelfde naam levert altijd dezelfde foto. */
export function photoFor(name: string, category?: string): string {
  const key = name.trim().toLowerCase();
  if (PHOTO_BY_NAME[key]) return PHOTO_BY_NAME[key];

  const cat = (category ?? '').toLowerCase();
  const pool = POOL[cat] ?? (/lens|mm|f\/|objectief/.test(key) ? POOL.lens : POOL.camera);
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return pool[hash % pool.length];
}

/** Slijtageregel per type: camera's tellen kliks, cinema-camera's draaiuren. */
export function wearLine(item: { category: string; shutter?: string }) {
  if (item.category !== 'camera' && item.category !== 'cinema') return null;
  const cinema = item.category === 'cinema';
  const label = cinema ? 'Draaiuren' : 'Shuttercount';
  const aanname = cinema ? 'max. 500 uur' : 'max. 25.000';
  return (
    <> · {label}: <strong style={{ color: C.text }}>{item.shutter ?? 'onbekend'}</strong>
      {!item.shutter && <span style={{ color: C.sec }}> (we gaan uit van {aanname})</span>}
    </>
  );
}

/** Zet het veld waar je in typt bovenaan in beeld — inclusief zijn label. Niet
 *  centreren: dan valt het volgende veld in de onderste helft en verdwijnt het
 *  achter het toetsenbord of de suggestiebalk. Bovenaan houdt de rest van het
 *  formulier bruikbaar zonder te scrollen. De vertraging wacht de
 *  toetsenbord-animatie af.
 *  Alleen op mobiel: daar verdringt het toetsenbord het veld. Op desktop is er
 *  geen toetsenbord en voelt de sprong bij elke focus juist storend. */
export function centerOnFocus(e: React.FocusEvent<HTMLElement>) {
  if (!window.matchMedia('(max-width:760px)').matches) return;
  const el = e.currentTarget.closest('label') ?? e.currentTarget;
  setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 280);
}

/** Scroll een element in beeld nádat de nieuwe layout staat. Eén requestAnimationFrame
 *  is te vroeg: de kaart is dan nog niet weg en je schiet voorbij het doel. */
export function scrollIntoViewSoon(target: HTMLElement | null | React.RefObject<HTMLElement | null>, block: ScrollLogicalPosition = 'center') {
  // Wachten tot de nieuwe layout staat én het zoekvenster de scroll-lock op body
  // heeft losgelaten; anders wordt de scroll genegeerd.
  setTimeout(() => {
    // Ref pas hier uitlezen: het doel bestaat vaak nog niet op het moment van aanroepen
    // (de knop verschijnt juist door dezelfde state-wijziging).
    const el = target && 'current' in target ? target.current : target;
    // 'center' op een lijst die hoger is dan het scherm scrollt per saldo niets;
    // geef dan 'end' mee zodat het net toegevoegde item onderaan in beeld komt.
    // Geen expliciete behavior: html heeft scroll-behavior:smooth en Chrome laat
    // een expliciete {behavior:'smooth'} hier stilletjes vallen — de CSS niet.
    el?.scrollIntoView({ block });
  }, 80);
}

/** Is dit een mobiel scherm? Bepaalt of zoeken in een schermvullend venster gaat. */
export function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width:760px)');
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return mobile;
}

/**
 * Schermvullend zoekvenster voor mobiel. Zolang je zoekt is er niets anders in
 * beeld — geen kop, geen onderbalk, geen halve resultatenlijst achter het
 * toetsenbord. Sluit zodra je iets kiest.
 */
export function SearchSheet({ title, onClose, children, footer }: { title: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);
  return (
    <div className="tiw-sheet">
      <div className="tiw-sheet-head">
        <span>{title}</span>
        <button onClick={onClose} aria-label="Sluiten" className="tiw-sheet-close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="tiw-sheet-body">{children}</div>
      {footer && <div className="tiw-sheet-foot">{footer}</div>}
      <style>{`
        .tiw-sheet{position:fixed;inset:0;z-index:60;background:#fff;display:flex;flex-direction:column}
        .tiw-sheet-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 20px;background:${C.text};color:#fff;font-size:15px;font-weight:700;flex-shrink:0}
        .tiw-sheet-close{background:none;border:none;color:#fff;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;margin-right:-8px;padding:0}
        .tiw-sheet-body{flex:1;overflow-y:auto;padding:18px 20px 24px;-webkit-overflow-scrolling:touch}
        .tiw-sheet-foot{flex-shrink:0;border-top:1px solid ${C.border};background:#fff;padding:12px 20px calc(12px + env(safe-area-inset-bottom))}
      `}</style>
    </div>
  );
}

/* ── Kleine componenten ── */
export function Thumb({ category, name, size = 44 }: { category: string; name?: string; size?: number }) {
  const fallback = category === 'lens' ? '/images/placeholder-lens.svg' : '/images/placeholder-camera.svg';
  const src = name ? photoFor(name, category) : fallback;
  /* Fallback via state, niet door src imperatief te overschrijven: dat laatste
     maakt de DOM inconsistent met React en blijft dan op de placeholder hangen. */
  const [failed, setFailed] = useState(false);
  useEffect(() => { setFailed(false); }, [src]);
  return (
    <img
      src={failed ? fallback : src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      style={{ width: size, height: size, objectFit: 'cover', borderRadius: 8, background: C.tint, flexShrink: 0 }}
    />
  );
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
export function WizardBanner({ variant, step, back }: { variant: Variant; step: Step; back?: string }) {
  const b = base(variant);
  const steps: { label: string; href: string }[] = [
    { label: 'Wat verkoop je', href: b },
    { label: 'Wil je iets kopen', href: `${b}/kopen` },
    { label: 'Je gegevens', href: `${b}/gegevens` },
    { label: hasBid(variant) ? 'Je bod' : 'Je aanvraag', href: `${b}/${lastPath(variant)}` },
  ];

  return (
    <>
      {/* Op mobiel draait de wizard zonder site-header; deze balk houdt het merk
          zichtbaar en biedt een weg terug naar de winkel. */}
      <div className="tiw-topbar">
        <Link href="/" className="tiw-topbar-logo">
          <img src="/images/logo-black.png" alt="Camera-tweedehands.nl" height={22} />
        </Link>
        <Link href="/" className="tiw-topbar-close" aria-label="Terug naar de webshop">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </Link>
      </div>

    <div className="svc-header svc-header--photo tiw-header" style={{ marginBottom: 0 }}>
      <div className="svc-header__photo" style={{ backgroundImage: 'url(/images/hero-photographer-1.jpg)' }} aria-hidden="true" />
      <div className="container">
        <div className="svc-header__inner">
          <div className="tiw-only-desktop"><Breadcrumb items={[{ label: 'Inruilen & verkopen' }]} /></div>
          <div className="svc-eyebrow tiw-only-desktop">Inruilen &amp; verkopen</div>
          <h1 className={`svc-title tiw-title${step > 1 ? ' tiw-title--step' : ''}`}>Verkoop je gear <span style={{ color: C.accent }}>snel en eerlijk</span></h1>

          {/* Mobiel: één regel in plaats van vier pills — anders staat het zoekveld onder de vouw */}
          <div className="tiw-steps-mini">
            {back && (
              <Link href={back} className="tiw-mini-back" aria-label="Vorige stap">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
              </Link>
            )}
            <span className="tiw-mini-dots" aria-hidden="true">
              {steps.map((x, i) => {
                const n = (i + 1) as Step;
                return <span key={x.label} className={`tiw-mini-dot${n === step ? ' is-active' : ''}${n < step ? ' is-done' : ''}`} />;
              })}
            </span>
            <span className="tiw-mini-label"><strong>Stap {step} van {steps.length}</strong> · {steps[step - 1].label}</span>
          </div>

          <div className="tiw-steps-full" style={{ display: 'flex', gap: 6, marginTop: 20, flexWrap: 'wrap' }}>
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

      <style>{`
        .tiw-steps-mini{display:none}
        @media(max-width:760px){
          /* Kop zo klein mogelijk houden: het zoekveld moet zonder scrollen in beeld. */
          .tiw-header .svc-header__inner{padding-top:18px;padding-bottom:16px}
          .tiw-only-desktop{display:none}
          .tiw-header .tiw-title{font-size:23px;line-height:1.15;margin:0}
          /* Vanaf stap 2 ben je al binnen: de wervende kop kost dan alleen ruimte. */
          .tiw-header .tiw-title--step{display:none}
          .tiw-header .tiw-title--step + .tiw-steps-mini{margin-top:0}
          .tiw-steps-full{display:none !important}
          .tiw-steps-mini{display:flex;align-items:center;gap:10px;margin-top:12px;flex-wrap:wrap}
          .tiw-mini-dots{display:inline-flex;gap:6px}
          .tiw-mini-dot{width:8px;height:8px;border-radius:50%;background:rgba(30,33,51,.16)}
          .tiw-mini-dot.is-done{background:#22c55e}
          .tiw-mini-dot.is-active{background:#E8692A;width:22px;border-radius:999px}
          .tiw-mini-label{font-size:12.5px;color:#6B6D80}
          .tiw-mini-label strong{color:#1E2133;font-weight:700}
          .tiw-mini-back{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;margin:-4px 0 -4px -6px;border-radius:50%;color:#1E2133;text-decoration:none;flex-shrink:0}
        }
        .tiw-topbar{display:none}
        @media(max-width:760px){
          .tiw-topbar{display:flex;align-items:center;justify-content:space-between;padding:10px 20px;background:#fff;border-bottom:1px solid ${C.border}}
          .tiw-topbar-logo{display:inline-flex;align-items:center}
          .tiw-topbar-logo img{height:22px;width:auto}
          .tiw-topbar-close{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;margin-right:-8px;border-radius:50%;color:${C.sec};text-decoration:none}
        }
      `}</style>
    </div>
    </>
  );
}

/** Witte pagina-body — vervangt het oude grijze vlak. Start elk scherm bovenaan. */
export function Page({ children, width = 880 }: { children: React.ReactNode; width?: number }) {
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);
  return (
    <div className="tiw-page" style={{ background: '#fff' }}>
      <div style={{ maxWidth: width, margin: '0 auto', padding: '0 24px' }}>{children}</div>
      <style>{`
        .tiw-page{padding:32px 0 88px}
        @media(max-width:760px){.tiw-page{padding:8px 0 150px}}
        .tiw-add{transition:background .15s ease,box-shadow .15s ease,transform .15s ease}
        .tiw-add:not(:disabled):hover{background:#FFF4EE;box-shadow:0 5px 16px rgba(232,105,42,.2);transform:translateY(-1px)}
      `}</style>
    </div>
  );
}

export function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <>
      {/* Zonder subregel levert de titel zelf de ruimte naar de inhoud eronder. */}
      <h2 className="tiw-page-title" style={sub ? undefined : { marginBottom: 18 }}>{title}</h2>
      {sub && <p className="tiw-page-sub">{sub}</p>}
      <style>{`
        .tiw-page-title{font-size:28px;font-weight:800;letter-spacing:-.02em;margin:10px 0 0;color:${C.text}}
        .tiw-page-sub{color:${C.sec};margin:6px 0 22px;font-size:15px;line-height:1.6}
        @media(max-width:760px){
          .tiw-page-title{font-size:22px;margin:2px 0 0}
          .tiw-page-sub{font-size:14px;margin:4px 0 12px;line-height:1.45}
        }
      `}</style>
    </>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <>
      <Link href={href} className="tiw-backlink">← {label}</Link>
      <style>{`
        .tiw-backlink{font-size:13.5px;color:${C.sec};text-decoration:none;display:inline-flex;align-items:center;gap:6px}
        /* Op mobiel staat de terugweg als pijl in de stapregel — scheelt 30px. */
        @media(max-width:760px){.tiw-backlink{display:none}}
      `}</style>
    </>
  );
}

/** Sticky onderbalk met de enige primaire CTA van het scherm. */
export function StickyBar({ note, cta, disabled, onClick, secondary, width = 880, add = false }: {
  note: React.ReactNode; cta: string; disabled?: boolean; onClick: () => void; secondary?: React.ReactNode; width?: number;
  /** Toevoeg-actie: plusje in plaats van pijl. Kleur blijft groen — dat is de knop
   *  die je verder helpt, en één vaste CTA-kleur leest rustiger. */
  add?: boolean;
}) {
  return (
    <div className="tiw-barwrap">
      <div className="tiw-bar" style={{ maxWidth: width }}>
        <div className="tiw-bar-note">{note}</div>
        <div className="tiw-bar-actions">
          {secondary}
          <button disabled={disabled} onClick={onClick} className="tiw-bar-cta" style={{ ...btnCta, opacity: disabled ? 0.45 : 1, cursor: disabled ? 'default' : 'pointer' }}>{cta} {add ? '+' : '→'}</button>
        </div>
      </div>
      <style>{`
        .tiw-barwrap{position:sticky;bottom:0;background:#fff;border-top:1px solid ${C.border};padding:14px 24px;z-index:15;box-shadow:0 -6px 20px rgba(30,33,51,.05)}
        @media(max-width:760px){
          /* Sticky plakt pas onderaan als de pagina langer is dan het scherm; op korte
             stappen zweeft hij dan middenin. Vastzetten dus. */
          .tiw-barwrap{position:fixed;left:0;right:0;bottom:0;padding-bottom:calc(14px + env(safe-area-inset-bottom))}
        }
        .tiw-bar{margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
        .tiw-bar-note{font-size:13.5px;color:${C.sec}}
        .tiw-bar-actions{display:flex;align-items:center;gap:12px}
        .tiw-bar-cta{padding:15px 30px;white-space:nowrap}
        @media(max-width:760px){
          /* Naast elkaar liepen de knoppen over elkaar heen op smalle schermen. */
          .tiw-bar{gap:8px}
          .tiw-bar-note{font-size:13px;width:100%}
          .tiw-bar-actions{width:100%;flex-direction:row-reverse;justify-content:space-between;gap:10px}
          .tiw-bar-cta{flex:1;justify-content:center;padding:14px 18px;font-size:14.5px}
        }
      `}</style>
    </div>
  );
}

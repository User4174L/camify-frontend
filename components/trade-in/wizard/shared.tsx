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
import type { BuyVariant } from '@/data/trade-in-mock';

export type Variant = 2 | 3;
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
export const btnGhost: React.CSSProperties = { background: '#fff', color: C.text, border: `1.5px solid ${C.text}`, borderRadius: 999, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 8 };
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

/* ── Banner met stappen ── */
export type Step = 1 | 2 | 3 | 4;

/**
 * Donkere banner in de stijl van versie 1, met de vier wizard-stappen als
 * genummerde bollen. Afgerond = groen vinkje en klikbaar terug, actief = oranje.
 */
export function WizardBanner({ variant, step }: { variant: Variant; step: Step }) {
  const b = base(variant);
  const steps: { label: string; desc: string; href: string }[] = [
    { label: 'Wat verkoop je', desc: 'Product, conditie en shuttercount.', href: b },
    { label: 'Wil je iets kopen', desc: 'Optioneel — we verrekenen het direct.', href: `${b}/kopen` },
    { label: 'Je gegevens', desc: 'Zodat we je kunnen bereiken.', href: `${b}/gegevens` },
    hasBid(variant)
      ? { label: 'Je bod', desc: 'Direct in beeld, 7 dagen geldig.', href: `${b}/bod` }
      : { label: 'Aanvraag klaar', desc: 'Je bod volgt per e-mail.', href: `${b}/aanvraag` },
  ];

  return (
    <section className="tiw-banner">
      <div className="tiw-glow" />
      <svg className="tiw-deco" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="30" y="60" width="140" height="100" rx="16" stroke="white" strokeWidth="3" />
        <circle cx="100" cy="110" r="30" stroke="white" strokeWidth="3" />
        <circle cx="100" cy="110" r="18" stroke="white" strokeWidth="2" />
        <rect x="60" y="45" width="40" height="20" rx="6" stroke="white" strokeWidth="2" />
        <circle cx="145" cy="78" r="6" stroke="white" strokeWidth="2" />
      </svg>

      <div className="tiw-inner">
        <span className="tiw-badge"><span className="tiw-dot" /> Inruilen &amp; verkopen</span>
        <h1 className="tiw-title">Verkoop je gear <span style={{ color: '#FF8A4C' }}>snel en eerlijk</span></h1>
        <p className={`tiw-sub${step > 1 ? ' tiw-sub--hide-mobile' : ''}`}>
          {hasBid(variant)
            ? 'Zoek je product, kies de conditie en zie meteen wat wij ervoor betalen. Gratis verzekerd verzenden, geld binnen 3 werkdagen.'
            : 'Zoek je product en kies de conditie. Onze experts kijken ernaar en sturen je binnen 2 werkdagen een persoonlijk bod. Gratis verzekerd verzenden.'}
        </p>

        {/* Mobiel: één regel in plaats van vier gestapelde blokken */}
        <div className="tiw-steps-mini" aria-hidden="true">
          <div className="tiw-mini-dots">
            {steps.map((s, i) => {
              const n = (i + 1) as Step;
              return <span key={s.label} className={`tiw-mini-dot${n === step ? ' is-active' : ''}${n < step ? ' is-done' : ''}`} />;
            })}
          </div>
          <div className="tiw-mini-label"><strong>Stap {step} van {steps.length}</strong> · {steps[step - 1].label}</div>
        </div>

        <ol className="tiw-steps">
          {steps.map((s, i) => {
            const n = (i + 1) as Step;
            const done = n < step;
            const active = n === step;
            const inner = (
              <>
                <span className={`tiw-num${active ? ' is-active' : ''}${done ? ' is-done' : ''}`}>
                  {done ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> : n}
                </span>
                <span className="tiw-step-text">
                  <span className={`tiw-step-label${active ? ' is-active' : ''}`}>{s.label}</span>
                  <span className="tiw-step-desc">{s.desc}</span>
                </span>
                {i < steps.length - 1 && <span className="tiw-line" aria-hidden="true" />}
              </>
            );
            return (
              <li key={s.label} className="tiw-step" aria-current={active ? 'step' : undefined}>
                {done ? <Link href={s.href} className="tiw-step-link">{inner}</Link> : <span className="tiw-step-link">{inner}</span>}
              </li>
            );
          })}
        </ol>
      </div>

      <style>{`
        .tiw-banner{position:relative;overflow:hidden;background:linear-gradient(135deg,#1B1E2E 0%,#262A45 55%,#3A2519 100%)}
        .tiw-glow{position:absolute;top:-120px;right:-80px;width:420px;height:420px;background:radial-gradient(circle,rgba(232,105,42,.35) 0%,rgba(232,105,42,0) 70%);pointer-events:none}
        .tiw-deco{position:absolute;top:-30px;right:-30px;width:340px;height:340px;opacity:.05;pointer-events:none}
        .tiw-inner{position:relative;z-index:1;max-width:940px;margin:0 auto;padding:34px 24px 30px;text-align:center}
        .tiw-badge{display:inline-flex;align-items:center;gap:7px;padding:5px 14px;border-radius:999px;background:rgba(232,105,42,.14);border:1px solid rgba(232,105,42,.3);color:#FF8A4C;font-size:12px;font-weight:600;letter-spacing:.02em;margin-bottom:14px}
        .tiw-dot{width:6px;height:6px;border-radius:50%;background:#FF8A4C;box-shadow:0 0 0 3px rgba(255,138,76,.25)}
        .tiw-title{color:#fff;font-size:clamp(26px,4.4vw,38px);font-weight:700;letter-spacing:-.03em;line-height:1.08;margin:0 0 12px}
        .tiw-sub{color:rgba(255,255,255,.62);font-size:14.5px;line-height:1.6;max-width:600px;margin:0 auto 26px}
        .tiw-steps{display:flex;gap:0;max-width:860px;margin:0 auto;padding:0;list-style:none}
        .tiw-step{flex:1;position:relative;min-width:0}
        .tiw-step-link{display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 8px;text-decoration:none;color:inherit}
        a.tiw-step-link:hover .tiw-step-label{color:#fff}
        .tiw-num{width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center;margin-bottom:11px;font-size:16px;font-weight:700;color:rgba(255,255,255,.5);flex-shrink:0;transition:all .2s}
        .tiw-num.is-active{background:#E8692A;border-color:#E8692A;color:#fff;box-shadow:0 0 0 5px rgba(232,105,42,.18)}
        .tiw-num.is-done{background:#22c55e;border-color:#22c55e;color:#fff}
        .tiw-step-text{display:block;min-width:0}
        .tiw-step-label{display:block;font-size:13.5px;font-weight:600;color:rgba(255,255,255,.62);margin-bottom:3px;transition:color .2s}
        .tiw-step-label.is-active{color:#fff}
        .tiw-step-desc{display:block;font-size:11.5px;color:rgba(255,255,255,.38);line-height:1.45}
        .tiw-line{position:absolute;top:21px;left:calc(50% + 28px);width:calc(100% - 56px);height:1.5px;background:linear-gradient(90deg,rgba(255,255,255,.18),rgba(255,255,255,.04))}
        .tiw-steps-mini{display:none}
        .tiw-mini-dots{display:flex;justify-content:center;gap:7px;margin-bottom:10px}
        .tiw-mini-dot{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.18);transition:all .2s}
        .tiw-mini-dot.is-done{background:#22c55e}
        .tiw-mini-dot.is-active{background:#E8692A;width:26px;border-radius:999px}
        .tiw-mini-label{font-size:13px;color:rgba(255,255,255,.6)}
        .tiw-mini-label strong{color:#fff;font-weight:700}
        @media(max-width:760px){
          .tiw-inner{padding:22px 20px 20px}
          .tiw-deco{width:220px;height:220px}
          .tiw-title{margin-bottom:10px}
          .tiw-sub{font-size:13.5px;margin-bottom:18px}
          .tiw-sub--hide-mobile{display:none}
          .tiw-steps{display:none}
          .tiw-steps-mini{display:block}
        }
      `}</style>
    </section>
  );
}

/** Smalle vertrouwensbalk direct onder de banner. */
export function TrustBar({ variant }: { variant: Variant }) {
  const usps = hasBid(variant)
    ? ['Bod direct in beeld', 'Gratis verzekerd verzenden', 'Geld binnen 3 werkdagen', 'Niet akkoord? Gratis retour']
    : ['Persoonlijk bod van een expert', 'Gratis verzekerd verzenden', 'Geld binnen 3 werkdagen', 'Niet akkoord? Gratis retour'];
  return (
    <div style={{ borderBottom: `1px solid ${C.border}`, background: '#fff' }}>
      <div className="tiw-trust">
        {usps.map((u, i) => (
          <span key={u} className={i > 1 ? 'tiw-usp tiw-usp--desktop' : 'tiw-usp'}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            {u}
          </span>
        ))}
      </div>
      <style>{`
        .tiw-trust{max-width:940px;margin:0 auto;padding:12px 24px;display:flex;flex-wrap:wrap;justify-content:center;gap:8px 26px}
        .tiw-usp{display:inline-flex;align-items:center;gap:7px;font-size:12.5px;color:#6B6D80;font-weight:500}
        @media(max-width:760px){
          .tiw-trust{gap:6px 16px;padding:10px 20px}
          .tiw-usp{font-size:12px}
          .tiw-usp--desktop{display:none}
        }
      `}</style>
    </div>
  );
}

/** Witte pagina-body — vervangt het oude grijze vlak. Start elk scherm bovenaan. */
export function Page({ children, width = 880 }: { children: React.ReactNode; width?: number }) {
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);
  return (
    <div style={{ background: '#fff', padding: '32px 0 88px' }}>
      <div style={{ maxWidth: width, margin: '0 auto', padding: '0 24px' }}>{children}</div>
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

'use client';

/**
 * Referentie-flow: "Bevestig je bod" (klant accepteert een bestaand inruil-bod).
 *
 * Dit is GEEN nieuwe functionaliteit maar een designreferentie voor Mike: de
 * bestaande V2-accepteerflow (storefront /en-eu/quote-bid?token=…) nagebouwd in de
 * designtaal van de vernieuwde inruilwizard. Zelfde stappen en zelfde elementen als
 * V2 (QTE-nummer, verkopen/kopen, BTW-verleggingsuitsplitsing, "Je ontvangt",
 * account-activatie, voorwaarden/nieuwsbrief, Afwijzen, bankgegevens, twee
 * verzendmethodes, datumkiezer bij langsbrengen) — alleen de vormgeving komt uit de
 * wizard. De datumkiezer blijft bewust gelijk aan de huidige V2.
 *
 * Mockdata is hardcoded uit de V2-screenshots (QTE000013).
 */

import { useState } from 'react';
import Link from 'next/link';
import {
  C, card, input, btnCta, btnGhost, Thumb,
} from '@/components/trade-in/wizard/shared';

/* ── Mockdata (uit de V2-screenshots) ── */
const QTE = 'QTE000013';
const SELL = { name: 'Sony 70-200mm f/2.8 G SSM - Sony A', condition: 'Heavily used', price: 1000, category: 'lens' };
const BUY = { name: 'Canon 430EX II Speedlite', price: 69, category: 'accessory', condition: 'Goed', sku: '430211' };
const SHOWROOM = 'Kerkstraat 47 Bis, 4191 AA Geldermalsen';
const SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

type Method = 'verzending' | 'langsbrengen' | null;

/* ── Stappenbalk: identiek aan de inruilwizard (desktop pills / mobiel mini-dots) ── */
const STEPS = ['Overzicht', 'Contactgegevens', 'Verzendmethode', 'Verzendadres'];

function StepBar({ step, total, labels }: { step: number; total: number; labels: string[] }) {
  return (
    <>
      {/* Mobiel */}
      <div className="acc-mini">
        <span className="acc-mini-dots" aria-hidden="true">
          {labels.map((l, i) => {
            const n = i + 1;
            return <span key={l} className={`acc-mini-dot${n === step ? ' is-active' : ''}${n < step ? ' is-done' : ''}`} />;
          })}
        </span>
        <span className="acc-mini-label"><strong>Stap {step} van {total}</strong> · {labels[step - 1]}</span>
      </div>

      {/* Desktop */}
      <div className="acc-pills">
        {labels.map((l, i) => {
          const n = i + 1;
          const active = n === step; const done = n < step;
          return (
            <span key={l} className="acc-pill" aria-current={active ? 'step' : undefined}
              style={{ background: active ? C.text : '#fff', color: active ? '#fff' : done ? C.text : C.sec, border: `1px solid ${active ? C.text : C.border}` }}>
              <span className="acc-pill-num" style={{ background: done ? '#22c55e' : active ? C.accent : C.tint, color: done || active ? '#fff' : C.sec }}>
                {done ? '✓' : n}
              </span>
              {l}
            </span>
          );
        })}
      </div>
      <style>{`
        .acc-pills{display:flex;gap:6px;flex-wrap:wrap}
        .acc-pill{display:inline-flex;align-items:center;gap:8px;padding:6px 14px 6px 6px;border-radius:999px;font-size:12.5px;font-weight:700}
        .acc-pill-num{width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:11px}
        .acc-mini{display:none}
        @media(max-width:760px){
          .acc-pills{display:none}
          .acc-mini{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
          .acc-mini-dots{display:inline-flex;gap:6px}
          .acc-mini-dot{width:8px;height:8px;border-radius:50%;background:rgba(30,33,51,.16)}
          .acc-mini-dot.is-done{background:#22c55e}
          .acc-mini-dot.is-active{background:${C.accent};width:22px;border-radius:999px}
          .acc-mini-label{font-size:12.5px;color:${C.sec}}
          .acc-mini-label strong{color:${C.text};font-weight:700}
        }
      `}</style>
    </>
  );
}

/** Fotoheader in de wizard-stijl, maar met de accepteer-titel. */
function AcceptBanner({ step, total, labels }: { step: number; total: number; labels: string[] }) {
  return (
    <>
      <div className="acc-topbar">
        <Link href="/" className="acc-topbar-logo"><img src="/images/logo-black.png" alt="Camera-tweedehands.nl" height={22} /></Link>
        <span className="acc-topbar-qte">{QTE}</span>
      </div>
      <div className="svc-header svc-header--photo acc-header" style={{ marginBottom: 0 }}>
        <div className="svc-header__photo" style={{ backgroundImage: 'url(/images/hero-photographer-1.jpg)' }} aria-hidden="true" />
        <div className="container">
          <div className="svc-header__inner">
            <div className="svc-eyebrow acc-only-desktop">Inruilen &amp; verkopen · {QTE}</div>
            <h1 className="svc-title acc-title">Bevestig je bod</h1>
            <p className="acc-sub acc-only-desktop">Volg de stappen om het bod te accepteren of af te wijzen.</p>
            <div style={{ marginTop: 18 }}><StepBar step={step} total={total} labels={labels} /></div>
          </div>
        </div>
      </div>
      <style>{`
        .acc-topbar{display:flex;align-items:center;justify-content:space-between;padding:10px 20px;background:#fff;border-bottom:1px solid ${C.border}}
        .acc-topbar-logo img{height:22px;width:auto}
        .acc-topbar-qte{font-size:12px;font-weight:700;color:${C.accent};background:${C.accentSoft};border-radius:999px;padding:4px 12px}
        .acc-header .svc-title{color:${C.text}}
        .acc-sub{color:${C.sec};margin:6px 0 0;font-size:15px}
        @media(max-width:760px){
          .acc-only-desktop{display:none}
          .acc-header .acc-title{font-size:23px;margin:0}
        }
      `}</style>
    </>
  );
}

function Body({ children, width = 720 }: { children: React.ReactNode; width?: number }) {
  return (
    <div style={{ background: '#fff' }} className="acc-body">
      <div style={{ maxWidth: width, margin: '0 auto', padding: '0 24px' }}>{children}</div>
      <style>{`.acc-body{padding:28px 0 40px}@media(max-width:760px){.acc-body{padding:16px 0 40px}}`}</style>
    </div>
  );
}

/** Onderbalk met Terug/Afwijzen links en de primaire groene knop rechts. */
function FooterBar({ back, backLabel = 'Terug', primary, onPrimary, disabled, width = 720 }: {
  back?: () => void; backLabel?: string; primary: string; onPrimary: () => void; disabled?: boolean; width?: number;
}) {
  return (
    <div className="acc-barwrap">
      <div className="acc-bar" style={{ maxWidth: width }}>
        {back ? <button onClick={back} style={{ ...btnGhost, border: `1px solid ${C.border}`, color: C.text, fontWeight: 600 }}>← {backLabel}</button> : <span />}
        <button disabled={disabled} onClick={onPrimary} style={{ ...btnCta, opacity: disabled ? 0.45 : 1, cursor: disabled ? 'default' : 'pointer' }}>{primary} →</button>
      </div>
      <style>{`
        .acc-barwrap{position:sticky;bottom:0;background:#fff;border-top:1px solid ${C.border};padding:14px 24px;z-index:15;box-shadow:0 -6px 20px rgba(30,33,51,.05)}
        @media(max-width:760px){.acc-barwrap{position:fixed;left:0;right:0;bottom:0;padding-bottom:calc(14px + env(safe-area-inset-bottom))}}
        .acc-bar{margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:12px}
        @media(max-width:760px){.acc-bar>button{flex:1;justify-content:center}}
      `}</style>
    </div>
  );
}

const Label = ({ children, req }: { children: React.ReactNode; req?: boolean }) => (
  <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{children}{req && <span style={{ color: C.accent }}> *</span>}</span>
);

const money = (n: number) => `€ ${n.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function AcceptFlowReference() {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<Method>(null);
  const [agree, setAgree] = useState(false);
  const [news, setNews] = useState(true);
  const [slot, setSlot] = useState<string | null>(null);
  const [showDate, setShowDate] = useState(false);
  const [done, setDone] = useState(false);
  const [bankConfirmed, setBankConfirmed] = useState(false);
  const [bankError, setBankError] = useState(false);

  const isLangsbrengen = method === 'langsbrengen';
  const labels = isLangsbrengen ? STEPS.slice(0, 3) : STEPS;
  const total = labels.length;

  /* ── Bevestiging ── */
  if (done) {
    return (
      <>
        <AcceptBanner step={3} total={total} labels={labels} />
        <Body width={640}>
          <div style={{ ...card, padding: 36, textAlign: 'center', marginTop: 8 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px', color: C.text }}>Bedankt voor je bevestiging!</h2>
            <p style={{ color: C.sec, margin: '0 auto 20px', maxWidth: 460, fontSize: 14.5, lineHeight: 1.6 }}>
              Je ontvangt binnen enkele minuten een bevestigingsmail met verdere instructies.
              {isLangsbrengen && slot && <> Je bent welkom op <strong style={{ color: C.text }}>dinsdag 25 augustus om {slot}</strong>.</>}
            </p>
            <Link href="/" style={{ ...btnGhost, border: `1px solid ${C.border}`, color: C.text, fontWeight: 600, textDecoration: 'none' }}>Terug naar home</Link>
          </div>
        </Body>
      </>
    );
  }

  /* ── Datumkiezer (langsbrengen) — bewust gelijk aan de huidige V2 ── */
  if (showDate) {
    return (
      <>
        <AcceptBanner step={3} total={total} labels={labels} />
        <Body width={560}>
          <div style={{ ...card, background: C.accentSoft, border: `1px solid ${C.border}`, padding: 18, marginBottom: 20 }}>
            <div style={{ fontWeight: 700, color: C.text }}>Langsbrengen in showroom</div>
            <div style={{ fontSize: 13.5, color: C.sec, marginTop: 4, lineHeight: 1.5 }}>Breng je apparatuur persoonlijk langs<br />{SHOWROOM}</div>
          </div>

          <div className="svc-eyebrow" style={{ margin: '0 0 8px' }}>Datum</div>
          <select style={{ ...input, marginBottom: 22 }} defaultValue="di">
            <option value="di">Dinsdag 25 augustus</option>
            <option value="wo">Woensdag 26 augustus</option>
            <option value="do">Donderdag 27 augustus</option>
          </select>

          <div className="svc-eyebrow" style={{ margin: '0 0 8px' }}>Tijd</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {SLOTS.map(t => {
              const on = slot === t;
              return (
                <button key={t} onClick={() => setSlot(t)} style={{
                  padding: '12px 0', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  border: `1.5px solid ${on ? C.text : C.border}`, background: on ? C.text : '#fff', color: on ? '#fff' : C.text,
                }}>{t}</button>
              );
            })}
          </div>
        </Body>
        <FooterBar width={560} back={() => setShowDate(false)} primary="Bevestigen" disabled={!slot} onPrimary={() => setDone(true)} />
      </>
    );
  }

  return (
    <>
      <AcceptBanner step={step} total={total} labels={labels} />

      {/* ── Stap 1: Overzicht ── */}
      {step === 1 && (
        <>
          <Body width={720}>
            {/* Variatie: groot bod-/uitbetaalbedrag bovenaan zodat meteen duidelijk is
                wat wij bieden én wat de klant ontvangt. */}
            <div style={{ ...card, padding: 0, overflow: 'hidden', marginBottom: 14, border: 'none', background: 'linear-gradient(135deg, #1B1E2E 0%, #2A2D45 60%, #3A2519 100%)' }}>
              <div style={{ padding: '20px 24px', color: '#fff' }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: '#FF8A4C' }}>Je ontvangt</div>
                <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.1, marginTop: 4 }}>{money(931)}</div>
                <div style={{ fontSize: 13, opacity: .82, marginTop: 6 }}>Ons bod voor je spullen {money(1000)} · je aankoop − {money(69)}</div>
              </div>
            </div>

            <div style={{ ...card, padding: 24 }}>
              <div className="svc-eyebrow" style={{ margin: 0 }}>Overzicht</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.text, margin: '2px 0 18px' }}>{QTE}</div>

              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: '0 0 8px' }}>Verkopen</div>
              <div className="acc-item" style={{ ...card, borderLeft: `4px solid ${C.accent}`, padding: '14px 18px', marginBottom: 18 }}>
                <Thumb category={SELL.category} name={SELL.name} />
                <div style={{ flex: '1 1 150px', minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{SELL.name}</div>
                  <div style={{ fontSize: 13, color: C.sec, marginTop: 6, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>Conditie: <span style={{ background: '#FEE2E2', color: '#b91c1c', borderRadius: 999, padding: '2px 10px', fontWeight: 700, fontSize: 12 }}>{SELL.condition}</span></div>
                </div>
                <div className="acc-item-price">{money(SELL.price)}</div>
              </div>

              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: '0 0 8px' }}>Kopen</div>
              <div className="acc-item" style={{ ...card, borderLeft: `4px solid ${C.accent}`, padding: '14px 18px', marginBottom: 18 }}>
                <Thumb category={BUY.category} name={BUY.name} />
                <div style={{ flex: '1 1 150px', minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{BUY.name}</div>
                  <div style={{ fontSize: 13, color: C.sec, marginTop: 4 }}>Conditie: <strong style={{ color: C.text }}>{BUY.condition}</strong> · SKU {BUY.sku}</div>
                </div>
                <div className="acc-item-price">{money(BUY.price)}</div>
              </div>
              <style>{`
                .acc-item{display:flex;align-items:center;gap:14px}
                .acc-item-price{font-weight:800;font-size:16px;color:${C.text};white-space:nowrap;margin-left:auto}
                @media(max-width:520px){
                  .acc-item{flex-wrap:wrap}
                  .acc-item-price{width:100%;margin-left:0;padding-left:58px}
                }
              `}</style>

              {/* Uitsplitsing */}
              <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '12px 18px', borderBottom: `1px solid ${C.border}` }} className="svc-eyebrow">Overzicht</div>
                <div style={{ padding: '4px 18px' }}>
                  <Row label="Subtotaal inkoop" value={money(1000)} />
                  <Row label={<>BTW 0% <span style={{ color: C.sec }}>· verlegd</span></>} value={money(0)} muted />
                  <Row label="Totaal inkoop" value={money(1000)} bold />
                  <Row label="Subtotaal aankoop" value={money(69)} top />
                  <Row label={<>BTW 0% <span style={{ color: C.sec }}>· marge</span></>} value={money(0)} muted />
                  <Row label="Totaal aankoop" value={money(69)} bold />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F0FDF4', padding: '14px 18px', borderTop: `1px solid ${C.border}` }}>
                  <strong style={{ color: '#15803d', fontSize: 15 }}>Je ontvangt</strong>
                  <strong style={{ color: '#15803d', fontSize: 18 }}>{money(931)}</strong>
                </div>
              </div>

              <div style={{ ...card, background: C.tint, padding: '14px 18px', marginTop: 16, fontSize: 13.5, lineHeight: 1.55 }}>
                <strong style={{ color: C.text }}>Accountactivatie in afwachting.</strong> <span style={{ color: C.sec }}>Wanneer je deze offerte indient, sturen we je een nieuwe activatiemail zodat je je account later kunt activeren.</span>
              </div>
            </div>

            {/* Voorwaarden + nieuwsbrief */}
            <div style={{ ...card, padding: 18, marginTop: 14 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: C.text, cursor: 'pointer' }}>
                <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} style={{ width: 16, height: 16, accentColor: C.accent }} />
                Ik ga akkoord met de <a href="/terms" style={{ color: C.accent }}>algemene voorwaarden</a>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: C.text, cursor: 'pointer', marginTop: 10 }}>
                <input type="checkbox" checked={news} onChange={e => setNews(e.target.checked)} style={{ width: 16, height: 16, accentColor: C.accent }} />
                Ik schrijf me in voor de nieuwsbrief
              </label>
            </div>
          </Body>

          <div className="acc-barwrap-1">
            <div className="acc-bar-1">
              <button style={{ ...btnGhost, border: `1px solid ${C.border}`, color: C.text, fontWeight: 600 }}>Afwijzen</button>
              <button disabled={!agree} onClick={() => setStep(2)} style={{ ...btnCta, opacity: agree ? 1 : 0.45, cursor: agree ? 'pointer' : 'default' }}>Naar contactgegevens →</button>
            </div>
            <style>{`
              .acc-barwrap-1{position:sticky;bottom:0;background:#fff;border-top:1px solid ${C.border};padding:14px 24px;z-index:15;box-shadow:0 -6px 20px rgba(30,33,51,.05)}
              @media(max-width:760px){.acc-barwrap-1{position:fixed;left:0;right:0;bottom:0;padding-bottom:calc(14px + env(safe-area-inset-bottom))}}
              .acc-bar-1{max-width:720px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:12px}
              @media(max-width:760px){.acc-bar-1>button{flex:1;justify-content:center}}
            `}</style>
          </div>
        </>
      )}

      {/* ── Stap 2: Contactgegevens ── */}
      {step === 2 && (
        <>
          <Body width={720}>
            <div style={{ ...card, padding: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 4px', color: C.text }}>Contactgegevens aanvullen</h2>
              <p style={{ color: C.sec, fontSize: 14, margin: '0 0 18px' }}>We gebruiken deze gegevens voor de afhandeling.</p>

              <div className="acc-grid">
                <Field label="E-mailadres" req><input style={input} defaultValue="j***k@gmail.com" /></Field>
                <Field label="Telefoonnummer" req><input style={input} defaultValue="+31 615894922" /></Field>
              </div>
              <Field label="Land" req full>
                <select style={input} defaultValue="FR"><option value="FR">Frankrijk</option><option value="NL">Nederland</option><option value="BE">België</option></select>
              </Field>
              <div className="acc-grid-3">
                <Field label="Postcode" req><input style={input} defaultValue="71190" /></Field>
                <Field label="Huisnr." req><input style={input} defaultValue="1" /></Field>
                <Field label="Toev."><input style={input} placeholder="A" /></Field>
              </div>
              <p style={{ fontSize: 12.5, color: C.sec, margin: '2px 0 14px' }}>Dit adres is niet geverifieerd — controleer de gegevens goed.</p>
              <Field label="Straat" req full><input style={input} defaultValue="Rue du Mont Fran" /></Field>
              <Field label="Plaats" req full><input style={input} defaultValue="Dettey" /></Field>
              <div className="acc-grid">
                <Field label="KVK nummer"><input style={input} defaultValue="12345678" /></Field>
                <Field label="BTW nummer"><input style={input} defaultValue="FR10402571889" /></Field>
              </div>

              <div style={{ borderTop: `1px solid ${C.border}`, margin: '20px 0 18px' }} />
              <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 4px', color: C.text }}>Bankgegevens</h3>
              <p style={{ color: C.sec, fontSize: 14, margin: '0 0 16px' }}>Vul hieronder je bankgegevens in zodat we het bedrag kunnen overmaken.</p>
              <Field label="Naam rekeninghouder" req full><input style={input} defaultValue="jan frankrijk" /></Field>
              <Field label="IBAN" req full><input style={input} placeholder="NL00 BANK 0000 0000 00" /></Field>
              <div style={{ ...card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 16px', marginTop: 6, border: `1.5px solid ${bankConfirmed ? '#22c55e' : bankError ? '#dc2626' : C.border}` }}>
                <span style={{ fontSize: 13.5, color: bankConfirmed ? C.text : C.sec }}>
                  {bankConfirmed ? 'Je bankgegevens zijn bevestigd.' : 'Bevestig dat je bankgegevens kloppen.'}
                </span>
                {bankConfirmed ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#15803d', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>Bevestigd
                  </span>
                ) : (
                  <button onClick={() => { setBankConfirmed(true); setBankError(false); }} style={{ ...btnCta, padding: '10px 18px', fontSize: 14 }}>Gegevens kloppen</button>
                )}
              </div>
              {bankError && !bankConfirmed && (
                <p style={{ margin: '8px 2px 0', fontSize: 13, color: '#dc2626', fontWeight: 600 }}>Bevestig eerst dat je bankgegevens kloppen om verder te gaan.</p>
              )}
            </div>
          </Body>
          <FooterBar back={() => setStep(1)} primary="Naar verzendmethode" onPrimary={() => { if (!bankConfirmed) { setBankError(true); return; } setStep(3); }} />
        </>
      )}

      {/* ── Stap 3: Verzendmethode ── */}
      {step === 3 && (
        <>
          <Body width={720}>
            <div style={{ ...card, padding: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 4px', color: C.text }}>Hoe wil je je apparatuur aanleveren?</h2>
              <p style={{ color: C.sec, fontSize: 14, margin: '0 0 18px' }}>Kies een verzendmethode die het beste bij je past.</p>

              {([
                { id: 'verzending', title: 'Verzending', sub: 'Stuur je apparatuur gratis verzekerd op', icon: <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7M5.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" /> },
                { id: 'langsbrengen', title: 'Langsbrengen in showroom', sub: 'Breng je apparatuur persoonlijk langs', icon: <path d="M3 9l1-5h16l1 5M3 9h18v11H3zM3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" /> },
              ] as const).map(o => {
                const on = method === o.id;
                return (
                  <button key={o.id} onClick={() => setMethod(o.id)} style={{
                    ...card, width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', marginBottom: 12,
                    border: `1.5px solid ${on ? C.text : C.border}`, background: on ? C.tint : '#fff',
                  }}>
                    <span style={{ width: 40, height: 40, borderRadius: 10, background: on ? C.accentSoft : C.tint, color: on ? C.accent : C.sec, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{o.icon}</svg>
                    </span>
                    <span style={{ flex: 1 }}>
                      <span style={{ display: 'block', fontWeight: 700, fontSize: 15, color: C.text }}>{o.title}</span>
                      <span style={{ display: 'block', fontSize: 13.5, color: C.sec, marginTop: 2 }}>{o.sub}</span>
                    </span>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${on ? C.accent : C.border}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {on && <span style={{ width: 10, height: 10, borderRadius: '50%', background: C.accent }} />}
                    </span>
                  </button>
                );
              })}
            </div>
          </Body>
          <FooterBar
            back={() => setStep(2)}
            primary="Bevestigen"
            disabled={!method}
            onPrimary={() => { if (method === 'langsbrengen') setShowDate(true); else setStep(4); }}
          />
        </>
      )}

      {/* ── Stap 4: Verzendadres (alleen bij verzending) ── */}
      {step === 4 && !isLangsbrengen && (
        <>
          <Body width={720}>
            <div style={{ ...card, padding: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 4px', color: C.text }}>Verzendadres</h2>
              <p style={{ color: C.sec, fontSize: 14, margin: '0 0 18px' }}>We sturen een gratis verzekerd verzendlabel naar dit adres.</p>
              <Field label="Naam" req full><input style={input} defaultValue="jan frankrijk" /></Field>
              <div className="acc-grid-3">
                <Field label="Postcode" req><input style={input} defaultValue="71190" /></Field>
                <Field label="Huisnr." req><input style={input} defaultValue="1" /></Field>
                <Field label="Toev."><input style={input} placeholder="A" /></Field>
              </div>
              <Field label="Straat" req full><input style={input} defaultValue="Rue du Mont Fran" /></Field>
              <Field label="Plaats" req full><input style={input} defaultValue="Dettey" /></Field>
              <Field label="Land" req full>
                <select style={input} defaultValue="FR"><option value="FR">Frankrijk</option><option value="NL">Nederland</option></select>
              </Field>
            </div>
          </Body>
          <FooterBar back={() => setStep(3)} primary="Bevestigen" onPrimary={() => setDone(true)} />
        </>
      )}
    </>
  );
}

function Row({ label, value, muted, bold, top }: { label: React.ReactNode; value: string; muted?: boolean; bold?: boolean; top?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', fontSize: 13.5, color: muted ? C.sec : C.text, fontWeight: bold ? 700 : 400, borderTop: top ? `1px solid ${C.border}` : undefined, marginTop: top ? 6 : 0, paddingTop: top ? 14 : 8 }}>
      <span>{label}</span><span style={{ whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  );
}

function Field({ label, req, full, children }: { label: string; req?: boolean; full?: boolean; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14, gridColumn: full ? '1 / -1' : undefined }}>
      <Label req={req}>{label}</Label>
      {children}
      <style>{`.acc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 14px}.acc-grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:0 14px}@media(max-width:620px){.acc-grid,.acc-grid-3{grid-template-columns:1fr}}`}</style>
    </label>
  );
}

'use client';

/**
 * Landingspagina inruilen & verkopen — losstaand van de wizard.
 *
 * Hier landt extern verkeer (advertenties, Google). Deze pagina geeft de context
 * die de wizard bewust niet meer geeft: hoe het werkt, wat je krijgt, waarom bij
 * ons. De wizard is een taakflow en begint pas na "Start met verkopen of
 * inruilen"; op mobiel draait die afgesloten, dus alle vertrouwensinformatie
 * hoort híér te staan, vóór iemand begint.
 *
 * In V2 hoort dit een gewone landingspagina uit de blokkenbibliotheek te zijn
 * (dashboard/landing-pages), geen maatwerkcode.
 */

import Link from 'next/link';
import { useState } from 'react';

const C = { text: '#1E2133', sec: '#6B6D80', border: '#EEEEF2', tint: '#FAFAFC', accent: '#E8692A', accentSoft: '#FFF4EE' };
const START = '/trade-in/v2';

function StartKnop({ variant = 'solid' }: { variant?: 'solid' | 'light' }) {
  return (
    <Link href={START} className={`lp-cta${variant === 'light' ? ' lp-cta--light' : ''}`}>
      Start met verkopen of inruilen
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </Link>
  );
}

const STAPPEN = [
  { n: 1, t: 'Vertel wat je hebt', d: 'Zoek je camera, lens of accessoire en kies de conditie. Twee minuten werk, ook voor meerdere items tegelijk.' },
  { n: 2, t: 'Je bod binnen 2 tot 3 werkdagen', d: 'Een van onze experts kijkt ernaar — geen automaat. Je krijgt het bod per e-mail en beslist dan pas.' },
  { n: 3, t: 'Gratis opsturen, geld op je rekening', d: 'Ga je akkoord, dan krijg je een gratis verzekerd verzendlabel. Na controle staat het geld binnen 3 werkdagen op je rekening.' },
];

const USPS = [
  { t: 'Geen verkoopkosten', d: 'Wat we bieden, krijg je. Geen commissie, geen verrassingen achteraf.' },
  { t: 'Gratis en verzekerd verzenden', d: 'Wij regelen het label en de verzekering. Onderweg iets kwijt? Ons risico, niet dat van jou.' },
  { t: 'Niet akkoord? Gratis retour', d: 'Wijkt de staat af van wat je opgaf, dan passen we het bod aan. Ben je het er niet mee eens, dan sturen we alles gratis terug.' },
  { t: 'Ook inruilen', d: 'Zoek iets uit onze voorraad en we verrekenen het met je bod. Scheelt je een aparte bestelling.' },
];

const WATKOPENWE = ['Systeem- en spiegelreflexcamera’s', 'Lenzen', 'Cinema- en videocamera’s', 'Flitsers en studiolicht', 'Statieven en gimbals', 'Adapters en accessoires'];

const FAQ = [
  { v: 'Wat zijn mijn spullen waard?', a: 'Dat hangt af van het model, de staat en bij camera’s de shuttercount. We vergelijken met wat vergelijkbare exemplaren op dit moment opbrengen en doen een bod dat we ook echt betalen. Je zit nergens aan vast tot je akkoord geeft.' },
  { v: 'Hoe weet ik mijn shuttercount?', a: 'Bij de meeste merken lees je die uit een foto van je camera. Er staat een hulp in de aanvraag, en anders vullen we het bij ontvangst zelf aan. Weet je het niet zeker? Kies gewoon de laagste optie.' },
  { v: 'Moet ik alles compleet opsturen?', a: 'Het bod gaat uit van de originele accessoires: accu, lader, doppen en riem. Ontbreekt er iets, geef het aan — dan houden we er meteen rekening mee in plaats van achteraf.' },
  { v: 'Ik verkoop zakelijk, kan dat?', a: 'Ja. Vink dat aan bij je gegevens en vul je btw-nummer in; we regelen de btw dan zoals het hoort — in Nederland met btw, binnen de EU verlegd, daarbuiten 0%.' },
  { v: 'Mijn model staat er niet tussen', a: 'Typ de naam en voeg het toch toe. Onze experts beoordelen het dan handmatig — juist bij oudere of zeldzame spullen is dat vaak in je voordeel.' },
];

export default function InruilLandingPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="lp">
      {/* Hero — de startknop staat bewust boven de vouw */}
      <section className="lp-hero">
        <div className="lp-hero__photo" style={{ backgroundImage: 'url(/images/hero-photographer-1.jpg)' }} aria-hidden="true" />
        <div className="lp-wrap lp-hero__inner">
          <span className="lp-eyebrow">Inruilen &amp; verkopen</span>
          <h1>Verkoop je gear <span>snel en eerlijk</span></h1>
          <p className="lp-lead">
            Ligt er een camera of lens ongebruikt in de kast? Wij kopen hem in — of ruil hem in tegen iets wat je wél gebruikt.
            Binnen 2 tot 3 werkdagen heb je een bod van een expert.
          </p>
          <StartKnop />
          <p className="lp-note">Gratis en vrijblijvend · je beslist pas als je het bod hebt gezien</p>
        </div>
      </section>

      <div className="lp-trust">
        <div className="lp-wrap lp-trust__inner">
          {['Geen verkoopkosten', 'Gratis verzekerd verzenden', 'Geld binnen 3 werkdagen', '9,8 op Trustpilot'].map(t => (
            <span key={t}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              {t}
            </span>
          ))}
        </div>
      </div>

      <section className="lp-wrap lp-section">
        <h2>Zo werkt het</h2>
        <div className="lp-steps">
          {STAPPEN.map(s => (
            <div key={s.n} className="lp-step">
              <span className="lp-step__n">{s.n}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-band">
        <div className="lp-wrap lp-section">
          <h2>Waarom bij ons</h2>
          <div className="lp-usps">
            {USPS.map(u => (
              <div key={u.t} className="lp-usp">
                <h3>{u.t}</h3>
                <p>{u.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-wrap lp-section">
        <h2>Wat we inkopen</h2>
        <p className="lp-sub">Van instap tot professioneel, van vorig jaar tot twintig jaar oud. Twijfel je of jouw spullen erbij horen? Vraag het gewoon aan.</p>
        <ul className="lp-tags">{WATKOPENWE.map(k => <li key={k}>{k}</li>)}</ul>
      </section>

      <section className="lp-band">
        <div className="lp-wrap lp-section">
          <h2>Veelgestelde vragen</h2>
          <div className="lp-faq">
            {FAQ.map((f, i) => (
              <div key={f.v} className={open === i ? 'lp-faq__item is-open' : 'lp-faq__item'}>
                <button onClick={() => setOpen(open === i ? null : i)}>
                  {f.v}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 9l6 6 6-6" /></svg>
                </button>
                {open === i && <p>{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-wrap lp-section lp-end">
        <h2>Benieuwd wat je krijgt?</h2>
        <p className="lp-sub">Je aanvraag kost twee minuten en verplicht je tot niets.</p>
        <StartKnop />
      </section>

      <style>{`
        .lp{background:#fff;color:${C.text}}
        .lp-wrap{max-width:1040px;margin:0 auto;padding:0 24px}
        .lp-section{padding:56px 24px}
        .lp-section h2{font-size:clamp(22px,3vw,30px);font-weight:800;letter-spacing:-.02em;margin:0 0 8px}
        .lp-sub{color:${C.sec};font-size:15.5px;line-height:1.65;margin:0 0 26px;max-width:620px}
        .lp-hero{position:relative;overflow:hidden;background:${C.tint}}
        .lp-hero__photo{position:absolute;inset:0;background-size:cover;background-position:center 30%}
        /* Sluier over de foto: zonder dit loopt de tekst er onleesbaar overheen. */
        .lp-hero::after{content:'';position:absolute;inset:0;background:linear-gradient(100deg,#fff 0%,rgba(255,255,255,.94) 42%,rgba(255,255,255,.55) 68%,rgba(255,255,255,.25) 100%)}
        .lp-hero__inner{position:relative;z-index:1}
        .lp-hero__inner{padding-top:52px;padding-bottom:48px}
        .lp-eyebrow{display:inline-block;font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:${C.accent};margin-bottom:12px}
        .lp-hero h1{font-size:clamp(30px,5.2vw,46px);font-weight:800;letter-spacing:-.03em;line-height:1.08;margin:0 0 14px}
        .lp-hero h1 span{color:${C.accent}}
        .lp-lead{font-size:16.5px;line-height:1.65;max-width:560px;margin:0 0 26px}
        .lp-note{font-size:13px;color:${C.sec};margin:12px 0 0}
        .lp-cta{display:inline-flex;align-items:center;justify-content:center;gap:10px;background:#16A34A;color:#fff;border-radius:999px;padding:16px 30px;font-size:16px;font-weight:700;text-decoration:none;box-shadow:0 8px 22px rgba(22,163,74,.25);transition:transform .15s,box-shadow .15s}
        .lp-cta:hover{transform:translateY(-1px);box-shadow:0 12px 26px rgba(22,163,74,.3)}
        .lp-cta--light{background:#fff;color:${C.text};border:1.5px solid ${C.text};box-shadow:none}
        .lp-trust{border-top:1px solid ${C.border};border-bottom:1px solid ${C.border};background:#fff}
        .lp-trust__inner{display:flex;flex-wrap:wrap;gap:10px 28px;padding-top:14px;padding-bottom:14px}
        .lp-trust__inner span{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:${C.sec};font-weight:500}
        .lp-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:8px}
        .lp-step{border:1px solid ${C.border};border-radius:16px;padding:22px}
        .lp-step__n{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:${C.accentSoft};color:${C.accent};font-weight:800;font-size:15px;margin-bottom:12px}
        .lp-step h3{font-size:16.5px;font-weight:800;margin:0 0 6px}
        .lp-step p{font-size:14.5px;line-height:1.6;color:${C.sec};margin:0}
        .lp-band{background:${C.tint};border-top:1px solid ${C.border};border-bottom:1px solid ${C.border}}
        .lp-usps{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
        .lp-usp h3{font-size:16px;font-weight:800;margin:0 0 6px}
        .lp-usp p{font-size:14.5px;line-height:1.6;color:${C.sec};margin:0}
        .lp-tags{list-style:none;display:flex;flex-wrap:wrap;gap:10px;padding:0;margin:0}
        .lp-tags li{border:1px solid ${C.border};border-radius:999px;padding:9px 16px;font-size:14px;background:#fff}
        .lp-faq__item{border-bottom:1px solid ${C.border}}
        .lp-faq__item button{width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;background:none;border:none;padding:16px 0;font-family:inherit;font-size:15.5px;font-weight:700;color:${C.text};cursor:pointer;text-align:left}
        .lp-faq__item svg{flex-shrink:0;transition:transform .2s}
        .lp-faq__item.is-open svg{transform:rotate(180deg)}
        .lp-faq__item p{margin:0 0 18px;font-size:14.5px;line-height:1.7;color:${C.sec};max-width:760px}
        .lp-end{text-align:center}
        .lp-end .lp-sub{margin-left:auto;margin-right:auto}
        @media(max-width:860px){
          .lp-steps{grid-template-columns:1fr}
          .lp-usps{grid-template-columns:1fr}
        }
        @media(max-width:760px){
          .lp-section{padding:36px 20px}
          .lp-wrap{padding:0 20px}
          .lp-hero__inner{padding-top:34px;padding-bottom:32px}
          .lp-hero::after{background:linear-gradient(180deg,rgba(255,255,255,.97) 0%,rgba(255,255,255,.92) 55%,rgba(255,255,255,.86) 100%)}
          .lp-lead{font-size:15.5px;margin-bottom:22px}
          .lp-cta{width:100%;padding:16px 22px}
          .lp-trust__inner{gap:8px 18px}
          .lp-trust__inner span{font-size:12.5px}
        }
      `}</style>
    </div>
  );
}

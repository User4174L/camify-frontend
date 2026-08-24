'use client';

/**
 * Landingspagina inruilen & verkopen.
 *
 * Dit is de conversiepagina waar extern verkeer landt (advertenties, Google).
 * Doel: iemand die ons nog niet kent binnen één schermlengte laten zien wat hij
 * krijgt, en daarna genoeg vertrouwen opbouwen om te starten. De diepte staat op
 * de bestaande contentpagina's; daar linken we naartoe in plaats van alles te
 * herhalen.
 *
 * Inhoud is gebaseerd op OneDrive "Teksten website/07-verkopen-en-inruilen.md",
 * met 05-productcondities en 06-shuttercount voor de conditie- en shutteruitleg.
 *
 * In V2 hoort dit een landingspagina uit de blokkenbibliotheek te zijn
 * (dashboard/landing-pages), geen maatwerkcode.
 */

import Link from 'next/link';
import { useState } from 'react';

const C = { text: '#1E2133', sec: '#6B6D80', border: '#EEEEF2', tint: '#FAFAFC', accent: '#E8692A', accentSoft: '#FFF4EE' };
const START = '/trade-in/v2';

function StartKnop({ klein = false }: { klein?: boolean }) {
  return (
    <Link href={START} className={`lp-cta${klein ? ' lp-cta--klein' : ''}`}>
      Start met verkopen of inruilen
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </Link>
  );
}

/* Aandelen uit onze eigen inkoop: 940 ingeruilde items, maart t/m augustus 2026.
   Merknamen staan er ook om SEO-redenen: "canon camera inruilen", "nikon lens
   verkopen" en "sony lens verkopen" zijn zoektermen waarop we nu misgrijpen. */
const MERKEN = [
  { m: 'Nikon', f: '/images/nikon-z8.jpg' },
  { m: 'Canon', f: '/images/canon-r5.jpg' },
  { m: 'Sony', f: '/images/sony-a7-iv.jpg' },
  { m: 'Fujifilm', f: '/images/fujifilm-x-t4.jpg' },
  { m: 'Leica', f: '/images/lenses/leica-50-f24.webp' },
  { m: 'Hasselblad', f: '/images/hasselblad-x2d-100c.jpg' },
];

const STAPPEN = [
  { n: 1, t: 'Vraag een bod aan', d: 'Vul in welk toestel je hebt en in welke staat. Twee minuten werk, ook voor meerdere items tegelijk. Je hoort binnen 2 tot 3 werkdagen van ons.' },
  { n: 2, t: 'Stuur het gratis op', d: 'Ga je akkoord, dan krijg je een verzendlabel van ons. Verzenden is gratis en het pakket is bij ons verzekerd — onderweg iets kwijt is ons probleem, niet dat van jou.' },
  { n: 3, t: 'Wij controleren', d: 'Onze specialisten kijken je toestel na: werking, glas, sensor, behuizing en de shuttercount. Klopt het met je omschrijving, dan bevestigen we het bod.' },
  { n: 4, t: 'Je krijgt je geld', d: 'Binnen 3 werkdagen na goedkeuring staat het bedrag op je rekening. Ruil je in, dan verrekenen we het meteen met je aankoop.' },
];

const INKOOP = [
  { t: 'Camera’s', d: 'Systeem, spiegelreflex, compact en middenformaat' },
  { t: 'Lenzen', d: 'Alle vattingen, van kit tot pro-glas' },
  { t: 'Cinema en video', d: 'Camera’s, cine-lenzen, recorders en monitors' },
  { t: 'Studio en licht', d: 'Flitsers, continulicht, statieven en gimbals' },
  { t: 'Accessoires', d: 'Adapters, filters, grips en meer' },
  { t: 'Analoog en klassiek', d: 'Ook oudere apparatuur waar anderen niet aan beginnen' },
];

const TIPS = [
  { t: 'Wees eerlijk over de staat', d: 'Een realistische omschrijving levert uiteindelijk meer op dan een optimistische. Schat je te rooskleurig in, dan volgt een aangepast bod en verlies je tijd.' },
  { t: 'Stuur mee wat erbij hoort', d: 'De originele doos, lader, accu, doppen en riem verhogen de waarde. Vermeld ze bij je aanvraag.' },
  { t: 'Maak het schoon', d: 'Een toestel dat er verzorgd uitziet wordt beter beoordeeld. Dat is geen truc — het zegt vaak iets over hoe ermee is omgegaan.' },
];

const FAQ = [
  {
    v: 'Hoe komen jullie aan een bod?',
    a: 'We kijken naar het model, de conditie en wat het toestel op dit moment op de markt doet. Ons eerste bod is een schatting op basis van jouw omschrijving; na controle bevestigen we het of passen we het aan. Een bod is zeven dagen geldig.',
  },
  {
    v: 'Wat als jullie bod na controle lager uitvalt?',
    a: 'Dan krijg je dat te zien met de reden erbij. Je mag het weigeren — dan sturen we je apparatuur kosteloos terug. Je zit nergens aan vast tot je zelf akkoord geeft.',
  },
  {
    v: 'Hoe weet ik mijn shuttercount?',
    a: 'Bij de meeste merken lees je die uit een foto van je camera. Er staat een hulp in de aanvraag en anders vullen we het bij ontvangst zelf aan. Weet je het niet zeker, kies dan de laagste optie.',
    link: { href: '/shuttercount', t: 'Meer over shuttercount' },
  },
  {
    v: 'Welke conditie moet ik kiezen?',
    a: 'Kies de conditie die je toestel het eerlijkst omschrijft. Twijfel je tussen twee, neem dan de laagste: bij ontvangst beoordelen we eerlijk en valt het bod zo nodig hoger uit.',
    link: { href: '/quality-grading', t: 'Wat de condities betekenen' },
  },
  {
    v: 'Wat gebeurt er met mijn spullen als ik het bod afwijs?',
    a: 'Die sturen we kosteloos terug. Eén ding vooraf: om een toestel goed te kunnen beoordelen verwijderen we soms stickers, beschermfolie, filters of beschadigde accu’s. Gaat de verkoop niet door, dan draaien we dat niet terug.',
  },
  {
    v: 'Ik verkoop zakelijk, kan dat?',
    a: 'Ja. Vink dat aan bij je gegevens en vul je btw-nummer in. Ben je binnen de EU buiten Nederland gevestigd, dan werken we met btw-verlegging; je ontvangt dan een bedrag exclusief btw met die vermelding erbij. Op de offerte staat hoe het bedrag is opgebouwd.',
  },
  {
    v: 'Mijn model staat er niet tussen',
    a: 'Typ de naam en voeg het toch toe — dan beoordelen onze experts het handmatig. Juist bij oudere, zeldzame of middenformaat-apparatuur pakt dat vaak goed uit.',
  },
];

const LINKS = [
  { href: '/quality-grading', t: 'Productcondities', d: 'Wat elke conditie precies betekent' },
  { href: '/shuttercount', t: 'Shuttercount', d: 'Wat het getal zegt en hoe zwaar het weegt' },
  { href: '/shipping-returns', t: 'Verzenden', d: 'Hoe het opsturen werkt en wat wij dekken' },
  { href: '/how-it-works', t: 'Hoe het werkt', d: 'Onze werkwijze van aanvraag tot uitbetaling' },
  { href: '/faq', t: 'Veelgestelde vragen', d: 'Alle vragen over kopen en verkopen' },
  { href: '/contact', t: 'Contact', d: 'Bel of mail — we denken graag mee' },
];

export default function InruilLandingPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="lp">
      {/* Hero — startknop staat bewust boven de vouw */}
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

      {/* Zo werkt het */}
      <section className="lp-wrap lp-section">
        <h2>Zo werkt het</h2>
        <p className="lp-sub">Van aanvraag tot geld op je rekening. Je zit nergens aan vast tot je zelf akkoord geeft.</p>
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

      {/* Waarde — "wat is mijn camera waard" is een veelgezochte term waarop we nu niet ranken */}
      <section className="lp-band">
        <div className="lp-wrap lp-section">
          <h2>Wat is je camera waard?</h2>
          <p className="lp-sub">
            Dat hangt af van drie dingen: welk model je hebt, in welke staat het is en — bij camera’s — hoeveel opnamen ermee zijn
            gemaakt. Wij vergelijken met wat vergelijkbare exemplaren op dit moment écht opbrengen, niet met een lijstprijs van jaren
            geleden. Je krijgt een bod van een expert, geen automaat.
          </p>
          <div className="lp-merken">
            {MERKEN.map(b => (
              <div key={b.m} className="lp-merk">
                <img src={b.f} alt="" loading="lazy" />
                <span>{b.m}</span>
              </div>
            ))}
          </div>
          <p className="lp-after">
            Dit zijn de merken die we het vaakst inkopen. Nikon, Canon en Sony vormen samen ruim de helft, maar ook Fujifilm en Leica
            komen veel langs — en middenformaat van Hasselblad, Phase One of Mamiya kun je bij ons gewoon kwijt.
            Ook <strong>losse lenzen</strong> kopen we in: bijna de helft van wat wij inkopen is glas.
          </p>
          <div className="lp-ctarow"><StartKnop /></div>
        </div>
      </section>

      {/* Eerlijk over het bod — transparantie als argument */}
      <section className="lp-wrap lp-section lp-split lp-split--foto">
        <div>
          <h2>Waarom een bod pas definitief is na controle</h2>
            <p>
              Ons eerste bod is gebaseerd op wat jij opgeeft: het model en de conditie. Dat is een schatting, geen vaststelling —
              we hebben je toestel dan nog niet gezien.
            </p>
            <p>
              Pas als het bij ons ligt, kunnen we vaststellen wat het werkelijk waard is. Komt alles overeen met je omschrijving,
              dan bevestigen we het oorspronkelijke bod. Wijkt het af, dan krijg je een aangepast bod te zien <strong>met de reden erbij</strong>.
            </p>
          <p>
            Dat aangepaste bod mag je gewoon weigeren. Dan sturen we je apparatuur kosteloos terug.
          </p>
        </div>
        <aside className="lp-card">
          <h3>Goed om te weten</h3>
            <dl>
              <dt>Bod geldig</dt><dd>7 dagen</dd>
              <dt>Verzenden</dt><dd>Gratis en verzekerd, ons risico</dd>
              <dt>Uitbetaling</dt><dd>Binnen 3 werkdagen na goedkeuring</dd>
              <dt>Niet akkoord</dt><dd>Gratis retour</dd>
            </dl>
          <p className="lp-card__note">
            We controleren elk serienummer bij StopHeling. Zo weet jij zeker dat je bij een handelaar bent die het netjes doet.
          </p>
        </aside>
      </section>

      {/* Wat we inkopen */}
      <section className="lp-wrap lp-section">
        <h2>Wat we inkopen</h2>
        <p className="lp-sub">
          Bijna alles op fotografisch gebied — onze catalogus telt ruim vijftienduizend producten die we inkopen.
          Ook merken waar veel handelaren niet aan beginnen: Hasselblad, Phase One, Mamiya en vergelijkbaar middenformaat.
        </p>
        <div className="lp-grid3">
          {INKOOP.map(k => (
            <div key={k.t} className="lp-tile">
              <h3>{k.t}</h3>
              <p>{k.d}</p>
            </div>
          ))}
        </div>
        <p className="lp-after">
          Staat jouw toestel er niet tussen? Vraag het gerust — we kijken er met de hand naar en zeggen eerlijk wat we ervoor kunnen doen.
        </p>
      </section>

      {/* Waar we naar kijken */}
      <section className="lp-band">
        <div className="lp-wrap lp-section">
          <h2>Waar we naar kijken</h2>
          <p className="lp-sub">Twee dingen bepalen je bod: de staat van je toestel en, bij camera’s, hoeveel het gebruikt is.</p>
          <div className="lp-grid2">
            <div className="lp-tile">
              <h3>De conditie</h3>
              <p>
                Van “zo goed als nieuw” tot “zwaar gebruikt”. Het gaat om het uiterlijk; de werking moet bij elke conditie in orde zijn.
                Twijfel je tussen twee condities, kies dan de laagste — bij ontvangst beoordelen we eerlijk en valt het bod zo nodig hoger uit.
              </p>
              <Link href="/quality-grading" className="lp-link">Wat elke conditie betekent →</Link>
            </div>
            <div className="lp-tile">
              <h3>De shuttercount</h3>
              <p>
                Het aantal opnamen dat met een camera is gemaakt, vergelijkbaar met de kilometerstand van een auto.
                Een instapmodel gaat 50.000 tot 100.000 opnamen mee, een professioneel model 300.000 tot 500.000.
              </p>
              <Link href="/shuttercount" className="lp-link">Meer over shuttercount →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="lp-wrap lp-section">
        <h2>Zo krijg je het beste bod</h2>
        <div className="lp-grid3">
          {TIPS.map(t => (
            <div key={t.t} className="lp-tile">
              <h3>{t.t}</h3>
              <p>{t.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Showroom */}
      <section className="lp-band">
        <div className="lp-wrap lp-section lp-split lp-split--omgekeerd">
          <div className="lp-foto">
            <img src="/images/hero-photographer-2.jpg" alt="Onze showroom in Geldermalsen" loading="lazy" />
          </div>
          <div>
            <h2>Liever langskomen?</h2>
            <p>
              Dat kan, en het is de snelste manier. Neem je apparatuur mee naar onze showroom in Geldermalsen, dan bekijken we het
              ter plekke en krijg je <strong>direct een bod</strong>.
            </p>
            <p>
              Ga je akkoord, dan betalen we meteen uit — aan de balie, zodat het geld op je rekening staat voordat je de deur uit bent.
              Contant kan ook, tot € 3.000.
            </p>
            <Link href="/contact" className="lp-link">Adres en openingstijden →</Link>
          </div>
          <aside className="lp-card">
            <h3>Zakelijk verkopen</h3>
            <p>
              Verkoop je als bedrijf, vink dat dan aan bij je gegevens. Ben je binnen de EU buiten Nederland gevestigd en heb je een
              geldig btw-nummer, dan werken we met btw-verlegging.
            </p>
            <p className="lp-card__note">
              Op de offerte staat altijd hoe het bedrag is opgebouwd en wat er netto wordt uitbetaald.
            </p>
          </aside>
        </div>
      </section>

      {/* FAQ */}
      <section className="lp-wrap lp-section">
        <h2>Veelgestelde vragen</h2>
        <div className="lp-faq">
          {FAQ.map((f, i) => (
            <div key={f.v} className={open === i ? 'lp-faq__item is-open' : 'lp-faq__item'}>
              <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                {f.v}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 9l6 6 6-6" /></svg>
              </button>
              {open === i && (
                <div className="lp-faq__body">
                  <p>{f.a}</p>
                  {f.link && <Link href={f.link.href} className="lp-link">{f.link.t} →</Link>}
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="lp-after">
          Staat je vraag er niet bij? Bel <a href="tel:+31853018332">085 301 83 32</a> of mail{' '}
          <a href="mailto:info@camera-tweedehands.nl">info@camera-tweedehands.nl</a>. Twijfel je of iets de moeite waard is om aan te
          bieden? Vraag het gerust — we zeggen eerlijk als iets weinig oplevert.
        </p>
      </section>

      {/* Slot */}
      <section className="lp-band">
        <div className="lp-wrap lp-section lp-end">
          <h2>Benieuwd wat je krijgt?</h2>
          <p className="lp-sub">Je aanvraag kost twee minuten en verplicht je tot niets.</p>
          <StartKnop />
        </div>
      </section>

      {/* Doorlinken */}
      <section className="lp-wrap lp-section">
        <h2 className="lp-h2-klein">Meer lezen</h2>
        <div className="lp-links">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} className="lp-linkcard">
              <strong>{l.t}</strong>
              <span>{l.d}</span>
            </Link>
          ))}
        </div>
      </section>

      <style>{`
        .lp{background:#fff;color:${C.text}}
        .lp-wrap{max-width:1040px;margin:0 auto;padding:0 24px}
        .lp-section{padding:56px 24px}
        .lp-section h2{font-size:clamp(22px,3vw,30px);font-weight:800;letter-spacing:-.02em;margin:0 0 8px}
        .lp-h2-klein{font-size:19px !important}
        .lp-sub{color:${C.sec};font-size:15.5px;line-height:1.65;margin:0 0 26px;max-width:660px}
        .lp-after{color:${C.sec};font-size:14.5px;line-height:1.7;margin:22px 0 0;max-width:680px}
        .lp-after a{color:${C.text};font-weight:600}
        .lp-link{display:inline-flex;align-items:center;min-height:36px;color:${C.accent};font-weight:700;font-size:14.5px;text-decoration:none}
        .lp-link:hover{text-decoration:underline}

        .lp-hero{position:relative;overflow:hidden;background:${C.tint}}
        .lp-hero__photo{position:absolute;inset:0;background-size:cover;background-position:center 30%}
        .lp-hero::after{content:'';position:absolute;inset:0;background:linear-gradient(100deg,#fff 0%,rgba(255,255,255,.94) 42%,rgba(255,255,255,.55) 68%,rgba(255,255,255,.25) 100%)}
        .lp-hero__inner{position:relative;z-index:1;padding-top:56px;padding-bottom:52px}
        .lp-eyebrow{display:inline-block;font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:${C.accent};margin-bottom:12px}
        .lp-hero h1{font-size:clamp(30px,5.2vw,46px);font-weight:800;letter-spacing:-.03em;line-height:1.08;margin:0 0 14px}
        .lp-hero h1 span{color:${C.accent}}
        .lp-lead{font-size:16.5px;line-height:1.65;max-width:560px;margin:0 0 26px}
        .lp-note{font-size:13px;color:${C.sec};margin:12px 0 0}

        .lp-cta{display:inline-flex;align-items:center;justify-content:center;gap:10px;background:#16A34A;color:#fff;border-radius:999px;padding:16px 30px;font-size:16px;font-weight:700;text-decoration:none;box-shadow:0 8px 22px rgba(22,163,74,.25);transition:transform .15s,box-shadow .15s}
        .lp-cta:hover{transform:translateY(-1px);box-shadow:0 12px 26px rgba(22,163,74,.3)}

        .lp-trust{border-top:1px solid ${C.border};border-bottom:1px solid ${C.border};background:#fff}
        .lp-trust__inner{display:flex;flex-wrap:wrap;gap:10px 28px;padding-top:14px;padding-bottom:14px}
        .lp-trust__inner span{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:${C.sec};font-weight:500}

        .lp-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
        .lp-step{border:1px solid ${C.border};border-radius:16px;padding:20px}
        .lp-step__n{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:${C.accentSoft};color:${C.accent};font-weight:800;font-size:14.5px;margin-bottom:12px}
        .lp-step h3{font-size:16px;font-weight:800;margin:0 0 6px}
        .lp-step p{font-size:14px;line-height:1.6;color:${C.sec};margin:0}

        .lp-band{background:${C.tint};border-top:1px solid ${C.border};border-bottom:1px solid ${C.border}}
        .lp-split{display:grid;grid-template-columns:1.4fr 1fr;gap:32px;align-items:start}
        .lp-split p{font-size:15.5px;line-height:1.7;color:${C.sec};margin:0 0 14px;max-width:620px}
        .lp-split strong{color:${C.text}}

        .lp-card{background:#fff;border:1px solid ${C.border};border-radius:16px;padding:22px}
        .lp-card h3{font-size:16px;font-weight:800;margin:0 0 12px}
        .lp-card p{font-size:14.5px;line-height:1.6;color:${C.sec};margin:0 0 12px}
        .lp-card dl{display:grid;grid-template-columns:auto 1fr;gap:8px 16px;margin:0 0 14px;font-size:14.5px}
        .lp-card dt{color:${C.sec}}
        .lp-card dd{margin:0;font-weight:700}
        .lp-card__note{font-size:13px !important;color:${C.sec};border-top:1px solid ${C.border};padding-top:12px;margin:0 !important}

        .lp-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .lp-grid2{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
        .lp-tile{border:1px solid ${C.border};border-radius:16px;padding:20px;background:#fff}
        .lp-tile h3{font-size:16px;font-weight:800;margin:0 0 6px}
        .lp-tile p{font-size:14.5px;line-height:1.6;color:${C.sec};margin:0 0 8px}

        .lp-faq__item{border-bottom:1px solid ${C.border}}
        .lp-faq__item button{width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;background:none;border:none;padding:16px 0;font-family:inherit;font-size:15.5px;font-weight:700;color:${C.text};cursor:pointer;text-align:left}
        .lp-faq__item svg{flex-shrink:0;transition:transform .2s}
        .lp-faq__item.is-open svg{transform:rotate(180deg)}
        .lp-faq__body{padding-bottom:18px}
        .lp-faq__body p{margin:0 0 6px;font-size:14.5px;line-height:1.7;color:${C.sec};max-width:760px}

        .lp-end{text-align:center}
        .lp-end .lp-sub{margin-left:auto;margin-right:auto}

        .lp-links{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .lp-linkcard{display:block;border:1px solid ${C.border};border-radius:14px;padding:16px 18px;text-decoration:none;color:${C.text};transition:border-color .15s,transform .15s}
        .lp-linkcard:hover{border-color:${C.accent};transform:translateY(-1px)}
        .lp-linkcard strong{display:block;font-size:15px;font-weight:800;margin-bottom:3px}
        .lp-linkcard span{font-size:13.5px;color:${C.sec};line-height:1.5}

        .lp-merken{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-top:6px}
        .lp-merk{border:1px solid ${C.border};border-radius:14px;padding:14px 10px;text-align:center;background:#fff}
        .lp-merk img{width:100%;height:64px;object-fit:contain;display:block;margin-bottom:8px}
        .lp-merk span{font-size:13.5px;font-weight:700}
        .lp-ctarow{margin-top:24px}

        .lp-split--foto{align-items:center}
        .lp-foto img{width:100%;height:100%;max-height:320px;object-fit:cover;border-radius:16px;display:block}
        .lp-split--omgekeerd{grid-template-columns:1fr 1.3fr}

        @media(max-width:900px){
          .lp-merken{grid-template-columns:repeat(3,1fr)}
          .lp-split--omgekeerd{grid-template-columns:1fr}
          .lp-foto{order:2}
          .lp-steps{grid-template-columns:repeat(2,1fr)}
          .lp-split{grid-template-columns:1fr;gap:24px}
          .lp-grid3,.lp-links{grid-template-columns:repeat(2,1fr)}
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
          .lp-steps,.lp-grid3,.lp-grid2,.lp-links{grid-template-columns:1fr}
        }
      `}</style>
    </div>
  );
}

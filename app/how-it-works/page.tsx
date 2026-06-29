import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import Reveal from '@/components/ui/Reveal';

const I = {
  select: <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>,
  price: <><path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><circle cx="7" cy="7" r="1.4" /></>,
  offer: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></>,
  ship: <><rect x="1" y="3" width="15" height="13" rx="1.5" /><path d="M16 8h4l3 3v5h-7z" /><circle cx="5.5" cy="18.5" r="2" /><circle cx="18.5" cy="18.5" r="2" /></>,
  inspect: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></>,
  pay: <><circle cx="12" cy="12" r="10" /><path d="M15 9.5a4 4 0 1 0 0 5" /><path d="M7 11h6M7 13h5" /></>,
};

const sellSteps = [
  { ic: I.select, t: 'Selecteer je apparatuur', d: 'Zoek je camera, lens of accessoire op in onze inruiltool en geef de conditie aan. Meerdere items tegelijk kan ook.' },
  { ic: I.price, t: 'Vraag een prijsopgave aan', d: 'Je ziet direct een indicatie van de waarde, gebaseerd op actuele marktprijzen, conditie en vraag.' },
  { ic: I.offer, t: 'Ontvang je bod', d: 'Akkoord met de prijsopgave? Dan ontvang je ons bod met een gratis verzendlabel per e-mail.' },
  { ic: I.ship, t: 'Verstuur gratis & verzekerd', d: 'Verpak je apparatuur goed, plak het label erop en lever het af bij een PostNL- of DHL-punt. Volledig verzekerd.' },
  { ic: I.inspect, t: 'Inspectie & test', d: 'Onze technici inspecteren en testen alles binnen 2 werkdagen na ontvangst — sensor, autofocus, glas, sluiter en cosmetische staat.' },
  { ic: I.pay, t: 'Uitbetaald of verrekend', d: 'Klopt de conditie met je opgave? Dan betalen we binnen 48 uur uit op je IBAN — of je verrekent het bedrag met een nieuwe aankoop.' },
];

const buySteps = [
  { t: 'Blader', d: 'Kies uit duizenden geïnspecteerde items de conditie en prijs die bij je past.' },
  { t: 'Bekijk', d: 'Echte foto’s van het exacte item, de precieze conditie en de shuttercount (waar van toepassing).' },
  { t: 'Reken af', d: 'Betaal veilig met je voorkeursbetaalmethode.' },
  { t: 'Ontvang', d: 'Aangetekend en verzekerd bezorgd, met minimaal 12 maanden garantie en 14 dagen retourrecht.' },
];

const checks = ['Sensor & dode pixels', 'Autofocus-nauwkeurigheid', 'Lensglas & coating', 'Sluiter & shuttercount', 'Knoppen, ringen & poorten', 'Cosmetische staat & LCD'];

const faqs = [
  { q: 'Wat als de conditie afwijkt van mijn opgave?', a: 'Dan nemen we contact op met een aangepast bod. Ga je niet akkoord, dan sturen we je apparatuur kosteloos terug.' },
  { q: 'Moet ik iets terugkopen, of kan ik ook alleen verkopen?', a: 'Alleen verkopen kan natuurlijk ook. Inruilen tegen een nieuwe aankoop mag, maar is geen voorwaarde — je kiest zelf voor uitbetaling of verrekening.' },
  { q: 'Hoe bepalen jullie de waarde van mijn apparatuur?', a: 'Op basis van actuele marktprijzen, de conditie, de vraag en wat vergelijkbare items opbrengen. Omdat we direct aan eindklanten verkopen, zonder tussenpartijen, kunnen we scherp bieden.' },
  { q: 'Hoe verpak ik mijn apparatuur het beste?', a: 'Gebruik bij voorkeur de originele doos en voldoende beschermend materiaal (bijv. noppenfolie). De verzending met ons label is volledig verzekerd.' },
  { q: 'Wanneer krijg ik mijn geld?', a: 'Na de inspectie (binnen 2 werkdagen na ontvangst) en jouw akkoord betalen we binnen 48 uur uit via bankoverschrijving op je IBAN.' },
];

function Ic({ children }: { children: React.ReactNode }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

export default function Page() {
  return (
    <>
      <style>{`
        .hiw-sec{padding:8px 0 18px}
        .hiw-sec__t{font-size:clamp(20px,2.4vw,26px);font-weight:800;letter-spacing:-.02em;margin:0 0 6px;color:var(--text);scroll-margin-top:90px}
        .hiw-sec__s{font-size:15px;color:var(--text-sec);margin:0 0 24px;max-width:42em}

        .hiw-timeline{display:grid;gap:0}
        .hiw-step{display:grid;grid-template-columns:48px 1fr;gap:16px}
        .hiw-step__rail{display:flex;flex-direction:column;align-items:center}
        .hiw-step__num{width:44px;height:44px;border-radius:50%;background:var(--accent);color:#fff;font-weight:800;font-size:17px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .hiw-step__line{flex:1;width:2px;background:var(--border);margin:6px 0}
        .hiw-step:last-child .hiw-step__line{display:none}
        .hiw-step__body{background:#fff;border:1px solid var(--border);border-radius:16px;padding:17px 20px;display:flex;gap:14px;align-items:flex-start;margin-bottom:14px}
        .hiw-step__ic{color:var(--accent);flex-shrink:0;margin-top:1px}
        .hiw-step__t{font-weight:700;font-size:16px;margin-bottom:3px;color:var(--text)}
        .hiw-step__d{font-size:13.5px;color:var(--text-sec);line-height:1.55}

        .hiw-inspect{display:grid;grid-template-columns:.9fr 1.1fr;gap:30px;align-items:center;background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:26px;overflow:hidden}
        .hiw-inspect__img{width:100%;height:100%;min-height:220px;object-fit:cover;border-radius:14px;display:block}
        .hiw-check{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-top:14px}
        .hiw-check__i{display:flex;gap:9px;font-size:13.5px;font-weight:600;color:var(--text);align-items:center}
        .hiw-check__i svg{color:var(--accent);flex-shrink:0}

        .hiw-buy{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
        .hiw-buy__card{background:#fff;border:1px solid var(--border);border-radius:14px;padding:18px;height:100%}
        .hiw-buy__step{font-weight:800;font-size:12px;color:var(--accent);margin-bottom:6px;letter-spacing:.04em}
        .hiw-buy__t{font-weight:700;font-size:15px;margin-bottom:4px;color:var(--text)}
        .hiw-buy__d{font-size:13.5px;color:var(--text-sec);line-height:1.55}

        .hiw-faq{display:grid;gap:10px}
        .hiw-faq details{background:#fff;border:1px solid var(--border);border-radius:14px;padding:15px 18px}
        .hiw-faq summary{font-weight:600;font-size:15px;cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:12px;color:var(--text)}
        .hiw-faq summary::-webkit-details-marker{display:none}
        .hiw-faq summary::after{content:"+";color:var(--accent);font-size:22px;font-weight:400;line-height:1}
        .hiw-faq details[open] summary::after{content:"−"}
        .hiw-faq p{margin:12px 0 2px;font-size:14px;color:var(--text-sec);line-height:1.65}

        .hiw-cta-row{display:flex;gap:12px;flex-wrap:wrap;align-items:center}
        .hiw-btn{display:inline-flex;align-items:center;gap:8px;background:var(--accent);color:#fff;font-weight:600;font-size:14.5px;padding:12px 26px;border-radius:999px;transition:transform .2s,box-shadow .2s,background .2s}
        .hiw-btn:hover{background:var(--accent-h);transform:translateY(-2px);box-shadow:0 10px 26px rgba(232,105,42,.3)}

        @media(max-width:760px){
          .hiw-inspect{grid-template-columns:1fr;padding:20px}
          .hiw-buy{grid-template-columns:1fr 1fr}
        }
        @media(max-width:460px){.hiw-buy{grid-template-columns:1fr}.hiw-check{grid-template-columns:1fr}}
      `}</style>

      {/* Standaard banner — consistent met de andere service-pagina's */}
      <div className="svc-header">
        <div className="container">
          <Breadcrumb items={[{ label: 'Help', href: '/help' }, { label: 'How it works' }]} />
          <div className="svc-eyebrow">Verkopen &amp; inruilen</div>
          <h1 className="svc-title">How it works</h1>
          <p className="svc-intro">
            Je camera-apparatuur verkopen of inruilen is bij ons zo geregeld — eerlijk geprijsd, gratis verzekerd
            verzonden en snel uitbetaald. Kopen kan natuurlijk net zo eenvoudig.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 72 }}>
        {/* SELL STEPS — timeline */}
        <section className="hiw-sec">
          <Reveal>
            <h2 id="verkopen" className="hiw-sec__t">Verkopen of inruilen in 6 stappen</h2>
            <p className="hiw-sec__s">Eenvoudig geregeld — alleen verkopen kan, inruilen tegen een nieuwe aankoop ook.</p>
          </Reveal>
          <div className="hiw-timeline">
            {sellSteps.map((s, i) => (
              <div className="hiw-step" key={s.t}>
                <div className="hiw-step__rail">
                  <div className="hiw-step__num">{i + 1}</div>
                  <div className="hiw-step__line" />
                </div>
                <Reveal delay={i * 60}>
                  <div className="hiw-step__body cam-lift">
                    <span className="hiw-step__ic"><Ic>{s.ic}</Ic></span>
                    <div>
                      <div className="hiw-step__t">{s.t}</div>
                      <div className="hiw-step__d">{s.d}</div>
                    </div>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
          <Reveal>
            <div className="hiw-cta-row" style={{ marginTop: 10 }}>
              <Link href="/trade-in" className="hiw-btn">Start je gratis prijsopgave &rarr;</Link>
              <span style={{ fontSize: 13, color: 'var(--text-sec)' }}>Vrijblijvend — niet akkoord? Gratis retour.</span>
            </div>
          </Reveal>
        </section>

        {/* INSPECTION block */}
        <section className="hiw-sec">
          <Reveal>
            <div className="hiw-inspect">
              <img className="hiw-inspect__img" src="/images/canon-r5.jpg" alt="Professionele inspectie van camera-apparatuur" />
              <div>
                <div className="svc-eyebrow" style={{ margin: '0 0 10px' }}>Elk item getest</div>
                <h2 id="inspectie" className="hiw-sec__t" style={{ marginBottom: 8 }}>Professioneel geïnspecteerd, eerlijk gegradeerd</h2>
                <p className="hiw-sec__s" style={{ marginBottom: 4 }}>
                  Onze technici controleren elk onderdeel en maken echte foto’s van het exacte item — geen stockbeelden.
                  Zo weet je vooraf precies wat je koopt of verkoopt.
                </p>
                <div className="hiw-check">
                  {checks.map(c => (
                    <div className="hiw-check__i" key={c}>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* BUY STEPS */}
        <section className="hiw-sec">
          <Reveal>
            <h2 id="kopen" className="hiw-sec__t">Kopen in 4 stappen</h2>
            <p className="hiw-sec__s">Net zo vertrouwd als nieuw — met garantie en retourrecht.</p>
          </Reveal>
          <div className="hiw-buy">
            {buySteps.map((s, i) => (
              <Reveal key={s.t} delay={i * 60}>
                <div className="hiw-buy__card cam-lift">
                  <div className="hiw-buy__step">Stap {i + 1}</div>
                  <div className="hiw-buy__t">{s.t}</div>
                  <div className="hiw-buy__d">{s.d}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="hiw-sec">
          <Reveal>
            <h2 id="faq" className="hiw-sec__t">Veelgestelde vragen over verkopen</h2>
          </Reveal>
          <div className="hiw-faq">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 50}>
                <details className="cam-lift">
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--text-sec)', margin: '16px 0 0' }}>
            Meer vragen? Bekijk de <Link href="/faq" style={{ color: 'var(--accent)', fontWeight: 600 }}>volledige FAQ</Link> of <Link href="/contact" style={{ color: 'var(--accent)', fontWeight: 600 }}>neem contact op</Link>.
          </p>
        </section>
      </div>
    </>
  );
}

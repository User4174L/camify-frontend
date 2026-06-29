import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';

const collections = [
  {
    ic: <><path d="M12 2 2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" /></>,
    title: 'Aan de slag',
    desc: 'Account aanmaken, hoe Camify werkt, verwerkingstijden en veilig kopen.',
    href: '/how-it-works',
    count: '6 artikelen',
    sample: ['Een account aanmaken en beheren', 'Hoe Camify werkt', 'Huidige verwerkingstijden'],
  },
  {
    ic: <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" /></>,
    title: 'Kopen',
    desc: 'Zoeken & filteren, conditie en listings, betalen, BTW/marge en je bestelling.',
    href: '/payment-methods',
    count: '7 artikelen',
    sample: ['Conditie & gradering uitgelegd', 'Betaalmethodes', 'Wat betekent “excl. btw” / marge?'],
  },
  {
    ic: <><path d="m16 3 4 4-4 4" /><path d="M20 7H4" /><path d="m8 21-4-4 4-4" /><path d="M4 17h16" /></>,
    title: 'Verkopen & inruilen',
    desc: 'Een offerte aanvragen, inpakken & opsturen, hoe wij keuren en uitbetalen.',
    href: '/how-it-works',
    count: '6 artikelen',
    sample: ['Een prijsopgave aanvragen', 'Hoe pak ik mijn apparatuur in?', 'Hoe wij je gear keuren'],
  },
  {
    ic: <><rect x="1" y="3" width="15" height="13" rx="1.5" /><path d="M16 8h4l3 3v5h-7z" /><circle cx="5.5" cy="18.5" r="2" /><circle cx="18.5" cy="18.5" r="2" /></>,
    title: 'Verzending & retour',
    desc: 'Verzendopties en kosten, track & trace, vermiste pakketten en retourneren.',
    href: '/shipping-returns',
    count: '5 artikelen',
    sample: ['Levering & verzendkosten', 'Mijn pakket is vertraagd of vermist', 'Iets retourneren'],
  },
  {
    ic: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></>,
    title: 'Garantie & na je aankoop',
    desc: 'Garantie & reparatie, een probleem met je bestelling, onderhoud en troubleshooting.',
    href: '/warranty-repair',
    count: '6 artikelen',
    sample: ['Garantie, retour & terugbetaling', 'Er is een probleem met mijn bestelling', 'Je apparatuur onderhouden'],
  },
  {
    ic: <><rect x="2" y="2" width="20" height="20" rx="2" /><circle cx="12" cy="12" r="4" /><path d="M17 7h.01" /></>,
    title: 'Product & fotografie',
    desc: 'Shuttercount, conditiegrades, lens/mount-compatibiliteit, schimmel & vocht.',
    href: '/knowledge-base',
    count: '8 artikelen',
    sample: ['Shuttercount checken op elke camera', 'Lens- & mount-compatibiliteit', 'Schimmel en vocht in lenzen'],
  },
];

const popular = [
  { t: 'Huidige verwerkingstijden', href: '/how-it-works' },
  { t: 'Levering & verzendkosten', href: '/shipping-returns' },
  { t: 'Garantie, retour & terugbetaling', href: '/warranty-repair' },
  { t: 'Verkopen & inruilen met Camify', href: '/how-it-works' },
  { t: 'Er is een probleem met mijn bestelling', href: '/contact' },
  { t: 'Betaalmethodes', href: '/payment-methods' },
];

export default function HelpCenterPage() {
  return (
    <>
      <style>{`
        .help-hero{position:relative;overflow:hidden;min-height:340px;display:flex;align-items:center;
          background:linear-gradient(180deg,rgba(20,21,43,.72),rgba(20,21,43,.82)),url(/images/trade-in-hero.jpg) center/cover}
        .help-hero__inner{position:relative;z-index:2;width:100%;text-align:center;padding:54px 0}
        .help-hero__eyebrow{display:inline-flex;align-items:center;gap:9px;font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#fff;opacity:.8;margin-bottom:14px}
        .help-hero__title{font-size:clamp(28px,4.4vw,46px);font-weight:800;letter-spacing:-.025em;color:#fff;margin:0 0 10px}
        .help-hero__sub{font-size:clamp(14px,1.4vw,17px);color:rgba(255,255,255,.82);margin:0 auto 24px;max-width:34em}
        .help-search{display:flex;align-items:center;gap:10px;max-width:540px;margin:0 auto;background:#fff;border-radius:999px;padding:6px 8px 6px 18px;box-shadow:0 18px 44px -20px rgba(0,0,0,.5)}
        .help-search input{flex:1;border:none;outline:none;font-size:15px;font-family:inherit;color:var(--text);background:transparent}
        .help-search button{background:var(--accent);color:#fff;border:none;border-radius:999px;padding:11px 22px;font-weight:700;font-size:14px;display:inline-flex;align-items:center;gap:7px}

        .help-cols{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
        .help-col{display:block;background:#fff;border:1px solid var(--border);border-radius:16px;padding:22px;height:100%}
        .help-col__ic{width:46px;height:46px;border-radius:12px;background:#FCEAE0;color:var(--accent);display:flex;align-items:center;justify-content:center;margin-bottom:14px}
        .help-col__t{font-weight:800;font-size:17px;color:var(--text);margin-bottom:5px;display:flex;align-items:center;gap:8px}
        .help-col__d{font-size:13.5px;color:var(--text-sec);line-height:1.55;margin-bottom:12px}
        .help-col__list{display:grid;gap:6px;border-top:1px solid var(--border);padding-top:12px}
        .help-col__li{font-size:13px;color:var(--text);display:flex;align-items:center;gap:7px}
        .help-col__li svg{color:var(--accent);flex-shrink:0}
        .help-col__count{font-size:12px;font-weight:700;color:var(--accent);margin-top:12px}

        .help-popular{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:24px 26px;margin-top:40px}
        .help-popular__grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px}
        .help-pop{display:flex;align-items:center;justify-content:space-between;gap:10px;background:#fff;border:1px solid var(--border);border-radius:10px;padding:12px 15px;font-size:14px;font-weight:600;color:var(--text)}
        .help-pop span.ar{color:var(--accent)}

        .help-cta{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px;border:1px solid var(--border);border-radius:16px;padding:22px 26px;margin-top:24px}

        @media(max-width:880px){.help-cols{grid-template-columns:1fr 1fr}}
        @media(max-width:680px){.help-cols{grid-template-columns:1fr}.help-popular__grid{grid-template-columns:1fr}}
      `}</style>

      {/* Hero met stock-afbeelding */}
      <section className="help-hero">
        <div className="container">
          <div className="help-hero__inner">
            <div className="help-hero__eyebrow">Camify Help Center</div>
            <h1 className="help-hero__title">Hoe kunnen we je helpen?</h1>
            <p className="help-hero__sub">Vind snel antwoord over kopen, verkopen, verzending, garantie en je apparatuur.</p>
            <div className="help-search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-sec)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
              <input type="text" placeholder="Zoek een onderwerp of vraag…" aria-label="Zoeken in help" />
              <button type="button">Zoeken</button>
            </div>
          </div>
        </div>
      </section>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        {/* Collecties */}
        <div className="help-cols">
          {collections.map((c, i) => (
            <Reveal key={c.title} delay={i * 55}>
              <Link href={c.href} className="help-col cam-lift">
                <div className="help-col__ic">
                  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{c.ic}</svg>
                </div>
                <div className="help-col__t">{c.title} <span style={{ color: 'var(--accent)' }}>&rarr;</span></div>
                <div className="help-col__d">{c.desc}</div>
                <div className="help-col__list">
                  {c.sample.map(s => (
                    <div className="help-col__li" key={s}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M9 18l6-6-6-6" /></svg>
                      {s}
                    </div>
                  ))}
                </div>
                <div className="help-col__count">{c.count}</div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Populair */}
        <div className="help-popular">
          <h2 style={{ fontSize: 19, fontWeight: 800, margin: 0, color: 'var(--text)' }}>Veelgelezen artikelen</h2>
          <div className="help-popular__grid">
            {popular.map(p => (
              <Link key={p.t} href={p.href} className="help-pop cam-lift">
                {p.t} <span className="ar">&rarr;</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="help-cta">
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text)' }}>Niet gevonden wat je zocht?</div>
            <div style={{ fontSize: 14, color: 'var(--text-sec)' }}>Onze klantenservice helpt je graag verder, ma–vr 09:00–17:30.</div>
          </div>
          <Link href="/contact" style={{ background: 'var(--accent)', color: '#fff', fontWeight: 600, fontSize: 14.5, padding: '12px 26px', borderRadius: 999 }}>
            Neem contact op &rarr;
          </Link>
        </div>
      </div>
    </>
  );
}

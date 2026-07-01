import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';

const collections = [
  {
    ic: <><path d="M12 2 2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" /></>,
    title: 'Aan de slag',
    desc: 'Hoe Camera-tweedehands.nl werkt — kopen, verkopen en inruilen in het kort.',
    href: '/how-it-works',
    topics: [
      { label: 'Hoe Camera-tweedehands.nl werkt', href: '/how-it-works#verkopen' },
      { label: 'Kopen in 4 stappen', href: '/how-it-works#kopen' },
      { label: 'Veelgestelde vragen', href: '/faq' },
    ],
  },
  {
    ic: <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" /></>,
    title: 'Kopen',
    desc: 'Hoe kopen werkt, conditie en gradering, betalen en het verschil tussen marge en btw.',
    href: '/buying',
    topics: [
      { label: 'Kopen bij Camera-tweedehands.nl — koopgids', href: '/buying' },
      { label: 'Conditie & gradering uitgelegd', href: '/quality-grading' },
      { label: 'Betaalmethodes', href: '/payment-methods' },
    ],
  },
  {
    ic: <><path d="m16 3 4 4-4 4" /><path d="M20 7H4" /><path d="m8 21-4-4 4-4" /><path d="M4 17h16" /></>,
    title: 'Verkopen & inruilen',
    desc: 'Een prijsopgave aanvragen, opsturen, hoe wij keuren en uitbetalen.',
    href: '/how-it-works',
    topics: [
      { label: 'Een prijsopgave aanvragen', href: '/how-it-works#verkopen' },
      { label: 'Hoe wij je gear keuren', href: '/how-it-works#inspectie' },
      { label: 'Veelgestelde vragen over verkopen', href: '/how-it-works#faq' },
    ],
  },
  {
    ic: <><rect x="1" y="3" width="15" height="13" rx="1.5" /><path d="M16 8h4l3 3v5h-7z" /><circle cx="5.5" cy="18.5" r="2" /><circle cx="18.5" cy="18.5" r="2" /></>,
    title: 'Verzending & retour',
    desc: 'Verzendkosten en levertijden, en hoe je iets retourneert.',
    href: '/shipping-returns',
    topics: [
      { label: 'Verzendkosten & levertijd', href: '/shipping-returns#kosten' },
      { label: 'Retourneren in 3 stappen', href: '/shipping-returns#retourneren' },
      { label: 'Voorwaarden voor retour', href: '/shipping-returns#voorwaarden' },
    ],
  },
  {
    ic: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></>,
    title: 'Garantie & na je aankoop',
    desc: 'Garantie & reparatie, en wat te doen bij een probleem met je bestelling.',
    href: '/warranty-repair',
    topics: [
      { label: 'Garantie & reparatie', href: '/warranty-repair' },
      { label: 'Reparatie aanvragen', href: '/warranty-repair#reparatie-aanvragen' },
      { label: 'Probleem met mijn bestelling', href: '/contact' },
    ],
  },
  {
    ic: <><rect x="2" y="2" width="20" height="20" rx="2" /><circle cx="12" cy="12" r="4" /><path d="M17 7h.01" /></>,
    title: 'Product & fotografie',
    desc: 'Shuttercount, conditiegrades en lens-compatibiliteit.',
    href: '/knowledge-base',
    topics: [
      { label: 'Shuttercount checken op elke camera', href: '/knowledge-base' },
      { label: 'Conditiegrades uitgelegd', href: '/quality-grading' },
      { label: 'Lens- & mount-compatibiliteit', href: '/knowledge-base' },
    ],
  },
];

const popular = [
  { t: 'Huidige verwerkingstijden', href: '/how-it-works' },
  { t: 'Levering & verzendkosten', href: '/shipping-returns' },
  { t: 'Garantie, retour & terugbetaling', href: '/warranty-repair' },
  { t: 'Verkopen & inruilen met Camera-tweedehands.nl', href: '/how-it-works' },
  { t: 'Er is een probleem met mijn bestelling', href: '/contact' },
  { t: 'Betaalmethodes', href: '/payment-methods' },
];

export default function HelpCenterPage() {
  return (
    <>
      <style>{`
        .help-hero{position:relative;overflow:hidden;min-height:340px;display:flex;align-items:center;
          background:linear-gradient(180deg,rgba(20,21,43,.66),rgba(20,21,43,.78)),url(/images/hero-photographer-1.jpg) center 28%/cover}
        .help-hero__inner{position:relative;z-index:2;width:100%;text-align:center;padding:54px 0}
        .help-hero__eyebrow{display:inline-flex;align-items:center;gap:9px;font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#fff;opacity:.8;margin-bottom:14px}
        .help-hero__title{font-size:clamp(28px,4.4vw,46px);font-weight:800;letter-spacing:-.025em;color:#fff;margin:0 0 10px}
        .help-hero__sub{font-size:clamp(14px,1.4vw,17px);color:rgba(255,255,255,.82);margin:0 auto 24px;max-width:34em}
        .help-search{display:flex;align-items:center;gap:10px;max-width:540px;margin:0 auto;background:#fff;border-radius:999px;padding:6px 8px 6px 18px;box-shadow:0 18px 44px -20px rgba(0,0,0,.5)}
        .help-search input{flex:1;border:none;outline:none;font-size:15px;font-family:inherit;color:var(--text);background:transparent}
        .help-search button{background:var(--accent);color:#fff;border:none;border-radius:999px;padding:11px 22px;font-weight:700;font-size:14px;display:inline-flex;align-items:center;gap:7px}

        .help-cols{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
        .help-col{display:flex;flex-direction:column;background:#fff;border:1px solid var(--border);border-radius:16px;padding:22px;height:100%}
        .help-col__ic{width:46px;height:46px;border-radius:12px;background:#FCEAE0;color:var(--accent);display:flex;align-items:center;justify-content:center;margin-bottom:14px}
        .help-col__t{font-weight:800;font-size:17px;color:var(--text);margin-bottom:5px;display:inline-flex;align-items:center;gap:8px}
        .help-col__t:hover{color:var(--accent)}
        .help-col__d{font-size:13.5px;color:var(--text-sec);line-height:1.55;margin-bottom:12px}
        .help-col__list{display:grid;gap:2px;border-top:1px solid var(--border);padding-top:10px;margin-top:auto}
        .help-col__li{font-size:13px;color:var(--text);display:flex;align-items:center;gap:7px;padding:5px 0;font-weight:500}
        .help-col__li:hover{color:var(--accent)}
        .help-col__li svg{color:var(--accent);flex-shrink:0}

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
            <div className="help-hero__eyebrow">Camera-tweedehands.nl Help Center</div>
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
              <div className="help-col cam-lift">
                <div className="help-col__ic">
                  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{c.ic}</svg>
                </div>
                <Link href={c.href} className="help-col__t">{c.title} <span style={{ color: 'var(--accent)' }}>&rarr;</span></Link>
                <div className="help-col__d">{c.desc}</div>
                <div className="help-col__list">
                  {c.topics.map(t => (
                    <Link className="help-col__li" key={t.label} href={t.href}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M9 18l6-6-6-6" /></svg>
                      {t.label}
                    </Link>
                  ))}
                </div>
              </div>
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

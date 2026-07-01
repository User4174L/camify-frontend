import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import Reveal from '@/components/ui/Reveal';
import RelatedLinks from '@/components/ui/RelatedLinks';

const steps = [
  { t: 'Blader', d: 'Kies uit duizenden geïnspecteerde items de conditie en prijs die bij je past. Filter op merk, mount, prijs en meer.' },
  { t: 'Bekijk', d: 'Echte foto’s van het exacte item, de precieze conditie en — waar van toepassing — de shuttercount.' },
  { t: 'Reken af', d: 'Betaal veilig met je voorkeursmethode: iDEAL, creditcard, PayPal of in 3 termijnen.' },
  { t: 'Ontvang', d: 'Aangetekend en verzekerd bezorgd, met minimaal 12 maanden garantie en 14 dagen retourrecht.' },
];

const topics = [
  {
    t: 'Conditie & productpagina’s',
    d: 'Elk item is professioneel geïnspecteerd en in een van vijf conditieniveaus ingedeeld, met echte foto’s van het exacte item — geen stockbeelden. Zo weet je vooraf precies wat je krijgt.',
    link: { label: 'Conditie & gradering uitgelegd', href: '/quality-grading' },
  },
  {
    t: 'Betalen, btw & marge',
    d: 'Onze producten zijn standaard margeproducten; staat er een BTW-label bij, dan is het een btw-product (prijs incl. btw). De getoonde prijs is altijd de prijs die je betaalt. Zakelijk? Bij een btw-product vraag je de btw terug; bij een margeproduct niet, maar dan draag je bij verkoop ook geen btw af.',
    link: { label: 'Alle betaalmethodes', href: '/payment-methods' },
  },
  {
    t: 'Levering',
    d: 'Voor 15:00 besteld op werkdagen = dezelfde dag verzonden, aangetekend en verzekerd. Gratis verzending vanaf €100 binnen NL, België en Duitsland.',
    link: { label: 'Verzendkosten & levertijd', href: '/shipping-returns#kosten' },
  },
  {
    t: 'Garantie & retour',
    d: 'Op alle tweedehands producten geldt minimaal 12 maanden garantie (24 maanden op nieuw). Niet tevreden? Je hebt 14 dagen retourrecht op online aankopen.',
    link: { label: 'Garantie & reparatie', href: '/warranty-repair' },
  },
];

const goodToKnow = [
  { t: 'Marge of btw', d: 'Standaard zijn onze producten margeproducten; alleen bij een BTW-label is het een btw-product (prijs incl. btw). De getoonde prijs is altijd je eindprijs.' },
  { t: 'Prijzen onder voorbehoud', d: 'Alle prijzen zijn onder voorbehoud van type- en drukfouten. Bij een aantoonbare fout komt er geen bindende overeenkomst tot stand.' },
  { t: 'Voor consumenten', d: 'Aanbiedingen en kortingen zijn bedoeld voor consumenten en eindgebruikers; aankopen voor wederverkoop zijn niet toegestaan.' },
  { t: 'Reserveringen', d: 'Een reservering geldt tot uiterlijk 17:00 uur op de dag waarop deze wordt gemaakt, tenzij anders afgesproken.' },
];

const faqs = [
  { q: 'Welke betaalmethodes kan ik gebruiken?', a: 'iDEAL, creditcard (Visa, Mastercard, Amex), PayPal, Bancontact en betaling in 3 termijnen, naast diverse internationale methodes. Alle betalingen verlopen beveiligd via Pay.nl.' },
  { q: 'Zijn jullie prijzen inclusief btw? Wat betekent het BTW-label?', a: 'Onze producten zijn standaard margeproducten. Staat er een BTW-label bij, dan is het een btw-product en is de prijs inclusief btw. De getoonde prijs is altijd de prijs die je betaalt. Koop je zakelijk? Bij een btw-product vraag je de btw terug; bij een margeproduct niet, maar dan draag je bij latere verkoop ook geen btw af. Voor zakelijke EU-kopers verleggen we de btw via een intracommunautaire levering.' },
  { q: 'Krijg ik garantie op een tweedehands product?', a: 'Ja, op alle tweedehands producten geldt minimaal 12 maanden garantie, op nieuwe producten 24 maanden — tenzij anders vermeld bij het product.' },
  { q: 'Zijn de foto’s van het echte item?', a: 'Ja. Elke listing bevat echte foto’s van het exacte item dat je ontvangt, vanuit meerdere hoeken. Wat je ziet, is wat je krijgt.' },
];

export default function Page() {
  return (
    <>
      <div className="svc-header svc-header--photo">
        <div className="svc-header__photo" style={{ backgroundImage: 'url(/images/hero-photographer-1.jpg)' }} aria-hidden="true" />
        <div className="container">
          <div className="svc-header__inner">
            <Breadcrumb items={[{ label: 'Help', href: '/help' }, { label: 'Buying guide' }]} />
            <div className="svc-eyebrow">Kopen</div>
            <h1 className="svc-title">Kopen bij Camera-tweedehands.nl</h1>
            <p className="svc-intro">
              Tweedehands kopen, net zo vertrouwd als nieuw — professioneel geïnspecteerd, eerlijk geprijsd en met
              garantie. Zo werkt het. Wil je juist verkopen of inruilen? Bekijk dan <Link href="/how-it-works" style={{ color: 'var(--accent)', fontWeight: 600 }}>How it works</Link>.
            </p>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 72 }}>
        {/* 4 stappen */}
        <section style={{ padding: '8px 0 18px' }}>
          <Reveal>
            <h2 id="stappen" style={{ fontSize: 'clamp(20px,2.4vw,26px)', fontWeight: 800, letterSpacing: '-.02em', margin: '0 0 6px', color: 'var(--text)', scrollMarginTop: 90 }}>Kopen in 4 stappen</h2>
            <p style={{ fontSize: 15, color: 'var(--text-sec)', margin: '0 0 24px' }}>Van browsen tot bezorgd — eenvoudig en veilig.</p>
          </Reveal>
          <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
            {steps.map((s, i) => (
              <Reveal key={s.t} delay={i * 60}>
                <div className="cam-lift" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: 18, height: '100%' }}>
                  <div style={{ fontWeight: 800, fontSize: 12, color: 'var(--accent)', marginBottom: 6, letterSpacing: '.04em' }}>Stap {i + 1}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: 'var(--text)' }}>{s.t}</div>
                  <div style={{ fontSize: 13.5, color: 'var(--text-sec)', lineHeight: 1.55 }}>{s.d}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Onderwerpen */}
        <section style={{ padding: '8px 0 18px' }}>
          <Reveal>
            <h2 id="wat-je-moet-weten" style={{ fontSize: 'clamp(20px,2.4vw,26px)', fontWeight: 800, letterSpacing: '-.02em', margin: '0 0 24px', color: 'var(--text)', scrollMarginTop: 90 }}>Alles over kopen</h2>
          </Reveal>
          <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
            {topics.map((t, i) => (
              <Reveal key={t.t} delay={i * 50}>
                <div className="cam-lift" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 22px', height: '100%' }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text)', marginBottom: 6 }}>{t.t}</div>
                  <div style={{ fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.6, marginBottom: 12 }}>{t.d}</div>
                  <Link href={t.link.href} style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--accent)' }}>{t.link.label} &rarr;</Link>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Goed om te weten */}
        <section style={{ padding: '8px 0 18px' }}>
          <Reveal>
            <h2 id="goed-om-te-weten" style={{ fontSize: 'clamp(20px,2.4vw,26px)', fontWeight: 800, letterSpacing: '-.02em', margin: '0 0 24px', color: 'var(--text)', scrollMarginTop: 90 }}>Goed om te weten</h2>
          </Reveal>
          <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
            {goodToKnow.map((k, i) => (
              <Reveal key={k.t} delay={i * 45}>
                <div className="cam-lift" style={{ border: '1px solid var(--border)', borderRadius: 14, padding: '17px 19px', background: '#fff', height: '100%' }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 5 }}>{k.t}</div>
                  <div style={{ fontSize: 13.5, color: 'var(--text-sec)', lineHeight: 1.55 }}>{k.d}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: '8px 0 18px' }}>
          <Reveal>
            <h2 id="faq" style={{ fontSize: 'clamp(20px,2.4vw,26px)', fontWeight: 800, letterSpacing: '-.02em', margin: '0 0 14px', color: 'var(--text)', scrollMarginTop: 90 }}>Veelgestelde vragen over kopen</h2>
          </Reveal>
          <div style={{ display: 'grid', gap: 10 }}>
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 50}>
                <details className="cam-lift" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: '15px 18px' }}>
                  <summary style={{ fontWeight: 600, fontSize: 15, cursor: 'pointer', color: 'var(--text)' }}>{f.q}</summary>
                  <p style={{ margin: '12px 0 2px', fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.65 }}>{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </section>

        <RelatedLinks
          items={[
            { label: 'Quality & grading', desc: 'Hoe we conditie bepalen, testen en communiceren.', href: '/quality-grading' },
            { label: 'Payment methods', desc: 'Alle manieren waarop je veilig kunt betalen.', href: '/payment-methods' },
            { label: 'Shipping & returns', desc: 'Levertijden, verzendkosten en 14 dagen retour.', href: '/shipping-returns' },
            { label: 'Warranty & repair', desc: 'Minimaal 12 maanden garantie en reparaties.', href: '/warranty-repair' },
          ]}
        />
      </div>
    </>
  );
}

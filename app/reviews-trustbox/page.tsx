import SimplePage from '@/components/layout/SimplePage';
import TrustpilotWidget, { TP } from '@/components/ui/TrustpilotWidget';
import {
  WebwinkelKeurLogo, FacebookLogo, GoogleLogo, TrustedShopsLogo, TrustpilotLogo,
} from '@/components/ui/PlatformLogos';

// VOORBEELD van de nieuwe, algemene reviewpagina (besluit Bart 30-08-2026).
//
// Waarom algemeen en zonder harde cijfers:
//   1. Trustpilot verbiedt een zelf ingetypte of statische TrustScore; score en
//      reviews moeten uit een officiële TrustBox komen, met logo en link terug.
//   2. Als SEO-pagina stelt hij weinig voor. Search Console 90d (29-05 t/m 27-08):
//      de hele merkgebonden reviewzoekvraag is één query ("camera tweedehands
//      review"), 104 impressies / 47 clicks, en die vangt de homepage al op
//      positie 1,2 met 47% CTR. Alle merkqueries samen: 2.321 clicks.
//   De pagina bestaat dus voor de footerlink en voor de twijfelaar die vanuit een
//   productpagina doorklikt — niet om te ranken.
//
// De enige getallen die hier staan zijn getallen die niet verouderen: "ruim 3.600"
// (werkelijk 3.684) groeit alleen maar, "nergens lager dan 9,4" is de laagste score
// per platform (WebwinkelKeur, staat stil sinds nov 2024), en de 9,7 is WebwinkelKeurs
// eigen optelsom over vijf bronnen — geen eigen gemiddelde.
//
// LET OP bij de carrousel: alle vijf de sterrenvinkjes aan laten (data-stars).
// Alleen positieve reviews tonen is een misleidende handelspraktijk (zwarte lijst
// art. 6:193g BW, ACM beboet tot € 900.000). En het is niet nodig: 86% van onze
// beoordelingen is "uitstekend", 0% slecht of zeer slecht.
//
// Geen AggregateRating/Organization-markup: Google geeft sinds december 2025 geen
// sterren voor zelfbeheerde reviews en beboet het met een handmatige maatregel.

const platforms: { name: string; Logo: (p: { size?: number }) => React.JSX.Element; href: string; note: string }[] = [
  {
    name: 'WebwinkelKeur',
    Logo: WebwinkelKeurLogo,
    href: 'https://www.webwinkelkeur.nl/webshop/Camera-tweedehands-nl_4043/reviews',
    note: 'Het keurmerk waar wij sinds 2015 bij aangesloten zijn. Zij tellen ook de andere bronnen bij elkaar op.',
  },
  {
    name: 'Trustpilot',
    Logo: TrustpilotLogo,
    href: 'https://nl.trustpilot.com/review/www.camera-tweedehands.nl',
    note: 'Hier komen op dit moment de meeste nieuwe beoordelingen binnen.',
  },
  {
    name: 'Trusted Shops',
    Logo: TrustedShopsLogo,
    href: 'https://www.webwinkelkeur.nl/webshop/Camera-tweedehands-nl_4043',
    note: 'Opgebouwd in de jaren dat wij daar aangesloten waren.',
  },
  {
    name: 'Google',
    Logo: GoogleLogo,
    href: 'https://www.google.com/search?q=Camera-Tweedehands.nl+Geldermalsen',
    note: 'Vooral van mensen die in de showroom in Geldermalsen zijn geweest.',
  },
  {
    name: 'Facebook',
    Logo: FacebookLogo,
    href: 'https://www.facebook.com/cameratweedehands',
    note: 'Waar ruim 5.100 mensen ons volgen.',
  },
];

const principles: { title: string; body: string }[] = [
  {
    title: 'Wij vragen het aan iedereen, niet aan een selectie',
    body: 'Na elke afgeronde bestelling gaat er automatisch een uitnodiging uit. Ook naar mensen die iets aan óns hebben verkocht of ingeruild — juist die ervaring willen we terugzien, want daar zit het meeste vertrouwen in.',
  },
  {
    title: 'Wij kunnen een beoordeling niet weghalen of aanpassen',
    body: 'Ze staan bij de platformen zelf. Wij hebben geen knop om er eentje te laten verdwijnen, en dat is de enige reden waarom een cijfer iets waard is.',
  },
  {
    title: 'Wij tonen ze ongefilterd',
    body: 'Hieronder staan onze meest recente beoordelingen, in de volgorde waarin ze binnenkwamen — niet de mooiste die we konden vinden. Een winkel die zelf bepaalt welke beoordelingen zichtbaar worden, kan alleen maar goede laten zien. Dan zegt een tien niets meer.',
  },
  {
    title: 'Wij reageren, ook als het minder goed ging',
    body: 'Op elke beoordeling van drie sterren of lager reageren wij. Meestal blijkt er iets opgelost te kunnen worden.',
  },
];

const readMore: { label: string; href: string; what: string }[] = [
  { label: 'productcondities', href: '/product-conditions', what: 'Wat elke conditie precies betekent' },
  { label: 'hoe het werkt', href: '/how-it-works', what: 'Hoe wij toestellen controleren en beoordelen' },
  { label: 'verzenden en retourneren', href: '/shipping-returns', what: 'Retourneren en verzenden' },
  { label: 'garantie en reparatie', href: '/warranty-repair', what: 'Garantie en reparatie' },
];

const h2: React.CSSProperties = { fontSize: 20, fontWeight: 700, margin: '38px 0 10px' };
const p: React.CSSProperties = { fontSize: 14.5, color: 'var(--text-sec)', margin: '0 0 14px', lineHeight: 1.65 };

export default function ReviewsTrustboxPage() {
  return (
    <SimplePage
      title="Beoordelingen"
      breadcrumb="Beoordelingen"
      intro="Wij verkopen sinds 2011 tweedehands apparatuur. Wat klanten daarvan vinden, staat niet bij ons maar bij onafhankelijke platformen — daar kunnen wij niets aan veranderen, en dat is precies de bedoeling."
    >
      {/* Interne werkbalk — hoort niet op de echte pagina. */}
      <div style={{ background: '#FFF4E8', border: '1.5px solid #F5D9BC', borderRadius: 12, padding: '14px 18px', margin: '0 0 22px', fontSize: 13.5, lineHeight: 1.6, color: '#6B4A2B' }}>
        <strong>Voorbeeldpagina.</strong> De algemene opzet zonder cijfers die verouderen, met de
        officiële Trustpilot-carrousel. Ter vergelijking: <a href="/reviews" style={{ color: '#B4560F' }}>/reviews</a> is
        de oude versie met handgetypte cijfers en vijf gekozen citaten.
      </div>

      <h2 style={{ ...h2, marginTop: 0 }}>Waar je ons kunt nalezen</h2>
      <p style={p}>
        Ruim 3.600 mensen hebben een beoordeling achtergelaten, verspreid over vijf platformen. Op geen
        van die platformen staan wij lager dan een <strong>9,4</strong>; WebwinkelKeur telt ze alle vijf
        bij elkaar op en komt uit op een <strong>9,7</strong>.
      </p>

      <div style={{ background: '#fff', border: '1.5px solid #EEEEF2', borderRadius: 16, padding: '4px 22px', margin: '0 0 10px' }}>
        {platforms.map((s, i) => (
          <a
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: '17px 0',
              borderTop: i === 0 ? 'none' : '1px solid #EEEEF2',
              textDecoration: 'none', color: 'inherit',
            }}
          >
            <span style={{ flex: '0 0 auto', display: 'flex' }}>
              <s.Logo size={38} />
            </span>
            <span style={{ flex: '1 1 auto', minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 15.5, fontWeight: 700, color: 'var(--text)' }}>
                {s.name}
              </span>
              <span style={{ display: 'block', fontSize: 13, color: '#8A8C99', marginTop: 3, lineHeight: 1.5 }}>
                {s.note}
              </span>
            </span>
            <span style={{ flex: '0 0 auto', fontSize: 18, color: '#C6C8D2' }}>&rsaquo;</span>
          </a>
        ))}
      </div>
      <p style={{ fontSize: 12.5, color: '#8A8C99', margin: '0 0 8px', lineHeight: 1.6 }}>
        Wij zetten er bewust geen cijfer bij dat wij zelf hebben ingetypt. Klik door, dan zie je de
        actuele stand bij de bron.
      </p>

      <h2 style={h2}>Hoe wij met beoordelingen omgaan</h2>
      <div style={{ display: 'grid', gap: 12, margin: '0 0 6px' }}>
        {principles.map(pr => (
          <div
            key={pr.title}
            style={{ background: '#fff', border: '1.5px solid #EEEEF2', borderRadius: 14, padding: '18px 22px' }}
          >
            <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--text)', marginBottom: 7 }}>
              {pr.title}
            </div>
            <div style={{ fontSize: 14.5, color: 'var(--text-sec)', lineHeight: 1.65 }}>{pr.body}</div>
          </div>
        ))}
      </div>

      <h2 style={h2}>Wat klanten schrijven</h2>
      <p style={p}>
        Rechtstreeks van Trustpilot, de meest recente eerst. Alle beoordelingen tellen mee, van één tot
        vijf sterren.
      </p>
      <div style={{ margin: '0 0 6px' }}>
        <TrustpilotWidget
          templateId={TP.carousel}
          token="e1170bee-073b-47bf-a04f-f21dd7333a21"
          height="160px"
          stars="1,2,3,4,5"
          reviewLanguages="nl"
        />
      </div>

      <h2 style={h2}>Waar de beoordelingen over gaan</h2>
      <p style={p}>
        Bij tweedehands apparatuur zitten mensen met een paar vaste vragen. Klopt de conditie die erbij
        staat? Wat gebeurt er als er iets misgaat? Kan ik het terugsturen? Krijg ik een eerlijke prijs
        als ik zelf iets verkoop? Mag ik eerst langskomen om te kijken?
      </p>
      <p style={p}>
        Dat zijn ook de onderwerpen die in de beoordelingen het vaakst terugkomen. Wil je weten hoe wij
        het zelf geregeld hebben, dan staat dat hier:
      </p>
      <ul style={{ ...p, paddingLeft: 20 }}>
        {readMore.map(r => (
          <li key={r.href} style={{ marginBottom: 6 }}>
            {r.what}: <a href={r.href} style={{ color: 'var(--accent)' }}>{r.label}</a>
          </li>
        ))}
      </ul>

      <h2 style={h2}>Niet tevreden?</h2>
      <p style={p}>
        Laat het ons dan eerst weten. Bel{' '}
        <a href="tel:+31853018332" style={{ color: 'var(--accent)' }}>085 301 83 32</a> of mail naar{' '}
        <a href="mailto:info@camera-tweedehands.nl" style={{ color: 'var(--accent)' }}>info@camera-tweedehands.nl</a>.
        In verreweg de meeste gevallen lossen wij het op, en dat is voor iedereen prettiger dan een
        beoordeling waar niets mee gebeurt.
      </p>
      <p style={{ ...p, marginBottom: 0 }}>
        Komen wij er samen niet uit, dan kun je terecht bij WebwinkelKeur. Zij bemiddelen onafhankelijk
        en wij zijn daar bij aangesloten. Zie{' '}
        <a href="/customer-service" style={{ color: 'var(--accent)' }}>klantenservice</a> voor de procedure.
      </p>
    </SimplePage>
  );
}

import SimplePage from '@/components/layout/SimplePage';
import {
  WebwinkelKeurLogo, FacebookLogo, GoogleLogo, TrustedShopsLogo, TrustpilotLogo, ScoreStar,
} from '@/components/ui/PlatformLogos';

// Eigen reviewpagina. Bewust GEEN AggregateRating-markup: Google toont sinds
// december 2025 geen sterren meer voor reviews die de beoordeelde partij zelf
// beheert (Organization/LocalBusiness). Deze pagina is er voor de merkzoekvraag
// ("camera-tweedehands ervaringen") en voor conversie, niet voor rich snippets.
//
// Alle cijfers opgehaald op 08-08-2026 uit de bronnen zelf.
//
// KOPCIJFER = 9,8, de Trustpilot-score: 4,9 van 5 is 9,8 van 10, precies zoals
// WebwinkelKeur hem ook weergeeft. Bewust die en niet het WebwinkelKeur-totaal van
// 9,7 — Trustpilot is hoger, verser en het enige platform waar nu nog dagelijks
// beoordelingen binnenkomen (WebwinkelKeur staat stil sinds november 2024).
//
// De bronnenlijst volgt de weergave van WebwinkelKeur zelf: logo, aantal, één ster
// met de score op een schaal van 10. Scores van 5-schaalplatformen zijn lineair
// omgerekend; dat staat als voetnoot onder de lijst.
//
// Let op bij bijwerken: WebwinkelKeur loopt een paar dagen achter op Trustpilot,
// en hun scores zijn afgerond op één decimaal (een "10" is dus >= 9,95).

const HEADLINE = { score: '9,8', count: '591', href: 'https://nl.trustpilot.com/review/www.camera-tweedehands.nl' };
const SOLD = '50.000+';
const TOTAL_COUNT = '3.638';

// Scores op een schaal van 10, net zoals WebwinkelKeur ze in hun eigen bronnenlijst
// toont. Trustpilot, Google en Facebook hanteren zelf een schaal van 5; die is hier
// lineair omgerekend (4,9/5 = 9,8/10). Staat als voetnoot onder de lijst.
const sources: { name: string; Logo: (p: { size?: number }) => React.JSX.Element; score: string; count: string; href: string; note: string }[] = [
  {
    name: 'WebwinkelKeur',
    Logo: WebwinkelKeurLogo,
    score: '9,4',
    count: '1.893',
    href: 'https://www.webwinkelkeur.nl/webshop/Camera-tweedehands-nl_4043/reviews',
    note: 'Keurmerk waar wij sinds 2015 bij aangesloten zijn',
  },
  {
    name: 'Trusted Shops',
    Logo: TrustedShopsLogo,
    score: '10',
    count: '953',
    href: 'https://www.webwinkelkeur.nl/webshop/Camera-tweedehands-nl_4043',
    note: 'Opgebouwd in de jaren dat wij daar aangesloten waren',
  },
  {
    name: 'Trustpilot',
    Logo: TrustpilotLogo,
    score: '9,8',
    count: '591',
    href: 'https://nl.trustpilot.com/review/www.camera-tweedehands.nl',
    note: 'Hier komen op dit moment de meeste nieuwe beoordelingen binnen',
  },
  {
    name: 'Google',
    Logo: GoogleLogo,
    score: '9,6',
    count: '187',
    href: 'https://www.google.com/search?q=Camera-Tweedehands.nl+Geldermalsen',
    note: 'Vooral van mensen die in de winkel in Geldermalsen zijn geweest',
  },
  {
    name: 'Facebook',
    Logo: FacebookLogo,
    score: '10',
    count: '23',
    href: 'https://www.facebook.com/cameratweedehands',
    note: 'Ruim 5.100 mensen volgen ons daar',
  },
];

// Vijf echte beoordelingen, gekozen op de vraag die ze beantwoorden — niet op
// enthousiasme. De twijfels van iemand die tweedehands koopt: klopt de conditie,
// wat als het misgaat, mag ik het terugsturen, krijg ik een eerlijke inruilprijs,
// kan ik langskomen. Letterlijk overgenomen, alleen achternaam afgekort.
const featured: { doubt: string; quote: string; who: string; when: string; where: string }[] = [
  {
    doubt: 'Klopt de conditie die erbij staat?',
    quote:
      'Heldere omschrijving van het product, en het klopte perfect! De “zeer goed” beleefde ik zelf als een “zo goed als nieuw”, dus dat Camera Tweedehands zo kritisch is, schept vertrouwen.',
    who: 'CD',
    when: '6 augustus 2026',
    where: 'Trustpilot',
  },
  {
    doubt: 'En als er iets misgaat?',
    quote:
      'De aflevering van het bestelde artikel duurde langer dan oorspronkelijk de bedoeling was. Dit bedrijf heeft eerlijk de reden middels een mailtje uitgelegd en het produkt zo snel mogelijk naar mij opgestuurd. Chapeau, dat is pas service.',
    who: 'Rolf P.',
    when: '5 augustus 2026',
    where: 'Trustpilot',
  },
  {
    doubt: 'Kan ik het terugsturen?',
    quote:
      'Wij hebben een lens terug gestuurd, maar niet vanwege de kwaliteit of de winkel. Afhandeling was zeer netjes, verzending en retour ging vlot, communicatie ook snel en netjes.',
    who: 'Menno',
    when: '7 augustus 2026',
    where: 'Trustpilot',
  },
  {
    doubt: 'Krijg ik een eerlijke prijs als ik verkoop?',
    quote: 'Goede ervaring, vriendelijk geholpen, eerlijke prijs voor zowel aankoop als verkoop.',
    who: 'Hans F.',
    when: '4 augustus 2026',
    where: 'Trustpilot',
  },
  {
    doubt: 'Mag ik eerst komen kijken?',
    quote:
      'Van te voren gebeld of een objectief even apart gelegd kon worden. Geen probleem als ik gelijk langskwam. In de winkel goed geholpen en mocht uitgebreid testen met de eigen camerabody. Het objectief was in zeer goede staat, wat overeenkwam met de beschrijving op de website.',
    who: 'Sander',
    when: '9 september 2024',
    where: 'WebwinkelKeur',
  },
];

const h2: React.CSSProperties = { fontSize: 20, fontWeight: 700, margin: '38px 0 10px' };
const p: React.CSSProperties = { fontSize: 14.5, color: 'var(--text-sec)', margin: '0 0 14px', lineHeight: 1.65 };

export default function ReviewsPage() {
  return (
    <SimplePage
      title="Wat klanten van ons vinden"
      breadcrumb="Beoordelingen"
      intro="Wij verkopen sinds 2011 tweedehands apparatuur, en onze klanten laten weten wat ze ervan vinden. Hieronder de cijfers, met een link naar de bron zodat je ze zelf kunt nalezen."
    >
      {/* Kopblok: score, volume, aantal beoordelingen. Zie de toelichting bovenaan
          dit bestand voor waarom het kopcijfer de Trustpilot-score is. */}
      <div
        style={{
          display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))',
          margin: '0 0 12px',
        }}
      >
        <a
          href={HEADLINE.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: '#1E2133', borderRadius: 16, padding: '24px 26px',
            textDecoration: 'none', color: '#fff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
            <span style={{ fontSize: 52, fontWeight: 700, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              {HEADLINE.score}
            </span>
            <span style={{ fontSize: 19, color: 'rgba(255,255,255,.55)' }}>/ 10</span>
          </div>
          <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,.72)', marginTop: 8, lineHeight: 1.5 }}>
            Onze score op Trustpilot,<br />uit {HEADLINE.count} beoordelingen
          </div>
          <div style={{ fontSize: 13, color: '#FF9A5C', fontWeight: 600, marginTop: 12 }}>
            Bekijk op Trustpilot →
          </div>
        </a>

        <div style={{ background: '#fff', border: '1.5px solid #EEEEF2', borderRadius: 16, padding: '24px 26px' }}>
          <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.1, color: '#1E2133', fontVariantNumeric: 'tabular-nums' }}>
            {SOLD}
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--text-sec)', marginTop: 8, lineHeight: 1.5 }}>
            Producten verkocht<br />sinds 2011
          </div>
        </div>

        <div style={{ background: '#fff', border: '1.5px solid #EEEEF2', borderRadius: 16, padding: '24px 26px' }}>
          <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.1, color: '#1E2133', fontVariantNumeric: 'tabular-nums' }}>
            {TOTAL_COUNT}
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--text-sec)', marginTop: 8, lineHeight: 1.5 }}>
            Beoordelingen op vijf<br />onafhankelijke platformen
          </div>
        </div>
      </div>

      <h2 style={h2}>De cijfers per platform</h2>
      <div style={{ background: '#fff', border: '1.5px solid #EEEEF2', borderRadius: 16, padding: '4px 22px', margin: '0 0 10px' }}>
        {sources.map((s, i) => (
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
              <span style={{ display: 'block', fontSize: 13, color: '#8A8C99', marginTop: 2 }}>
                {s.count} beoordelingen
              </span>
              <span style={{ display: 'block', fontSize: 12.5, color: '#A0A2AE', marginTop: 3, lineHeight: 1.45 }}>
                {s.note}
              </span>
            </span>
            <span style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 6 }}>
              <ScoreStar size={18} />
              <span style={{ fontSize: 21, fontWeight: 700, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
                {s.score}
              </span>
            </span>
          </a>
        ))}
      </div>
      <p style={{ fontSize: 12.5, color: '#8A8C99', margin: '0 0 8px', lineHeight: 1.6 }}>
        Cijfers per 8 augustus 2026, alle op een schaal van 10. Trustpilot, Google en Facebook werken zelf
        met een schaal van 5; onze 4,9 op Trustpilot is dus dezelfde score als een 9,8. Klik door voor het
        actuele beeld.
      </p>

      <h2 style={h2}>Hoe onze beoordelingen tot stand komen</h2>
      <p style={p}>
        Elke klant krijgt na een aankoop automatisch een uitnodiging. Wij kiezen niet wie er gevraagd
        wordt, en wij kunnen een beoordeling niet verwijderen of aanpassen &mdash; dat is precies waarom
        een cijfer van een onafhankelijk platform iets waard is.
      </p>
      <p style={p}>
        Een winkel die zelf bepaalt welke beoordelingen zichtbaar worden, kan alleen maar goede
        beoordelingen laten zien. Dan zegt een tien niets meer. Daarom staan onze beoordelingen bij
        anderen, staan ze er op meerdere plekken, en staat overal het aantal erbij.
      </p>

      <h2 style={h2}>Vijf beoordelingen, vijf vragen</h2>
      <p style={p}>
        Hieronder staan geen beoordelingen die wij het aardigst vonden, maar beoordelingen die antwoord
        geven op de vragen waar mensen bij tweedehands apparatuur mee zitten. Ze zijn letterlijk
        overgenomen; alleen de achternaam hebben wij afgekort. Via de tabel hierboven kun je ze
        nalezen bij de bron.
      </p>
      <div style={{ display: 'grid', gap: 12, margin: '0 0 6px' }}>
        {featured.map(f => (
          <figure
            key={f.who + f.when}
            style={{
              margin: 0, background: '#fff', border: '1.5px solid #EEEEF2',
              borderRadius: 14, padding: '18px 22px',
            }}
          >
            <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '.03em', textTransform: 'uppercase', color: '#8A8C99', marginBottom: 10 }}>
              {f.doubt}
            </div>
            <blockquote style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: 'var(--text)' }}>
              {f.quote}
            </blockquote>
            <figcaption style={{ fontSize: 13, color: '#8A8C99', marginTop: 12 }}>
              {f.who} &middot; {f.when} &middot; {f.where}
            </figcaption>
          </figure>
        ))}
      </div>

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
        en wij zijn daar bij aangesloten.
      </p>
    </SimplePage>
  );
}

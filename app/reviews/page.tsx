import SimplePage from '@/components/layout/SimplePage';

// Eigen reviewpagina. Bewust GEEN AggregateRating-markup: Google toont sinds
// december 2025 geen sterren meer voor reviews die de beoordeelde partij zelf
// beheert (Organization/LocalBusiness). Deze pagina is er voor de merkzoekvraag
// ("camera-tweedehands ervaringen") en voor conversie, niet voor rich snippets.
//
// Alle cijfers opgehaald op 08-08-2026 uit de bronnen zelf:
//  - het totaal (9,7 uit 3.638) is de berekening van WebwinkelKeur, niet van ons
//  - per bron gecontroleerd op webwinkelkeur.nl/webshop/Camera-tweedehands-nl_4043
//  - Trustpilot en Google ook los nagekeken (Trustpilot 4,9/591, Google 4,8/187)
// Let op bij bijwerken: WebwinkelKeur loopt een paar dagen achter op Trustpilot.

const OVERALL = { score: '9,7', count: '3.638' };
const OVERALL_HREF = 'https://www.webwinkelkeur.nl/webshop/Camera-tweedehands-nl_4043';

const sources: { name: string; score: string; count: string; href: string; note: string }[] = [
  {
    name: 'WebwinkelKeur',
    score: '9,4 / 10',
    count: '1.893',
    href: 'https://www.webwinkelkeur.nl/webshop/Camera-tweedehands-nl_4043/reviews',
    note: 'Keurmerkorganisatie waar wij sinds 2015 bij aangesloten zijn',
  },
  {
    name: 'Trusted Shops',
    score: '10 / 10',
    count: '953',
    href: OVERALL_HREF,
    note: 'Verzameld in de jaren dat wij daar aangesloten waren',
  },
  {
    name: 'Trustpilot',
    score: '4,9 / 5',
    count: '591',
    href: 'https://nl.trustpilot.com/review/www.camera-tweedehands.nl',
    note: 'Hier komen op dit moment de meeste nieuwe beoordelingen binnen',
  },
  {
    name: 'Google',
    score: '4,8 / 5',
    count: '187',
    href: 'https://www.google.com/search?q=Camera-Tweedehands.nl+Geldermalsen',
    note: 'Vooral van mensen die in de winkel in Geldermalsen langs zijn geweest',
  },
  {
    name: 'Facebook',
    score: '5,0 / 5',
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
const td: React.CSSProperties = { padding: '11px 14px', borderBottom: '1px solid var(--border)' };

export default function ReviewsPage() {
  return (
    <SimplePage
      title="Wat klanten van ons vinden"
      breadcrumb="Beoordelingen"
      intro="Sinds 2015 hebben ruim 3.600 mensen ons beoordeeld, verspreid over vijf onafhankelijke platformen. Hieronder staan de cijfers met een link naar de bron, en een aantal beoordelingen die iets zeggen over hoe wij werken."
    >
      {/* Totaalcijfer. Nadrukkelijk gepresenteerd als de rekensom van WebwinkelKeur:
          dat maakt het een controleerbaar cijfer van een derde in plaats van ons eigen gemiddelde. */}
      <a
        href={OVERALL_HREF}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '18px 26px',
          background: '#fff', border: '1.5px solid #EEEEF2', borderRadius: 16,
          padding: '24px 26px', textDecoration: 'none', color: 'inherit', margin: '0 0 12px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 52, fontWeight: 700, lineHeight: 1, color: '#1E2133', fontVariantNumeric: 'tabular-nums' }}>
              {OVERALL.score}
            </span>
            <span style={{ fontSize: 19, color: '#8A8C99' }}>/ 10</span>
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--text-sec)', marginTop: 6 }}>
            uit {OVERALL.count} beoordelingen
          </div>
        </div>
        <div style={{ flex: '1 1 260px', minWidth: 240 }}>
          <p style={{ fontSize: 14.5, lineHeight: 1.6, margin: 0, color: 'var(--text-sec)' }}>
            Dit gemiddelde is niet door ons berekend maar door{' '}
            <strong style={{ color: 'var(--text)' }}>WebwinkelKeur</strong>, die onze beoordelingen op
            vijf platformen bij elkaar optelt.
          </p>
          <span style={{ display: 'inline-block', fontSize: 13, color: '#E8692A', fontWeight: 600, marginTop: 10 }}>
            Bekijk het overzicht bij WebwinkelKeur →
          </span>
        </div>
      </a>

      <h2 style={h2}>De cijfers per platform</h2>
      <div style={{ overflowX: 'auto', margin: '0 0 10px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 520 }}>
          <thead>
            <tr>
              {['Platform', 'Score', 'Beoordelingen'].map((hd, i) => (
                <th
                  key={hd}
                  style={{
                    textAlign: i === 0 ? 'left' : 'right', padding: '10px 14px',
                    background: 'var(--surface)', borderBottom: '1px solid var(--border)', fontWeight: 700,
                  }}
                >
                  {hd}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sources.map(s => (
              <tr key={s.name}>
                <td style={td}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
                    {s.name}
                  </a>
                  <div style={{ fontSize: 12.5, color: '#8A8C99', marginTop: 3, lineHeight: 1.5 }}>{s.note}</div>
                </td>
                <td style={{ ...td, textAlign: 'right', fontWeight: 600, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                  {s.score}
                </td>
                <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                  {s.count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 12.5, color: '#8A8C99', margin: '0 0 8px', lineHeight: 1.6 }}>
        Cijfers per 8 augustus 2026. De schalen verschillen per platform, dus wij zetten ze er onder
        elkaar zoals ze zijn in plaats van ze om te rekenen. Klik door voor het actuele beeld.
      </p>

      <h2 style={h2}>Waarom er vijf platformen staan</h2>
      <p style={p}>
        Omdat wij ondervonden hebben wat er gebeurt als je er één gebruikt. Wij waren jaren aangesloten
        bij Trusted Shops en hebben daar 953 beoordelingen opgebouwd. Toen wij daar weggingen, verdween
        die pagina — de beoordelingen zijn nog wel meegeteld door WebwinkelKeur, maar zonder dat waren
        ze onvindbaar geweest.
      </p>
      <p style={p}>
        Beoordelingen op een platform zijn dus nooit echt van jou. Daarom staan ze hier bij elkaar, met
        het aantal erbij. Een 5,0 uit 23 beoordelingen is iets heel anders dan een 9,4 uit 1.893, en dat
        hoor je te kunnen zien.
      </p>

      <h2 style={h2}>Hoe onze beoordelingen tot stand komen</h2>
      <p style={p}>
        Elke klant krijgt na een aankoop automatisch een uitnodiging. Wij kiezen niet wie er gevraagd
        wordt, en wij kunnen een beoordeling niet verwijderen of aanpassen — dat is precies waarom een
        cijfer van een onafhankelijk platform iets waard is.
      </p>
      <p style={p}>
        Een winkel die zelf bepaalt welke beoordelingen zichtbaar worden, kan alleen maar goede
        beoordelingen laten zien. Dan zegt een tien niets meer.
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

import SimplePage from '@/components/layout/SimplePage';

// Eigen reviewpagina. Bewust GEEN AggregateRating-markup: Google toont sinds
// december 2025 geen sterren meer voor reviews die de beoordeelde partij zelf
// beheert (Organization/LocalBusiness). Deze pagina is er voor de merkzoekvraag
// ("camera-tweedehands ervaringen") en voor conversie, niet voor rich snippets.
//
// Alle cijfers opgehaald op 08-08-2026 uit de bronnen zelf.
//
// BEWUST GEEN TOTAALGEMIDDELDE. WebwinkelKeur publiceert een 9,7 over 3.638
// beoordelingen, maar daar zit een blok van 953 Trusted Shops-reviews in met een
// score van 10,0. Twee redenen om daar niet op te leunen:
//  1. Wij zijn niet meer bij Trusted Shops aangesloten, die pagina bestaat niet
//     meer. Een bezoeker kan die 953 dus nergens nakijken — en de hele opzet van
//     deze pagina is dat elk cijfer aanklikbaar is.
//  2. Een 10,0 over 953 beoordelingen is statistisch niet geloofwaardig; dat zou
//     betekenen dat elke klant de volle score gaf. Vermoedelijk een importartefact
//     bij WebwinkelKeur. Navragen voor we het ooit weer gebruiken.
// Zonder dat blok: 9,5 over 2.694 beoordelingen, allemaal aanklikbaar.
//
// Wij tellen hier dus alleen het AANTAL op (een feitelijke som) en laten de scores
// per platform staan zoals ze zijn — geen zelf berekend rapportcijfer.
// Let op bij bijwerken: WebwinkelKeur loopt een paar dagen achter op Trustpilot.

const TOTAL_COUNT = '2.694';
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
      intro="Ruim 2.600 mensen hebben ons beoordeeld op vier onafhankelijke platformen. Hieronder staan de cijfers met een link naar de bron, zodat je ze allemaal zelf kunt nalezen."
    >
      {/* Geen samengesteld rapportcijfer maar het aantal. Optellen hoeveel mensen iets
          vonden is een feitelijke som; er één cijfer van maken zou een eigen gemiddelde
          zijn over vier verschillende schalen. Zie de toelichting bovenaan dit bestand. */}
      <div
        style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '18px 30px',
          background: '#fff', border: '1.5px solid #EEEEF2', borderRadius: 16,
          padding: '24px 26px', margin: '0 0 12px',
        }}
      >
        <div>
          <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1, color: '#1E2133', fontVariantNumeric: 'tabular-nums' }}>
            {TOTAL_COUNT}
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--text-sec)', marginTop: 6 }}>
            beoordelingen sinds 2015
          </div>
        </div>
        <div style={{ flex: '1 1 260px', minWidth: 240 }}>
          <p style={{ fontSize: 14.5, lineHeight: 1.6, margin: 0, color: 'var(--text-sec)' }}>
            Wij rekenen ze niet om naar één rapportcijfer. De schalen verschillen per
            platform, en een gemiddelde dat wij zelf uitrekenen kun je niet nakijken.
            Daarom staan ze hieronder gewoon los, met een link naar de bron.
          </p>
        </div>
      </div>

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
        Cijfers per 8 augustus 2026. Klik door voor het actuele beeld.
      </p>

      <h2 style={h2}>Waarom er meerdere platformen staan</h2>
      <p style={p}>
        Omdat wij ondervonden hebben wat er gebeurt als je er één gebruikt. Wij waren jaren aangesloten
        bij Trusted Shops en hebben daar ruim negenhonderd beoordelingen opgebouwd. Toen wij daar
        weggingen, verdween die pagina en waren ze in één klap onvindbaar.
      </p>
      <p style={p}>
        Wij tellen die beoordelingen hierboven dan ook niet mee. Ze waren echt, maar jij kunt ze nergens
        meer nalezen, en een cijfer dat je niet kunt controleren hoort niet op deze pagina thuis. Wat er
        wél staat, staat er met een link erbij.
      </p>
      <p style={p}>
        Om dezelfde reden staat overal het aantal beoordelingen erbij. Een 5,0 uit 23 beoordelingen is
        iets heel anders dan een 9,4 uit 1.893, en dat hoor je te kunnen zien.
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

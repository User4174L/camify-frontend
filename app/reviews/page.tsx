import SimplePage from '@/components/layout/SimplePage';

// Eigen reviewpagina. Bewust NIET met AggregateRating-markup: Google toont sinds
// december 2025 geen sterren meer voor reviews die de beoordeelde partij zelf
// beheert (Organization/LocalBusiness). Deze pagina is er voor de merkzoekvraag
// ("camera-tweedehands ervaringen") en voor conversie — niet voor rich snippets.
//
// Scores per 08-08-2026, geverifieerd in de zoekresultaten van elk platform.

const platforms = [
  {
    name: 'WebwinkelKeur',
    score: '9,4',
    scale: '/ 10',
    count: '1.893 beoordelingen',
    href: 'https://www.webwinkelkeur.nl/webshop/Camera-tweedehands-nl',
    note: 'Onafhankelijke keurmerkorganisatie waar wij bij aangesloten zijn',
  },
  {
    name: 'Trustpilot',
    score: '4,9',
    scale: '/ 5',
    count: '590 beoordelingen',
    href: 'https://nl.trustpilot.com/review/www.camera-tweedehands.nl',
    note: 'Beoordelingen worden door Trustpilot zelf op echtheid gecontroleerd',
  },
  {
    name: 'Facebook',
    score: '5,0',
    scale: '/ 5',
    count: '25 beoordelingen',
    href: 'https://www.facebook.com/cameratweedehands',
    note: 'Ruim 5.100 mensen volgen ons daar',
  },
];

const h2: React.CSSProperties = { fontSize: 20, fontWeight: 700, margin: '36px 0 10px' };
const p: React.CSSProperties = { fontSize: 14.5, color: 'var(--text-sec)', margin: '0 0 14px', lineHeight: 1.65 };

export default function ReviewsPage() {
  return (
    <SimplePage
      title="Wat klanten van ons vinden"
      breadcrumb="Beoordelingen"
      intro="Ruim 2.500 mensen hebben ons beoordeeld op drie onafhankelijke platformen. Hieronder staan de scores, met een link naar de bron zodat je ze zelf kunt nalezen."
    >
      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit,minmax(215px,1fr))', margin: '0 0 10px' }}>
        {platforms.map(pf => (
          <a
            key={pf.name}
            href={pf.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block', background: '#fff', border: '1.5px solid #EEEEF2', borderRadius: 14,
              padding: '20px 22px', textDecoration: 'none', color: 'inherit',
            }}
          >
            <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: '#8A8C99', marginBottom: 10 }}>
              {pf.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 4 }}>
              <span style={{ fontSize: 34, fontWeight: 700, lineHeight: 1, color: '#1E2133' }}>{pf.score}</span>
              <span style={{ fontSize: 15, color: '#8A8C99' }}>{pf.scale}</span>
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--text-sec)', marginBottom: 10 }}>{pf.count}</div>
            <div style={{ fontSize: 12.5, color: '#8A8C99', lineHeight: 1.5 }}>{pf.note}</div>
            <div style={{ fontSize: 13, color: '#E8692A', fontWeight: 600, marginTop: 12 }}>Lees de beoordelingen →</div>
          </a>
        ))}
      </div>
      <p style={{ fontSize: 12.5, color: '#8A8C99', margin: '0 0 8px' }}>
        Scores per 8 augustus 2026. Wij rekenen de platformen niet naar één cijfer om: de schalen
        verschillen en een zelf berekend gemiddelde kun je niet nakijken. Klik door naar de bron voor
        het actuele beeld.
      </p>

      <h2 style={h2}>Hoe onze beoordelingen tot stand komen</h2>
      <p style={p}>
        Elke klant krijgt na een aankoop automatisch een uitnodiging om ons te beoordelen. Wij kiezen
        niet wie er gevraagd wordt, en wij kunnen een beoordeling niet verwijderen of aanpassen.
      </p>
      <p style={p}>
        Dat is precies waarom een cijfer van een onafhankelijk platform iets waard is. Een winkel die
        zelf bepaalt welke beoordelingen zichtbaar worden, kan alleen maar goede beoordelingen laten
        zien — en dan zegt een tien niets meer.
      </p>
      <p style={p}>
        Daarom staan onze beoordelingen bij derden en niet in ons eigen beheer, en daarom staat er
        hierboven ook bij hoeveel beoordelingen elk cijfer is opgebouwd. Een 4,9 uit dertig
        beoordelingen is iets heel anders dan een 4,9 uit zeshonderd.
      </p>

      <h2 style={h2}>Uitgelichte beoordelingen</h2>
      <div style={{ background: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: 12, padding: '16px 20px', fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.65 }}>
        <strong style={{ color: 'var(--text)' }}>Nog in te vullen.</strong> Hier komen drie tot vijf
        echte beoordelingen met voornaam, datum en het platform erbij. Alleen letterlijke citaten van
        echte klanten — verzonnen of bewerkte beoordelingen zijn een misleidende handelspraktijk en
        daar handhaaft de ACM actief op.
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

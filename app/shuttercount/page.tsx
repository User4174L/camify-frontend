import Link from 'next/link';
import SimplePage from '@/components/layout/SimplePage';

// Shuttercount-uitleg. Bewust een losse pagina en geen FAQ-item: "wat is shuttercount"
// is een eigen zoekvraag, en wij hebben er een eigen garantieregel bij die niemand
// anders zo specifiek maakt.

const lifespan: [string, string][] = [
  ['Instapmodellen', '50.000 – 100.000 opnamen'],
  ['Middenklasse', '100.000 – 200.000 opnamen'],
  ['Professionele modellen', '300.000 – 500.000 opnamen'],
];

const h2: React.CSSProperties = { fontSize: 20, fontWeight: 700, margin: '32px 0 10px' };
const h3: React.CSSProperties = { fontSize: 16, fontWeight: 700, margin: '22px 0 8px' };
const p: React.CSSProperties = { fontSize: 14.5, color: 'var(--text-sec)', margin: '0 0 14px', lineHeight: 1.65 };

export default function ShuttercountPage() {
  return (
    <SimplePage
      title="Shuttercount"
      breadcrumb="Shuttercount"
      parent={{ label: 'Customer service', href: '/customer-service' }}
      intro="Bij elke camera met een mechanische sluiter vermelden wij de shuttercount. Hier lees je wat dat getal betekent en hoe zwaar je het moet laten wegen."
    >
      <h2 style={{ ...h2, marginTop: 0 }}>Wat is een shuttercount</h2>
      <p style={p}>
        De shuttercount is het aantal foto&rsquo;s dat met een camera is gemaakt. De sluiter is een
        mechanisch onderdeel dat bij elke opname opent en sluit, en dat gaat niet oneindig mee.
      </p>
      <p style={p}>
        Vergelijk het met de kilometerstand van een auto: het zegt iets over hoeveel er mee gewerkt
        is, maar het is niet het hele verhaal.
      </p>

      <h2 style={h2}>Wat is een normale shuttercount</h2>
      <p style={p}>Dat hangt af van het type camera.</p>
      <div style={{ overflowX: 'auto', marginBottom: 14 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 420 }}>
          <thead>
            <tr>
              {['Type camera', 'Verwachte levensduur sluiter'].map(hd => (
                <th key={hd} style={{ textAlign: 'left', padding: '10px 14px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', fontWeight: 700 }}>{hd}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lifespan.map(([type, n]) => (
              <tr key={type}>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>{type}</td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>{n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={p}>
        Een professionele camera met 80.000 opnamen heeft dus nog het grootste deel van zijn leven
        voor zich, terwijl datzelfde getal bij een instapmodel betekent dat hij zijn werk gedaan
        heeft. Bij elk toestel dat wij aanbieden vermelden wij de opgegeven levensduur van dat
        specifieke model, zodat je de shuttercount in verhouding kunt zien.
      </p>

      <h2 style={h2}>Hoe belangrijk is het echt</h2>
      <p style={p}>Minder dan veel mensen denken.</p>
      <p style={p}>
        Een sluiter is een slijtdeel dat vervangen kan worden. Gaat hij stuk, dan is dat vervelend
        maar geen einde verhaal &mdash; reparatie is meestal mogelijk en kost een fractie van een
        nieuwe camera.
      </p>
      <p style={p}>
        Belangrijker dan het getal is hoe de camera gebruikt is. Een toestel dat 100.000 opnamen in
        een studio heeft gemaakt, verkeert doorgaans in betere staat dan een toestel met 30.000
        opnamen dat jarenlang mee is geweest naar het strand.
      </p>

      <h2 style={h2}>Onze garantie op de sluiter</h2>
      <p style={p}>
        Wij geven garantie op het sluitermechanisme gedurende <strong style={{ color: 'var(--text)' }}>12 maanden</strong>, of tot
        maximaal <strong style={{ color: 'var(--text)' }}>50% van de opgegeven levensduur</strong> van dat model &mdash; afhankelijk
        van wat het eerst wordt bereikt.
      </p>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 18px', margin: '0 0 14px', fontSize: 14.5, lineHeight: 1.65 }}>
        <strong>Rekenvoorbeeld.</strong> De sluiter van een Canon 5D Mark IV heeft een opgegeven
        levensduur van 150.000 opnamen. Koop je dat toestel bij ons, dan geldt de garantie op de
        sluiter tot 75.000 opnamen die je er zelf mee maakt, gerekend vanaf je aankoop &mdash; of tot
        de 12 maanden voorbij zijn.
      </div>

      <h2 style={h2}>Camera&rsquo;s zonder mechanische sluiter</h2>
      <p style={p}>
        Niet elke camera heeft een mechanische sluiter, en niet elke camera houdt bij hoeveel opnamen
        er zijn gemaakt.
      </p>
      <p style={p}>
        Bij spiegelloze toestellen die uitsluitend elektronisch belichten, is er geen mechanisch
        onderdeel dat slijt. De shuttercount zegt daar dus veel minder &mdash; soms helemaal niets.
        Bij toestellen met beide sluiters vermelden wij waar mogelijk het aantal mechanische opnamen,
        want dat is het getal dat over slijtage gaat. En bij oudere analoge toestellen bestaat de
        registratie simpelweg niet.
      </p>

      <h3 style={h3}>Dan telt de conditie zwaarder</h3>
      <p style={p}>
        Ontbreekt de shuttercount, of gaat het om een toestel zonder mechanische sluiter, dan is de
        staat van het toestel de belangrijkste maatstaf. Hoe ziet de behuizing eruit, hoe lopen de
        knoppen, is er sprake van vocht of zand, hoe schoon is de sensor.
      </p>
      <p style={p}>
        Dat is trouwens sowieso een betere maatstaf dan mensen denken. Een camera met 500.000 opnamen
        die zijn hele leven in een studio heeft gestaan, verkeert vaak in betere staat dan een toestel
        met 50.000 opnamen dat jarenlang mee is geweest naar het strand en de bergen. Het getal
        vertelt hoeveel er gewerkt is, de conditie vertelt hoe er gewerkt is.
      </p>
      <p style={p}>
        Wij beoordelen daarom altijd allebei. Wat wij per conditie hanteren, staat op de pagina{' '}
        <Link href="/quality-grading" style={{ color: 'var(--accent)' }}>productcondities</Link>.
      </p>

      <h2 style={h2}>Twijfel je over een specifiek toestel?</h2>
      <p style={{ ...p, marginBottom: 0 }}>
        Bel ons op <a href="tel:+31853018332" style={{ color: 'var(--accent)' }}>085 301 83 32</a>. Wij
        pakken het erbij, kijken naar de stand en vertellen je eerlijk wat wij ervan vinden &mdash;
        ook als dat betekent dat we je een ander exemplaar aanraden.
      </p>
    </SimplePage>
  );
}

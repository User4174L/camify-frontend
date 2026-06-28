import Link from 'next/link';
import SimplePage from '@/components/layout/SimplePage';

// Conditie-teksten 1-op-1 van de live site (productcondities-pagina), opzet naar MPB-voorbeeld.
const grades = [
  {
    name: 'Zo goed als nieuw',
    level: 5,
    summary: 'Nagenoeg geen gebruikssporen — als nieuw in de hand.',
    cosmetic: 'Nagenoeg geen gebruikssporen; rubbers zijn in topstaat.',
    optics: 'Intern niet meer dan 1–2 stofdeeltjes, het glas is perfect.',
    function: 'Alle functies werken volledig naar behoren.',
  },
  {
    name: 'Zeer goed',
    level: 4,
    summary: 'Minimale gebruikssporen, nauwelijks zichtbaar.',
    cosmetic: 'Minimale gebruikssporen; hele kleine krasjes of beschadigingen kunnen aanwezig zijn.',
    optics: 'Zeer kleine beschadigingen op de lens of enkele stofdeeltjes mogelijk — geen invloed op het resultaat.',
    function: 'Alle functies werken volledig naar behoren.',
  },
  {
    name: 'Goed',
    level: 3,
    summary: 'Normale gebruikssporen, zichtbaar gebruikt.',
    cosmetic: 'Meerdere krasjes en/of gebruikssporen van regulier gebruik.',
    optics: 'Meerdere stofdeeltjes in de lens mogelijk; kleine beschadigingen op het glas mogelijk — geen invloed op het resultaat.',
    function: 'Alle functies werken volledig naar behoren.',
  },
  {
    name: 'Gebruikt',
    level: 2,
    summary: 'Duidelijke gebruikssporen, volledig functioneel.',
    cosmetic: 'Duidelijke gebruikssporen zoals krasjes en slijtage op het LCD-scherm.',
    optics: 'Krasjes of stof mogelijk — geen of minimale invloed op het resultaat.',
    function: 'Bewegende delen zoals knoppen, zoom en focus kunnen iets stroever gaan; alle functies werken naar behoren, tenzij anders vermeld.',
  },
  {
    name: 'Zeer gebruikt',
    level: 1,
    summary: 'Intens gebruikt met aanzienlijke slijtage.',
    cosmetic: 'Intens gebruikt met aanzienlijke slijtage of schade.',
    optics: 'Stof of krassen op de lens mogelijk — kan gering van invloed zijn op het resultaat.',
    function: 'Volledig functioneel en getest, tenzij anders vermeld.',
  },
];

const checks = [
  'Sensor (vlekken, hete pixels)',
  'Autofocus-nauwkeurigheid',
  'Lensglas & coating',
  'Sluitermechanisme & shuttercount',
  'Bedieningsringen, knoppen & poorten',
  'Cosmetische staat, rubbers & LCD',
];

function Dots({ level }: { level: number }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: i <= level ? 'var(--accent)' : 'var(--border)' }} />
      ))}
    </div>
  );
}

function GradeRow({ label, text }: { label: string; text: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '92px 1fr', gap: 10, fontSize: 13.5, lineHeight: 1.55 }}>
      <span style={{ fontWeight: 700, color: 'var(--text-sec)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.04em', paddingTop: 1 }}>{label}</span>
      <span style={{ color: 'var(--text)' }}>{text}</span>
    </div>
  );
}

export default function Page() {
  return (
    <SimplePage
      title="Quality &amp; grading"
      breadcrumb="Quality & grading"
      eyebrow="Kwaliteit"
      intro="Of je nu koopt, verkoopt of inruilt: we beoordelen de staat van elk item duidelijk en eerlijk, in vijf gedetailleerde conditieniveaus. Zo weet je precies wat je koopt."
    >
      {/* Conditieschaal */}
      <div style={{ display: 'grid', gap: 14, marginBottom: 36 }}>
        {grades.map(g => (
          <div key={g.name} className="cam-lift" style={{ border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', background: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
              <div style={{ fontWeight: 800, fontSize: 16 }}>{g.name}</div>
              <Dots level={g.level} />
            </div>
            <p style={{ margin: '0 0 12px', fontSize: 13.5, color: 'var(--text-sec)' }}>{g.summary}</p>
            <div style={{ display: 'grid', gap: 8 }}>
              <GradeRow label="Cosmetisch" text={g.cosmetic} />
              <GradeRow label="Optiek" text={g.optics} />
              <GradeRow label="Werking" text={g.function} />
            </div>
          </div>
        ))}
      </div>

      {/* Shuttercount-callout */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', marginBottom: 28 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" style={{ flexShrink: 0, marginTop: 2 }}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
        <div style={{ fontSize: 14, lineHeight: 1.65 }}>
          <strong>Conditie &amp; shuttercount staan los van elkaar.</strong> Producten worden ingedeeld op basis van de uiterlijke staat. Een camera met een hoge shuttercount kan dus alsnog &ldquo;Zo goed als nieuw&rdquo; zijn — de prijs wordt aangepast op basis van de shuttercount. Waar van toepassing lezen we de shuttercount uit met professionele diagnosetools (EXIF-data of fabrikant-servicesoftware) en vermelden we deze op de productpagina.
        </div>
      </div>

      {/* Wat we controleren */}
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 14px' }}>Wat we controleren</h2>
      <p style={{ fontSize: 14.5, color: 'var(--text-sec)', margin: '0 0 14px', lineHeight: 1.65 }}>
        Elk item wordt door onze technici geïnspecteerd en getest voordat het online komt:
      </p>
      <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', marginBottom: 32 }}>
        {checks.map(c => (
          <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', fontSize: 13.5, fontWeight: 600 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2" style={{ flexShrink: 0 }}>
              <path d="M20 6 9 17l-5-5" />
            </svg>
            {c}
          </div>
        ))}
      </div>

      {/* Echte foto's */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', marginBottom: 36 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" style={{ flexShrink: 0, marginTop: 2 }}>
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
        <div style={{ fontSize: 14, lineHeight: 1.65 }}>
          <strong>Echte foto&rsquo;s van het exacte item.</strong> We maken voor elk product gedetailleerde foto&rsquo;s vanuit verschillende hoeken — geen stockbeelden. Zo zie je vooraf precies de cosmetische staat: wat je ziet, is wat je krijgt.
        </div>
      </div>

      {/* CTA */}
      <div style={{ border: '1px solid var(--border)', borderRadius: 14, padding: '26px 28px', textAlign: 'center', background: '#fff' }}>
        <div style={{ fontWeight: 800, fontSize: 19, marginBottom: 6 }}>Zelf apparatuur verkopen of inruilen?</div>
        <p style={{ fontSize: 14, color: 'var(--text-sec)', margin: '0 0 18px' }}>
          Vraag vandaag nog je gratis offerte aan — of ontdek ons uitgebreide aanbod aan tweedehands camera-apparatuur.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/trade-in" style={{ background: 'var(--accent)', color: '#fff', fontWeight: 600, fontSize: 14.5, padding: '12px 26px', borderRadius: 999 }}>
            Gratis offerte aanvragen
          </Link>
          <Link href="/cameras" style={{ border: '1.5px solid var(--border)', color: 'var(--text)', fontWeight: 600, fontSize: 14.5, padding: '12px 26px', borderRadius: 999 }}>
            Bekijk het aanbod
          </Link>
        </div>
      </div>
    </SimplePage>
  );
}

import Link from 'next/link';
import SimplePage from '@/components/layout/SimplePage';
import Reveal from '@/components/ui/Reveal';

// Focus: inruilen/verkopen in duidelijke stappen; kopen als korte sectie eronder.
const sellSteps = [
  {
    t: 'Selecteer je apparatuur',
    d: 'Zoek je camera, lens of accessoire op in onze inruiltool en geef de conditie aan. Meerdere items tegelijk kan ook.',
  },
  {
    t: 'Vraag een prijsopgave aan',
    d: 'Je ziet direct een indicatie van de waarde, gebaseerd op actuele marktprijzen, conditie en vraag.',
  },
  {
    t: 'Ontvang je bod',
    d: 'Akkoord met de prijsopgave? Dan ontvang je ons bod met een gratis verzendlabel per e-mail.',
  },
  {
    t: 'Verstuur gratis & verzekerd',
    d: 'Verpak je apparatuur goed, plak het label erop en lever het pakket af bij een PostNL- of DHL-punt. De verzending is volledig verzekerd.',
  },
  {
    t: 'Inspectie & test',
    d: 'Onze technici inspecteren en testen alles binnen 2 werkdagen na ontvangst — sensor, autofocus, glas, sluiter en cosmetische staat.',
  },
  {
    t: 'Uitbetaald of verrekend',
    d: 'Klopt de conditie met je opgave? Dan betalen we binnen 48 uur uit op je IBAN — of je verrekent het bedrag direct met een nieuwe aankoop.',
  },
];

const buySteps = [
  { t: 'Blader', d: 'Kies uit duizenden geïnspecteerde items de conditie en prijs die bij je past.' },
  { t: 'Bekijk', d: 'Echte foto’s van het exacte item, de precieze conditie en de shuttercount (waar van toepassing).' },
  { t: 'Reken af', d: 'Betaal veilig met je voorkeursbetaalmethode.' },
  { t: 'Ontvang', d: 'Aangetekend en verzekerd bezorgd, met minimaal 12 maanden garantie en 14 dagen retourrecht.' },
];

const faqs = [
  {
    q: 'Wat als de conditie afwijkt van mijn opgave?',
    a: 'Dan nemen we contact op met een aangepast bod. Ga je niet akkoord, dan sturen we je apparatuur kosteloos terug.',
  },
  {
    q: 'Moet ik iets terugkopen, of kan ik ook alleen verkopen?',
    a: 'Alleen verkopen kan natuurlijk ook. Inruilen tegen een nieuwe aankoop mag, maar is geen voorwaarde — je kiest zelf voor uitbetaling of verrekening.',
  },
  {
    q: 'Hoe bepalen jullie de waarde van mijn apparatuur?',
    a: 'Op basis van actuele marktprijzen, de conditie, de vraag en wat vergelijkbare items opbrengen. Omdat we direct aan eindklanten verkopen, zonder tussenpartijen, kunnen we scherp bieden.',
  },
  {
    q: 'Hoe verpak ik mijn apparatuur het beste?',
    a: 'Gebruik bij voorkeur de originele doos en voldoende beschermend materiaal (bijv. noppenfolie). De verzending met ons label is volledig verzekerd.',
  },
  {
    q: 'Wanneer krijg ik mijn geld?',
    a: 'Na de inspectie (binnen 2 werkdagen na ontvangst) en jouw akkoord betalen we binnen 48 uur uit via bankoverschrijving op je IBAN.',
  },
];

const cardBase: React.CSSProperties = {
  border: '1px solid var(--border)',
  borderRadius: 12,
  padding: 18,
  background: '#fff',
  height: '100%',
};

export default function Page() {
  return (
    <SimplePage
      title="How it works"
      breadcrumb="How it works"
      intro="Je camera-apparatuur verkopen of inruilen is bij ons zo geregeld — eerlijk geprijsd, gratis verzekerd verzonden en snel uitbetaald."
      titleReveal
    >
      {/* Verkopen/inruilen — stappen */}
      <Reveal>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '8px 0 16px' }}>Verkopen of inruilen in 6 stappen</h2>
      </Reveal>
      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', marginBottom: 18 }}>
        {sellSteps.map((s, i) => (
          <Reveal key={s.t} delay={i * 70}>
            <div className="cam-lift" style={cardBase}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>{i + 1}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{s.t}</div>
              <div style={{ fontSize: 13.5, color: 'var(--text-sec)', lineHeight: 1.55 }}>{s.d}</div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
          <Link href="/trade-in" style={{ background: 'var(--accent)', color: '#fff', fontWeight: 600, fontSize: 14.5, padding: '12px 26px', borderRadius: 999 }}>
            Start je gratis prijsopgave
          </Link>
          <span style={{ fontSize: 13, color: 'var(--text-sec)' }}>Vrijblijvend — niet akkoord? Gratis retour.</span>
        </div>
      </Reveal>

      {/* Kopen — kort */}
      <Reveal>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 16px' }}>Kopen in 4 stappen</h2>
      </Reveal>
      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', marginBottom: 40 }}>
        {buySteps.map((s, i) => (
          <Reveal key={s.t} delay={i * 60}>
            <div className="cam-lift" style={{ ...cardBase }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--accent)', marginBottom: 6 }}>Stap {i + 1}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{s.t}</div>
              <div style={{ fontSize: 13.5, color: 'var(--text-sec)', lineHeight: 1.55 }}>{s.d}</div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* FAQ */}
      <Reveal>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 14px' }}>Veelgestelde vragen over verkopen</h2>
      </Reveal>
      <div style={{ display: 'grid', gap: 10, marginBottom: 16 }}>
        {faqs.map((f, i) => (
          <Reveal key={f.q} delay={i * 55}>
            <details className="cam-lift" style={{ border: '1px solid var(--border)', borderRadius: 12, padding: '14px 18px', background: '#fff' }}>
              <summary style={{ fontWeight: 600, fontSize: 14.5, cursor: 'pointer' }}>{f.q}</summary>
              <p style={{ margin: '10px 0 2px', fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.65 }}>{f.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
      <p style={{ fontSize: 13.5, color: 'var(--text-sec)', margin: 0 }}>
        Meer vragen? Bekijk de <Link href="/faq" style={{ color: 'var(--accent)', fontWeight: 600 }}>volledige FAQ</Link> of <Link href="/contact" style={{ color: 'var(--accent)', fontWeight: 600 }}>neem contact op</Link>.
      </p>
    </SimplePage>
  );
}

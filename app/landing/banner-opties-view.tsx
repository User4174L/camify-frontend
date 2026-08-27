import Link from 'next/link';

/**
 * Vier formats voor de smalle landingspagina-banner, elk desktop + mobiel.
 * Zelfde content (Lenzen voor Canon); alleen het format verschilt. Doel:
 * één herbruikbaar format kiezen — daarna is per pagina alleen nog een
 * (product)afbeelding nodig.
 */

const TITEL = ['Lenzen voor', 'Canon'] as const;
const SUB = 'Van lichtsterke primes tot veelzijdige zooms: ruim duizend geteste tweedehands lenzen met RF-, EF-, EF-S- of EF-M-vatting, met garantie.';
const SUB_M = 'Ruim 1.000 geteste lenzen met RF-, EF-, EF-S- of EF-M-vatting.';
const SFEER = '/images/canon-rf-24-70mm-f28-l-is-usm.jpg';
const PACKSHOT = '/images/lenses/canon-rf-70-200-f28.webp';
const ORANJE = 'var(--accent, #E8692A)';

function Tekst({ licht, mobiel }: { licht?: boolean; mobiel?: boolean }) {
  return (
    <div style={{ position: 'relative', zIndex: 2, padding: mobiel ? '18px 20px' : '26px 32px', maxWidth: mobiel ? '100%' : 620 }}>
      <h2 style={{ fontSize: mobiel ? 21 : 28, fontWeight: 800, color: licht ? '#111' : '#fff', margin: 0, lineHeight: 1.2 }}>
        {TITEL[0]} <span style={{ color: ORANJE }}>{TITEL[1]}</span>
      </h2>
      <p style={{ fontSize: mobiel ? 13 : 14, lineHeight: 1.55, color: licht ? '#555' : 'rgba(255,255,255,0.85)', margin: '8px 0 0' }}>
        {mobiel ? SUB_M : SUB}
      </p>
    </div>
  );
}

const frame = (mobiel: boolean): React.CSSProperties => ({
  position: 'relative', borderRadius: 12, overflow: 'hidden',
  minHeight: mobiel ? 132 : 150, display: 'flex', alignItems: 'center',
});

/* A — sfeerfoto met gradient (huidige versie) */
function VariantA({ mobiel }: { mobiel?: boolean }) {
  return (
    <div style={{ ...frame(!!mobiel), background: '#1a1a2e' }}>
      <img src={SFEER} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center right' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(10,10,20,0.88) 0%, rgba(10,10,20,0.55) 45%, rgba(10,10,20,0.08) 100%)' }} />
      <Tekst mobiel={mobiel} />
    </div>
  );
}

/* B — licht vlak met vrijstaand product (naadloos met onze packshots op wit) */
function VariantB({ mobiel }: { mobiel?: boolean }) {
  return (
    <div style={{ ...frame(!!mobiel), background: 'linear-gradient(90deg, #f6f6f7 0%, #ffffff 60%)', border: '1px solid var(--border, #e5e7eb)' }}>
      <Tekst licht mobiel={mobiel} />
      <img src={PACKSHOT} alt="" style={{ position: 'absolute', right: mobiel ? -14 : 24, top: '50%', transform: 'translateY(-50%) rotate(-4deg)', height: mobiel ? '108%' : '124%', objectFit: 'contain', zIndex: 1 }} />
      {mobiel && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(246,246,247,0.9) 45%, rgba(246,246,247,0) 75%)', zIndex: 1 }} />}
    </div>
  );
}

/* C — donker vlak met product in wit paneel rechts */
function VariantC({ mobiel }: { mobiel?: boolean }) {
  return (
    <div style={{ ...frame(!!mobiel), background: 'linear-gradient(105deg, #16161f 0%, #23232f 100%)' }}>
      <Tekst mobiel={mobiel} />
      <div style={{ position: 'absolute', right: mobiel ? 12 : 28, top: '50%', transform: 'translateY(-50%)', width: mobiel ? 84 : 118, height: mobiel ? 84 : 118, borderRadius: 16, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.35)', zIndex: 1 }}>
        <img src={PACKSHOT} alt="" style={{ width: '86%', height: '86%', objectFit: 'contain' }} />
      </div>
    </div>
  );
}

/* D — donker met oranje brand-gradient + vrijstaand product in lichte cirkel */
function VariantD({ mobiel }: { mobiel?: boolean }) {
  return (
    <div style={{ ...frame(!!mobiel), background: 'linear-gradient(100deg, #1b1b26 0%, #2a2030 55%, #E8692A 160%)' }}>
      <Tekst mobiel={mobiel} />
      <div style={{ position: 'absolute', right: mobiel ? 10 : 32, top: '50%', transform: 'translateY(-50%)', width: mobiel ? 92 : 124, height: mobiel ? 92 : 124, borderRadius: '50%', background: 'radial-gradient(circle, #ffffff 0%, #f1f1f3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 28px rgba(232,105,42,0.35)', zIndex: 1 }}>
        <img src={PACKSHOT} alt="" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
      </div>
    </div>
  );
}

const OPTIES: Array<{ key: string; naam: string; uitleg: string; C: (p: { mobiel?: boolean }) => React.JSX.Element }> = [
  { key: 'A', naam: 'A — Sfeerfoto + gradient (huidige)', C: VariantA,
    uitleg: 'Foto als achtergrond, donkere gradient voor leesbaarheid. Mooiste als er een échte sfeerfoto is — vraagt per pagina wel een geschikte, brede foto (19× te zoeken/maken).' },
  { key: 'B', naam: 'B — Licht met vrijstaand product', C: VariantB,
    uitleg: 'Licht vlak, donkere tekst, packshot rechts. Werkt naadloos met onze eigen productfoto\'s op wit — élke productfoto uit de winkel is bruikbaar, dus 100% herbruikbaar zonder fotografie. Sluit aan bij de witte productkaarten.' },
  { key: 'C', naam: 'C — Donker met productpaneel', C: VariantC,
    uitleg: 'Donker vlak met het product in een wit afgerond paneel. Ook volledig herbruikbaar met bestaande packshots; contrastrijker dan B, banner oogt duidelijk als "kop" van de pagina.' },
  { key: 'D', naam: 'D — Brand-gradient + productcirkel', C: VariantD,
    uitleg: 'Donker met oranje merk-gradient en het product in een lichte cirkel. Meest uitgesproken merkbeeld; zelfde herbruikbaarheid als C.' },
];

export default function BannerOpties() {
  return (
    <div className="container" style={{ paddingBottom: 64 }}>
      <div style={{ margin: '24px 0 6px' }}>
        <h1 className="section__title" style={{ marginBottom: 8 }}>Bannerformat — 4 opties</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 760, lineHeight: 1.6 }}>
          Zelfde content, vier formats. Links desktop, rechts mobiel (375px: grote titel + korte subtekst).
          Eén format kiezen → per pagina is daarna alleen nog een afbeelding nodig.
          Terug naar <Link href="/landing/canon-lenzen" style={{ color: 'var(--accent)', fontWeight: 600 }}>de voorbeeldpagina</Link>.
        </p>
      </div>
      {OPTIES.map(({ key, naam, uitleg, C }) => (
        <section key={key} style={{ marginTop: 36 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{naam}</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 760, lineHeight: 1.55, margin: '0 0 12px' }}>{uitleg}</p>
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 560px', minWidth: 320 }}><C /></div>
            <div style={{ flex: '0 0 375px', maxWidth: '100%' }}>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary, #999)', marginBottom: 4 }}>mobiel (375px)</div>
              <C mobiel />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

import SimplePage from '@/components/layout/SimplePage';
import TrustStrip from '@/components/ui/TrustStrip';
import PageNav from '@/components/ui/PageNav';

const nav = [
  { label: 'Verzending', href: '#verzending' },
  { label: 'Verzendkosten', href: '#kosten' },
  { label: 'Retourneren', href: '#retourneren' },
  { label: 'Voorwaarden', href: '#voorwaarden' },
];

const trust = [
  { ic: <><rect x="1" y="3" width="15" height="13" rx="1.5" /><path d="M16 8h4l3 3v5h-7z" /><circle cx="5.5" cy="18.5" r="2" /><circle cx="18.5" cy="18.5" r="2" /></>, n: 'Gratis vanaf €100', l: 'NL, België & Duitsland' },
  { ic: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>, n: 'Voor 15:00 besteld', l: 'zelfde dag verzonden' },
  { ic: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>, n: 'Aangetekend', l: 'verzekerd verzonden' },
  { ic: <><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></>, n: '14 dagen', l: 'retourrecht' },
];

const rows = [
  ['Nederland & België', 'Gratis vanaf €100, anders €4,95', '1–2 werkdagen'],
  ['Duitsland', 'Gratis vanaf €100, anders €6,95', '1–2 werkdagen'],
  ['Overig EU (incl. Frankrijk)', '€14,95', '2–5 werkdagen'],
  ['Buiten de EU (0–23 kg)', 'Berekend in de checkout (vanaf €79)', 'Varieert per land'],
];

const steps = [
  { n: '1', t: 'Aanmelden', d: 'Meld je retour binnen 14 dagen na ontvangst aan via info@camera-tweedehands.nl, met je ordernummer.' },
  { n: '2', t: 'Terugsturen', d: 'Print het retourformulier, voeg het bij en stuur het product compleet, in originele staat en voldoende gefrankeerd retour.' },
  { n: '3', t: 'Terugbetaling', d: 'Na ontvangst en controle betalen we het orderbedrag binnen 14 dagen terug op je IBAN.' },
];

const conditions = [
  'Compleet en in originele staat, inclusief alle toebehoren, labels en — indien mogelijk — de originele verzenddoos.',
  'Het product mag bekeken en getest worden zoals in een winkel, maar niet verder gebruikt zijn.',
  'De kosten van retourzending zijn voor eigen rekening, tenzij het product defect of beschadigd is ontvangen — dan vergoeden we de retourkosten.',
  'Het pakket moet voldoende gefrankeerd zijn; onvoldoende gefrankeerde retouren kunnen we niet aannemen.',
];

function Carrier({ name }: { name: string }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', fontWeight: 800, fontSize: 12, color: 'var(--text-sec)', background: '#fff', letterSpacing: '.03em' }}>
      {name}
    </div>
  );
}

export default function Page() {
  return (
    <SimplePage
      title="Shipping &amp; returns"
      breadcrumb="Shipping & returns"
      eyebrow="Verzenden & retour"
      parent={{ label: 'Help', href: '/help' }}
      image="/images/hero-photographer-2.jpg"
      intro="Snel, aangetekend en verzekerd verzonden — met een eenvoudig 14-daags retourrecht."
    >
      <div style={{ marginBottom: 28 }}><TrustStrip items={trust} /></div>

      <PageNav items={nav} />

      {/* Carriers + badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
        <span style={{ fontSize: 13, color: 'var(--text-sec)' }}>Verzonden met:</span>
        <Carrier name="PostNL" />
        <Carrier name="DHL" />
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', border: '1px solid var(--accent)', borderRadius: 999, padding: '4px 12px' }}>
          Aangetekend &amp; verzekerd
        </span>
      </div>

      <h2 id="verzending" style={{ fontSize: 20, fontWeight: 700, margin: '0 0 10px', scrollMarginTop: 90 }}>Verzending</h2>
      <p style={{ fontSize: 14.5, color: 'var(--text-sec)', margin: '0 0 18px', lineHeight: 1.65 }}>
        Voor 15:00 besteld op werkdagen = dezelfde dag verzonden. In de meeste gevallen ontvang je je pakket de volgende dag (internationale zendingen uitgezonderd). Elke bestelling gaat aangetekend en verzekerd de deur uit.
      </p>

      <h2 id="kosten" style={{ fontSize: 20, fontWeight: 700, margin: '0 0 12px', scrollMarginTop: 90 }}>Verzendkosten &amp; levertijd</h2>
      <div style={{ overflowX: 'auto', marginBottom: 10 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 520 }}>
          <thead>
            <tr>
              {['Bestemming', 'Kosten', 'Levertijd'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r[0]}>
                {r.map((c, i) => (
                  <td key={i} style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', fontWeight: i === 1 ? 600 : 400 }}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 12.5, color: '#8A8C99', margin: '0 0 32px' }}>
        Bestellingen buiten de EU worden in de checkout berekend; eventuele invoerrechten en lokale btw zijn voor rekening van de ontvanger.
      </p>

      <h2 id="retourneren" style={{ fontSize: 20, fontWeight: 700, margin: '0 0 14px', scrollMarginTop: 90 }}>Retourneren in 3 stappen</h2>
      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', marginBottom: 28 }}>
        {steps.map(s => (
          <div key={s.n} className="cam-lift" style={{ border: '1px solid var(--border)', borderRadius: 12, padding: '18px', background: '#fff' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>{s.n}</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{s.t}</div>
            <div style={{ fontSize: 13.5, color: 'var(--text-sec)', lineHeight: 1.5 }}>{s.d}</div>
          </div>
        ))}
      </div>

      <h2 id="voorwaarden" style={{ fontSize: 20, fontWeight: 700, margin: '0 0 12px', scrollMarginTop: 90 }}>Voorwaarden voor retour</h2>
      <ul style={{ margin: '0 0 24px', paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 10 }}>
        {conditions.map((c, i) => (
          <li key={i} style={{ display: 'flex', gap: 10, fontSize: 14, lineHeight: 1.6, color: 'var(--text)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2" style={{ flexShrink: 0, marginTop: 2 }}><path d="M20 6 9 17l-5-5" /></svg>
            <span>{c}</span>
          </li>
        ))}
      </ul>

      {/* Retourformulier download */}
      <a href="/retourformulier.pdf" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, border: '1.5px solid var(--accent)', color: 'var(--accent)', fontWeight: 600, fontSize: 14, padding: '11px 20px', borderRadius: 999, marginBottom: 32 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>
        Download het retourformulier (PDF)
      </a>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
        <strong>Retouradres</strong><br />
        Camera-tweedehands.nl — T.a.v. Retouren<br />
        Kerkstraat 47 Bis, 4191AA Geldermalsen, Nederland
        <div style={{ fontSize: 13, color: 'var(--text-sec)', marginTop: 10 }}>
          Het retourbeleid geldt uitsluitend voor online aankopen via de webshop (niet voor showroom-aankopen). Het herroepingsrecht geldt alleen voor consumenten; zakelijke klanten hebben in beginsel geen herroepingsrecht.
        </div>
      </div>
    </SimplePage>
  );
}

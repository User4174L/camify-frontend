import SimplePage from '@/components/layout/SimplePage';

const rows = [
  ['Nederland & België — onder €100', '€5,95', '1–2 werkdagen'],
  ['Nederland & België — boven €100', 'Gratis', '1–2 werkdagen'],
  ['Buiten de EU (0–23 kg)', '€14,95', 'Varieert per land'],
];

const steps = [
  { n: '1', t: 'Aanmelden', d: 'Meld je retour binnen 14 dagen aan via e-mail of het retourformulier.' },
  { n: '2', t: 'Terugsturen', d: 'Stuur het product compleet en voldoende gefrankeerd retour, in originele staat.' },
  { n: '3', t: 'Terugbetaling', d: 'Na ontvangst en controle betalen we binnen 14 dagen terug.' },
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
      intro="Snel, aangetekend en verzekerd verzonden — met een eenvoudig 14-daags retourrecht."
    >
      {/* Carriers + badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
        <span style={{ fontSize: 13, color: 'var(--text-sec)' }}>Verzonden met:</span>
        <Carrier name="PostNL" />
        <Carrier name="DHL" />
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', border: '1px solid var(--accent)', borderRadius: 999, padding: '4px 12px' }}>
          Aangetekend &amp; verzekerd
        </span>
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 12px' }}>Verzendkosten &amp; levertijd</h2>
      <p style={{ fontSize: 14, color: 'var(--text-sec)', margin: '0 0 12px' }}>Voor 15:00 besteld = dezelfde werkdag verzonden.</p>
      <div style={{ overflowX: 'auto', marginBottom: 32 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 480 }}>
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

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 14px' }}>Retourneren in 3 stappen</h2>
      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', marginBottom: 28 }}>
        {steps.map(s => (
          <div key={s.n} style={{ border: '1px solid var(--border)', borderRadius: 12, padding: '18px' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>{s.n}</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{s.t}</div>
            <div style={{ fontSize: 13.5, color: 'var(--text-sec)', lineHeight: 1.5 }}>{s.d}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', fontSize: 14, lineHeight: 1.6 }}>
        <strong>Retouradres</strong><br />
        Camera-tweedehands.nl — T.a.v. Retouren<br />
        Kerkstraat 47 Bis, 4191AA Geldermalsen, Nederland
        <div style={{ fontSize: 13, color: 'var(--text-sec)', marginTop: 10 }}>
          Geldt uitsluitend voor online aankopen (niet showroom). Alleen consumenten hebben herroepingsrecht.
        </div>
      </div>
    </SimplePage>
  );
}

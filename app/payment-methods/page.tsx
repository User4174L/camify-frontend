import SimplePage from '@/components/layout/SimplePage';

const online = [
  { name: 'iDEAL', note: 'Meest gekozen' },
  { name: 'Bancontact', note: 'België' },
  { name: 'PayPal', note: '+ 3,4% toeslag' },
  { name: 'In 3 termijnen', note: '0% rente' },
  { name: 'Visa', note: 'Creditcard' },
  { name: 'Mastercard', note: 'Creditcard' },
  { name: 'Maestro', note: '' },
  { name: 'AMEX', note: 'American Express' },
  { name: 'Overboeking', note: 'SCT' },
  { name: 'Paysafecard', note: 'Prepaid' },
  { name: 'SOFORT', note: 'Duitsland' },
  { name: 'Giropay', note: '' },
  { name: 'EPS', note: 'Oostenrijk' },
  { name: 'Przelewy24', note: 'Polen' },
];

const inStore = [
  { name: 'Contant', note: 'In de winkel' },
  { name: 'Pinnen', note: 'In de winkel' },
];

function Badge({ name, note }: { name: string; note: string }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, background: '#fff' }}>
      <div style={{ width: 46, height: 30, borderRadius: 6, background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: 'var(--text-sec)', flexShrink: 0, letterSpacing: '.02em' }}>
        {name.slice(0, 5).toUpperCase()}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{name}</div>
        {note ? <div style={{ fontSize: 12, color: 'var(--text-sec)' }}>{note}</div> : null}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <SimplePage
      title="Payment methods"
      breadcrumb="Payment methods"
      intro="Bij Camera-tweedehands.nl kies je de betaalmethode die het beste bij je past — online en in de winkel. Veilig en snel."
    >
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '8px 0 14px' }}>Online betalen</h2>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', marginBottom: 32 }}>
        {online.map(m => <Badge key={m.name} {...m} />)}
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 14px' }}>In de winkel</h2>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', marginBottom: 32 }}>
        {inStore.map(m => <Badge key={m.name} {...m} />)}
      </div>

      {/* Trust-blok */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px' }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" style={{ flexShrink: 0 }}>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <div style={{ fontSize: 14, color: 'var(--text)' }}>
          <strong>Veilig betalen.</strong> Alle betalingen verlopen via een beveiligde (SSL) verbinding en worden verwerkt door onze betaalprovider Pay.nl.
        </div>
      </div>
    </SimplePage>
  );
}

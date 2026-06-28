import SimplePage from '@/components/layout/SimplePage';
import TrustStrip from '@/components/ui/TrustStrip';

const trust = [
  { ic: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>, n: 'Veilig via Pay.nl', l: 'beveiligde SSL-betaling' },
  { ic: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></>, n: '14 methodes', l: 'iDEAL, PayPal, creditcard…' },
  { ic: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>, n: 'In 3 termijnen', l: '0% rente' },
  { ic: <><path d="M3 9l1-5h16l1 5" /><path d="M4 9v11h16V9" /><path d="M9 20v-6h6v6" /></>, n: 'Pinnen & contant', l: 'in de showroom' },
];

const online = [
  { name: 'iDEAL', note: 'Meest gekozen', logo: '/payment/ideal.svg' },
  { name: 'Bancontact', note: 'België', logo: '/payment/bancontact.svg' },
  { name: 'PayPal', note: '+ 3,4% toeslag', logo: '/payment/paypal.svg' },
  { name: 'In 3 termijnen', note: '0% rente', icon: 'installments' },
  { name: 'Visa', note: 'Creditcard', logo: '/payment/visa.svg' },
  { name: 'Mastercard', note: 'Creditcard', logo: '/payment/mastercard.svg' },
  { name: 'Maestro', note: '', logo: '/payment/maestro.svg' },
  { name: 'American Express', note: 'Creditcard', logo: '/payment/amex.svg' },
  { name: 'Overboeking', note: 'SEPA (SCT)', icon: 'bank' },
  { name: 'Paysafecard', note: 'Prepaid', logo: '/payment/paysafecard.svg' },
  { name: 'Sofort', note: 'Duitsland', logo: '/payment/sofort.svg' },
  { name: 'Giropay', note: 'Duitsland', logo: '/payment/giropay.svg' },
  { name: 'EPS', note: 'Oostenrijk', logo: '/payment/eps.svg' },
  { name: 'Przelewy24', note: 'Polen', logo: '/payment/przelewy24.svg' },
];

const inStore = [
  { name: 'Pinnen', note: 'Alle gangbare pinpassen', icon: 'card' },
  { name: 'Contant', note: 'Aan de balie in Geldermalsen', icon: 'cash' },
];

const icons: Record<string, React.ReactNode> = {
  installments: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="M9 16h6" />
    </svg>
  ),
  bank: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M4 18h16M6 18v-7M10 18v-7M14 18v-7M18 18v-7M3 8l9-5 9 5z" />
    </svg>
  ),
  card: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  ),
  cash: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  ),
};

function Badge({ name, note, logo, icon }: { name: string; note: string; logo?: string; icon?: string }) {
  return (
    <div className="cam-lift" style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 14, background: '#fff' }}>
      <div style={{ width: 64, height: 40, borderRadius: 6, background: '#fff', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 5 }}>
        {logo
          ? <img src={logo} alt={`${name} logo`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          : icons[icon ?? '']}
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
      eyebrow="Betalen"
      intro="Bij Camera-tweedehands.nl kies je de betaalmethode die het beste bij je past — online en in de winkel. Veilig en snel."
    >
      <div style={{ marginBottom: 32 }}><TrustStrip items={trust} /></div>

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '8px 0 14px' }}>Online betalen</h2>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', marginBottom: 32 }}>
        {online.map(m => <Badge key={m.name} {...m} />)}
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 14px' }}>In de winkel</h2>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', marginBottom: 32 }}>
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

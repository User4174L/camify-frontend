import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';

// Customer-service hub — landing met links naar de losse onderwerpen (eigen URL elk).
const topics = [
  { label: 'Contact', href: '/contact', desc: 'Vraag over een order, product of inruil? We helpen je graag.' },
  { label: 'Shipping & returns', href: '/shipping-returns', desc: 'Levertijden, verzendkosten en 14 dagen retour.' },
  { label: 'Payment methods', href: '/payment-methods', desc: 'Alle manieren waarop je veilig kunt betalen.' },
  { label: 'Warranty & repair', href: '/warranty-repair', desc: 'Minimaal 12 maanden garantie en reparaties.' },
  { label: 'FAQ', href: '/faq', desc: 'Antwoorden op de meestgestelde vragen.' },
];

export default function CustomerServicePage() {
  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 80 }}>
      <Breadcrumb items={[{ label: 'Customer service' }]} />
      <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-.02em', margin: '14px 0 14px' }}>
        Customer service
      </h1>
      <p style={{ fontSize: 16, color: '#5A5C6B', maxWidth: 700, margin: '0 0 28px' }}>
        Hoe kunnen we je helpen? Kies een onderwerp hieronder.
      </p>
      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
        {topics.map(t => (
          <Link
            key={t.href}
            href={t.href}
            style={{ border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', display: 'block' }}
          >
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 4 }}>
              {t.label} <span style={{ color: 'var(--accent)' }}>&rarr;</span>
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--text-sec)', lineHeight: 1.5 }}>{t.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

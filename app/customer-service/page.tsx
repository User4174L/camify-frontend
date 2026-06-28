import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import Reveal from '@/components/ui/Reveal';

// Customer-service hub — landing met links naar de losse onderwerpen (eigen URL elk).
const topics = [
  { label: 'Contact', href: '/contact', desc: 'Vraag over een order, product of inruil? We helpen je graag.' },
  { label: 'How it works', href: '/how-it-works', desc: 'Verkopen, inruilen en kopen — stap voor stap uitgelegd.' },
  { label: 'Shipping & returns', href: '/shipping-returns', desc: 'Levertijden, verzendkosten en 14 dagen retour.' },
  { label: 'Payment methods', href: '/payment-methods', desc: 'Alle manieren waarop je veilig kunt betalen.' },
  { label: 'Warranty & repair', href: '/warranty-repair', desc: 'Minimaal 12 maanden garantie en reparaties.' },
  { label: 'Quality & grading', href: '/quality-grading', desc: 'Hoe we conditie bepalen, testen en communiceren.' },
  { label: 'FAQ', href: '/faq', desc: 'Antwoorden op de meestgestelde vragen.' },
];

export default function CustomerServicePage() {
  return (
    <>
      <div className="svc-header">
        <div className="container">
          <Breadcrumb items={[{ label: 'Customer service' }]} />
          <div className="svc-eyebrow">Klantenservice</div>
          <h1 className="svc-title">Hoe kunnen we je helpen?</h1>
          <p className="svc-intro">Kies hieronder een onderwerp — of neem direct contact met ons op.</p>
        </div>
      </div>
      <div className="container" style={{ paddingBottom: 80 }}>
        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {topics.map((t, i) => (
            <Reveal key={t.href} delay={i * 55}>
              <Link
                href={t.href}
                className="cam-lift"
                style={{ border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', display: 'block', background: '#fff', height: '100%' }}
              >
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 4 }}>
                  {t.label} <span style={{ color: 'var(--accent)' }}>&rarr;</span>
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--text-sec)', lineHeight: 1.5 }}>{t.desc}</div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}

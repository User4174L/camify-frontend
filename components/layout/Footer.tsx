import Link from 'next/link';
import TrustpilotWidget, { TP } from '@/components/ui/TrustpilotWidget';

const company = [
  { label: 'About us', href: '/about' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Terms & conditions', href: '/terms' },
  { label: 'Privacy policy', href: '/privacy' },
  { label: 'Cookie policy', href: '/cookie-policy' },
  { label: 'Sitemap', href: '/sitemap.xml' },
];

const customerCare = [
  { label: 'Contact us', href: '/contact' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Quality & grading', href: '/quality-grading' },
  { label: 'Shipping & return', href: '/shipping-returns' },
  { label: 'Payment methods', href: '/payment-methods' },
  { label: 'Warranty & repair', href: '/warranty-repair' },
  { label: 'FAQ', href: '/faq' },
];

const social = [
  { label: 'Instagram', href: '#' },
  { label: 'Facebook', href: '#' },
  { label: 'YouTube', href: '#' },
  { label: 'LinkedIn', href: '#' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link href="/" className="logo">
              <div className="logo__icon">C</div>Camify
            </Link>
            <div className="footer__contact">
              <div className="footer__contact-item">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Kerkstraat 47 Bis, 4191AA Geldermalsen
              </div>
              <div className="footer__contact-item">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                klantenservice@camera-tweedehands.nl
              </div>
              <div className="footer__contact-item">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                085 301 83 32
              </div>
            </div>
          </div>

          <div>
            <div className="footer__heading">Company</div>
            <div className="footer__links">
              {company.map((l) => (
                <Link key={l.label} href={l.href} className="footer__link">{l.label}</Link>
              ))}
            </div>
          </div>

          <div>
            <Link href="/customer-service" className="footer__heading" style={{ display: 'inline-block' }}>Customer care</Link>
            <div className="footer__links">
              {customerCare.map((l) => (
                <Link key={l.label} href={l.href} className="footer__link">{l.label}</Link>
              ))}
            </div>
          </div>

          <div>
            <div className="footer__heading">Follow us</div>
            <div className="footer__links">
              {social.map((l) => (
                <Link key={l.label} href={l.href} className="footer__link">{l.label}</Link>
              ))}
            </div>
            <div style={{ marginTop: 16, maxWidth: 240 }}>
              <TrustpilotWidget templateId={TP.microTrustScore} theme="dark" height="20px" />
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <div>
            <span>&copy; 2026 Camera-tweedehands.nl B.V. All rights reserved.</span>
            <span style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 4 }}>
              KVK: 80564674 · BTW: NL861717971B01
            </span>
          </div>
          <div className="footer__payment">
            {[
              ['iDEAL', 'ideal'],
              ['Visa', 'visa'],
              ['Mastercard', 'mastercard'],
              ['American Express', 'amex'],
              ['PayPal', 'paypal'],
              ['Bancontact', 'bancontact'],
            ].map(([name, file]) => (
              <div key={file} className="footer__payment-icon" style={{ background: '#fff', padding: 3 }}>
                <img src={`/payment/${file}.svg`} alt={name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

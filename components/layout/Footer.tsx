import Link from 'next/link';

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
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                info@camify.com
              </div>
              <div className="footer__contact-item">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                +31 (0)85 123 4567
              </div>
              <div className="footer__contact-item">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Amsterdam, Netherlands
              </div>
            </div>
          </div>

          <div>
            <div className="footer__heading">Shop</div>
            <div className="footer__links">
              <Link href="/cameras" className="footer__link">Cameras</Link>
              <Link href="/lenses" className="footer__link">Lenses</Link>
              <Link href="/video-and-cinema" className="footer__link">Video & Cinema</Link>
              <Link href="/action-and-drones" className="footer__link">Action & Drones</Link>
              <Link href="/accessories" className="footer__link">Accessories</Link>
              <Link href="/brands" className="footer__link">All Brands</Link>
            </div>
          </div>

          <div>
            <div className="footer__heading">Help</div>
            <div className="footer__links">
              <Link href="/faq" className="footer__link">FAQ</Link>
              <Link href="/knowledge-base" className="footer__link">Knowledge Base</Link>
              <Link href="/about" className="footer__link">About Us</Link>
              <Link href="/trade-in" className="footer__link">Sell Your Gear</Link>
              <Link href="/about" className="footer__link">Contact</Link>
            </div>
          </div>

          <div>
            <div className="footer__heading">Newsletter</div>
            <div className="footer__subscribe">
              <input type="email" placeholder="Your email" />
              <button aria-label="Subscribe">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m5 12h14m-7-7 7 7-7 7"/></svg>
              </button>
            </div>
            <div className="footer__tp">
              <span style={{ color: 'var(--tp)' }}>&#9733;</span>
              <span>Trustpilot — 4.9</span>
              <div className="trustpilot-stars" style={{ marginLeft: 4 }}>
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="trustpilot-star" style={{ width: 16, height: 16, fontSize: 9 }}>&#9733;</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>&copy; 2026 Camify. All rights reserved.</span>
          <div className="footer__payment">
            {['iDEAL', 'Visa', 'MC', 'AMEX', 'PayPal', 'Apple', 'Klarna'].map(m => (
              <div key={m} className="footer__payment-icon">{m}</div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

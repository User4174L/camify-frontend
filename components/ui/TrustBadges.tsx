import TrustpilotWidget, { TP, TP_TOKEN } from '@/components/ui/TrustpilotWidget';

/**
 * Rij met drie trust-kaarten: Trustpilot (live Mini-widget + statische fallback),
 * WebwinkelKeur (statisch) en Google (statisch).
 * De Trustpilot-widget rendert alleen op camera-tweedehands.nl; elders toont de fallback.
 * WebwinkelKeur/Google hebben geen gratis embed → cijfers handmatig bijwerken hieronder.
 */
function GreenStar() {
  return (
    <span style={{ width: 18, height: 18, background: '#00b67a', borderRadius: 3, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11 }}>★</span>
  );
}

const card: React.CSSProperties = {
  background: '#fff',
  border: '1px solid var(--border)',
  borderRadius: 14,
  padding: '14px 16px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 5,
  minHeight: 104,
};

export default function TrustBadges() {
  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 720, margin: '0 auto 48px' }}
      className="trust-badges"
    >
      <style>{`@media(max-width:760px){.trust-badges{grid-template-columns:1fr !important}}`}</style>

      {/* Trustpilot — live Mini-widget met statische fallback */}
      <div style={card}>
        <TrustpilotWidget templateId={TP.mini} token={TP_TOKEN.mini} height="84px">
          <a href="https://nl.trustpilot.com/review/www.camera-tweedehands.nl" target="_blank" rel="noopener" style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center' }}>
              <span style={{ color: '#00b67a', fontSize: 16 }}>★</span>
              <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)' }}>Trustpilot</span>
            </div>
            <div style={{ display: 'flex', gap: 3, justifyContent: 'center', margin: '7px 0' }}>
              {[0, 1, 2, 3, 4].map(i => <GreenStar key={i} />)}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-sec)' }}>
              <strong style={{ color: 'var(--text)' }}>TrustScore 4,9</strong> · 523 reviews
            </div>
          </a>
        </TrustpilotWidget>
      </div>

      {/* WebwinkelKeur — statisch */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#d6168d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m8 12 3 3 5-6" /></svg>
          <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)' }}>WebwinkelKeur</span>
        </div>
        <div style={{ background: '#1E2133', borderRadius: 999, padding: '5px 13px', display: 'inline-flex', alignItems: 'center', gap: 7, margin: '3px 0' }}>
          <span style={{ color: '#FFC107', letterSpacing: 1, fontSize: 11 }}>★★★★★</span>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>9,7 / 10</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-sec)' }}>3.589 reviews</div>
      </div>

      {/* Google — statisch */}
      <div style={card}>
        <svg width="25" height="25" viewBox="0 0 48 48" aria-label="Google">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, justifyContent: 'center', margin: '2px 0' }}>
          <span style={{ fontWeight: 800, fontSize: 19, color: 'var(--text)' }}>4.8</span>
          <span style={{ color: '#FFC107', letterSpacing: 1, fontSize: 14 }}>★★★★★</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-sec)' }}>187 reviews</div>
      </div>
    </div>
  );
}

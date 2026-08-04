'use client';

import { useState, useEffect, useCallback } from 'react';

// Demo cookie-consent voor de developer: center-modal, weigeren op laag 1
// (AP-eis: zelfde laag, zelfde grootte, 1 klik), accept als enige gevulde knop.
// Copy = EN placeholder; NL-vertaling volgt in de echte applicatie.

const STORAGE_KEY = 'ct_cookie_consent';
export const OPEN_PREFS_EVENT = 'ct:open-cookie-preferences';

type Consent = { necessary: true; analytics: boolean; marketing: boolean; ts: string };

const readConsent = (): Consent | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
};

function Toggle({ on, disabled, onChange }: { on: boolean; disabled?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={() => onChange?.(!on)}
      style={{
        width: 44, height: 26, borderRadius: 13, border: 'none', padding: 2, flexShrink: 0,
        background: on ? '#E8692A' : '#D5D6DE', cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.55 : 1, transition: 'background .2s',
      }}
    >
      <span style={{
        display: 'block', width: 22, height: 22, borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,.25)', transition: 'transform .2s',
        transform: on ? 'translateX(18px)' : 'translateX(0)',
      }} />
    </button>
  );
}

export default function CookieConsent() {
  const [view, setView] = useState<'hidden' | 'banner' | 'prefs'>('hidden');
  const [visible, setVisible] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (!readConsent()) {
      const t = setTimeout(() => setView('banner'), 600);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const open = () => {
      const stored = readConsent();
      setAnalytics(stored?.analytics ?? false);
      setMarketing(stored?.marketing ?? false);
      setView('prefs');
    };
    window.addEventListener(OPEN_PREFS_EVENT, open);
    return () => window.removeEventListener(OPEN_PREFS_EVENT, open);
  }, []);

  useEffect(() => {
    if (view !== 'hidden') requestAnimationFrame(() => setVisible(true));
    else setVisible(false);
  }, [view]);

  const save = useCallback((c: { analytics: boolean; marketing: boolean }) => {
    const consent: Consent = { necessary: true, ...c, ts: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    window.dispatchEvent(new CustomEvent('ct:consent-changed', { detail: consent }));
    setVisible(false);
    setTimeout(() => setView('hidden'), 220);
  }, []);

  if (view === 'hidden') return null;

  const btnBase: React.CSSProperties = {
    flex: 1, padding: '13px 18px', borderRadius: 12, fontSize: 15, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit', transition: 'transform .12s, box-shadow .12s',
  };

  return (
    <div
      onKeyDown={e => { if (e.key === 'Escape' && readConsent()) { setVisible(false); setTimeout(() => setView('hidden'), 220); } }}
      style={{
        position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: 20,
        background: visible ? 'rgba(24,26,44,.45)' : 'rgba(24,26,44,0)',
        backdropFilter: visible ? 'blur(2px)' : 'none', transition: 'background .25s',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cookie preferences"
        style={{
          background: '#fff', borderRadius: 16, boxShadow: '0 12px 48px rgba(0,0,0,.18)',
          maxWidth: 480, width: '100%', padding: '32px 32px 28px',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0) scale(1)' : 'translateY(14px) scale(.97)',
          transition: 'opacity .25s, transform .25s',
        }}
      >
        {view === 'banner' ? (
          <>
            <div style={{ width: 44, height: 44, background: '#FDEFE7', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 22 }}>🍪</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1E2133', marginBottom: 10, lineHeight: 1.3 }}>
              Make your visit more personal?
            </h2>
            <p style={{ fontSize: 14.5, color: '#6B6D80', lineHeight: 1.6, marginBottom: 22 }}>
              We use cookies to keep the shop running smoothly and — only with your permission — to show
              you gear and deals that match your interests, and to see what we can improve. You can change
              your choice anytime via “Cookie preferences” in the footer.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={() => save({ analytics: false, marketing: false })}
                style={{ ...btnBase, background: '#fff', color: '#E8692A', border: '2px solid #E8692A', minWidth: 150 }}
              >
                Reject all
              </button>
              <button
                onClick={() => save({ analytics: true, marketing: true })}
                style={{ ...btnBase, background: '#E8692A', color: '#fff', border: '2px solid #E8692A', minWidth: 150, boxShadow: '0 4px 14px rgba(232,105,42,.35)' }}
              >
                Accept all
              </button>
            </div>
            <div style={{ textAlign: 'center', marginTop: 14 }}>
              <button
                onClick={() => setView('prefs')}
                style={{ background: 'none', border: 'none', color: '#6B6D80', fontSize: 13.5, textDecoration: 'underline', cursor: 'pointer', fontFamily: 'inherit', padding: 4 }}
              >
                Manage preferences
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1E2133', marginBottom: 6 }}>Cookie preferences</h2>
            <p style={{ fontSize: 13.5, color: '#6B6D80', lineHeight: 1.55, marginBottom: 20 }}>
              Choose which cookies you’re okay with. Necessary cookies keep the shop working and are always on.
            </p>
            {[
              { title: 'Necessary', desc: 'Sign-in, cart, language — the shop can’t work without these.', on: true, locked: true, set: undefined as ((v: boolean) => void) | undefined },
              { title: 'Analytics', desc: 'Anonymous stats that show us what works and what doesn’t.', on: analytics, locked: false, set: setAnalytics },
              { title: 'Marketing', desc: 'Personalised deals and ads, on and off our site.', on: marketing, locked: false, set: setMarketing },
            ].map(row => (
              <div key={row.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '13px 0', borderTop: '1px solid #EEEEF2' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: '#1E2133', marginBottom: 2 }}>
                    {row.title}
                    {row.locked && <span style={{ fontSize: 11.5, fontWeight: 600, color: '#16a34a', marginLeft: 8 }}>Always on</span>}
                  </div>
                  <div style={{ fontSize: 13, color: '#6B6D80', lineHeight: 1.5 }}>{row.desc}</div>
                </div>
                <Toggle on={row.on} disabled={row.locked} onChange={row.set} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 20 }}>
              <button
                onClick={() => save({ analytics, marketing })}
                style={{ ...btnBase, background: '#fff', color: '#1E2133', border: '2px solid #D5D6DE', minWidth: 150 }}
              >
                Save preferences
              </button>
              <button
                onClick={() => save({ analytics: true, marketing: true })}
                style={{ ...btnBase, background: '#E8692A', color: '#fff', border: '2px solid #E8692A', minWidth: 150, boxShadow: '0 4px 14px rgba(232,105,42,.35)' }}
              >
                Accept all
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

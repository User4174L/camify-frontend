'use client';

import { useState, useEffect, useCallback } from 'react';

// Referentie-demo voor de developer: center-modal, weigeren op laag 1 (AP-eis:
// zelfde laag, zelfde grootte, 1 klik), accept als enige gevulde knop.
//
// TAALREGEL (Bart, 06-08): detectie op browsertaal, NOOIT op IP-locatie.
//   - browsertaal == sitetaal          -> geen taalrij, alleen de cookievraag
//   - browsertaal niet ondersteund     -> Engelse site, geen taalrij, geen vraag
//   - browsertaal ondersteund maar !=  -> taalrij met precies die twee talen
// Markten gaan een voor een open. Zolang een markt geen eigen taal heeft,
// bestaat die taal niet als keuze. Nu dus alleen nl + en.

const STORAGE_KEY = 'ct_cookie_consent';
export const OPEN_PREFS_EVENT = 'ct:open-cookie-preferences';

type Consent = { necessary: true; analytics: boolean; marketing: boolean; ts: string };

/** Talen die we daadwerkelijk voeren. Uitbreiden = hier een regel toevoegen. */
const LANGUAGES = [
  { code: 'nl', flag: '🇳🇱', label: 'Nederlands' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
] as const;

type LangCode = (typeof LANGUAGES)[number]['code'];

const readConsent = (): Consent | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
};

/** Eerste browsertaal die we voeren, of null. Geen IP, geen fingerprinting. */
const detectBrowserLanguage = (): LangCode | null => {
  if (typeof navigator === 'undefined') return null;
  const tags = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const tag of tags) {
    const base = tag.toLowerCase().split('-')[0];
    const hit = LANGUAGES.find(l => l.code === base);
    if (hit) return hit.code;
  }
  return null;
};

const COPY = {
  nl: {
    title: 'Zullen we je bezoek persoonlijker maken?',
    body: 'We gebruiken cookies om de winkel te laten werken, en — alleen met jouw toestemming — om je apparatuur en aanbiedingen te tonen die bij je passen. Je kunt je keuze altijd wijzigen via “Cookievoorkeuren” onderaan de pagina.',
    reject: 'Alles weigeren',
    accept: 'Alles accepteren',
    manage: 'Zelf instellen',
    langTitle: 'Je browser staat op Nederlands',
    langBody: 'Wil je de site in het Nederlands?',
    prefsTitle: 'Cookievoorkeuren',
    prefsBody: 'Kies welke cookies je goed vindt. Noodzakelijke cookies houden de winkel werkend en staan altijd aan.',
    save: 'Bewaren',
    rows: [
      { title: 'Noodzakelijk', desc: 'Inloggen, winkelwagen, taal — zonder deze werkt de winkel niet.' },
      { title: 'Analyse', desc: 'Anonieme statistieken die laten zien wat werkt en wat niet.' },
      { title: 'Marketing', desc: 'Persoonlijke aanbiedingen en advertenties, op en buiten onze site.' },
    ],
  },
  en: {
    title: 'Shall we make your visit more personal?',
    body: 'We use cookies to keep the shop running and — only with your permission — to show you gear and deals that match your interests. You can change your choice anytime via “Cookie preferences” at the bottom of the page.',
    reject: 'Reject all',
    accept: 'Accept all',
    manage: 'Choose yourself',
    langTitle: 'Your browser is set to English',
    langBody: 'Would you like the site in English?',
    prefsTitle: 'Cookie preferences',
    prefsBody: 'Choose which cookies you’re okay with. Necessary cookies keep the shop working and are always on.',
    save: 'Save',
    rows: [
      { title: 'Necessary', desc: 'Sign-in, cart, language — the shop can’t work without these.' },
      { title: 'Analytics', desc: 'Anonymous stats that show us what works and what doesn’t.' },
      { title: 'Marketing', desc: 'Personalised deals and ads, on and off our site.' },
    ],
  },
} as const;

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

  // Sitetaal. In de echte app komt dit uit de URL-locale; hier simuleerbaar
  // met ?sitelang=en zodat de mismatch-situatie te demonstreren is.
  const [siteLang, setSiteLang] = useState<LangCode>('nl');
  const [browserLang, setBrowserLang] = useState<LangCode | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forcedSite = params.get('sitelang');
    const forcedBrowser = params.get('browserlang');
    if (forcedSite === 'nl' || forcedSite === 'en') setSiteLang(forcedSite);
    setBrowserLang(
      forcedBrowser === 'nl' || forcedBrowser === 'en'
        ? forcedBrowser
        : forcedBrowser === 'none'
          ? null
          : detectBrowserLanguage(),
    );
  }, []);

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

  // DE REGEL: taalrij alleen bij een echte mismatch tussen een ondersteunde
  // browsertaal en de taal van de pagina. Anders geen enkele taal-UI.
  const showLanguageRow = browserLang !== null && browserLang !== siteLang;
  const t = COPY[siteLang];
  const suggested = showLanguageRow ? LANGUAGES.find(l => l.code === browserLang)! : null;
  const suggestedCopy = suggested ? COPY[suggested.code] : null;

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
        aria-label={t.prefsTitle}
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
              {t.title}
            </h2>
            <p style={{ fontSize: 14.5, color: '#6B6D80', lineHeight: 1.6, marginBottom: showLanguageRow ? 18 : 22 }}>
              {t.body}
            </p>

            {/* Taalrij: alleen bij mismatch. Geen dropdown, geen landenlijst,
                geen "op basis van je locatie" — twee knoppen, klaar. */}
            {showLanguageRow && suggested && suggestedCopy ? (
              <div style={{
                border: '1px solid #EEEEF2', borderRadius: 12, padding: '14px 16px',
                marginBottom: 22, background: '#FAFAFB',
              }}>
                <p style={{ fontSize: 14, color: '#1E2133', fontWeight: 600, marginBottom: 2 }}>
                  {suggestedCopy.langTitle}
                </p>
                <p style={{ fontSize: 13.5, color: '#6B6D80', marginBottom: 12 }}>
                  {suggestedCopy.langBody}
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[suggested, LANGUAGES.find(l => l.code === siteLang)!].map(lang => {
                    const active = lang.code === siteLang;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => setSiteLang(lang.code)}
                        style={{
                          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                          padding: '10px 12px', borderRadius: 10, fontSize: 14.5, fontWeight: 600,
                          cursor: 'pointer', fontFamily: 'inherit',
                          background: active ? '#fff' : '#fff',
                          color: '#1E2133',
                          border: active ? '2px solid #E8692A' : '2px solid #E1E1E6',
                        }}
                      >
                        <span style={{ fontSize: 17 }}>{lang.flag}</span>
                        {lang.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={() => save({ analytics: false, marketing: false })}
                style={{ ...btnBase, background: '#fff', color: '#E8692A', border: '2px solid #E8692A', minWidth: 150 }}
              >
                {t.reject}
              </button>
              <button
                onClick={() => save({ analytics: true, marketing: true })}
                style={{ ...btnBase, background: '#E8692A', color: '#fff', border: '2px solid #E8692A', minWidth: 150, boxShadow: '0 4px 14px rgba(232,105,42,.35)' }}
              >
                {t.accept}
              </button>
            </div>
            <div style={{ textAlign: 'center', marginTop: 14 }}>
              <button
                onClick={() => setView('prefs')}
                style={{ background: 'none', border: 'none', color: '#6B6D80', fontSize: 13.5, textDecoration: 'underline', cursor: 'pointer', fontFamily: 'inherit', padding: 4 }}
              >
                {t.manage}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1E2133', marginBottom: 6 }}>{t.prefsTitle}</h2>
            <p style={{ fontSize: 13.5, color: '#6B6D80', lineHeight: 1.55, marginBottom: 20 }}>
              {t.prefsBody}
            </p>
            {[
              { ...t.rows[0], on: true, locked: true, set: undefined as ((v: boolean) => void) | undefined },
              { ...t.rows[1], on: analytics, locked: false, set: setAnalytics },
              { ...t.rows[2], on: marketing, locked: false, set: setMarketing },
            ].map(row => (
              <div key={row.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '13px 0', borderTop: '1px solid #EEEEF2' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1E2133', marginBottom: 2 }}>{row.title}</div>
                  <div style={{ fontSize: 13, color: '#6B6D80', lineHeight: 1.5 }}>{row.desc}</div>
                </div>
                <Toggle on={row.on} disabled={row.locked} onChange={row.set} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 22, flexWrap: 'wrap' }}>
              <button
                onClick={() => save({ analytics, marketing })}
                style={{ ...btnBase, background: '#fff', color: '#1E2133', border: '2px solid #D5D6DE', minWidth: 150 }}
              >
                {t.save}
              </button>
              <button
                onClick={() => save({ analytics: true, marketing: true })}
                style={{ ...btnBase, background: '#E8692A', color: '#fff', border: '2px solid #E8692A', minWidth: 150, boxShadow: '0 4px 14px rgba(232,105,42,.35)' }}
              >
                {t.accept}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

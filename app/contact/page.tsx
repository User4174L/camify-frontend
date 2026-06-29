'use client';

import { useState } from 'react';
import SimplePage from '@/components/layout/SimplePage';

const channels = [
  {
    label: 'Live chat',
    note: 'Tijdens openingstijden',
    icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  },
  {
    label: 'Bel ons',
    note: '085 301 83 32',
    icon: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />,
  },
  {
    label: 'E-mail',
    note: 'klantenservice@camera-tweedehands.nl',
    icon: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></>,
  },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <SimplePage
      title="Contact us"
      breadcrumb="Contact"
      eyebrow="Klantenservice"
      parent={{ label: 'Help', href: '/help' }}
      intro="Vraag over een order, product of inruil? We helpen je graag — kies het kanaal dat je prettig vindt."
    >
      {/* Kanalen */}
      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', marginBottom: 14 }}>
        {channels.map(c => (
          <div key={c.label} className="cam-lift" style={{ border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px', display: 'flex', gap: 12, alignItems: 'center', background: '#fff' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" style={{ flexShrink: 0 }}>{c.icon}</svg>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{c.label}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-sec)', overflowWrap: 'anywhere' }}>{c.note}</div>
            </div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 13, color: '#8A8C99', margin: '0 0 32px' }}>
        Openingstijden klantenservice: <strong style={{ color: 'var(--text)' }}>ma–vr 09:00–17:30</strong> · we reageren doorgaans binnen 1 werkdag.
      </p>

      <div style={{ display: 'grid', gap: 40, gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.2fr)' }}>
        {/* Details */}
        <div style={{ fontSize: 15, lineHeight: 1.8 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Gegevens</h2>
          <p style={{ margin: 0 }}>Camera-tweedehands.nl B.V.</p>
          <p style={{ margin: 0, color: '#5A5C6B' }}>Kerkstraat 47 Bis, 4191AA Geldermalsen</p>
          <p style={{ margin: '10px 0 0' }}><a href="mailto:klantenservice@camera-tweedehands.nl" style={{ color: 'var(--accent)' }}>klantenservice@camera-tweedehands.nl</a></p>
          <p style={{ margin: 0 }}><a href="tel:+31853018332" style={{ color: 'var(--accent)' }}>+31 85 301 83 32</a></p>
          <p style={{ margin: '10px 0 0', fontSize: 13, color: '#8A8C99' }}>KVK 80564674 · BTW NL861717971B01</p>
        </div>

        {/* Form */}
        <div>
          {sent ? (
            <p style={{ fontSize: 15, color: '#16a34a', fontWeight: 600 }}>Bedankt! We nemen binnen 1 werkdag contact op.</p>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ display: 'grid', gap: 14, maxWidth: 460 }}>
              <input required placeholder="Je naam" style={inputStyle} />
              <input required type="email" placeholder="Je e-mail" style={inputStyle} />
              <input placeholder="Ordernummer (optioneel)" style={inputStyle} />
              <textarea required placeholder="Waarmee kunnen we je helpen?" rows={5} style={{ ...inputStyle, resize: 'vertical' }} />
              <button type="submit" style={{ background: 'var(--accent)', color: '#fff', fontWeight: 600, fontSize: 15, padding: '12px 26px', borderRadius: 999, justifySelf: 'start' }}>
                Verstuur bericht
              </button>
            </form>
          )}
        </div>
      </div>
    </SimplePage>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  border: '1.5px solid var(--border)',
  borderRadius: 12,
  fontSize: 14,
  fontFamily: 'inherit',
  background: 'var(--surface)',
  outline: 'none',
};

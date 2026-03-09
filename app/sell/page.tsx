'use client';

import Breadcrumb from '@/components/layout/Breadcrumb';
import Link from 'next/link';

const steps = [
  {
    num: '1',
    title: 'Get a quote',
    desc: 'Search for your product and get an instant price estimate. No obligations, no hassle.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E8692A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    num: '2',
    title: 'Ship it to us',
    desc: 'Use our free shipping label to send your gear. Fully insured from pickup to delivery.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E8692A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    num: '3',
    title: 'Get paid',
    desc: 'Receive payment within 48 hours after our technicians inspect your equipment.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E8692A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
];

const benefits = [
  {
    title: 'Best prices',
    desc: 'Market-leading trade-in values. We offer the most competitive prices in the market.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E8692A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    title: 'Free shipping',
    desc: 'We cover all shipping costs. Print the label, pack your gear, and we handle the rest.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E8692A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    title: 'Fast payment',
    desc: 'Paid within 48 hours after inspection. No waiting, no delays.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E8692A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    title: '10.000+ happy sellers',
    desc: 'Join thousands of photographers who already sold their gear through us.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E8692A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export default function SellPage() {
  return (
    <div className="container">
      <Breadcrumb items={[{ label: 'Sell Your Gear' }]} />

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #1E2133 0%, #2a2d42 50%, #1E2133 100%)',
        color: '#fff',
        borderRadius: 'var(--rl)',
        padding: '56px 40px',
        marginBottom: 56,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,105,42,.08) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -20, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,105,42,.05) 0%, transparent 70%)' }} />
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, marginBottom: 12, position: 'relative' }}>Sell Your Gear</h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,.7)', maxWidth: 520, margin: '0 auto 32px', position: 'relative', lineHeight: 1.6 }}>
          Turn your unused camera equipment into cash. Fast, easy, and at the best prices in the market.
        </p>
        <Link href="/trade-in" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: '#E8692A',
          color: '#fff',
          padding: '14px 32px',
          borderRadius: 10,
          fontSize: 15,
          fontWeight: 600,
          textDecoration: 'none',
          position: 'relative',
          transition: 'background 0.2s ease',
        }}>
          Start selling now
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </section>

      {/* How it works */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 700, color: '#1E2133', textAlign: 'center', marginBottom: 8 }}>How it works</h2>
        <p style={{ fontSize: 15, color: '#888', textAlign: 'center', marginBottom: 40, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
          Three simple steps to sell your camera gear
        </p>

        <style>{`
          @media (max-width: 768px) {
            .sell-steps-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
        <div className="sell-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {steps.map((step) => (
            <div key={step.num} style={{
              background: '#F8F8FA',
              borderRadius: 16,
              padding: '32px 28px',
              textAlign: 'center',
              border: '1px solid #EEEEF2',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                top: 16,
                left: 20,
                fontSize: 48,
                fontWeight: 800,
                color: 'rgba(232,105,42,.08)',
                lineHeight: 1,
              }}>
                {step.num}
              </div>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: 'rgba(232,105,42,.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                {step.icon}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1E2133', marginBottom: 8 }}>{step.title}</h3>
              <p style={{ fontSize: 14, color: '#888', lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why sell with us */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 700, color: '#1E2133', textAlign: 'center', marginBottom: 8 }}>Why sell with us?</h2>
        <p style={{ fontSize: 15, color: '#888', textAlign: 'center', marginBottom: 40, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
          We make selling your gear simple and rewarding
        </p>

        <style>{`
          @media (max-width: 768px) {
            .sell-benefits-grid { grid-template-columns: 1fr 1fr !important; }
          }
          @media (max-width: 480px) {
            .sell-benefits-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
        <div className="sell-benefits-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {benefits.map((b) => (
            <div key={b.title} style={{
              background: '#fff',
              borderRadius: 12,
              padding: '24px 20px',
              border: '1px solid #EEEEF2',
              textAlign: 'center',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'default',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 12,
                background: 'rgba(232,105,42,.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                {b.icon}
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1E2133', marginBottom: 6 }}>{b.title}</h3>
              <p style={{ fontSize: 13, color: '#888', lineHeight: 1.5 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust section */}
      <section style={{
        background: '#F8F8FA',
        borderRadius: 16,
        padding: '40px 32px',
        marginBottom: 56,
        textAlign: 'center',
        border: '1px solid #EEEEF2',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap', marginBottom: 32 }}>
          {[
            { num: '4.9/5', label: 'Trustpilot score' },
            { num: '15.000+', label: 'Products sold' },
            { num: '10.000+', label: 'Happy sellers' },
            { num: '48h', label: 'Average payout' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#E8692A' }}>{s.num}</div>
              <div style={{ fontSize: 13, color: '#888' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <Link href="/trade-in" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: '#E8692A',
          color: '#fff',
          padding: '14px 32px',
          borderRadius: 10,
          fontSize: 15,
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'background 0.2s ease',
        }}>
          Start selling now
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </section>

      <div style={{ height: 32 }} />
    </div>
  );
}

'use client';

import { useState } from 'react';
import Breadcrumb from '@/components/layout/Breadcrumb';

const tabs = [
  { id: 'story', label: 'Our story' },
  { id: 'how', label: 'How it works' },
  { id: 'quality', label: 'Quality & grading' },
  { id: 'warranty', label: 'Warranty & returns' },
  { id: 'sell', label: 'Sell or trade-in' },
  { id: 'sustainability', label: 'Sustainability' },
  { id: 'contact', label: 'Contact' },
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('story');

  return (
    <div className="container">
      <Breadcrumb items={[{ label: 'About Us' }]} />

      <section style={{ background: 'var(--dark)', color: '#fff', borderRadius: 'var(--rl)', padding: '48px 40px', marginBottom: 48, textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, marginBottom: 12 }}>About Camify</h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,.7)', maxWidth: 600, margin: '0 auto 32px' }}>
          The trusted marketplace for second-hand camera equipment. Founded in 2018, serving photographers across Europe.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          {[
            { num: '2018', label: 'Founded' },
            { num: '€1.2M+', label: 'In stock' },
            { num: '15K+', label: 'Items sold' },
            { num: '4.9', label: 'Trustpilot' },
            { num: '10+', label: 'EU countries' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent)' }}>{s.num}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
        {tabs.map(t => (
          <button
            key={t.id}
            className={`filter-tab${activeTab === t.id ? ' filter-tab--active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 720, paddingBottom: 64 }}>
        {activeTab === 'story' && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Our Story</h2>
            <p style={{ fontSize: 15, color: 'var(--text-sec)', lineHeight: 1.7, marginBottom: 16 }}>
              Camify started in 2018 with a simple idea: make buying and selling used camera gear as simple and trustworthy as buying new. We noticed that the second-hand camera market was fragmented, with inconsistent grading and limited warranties.
            </p>
            <p style={{ fontSize: 15, color: 'var(--text-sec)', lineHeight: 1.7, marginBottom: 16 }}>
              Today, we are one of Europe's leading platforms for pre-owned camera equipment, serving photographers in over 10 countries with a catalog of 10,000+ products from 100+ brands.
            </p>
            <p style={{ fontSize: 15, color: 'var(--text-sec)', lineHeight: 1.7 }}>
              Every item we sell is professionally inspected, accurately graded, and backed by our 12-month warranty. We believe great photography should be accessible to everyone.
            </p>
          </div>
        )}
        {activeTab === 'how' && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>How It Works</h2>
            <p style={{ fontSize: 15, color: 'var(--text-sec)', lineHeight: 1.7 }}>
              Browse our catalog, choose the condition and price that suits your needs, place your order with secure payment, and receive your gear with full warranty coverage. It is that simple.
            </p>
          </div>
        )}
        {activeTab === 'quality' && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Quality & Grading</h2>
            <p style={{ fontSize: 15, color: 'var(--text-sec)', lineHeight: 1.7, marginBottom: 16 }}>
              We use a 5-level condition grading system: As New, Excellent, Good, Used, and Heavily Used. Each grade has clear criteria for cosmetic condition, functionality, and included accessories.
            </p>
          </div>
        )}
        {activeTab === 'warranty' && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Warranty & Returns</h2>
            <p style={{ fontSize: 15, color: 'var(--text-sec)', lineHeight: 1.7 }}>
              Every item comes with a minimum 12-month warranty. You have 14 days to return any item, no questions asked. We want you to be completely satisfied with your purchase.
            </p>
          </div>
        )}
        {activeTab === 'sell' && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Sell or Trade-In</h2>
            <p style={{ fontSize: 15, color: 'var(--text-sec)', lineHeight: 1.7 }}>
              Want to upgrade? Use our trade-in tool to get a quote for your current gear. You can sell outright or trade in towards a new purchase for the best value.
            </p>
          </div>
        )}
        {activeTab === 'sustainability' && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Sustainability</h2>
            <p style={{ fontSize: 15, color: 'var(--text-sec)', lineHeight: 1.7 }}>
              By buying and selling used camera gear, we extend the lifecycle of quality equipment and reduce electronic waste. Photography should be sustainable too.
            </p>
          </div>
        )}
        {activeTab === 'contact' && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Contact Us</h2>
            <p style={{ fontSize: 15, color: 'var(--text-sec)', lineHeight: 1.7, marginBottom: 24 }}>
              Have a question? We are here to help.
            </p>
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <input placeholder="First name" style={{ padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--r)', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
                <input placeholder="Last name" style={{ padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--r)', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
              </div>
              <input type="email" placeholder="Email" style={{ padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--r)', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
              <textarea placeholder="Your message" rows={5} style={{ padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--r)', fontSize: 14, fontFamily: 'inherit', outline: 'none', resize: 'vertical' }} />
              <button className="btn btn--primary" type="submit" style={{ alignSelf: 'flex-start' }}>Send Message</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

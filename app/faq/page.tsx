'use client';

import { useState } from 'react';
import Breadcrumb from '@/components/layout/Breadcrumb';

const faqData = [
  {
    category: 'Buying',
    items: [
      { q: 'What do the condition grades mean?', a: 'We use 5 grades: As New (virtually unused), Excellent (minimal signs of use), Good (light wear), Used (visible wear but fully functional), and Heavily Used (significant wear, fully functional).' },
      { q: 'Can I reserve an item?', a: 'Items cannot be reserved. We operate on a first-come, first-served basis. You can set up an alert to be notified when specific items become available.' },
      { q: 'Do you sell new equipment?', a: 'We primarily sell pre-owned equipment. Occasionally we stock demo units or customer returns that are essentially new, marked with a "New" badge.' },
    ]
  },
  {
    category: 'Selling',
    items: [
      { q: 'How quickly will I get paid?', a: 'Once we receive and inspect your item, payment is typically processed within 2-3 business days via bank transfer.' },
      { q: 'Do you accept broken equipment?', a: 'Yes, we accept broken or damaged equipment. Use our trade-in tool and select the appropriate condition grade. The quote will reflect the condition.' },
    ]
  },
  {
    category: 'Shipping',
    items: [
      { q: 'How long does shipping take?', a: 'Standard shipping within NL/BE takes 1-2 business days. EU shipping takes 3-5 business days depending on the destination.' },
      { q: 'Is shipping free?', a: 'Shipping is free on orders above €50 within NL/BE. For other EU countries, shipping costs vary based on the destination and package weight.' },
      { q: 'Do you ship outside the EU?', a: 'Currently we ship to 10+ EU countries. We are working on expanding to the UK and other regions.' },
    ]
  },
  {
    category: 'Returns & Warranty',
    items: [
      { q: 'How do I return an item?', a: 'Contact us within 14 days of receiving your order. We will provide a return shipping label. Once we receive and inspect the item, we will process your refund.' },
      { q: 'What does the warranty cover?', a: 'Our 12-month warranty covers manufacturing defects and mechanical failures. It does not cover physical damage, water damage, or normal wear and tear.' },
    ]
  },
];

export default function FaqPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const toggle = (key: string) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredFaq = searchQuery.length > 0
    ? faqData.map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.items.length > 0)
    : faqData;

  return (
    <div className="container">
      <Breadcrumb items={[{ label: 'FAQ' }]} />

      <section style={{ background: 'var(--dark)', color: '#fff', borderRadius: 'var(--rl)', padding: '48px 40px', marginBottom: 48, textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, marginBottom: 16 }}>How can we help?</h1>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '14px 20px', borderRadius: 50, border: '1.5px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.1)', color: '#fff', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
          />
        </div>
      </section>

      {filteredFaq.map(cat => (
        <div key={cat.category} style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: 'var(--accent)' }}>{cat.category}</h2>
          <div className="accordion">
            {cat.items.map((item, i) => {
              const key = `${cat.category}-${i}`;
              return (
                <div key={key} className={`accordion__item${openItems[key] ? ' is-open' : ''}`}>
                  <button className="accordion__trigger" aria-expanded={openItems[key]} onClick={() => toggle(key)}>
                    {item.q}
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
                  </button>
                  <div className="accordion__body">
                    <p>{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <section style={{ background: 'var(--surface)', borderRadius: 'var(--rl)', padding: '40px', textAlign: 'center', marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Still have questions?</h2>
        <p style={{ fontSize: 14, color: 'var(--text-sec)', marginBottom: 20 }}>Our team is ready to help you.</p>
        <a href="/about" className="btn btn--primary">Contact Us</a>
      </section>
    </div>
  );
}

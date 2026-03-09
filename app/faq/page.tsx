'use client';

import { useState } from 'react';
import Breadcrumb from '@/components/layout/Breadcrumb';

const faqData = [
  {
    category: 'Buying',
    items: [
      { q: 'How do I place an order?', a: 'Just browse our shop, add items to your cart, and check out — it works like any online store. Every product page shows the exact condition, real photos, and shutter count (where applicable), so you know exactly what you\'re getting before you hit "buy."' },
      { q: 'What payment methods do you accept?', a: 'We accept iDEAL, PayPal, credit card (Visa, Mastercard, Amex), Bancontact, SOFORT, and Klarna. With Klarna you can also choose to pay in installments. All payments are processed securely through our payment provider.' },
      { q: 'How long does shipping take?', a: 'Orders within the Netherlands typically arrive within 1–2 business days. For other EU countries, expect 3–5 business days. Shipments to the UK usually take 5–7 business days. You\'ll receive a tracking link as soon as your order ships.' },
      { q: 'Is shipping free?', a: 'Shipping is free on all orders above €50 within the Netherlands and Belgium. For other EU countries, shipping is a flat €9.95. For the UK, Switzerland, and Norway, shipping is €14.95. We always use tracked and insured shipping so your gear arrives safely.' },
      { q: 'What do the condition grades mean?', a: 'We use five grades to keep things transparent. "As New" means virtually unused, no visible signs of use. "Excellent" means minimal cosmetic wear — maybe a faint mark on the body, but looks nearly perfect. "Good" means light, normal wear from regular use. "Used" means clearly visible wear but everything works perfectly. "Heavily Used" means significant cosmetic wear, but still fully functional and tested.' },
      { q: 'How is the shutter count determined?', a: 'We read the shutter count directly from the camera\'s EXIF data using professional diagnostic tools. For brands like Sony and Nikon, the count is embedded in every photo the camera takes. For Canon, we use manufacturer service software. The exact shutter count is listed on every camera product page.' },
      { q: 'Can I see the actual product photos before buying?', a: 'Absolutely — every product listing includes real photos of the actual item you\'ll receive, not stock images. We photograph each item from multiple angles so you can see the exact cosmetic condition. What you see is literally what you get.' },
      { q: 'Do you offer price matching?', a: 'We constantly monitor the market to keep our prices competitive, but we don\'t do formal price matching. That said, if you find the same item in the same condition at a lower price from a reputable dealer, reach out to us — we\'re always happy to have a conversation about it.' },
      { q: 'What does "EXCL. VAT" mean? Do your prices include VAT?', a: 'Items marked "EXCL. VAT" are sold under the margin scheme (margeregeling). Under this scheme, no separate VAT is charged — the price you see is the price you pay. Items without this label have 21% VAT included in the displayed price. In both cases, the price shown is the final price you pay at checkout.' },
    ]
  },
  {
    category: 'Selling & Trade-in',
    items: [
      { q: 'How does the trade-in process work?', a: 'It\'s super simple. Use our online trade-in tool to get an instant estimate — just select your product, describe its condition, and you\'ll see a quote right away. If you\'re happy with it, we\'ll send you a free prepaid shipping label. Ship your gear to us, we inspect it, and you get paid.' },
      { q: 'How do you determine the trade-in value?', a: 'We base our trade-in values on current market prices, the item\'s condition, demand, and how much similar items are selling for. Our quotes are competitive because we sell directly to end customers rather than through middlemen. We\'re always transparent about how we arrive at a price.' },
      { q: 'How long does the appraisal take?', a: 'Once we receive your item, our technicians inspect and test it within 2 business days. We check everything — sensor condition, autofocus accuracy, lens clarity, shutter mechanism, and cosmetic condition. You\'ll get an email with the final valuation as soon as we\'re done.' },
      { q: 'How do I ship my gear to you?', a: 'After accepting your trade-in quote, we\'ll email you a free prepaid shipping label. Just pack your gear securely (we recommend the original box if you have it, plus bubble wrap), stick the label on, and drop it off at any PostNL or DHL point. Shipping is fully insured on our end.' },
      { q: 'When do I get paid?', a: 'Once our team completes the inspection and the final valuation matches the quote, payment is processed within 48 hours via bank transfer to your IBAN. If the condition differs from what was described, we\'ll contact you with an adjusted offer — you can always choose to have your item shipped back for free instead.' },
    ]
  },
  {
    category: 'Shipping & Returns',
    items: [
      { q: 'What is your return policy?', a: 'For online purchases, you have 14 days after receiving your order to return it, no questions asked. The item should be in the same condition as when you received it. Just contact us, and we\'ll arrange everything — it\'s hassle-free because we want you to buy with confidence.' },
      { q: 'How do I return an item?', a: 'Reach out to us via email, phone, or live chat and mention your order number. We\'ll send you a prepaid return label right away. Once we receive and inspect the returned item, your refund is processed within 3–5 business days back to your original payment method.' },
      { q: 'Do you ship internationally?', a: 'Yes! We ship to all EU countries, the United Kingdom, Switzerland, and Norway. We use trusted carriers like DHL and PostNL with full tracking and insurance on every shipment. We\'re looking into expanding to more regions soon.' },
      { q: 'What about customs duties for non-EU orders?', a: 'For orders within the EU, there are no customs duties or additional taxes — it\'s all included in the price. For the UK, Switzerland, and Norway, import duties and local VAT may apply upon delivery. These costs are the responsibility of the buyer, and the amounts vary by country.' },
    ]
  },
  {
    category: 'Warranty & Support',
    items: [
      { q: 'What warranty do you offer?', a: 'Every item we sell comes with a 12-month Camify warranty. That\'s our promise that your gear will work as described. We stand behind every product because our technicians thoroughly test everything before it goes on sale. Damage caused by the customer (water damage, drop damage) is not covered.' },
      { q: 'What does the warranty cover?', a: 'Our warranty covers manufacturing defects and mechanical or electronic failures — things like a shutter mechanism failing, autofocus issues, or sensor malfunctions. It does not cover physical damage from drops or impacts, water damage, or normal cosmetic wear from regular use.' },
      { q: 'How do I make a warranty claim?', a: 'Contact our support team with your order number and a description of the issue. We\'ll guide you through the process — in most cases, we\'ll send you a prepaid shipping label so you can send the item in for repair or replacement. We aim to resolve warranty claims within 5–7 business days.' },
      { q: 'Can I extend my warranty?', a: 'Yes! At checkout you can add our Camify Extended Warranty, which extends your coverage to 24 months. It covers the same things as the standard warranty but gives you an extra year of peace of mind. The cost depends on the product price and is shown at checkout.' },
      { q: 'How do I contact customer service?', a: 'You can reach us by email at support@camera-tweedehands.nl, by phone at 085 301 83 32 on weekdays between 09:00 and 16:30 CET, or via the live chat on our website. We typically respond to emails within a few hours during business days. We\'re real people who love cameras — not a call center.' },
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

      <section style={{ background: 'linear-gradient(135deg, #1E2133 0%, #2a2d42 50%, #1E2133 100%)', color: '#fff', borderRadius: 'var(--rl)', padding: '48px 40px', marginBottom: 48, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,105,42,.08) 0%, transparent 70%)' }} />
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, marginBottom: 16, position: 'relative' }}>How can we help?</h1>
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

      <section style={{ background: 'linear-gradient(135deg, #1E2133 0%, #2a2d42 60%, #1E2133 100%)', borderRadius: 'var(--rl)', padding: '40px', textAlign: 'center', marginBottom: 48, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: -40, right: -20, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,105,42,.06) 0%, transparent 70%)' }} />
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: '#fff', position: 'relative' }}>Still have questions?</h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,.6)', marginBottom: 20, position: 'relative' }}>Our team is ready to help you.</p>
        <a href="/about" className="btn btn--primary" style={{ position: 'relative' }}>Contact Us</a>
      </section>
    </div>
  );
}

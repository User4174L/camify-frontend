'use client';
import { useState } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { products, Product } from '@/data/products';

const oosProducts = products.filter(p => p.category === 'cameras' && p.stock === 0);

const conditionOptions = ['As new', 'Excellent', 'Good', 'Fair', 'Used', 'Heavily used'];
const defaultConditions = ['As new', 'Excellent', 'Good', 'Fair'];

const shutterCountOptions = [
  'No preference',
  'Under 5,000',
  'Under 10,000',
  'Under 25,000',
  'Under 50,000',
  'Under 100,000',
];

const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const faqItems = [
  {
    q: 'How does the notify service work?',
    a: 'Simply click the "Notify me" button on any out-of-stock camera, enter your email address and set your preferences for condition and shutter count. As soon as a matching camera arrives in our inventory, we\'ll send you an email notification so you can be one of the first to grab it.',
  },
  {
    q: 'How quickly do out-of-stock items come back?',
    a: 'It varies per model. Popular cameras like the Sony A7 IV or Canon EOS R5 typically come back within a few days to a couple of weeks. Rarer models or limited editions may take longer. We receive new stock daily, so setting an alert is the best way to make sure you don\'t miss out.',
  },
  {
    q: 'Can I set alerts for multiple cameras?',
    a: 'Absolutely! You can set up notifications for as many cameras as you like. Each alert is independent, so you can specify different condition and shutter count preferences for each model. Manage or cancel your alerts anytime via the link in the notification emails.',
  },
  {
    q: 'Is there a cost for setting alerts?',
    a: 'No, the notification service is completely free. There\'s no obligation to buy when you receive an alert either. We simply want to make it as easy as possible for you to find the camera you\'re looking for.',
  },
];

export default function OutOfStockPage() {
  const [notifyProduct, setNotifyProduct] = useState<Product | null>(null);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyConditions, setNotifyConditions] = useState<string[]>(defaultConditions);
  const [notifyShutterCount, setNotifyShutterCount] = useState('No preference');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleCondition = (c: string) => {
    setNotifyConditions(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );
  };

  const openNotifyPopup = (product: Product) => {
    setNotifyProduct(product);
    setNotifyEmail('');
    setNotifyConditions([...defaultConditions]);
    setNotifyShutterCount('No preference');
  };

  return (
    <div className="container">
      <Breadcrumb items={[{ label: 'Cameras', href: '/cameras' }, { label: 'Out of Stock' }]} />

      {/* Title section */}
      <div style={{ marginBottom: 32 }}>
        <h1 className="section__title" style={{ marginBottom: 12 }}>Out of Stock Cameras</h1>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: 800 }}>
          These models are temporarily unavailable. Set an alert and we&apos;ll notify you when one arrives.
        </p>
      </div>

      {/* Product grid */}
      {oosProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>All cameras are currently in stock!</p>
          <p style={{ fontSize: 14 }}>
            Browse our full <Link href="/cameras" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>camera collection</Link>.
          </p>
        </div>
      ) : (
        <div
          className="oos-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
            marginBottom: 48,
          }}
        >
          <style>{`
            @media (max-width: 1024px) {
              .oos-grid { grid-template-columns: repeat(2, 1fr) !important; }
            }
            @media (max-width: 540px) {
              .oos-grid { grid-template-columns: 1fr !important; }
            }
            .oos-card:hover {
              box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important;
            }
          `}</style>
          {oosProducts.map(product => (
            <div
              key={product.id}
              className="oos-card"
              style={{
                border: 'none',
                borderRadius: 12,
                background: '#fff',
                overflow: 'hidden',
                transition: 'box-shadow 0.2s',
              }}
            >
              {/* Image container */}
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    aspectRatio: '1',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12%',
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    style={{
                      objectFit: 'contain',
                      width: '100%',
                      height: '100%',
                      filter: 'saturate(0.4) opacity(0.8)',
                    }}
                  />
                </div>
                {/* Out of stock badge */}
                <span
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    background: '#1f2937',
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: 999,
                  }}
                >
                  Out of stock
                </span>
              </div>

              {/* Card body */}
              <div style={{ padding: '12px 16px 16px' }}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: 'var(--text)' }}>
                  {product.title}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-sec)', marginBottom: 12 }}>
                  Out of stock
                </div>
                <button
                  onClick={() => openNotifyPopup(product)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'var(--accent)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 999,
                    padding: '8px 18px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <BellIcon />
                  Notify me
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notify popup */}
      {notifyProduct && (
        <div
          onClick={() => setNotifyProduct(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: 16,
              width: '100%',
              maxWidth: 440,
              padding: '32px 28px 28px',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setNotifyProduct(null)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#9ca3af',
                fontSize: 20,
                lineHeight: 1,
                padding: 4,
              }}
            >
              &#10005;
            </button>

            {/* Bell icon */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h3 style={{ fontSize: 18, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>
              Get notified when available
            </h3>
            <p style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 1.6, marginBottom: 24 }}>
              We don&apos;t have a {notifyProduct.title} in stock right now, but we regularly receive new units. Set your preferences below and we&apos;ll email you the moment one arrives.
            </p>

            {/* Email input */}
            <div style={{ marginBottom: 20 }}>
              <input
                type="email"
                placeholder="Your email address"
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1.5px solid var(--border)',
                  borderRadius: 10,
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Minimum condition */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 10 }}>
                Minimum condition
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {conditionOptions.map(c => (
                  <label
                    key={c}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 13,
                      cursor: 'pointer',
                      padding: '6px 12px',
                      borderRadius: 8,
                      border: notifyConditions.includes(c) ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
                      background: notifyConditions.includes(c) ? '#fff7ed' : '#fff',
                      transition: 'all 0.15s',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={notifyConditions.includes(c)}
                      onChange={() => toggleCondition(c)}
                      style={{ accentColor: 'var(--accent)' }}
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            {/* Max shutter count */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 10 }}>
                Max. shutter count
              </label>
              <select
                value={notifyShutterCount}
                onChange={(e) => setNotifyShutterCount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1.5px solid var(--border)',
                  borderRadius: 10,
                  fontSize: 14,
                  background: '#fff',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                {shutterCountOptions.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            {/* Submit button */}
            <button
              onClick={() => setNotifyProduct(null)}
              style={{
                width: '100%',
                padding: '14px',
                background: 'var(--accent)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <BellIcon />
              Notify me
            </button>

            {/* Disclaimer */}
            <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 14, lineHeight: 1.5 }}>
              You&apos;ll receive an email each time a matching item is listed. Unsubscribe anytime.
            </p>
          </div>
        </div>
      )}

      {/* SEO text */}
      <div
        style={{
          padding: '32px 0',
          borderTop: '1px solid var(--border)',
          marginTop: 16,
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Can&apos;t find what you&apos;re looking for?</h2>
        <div style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)', maxWidth: 800 }}>
          <p>
            We receive new stock on a daily basis, so even if the camera you want isn&apos;t available right now, chances are it will be soon. Use our free notification service to set an alert for any out-of-stock model and we&apos;ll email you the moment a matching unit arrives in our inventory.
          </p>
          <p style={{ marginTop: 12 }}>
            You can specify your preferred condition grade and maximum shutter count, so you only get notified about cameras that meet your exact requirements. There&apos;s no cost and no obligation -- simply a convenient way to stay in the loop. In the meantime, feel free to browse our{' '}
            <Link href="/cameras" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>full camera collection</Link>{' '}
            for models that are currently in stock.
          </p>
        </div>
      </div>

      {/* FAQ accordion */}
      <div style={{ paddingBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Frequently Asked Questions</h2>
        <div className="accordion">
          {faqItems.map((item, i) => (
            <div key={i} className={`accordion__item${openFaq === i ? ' is-open' : ''}`}>
              <button
                className="accordion__trigger"
                aria-expanded={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {item.q}
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
              </button>
              <div className="accordion__body">
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Breadcrumb from '@/components/layout/Breadcrumb';

const conditions = ['As new', 'Excellent', 'Good', 'Used', 'Heavily used'];
const shutterRanges = ['0 - 1,000', '1,000 - 10,000', '10,000 - 25,000', '25,000 - 50,000', '50,000 - 100,000', '100,000+'];

export default function TradeInPage() {
  const [step, setStep] = useState(1);
  const [productSearch, setProductSearch] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedShutter, setSelectedShutter] = useState('');

  return (
    <div className="container">
      <Breadcrumb items={[{ label: 'Sell Your Gear' }]} />

      <div style={{ maxWidth: 720, margin: '0 auto', paddingBottom: 64 }}>
        <h1 className="section__title" style={{ textAlign: 'center', marginBottom: 8 }}>Sell or Trade Your Gear</h1>
        <p className="section__subtitle" style={{ textAlign: 'center' }}>Get a fair quote in minutes. Free shipping on trade-ins.</p>

        {/* Progress */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 48 }}>
          {[1, 2, 3, 4].map(s => (
            <div key={s} style={{
              width: 40, height: 40, borderRadius: '50%',
              background: step >= s ? 'var(--dark)' : 'var(--surface)',
              color: step >= s ? '#fff' : 'var(--text-sec)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700,
            }}>
              {s}
            </div>
          ))}
        </div>

        {/* Step 1: Your Gear */}
        {step === 1 && (
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--rl)', padding: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>What are you selling?</h2>
            <input
              type="text"
              placeholder="Search for your product (e.g. Nikon Z8, Canon 70-200mm)"
              value={productSearch}
              onChange={e => setProductSearch(e.target.value)}
              style={{ width: '100%', padding: '14px 20px', border: '1.5px solid var(--border)', borderRadius: 'var(--r)', fontSize: 14, fontFamily: 'inherit', outline: 'none', marginBottom: 24 }}
            />

            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-sec)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 12 }}>Condition</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {conditions.map(c => (
                <button
                  key={c}
                  className={`filter-tab${selectedCondition === c ? ' filter-tab--active' : ''}`}
                  onClick={() => setSelectedCondition(c)}
                >
                  {c}
                </button>
              ))}
            </div>

            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-sec)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 12 }}>Shutter Count</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {shutterRanges.map(r => (
                <button
                  key={r}
                  className={`filter-tab${selectedShutter === r ? ' filter-tab--active' : ''}`}
                  onClick={() => setSelectedShutter(r)}
                >
                  {r}
                </button>
              ))}
            </div>

            <button className="btn btn--primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setStep(2)}>
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Are you buying? */}
        {step === 2 && (
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--rl)', padding: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Are you buying something too?</h2>
            <p style={{ fontSize: 14, color: 'var(--text-sec)', marginBottom: 24 }}>Trade in towards a new purchase for the best value.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn--primary" onClick={() => setStep(3)}>Yes, I want to buy</button>
              <button className="btn btn--outline" onClick={() => setStep(3)}>No, just selling</button>
            </div>
          </div>
        )}

        {/* Step 3: Contact */}
        {step === 3 && (
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--rl)', padding: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Your Details</h2>
            <form onSubmit={e => { e.preventDefault(); setStep(4); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <input placeholder="First name" required style={{ padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--r)', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
                <input placeholder="Last name" required style={{ padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--r)', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
              </div>
              <input type="email" placeholder="Email" required style={{ padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--r)', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
              <input type="tel" placeholder="Phone" style={{ padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--r)', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
              <button className="btn btn--primary" type="submit" style={{ width: '100%', justifyContent: 'center' }}>Continue →</button>
            </form>
          </div>
        )}

        {/* Step 4: Summary */}
        {step === 4 && (
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--rl)', padding: 32, textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="28" height="28" fill="none" stroke="#166534" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Quote Request Submitted!</h2>
            <p style={{ fontSize: 15, color: 'var(--text-sec)', marginBottom: 24 }}>We will review your submission and send you a quote within 24 hours.</p>
            <a href="/" className="btn btn--outline">Back to Home</a>
          </div>
        )}
      </div>
    </div>
  );
}

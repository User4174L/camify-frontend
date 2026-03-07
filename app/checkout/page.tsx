'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

const steps = ['Details', 'Shipping', 'Protection', 'Payment'];

export default function CheckoutPage() {
  const { items, total, subtotal, vatAmount } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('');

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px' }}>
      {/* Checkout header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
        <Link href="/" className="logo" style={{ fontSize: 20 }}>
          <div className="logo__icon" style={{ width: 28, height: 28, fontSize: 11 }}>C</div>
          Camify
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-sec)' }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Secure Checkout
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 40 }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: i <= currentStep ? 'var(--dark)' : 'var(--surface)',
              color: i <= currentStep ? '#fff' : 'var(--text-sec)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700,
            }}>
              {i < currentStep ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: i <= currentStep ? 'var(--text)' : 'var(--text-sec)', marginRight: 16 }}>{s}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40 }}>
        {/* Left column - Steps */}
        <div>
          {currentStep === 0 && (
            <div style={{ background: 'var(--surface)', borderRadius: 'var(--rl)', padding: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Details & Address</h2>
              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                <button className="btn btn--outline" style={{ flex: 1, justifyContent: 'center', fontSize: 13, padding: '12px' }}>Apple Pay</button>
                <button className="btn btn--outline" style={{ flex: 1, justifyContent: 'center', fontSize: 13, padding: '12px' }}>Google Pay</button>
                <button className="btn btn--outline" style={{ flex: 1, justifyContent: 'center', fontSize: 13, padding: '12px' }}>PayPal</button>
              </div>
              <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-sec)', marginBottom: 24 }}>or continue below</div>
              <form onSubmit={e => { e.preventDefault(); setCurrentStep(1); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--r)', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <input placeholder="First name" required style={{ padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--r)', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
                  <input placeholder="Last name" required style={{ padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--r)', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
                </div>
                <input placeholder="Phone" style={{ padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--r)', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 16 }}>
                  <input placeholder="Postal code" style={{ padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--r)', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
                  <input placeholder="House number" style={{ padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--r)', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
                </div>
                <input placeholder="Street" style={{ padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--r)', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
                <input placeholder="City" style={{ padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--r)', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
                <button className="btn btn--primary" type="submit" style={{ width: '100%', justifyContent: 'center' }}>Continue to Shipping →</button>
              </form>
            </div>
          )}

          {currentStep === 1 && (
            <div style={{ background: 'var(--surface)', borderRadius: 'var(--rl)', padding: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Shipping Method</h2>
              {[
                { name: 'PostNL Standard', price: '€6.95', time: '1-2 days' },
                { name: 'DPD Express', price: '€7.95', time: '1 day' },
                { name: 'DHL Parcel', price: '€5.95', time: '2-3 days' },
              ].map((m, i) => (
                <label key={m.name} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: 16,
                  border: `1.5px solid ${i === 0 ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 'var(--r)', marginBottom: 8, cursor: 'pointer',
                  background: i === 0 ? 'rgba(232,105,42,.04)' : 'transparent',
                }}>
                  <input type="radio" name="shipping" defaultChecked={i === 0} style={{ accentColor: 'var(--accent)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-sec)' }}>{m.time}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{m.price}</div>
                </label>
              ))}
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button className="btn btn--outline" onClick={() => setCurrentStep(0)}>← Back</button>
                <button className="btn btn--primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setCurrentStep(2)}>Continue →</button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div style={{ background: 'var(--surface)', borderRadius: 'var(--rl)', padding: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Product Protection</h2>
              <p style={{ fontSize: 14, color: 'var(--text-sec)', marginBottom: 24 }}>Extend your warranty for extra peace of mind.</p>
              {['No protection (12mo warranty included)', '1 Year Extra — €49', '2 Years Extra — €89'].map((opt, i) => (
                <label key={opt} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: 16,
                  border: `1.5px solid ${i === 0 ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 'var(--r)', marginBottom: 8, cursor: 'pointer',
                  background: i === 0 ? 'rgba(232,105,42,.04)' : 'transparent',
                }}>
                  <input type="radio" name="protection" defaultChecked={i === 0} style={{ accentColor: 'var(--accent)' }} />
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{opt}</span>
                </label>
              ))}
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button className="btn btn--outline" onClick={() => setCurrentStep(1)}>← Back</button>
                <button className="btn btn--primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setCurrentStep(3)}>Continue →</button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div style={{ background: 'var(--surface)', borderRadius: 'var(--rl)', padding: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Payment</h2>
              {['iDEAL', 'Bancontact', 'Bank Transfer', 'Apple Pay', 'PayPal', 'Credit Card', 'in3'].map((m, i) => (
                <label key={m} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: 14,
                  border: `1.5px solid ${i === 0 ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 'var(--r)', marginBottom: 6, cursor: 'pointer',
                  background: i === 0 ? 'rgba(232,105,42,.04)' : 'transparent',
                }}>
                  <input type="radio" name="payment" defaultChecked={i === 0} style={{ accentColor: 'var(--accent)' }} />
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{m}</span>
                </label>
              ))}
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button className="btn btn--outline" onClick={() => setCurrentStep(2)}>← Back</button>
                <button className="btn btn--primary" style={{ flex: 1, justifyContent: 'center' }}>Place Order</button>
              </div>
            </div>
          )}
        </div>

        {/* Right column - Order summary */}
        <div style={{ position: 'sticky', top: 100, alignSelf: 'flex-start' }}>
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--rl)', padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Order Summary</h3>
            {items.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-sec)' }}>Your cart is empty</p>
            ) : (
              <>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: 12, marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 48, height: 48, background: '#fff', borderRadius: 6, padding: 4, flexShrink: 0 }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-sec)' }}>{item.condition}</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap' }}>€{item.price.toLocaleString()}</div>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-sec)', marginBottom: 6 }}>
                  <span>Subtotal</span><span>€{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-sec)', marginBottom: 6 }}>
                  <span>VAT</span><span>€{vatAmount.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-sec)', marginBottom: 12 }}>
                  <span>Shipping</span><span>€6.95</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                  <span>Total</span><span>€{(total + 6.95).toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

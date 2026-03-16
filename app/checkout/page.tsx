'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { assetPath } from '@/lib/utils';

/* ───────── constants ───────── */
const STEPS = ['Details', 'Shipping', 'Protection', 'Payment', 'Review'] as const;

const SHIPPING_OPTIONS = [
  { id: 'postnl', name: 'PostNL', eta: '1-2 business days', price: 6.95, color: '#ff6600', label: 'Post\nNL' },
  { id: 'dpd', name: 'DPD', eta: '1-2 business days', price: 7.95, color: '#dc0032', label: 'DPD' },
  { id: 'dhl', name: 'DHL', eta: '2-3 business days', price: 5.95, color: '#ffcc00', labelColor: '#d40511', label: 'DHL' },
];

const PAYMENT_METHODS = [
  { id: 'ideal', name: 'iDEAL', bg: '#CC0066' },
  { id: 'bancontact', name: 'Bancontact', bg: '#005498' },
  { id: 'bank', name: 'Bank transfer', bg: '#1E2133' },
  { id: 'applepay', name: 'Apple Pay', bg: '#000' },
  { id: 'paypal', name: 'PayPal', bg: '#003087' },
  { id: 'creditcard', name: 'Creditcard', bg: '#EB001B' },
  { id: 'in3', name: 'in3 — pay in 3 instalments', bg: '#7B68EE' },
];

const IDEAL_BANKS = [
  'ABN AMRO', 'ASN Bank', 'Bunq', 'ING', 'Knab',
  'Rabobank', 'RegioBank', 'Revolut', 'SNS', 'Triodos Bank',
];

/* ───────── shared styles ───────── */
const CSS = {
  accent: '#E8692A',
  accentHover: '#D15A20',
  accentLight: '#FFF0E8',
  border: '#EEEEF2',
  surface: '#F8F8FA',
  dark: '#1E2133',
  darkLight: '#2D3047',
  darkMid: '#3D4263',
  text: '#1E2133',
  textSec: '#6B6D80',
  textMuted: '#8B8DA8',
  green: '#22c55e',
  greenLight: '#dcfce7',
  r: 8,
  rl: 12,
} as const;

const inputStyle: React.CSSProperties = {
  border: `1.5px solid ${CSS.border}`,
  borderRadius: CSS.r,
  padding: '12px 14px',
  fontSize: '.9rem',
  fontFamily: 'inherit',
  color: CSS.text,
  background: '#fff',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color .2s, box-shadow .2s',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238B8DA8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
};

const labelStyle: React.CSSProperties = {
  fontSize: '.75rem',
  fontWeight: 600,
  color: CSS.text,
  textTransform: 'uppercase',
  letterSpacing: '.03em',
};

const btnPrimary: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  fontFamily: 'inherit',
  fontSize: '.9rem',
  fontWeight: 600,
  padding: '14px 32px',
  borderRadius: 50,
  border: 'none',
  cursor: 'pointer',
  background: CSS.accent,
  color: '#fff',
  transition: 'all .2s',
};

const btnSecondary: React.CSSProperties = {
  ...btnPrimary,
  background: CSS.surface,
  color: CSS.text,
  border: `1px solid ${CSS.border}`,
};

/* ───────── SVG helpers ───────── */
const CheckIcon = ({ size = 12, stroke = 'currentColor', strokeWidth = 3 }: { size?: number; stroke?: string; strokeWidth?: number }) => (
  <svg width={size} height={size} fill="none" stroke={stroke} strokeWidth={strokeWidth} viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
);

const ShieldIcon = ({ size = 14, stroke = 'currentColor' }: { size?: number; stroke?: string }) => (
  <svg width={size} height={size} fill="none" stroke={stroke} strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
);

const LockIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);

const CameraIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="14" rx="2" /><circle cx="12" cy="13" r="4" /><path d="M7 6V4h4v2" /></svg>
);

const ChevronRight = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
);

const CircleCheck = ({ size = 14, stroke = 'currentColor' }: { size?: number; stroke?: string }) => (
  <svg width={size} height={size} fill="none" stroke={stroke} strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>
);

const MailIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="m22 6-10 7L2 6" /></svg>
);

const InfoIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4m0-4h.01" /></svg>
);

const TagIcon = () => (
  <svg width="14" height="14" fill="none" stroke={CSS.textMuted} strokeWidth="2" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
);

const RepeatIcon = () => (
  <svg width="14" height="14" fill="none" stroke={CSS.accent} strokeWidth="2" viewBox="0 0 24 24"><path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
);

/* ───────── default demo items (shown when cart is empty) ───────── */
const DEMO_ITEMS: import('@/context/CartContext').CartItem[] = [
  {
    id: '257962',
    sku: '257962',
    name: 'Sony A7 IV',
    price: 1749,
    condition: 'Excellent',
    image: '/images/sony-a7-iv.jpg',
    inclVat: true,
  },
  {
    id: '258130',
    sku: '258130',
    name: 'Canon EOS R5',
    price: 2649,
    condition: 'Excellent',
    image: '/images/canon-r5.jpg',
    inclVat: true,
  },
];

function computeTotals(items: import('@/context/CartContext').CartItem[]) {
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.inclVat ? item.price / 1.21 : item.price);
  }, 0);
  const vatAmount = items.reduce((sum, item) => {
    return sum + (item.inclVat ? item.price - item.price / 1.21 : 0);
  }, 0);
  return { subtotal, vatAmount, total: subtotal + vatAmount };
}

/* ───────── main component ───────── */
export default function CheckoutPage() {
  const cart = useCart();
  const hasItems = cart.items.length > 0;
  const items = hasItems ? cart.items : DEMO_ITEMS;
  const { subtotal, vatAmount, total } = hasItems
    ? { subtotal: cart.subtotal, vatAmount: cart.vatAmount, total: cart.total }
    : computeTotals(DEMO_ITEMS);
  const itemCount = items.length;

  /* mode toggle */
  const [mode, setMode] = useState<'steps' | 'onepage'>('steps');
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  /* step-by-step state */
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  /* form state */
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isKnownUser, setIsKnownUser] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [prefix, setPrefix] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [customerType, setCustomerType] = useState<'private' | 'business'>('private');
  const [companyName, setCompanyName] = useState('');
  const [kvkNumber, setKvkNumber] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [suffix, setSuffix] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('NL');
  const [shipOption, setShipOption] = useState<'same' | 'different'>('same');
  const [shipAttn, setShipAttn] = useState('');
  const [shipCompany, setShipCompany] = useState('');
  const [shipPostal, setShipPostal] = useState('');
  const [shipHouseNum, setShipHouseNum] = useState('');
  const [shipSuffix, setShipSuffix] = useState('');
  const [shipStreet, setShipStreet] = useState('');
  const [shipCity, setShipCity] = useState('');
  const [shipCountry, setShipCountry] = useState('NL');

  /* shipping */
  const [selectedShipping, setSelectedShipping] = useState('postnl');
  const shippingCost = SHIPPING_OPTIONS.find(s => s.id === selectedShipping)?.price ?? 6.95;

  /* protection */
  const [protectionEnabled, setProtectionEnabled] = useState(false);
  const [replacementEnabled, setReplacementEnabled] = useState(false);
  // per item: 0=none, 1=+1yr, 2=+2yr
  const [protectionChoices, setProtectionChoices] = useState<Record<number, number>>({});
  // per item: true/false for replacement
  const [replacementChoices, setReplacementChoices] = useState<Record<number, boolean>>({});

  const getProtectionPrice = (itemPrice: number, years: number) => {
    if (years === 0) return 0;
    if (years === 1) return Math.round(itemPrice * 0.10);
    return Math.round(itemPrice * 0.15);
  };
  const getReplacementPrice = (itemPrice: number) => Math.round(itemPrice * 0.02);

  const protectionTotal = items.reduce((sum, item, idx) => {
    const years = protectionChoices[idx] ?? 0;
    const repl = replacementChoices[idx] ? getReplacementPrice(item.price) : 0;
    return sum + getProtectionPrice(item.price, years) + repl;
  }, 0);

  /* payment */
  const [selectedPayment, setSelectedPayment] = useState('ideal');
  const [selectedBank, setSelectedBank] = useState('');

  /* promo */
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  /* remarks */
  const [remarks, setRemarks] = useState('');

  /* computed */
  const grandTotal = total + shippingCost + protectionTotal;

  /* postcode auto-fill simulation */
  const handlePostcodeChange = useCallback((pc: string, hn: string) => {
    const clean = pc.replace(/\s/g, '');
    if (clean.length >= 6 && hn.length >= 1) {
      setTimeout(() => {
        setStreet('Keizersgracht');
        setCity('Amsterdam');
      }, 300);
    }
  }, []);

  /* step navigation */
  const goToStep = (step: number) => {
    const newCompleted = new Set(completedSteps);
    for (let i = 0; i < step; i++) newCompleted.add(i);
    // Remove steps after target as incomplete
    for (let i = step; i < 4; i++) newCompleted.delete(i);
    setCompletedSteps(newCompleted);
    setCurrentStep(step);
  };

  const editStep = (step: number) => {
    if (completedSteps.has(step) || step === currentStep) {
      goToStep(step);
    }
  };

  const nextStep = () => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(currentStep);
    setCompletedSteps(newCompleted);
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  /* step summary text */
  const getStepSummary = (step: number): string => {
    if (!completedSteps.has(step)) return '';
    switch (step) {
      case 0: return `${firstName || 'Jan'} ${prefix ? prefix + ' ' : ''}${lastName || 'de Vries'}, ${city || 'Amsterdam'}`;
      case 1: return SHIPPING_OPTIONS.find(s => s.id === selectedShipping)?.name ?? 'PostNL';
      case 2: {
        const anyProt = items.some((_, idx) => (protectionChoices[idx] ?? 0) > 0);
        const anyRepl = items.some((_, idx) => replacementChoices[idx]);
        if (anyProt && anyRepl) return 'Extra garantie + vervangend model';
        if (anyProt) return 'Extra garantie';
        if (anyRepl) return 'Vervangend model bij reparatie';
        return 'Geen extra bescherming';
      }
      case 3: return PAYMENT_METHODS.find(m => m.id === selectedPayment)?.name ?? 'iDEAL';
      default: return '';
    }
  };

  /* ───────── render helpers ───────── */

  const renderProgressBar = () => (
    <div style={{ background: '#fff', borderBottom: `1px solid ${CSS.border}`, padding: '20px 24px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 0 }}>
        {STEPS.map((label, i) => {
          const isActive = mode === 'steps' ? i === currentStep : false;
          const isCompleted = mode === 'steps' ? completedSteps.has(i) : false;
          const isLast = i === STEPS.length - 1;
          return (
            <div key={label} style={{ flex: isLast ? 0 : 1, display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: isCompleted ? CSS.green : isActive ? CSS.accent : CSS.border,
                color: isCompleted || isActive ? '#fff' : CSS.textMuted,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '.75rem', fontWeight: 700, flexShrink: 0,
                transition: 'all .3s',
              }}>
                {isCompleted ? <CheckIcon size={12} stroke="#fff" /> : i + 1}
              </div>
              <span className="progress-label" style={{
                fontSize: '.8rem', fontWeight: isActive ? 600 : 500,
                color: isActive ? CSS.text : isCompleted ? CSS.textSec : CSS.textMuted,
                whiteSpace: 'nowrap', transition: 'color .3s',
              }}>{label}</span>
              {!isLast && (
                <div style={{
                  flex: 1, height: 2, margin: '0 12px',
                  background: isCompleted ? CSS.green : CSS.border,
                  borderRadius: 1,
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  /* ─── Step 1: Details & Address ─── */
  const renderDetailsContent = () => (
    <div>
      {/* Email-first */}
      {!emailSubmitted && (
        <>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={labelStyle}>Email address</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  type="email"
                  placeholder="jan@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && email.includes('@')) {
                      if (email.toLowerCase().trim() === 'bekend@hotmail.com') {
                        setIsKnownUser(true);
                        setShowLogin(true);
                      } else {
                        setIsKnownUser(false);
                        setShowLogin(false);
                        setEmailSubmitted(true);
                      }
                    }
                  }}
                  onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(232,105,42,.08)'; }}
                  onBlur={e => { (e.target as HTMLInputElement).style.borderColor = CSS.border; (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
                />
                <button
                  style={{ ...btnPrimary, padding: '12px 20px', whiteSpace: 'nowrap' }}
                  onClick={() => {
                    if (email.includes('@')) {
                      if (email.toLowerCase().trim() === 'bekend@hotmail.com') {
                        setIsKnownUser(true);
                        setShowLogin(true);
                      } else {
                        setIsKnownUser(false);
                        setShowLogin(false);
                        setEmailSubmitted(true);
                      }
                    }
                  }}
                >Continue &rarr;</button>
              </div>
            </div>
          </div>

          {/* Known user login prompt */}
          {showLogin && !loggedIn && (
            <div style={{
              margin: '16px 0',
              padding: 20,
              background: '#EEF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: CSS.rl,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', background: '#BFDBFE',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="16" height="16" fill="none" stroke="#1e40af" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '.9rem', fontWeight: 700, color: '#1e40af' }}>Welkom terug!</div>
                  <div style={{ fontSize: '.8rem', color: '#1e40af', opacity: 0.8 }}>
                    We herkennen dit e-mailadres. Log in om je gegevens automatisch in te vullen.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  style={{ ...inputStyle, flex: 1, borderColor: '#BFDBFE' }}
                  type="password"
                  placeholder="Wachtwoord"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && loginPassword.length > 0) {
                      setLoggedIn(true);
                      setShowLogin(false);
                      setEmailSubmitted(true);
                      setFirstName('Jan');
                      setLastName('de Vries');
                      setPhone('06 12345678');
                      setPostalCode('1015 CJ');
                      setHouseNumber('123');
                      setStreet('Keizersgracht');
                      setCity('Amsterdam');
                    }
                  }}
                  onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(232,105,42,.08)'; }}
                  onBlur={e => { (e.target as HTMLInputElement).style.borderColor = '#BFDBFE'; (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
                />
                <button
                  style={{ ...btnPrimary, padding: '12px 20px', whiteSpace: 'nowrap' }}
                  onClick={() => {
                    if (loginPassword.length > 0) {
                      setLoggedIn(true);
                      setShowLogin(false);
                      setEmailSubmitted(true);
                      setFirstName('Jan');
                      setLastName('de Vries');
                      setPhone('06 12345678');
                      setPostalCode('1015 CJ');
                      setHouseNumber('123');
                      setStreet('Keizersgracht');
                      setCity('Amsterdam');
                    }
                  }}
                >Inloggen</button>
              </div>

              <button
                onClick={() => { setShowLogin(false); setEmailSubmitted(true); }}
                style={{
                  background: 'none', border: 'none', padding: '8px 0 0',
                  fontSize: '.8rem', color: '#1e40af', cursor: 'pointer',
                  textDecoration: 'underline', fontFamily: 'inherit',
                }}
              >
                Doorgaan zonder inloggen
              </button>
            </div>
          )}

          {/* Divider */}
          {!showLogin && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
            <div style={{ flex: 1, height: 1, background: CSS.border }} />
            <span style={{ fontSize: '.75rem', color: CSS.textMuted }}>or express checkout</span>
            <div style={{ flex: 1, height: 1, background: CSS.border }} />
          </div>
          )}

          {/* Express checkout buttons */}
          {!showLogin && (
          <div className="express-btns" style={{ display: 'flex', gap: 8, marginBottom: 0 }}>
            <button style={{
              flex: 1, padding: 12, border: '1.5px solid #000', borderRadius: CSS.r,
              background: '#000', color: '#fff', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: 6,
              fontFamily: 'inherit', fontSize: '.8rem', fontWeight: 600,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.36-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.36C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.32-2.11 4.45-3.74 4.25z" fill="#fff" /></svg>
              Pay
            </button>
            <button style={{
              flex: 1, padding: 12, border: '1.5px solid #4285F4', borderRadius: CSS.r,
              background: '#fff', color: '#4285F4', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: 6,
              fontFamily: 'inherit', fontSize: '.8rem', fontWeight: 600,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
              Google Pay
            </button>
            <button style={{
              flex: 1, padding: 12, border: '1.5px solid #003087', borderRadius: CSS.r,
              background: '#fff', color: '#003087', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: 6,
              fontFamily: 'inherit', fontSize: '.8rem', fontWeight: 600,
            }}>
              PayPal
            </button>
          </div>
          )}
        </>
      )}

      {/* After email submitted: address form */}
      {emailSubmitted && (
        <>
          {/* Email display */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
            padding: '10px 14px', background: CSS.surface, borderRadius: CSS.r,
            fontSize: '.8rem', color: CSS.textSec,
          }}>
            <MailIcon />
            <span>{email}</span>
            <a href="#" onClick={e => { e.preventDefault(); setEmailSubmitted(false); setShowLogin(false); setLoggedIn(false); setLoginPassword(''); setIsKnownUser(false); }}
              style={{ fontSize: '.75rem', marginLeft: 'auto', color: CSS.accent, textDecoration: 'none' }}>Wijzigen</a>
          </div>

          {/* Account creation notice / logged in notice */}
          {loggedIn ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
              padding: '10px 14px', background: CSS.greenLight, border: '1px solid #bbf7d0',
              borderRadius: CSS.r, fontSize: '.8rem', color: '#166534',
            }}>
              <CheckIcon size={14} stroke="#166534" strokeWidth={2.5} />
              Welkom terug, Jan! Je gegevens zijn automatisch ingevuld.
            </div>
          ) : (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
              padding: '10px 14px', background: '#EEF6FF', border: '1px solid #BFDBFE',
              borderRadius: CSS.r, fontSize: '.8rem', color: '#1e40af',
            }}>
              <InfoIcon />
              Na het afronden van je bestelling kun je een account aanmaken.
            </div>
          )}

          {/* Name row */}
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr', gap: 12, marginBottom: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={labelStyle}>First name <span style={{ color: '#ef4444' }}>*</span></label>
              <input style={inputStyle} type="text" placeholder="John" value={firstName} onChange={e => setFirstName(e.target.value)}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = CSS.border; }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={labelStyle}>Prefix</label>
              <input style={{ ...inputStyle, textAlign: 'center' }} type="text" placeholder="van" value={prefix} onChange={e => setPrefix(e.target.value)}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = CSS.border; }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={labelStyle}>Last name <span style={{ color: '#ef4444' }}>*</span></label>
              <input style={inputStyle} type="text" placeholder="Smith" value={lastName} onChange={e => setLastName(e.target.value)}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = CSS.border; }} />
            </div>
          </div>

          {/* Phone + customer type */}
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={labelStyle}>Phone number <span style={{ color: '#ef4444' }}>*</span></label>
              <input style={inputStyle} type="tel" placeholder="+31 6 12345678" value={phone} onChange={e => setPhone(e.target.value)}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = CSS.border; }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={labelStyle}>Customer type <span style={{ color: '#ef4444' }}>*</span></label>
              <select style={selectStyle} value={customerType} onChange={e => setCustomerType(e.target.value as 'private' | 'business')}>
                <option value="private">Private</option>
                <option value="business">Business</option>
              </select>
            </div>
          </div>

          {/* Business fields */}
          {customerType === 'business' && (
            <>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginBottom: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={labelStyle}>Company name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input style={inputStyle} type="text" placeholder="Company Ltd." value={companyName} onChange={e => setCompanyName(e.target.value)}
                    onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }}
                    onBlur={e => { (e.target as HTMLInputElement).style.borderColor = CSS.border; }} />
                </div>
              </div>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={labelStyle}>CoC number <span style={{ color: '#ef4444' }}>*</span></label>
                  <input style={inputStyle} type="text" placeholder="12345678" value={kvkNumber} onChange={e => setKvkNumber(e.target.value)}
                    onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }}
                    onBlur={e => { (e.target as HTMLInputElement).style.borderColor = CSS.border; }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={labelStyle}>VAT number</label>
                  <input style={inputStyle} type="text" placeholder="NL123456789B01" value={vatNumber} onChange={e => setVatNumber(e.target.value)}
                    onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }}
                    onBlur={e => { (e.target as HTMLInputElement).style.borderColor = CSS.border; }} />
                </div>
              </div>
            </>
          )}

          {/* Billing address */}
          <div style={{ height: 4 }} />
          <p style={{ fontSize: '.85rem', fontWeight: 700, color: CSS.accent, marginBottom: 10 }}>Billing address</p>

          <div className="form-row form-row--3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={labelStyle}>Postal code <span style={{ color: '#ef4444' }}>*</span></label>
              <input style={inputStyle} type="text" placeholder="1234 AB" value={postalCode}
                onChange={e => { setPostalCode(e.target.value); handlePostcodeChange(e.target.value, houseNumber); }}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = CSS.border; }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={labelStyle}>No. <span style={{ color: '#ef4444' }}>*</span></label>
              <input style={inputStyle} type="text" placeholder="12" value={houseNumber}
                onChange={e => { setHouseNumber(e.target.value); handlePostcodeChange(postalCode, e.target.value); }}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = CSS.border; }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={labelStyle}>Suffix</label>
              <input style={inputStyle} type="text" placeholder="A" value={suffix} onChange={e => setSuffix(e.target.value)}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = CSS.border; }} />
            </div>
          </div>

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={labelStyle}>Street <span style={{ color: '#ef4444' }}>*</span></label>
              <input style={{ ...inputStyle, background: CSS.surface }} type="text" placeholder="Auto-filled" value={street} readOnly />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={labelStyle}>City <span style={{ color: '#ef4444' }}>*</span></label>
              <input style={{ ...inputStyle, background: CSS.surface }} type="text" placeholder="Auto-filled" value={city} readOnly />
            </div>
          </div>

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginBottom: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={labelStyle}>Country <span style={{ color: '#ef4444' }}>*</span></label>
              <select style={selectStyle} value={country} onChange={e => setCountry(e.target.value)}>
                <option value="NL">Netherlands</option>
                <option value="BE">Belgium</option>
                <option value="DE">Germany</option>
              </select>
            </div>
          </div>

          {/* Shipping address radio */}
          <div style={{ margin: '16px 0 4px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '.85rem', color: CSS.text, marginBottom: 6 }}>
              <input type="radio" name="shipOption" checked={shipOption === 'same'} onChange={() => setShipOption('same')} style={{ width: 18, height: 18, accentColor: CSS.accent }} />
              Ship to this address
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '.85rem', color: CSS.text }}>
              <input type="radio" name="shipOption" checked={shipOption === 'different'} onChange={() => setShipOption('different')} style={{ width: 18, height: 18, accentColor: CSS.accent }} />
              Ship to a different address
            </label>
          </div>

          {/* Alternate shipping address */}
          {shipOption === 'different' && (
            <div style={{ marginTop: 12 }}>
              <p style={{ fontSize: '.85rem', fontWeight: 700, color: CSS.accent, marginBottom: 10 }}>Shipping address</p>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={labelStyle}>Attn. <span style={{ color: '#ef4444' }}>*</span></label>
                  <input style={inputStyle} type="text" placeholder="Attn." value={shipAttn} onChange={e => setShipAttn(e.target.value)}
                    onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }}
                    onBlur={e => { (e.target as HTMLInputElement).style.borderColor = CSS.border; }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={labelStyle}>Company name</label>
                  <input style={inputStyle} type="text" placeholder="Company name" value={shipCompany} onChange={e => setShipCompany(e.target.value)}
                    onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }}
                    onBlur={e => { (e.target as HTMLInputElement).style.borderColor = CSS.border; }} />
                </div>
              </div>
              <div className="form-row form-row--3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={labelStyle}>Postal code <span style={{ color: '#ef4444' }}>*</span></label>
                  <input style={inputStyle} type="text" placeholder="1234 AB" value={shipPostal} onChange={e => setShipPostal(e.target.value)}
                    onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }}
                    onBlur={e => { (e.target as HTMLInputElement).style.borderColor = CSS.border; }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={labelStyle}>No. <span style={{ color: '#ef4444' }}>*</span></label>
                  <input style={inputStyle} type="text" placeholder="12" value={shipHouseNum} onChange={e => setShipHouseNum(e.target.value)}
                    onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }}
                    onBlur={e => { (e.target as HTMLInputElement).style.borderColor = CSS.border; }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={labelStyle}>Suffix</label>
                  <input style={inputStyle} type="text" placeholder="A" value={shipSuffix} onChange={e => setShipSuffix(e.target.value)}
                    onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }}
                    onBlur={e => { (e.target as HTMLInputElement).style.borderColor = CSS.border; }} />
                </div>
              </div>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={labelStyle}>Street <span style={{ color: '#ef4444' }}>*</span></label>
                  <input style={inputStyle} type="text" placeholder="Street" value={shipStreet} onChange={e => setShipStreet(e.target.value)}
                    onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }}
                    onBlur={e => { (e.target as HTMLInputElement).style.borderColor = CSS.border; }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={labelStyle}>City <span style={{ color: '#ef4444' }}>*</span></label>
                  <input style={inputStyle} type="text" placeholder="City" value={shipCity} onChange={e => setShipCity(e.target.value)}
                    onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }}
                    onBlur={e => { (e.target as HTMLInputElement).style.borderColor = CSS.border; }} />
                </div>
              </div>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginBottom: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={labelStyle}>Country <span style={{ color: '#ef4444' }}>*</span></label>
                  <select style={selectStyle} value={shipCountry} onChange={e => setShipCountry(e.target.value)}>
                    <option value="NL">Netherlands</option>
                    <option value="BE">Belgium</option>
                    <option value="DE">Germany</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  /* ─── Step 2: Shipping ─── */
  const renderShippingContent = () => (
    <div>
      {SHIPPING_OPTIONS.map(opt => {
        const isSelected = selectedShipping === opt.id;
        return (
          <div key={opt.id} onClick={() => setSelectedShipping(opt.id)} style={{
            border: `1.5px solid ${isSelected ? CSS.accent : CSS.border}`,
            borderRadius: CSS.r, padding: '14px 16px', display: 'flex', alignItems: 'center',
            gap: 12, cursor: 'pointer', transition: 'all .2s', marginBottom: 8,
            background: isSelected ? CSS.accentLight : 'transparent',
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              border: `2px solid ${isSelected ? CSS.accent : CSS.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: CSS.accent }} />}
            </div>
            <div style={{
              width: 40, height: 40, borderRadius: CSS.r, background: opt.color,
              color: opt.labelColor ?? '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, fontSize: '.6rem', fontWeight: 800, whiteSpace: 'pre-line', textAlign: 'center',
            }}>{opt.label}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '.9rem', fontWeight: 600, color: CSS.text }}>{opt.name}</div>
              <div style={{ fontSize: '.75rem', color: CSS.textMuted }}>Geschatte levertijd: {opt.eta}</div>
            </div>
            <div style={{ fontSize: '.95rem', fontWeight: 700, color: CSS.text }}>&euro; {opt.price.toFixed(2).replace('.', ',')}</div>
          </div>
        );
      })}
    </div>
  );

  /* ─── Step 3: Protection ─── */
  const renderProtectionContent = () => (
    <div>
      <p style={{ fontSize: '.8rem', color: CSS.textSec, marginBottom: 16, lineHeight: 1.5 }}>
        Alle producten worden geleverd met minimaal <strong>12 maanden garantie</strong>. Kies hieronder of je extra bescherming wilt toevoegen.
      </p>

      {/* Two main option cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>

        {/* ── Option 1: Extended Warranty ── */}
        <div style={{
          border: `1.5px solid ${protectionEnabled ? CSS.accent : CSS.border}`,
          borderRadius: CSS.rl,
          overflow: 'hidden',
          transition: 'border-color .2s',
        }}>
          <button
            onClick={() => {
              setProtectionEnabled(!protectionEnabled);
              if (protectionEnabled) {
                // reset all protection choices
                setProtectionChoices({});
              }
            }}
            style={{
              width: '100%', padding: '16px 18px',
              display: 'flex', alignItems: 'center', gap: 14,
              background: protectionEnabled ? CSS.accentLight : '#fff',
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              transition: 'background .2s',
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: protectionEnabled ? CSS.accent : CSS.surface,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'background .2s',
            }}>
              <ShieldIcon size={18} stroke={protectionEnabled ? '#fff' : CSS.textMuted} />
            </div>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ fontSize: '.9rem', fontWeight: 700, color: CSS.text }}>Extra garantie</div>
              <div style={{ fontSize: '.75rem', color: CSS.textSec, marginTop: 2, lineHeight: 1.4 }}>
                Verleng je garantie met 1 of 2 jaar bovenop de standaard 12 maanden.
              </div>
            </div>
            <div style={{
              width: 22, height: 22, borderRadius: 6,
              border: `2px solid ${protectionEnabled ? CSS.accent : CSS.border}`,
              background: protectionEnabled ? CSS.accent : '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'all .2s',
            }}>
              {protectionEnabled && <CheckIcon size={12} stroke="#fff" strokeWidth={3} />}
            </div>
          </button>

          {/* Expanded: per-product year selection */}
          {protectionEnabled && (
            <div style={{ padding: '0 18px 18px', background: CSS.accentLight }}>
              <div style={{
                fontSize: '.7rem', fontWeight: 600, color: CSS.textMuted,
                textTransform: 'uppercase', letterSpacing: '.04em',
                marginBottom: 10, paddingTop: 4,
              }}>
                Kies per product
              </div>
              {items.map((item, idx) => {
                const choice = protectionChoices[idx] ?? 0;
                return (
                  <div key={item.id} style={{
                    background: '#fff', borderRadius: CSS.r, padding: 14, marginBottom: 8,
                    border: `1px solid ${CSS.border}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <span style={{ fontSize: '.8rem', fontWeight: 600, color: CSS.text }}>{item.name}</span>
                      <span style={{ fontSize: '.7rem', color: CSS.textMuted, marginLeft: 'auto' }}>&euro; {item.price.toLocaleString('nl-NL')}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[1, 2].map(years => {
                        const isActive = choice === years;
                        const price = getProtectionPrice(item.price, years);
                        const pct = years === 1 ? '10%' : '15%';
                        return (
                          <button
                            key={years}
                            onClick={() => setProtectionChoices(prev => ({ ...prev, [idx]: isActive ? 0 : years }))}
                            style={{
                              flex: 1, padding: '10px 8px',
                              border: `1.5px solid ${isActive ? CSS.accent : CSS.border}`,
                              borderRadius: CSS.r,
                              background: isActive ? '#fff' : '#fff',
                              cursor: 'pointer', textAlign: 'center', fontFamily: 'inherit',
                              transition: 'border-color .15s',
                            }}
                          >
                            <div style={{ fontSize: '.75rem', fontWeight: 600, color: isActive ? CSS.accent : CSS.text }}>
                              + {years} jaar
                            </div>
                            <div style={{ fontSize: '.85rem', fontWeight: 700, color: isActive ? CSS.accent : CSS.text, marginTop: 2 }}>
                              &euro; {price.toLocaleString('nl-NL')}
                            </div>
                            <div style={{ fontSize: '.65rem', color: CSS.textMuted, marginTop: 2 }}>
                              {pct} &middot; {12 + years * 12} mnd totaal
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Option 2: Replacement during repair ── */}
        <div style={{
          border: `1.5px solid ${replacementEnabled ? CSS.accent : CSS.border}`,
          borderRadius: CSS.rl,
          overflow: 'hidden',
          transition: 'border-color .2s',
        }}>
          <button
            onClick={() => {
              setReplacementEnabled(!replacementEnabled);
              if (replacementEnabled) {
                setReplacementChoices({});
              }
            }}
            style={{
              width: '100%', padding: '16px 18px',
              display: 'flex', alignItems: 'center', gap: 14,
              background: replacementEnabled ? CSS.accentLight : '#fff',
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              transition: 'background .2s',
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: replacementEnabled ? CSS.accent : CSS.surface,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'background .2s',
            }}>
              <RepeatIcon />
            </div>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ fontSize: '.9rem', fontWeight: 700, color: CSS.text }}>Vervangend model bij reparatie</div>
              <div style={{ fontSize: '.75rem', color: CSS.textSec, marginTop: 2, lineHeight: 1.4 }}>
                Ontvang een vervangend toestel als jouw product in reparatie is, zodat je altijd kunt blijven fotograferen.
              </div>
            </div>
            <div style={{
              width: 22, height: 22, borderRadius: 6,
              border: `2px solid ${replacementEnabled ? CSS.accent : CSS.border}`,
              background: replacementEnabled ? CSS.accent : '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'all .2s',
            }}>
              {replacementEnabled && <CheckIcon size={12} stroke="#fff" strokeWidth={3} />}
            </div>
          </button>

          {/* Expanded: per-product toggle */}
          {replacementEnabled && (
            <div style={{ padding: '0 18px 18px', background: CSS.accentLight }}>
              <div style={{
                fontSize: '.7rem', fontWeight: 600, color: CSS.textMuted,
                textTransform: 'uppercase', letterSpacing: '.04em',
                marginBottom: 10, paddingTop: 4,
              }}>
                Kies per product
              </div>
              {items.map((item, idx) => {
                const isActive = replacementChoices[idx] ?? false;
                const price = getReplacementPrice(item.price);
                return (
                  <div key={item.id} style={{
                    background: '#fff', borderRadius: CSS.r, padding: 14, marginBottom: 8,
                    border: `1px solid ${isActive ? CSS.accent : CSS.border}`,
                    display: 'flex', alignItems: 'center', gap: 12,
                    cursor: 'pointer', transition: 'border-color .15s',
                  }}
                    onClick={() => setReplacementChoices(prev => ({ ...prev, [idx]: !isActive }))}
                  >
                    <div style={{
                      width: 20, height: 20, borderRadius: 4,
                      border: `2px solid ${isActive ? CSS.accent : CSS.border}`,
                      background: isActive ? CSS.accent : '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'all .15s',
                    }}>
                      {isActive && <CheckIcon size={10} stroke="#fff" strokeWidth={3} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '.8rem', fontWeight: 600, color: CSS.text }}>{item.name}</span>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '.85rem', fontWeight: 700, color: isActive ? CSS.accent : CSS.text }}>
                        &euro; {price.toLocaleString('nl-NL')}
                      </div>
                      <div style={{ fontSize: '.65rem', color: CSS.textMuted }}>2% van &euro; {item.price.toLocaleString('nl-NL')}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Info box */}
      <div style={{ background: CSS.surface, borderRadius: CSS.r, padding: '12px 16px', fontSize: '.75rem', color: CSS.textSec, lineHeight: 1.6 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
          <ShieldIcon stroke={CSS.accent} />
          <span><strong style={{ color: CSS.text }}>Extra garantie</strong> — 10% (1 jaar) of 15% (2 jaar) bovenop de standaard 12 maanden garantie</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <RepeatIcon />
          <span><strong style={{ color: CSS.text }}>Vervangend model</strong> — 2% van de productwaarde, ontvang een vervangend toestel tijdens reparatie</span>
        </div>
      </div>
    </div>
  );

  /* ─── Step 4: Payment ─── */
  const renderPaymentContent = () => (
    <div>
      {PAYMENT_METHODS.map(method => {
        const isSelected = selectedPayment === method.id;
        return (
          <div key={method.id}>
            <div onClick={() => setSelectedPayment(method.id)} style={{
              border: `1.5px solid ${isSelected ? CSS.accent : CSS.border}`,
              borderRadius: CSS.r, padding: '14px 16px', display: 'flex', alignItems: 'center',
              gap: 12, cursor: 'pointer', transition: 'all .2s', marginBottom: 8,
              background: isSelected ? CSS.accentLight : 'transparent',
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                border: `2px solid ${isSelected ? CSS.accent : CSS.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: CSS.accent }} />}
              </div>
              <div style={{
                width: 40, height: 28, borderRadius: 4, background: method.id === 'creditcard' ? 'transparent' : method.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                overflow: 'hidden', border: `1px solid ${CSS.border}`,
              }}>
                {method.id === 'creditcard' ? (
                  <svg width="24" height="16" viewBox="0 0 24 16"><rect width="24" height="16" rx="2" fill="#EB001B" /><circle cx="9" cy="8" r="5" fill="#EB001B" /><circle cx="15" cy="8" r="5" fill="#F79E1B" /><path d="M12 4.4a5 5 0 010 7.2 5 5 0 010-7.2z" fill="#FF5F00" /></svg>
                ) : (
                  <span style={{ color: '#fff', fontSize: method.id === 'ideal' ? 7 : 5, fontWeight: 700 }}>
                    {method.id === 'ideal' ? 'iDEAL' : method.id === 'in3' ? 'in3' : method.id === 'paypal' ? 'PP' : method.id === 'bank' ? 'BANK' : method.id === 'bancontact' ? 'Bancontact' : 'Pay'}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '.9rem', fontWeight: 600, color: CSS.text }}>{method.name}</div>
              <div style={{ marginLeft: 'auto', color: CSS.textMuted }}><ChevronRight /></div>
            </div>

            {/* iDEAL bank selector */}
            {method.id === 'ideal' && isSelected && (
              <div style={{
                marginTop: -4, marginBottom: 8, padding: '12px 16px',
                background: CSS.surface, borderRadius: CSS.r, border: `1px solid ${CSS.border}`,
              }}>
                <select style={{ ...selectStyle, width: '100%' }} value={selectedBank} onChange={e => setSelectedBank(e.target.value)}>
                  <option value="">Choose your bank...</option>
                  {IDEAL_BANKS.map(bank => <option key={bank} value={bank}>{bank}</option>)}
                </select>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  /* ─── Step 5: Review ─── */
  const renderReviewContent = () => {
    const finalTotal = grandTotal - (promoApplied ? 50 : 0);
    const shippingOption = SHIPPING_OPTIONS.find(s => s.id === selectedShipping);
    const paymentMethod = PAYMENT_METHODS.find(m => m.id === selectedPayment);

    const sectionStyle: React.CSSProperties = {
      background: CSS.surface, borderRadius: CSS.r, padding: '14px 16px', marginBottom: 12,
    };
    const sectionTitle: React.CSSProperties = {
      fontSize: '.7rem', fontWeight: 700, color: CSS.textMuted,
      textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    };
    const editLink: React.CSSProperties = {
      fontSize: '.75rem', fontWeight: 600, color: CSS.accent,
      cursor: 'pointer', textTransform: 'none', letterSpacing: 0,
    };

    return (
      <div>
        <p style={{ fontSize: '.8rem', color: CSS.textSec, marginBottom: 16, lineHeight: 1.5 }}>
          Controleer je bestelling voordat je deze plaatst.
        </p>

        {/* Products */}
        <div style={sectionStyle}>
          <div style={sectionTitle}>
            <span>Producten ({itemCount})</span>
          </div>
          {items.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: `1px solid ${CSS.border}` }}>
              <div style={{
                width: 44, height: 44, borderRadius: 6, background: '#fff',
                overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${CSS.border}`,
              }}>
                <img src={assetPath(item.image)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '.8rem', fontWeight: 600, color: CSS.text }}>{item.name}</div>
                <div style={{ fontSize: '.7rem', color: CSS.textMuted }}>SKU: {item.sku} &middot; {item.condition}</div>
              </div>
              <div style={{ fontSize: '.85rem', fontWeight: 700, color: CSS.text, alignSelf: 'center' }}>
                &euro; {item.price.toLocaleString('nl-NL')}
              </div>
            </div>
          ))}
        </div>

        {/* Address */}
        <div style={sectionStyle}>
          <div style={sectionTitle}>
            <span>Bezorgadres</span>
            <span style={editLink} onClick={() => goToStep(0)}>Wijzigen</span>
          </div>
          <div style={{ fontSize: '.8rem', color: CSS.text, lineHeight: 1.6 }}>
            {firstName || 'Jan'} {prefix ? prefix + ' ' : ''}{lastName || 'de Vries'}<br />
            {street || 'Keizersgracht'} {houseNumber || '123'}{suffix ? ` ${suffix}` : ''}<br />
            {postalCode || '1015 CJ'} {city || 'Amsterdam'}<br />
            {email}
          </div>
        </div>

        {/* Shipping */}
        <div style={sectionStyle}>
          <div style={sectionTitle}>
            <span>Verzending</span>
            <span style={editLink} onClick={() => goToStep(1)}>Wijzigen</span>
          </div>
          <div style={{ fontSize: '.8rem', color: CSS.text, display: 'flex', justifyContent: 'space-between' }}>
            <span>{shippingOption?.name} &middot; {shippingOption?.eta}</span>
            <span style={{ fontWeight: 600 }}>&euro; {shippingCost.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>

        {/* Protection */}
        <div style={sectionStyle}>
          <div style={sectionTitle}>
            <span>Bescherming</span>
            <span style={editLink} onClick={() => goToStep(2)}>Wijzigen</span>
          </div>
          {protectionTotal > 0 ? (
            <div style={{ fontSize: '.8rem', color: CSS.text }}>
              {items.map((item, idx) => {
                const years = protectionChoices[idx] ?? 0;
                const repl = replacementChoices[idx];
                if (!years && !repl) return null;
                return (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>{item.name}: {years > 0 ? `+${years} jaar garantie` : ''}{years > 0 && repl ? ' + ' : ''}{repl ? 'vervangend model' : ''}</span>
                    <span style={{ fontWeight: 600 }}>&euro; {(getProtectionPrice(item.price, years) + (repl ? getReplacementPrice(item.price) : 0)).toLocaleString('nl-NL')}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ fontSize: '.8rem', color: CSS.textMuted }}>Geen extra bescherming gekozen</div>
          )}
        </div>

        {/* Payment */}
        <div style={sectionStyle}>
          <div style={sectionTitle}>
            <span>Betaalmethode</span>
            <span style={editLink} onClick={() => goToStep(3)}>Wijzigen</span>
          </div>
          <div style={{ fontSize: '.8rem', color: CSS.text }}>
            {paymentMethod?.name}{selectedPayment === 'ideal' && selectedBank ? ` — ${selectedBank}` : ''}
          </div>
        </div>

        {/* Promo & Remarks (inline in review) */}
        <div style={sectionStyle}>
          <div style={sectionTitle}><span>Kortingscode &amp; opmerkingen</span></div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: remarks ? 10 : 0 }}>
            <TagIcon />
            <input
              style={{ ...inputStyle, flex: 1, fontSize: '.8rem', padding: '9px 12px', background: '#fff' }}
              type="text"
              placeholder="Kortingscode"
              value={promoCode}
              onChange={e => setPromoCode(e.target.value)}
            />
            {promoCode && !promoApplied && (
              <button
                onClick={() => setPromoApplied(true)}
                style={{
                  background: CSS.dark, color: '#fff', border: 'none', borderRadius: CSS.r,
                  padding: '9px 14px', fontSize: '.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >Toepassen</button>
            )}
            {promoApplied && (
              <span style={{ fontSize: '.8rem', fontWeight: 600, color: CSS.green }}>- &euro; 50</span>
            )}
          </div>
          {remarks && (
            <div style={{ fontSize: '.8rem', color: CSS.textSec, fontStyle: 'italic' }}>&ldquo;{remarks}&rdquo;</div>
          )}
        </div>

        {/* Total breakdown */}
        <div style={{
          background: '#fff', borderRadius: CSS.rl, border: `1.5px solid ${CSS.dark}`,
          padding: 18, marginTop: 16,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '.8rem' }}>
            <span style={{ color: CSS.textSec }}>Subtotaal excl. BTW</span>
            <span style={{ fontWeight: 600, color: CSS.text }}>&euro; {subtotal.toFixed(2).replace('.', ',')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '.8rem' }}>
            <span style={{ color: CSS.textSec }}>BTW (21%)</span>
            <span style={{ fontWeight: 600, color: CSS.text }}>&euro; {vatAmount.toFixed(2).replace('.', ',')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '.8rem' }}>
            <span style={{ color: CSS.textSec }}>Verzendkosten</span>
            <span style={{ fontWeight: 600, color: CSS.text }}>&euro; {shippingCost.toFixed(2).replace('.', ',')}</span>
          </div>
          {protectionTotal > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '.8rem' }}>
              <span style={{ color: CSS.textSec }}>Productbescherming</span>
              <span style={{ fontWeight: 600, color: CSS.text }}>&euro; {protectionTotal.toLocaleString('nl-NL')}</span>
            </div>
          )}
          {promoApplied && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '.8rem' }}>
              <span style={{ color: CSS.textSec }}>Korting</span>
              <span style={{ fontWeight: 600, color: CSS.accent }}>- &euro; 50</span>
            </div>
          )}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginTop: 12, paddingTop: 12, borderTop: `2px solid ${CSS.dark}`,
          }}>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: CSS.text }}>Totaal incl. BTW</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: CSS.text }}>
              &euro; {finalTotal.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
      </div>
    );
  };

  /* ─── Step card wrapper (step-by-step mode) ─── */
  const renderStepCard = (stepIndex: number, title: string, content: React.ReactNode) => {
    const isActive = currentStep === stepIndex;
    const isCompleted = completedSteps.has(stepIndex);
    const summary = getStepSummary(stepIndex);
    return (
      <div key={stepIndex} style={{
        background: '#fff', borderRadius: CSS.rl,
        border: `1.5px solid ${isActive ? CSS.dark : CSS.border}`,
        marginBottom: 12, overflow: 'hidden',
        transition: 'border-color .3s, box-shadow .3s',
        boxShadow: isActive ? '0 2px 16px rgba(45,48,71,.06)' : 'none',
      }}>
        {/* Header */}
        <div
          onClick={() => editStep(stepIndex)}
          style={{
            padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12,
            cursor: 'pointer', userSelect: 'none',
            borderBottom: isActive ? `1px solid ${CSS.border}` : 'none',
          }}
        >
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: isCompleted ? CSS.green : isActive ? CSS.accent : CSS.border,
            color: isCompleted || isActive ? '#fff' : CSS.textMuted,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '.75rem', fontWeight: 700, flexShrink: 0,
          }}>
            {isCompleted ? <CheckIcon size={12} stroke="#fff" /> : stepIndex + 1}
          </div>
          <div style={{ fontSize: '.95rem', fontWeight: 600, color: CSS.text }}>{title}</div>
          {isCompleted && summary && (
            <div style={{ fontSize: '.8rem', color: CSS.textMuted, marginLeft: 'auto' }}>{summary}</div>
          )}
          {isCompleted && (
            <div style={{ fontSize: '.8rem', color: CSS.accent, fontWeight: 600, marginLeft: summary ? 12 : 'auto' }}>Change</div>
          )}
          {!isCompleted && !isActive && stepIndex === 2 && (
            <div style={{ fontSize: '.8rem', color: CSS.textMuted, marginLeft: 'auto' }}>(optioneel)</div>
          )}
        </div>

        {/* Content */}
        {isActive && (
          <div style={{ padding: '24px 20px' }}>
            {content}

            {/* Navigation buttons */}
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {stepIndex > 0 && (
                <button style={btnSecondary} onClick={prevStep}>&larr; Terug</button>
              )}
              {stepIndex < 4 ? (
                <button style={{ ...btnPrimary, marginLeft: 'auto' }} onClick={nextStep}>
                  {stepIndex === 3 ? 'Controleer bestelling' : `Ga naar ${STEPS[stepIndex + 1].toLowerCase()}`} &rarr;
                </button>
              ) : (
                <button style={{ ...btnPrimary, marginLeft: 'auto', width: '100%', padding: '16px 32px', fontSize: '1rem' }} onClick={() => alert('Bestelling geplaatst! (demo)')}>
                  <LockIcon />
                  Bestelling plaatsen &middot; &euro; {(grandTotal - (promoApplied ? 50 : 0)).toFixed(2).replace('.', ',')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ─── One-page section wrapper ─── */
  const renderOnePageSection = (stepIndex: number, title: string, content: React.ReactNode) => (
    <div key={stepIndex} style={{
      background: '#fff', borderRadius: CSS.rl,
      border: `1.5px solid ${CSS.border}`,
      marginBottom: 16, overflow: 'hidden',
    }}>
      <div style={{
        padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: `1px solid ${CSS.border}`,
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          background: CSS.accent, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '.75rem', fontWeight: 700, flexShrink: 0,
        }}>{stepIndex + 1}</div>
        <div style={{ fontSize: '.95rem', fontWeight: 600, color: CSS.text }}>{title}</div>
      </div>
      <div style={{ padding: '24px 20px' }}>{content}</div>
    </div>
  );

  /* ─── Order summary sidebar ─── */
  const renderOrderSummary = () => (
    <div style={{
      background: '#fff', borderRadius: CSS.rl,
      border: `1.5px solid ${CSS.border}`, padding: 20,
      position: 'sticky', top: 24,
    }}>
      <div style={{ fontSize: '1rem', fontWeight: 700, color: CSS.text, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        Overzicht <span style={{ fontSize: '.8rem', fontWeight: 500, color: CSS.textMuted }}>({itemCount} artikel{itemCount !== 1 ? 'en' : ''})</span>
      </div>

      {/* Cart items */}
      {items.length === 0 ? (
        <p style={{ fontSize: '.8rem', color: CSS.textMuted }}>Your cart is empty</p>
      ) : (
        <div>
          {items.map(item => (
            <div key={item.id} style={{
              display: 'flex', gap: 12, padding: '12px 0',
              borderBottom: `1px solid ${CSS.border}`,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: CSS.r,
                background: CSS.surface, overflow: 'hidden', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <img src={assetPath(item.image)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '.78rem', fontWeight: 600, color: CSS.text, lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.name}</div>
                <div style={{ fontSize: '.7rem', color: CSS.textMuted, marginTop: 2 }}>
                  1x{!item.inclVat && (
                    <span style={{ fontSize: 9, fontWeight: 600, padding: '1px 5px', borderRadius: 3, background: '#fef3c7', color: '#92400e', marginLeft: 4 }}>EXCL. VAT</span>
                  )}
                </div>
              </div>
              <div style={{ fontSize: '.85rem', fontWeight: 700, color: CSS.text, whiteSpace: 'nowrap', alignSelf: 'center' }}>
                &euro; {item.price.toLocaleString('nl-NL')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Promo code */}
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${CSS.border}` }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <TagIcon />
          <input
            style={{
              ...inputStyle,
              flex: 1, fontSize: '.8rem', padding: '9px 12px',
              borderColor: promoCode ? CSS.border : 'transparent',
              background: promoCode ? '#fff' : CSS.surface,
              transition: 'all .2s',
            }}
            type="text"
            placeholder="Discount code"
            value={promoCode}
            onChange={e => setPromoCode(e.target.value)}
            onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; (e.target as HTMLInputElement).style.background = '#fff'; }}
            onBlur={e => {
              if (!promoCode) { (e.target as HTMLInputElement).style.borderColor = 'transparent'; (e.target as HTMLInputElement).style.background = CSS.surface; }
              else { (e.target as HTMLInputElement).style.borderColor = CSS.border; }
            }}
          />
          {promoCode && (
            <button
              onClick={() => setPromoApplied(true)}
              style={{
                background: CSS.dark, color: '#fff', border: 'none', borderRadius: CSS.r,
                padding: '9px 14px', fontSize: '.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >Apply</button>
          )}
        </div>
      </div>

      {/* Remarks */}
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${CSS.border}` }}>
        <label style={{ fontSize: '.75rem', fontWeight: 600, color: CSS.textSec, display: 'block', marginBottom: 4 }}>Remarks (optional)</label>
        <textarea
          placeholder="E.g. delivery instructions, special requests..."
          value={remarks}
          onChange={e => setRemarks(e.target.value)}
          style={{
            width: '100%', minHeight: 60, padding: '9px 12px',
            border: `1.5px solid ${CSS.border}`, borderRadius: CSS.r,
            fontFamily: 'inherit', fontSize: '.8rem', color: CSS.text,
            resize: 'vertical', background: 'transparent', boxSizing: 'border-box',
            transition: 'border-color .2s', outline: 'none',
          }}
          onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = CSS.accent; }}
          onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = CSS.border; }}
        />
      </div>

      {/* Totals */}
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${CSS.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '.85rem' }}>
          <span style={{ color: CSS.textSec }}>Subtotal excl. VAT</span>
          <span style={{ fontWeight: 600, color: CSS.text }}>&euro; {subtotal.toFixed(2).replace('.', ',')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '.85rem' }}>
          <span style={{ color: CSS.textSec }}>VAT (21%)</span>
          <span style={{ fontWeight: 600, color: CSS.text }}>&euro; {vatAmount.toFixed(2).replace('.', ',')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '.85rem' }}>
          <span style={{ color: CSS.textSec }}>Shipping</span>
          <span style={{ fontWeight: 600, color: CSS.text }}>&euro; {shippingCost.toFixed(2).replace('.', ',')}</span>
        </div>
        {protectionTotal > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '.85rem' }}>
            <span style={{ color: CSS.textSec }}>Product protection</span>
            <span style={{ fontWeight: 600, color: CSS.text }}>&euro; {protectionTotal.toLocaleString('nl-NL')}</span>
          </div>
        )}
        {promoApplied && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '.85rem' }}>
            <span style={{ color: CSS.textSec }}>Discount</span>
            <span style={{ fontWeight: 600, color: CSS.accent }}>- &euro; 50</span>
          </div>
        )}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          marginTop: 12, paddingTop: 12, borderTop: `1.5px solid ${CSS.border}`, fontSize: '1rem',
        }}>
          <span style={{ fontWeight: 700, color: CSS.text }}>Total incl. VAT</span>
          <span style={{ fontWeight: 700, color: CSS.text, fontSize: '1.1rem' }}>
            &euro; {(grandTotal - (promoApplied ? 50 : 0)).toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>

      {/* Trust signals */}
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${CSS.border}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.75rem', color: CSS.textMuted }}>
          <ShieldIcon stroke={CSS.green} />
          Secure SSL connection
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.75rem', color: CSS.textMuted }}>
          <CircleCheck stroke={CSS.green} />
          14-day return policy for online purchases
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.75rem', color: CSS.textMuted }}>
          <CircleCheck stroke={CSS.green} />
          Minimum 12-month warranty
        </div>
      </div>
    </div>
  );

  /* ───────── MAIN RENDER ───────── */
  return (
    <div style={{ background: CSS.surface, minHeight: '100vh', fontFamily: 'inherit' }}>
      {/* Responsive styles */}
      <style>{`
        .mobile-summary-bar{display:none}
        @media(max-width:768px){
          .checkout-layout{grid-template-columns:1fr !important;padding:16px !important}
          .checkout-summary{display:none !important}
          .mobile-summary-bar{display:flex !important}
          .form-row{grid-template-columns:1fr !important}
          .form-row--3{grid-template-columns:1fr !important}
          .progress-label{font-size:.7rem !important}
          .express-btns{flex-direction:column !important}
          .prot-options{flex-direction:column !important}
          .btn-group-step{flex-direction:column !important}
        }
        @media(max-width:480px){
          .progress-label{display:none !important}
          .secure-label{display:none !important}
        }
      `}</style>

      {/* ─── Top bar ─── */}
      <div style={{
        background: '#fff', borderBottom: `1px solid ${CSS.border}`,
        padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: CSS.dark, fontSize: '1.25rem', fontWeight: 700 }}>
            <div style={{
              width: 32, height: 32, background: CSS.accent, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CameraIcon />
            </div>
            Camify
          </Link>
          <Link href="/" style={{ fontSize: '.8rem', color: CSS.textMuted, textDecoration: 'none', marginLeft: 16 }}>
            &larr; Back to shop
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.8rem', color: CSS.textMuted, fontWeight: 500 }}>
          <span style={{ color: CSS.green }}><LockIcon /></span>
          <span className="secure-label">Secure checkout</span>
        </div>
      </div>

      {/* ─── Mode toggle ─── */}
      <div style={{
        background: '#fff', borderBottom: `1px solid ${CSS.border}`, padding: '12px 24px',
        display: 'flex', justifyContent: 'center',
      }}>
        <div style={{
          display: 'inline-flex', background: CSS.surface, borderRadius: 50, padding: 3,
          border: `1px solid ${CSS.border}`,
        }}>
          <button
            onClick={() => setMode('steps')}
            style={{
              padding: '8px 20px', borderRadius: 50, border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: '.8rem', fontWeight: 600,
              background: mode === 'steps' ? CSS.dark : 'transparent',
              color: mode === 'steps' ? '#fff' : CSS.textSec,
              transition: 'all .2s',
            }}
          >Step-by-step</button>
          <button
            onClick={() => setMode('onepage')}
            style={{
              padding: '8px 20px', borderRadius: 50, border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: '.8rem', fontWeight: 600,
              background: mode === 'onepage' ? CSS.dark : 'transparent',
              color: mode === 'onepage' ? '#fff' : CSS.textSec,
              transition: 'all .2s',
            }}
          >One page</button>
        </div>
      </div>

      {/* ─── Progress bar (step-by-step only) ─── */}
      {mode === 'steps' && renderProgressBar()}

      {/* ─── Mobile collapsible order summary ─── */}
      <div className="mobile-summary-bar" style={{
        display: 'none', /* overridden by media query */
        flexDirection: 'column',
        background: '#fff', borderBottom: `1px solid ${CSS.border}`,
      }}>
        <button
          onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px', background: 'none', border: 'none',
            cursor: 'pointer', fontFamily: 'inherit', width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="18" height="18" fill="none" stroke={CSS.accent} strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span style={{ fontSize: '.85rem', fontWeight: 600, color: CSS.text }}>
              {mobileSummaryOpen ? 'Verberg' : 'Toon'} overzicht ({itemCount} artikel{itemCount !== 1 ? 'en' : ''})
            </span>
            <svg width="12" height="12" fill="none" stroke={CSS.textMuted} strokeWidth="2" viewBox="0 0 24 24"
              style={{ transform: mobileSummaryOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: CSS.text }}>
            &euro; {(grandTotal - (promoApplied ? 50 : 0)).toFixed(2).replace('.', ',')}
          </span>
        </button>
        {mobileSummaryOpen && (
          <div style={{ padding: '0 20px 16px' }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: `1px solid ${CSS.border}` }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 6, background: CSS.surface,
                  overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <img src={assetPath(item.image)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '.78rem', fontWeight: 600, color: CSS.text }}>{item.name}</div>
                  <div style={{ fontSize: '.68rem', color: CSS.textMuted }}>{item.condition}</div>
                </div>
                <div style={{ fontSize: '.82rem', fontWeight: 700, color: CSS.text, alignSelf: 'center' }}>
                  &euro; {item.price.toLocaleString('nl-NL')}
                </div>
              </div>
            ))}
            <div style={{ marginTop: 10, fontSize: '.8rem', color: CSS.textSec }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>Subtotaal excl. BTW</span>
                <span style={{ fontWeight: 600, color: CSS.text }}>&euro; {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>BTW (21%)</span>
                <span style={{ fontWeight: 600, color: CSS.text }}>&euro; {vatAmount.toFixed(2).replace('.', ',')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Verzending</span>
                <span style={{ fontWeight: 600, color: CSS.text }}>&euro; {shippingCost.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Main layout ─── */}
      <div className="checkout-layout" style={{
        maxWidth: 960, margin: '0 auto', padding: 24,
        display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start',
      }}>
        {/* Left column */}
        <div>
          {mode === 'steps' ? (
            <>
              {renderStepCard(0, 'Gegevens & adres', renderDetailsContent())}
              {renderStepCard(1, 'Verzendmethode', renderShippingContent())}
              {renderStepCard(2, 'Productbescherming', renderProtectionContent())}
              {renderStepCard(3, 'Betaalmethode', renderPaymentContent())}
              {renderStepCard(4, 'Besteloverzicht', renderReviewContent())}
            </>
          ) : (
            <>
              {renderOnePageSection(0, 'Gegevens & adres', renderDetailsContent())}
              {renderOnePageSection(1, 'Verzendmethode', renderShippingContent())}
              {renderOnePageSection(2, 'Productbescherming', renderProtectionContent())}
              {renderOnePageSection(3, 'Betaalmethode', renderPaymentContent())}
              {/* Place order button */}
              <button
                style={{ ...btnPrimary, width: '100%', marginTop: 4, marginBottom: 24, padding: '16px 32px', fontSize: '1rem' }}
                onClick={() => alert('Bestelling geplaatst! (demo)')}
              >
                <LockIcon />
                Bestelling plaatsen &middot; &euro; {(grandTotal - (promoApplied ? 50 : 0)).toFixed(2).replace('.', ',')}
              </button>
            </>
          )}
        </div>

        {/* Right column: Order summary */}
        <div className="checkout-summary">
          {renderOrderSummary()}
        </div>
      </div>

      {/* Checkout footer */}
      <div style={{ borderTop: `1px solid ${CSS.border}`, padding: '16px 24px', textAlign: 'center', fontSize: 11, color: CSS.textMuted }}>
        Camera-tweedehands.nl B.V. · Kerkstraat 47 Bis, 4191AA Geldermalsen · KVK: 80564674 · BTW: NL861717971B01
      </div>
    </div>
  );
}

'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useCart, type CartItem } from '@/context/CartContext';
import { assetPath } from '@/lib/utils';

/* ───────── constants ───────── */
const STEPS = ['Gegevens', 'Verzending', 'Betalen'] as const;

const SHIPPING_OPTIONS = [
  { id: 'postnl', name: 'PostNL', eta: '1-2 werkdagen', price: 6.95, color: '#ff6600', label: 'Post\nNL' },
  { id: 'dpd', name: 'DPD', eta: '1-2 werkdagen', price: 7.95, color: '#dc0032', label: 'DPD' },
  { id: 'dhl', name: 'DHL', eta: '2-3 werkdagen', price: 5.95, color: '#ffcc00', labelColor: '#d40511', label: 'DHL' },
];

const PAYMENT_METHODS = [
  { id: 'ideal', name: 'iDEAL', bg: '#CC0066' },
  { id: 'creditcard', name: 'Creditcard', bg: '#EB001B' },
  { id: 'klarna', name: 'Klarna — achteraf betalen', bg: '#FFB3C7' },
  { id: 'billink', name: 'Billink — achteraf betalen', bg: '#00A5B5' },
  { id: 'in3', name: 'in3 — betaal in 3 termijnen', bg: '#7B68EE' },
  { id: 'bancontact', name: 'Bancontact', bg: '#005498' },
  { id: 'applepay', name: 'Apple Pay', bg: '#000' },
  { id: 'paypal', name: 'PayPal', bg: '#003087' },
  { id: 'bank', name: 'Bankoverschrijving', bg: '#1E2133' },
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

const TruckIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
);

/* ───────── Trustpilot badge ───────── */
const TrustpilotBadge = ({ compact = false }: { compact?: boolean }) => {
  const green = '#00B67A';
  const s = compact ? 18 : 22; // star box size
  const gap = compact ? 2 : 2;
  const Star = () => (
    <div style={{ width: s, height: s, background: green, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={s * 0.6} height={s * 0.6} viewBox="0 0 24 24">
        <polygon points="12,2 15.1,8.3 22,9.2 17,14 18.2,21 12,17.7 5.8,21 7,14 2,9.2 8.9,8.3" fill="#fff" />
      </svg>
    </div>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: compact ? 6 : 8 }}>
      <span style={{ fontWeight: 700, fontSize: compact ? '.75rem' : '.85rem', color: CSS.text }}>Uitstekend</span>
      <div style={{ display: 'flex', gap }}>
        {[1,2,3,4,5].map(i => <Star key={i} />)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <svg width={compact ? 14 : 17} height={compact ? 14 : 17} viewBox="0 0 24 24">
          <polygon points="12,2 15.1,8.3 22,9.2 17,14 18.2,21 12,17.7 5.8,21 7,14 2,9.2 8.9,8.3" fill={green} />
        </svg>
        <span style={{ fontWeight: 600, fontSize: compact ? '.7rem' : '.8rem', color: '#191919', letterSpacing: '-0.01em' }}>Trustpilot</span>
      </div>
    </div>
  );
};

/* ───────── demo items ───────── */
// warrantyMonths: inbegrepen garantie in maanden (12 of 24, afhankelijk van product)
interface CheckoutItem extends CartItem {
  warrantyMonths?: number; // 12 of 24 — standaard 12 als niet opgegeven
}

const DEMO_ITEMS: CheckoutItem[] = [
  { id: '257962', sku: '257962', name: 'Sony A7 IV', price: 1749, condition: 'Excellent', image: '/images/sony-a7-iv.jpg', inclVat: true, warrantyMonths: 24 },
  { id: '258130', sku: '258130', name: 'Canon EOS R5', price: 2649, condition: 'Excellent', image: '/images/canon-r5.jpg', inclVat: false, warrantyMonths: 12 }, // marge product
];

function computeTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, item) => sum + (item.inclVat ? item.price / 1.21 : item.price), 0);
  const vatAmount = items.reduce((sum, item) => sum + (item.inclVat ? item.price - item.price / 1.21 : 0), 0);
  return { subtotal, vatAmount, total: subtotal + vatAmount };
}

/** Bereken BTW-breakdown voor gemixte marge/BTW bestellingen */
function computeVatBreakdown(items: CartItem[]) {
  const vatItems = items.filter(i => i.inclVat);
  const margeItems = items.filter(i => !i.inclVat);
  const vat21Amount = vatItems.reduce((sum, i) => sum + (i.price - i.price / 1.21), 0);
  const vat21Subtotal = vatItems.reduce((sum, i) => sum + i.price / 1.21, 0);
  const margeSubtotal = margeItems.reduce((sum, i) => sum + i.price, 0);
  return {
    hasVat21: vatItems.length > 0,
    hasMarge: margeItems.length > 0,
    isMixed: vatItems.length > 0 && margeItems.length > 0,
    vat21Amount,
    vat21Subtotal,
    margeSubtotal,
  };
}

/* ───────── DEVELOPER NOTES — Analytics & Marketing Events ─────────
 *
 * TODO: Implementeer de volgende tracking events (GA4 / GTM / Meta Pixel):
 *
 * 1. begin_checkout          — bij laden van deze pagina (items, value, currency)
 * 2. add_shipping_info       — bij afronden stap 1 (shipping_tier: postnl/dpd/dhl)
 * 3. add_payment_info        — bij selectie betaalmethode (payment_type: ideal/klarna/etc)
 * 4. purchase                — bij "Bestelling plaatsen" klik (transaction_id, value, items, shipping, tax)
 *
 * Abandoned cart tracking:
 * 5. checkout_step_view      — bij elke stap-wissel (step: 1/2/3) → meet drop-off per stap
 * 6. checkout_abandoned      — bij verlaten pagina (beforeunload) als checkout niet voltooid
 *    → Stuur email/notificatie na X minuten als klant niet terugkeert
 *    → Bewaar cart state in localStorage voor sessie-herstel
 *
 * Express checkout:
 * 7. express_checkout_click  — bij klik op Apple Pay / Google Pay / PayPal (method)
 *
 * Upsell tracking:
 * 8. warranty_selected       — bij selectie garantieverlenging (product, years, value)
 * 9. replacement_selected    — bij selectie vervangend toestel (product, value)
 *
 * Promo tracking:
 * 10. promo_field_opened     — bij klik op "Heb je een kortingscode?" (meet hoe vaak dit gebruikt wordt)
 * 11. promo_applied          — bij succesvolle kortingscode (code, discount_value)
 *
 * ────────────────────────────────────────────────────────────────── */

/* ───────── main component ───────── */
export default function CheckoutPage() {
  const cart = useCart();
  const hasItems = cart.items.length > 0;
  const items: CheckoutItem[] = hasItems ? cart.items : DEMO_ITEMS;
  const { subtotal, vatAmount, total } = hasItems
    ? { subtotal: cart.subtotal, vatAmount: cart.vatAmount, total: cart.total }
    : computeTotals(DEMO_ITEMS);
  const itemCount = items.length;
  const vatBreakdown = computeVatBreakdown(items);

  const [mode, setMode] = useState<'steps' | 'onepage'>('steps');
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  /* step state */
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

  /* validation */
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};
    if (step === 0) {
      if (!email || !email.includes('@')) errs.email = 'Vul een geldig e-mailadres in';
      if (emailSubmitted) {
        if (!firstName.trim()) errs.firstName = 'Verplicht';
        if (!lastName.trim()) errs.lastName = 'Verplicht';
        if (!phone.trim()) errs.phone = 'Verplicht';
        if (!postalCode.trim()) errs.postalCode = 'Verplicht';
        if (!houseNumber.trim()) errs.houseNumber = 'Verplicht';
        if (!street.trim()) errs.street = 'Vul postcode + huisnummer in';
        if (customerType === 'business') {
          if (!companyName.trim()) errs.companyName = 'Verplicht';
          if (!kvkNumber.trim()) errs.kvkNumber = 'Verplicht';
        }
        if (shipOption === 'different') {
          if (!shipAttn.trim()) errs.shipAttn = 'Verplicht';
          if (!shipPostal.trim()) errs.shipPostal = 'Verplicht';
          if (!shipHouseNum.trim()) errs.shipHouseNum = 'Verplicht';
        }
      }
    }
    if (step === 2) {
      if (selectedPayment === 'ideal' && !selectedBank) errs.bank = 'Kies je bank';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const errorBorder = (field: string): React.CSSProperties =>
    errors[field] ? { borderColor: '#ef4444', boxShadow: '0 0 0 3px rgba(239,68,68,.08)' } : {};

  const ErrorMsg = ({ field }: { field: string }) =>
    errors[field] ? <span style={{ fontSize: '.7rem', color: '#ef4444', marginTop: 2 }}>{errors[field]}</span> : null;

  /* shipping */
  const [selectedShipping, setSelectedShipping] = useState('postnl');
  const freeShipping = total >= 100;
  const shippingCost = freeShipping ? 0 : (SHIPPING_OPTIONS.find(s => s.id === selectedShipping)?.price ?? 6.95);

  /* protection — now part of step 2 */
  const [protectionChoices, setProtectionChoices] = useState<Record<number, number>>({});
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

  /* promo — only show when there are active promotions running
   * Set this to true when a campaign is active (e.g. via CMS, env var, or API)
   * When false: no promo field is shown at all — prevents coupon-hunting abandonment */
  const hasActivePromotion = false; // TODO: koppel aan CMS/API voor actieve campagnes
  const [showPromoField, setShowPromoField] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  /* computed */
  const grandTotal = total + shippingCost + protectionTotal;
  const finalTotal = grandTotal - (promoApplied ? 50 : 0);

  /* postcode auto-fill */
  const handlePostcodeChange = useCallback((pc: string, hn: string) => {
    const clean = pc.replace(/\s/g, '');
    if (clean.length >= 6 && hn.length >= 1) {
      setTimeout(() => { setStreet('Keizersgracht'); setCity('Amsterdam'); }, 300);
    }
  }, []);

  /* step navigation */
  const goToStep = (step: number) => {
    const newCompleted = new Set(completedSteps);
    for (let i = 0; i < step; i++) newCompleted.add(i);
    for (let i = step; i < STEPS.length; i++) newCompleted.delete(i);
    setCompletedSteps(newCompleted);
    setCurrentStep(step);
  };

  const editStep = (step: number) => {
    if (completedSteps.has(step) || step === currentStep) goToStep(step);
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) return;
    setErrors({});
    const newCompleted = new Set(completedSteps);
    newCompleted.add(currentStep);
    setCompletedSteps(newCompleted);
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  /* step summaries */
  const getStepSummary = (step: number): string => {
    if (!completedSteps.has(step)) return '';
    switch (step) {
      case 0: return (firstName && lastName) ? `${firstName} ${prefix ? prefix + ' ' : ''}${lastName}${city ? `, ${city}` : ''}` : '';
      case 1: {
        const ship = SHIPPING_OPTIONS.find(s => s.id === selectedShipping)?.name ?? 'PostNL';
        const anyProt = items.some((_, idx) => (protectionChoices[idx] ?? 0) > 0);
        return anyProt ? `${ship} + garantieverlenging` : ship;
      }
      default: return '';
    }
  };

  /* handle email submit */
  const handleEmailSubmit = () => {
    if (!email.includes('@')) return;
    if (email.toLowerCase().trim() === 'bekend@hotmail.com') {
      setIsKnownUser(true);
      setShowLogin(true);
    } else {
      setIsKnownUser(false);
      setShowLogin(false);
      setEmailSubmitted(true);
    }
  };

  const handleLogin = () => {
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
  };

  /* ───────── progress bar ───────── */
  const renderProgressBar = () => (
    <div style={{ background: '#fff', borderBottom: `1px solid ${CSS.border}`, padding: '20px 24px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 0 }}>
        {STEPS.map((label, i) => {
          const isActive = i === currentStep;
          const isCompleted = completedSteps.has(i);
          const isLast = i === STEPS.length - 1;
          return (
            <div key={label} style={{ flex: isLast ? 0 : 1, display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
              <div
                onClick={() => editStep(i)}
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: isCompleted ? CSS.green : isActive ? CSS.accent : CSS.border,
                  color: isCompleted || isActive ? '#fff' : CSS.textMuted,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '.8rem', fontWeight: 700, flexShrink: 0,
                  transition: 'all .3s', cursor: isCompleted ? 'pointer' : 'default',
                }}>
                {isCompleted ? <CheckIcon size={14} stroke="#fff" /> : i + 1}
              </div>
              <span className="progress-label" style={{
                fontSize: '.85rem', fontWeight: isActive ? 700 : 500,
                color: isActive ? CSS.text : isCompleted ? CSS.textSec : CSS.textMuted,
                whiteSpace: 'nowrap', transition: 'color .3s',
              }}>{label}</span>
              {!isLast && (
                <div style={{
                  flex: 1, height: 2, margin: '0 16px',
                  background: isCompleted ? CSS.green : CSS.border,
                  borderRadius: 1, transition: 'background .3s',
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  /* ─── Step 1: Gegevens ─── */
  const renderStep1 = () => (
    <div>
      {/* Email-first */}
      {!emailSubmitted && (
        <>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={labelStyle}>E-mailadres</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  type="email"
                  placeholder="jan@voorbeeld.nl"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleEmailSubmit(); }}
                  onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(232,105,42,.08)'; }}
                  onBlur={e => { (e.target as HTMLInputElement).style.borderColor = CSS.border; (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
                />
                <button style={{ ...btnPrimary, padding: '12px 20px', whiteSpace: 'nowrap' }} onClick={handleEmailSubmit}>Doorgaan &rarr;</button>
              </div>
            </div>
          </div>

          {/* Known user login */}
          {showLogin && !loggedIn && (
            <div style={{ margin: '16px 0', padding: 20, background: '#EEF6FF', border: '1px solid #BFDBFE', borderRadius: CSS.rl }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" fill="none" stroke="#1e40af" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <div>
                  <div style={{ fontSize: '.9rem', fontWeight: 700, color: '#1e40af' }}>Welkom terug!</div>
                  <div style={{ fontSize: '.8rem', color: '#1e40af', opacity: 0.8 }}>Log in om je gegevens automatisch in te vullen.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input style={{ ...inputStyle, flex: 1, borderColor: '#BFDBFE' }} type="password" placeholder="Wachtwoord" value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleLogin(); }}
                  onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }}
                  onBlur={e => { (e.target as HTMLInputElement).style.borderColor = '#BFDBFE'; }}
                />
                <button style={{ ...btnPrimary, padding: '12px 20px' }} onClick={handleLogin}>Inloggen</button>
              </div>
              <button onClick={() => { setShowLogin(false); setEmailSubmitted(true); }}
                style={{ background: 'none', border: 'none', padding: '8px 0 0', fontSize: '.8rem', color: '#1e40af', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>
                Doorgaan zonder inloggen
              </button>
            </div>
          )}

          {/* Express checkout */}
          {!showLogin && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
                <div style={{ flex: 1, height: 1, background: CSS.border }} />
                <span style={{ fontSize: '.75rem', color: CSS.textMuted }}>of snel afrekenen</span>
                <div style={{ flex: 1, height: 1, background: CSS.border }} />
              </div>
              <div className="express-btns" style={{ display: 'flex', gap: 8 }}>
                <button style={{ flex: 1, padding: 12, border: '1.5px solid #000', borderRadius: CSS.r, background: '#000', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit', fontSize: '.8rem', fontWeight: 600 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.36-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.36C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.32-2.11 4.45-3.74 4.25z" fill="#fff" /></svg>
                   Pay
                </button>
                <button style={{ flex: 1, padding: 12, border: '1.5px solid #4285F4', borderRadius: CSS.r, background: '#fff', color: '#4285F4', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit', fontSize: '.8rem', fontWeight: 600 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                  Google Pay
                </button>
                <button style={{ flex: 1, padding: 12, border: '1.5px solid #003087', borderRadius: CSS.r, background: '#003087', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit', fontSize: '.8rem', fontWeight: 600 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797H9.603c-.54 0-.997.39-1.08.919l-1.447 9.087z" fill="#fff" /><path d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.326c-.661 0-1.218.48-1.321 1.132l-1.41 8.927-.399 2.532a.704.704 0 0 0 .695.814h4.881c.578 0 1.069-.42 1.16-.99l.048-.248.919-5.832.059-.32c.09-.572.582-.992 1.16-.992h.73c4.729 0 8.431-1.92 9.513-7.476.452-2.321.218-4.259-1.313-5.642z" fill="#fff" opacity=".7" /></svg>
                  PayPal
                </button>
              </div>
            </>
          )}
        </>
      )}

      {/* After email: address form */}
      {emailSubmitted && (
        <>
          {/* Email display */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '10px 14px', background: CSS.surface, borderRadius: CSS.r, fontSize: '.8rem', color: CSS.textSec }}>
            <MailIcon />
            <span>{email}</span>
            <a href="#" onClick={e => { e.preventDefault(); setEmailSubmitted(false); setShowLogin(false); setLoggedIn(false); setLoginPassword(''); setIsKnownUser(false); }}
              style={{ fontSize: '.75rem', marginLeft: 'auto', color: CSS.accent, textDecoration: 'none' }}>Wijzigen</a>
          </div>

          {loggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '10px 14px', background: CSS.greenLight, border: '1px solid #bbf7d0', borderRadius: CSS.r, fontSize: '.8rem', color: '#166534' }}>
              <CheckIcon size={14} stroke="#166534" strokeWidth={2.5} />
              Welkom terug, {firstName}! Je gegevens zijn automatisch ingevuld.
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '10px 14px', background: '#EEF6FF', border: '1px solid #BFDBFE', borderRadius: CSS.r, fontSize: '.8rem', color: '#1e40af' }}>
              <InfoIcon />
              Na het afronden kun je een account aanmaken.
            </div>
          )}

          {/* Name — 2 columns on mobile instead of 3 */}
          <div className="form-row-name" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={labelStyle}>Voornaam <span style={{ color: '#ef4444' }}>*</span></label>
              <input style={{ ...inputStyle, ...errorBorder('firstName') }} type="text" placeholder="Jan" value={firstName} onChange={e => { setFirstName(e.target.value); setErrors(prev => { const n = {...prev}; delete n.firstName; return n; }); }}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = errors.firstName ? '#ef4444' : CSS.border; }} />
              <ErrorMsg field="firstName" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={labelStyle}>Achternaam <span style={{ color: '#ef4444' }}>*</span></label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input style={{ ...inputStyle, width: 70, flex: '0 0 70px', textAlign: 'center' }} type="text" placeholder="van" value={prefix} onChange={e => setPrefix(e.target.value)}
                  onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }}
                  onBlur={e => { (e.target as HTMLInputElement).style.borderColor = CSS.border; }} />
                <input style={{ ...inputStyle, flex: 1, ...errorBorder('lastName') }} type="text" placeholder="de Vries" value={lastName} onChange={e => { setLastName(e.target.value); setErrors(prev => { const n = {...prev}; delete n.lastName; return n; }); }}
                  onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }}
                  onBlur={e => { (e.target as HTMLInputElement).style.borderColor = errors.lastName ? '#ef4444' : CSS.border; }} />
              </div>
            </div>
          </div>

          {/* Phone + type */}
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={labelStyle}>Telefoonnummer <span style={{ color: '#ef4444' }}>*</span></label>
              <input style={{ ...inputStyle, ...errorBorder('phone') }} type="tel" placeholder="+31 6 12345678" value={phone} onChange={e => { setPhone(e.target.value); setErrors(prev => { const n = {...prev}; delete n.phone; return n; }); }}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = errors.phone ? '#ef4444' : CSS.border; }} />
              <ErrorMsg field="phone" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={labelStyle}>Klanttype <span style={{ color: '#ef4444' }}>*</span></label>
              <select style={selectStyle} value={customerType} onChange={e => setCustomerType(e.target.value as 'private' | 'business')}>
                <option value="private">Particulier</option>
                <option value="business">Zakelijk</option>
              </select>
            </div>
          </div>

          {/* Business fields */}
          {customerType === 'business' && (
            <>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={labelStyle}>Bedrijfsnaam <span style={{ color: '#ef4444' }}>*</span></label>
                  <input style={{ ...inputStyle, ...errorBorder('companyName') }} type="text" placeholder="Bedrijf B.V." value={companyName} onChange={e => { setCompanyName(e.target.value); setErrors(prev => { const n = {...prev}; delete n.companyName; return n; }); }}
                    onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }}
                    onBlur={e => { (e.target as HTMLInputElement).style.borderColor = errors.companyName ? '#ef4444' : CSS.border; }} />
                  <ErrorMsg field="companyName" />
                </div>
              </div>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={labelStyle}>KVK-nummer <span style={{ color: '#ef4444' }}>*</span></label>
                  <input style={{ ...inputStyle, ...errorBorder('kvkNumber') }} type="text" placeholder="12345678" value={kvkNumber} onChange={e => { setKvkNumber(e.target.value); setErrors(prev => { const n = {...prev}; delete n.kvkNumber; return n; }); }}
                    onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }}
                    onBlur={e => { (e.target as HTMLInputElement).style.borderColor = errors.kvkNumber ? '#ef4444' : CSS.border; }} />
                  <ErrorMsg field="kvkNumber" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={labelStyle}>BTW-nummer</label>
                  <input style={inputStyle} type="text" placeholder="NL123456789B01" value={vatNumber} onChange={e => setVatNumber(e.target.value)}
                    onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }}
                    onBlur={e => { (e.target as HTMLInputElement).style.borderColor = CSS.border; }} />
                </div>
              </div>
            </>
          )}

          {/* Billing address */}
          <div style={{ height: 4 }} />
          <p style={{ fontSize: '.85rem', fontWeight: 700, color: CSS.accent, marginBottom: 10 }}>Factuuradres</p>

          <div className="form-row form-row--3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={labelStyle}>Postcode <span style={{ color: '#ef4444' }}>*</span></label>
              <input style={{ ...inputStyle, ...errorBorder('postalCode') }} type="text" placeholder="1234 AB" value={postalCode}
                onChange={e => { setPostalCode(e.target.value); handlePostcodeChange(e.target.value, houseNumber); setErrors(prev => { const n = {...prev}; delete n.postalCode; delete n.street; return n; }); }}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = errors.postalCode ? '#ef4444' : CSS.border; }} />
              <ErrorMsg field="postalCode" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={labelStyle}>Nr. <span style={{ color: '#ef4444' }}>*</span></label>
              <input style={{ ...inputStyle, ...errorBorder('houseNumber') }} type="text" placeholder="12" value={houseNumber}
                onChange={e => { setHouseNumber(e.target.value); handlePostcodeChange(postalCode, e.target.value); setErrors(prev => { const n = {...prev}; delete n.houseNumber; delete n.street; return n; }); }}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = errors.houseNumber ? '#ef4444' : CSS.border; }} />
              <ErrorMsg field="houseNumber" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={labelStyle}>Toev.</label>
              <input style={inputStyle} type="text" placeholder="A" value={suffix} onChange={e => setSuffix(e.target.value)}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = CSS.border; }} />
            </div>
          </div>

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={labelStyle}>Straat <span style={{ color: '#ef4444' }}>*</span></label>
              <input style={{ ...inputStyle, background: CSS.surface }} type="text" placeholder="Automatisch ingevuld" value={street} readOnly />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={labelStyle}>Plaats <span style={{ color: '#ef4444' }}>*</span></label>
              <input style={{ ...inputStyle, background: CSS.surface }} type="text" placeholder="Automatisch ingevuld" value={city} readOnly />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={labelStyle}>Land <span style={{ color: '#ef4444' }}>*</span></label>
              <select style={selectStyle} value={country} onChange={e => setCountry(e.target.value)}>
                <option value="NL">Nederland</option>
                <option value="BE">België</option>
                <option value="DE">Duitsland</option>
              </select>
            </div>
          </div>

          {/* Shipping address */}
          <div style={{ margin: '16px 0 4px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '.85rem', color: CSS.text, marginBottom: 6 }}>
              <input type="radio" name="shipOption" checked={shipOption === 'same'} onChange={() => setShipOption('same')} style={{ width: 18, height: 18, accentColor: CSS.accent }} />
              Verzenden naar dit adres
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '.85rem', color: CSS.text }}>
              <input type="radio" name="shipOption" checked={shipOption === 'different'} onChange={() => setShipOption('different')} style={{ width: 18, height: 18, accentColor: CSS.accent }} />
              Verzenden naar een ander adres
            </label>
          </div>

          {shipOption === 'different' && (
            <div style={{ marginTop: 12 }}>
              <p style={{ fontSize: '.85rem', fontWeight: 700, color: CSS.accent, marginBottom: 10 }}>Verzendadres</p>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={labelStyle}>T.a.v. <span style={{ color: '#ef4444' }}>*</span></label>
                  <input style={inputStyle} type="text" placeholder="Naam ontvanger" value={shipAttn} onChange={e => setShipAttn(e.target.value)} onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }} onBlur={e => { (e.target as HTMLInputElement).style.borderColor = CSS.border; }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={labelStyle}>Bedrijfsnaam</label>
                  <input style={inputStyle} type="text" placeholder="Optioneel" value={shipCompany} onChange={e => setShipCompany(e.target.value)} onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }} onBlur={e => { (e.target as HTMLInputElement).style.borderColor = CSS.border; }} />
                </div>
              </div>
              <div className="form-row form-row--3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={labelStyle}>Postcode <span style={{ color: '#ef4444' }}>*</span></label>
                  <input style={inputStyle} type="text" placeholder="1234 AB" value={shipPostal} onChange={e => setShipPostal(e.target.value)} onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }} onBlur={e => { (e.target as HTMLInputElement).style.borderColor = CSS.border; }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={labelStyle}>Nr. <span style={{ color: '#ef4444' }}>*</span></label>
                  <input style={inputStyle} type="text" placeholder="12" value={shipHouseNum} onChange={e => setShipHouseNum(e.target.value)} onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }} onBlur={e => { (e.target as HTMLInputElement).style.borderColor = CSS.border; }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={labelStyle}>Toev.</label>
                  <input style={inputStyle} type="text" placeholder="A" value={shipSuffix} onChange={e => setShipSuffix(e.target.value)} onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }} onBlur={e => { (e.target as HTMLInputElement).style.borderColor = CSS.border; }} />
                </div>
              </div>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={labelStyle}>Straat <span style={{ color: '#ef4444' }}>*</span></label>
                  <input style={inputStyle} type="text" value={shipStreet} onChange={e => setShipStreet(e.target.value)} onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }} onBlur={e => { (e.target as HTMLInputElement).style.borderColor = CSS.border; }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={labelStyle}>Plaats <span style={{ color: '#ef4444' }}>*</span></label>
                  <input style={inputStyle} type="text" value={shipCity} onChange={e => setShipCity(e.target.value)} onFocus={e => { (e.target as HTMLInputElement).style.borderColor = CSS.accent; }} onBlur={e => { (e.target as HTMLInputElement).style.borderColor = CSS.border; }} />
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={labelStyle}>Land <span style={{ color: '#ef4444' }}>*</span></label>
                  <select style={selectStyle} value={shipCountry} onChange={e => setShipCountry(e.target.value)}>
                    <option value="NL">Nederland</option>
                    <option value="BE">België</option>
                    <option value="DE">Duitsland</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  /* ─── Step 2: Verzending & Garantieverlenging ─── */
  const renderStep2 = () => (
    <div>
      {/* Shipping options */}
      <p style={{ fontSize: '.85rem', fontWeight: 700, color: CSS.text, marginBottom: 4 }}>Verzendmethode</p>
      {freeShipping && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, padding: '8px 12px', background: CSS.greenLight, borderRadius: CSS.r, fontSize: '.78rem', color: '#166534', fontWeight: 600 }}>
          <CircleCheck size={14} stroke="#166534" /> Gratis verzending bij bestellingen vanaf &euro; 100
        </div>
      )}
      {SHIPPING_OPTIONS.map(opt => {
        const isSelected = selectedShipping === opt.id;
        return (
          <div key={opt.id} onClick={() => setSelectedShipping(opt.id)} style={{
            border: `1.5px solid ${isSelected ? CSS.accent : CSS.border}`,
            borderRadius: CSS.r, padding: '14px 16px', display: 'flex', alignItems: 'center',
            gap: 12, cursor: 'pointer', transition: 'all .2s', marginBottom: 8,
            background: isSelected ? CSS.accentLight : 'transparent',
          }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${isSelected ? CSS.accent : CSS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: CSS.accent }} />}
            </div>
            <div style={{ width: 40, height: 40, borderRadius: CSS.r, background: opt.color, color: opt.labelColor ?? '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '.6rem', fontWeight: 800, whiteSpace: 'pre-line', textAlign: 'center' }}>{opt.label}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '.9rem', fontWeight: 600, color: CSS.text }}>{opt.name}</div>
              <div style={{ fontSize: '.75rem', color: CSS.textMuted }}>Geschatte levertijd: {opt.eta}</div>
            </div>
            <div style={{ fontSize: '.95rem', fontWeight: 700, color: freeShipping ? CSS.green : CSS.text }}>
              {freeShipping ? (
                <><span style={{ textDecoration: 'line-through', color: CSS.textMuted, marginRight: 6, fontSize: '.8rem' }}>&euro; {opt.price.toFixed(2).replace('.', ',')}</span>Gratis</>
              ) : (
                <>&euro; {opt.price.toFixed(2).replace('.', ',')}</>
              )}
            </div>
          </div>
        );
      })}

      {/* Warranty extension — integrated in shipping step */}
      <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${CSS.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <ShieldIcon size={16} stroke={CSS.accent} />
          <p style={{ fontSize: '.85rem', fontWeight: 700, color: CSS.text, margin: 0 }}>Garantie</p>
          <span style={{ fontSize: '.7rem', color: CSS.textMuted, fontStyle: 'italic' }}>(verlenging optioneel)</span>
        </div>
        <p style={{ fontSize: '.78rem', color: CSS.textSec, marginBottom: 14, lineHeight: 1.5 }}>
          Elk product wordt geleverd met garantie. Verleng deze optioneel met 1 of 2 jaar. Je kunt ook kiezen voor een vervangend toestel tijdens een eventuele reparatie.
        </p>

        {items.map((item, idx) => {
          const choice = protectionChoices[idx] ?? 0;
          const hasReplacement = replacementChoices[idx] ?? false;
          const itemTotal = getProtectionPrice(item.price, choice) + (hasReplacement ? getReplacementPrice(item.price) : 0);
          const baseWarranty = (item as CheckoutItem).warrantyMonths ?? 12;
          const baseYears = baseWarranty / 12;

          return (
            <div key={item.id} style={{ background: CSS.surface, borderRadius: CSS.r, padding: 14, marginBottom: 8, border: `1px solid ${CSS.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: '.8rem', fontWeight: 600, color: CSS.text }}>{item.name}</span>
                {itemTotal > 0 && <span style={{ fontSize: '.75rem', fontWeight: 600, color: CSS.accent, marginLeft: 'auto' }}>+ &euro; {itemTotal.toLocaleString('nl-NL')}</span>}
              </div>

              {/* Warranty options */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                <button onClick={() => setProtectionChoices(prev => ({ ...prev, [idx]: 0 }))}
                  style={{ flex: 1, padding: '8px 6px', border: `1.5px solid ${choice === 0 ? CSS.green : CSS.border}`, borderRadius: 6, background: choice === 0 ? CSS.greenLight : '#fff', cursor: 'pointer', textAlign: 'center', fontFamily: 'inherit', fontSize: '.72rem', fontWeight: 600, color: choice === 0 ? '#166534' : CSS.textSec }}>
                  Inbegrepen<br /><span style={{ fontWeight: 700 }}>{baseWarranty} mnd</span>
                </button>
                {[1, 2].map(years => {
                  const isActive = choice === years;
                  const price = getProtectionPrice(item.price, years);
                  const totalMonths = baseWarranty + years * 12;
                  return (
                    <button key={years} onClick={() => setProtectionChoices(prev => ({ ...prev, [idx]: isActive ? 0 : years }))}
                      style={{ flex: 1, padding: '8px 6px', border: `1.5px solid ${isActive ? CSS.accent : CSS.border}`, borderRadius: 6, background: isActive ? CSS.accentLight : '#fff', cursor: 'pointer', textAlign: 'center', fontFamily: 'inherit', fontSize: '.72rem', fontWeight: 600, color: isActive ? CSS.accent : CSS.textSec }}>
                      + {years} jaar<br /><span style={{ fontWeight: 700 }}>&euro; {price}</span>
                      <br /><span style={{ fontSize: '.62rem', fontWeight: 400, color: CSS.textMuted }}>{totalMonths} mnd totaal</span>
                    </button>
                  );
                })}
              </div>

              {/* Replacement device */}
              <div
                onClick={() => setReplacementChoices(prev => ({ ...prev, [idx]: !hasReplacement }))}
                style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '.78rem', color: CSS.text, padding: '6px 0' }}>
                <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${hasReplacement ? CSS.accent : CSS.border}`, background: hasReplacement ? CSS.accent : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .2s' }}>
                  {hasReplacement && <CheckIcon size={10} stroke="#fff" strokeWidth={3} />}
                </div>
                <RepeatIcon />
                <span>Vervangend toestel tijdens reparatie</span>
                <span style={{ color: CSS.textMuted }}>&euro; {getReplacementPrice(item.price)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  /* ─── Step 3: Betalen & Bevestigen ─── */
  const renderStep3 = () => {
    const shippingOption = SHIPPING_OPTIONS.find(s => s.id === selectedShipping);
    const paymentMethod = PAYMENT_METHODS.find(m => m.id === selectedPayment);

    const reviewSection: React.CSSProperties = { background: CSS.surface, borderRadius: CSS.r, padding: '14px 16px', marginBottom: 12 };
    const reviewTitle: React.CSSProperties = { fontSize: '.7rem', fontWeight: 700, color: CSS.textMuted, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
    const editLink: React.CSSProperties = { fontSize: '.75rem', fontWeight: 600, color: CSS.accent, cursor: 'pointer', textTransform: 'none', letterSpacing: 0 };

    return (
      <div>
        {/* Order review summary */}
        <div style={reviewSection}>
          <div style={reviewTitle}>
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

        <div style={reviewSection}>
          <div style={reviewTitle}>
            <span>Verzending</span>
            <span style={editLink} onClick={() => goToStep(1)}>Wijzigen</span>
          </div>
          <div style={{ fontSize: '.8rem', color: CSS.text, display: 'flex', justifyContent: 'space-between' }}>
            <span>{shippingOption?.name} &middot; {shippingOption?.eta}</span>
            <span style={{ fontWeight: 600 }}>&euro; {shippingCost.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>

        {/* Payment methods */}
        <p style={{ fontSize: '.85rem', fontWeight: 700, color: CSS.text, marginBottom: 12, marginTop: 20 }}>Betaalmethode</p>
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
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${isSelected ? CSS.accent : CSS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: CSS.accent }} />}
                </div>
                <div style={{ width: 40, height: 28, borderRadius: 4, background: method.id === 'creditcard' ? 'transparent' : method.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', border: `1px solid ${CSS.border}` }}>
                  {method.id === 'creditcard' ? (
                    <svg width="24" height="16" viewBox="0 0 24 16"><rect width="24" height="16" rx="2" fill="#EB001B" /><circle cx="9" cy="8" r="5" fill="#EB001B" /><circle cx="15" cy="8" r="5" fill="#F79E1B" /><path d="M12 4.4a5 5 0 010 7.2 5 5 0 010-7.2z" fill="#FF5F00" /></svg>
                  ) : (
                    <span style={{ color: method.id === 'klarna' ? '#0A0B09' : '#fff', fontSize: method.id === 'ideal' ? 7 : 5, fontWeight: 700 }}>
                      {method.id === 'ideal' ? 'iDEAL' : method.id === 'in3' ? 'in3' : method.id === 'paypal' ? 'PP' : method.id === 'bank' ? 'BANK' : method.id === 'bancontact' ? 'BC' : method.id === 'klarna' ? 'K.' : method.id === 'billink' ? 'BL' : 'Pay'}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '.9rem', fontWeight: 600, color: CSS.text }}>{method.name}</div>
                <div style={{ marginLeft: 'auto', color: CSS.textMuted }}><ChevronRight /></div>
              </div>
              {method.id === 'ideal' && isSelected && (
                <div style={{ marginTop: -4, marginBottom: 8, padding: '12px 16px', background: CSS.surface, borderRadius: CSS.r, border: `1px solid ${CSS.border}` }}>
                  <select style={{ ...selectStyle, width: '100%' }} value={selectedBank} onChange={e => setSelectedBank(e.target.value)}>
                    <option value="">Kies je bank...</option>
                    {IDEAL_BANKS.map(bank => <option key={bank} value={bank}>{bank}</option>)}
                  </select>
                </div>
              )}
            </div>
          );
        })}

        {/* Promo code — only visible when hasActivePromotion is true */}
        {hasActivePromotion && <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${CSS.border}` }}>
          {!showPromoField && !promoApplied ? (
            <button
              onClick={() => setShowPromoField(true)}
              style={{ background: 'none', border: 'none', padding: 0, fontSize: '.78rem', color: CSS.textMuted, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}>
              Heb je een kortingscode?
            </button>
          ) : (
            <div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <TagIcon />
                <input style={{ ...inputStyle, flex: 1, fontSize: '.8rem', padding: '9px 12px' }} type="text" placeholder="Kortingscode" value={promoCode} onChange={e => setPromoCode(e.target.value)} autoFocus={showPromoField && !promoApplied} />
                {promoCode && !promoApplied && (
                  <button onClick={() => setPromoApplied(true)} style={{ background: CSS.dark, color: '#fff', border: 'none', borderRadius: CSS.r, padding: '9px 14px', fontSize: '.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Toepassen</button>
                )}
                {promoApplied && <span style={{ fontSize: '.8rem', fontWeight: 600, color: CSS.green }}>- &euro; 50</span>}
              </div>
              {!promoApplied && (
                <button onClick={() => { setShowPromoField(false); setPromoCode(''); }}
                  style={{ background: 'none', border: 'none', padding: '6px 0 0', fontSize: '.72rem', color: CSS.textMuted, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Annuleren
                </button>
              )}
            </div>
          )}
        </div>}

        {/* Total breakdown */}
        <div style={{ background: '#fff', borderRadius: CSS.rl, border: `1.5px solid ${CSS.dark}`, padding: 18, marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '.8rem' }}>
            <span style={{ color: CSS.textSec }}>Subtotaal excl. BTW</span>
            <span style={{ fontWeight: 600, color: CSS.text }}>&euro; {subtotal.toFixed(2).replace('.', ',')}</span>
          </div>
          {vatBreakdown.hasVat21 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '.8rem' }}>
              <span style={{ color: CSS.textSec }}>BTW 21% <span style={{ fontSize: '.72rem' }}>(over &euro; {vatBreakdown.vat21Subtotal.toFixed(2).replace('.', ',')})</span></span>
              <span style={{ fontWeight: 600, color: CSS.text }}>&euro; {vatBreakdown.vat21Amount.toFixed(2).replace('.', ',')}</span>
            </div>
          )}
          {vatBreakdown.hasMarge && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '.8rem' }}>
              <span style={{ color: CSS.textSec }}>BTW 0% <span style={{ fontSize: '.72rem' }}>(over &euro; {vatBreakdown.margeSubtotal.toFixed(2).replace('.', ',')})</span></span>
              <span style={{ fontWeight: 600, color: CSS.textMuted }}>&euro; 0,00</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '.8rem' }}>
            <span style={{ color: CSS.textSec }}>Verzendkosten</span>
            <span style={{ fontWeight: 600, color: freeShipping ? CSS.green : CSS.text }}>{freeShipping ? 'Gratis' : `€ ${shippingCost.toFixed(2).replace('.', ',')}`}</span>
          </div>
          {protectionTotal > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '.8rem' }}>
              <span style={{ color: CSS.textSec }}>Garantieverlenging</span>
              <span style={{ fontWeight: 600, color: CSS.text }}>&euro; {protectionTotal.toLocaleString('nl-NL')}</span>
            </div>
          )}
          {promoApplied && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '.8rem' }}>
              <span style={{ color: CSS.textSec }}>Korting</span>
              <span style={{ fontWeight: 600, color: CSS.accent }}>- &euro; 50</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: `2px solid ${CSS.dark}` }}>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: CSS.text }}>Totaal</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: CSS.text }}>&euro; {finalTotal.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>

        {/* Trust signals — right above submit */}
        <div className="trust-signals-inline" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', margin: '16px 0', padding: '12px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.75rem', color: CSS.textMuted }}>
            <ShieldIcon stroke={CSS.green} /> Beveiligde verbinding
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.75rem', color: CSS.textMuted }}>
            <CircleCheck stroke={CSS.green} /> 14 dagen retourrecht
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.75rem', color: CSS.textMuted }}>
            <CircleCheck stroke={CSS.green} /> Min. 12 maanden garantie
          </div>
        </div>
      </div>
    );
  };

  /* ─── Payment only (for one-page: no review/totals, those are separate) ─── */
  const renderPaymentOnly = () => (
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
              <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${isSelected ? CSS.accent : CSS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: CSS.accent }} />}
              </div>
              <div style={{ width: 40, height: 28, borderRadius: 4, background: method.id === 'creditcard' ? 'transparent' : method.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', border: `1px solid ${CSS.border}` }}>
                {method.id === 'creditcard' ? (
                  <svg width="24" height="16" viewBox="0 0 24 16"><rect width="24" height="16" rx="2" fill="#EB001B" /><circle cx="9" cy="8" r="5" fill="#EB001B" /><circle cx="15" cy="8" r="5" fill="#F79E1B" /><path d="M12 4.4a5 5 0 010 7.2 5 5 0 010-7.2z" fill="#FF5F00" /></svg>
                ) : (
                  <span style={{ color: method.id === 'klarna' ? '#0A0B09' : '#fff', fontSize: method.id === 'ideal' ? 7 : 5, fontWeight: 700 }}>
                    {method.id === 'ideal' ? 'iDEAL' : method.id === 'in3' ? 'in3' : method.id === 'paypal' ? 'PP' : method.id === 'bank' ? 'BANK' : method.id === 'bancontact' ? 'BC' : method.id === 'klarna' ? 'K.' : method.id === 'billink' ? 'BL' : 'Pay'}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '.9rem', fontWeight: 600, color: CSS.text }}>{method.name}</div>
              <div style={{ marginLeft: 'auto', color: CSS.textMuted }}><ChevronRight /></div>
            </div>
            {method.id === 'ideal' && isSelected && (
              <div style={{ marginTop: -4, marginBottom: 8, padding: '12px 16px', background: CSS.surface, borderRadius: CSS.r, border: `1px solid ${CSS.border}` }}>
                <select style={{ ...selectStyle, width: '100%' }} value={selectedBank} onChange={e => setSelectedBank(e.target.value)}>
                  <option value="">Kies je bank...</option>
                  {IDEAL_BANKS.map(bank => <option key={bank} value={bank}>{bank}</option>)}
                </select>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  /* ─── One-page section wrapper (always open, no accordion) ─── */
  const renderSection = (number: number, title: string, content: React.ReactNode) => (
    <div style={{
      background: '#fff', borderRadius: CSS.rl,
      border: `1.5px solid ${CSS.border}`,
      marginBottom: 16, overflow: 'hidden',
    }}>
      <div style={{
        padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: `1px solid ${CSS.border}`,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: CSS.accent, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '.75rem', fontWeight: 700, flexShrink: 0,
        }}>{number}</div>
        <div style={{ fontSize: '.95rem', fontWeight: 600, color: CSS.text }}>{title}</div>
      </div>
      <div style={{ padding: '24px 20px' }}>{content}</div>
    </div>
  );

  /* ─── Step card wrapper ─── */
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
        <div onClick={() => editStep(stepIndex)} style={{
          padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12,
          cursor: isCompleted ? 'pointer' : 'default', userSelect: 'none',
          borderBottom: isActive ? `1px solid ${CSS.border}` : 'none',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: isCompleted ? CSS.green : isActive ? CSS.accent : CSS.border,
            color: isCompleted || isActive ? '#fff' : CSS.textMuted,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '.75rem', fontWeight: 700, flexShrink: 0,
          }}>
            {isCompleted ? <CheckIcon size={12} stroke="#fff" /> : stepIndex + 1}
          </div>
          <div style={{ fontSize: '.95rem', fontWeight: 600, color: CSS.text }}>{title}</div>
          {isCompleted && summary && <div style={{ fontSize: '.8rem', color: CSS.textMuted, marginLeft: 'auto' }}>{summary}</div>}
          {isCompleted && <div style={{ fontSize: '.8rem', color: CSS.accent, fontWeight: 600, marginLeft: summary ? 12 : 'auto' }}>Wijzigen</div>}
        </div>

        {isActive && (
          <div style={{ padding: '24px 20px' }}>
            {content}

            {(stepIndex > 0 || emailSubmitted) && (
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                {stepIndex > 0 && <button style={btnSecondary} onClick={prevStep}>&larr; Terug</button>}
                {stepIndex < 2 ? (
                  <button style={{ ...btnPrimary, marginLeft: 'auto' }} onClick={nextStep}>
                    Volgende stap &rarr;
                  </button>
                ) : (
                  <button style={{
                    ...btnPrimary, marginLeft: 'auto', width: '100%',
                    padding: '18px 32px', fontSize: '1.05rem', fontWeight: 700,
                    background: '#16a34a', borderRadius: CSS.rl,
                  }} onClick={() => alert('Bestelling geplaatst! (demo)')}>
                    <LockIcon />
                    Bestelling plaatsen &middot; &euro; {finalTotal.toFixed(2).replace('.', ',')}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  /* ─── Order summary sidebar ─── */
  const renderOrderSummary = () => (
    <div style={{ background: '#fff', borderRadius: CSS.rl, border: `1.5px solid ${CSS.border}`, padding: 20, position: 'sticky', top: 24 }}>
      <div style={{ fontSize: '1rem', fontWeight: 700, color: CSS.text, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        Overzicht <span style={{ fontSize: '.8rem', fontWeight: 500, color: CSS.textMuted }}>({itemCount} artikel{itemCount !== 1 ? 'en' : ''})</span>
      </div>

      {items.map(item => (
        <div key={item.id} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: `1px solid ${CSS.border}` }}>
          <div style={{ width: 48, height: 48, borderRadius: CSS.r, background: CSS.surface, overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={assetPath(item.image)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '.78rem', fontWeight: 600, color: CSS.text, lineHeight: 1.3 }}>{item.name}</div>
            <div style={{ fontSize: '.7rem', color: CSS.textMuted, marginTop: 2 }}>
              {item.condition}
            </div>
          </div>
          <div style={{ fontSize: '.85rem', fontWeight: 700, color: CSS.text, whiteSpace: 'nowrap', alignSelf: 'center' }}>
            &euro; {item.price.toLocaleString('nl-NL')}
          </div>
        </div>
      ))}

      {/* Totals */}
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${CSS.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '.85rem' }}>
          <span style={{ color: CSS.textSec }}>Subtotaal excl. BTW</span>
          <span style={{ fontWeight: 600, color: CSS.text }}>&euro; {subtotal.toFixed(2).replace('.', ',')}</span>
        </div>
        {vatBreakdown.hasVat21 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '.85rem' }}>
            <span style={{ color: CSS.textSec }}>BTW 21% <span style={{ fontSize: '.72rem' }}>(over &euro; {vatBreakdown.vat21Subtotal.toFixed(2).replace('.', ',')})</span></span>
            <span style={{ fontWeight: 600, color: CSS.text }}>&euro; {vatBreakdown.vat21Amount.toFixed(2).replace('.', ',')}</span>
          </div>
        )}
        {vatBreakdown.hasMarge && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '.85rem' }}>
            <span style={{ color: CSS.textSec }}>BTW 0% <span style={{ fontSize: '.72rem' }}>(over &euro; {vatBreakdown.margeSubtotal.toFixed(2).replace('.', ',')})</span></span>
            <span style={{ fontWeight: 600, color: CSS.textMuted }}>&euro; 0,00</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '.85rem' }}>
          <span style={{ color: CSS.textSec }}>Verzendkosten</span>
          <span style={{ fontWeight: 600, color: freeShipping ? CSS.green : CSS.text }}>{freeShipping ? 'Gratis' : `€ ${shippingCost.toFixed(2).replace('.', ',')}`}</span>
        </div>
        {protectionTotal > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '.85rem' }}>
            <span style={{ color: CSS.textSec }}>Garantieverlenging</span>
            <span style={{ fontWeight: 600, color: CSS.text }}>&euro; {protectionTotal.toLocaleString('nl-NL')}</span>
          </div>
        )}
        {promoApplied && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '.85rem' }}>
            <span style={{ color: CSS.textSec }}>Korting</span>
            <span style={{ fontWeight: 600, color: CSS.accent }}>- &euro; 50</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: `1.5px solid ${CSS.border}`, fontSize: '1rem' }}>
          <span style={{ fontWeight: 700, color: CSS.text }}>Totaal</span>
          <span style={{ fontWeight: 700, color: CSS.text, fontSize: '1.1rem' }}>&euro; {finalTotal.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>

      {/* Trust signals in sidebar */}
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${CSS.border}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.75rem', color: CSS.textMuted }}>
          <ShieldIcon stroke={CSS.green} /> Beveiligde SSL-verbinding
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.75rem', color: CSS.textMuted }}>
          <CircleCheck stroke={CSS.green} /> 14 dagen retourrecht
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.75rem', color: CSS.textMuted }}>
          <CircleCheck stroke={CSS.green} /> Minimaal 12 maanden garantie
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.75rem', color: CSS.textMuted }}>
          <TruckIcon /> Gratis verzending vanaf &euro; 100
        </div>
      </div>

      {/* Trustpilot */}
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${CSS.border}`, display: 'flex', justifyContent: 'center' }}>
        <TrustpilotBadge />
      </div>
    </div>
  );

  /* ───────── MAIN RENDER ───────── */
  return (
    <div style={{ background: CSS.surface, minHeight: '100vh', fontFamily: 'inherit' }}>
      <style>{`
        .mobile-summary-bar{display:none}

        @media(max-width:768px){
          .checkout-layout{grid-template-columns:1fr !important;padding:16px !important}
          .checkout-summary{display:none !important}
          .mobile-summary-bar{display:flex !important}
          .form-row{grid-template-columns:1fr !important}
          .form-row--3{grid-template-columns:1fr 1fr 1fr !important}
          .form-row-name{grid-template-columns:1fr !important}
          .progress-label{font-size:.75rem !important}
          .express-btns{font-size:.7rem !important}
          .express-btns button{padding:10px 8px !important;font-size:.72rem !important}
        }
        @media(max-width:480px){
          .progress-label{display:none !important}
          .secure-label{display:none !important}
          .tp-compact{display:none !important}
          .form-row--3{grid-template-columns:1fr 1fr !important}
        }
      `}</style>

      {/* ─── Top bar ─── */}
      <div style={{ background: '#fff', borderBottom: `1px solid ${CSS.border}`, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: CSS.dark, fontSize: '1.25rem', fontWeight: 700 }}>
            <div style={{ width: 32, height: 32, background: CSS.accent, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CameraIcon />
            </div>
            Camify
          </Link>
          <Link href="/" style={{ fontSize: '.8rem', color: CSS.textMuted, textDecoration: 'none', marginLeft: 16 }}>
            &larr; Terug naar winkel
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="tp-compact"><TrustpilotBadge compact /></span>
          <div className="tp-compact" style={{ width: 1, height: 20, background: CSS.border }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.8rem', color: CSS.textMuted, fontWeight: 500 }}>
            <span style={{ color: CSS.green }}><LockIcon /></span>
            <span className="secure-label">Beveiligd</span>
          </div>
        </div>
      </div>

      {/* Mode toggle */}
      <div style={{
        background: '#fff', borderBottom: `1px solid ${CSS.border}`, padding: '10px 24px',
        display: 'flex', justifyContent: 'center',
      }}>
        <div style={{
          display: 'inline-flex', background: CSS.surface, borderRadius: 50, padding: 3,
          border: `1px solid ${CSS.border}`,
        }}>
          <button onClick={() => setMode('steps')} style={{
            padding: '7px 18px', borderRadius: 50, border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: '.78rem', fontWeight: 600,
            background: mode === 'steps' ? CSS.dark : 'transparent',
            color: mode === 'steps' ? '#fff' : CSS.textSec,
            transition: 'all .2s',
          }}>Stap voor stap</button>
          <button onClick={() => setMode('onepage')} style={{
            padding: '7px 18px', borderRadius: 50, border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: '.78rem', fontWeight: 600,
            background: mode === 'onepage' ? CSS.dark : 'transparent',
            color: mode === 'onepage' ? '#fff' : CSS.textSec,
            transition: 'all .2s',
          }}>Eén pagina</button>
        </div>
      </div>

      {/* Progress bar (step-by-step only) */}
      {mode === 'steps' && renderProgressBar()}

      {/* Mobile order summary toggle */}
      <div className="mobile-summary-bar" style={{ display: 'none', flexDirection: 'column', background: '#fff', borderBottom: `1px solid ${CSS.border}` }}>
        <button onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="18" height="18" fill="none" stroke={CSS.accent} strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
            <span style={{ fontSize: '.85rem', fontWeight: 600, color: CSS.text }}>
              {mobileSummaryOpen ? 'Verberg' : 'Toon'} overzicht ({itemCount} artikel{itemCount !== 1 ? 'en' : ''})
            </span>
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: CSS.text }}>&euro; {finalTotal.toFixed(2).replace('.', ',')}</span>
        </button>
        {mobileSummaryOpen && (
          <div style={{ padding: '0 20px 16px' }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: `1px solid ${CSS.border}`, fontSize: '.8rem' }}>
                <span style={{ flex: 1, fontWeight: 600, color: CSS.text }}>{item.name}</span>
                <span style={{ fontWeight: 700, color: CSS.text }}>&euro; {item.price.toLocaleString('nl-NL')}</span>
              </div>
            ))}
            {/* Mobile trust signals */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12, justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '.7rem', color: CSS.textMuted }}><ShieldIcon size={12} stroke={CSS.green} /> Beveiligd</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '.7rem', color: CSS.textMuted }}><CircleCheck size={12} stroke={CSS.green} /> 14 dagen retour</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '.7rem', color: CSS.textMuted }}><CircleCheck size={12} stroke={CSS.green} /> Min. 12 mnd garantie</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}><TrustpilotBadge compact /></div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="checkout-layout" style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 60px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>
        <div>
          {mode === 'steps' ? (
            <>
              {renderStepCard(0, 'Jouw gegevens', renderStep1())}
              {renderStepCard(1, 'Verzending & garantie', renderStep2())}
              {renderStepCard(2, 'Betalen & bevestigen', renderStep3())}
            </>
          ) : (
            <>
              {renderSection(1, 'Jouw gegevens', renderStep1())}
              {renderSection(2, 'Verzending & garantie', renderStep2())}
              {renderSection(3, 'Betaalmethode', renderPaymentOnly())}

              {/* Totaal + submit — one-page only */}
              <div style={{ background: '#fff', borderRadius: CSS.rl, border: `1.5px solid ${CSS.border}`, padding: 20, marginTop: 8 }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '.85rem' }}>
                    <span style={{ color: CSS.textSec }}>Subtotaal excl. BTW</span>
                    <span style={{ fontWeight: 600, color: CSS.text }}>&euro; {subtotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  {vatBreakdown.hasVat21 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '.85rem' }}>
                      <span style={{ color: CSS.textSec }}>BTW 21% <span style={{ fontSize: '.72rem' }}>(over &euro; {vatBreakdown.vat21Subtotal.toFixed(2).replace('.', ',')})</span></span>
                      <span style={{ fontWeight: 600, color: CSS.text }}>&euro; {vatBreakdown.vat21Amount.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  {vatBreakdown.hasMarge && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '.85rem' }}>
                      <span style={{ color: CSS.textSec }}>BTW 0% <span style={{ fontSize: '.72rem' }}>(over &euro; {vatBreakdown.margeSubtotal.toFixed(2).replace('.', ',')})</span></span>
                      <span style={{ fontWeight: 600, color: CSS.textMuted }}>&euro; 0,00</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '.85rem' }}>
                    <span style={{ color: CSS.textSec }}>Verzendkosten</span>
                    <span style={{ fontWeight: 600, color: freeShipping ? CSS.green : CSS.text }}>{freeShipping ? 'Gratis' : `€ ${shippingCost.toFixed(2).replace('.', ',')}`}</span>
                  </div>
                  {protectionTotal > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '.85rem' }}>
                      <span style={{ color: CSS.textSec }}>Garantieverlenging</span>
                      <span style={{ fontWeight: 600, color: CSS.text }}>&euro; {protectionTotal.toLocaleString('nl-NL')}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: `2px solid ${CSS.dark}` }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: CSS.text }}>Totaal</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 700, color: CSS.text }}>&euro; {finalTotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', margin: '12px 0 16px', padding: '12px 0', borderTop: `1px solid ${CSS.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.75rem', color: CSS.textMuted }}><ShieldIcon stroke={CSS.green} /> Beveiligde verbinding</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.75rem', color: CSS.textMuted }}><CircleCheck stroke={CSS.green} /> 14 dagen retourrecht</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.75rem', color: CSS.textMuted }}><CircleCheck stroke={CSS.green} /> Min. 12 maanden garantie</div>
                </div>
                <button style={{
                  ...btnPrimary, width: '100%',
                  padding: '18px 32px', fontSize: '1.05rem', fontWeight: 700,
                  background: '#16a34a', borderRadius: CSS.rl,
                }} onClick={() => alert('Bestelling geplaatst! (demo)')}>
                  <LockIcon />
                  Bestelling plaatsen &middot; &euro; {finalTotal.toFixed(2).replace('.', ',')}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="checkout-summary">
          {renderOrderSummary()}
        </div>
      </div>

    </div>
  );
}

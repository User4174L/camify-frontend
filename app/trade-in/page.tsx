'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

/* ── Product databases ── */
const SELL_PRODUCTS = [
  { name: 'Sony A7 IV', category: 'camera' },
  { name: 'Sony A7R V', category: 'camera' },
  { name: 'Sony A1', category: 'camera' },
  { name: 'Nikon Z9', category: 'camera' },
  { name: 'Nikon Z8', category: 'camera' },
  { name: 'Nikon Z6 III', category: 'camera' },
  { name: 'Fujifilm X-T5', category: 'camera' },
  { name: 'Canon EOS R5', category: 'camera' },
  { name: 'Canon EOS R6 II', category: 'camera' },
  { name: 'Sony FE 24-70mm f/2.8 GM II', category: 'lens' },
  { name: 'Nikon Z 24-70mm f/2.8 S', category: 'lens' },
  { name: 'Canon RF 24-70mm f/2.8L IS USM', category: 'lens' },
  { name: 'Sony FE 70-200mm f/2.8 GM II', category: 'lens' },
  { name: 'Sony NP-FZ100 Battery', category: 'accessory' },
];

interface BuyVariant {
  id: number;
  sku: string;
  price: number;
  condition: string;
  shutterCount?: number;
  accessories: string[];
}

interface BuyProduct {
  id: string;
  name: string;
  category: string;
  variants: BuyVariant[];
}

const BUY_PRODUCTS: BuyProduct[] = [
  {
    id: 'sony-a7rv', name: 'Sony A7R V', category: 'Sony Systeemcamera\'s',
    variants: [
      { id: 1, sku: '234501', price: 3000, condition: 'Zeer goed', shutterCount: 1200, accessories: ['Body cap', 'Accu', 'Oplader'] },
      { id: 2, sku: '234502', price: 3100, condition: 'Zo goed als nieuw', shutterCount: 450, accessories: ['Body cap', 'Accu', 'Oplader', 'Originele doos'] },
      { id: 3, sku: '234503', price: 3200, condition: 'Als nieuw', shutterCount: 150, accessories: ['Body cap', 'Accu', 'Oplader', 'Originele doos', 'Handleiding'] },
    ],
  },
  {
    id: 'sony-a7iv', name: 'Sony A7 IV', category: 'Sony Systeemcamera\'s',
    variants: [
      { id: 9, sku: '236001', price: 1800, condition: 'Goed', shutterCount: 35000, accessories: ['Body cap', 'Accu'] },
      { id: 10, sku: '236002', price: 1950, condition: 'Zeer goed', shutterCount: 15000, accessories: ['Body cap', 'Accu', 'Oplader'] },
      { id: 11, sku: '236003', price: 2080, condition: 'Als nieuw', shutterCount: 2000, accessories: ['Body cap', 'Accu', 'Oplader', 'Originele doos', 'Handleiding'] },
    ],
  },
  {
    id: 'nikon-z8', name: 'Nikon Z8', category: 'Nikon Systeemcamera\'s',
    variants: [
      { id: 23, sku: '400101', price: 3200, condition: 'Zeer goed', shutterCount: 8500, accessories: ['Body cap', 'Accu', 'Oplader'] },
      { id: 24, sku: '400102', price: 3350, condition: 'Zo goed als nieuw', shutterCount: 3200, accessories: ['Body cap', 'Accu', 'Oplader', 'Originele doos'] },
      { id: 25, sku: '400103', price: 3450, condition: 'Als nieuw', shutterCount: 800, accessories: ['Body cap', 'Accu', 'Oplader', 'Originele doos', 'Handleiding'] },
    ],
  },
  {
    id: 'canon-eos-r5', name: 'Canon EOS R5', category: 'Canon Systeemcamera\'s',
    variants: [
      { id: 26, sku: '500101', price: 2800, condition: 'Goed', shutterCount: 42000, accessories: ['Body cap', 'Accu'] },
      { id: 27, sku: '500102', price: 2950, condition: 'Zeer goed', shutterCount: 25000, accessories: ['Body cap', 'Accu', 'Oplader'] },
      { id: 28, sku: '500103', price: 3100, condition: 'Zo goed als nieuw', shutterCount: 12000, accessories: ['Body cap', 'Accu', 'Oplader', 'Originele doos'] },
    ],
  },
  {
    id: 'sony-fe-24-70', name: 'Sony FE 24-70mm f/2.8 GM II', category: 'Sony Lenzen',
    variants: [
      { id: 17, sku: '300101', price: 1400, condition: 'Goed', accessories: ['Lensdop voor', 'Lensdop achter'] },
      { id: 18, sku: '300102', price: 1480, condition: 'Zeer goed', accessories: ['Lensdop voor', 'Lensdop achter', 'Zonnekap'] },
      { id: 19, sku: '300103', price: 1580, condition: 'Als nieuw', accessories: ['Lensdop voor', 'Lensdop achter', 'Zonnekap', 'Lenstas', 'Originele doos'] },
    ],
  },
];

/* ── Types ── */
interface SellProduct {
  id: number;
  productName: string;
  category: string;
  condition: string;
  shutterCount: string;
  glassCondition: string;
  dust: string;
}

interface SelectedBuyProduct extends BuyVariant {
  name: string;
  category: string;
  productId: string;
}

/* ── Condition badge colors ── */
function conditionBadgeStyle(condition: string): React.CSSProperties {
  switch (condition) {
    case 'Als nieuw': return { background: '#FFF0E8', color: '#D15A20' };
    case 'Zo goed als nieuw': return { background: '#FFF0E8', color: '#E8692A' };
    case 'Zeer goed': return { background: '#F8F8FA', color: '#3D4263' };
    default: return { background: '#EEEEF2', color: '#6B6D80' };
  }
}

/* ── Shared styles ── */
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 16px', border: '1.5px solid #EEEEF2', borderRadius: 8,
  fontSize: 14, fontFamily: 'inherit', outline: 'none', background: '#fff',
  boxSizing: 'border-box',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none' as const,
  WebkitAppearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236B6D80' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 16px center',
  paddingRight: '40px',
};

const btnPrimary: React.CSSProperties = {
  background: '#E8692A', color: '#fff', border: 'none', borderRadius: 999,
  padding: '12px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  display: 'inline-flex', alignItems: 'center', gap: 8,
};

const btnSecondary: React.CSSProperties = {
  background: '#F8F8FA', color: '#1E2133', border: '1px solid #EEEEF2', borderRadius: 999,
  padding: '12px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  display: 'inline-flex', alignItems: 'center', gap: 8,
};

const btnBlack: React.CSSProperties = {
  ...btnPrimary, background: '#1E2133',
};

/* ── Icon components ── */
const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const IconButton = ({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      background: 'none', border: 'none', cursor: 'pointer',
      width: 32, height: 32, borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#9ca3af', transition: 'all 0.2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#E8692A'; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#9ca3af'; }}
  >
    {children}
  </button>
);

/* ── Main Component ── */
export default function TradeInPage() {
  /* Step state: 1=Verkopen, 2=Kopen, 3=Contact, 4=Summary */
  const [activeStep, setActiveStep] = useState(1);
  const [highestStep, setHighestStep] = useState(1);

  /* Step 1: Sell */
  const [sellProducts, setSellProducts] = useState<SellProduct[]>([]);
  const [sellSearch, setSellSearch] = useState('');
  const [sellResults, setSellResults] = useState<typeof SELL_PRODUCTS>([]);
  const [wizardQuestion, setWizardQuestion] = useState<'search' | 'condition' | 'shutter' | 'lens-glass' | 'lens-dust'>('search');
  const [tempProduct, setTempProduct] = useState({ productName: '', category: '', condition: '', shutterCount: '', glassCondition: '', dust: '' });
  const [exactShutter, setExactShutter] = useState('');
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);

  /* Step 1: Manual entry modal */
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualStep, setManualStep] = useState(1);
  const [manualCategory, setManualCategory] = useState('');
  const [manualName, setManualName] = useState('');

  /* Step 1: Help modals */
  const [showHelpCondition, setShowHelpCondition] = useState(false);
  const [showHelpShutter, setShowHelpShutter] = useState(false);

  /* Step 2: Buy */
  const [buyWantsTo, setBuyWantsTo] = useState<boolean | null>(null);
  const [buySearch, setBuySearch] = useState('');
  const [buyResults, setBuyResults] = useState<BuyProduct[]>([]);
  const [selectedBuyProducts, setSelectedBuyProducts] = useState<SelectedBuyProduct[]>([]);
  const [variantModal, setVariantModal] = useState<BuyProduct | null>(null);

  /* Step 3: Contact */
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isBusiness, setIsBusiness] = useState(false);
  const [businessCountry, setBusinessCountry] = useState('NL');

  /* Step 4: Submitted */
  const [submitted, setSubmitted] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const wizardRef = useRef<HTMLDivElement>(null);

  /* ── Navigation helpers ── */
  const goToStep = useCallback((step: number) => {
    if (step > highestStep) return;
    setActiveStep(step);
  }, [highestStep]);

  const advanceStep = useCallback((next: number) => {
    setActiveStep(next);
    setHighestStep(h => Math.max(h, next));
  }, []);

  /* ── Scroll to wizard ── */
  const scrollToWizard = () => {
    wizardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* ── Sell search ── */
  const handleSellSearch = (val: string) => {
    setSellSearch(val);
    if (val.length === 0) { setSellResults([]); return; }
    setSellResults(SELL_PRODUCTS.filter(p => p.name.toLowerCase().includes(val.toLowerCase())));
  };

  const selectSellProduct = (name: string, category: string) => {
    setTempProduct({ productName: name, category, condition: '', shutterCount: '', glassCondition: '', dust: '' });
    setSellSearch('');
    setSellResults([]);
    setWizardQuestion('condition');
    setBreadcrumbs([name, 'Conditie']);
  };

  const selectCondition = (condition: string) => {
    const updated = { ...tempProduct, condition };
    setTempProduct(updated);
    if (updated.category === 'camera') {
      setWizardQuestion('shutter');
      setBreadcrumbs([updated.productName, 'Shuttercount']);
    } else if (updated.category === 'lens') {
      setWizardQuestion('lens-glass');
      setBreadcrumbs([updated.productName, 'Glas conditie']);
    } else {
      finishSellProduct(updated);
    }
  };

  const selectShutter = (range: string) => {
    const updated = { ...tempProduct, shutterCount: range };
    finishSellProduct(updated);
  };

  const submitExactShutter = () => {
    if (!exactShutter || Number(exactShutter) <= 0) return;
    const updated = { ...tempProduct, shutterCount: exactShutter };
    setExactShutter('');
    finishSellProduct(updated);
  };

  const selectGlass = (glass: string) => {
    const updated = { ...tempProduct, glassCondition: glass };
    setTempProduct(updated);
    setWizardQuestion('lens-dust');
    setBreadcrumbs([updated.productName, 'Stof']);
  };

  const selectDust = (dust: string) => {
    const updated = { ...tempProduct, dust };
    finishSellProduct(updated);
  };

  const finishSellProduct = (product: typeof tempProduct) => {
    setSellProducts(prev => [...prev, { ...product, id: Date.now() }]);
    setTempProduct({ productName: '', category: '', condition: '', shutterCount: '', glassCondition: '', dust: '' });
    setWizardQuestion('search');
    setBreadcrumbs([]);
  };

  const removeSellProduct = (id: number) => {
    setSellProducts(prev => prev.filter(p => p.id !== id));
  };

  const editSellProduct = (id: number) => {
    const product = sellProducts.find(p => p.id === id);
    if (!product) return;
    setTempProduct({ productName: product.productName, category: product.category, condition: product.condition, shutterCount: product.shutterCount, glassCondition: product.glassCondition, dust: product.dust });
    setSellProducts(prev => prev.filter(p => p.id !== id));
    setWizardQuestion('condition');
    setBreadcrumbs([product.productName, 'Conditie']);
  };

  /* ── Manual entry ── */
  const openManualEntry = () => {
    setManualStep(1);
    setManualCategory('');
    setManualName('');
    setShowManualModal(true);
    setSellSearch('');
    setSellResults([]);
  };

  const submitManualEntry = () => {
    if (!manualName.trim()) return;
    setShowManualModal(false);
    selectSellProduct(manualName.trim(), manualCategory);
  };

  /* ── Buy search ── */
  const handleBuySearch = (val: string) => {
    setBuySearch(val);
    if (val.length === 0) { setBuyResults([]); return; }
    setBuyResults(BUY_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(val.toLowerCase()) ||
      p.category.toLowerCase().includes(val.toLowerCase()) ||
      p.variants.some(v => v.sku.includes(val))
    ));
  };

  const selectBuyVariant = (product: BuyProduct, variant: BuyVariant) => {
    const existing = selectedBuyProducts.find(p => p.id === variant.id);
    if (existing) {
      setSelectedBuyProducts(prev => prev.filter(p => p.id !== variant.id));
      return;
    }
    setSelectedBuyProducts(prev => [...prev, { ...variant, name: product.name, category: product.category, productId: product.id }]);
    setVariantModal(null);
    setBuySearch('');
    setBuyResults([]);
  };

  const removeBuyProduct = (id: number) => {
    setSelectedBuyProducts(prev => prev.filter(p => p.id !== id));
  };

  /* ── Contact validation ── */
  const validateAndShowSummary = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      alert('Vul alle verplichte velden in');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      alert('Vul een geldig e-mailadres in');
      return;
    }
    advanceStep(4);
  };

  /* ── Progress for sell step ── */
  const sellProgress = wizardQuestion === 'search' ? 0 : wizardQuestion === 'condition' ? 25 : wizardQuestion === 'shutter' ? 75 : wizardQuestion === 'lens-glass' ? 50 : 75;

  /* ── EU countries for business ── */
  const countries = [
    { value: 'NL', label: 'Nederland' }, { value: 'BE', label: 'Belgie' }, { value: 'DE', label: 'Duitsland' },
    { value: 'FR', label: 'Frankrijk' }, { value: 'LU', label: 'Luxemburg' }, { value: 'AT', label: 'Oostenrijk' },
    { value: 'ES', label: 'Spanje' }, { value: 'IT', label: 'Italie' }, { value: 'PT', label: 'Portugal' },
    { value: 'PL', label: 'Polen' }, { value: 'IE', label: 'Ierland' }, { value: 'DK', label: 'Denemarken' },
    { value: 'SE', label: 'Zweden' }, { value: 'FI', label: 'Finland' }, { value: 'CZ', label: 'Tsjechie' },
    { value: 'GR', label: 'Griekenland' }, { value: 'GB', label: 'Verenigd Koninkrijk' }, { value: 'CH', label: 'Zwitserland' },
    { value: 'NO', label: 'Noorwegen' }, { value: 'US', label: 'Verenigde Staten' }, { value: 'NON_EU', label: 'Ander land buiten de EU' },
  ];

  const nonEuCountries = ['GB', 'CH', 'NO', 'US', 'NON_EU'];

  /* ── Step Card component ── */
  const StepCard = ({ num, title, subtitle, children }: { num: number; title: string; subtitle?: string; children: React.ReactNode }) => {
    const isActive = activeStep === num;
    const isCompleted = num < activeStep || (num < highestStep);
    const isDisabled = num > highestStep;

    return (
      <div style={{
        border: isActive ? '1.5px solid #1E2133' : '1.5px solid #EEEEF2',
        borderRadius: 14,
        marginBottom: 10,
        background: '#fff',
        boxShadow: isActive ? '0 2px 16px rgba(45,48,71,.06)' : 'none',
        opacity: isDisabled ? 0.6 : 1,
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div
          onClick={() => !isDisabled && goToStep(num)}
          style={{
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: isDisabled ? 'default' : 'pointer',
            background: isCompleted && !isActive ? '#F8F8FA' : 'transparent',
            borderBottom: isActive ? '1px solid #EEEEF2' : 'none',
          }}
        >
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: isCompleted && !isActive ? '#22c55e' : isActive ? '#E8692A' : '#EEEEF2',
            color: isActive || (isCompleted && !isActive) ? '#fff' : '#6B6D80',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, flexShrink: 0,
          }}>
            {isCompleted && !isActive ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
            ) : num}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1E2133' }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: '#6b7280' }}>{subtitle}</div>}
        </div>

        {/* Content */}
        {isActive && (
          <div style={{ padding: '24px 20px' }}>
            {/* Progress bar */}
            {num === 1 && sellProgress > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ height: 3, background: '#EEEEF2', borderRadius: 2 }}>
                  <div style={{ height: 3, background: '#E8692A', borderRadius: 2, width: `${sellProgress}%`, transition: 'width 0.3s' }} />
                </div>
              </div>
            )}

            {/* Breadcrumbs */}
            {num === 1 && breadcrumbs.length > 0 && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
                {breadcrumbs.map((crumb, i) => (
                  <span key={i}>
                    {i > 0 && <span style={{ color: '#EEEEF2', margin: '0 4px' }}>&rsaquo;</span>}
                    <span style={{
                      padding: '5px 12px', fontSize: 12, borderRadius: 16,
                      background: i === breadcrumbs.length - 1 ? '#E8692A' : '#F8F8FA',
                      color: i === breadcrumbs.length - 1 ? '#fff' : '#6b7280',
                    }}>{crumb}</span>
                  </span>
                ))}
              </div>
            )}

            {children}
          </div>
        )}
      </div>
    );
  };

  /* ── Option card ── */
  const OptionCard = ({ title, description, onClick, horizontal }: { title: string; description?: string; onClick: () => void; horizontal?: boolean }) => (
    <div
      onClick={onClick}
      style={{
        border: '1.5px solid #EEEEF2',
        borderRadius: 14,
        padding: horizontal ? '14px 18px' : 20,
        background: '#fff',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: horizontal ? 'flex' : 'block',
        alignItems: horizontal ? 'center' : undefined,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#E8692A'; e.currentTarget.style.background = '#FFF8F5'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#EEEEF2'; e.currentTarget.style.background = '#fff'; }}
    >
      <div style={{ fontSize: 15, fontWeight: 600, color: '#1E2133', marginBottom: description ? 4 : 0 }}>{title}</div>
      {description && <div style={{ fontSize: 12, color: '#6b7280' }}>{description}</div>}
    </div>
  );

  return (
    <>
      {/* ── Hero Header ── */}
      <section style={{
        background: '#1E2133', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative camera SVG pattern */}
        <svg style={{ position: 'absolute', top: -20, right: -40, opacity: 0.04, width: 400, height: 400 }} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="60" width="140" height="100" rx="16" stroke="white" strokeWidth="3"/>
          <circle cx="100" cy="110" r="30" stroke="white" strokeWidth="3"/>
          <circle cx="100" cy="110" r="18" stroke="white" strokeWidth="2"/>
          <rect x="60" y="45" width="40" height="20" rx="6" stroke="white" strokeWidth="2"/>
          <circle cx="145" cy="78" r="6" stroke="white" strokeWidth="2"/>
          <rect x="38" y="75" width="12" height="8" rx="2" stroke="white" strokeWidth="1.5"/>
        </svg>
        <svg style={{ position: 'absolute', bottom: -30, left: -30, opacity: 0.03, width: 300, height: 300, transform: 'rotate(-15deg)' }} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="60" width="140" height="100" rx="16" stroke="white" strokeWidth="3"/>
          <circle cx="100" cy="110" r="30" stroke="white" strokeWidth="3"/>
          <circle cx="100" cy="110" r="18" stroke="white" strokeWidth="2"/>
          <rect x="60" y="45" width="40" height="20" rx="6" stroke="white" strokeWidth="2"/>
        </svg>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 28px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h1 style={{ color: '#fff', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 8 }}>
            Sell your gear
          </h1>
          <p style={{ color: 'rgba(255,255,255,.55)', fontSize: 14, lineHeight: 1.6, maxWidth: 520, margin: '0 auto 20px' }}>
            Free shipping, expert inspection, payment within 48 hours. Get an instant quote for your camera, lens, or accessories.
          </p>
          <div style={{ display: 'flex', gap: 0, maxWidth: 600, margin: '0 auto' }}>
            {[
              { num: 1, label: 'Get your offer', desc: 'We review & quote\nwithin 2 days.' },
              { num: 2, label: 'Free shipping', desc: 'We send a prepaid\nshipping label.' },
              { num: 3, label: 'Get paid', desc: 'Payout within\n48 hours.' },
            ].map((s, i) => (
              <div key={s.num} style={{ flex: 1, position: 'relative', textAlign: 'center' }}>
                <div style={{
                  width: 46, height: 46, borderRadius: '50%',
                  background: 'rgba(255,255,255,.06)', border: '1.5px solid rgba(255,255,255,.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 10px', fontSize: 16, fontWeight: 700, color: '#E8692A',
                }}>{s.num}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 3 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{s.desc}</div>
                {i < 2 && (
                  <div style={{
                    position: 'absolute', top: 23, left: 'calc(50% + 26px)',
                    width: 'calc(100% - 52px)', height: 1, background: 'rgba(255,255,255,.1)',
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Wizard ── */}
      <div ref={wizardRef} style={{ maxWidth: 1200, padding: '16px 24px 48px', margin: '0 auto' }}>

        {/* Step 1: Verkopen */}
        <StepCard num={1} title="Verkopen">
          {/* ── Search question ── */}
          {wizardQuestion === 'search' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1E2133', textAlign: 'center', marginBottom: 4, letterSpacing: '-0.02em' }}>
                Wat wil je verkopen?
              </h2>
              <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 14, textAlign: 'center' }}>
                Zoek op productnaam of typ handmatig
              </p>

              {/* Added products list */}
              {sellProducts.length > 0 && (
                <div style={{ marginBottom: 32, maxWidth: 900, marginLeft: 'auto', marginRight: 'auto' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Toegevoegde producten
                  </h3>
                  {sellProducts.map(product => (
                    <div key={product.id} style={{
                      border: '1.5px solid #EEEEF2', borderRadius: 14, padding: 16, marginBottom: 8, background: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#1E2133' }}>{product.productName}</span>
                        <span style={{ background: '#dcfce7', color: '#166534', fontSize: 12, borderRadius: 16, padding: '4px 10px', fontWeight: 500 }}>
                          {product.condition}
                        </span>
                        {product.shutterCount && (
                          <span style={{ background: '#F8F8FA', color: '#1E2133', fontSize: 12, borderRadius: 16, padding: '4px 10px' }}>
                            {product.shutterCount}
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <IconButton onClick={() => editSellProduct(product.id)} title="Aanpassen">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => removeSellProduct(product.id)} title="Verwijderen">
                          <TrashIcon />
                        </IconButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Search */}
              <div style={{ maxWidth: 600, margin: '0 auto 20px', position: 'relative' }}>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Zoek op productnaam..."
                  value={sellSearch}
                  onChange={e => handleSellSearch(e.target.value)}
                  autoComplete="off"
                  style={{
                    ...inputStyle, borderRadius: 50, padding: '12px 56px 12px 20px',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#E8692A'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(232,105,42,.08)'; }}
                  onBlur={e => { setTimeout(() => { e.currentTarget.style.borderColor = '#EEEEF2'; e.currentTarget.style.boxShadow = 'none'; }, 200); }}
                />
                <div style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  width: 36, height: 36, background: '#F8F8FA', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="16" height="16" fill="none" stroke="#6B6D80" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                </div>

                {/* Results dropdown */}
                {(sellResults.length > 0 || (sellSearch.length > 0 && sellResults.length === 0)) && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
                    background: '#fff', borderRadius: 14, border: '1.5px solid #EEEEF2',
                    boxShadow: '0 8px 24px rgba(45,48,71,.1)', marginTop: 4, maxHeight: 440, overflowY: 'auto',
                  }}>
                    {sellResults.length > 0 ? (
                      sellResults.map(p => (
                        <div
                          key={p.name}
                          onClick={() => selectSellProduct(p.name, p.category)}
                          style={{ padding: '10px 18px', fontSize: 14, cursor: 'pointer', borderBottom: '1px solid #F8F8FA' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#FFF8F5'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                        >
                          {p.name}
                        </div>
                      ))
                    ) : (
                      <>
                        <p style={{ color: '#6b7280', textAlign: 'center', padding: 16, margin: 0, fontSize: 14 }}>Geen producten gevonden</p>
                        <div
                          onClick={openManualEntry}
                          style={{ padding: '10px 18px', color: '#E8692A', fontWeight: 600, cursor: 'pointer', borderTop: '2px solid #EEEEF2', fontSize: 14 }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#FFF8F5'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                        >
                          Ik kan mijn product niet vinden, handmatig invoeren
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Next button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                <button
                  style={{ ...btnPrimary, opacity: sellProducts.length === 0 ? 0.5 : 1 }}
                  disabled={sellProducts.length === 0}
                  onClick={() => advanceStep(2)}
                >
                  Volgende stap →
                </button>
              </div>
            </div>
          )}

          {/* ── Condition question ── */}
          {wizardQuestion === 'condition' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1E2133', textAlign: 'center', marginBottom: 4 }}>
                Wat is de algehele staat?
              </h2>
              <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 14, textAlign: 'center' }}>
                Selecteer de conditie die het beste past{' '}
                <button onClick={() => setShowHelpCondition(true)} style={{ color: '#E8692A', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
                  Hulp nodig?
                </button>
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 500, margin: '0 auto' }}>
                {['Zo goed als nieuw', 'Zeer goed', 'Goed', 'Gebruikt', 'Zwaar gebruikt'].map(c => (
                  <OptionCard key={c} title={c} onClick={() => selectCondition(c)} horizontal />
                ))}
              </div>
            </div>
          )}

          {/* ── Shutter count question ── */}
          {wizardQuestion === 'shutter' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1E2133', textAlign: 'center', marginBottom: 4 }}>
                Shuttercount (of beste schatting)
              </h2>
              <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 14, textAlign: 'center' }}>
                Selecteer een bereik of vul het exacte aantal in{' '}
                <button onClick={() => setShowHelpShutter(true)} style={{ color: '#E8692A', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
                  Hulp nodig?
                </button>
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, maxWidth: 600, margin: '0 auto' }}>
                {['0 - 1.000', '1.000 - 10.000', '10.000 - 25.000', '25.000 - 50.000', '50.000 - 100.000', '100.000+'].map(r => (
                  <OptionCard key={r} title={r} onClick={() => selectShutter(r)} />
                ))}
              </div>
              <div style={{ maxWidth: 400, margin: '32px auto 0', textAlign: 'center' }}>
                <p style={{ color: '#6b7280', marginBottom: 12, fontSize: 14 }}>Weet je het exacte aantal?</p>
                <input
                  type="number"
                  placeholder="Voer exact shuttercount in..."
                  value={exactShutter}
                  onChange={e => setExactShutter(e.target.value)}
                  min="0"
                  style={{ ...inputStyle, textAlign: 'center' }}
                />
                <button style={{ ...btnPrimary, marginTop: 12, width: '100%', justifyContent: 'center' }} onClick={submitExactShutter}>
                  Bevestigen
                </button>
              </div>
            </div>
          )}

          {/* ── Lens glass question ── */}
          {wizardQuestion === 'lens-glass' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1E2133', textAlign: 'center', marginBottom: 4 }}>
                Hoe ziet het glas eruit?
              </h2>
              <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 14, textAlign: 'center' }}>
                Selecteer de staat van de lenselementen
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, maxWidth: 600, margin: '0 auto' }}>
                <OptionCard title="Geen krasjes" description="Het glas is in perfecte staat" onClick={() => selectGlass('Geen krasjes')} />
                <OptionCard title="Lichte krasjes" description="Kleine, nauwelijks zichtbare krasjes" onClick={() => selectGlass('Lichte krasjes')} />
                <OptionCard title="Duidelijke krasjes" description="Zichtbare krasjes op het glas" onClick={() => selectGlass('Duidelijke krasjes')} />
              </div>
            </div>
          )}

          {/* ── Lens dust question ── */}
          {wizardQuestion === 'lens-dust' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1E2133', textAlign: 'center', marginBottom: 4 }}>
                Zit er stof in de lens?
              </h2>
              <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 14, textAlign: 'center' }}>
                Selecteer de hoeveelheid stof tussen de elementen
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, maxWidth: 600, margin: '0 auto' }}>
                <OptionCard title="Geen stof" description="Volledig stofvrij" onClick={() => selectDust('Geen stof')} />
                <OptionCard title="Licht stof" description="Minimale hoeveelheid stof" onClick={() => selectDust('Licht stof')} />
                <OptionCard title="Veel stof" description="Duidelijk zichtbaar stof" onClick={() => selectDust('Veel stof')} />
              </div>
            </div>
          )}
        </StepCard>

        {/* Step 2: Kopen */}
        <StepCard num={2} title="Kopen" subtitle="(optioneel)">
          {buyWantsTo === null && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1E2133', textAlign: 'center', marginBottom: 4 }}>
                Wil je ook een product aanschaffen?
              </h2>
              <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 14, textAlign: 'center' }}>
                Je kunt producten uit onze voorraad kopen of direct doorgaan
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, maxWidth: 500, margin: '0 auto 24px' }}>
                <OptionCard title="Ja" description="Ik wil een product kopen" onClick={() => setBuyWantsTo(true)} />
                <OptionCard title="Nee" description="Ga door naar volgende stap" onClick={() => { setBuyWantsTo(false); advanceStep(3); }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', maxWidth: 500, margin: '0 auto' }}>
                <button style={btnSecondary} onClick={() => goToStep(1)}>← Vorige</button>
              </div>
            </div>
          )}

          {buyWantsTo === true && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1E2133', textAlign: 'center', marginBottom: 4 }}>
                Wat wil je kopen?
              </h2>
              <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 14, textAlign: 'center' }}>
                Zoek een product uit onze voorraad
              </p>

              {/* Selected buy products */}
              {selectedBuyProducts.length > 0 && (
                <div style={{ marginBottom: 24, maxWidth: 900, marginLeft: 'auto', marginRight: 'auto' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Geselecteerde producten
                  </h3>
                  {selectedBuyProducts.map(product => (
                    <div key={product.id} style={{
                      border: '1.5px solid #EEEEF2', borderLeft: '3px solid #E8692A', borderRadius: 14, padding: 16, marginBottom: 8, background: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#1E2133' }}>{product.name}</div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                          <span style={{ ...conditionBadgeStyle(product.condition), fontSize: 12, borderRadius: 4, padding: '2px 8px', fontWeight: 500 }}>
                            {product.condition}
                          </span>
                          <span style={{ background: '#F8F8FA', color: '#1E2133', fontSize: 12, borderRadius: 4, padding: '2px 8px' }}>
                            {product.sku}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ color: '#1E2133', fontWeight: 700, fontSize: 18 }}>
                          &euro; {Math.round(product.price).toLocaleString('nl-NL')}
                        </span>
                        <IconButton onClick={() => removeBuyProduct(product.id)} title="Verwijderen">
                          <TrashIcon />
                        </IconButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Buy search */}
              <div style={{ maxWidth: 600, margin: '0 auto 20px', position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Zoek op merk, model, SKU..."
                  value={buySearch}
                  onChange={e => handleBuySearch(e.target.value)}
                  autoComplete="off"
                  style={{ ...inputStyle, borderRadius: 50, padding: '12px 56px 12px 20px' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#E8692A'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(232,105,42,.08)'; }}
                  onBlur={e => { setTimeout(() => { e.currentTarget.style.borderColor = '#EEEEF2'; e.currentTarget.style.boxShadow = 'none'; }, 200); }}
                />
                <div style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  width: 36, height: 36, background: '#F8F8FA', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="16" height="16" fill="none" stroke="#6B6D80" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                </div>

                {/* Buy results */}
                {(buyResults.length > 0 || (buySearch.length > 0 && buyResults.length === 0)) && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
                    background: '#fff', borderRadius: 14, border: '1.5px solid #EEEEF2',
                    boxShadow: '0 8px 24px rgba(45,48,71,.1)', marginTop: 4, maxHeight: 400, overflowY: 'auto',
                  }}>
                    {buyResults.length > 0 ? buyResults.map(product => {
                      const prices = product.variants.map(v => v.price);
                      const minPrice = Math.min(...prices);
                      const maxPrice = Math.max(...prices);
                      return (
                        <div
                          key={product.id}
                          onClick={() => setVariantModal(product)}
                          style={{ padding: '16px 20px', cursor: 'pointer', borderBottom: '1px solid #EEEEF2', borderLeft: '4px solid transparent', transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderLeftColor = '#E8692A'; e.currentTarget.style.background = '#fffbf7'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderLeftColor = 'transparent'; e.currentTarget.style.background = 'white'; }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontWeight: 600, marginBottom: 4, color: '#1E2133', fontSize: 14 }}>{product.name}</div>
                              <span style={{ fontSize: 14, color: '#6b7280' }}>{product.category}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Voorraad: {product.variants.length}x</div>
                              <div style={{ fontSize: 18, fontWeight: 600, color: '#1E2133' }}>
                                &euro; {minPrice.toLocaleString('nl-NL')} - &euro; {maxPrice.toLocaleString('nl-NL')}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }) : (
                      <p style={{ color: '#6b7280', textAlign: 'center', padding: 24, margin: 0, fontSize: 14 }}>Geen producten gevonden in onze voorraad</p>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: 700, margin: '24px auto 0' }}>
                <button style={btnSecondary} onClick={() => setBuyWantsTo(null)}>← Vorige</button>
                <button style={btnPrimary} onClick={() => advanceStep(3)}>Volgende stap →</button>
              </div>
            </div>
          )}
        </StepCard>

        {/* Step 3: Contact */}
        <StepCard num={3} title="Persoonlijke gegevens">
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1E2133', textAlign: 'center', marginBottom: 4 }}>
              Contactgegevens
            </h2>
            <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 14, textAlign: 'center' }}>
              Vul je gegevens in zodat we contact kunnen opnemen
            </p>

            <div style={{ maxWidth: 600, margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#1E2133', display: 'block', marginBottom: 6 }}>Voornaam *</label>
                  <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Jan" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#1E2133', display: 'block', marginBottom: 6 }}>Achternaam *</label>
                  <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Jansen" style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#1E2133', display: 'block', marginBottom: 6 }}>E-mailadres *</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jan@voorbeeld.nl" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#1E2133', display: 'block', marginBottom: 6 }}>Telefoonnummer *</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="06 12345678" style={inputStyle} />
                </div>
              </div>

              {/* Business checkbox */}
              <div style={{ marginTop: 32 }}>
                <div
                  onClick={() => setIsBusiness(!isBusiness)}
                  style={{
                    border: '1.5px solid #EEEEF2', borderRadius: 8, padding: '12px 16px', background: '#fff',
                    display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                  }}
                >
                  <input type="checkbox" checked={isBusiness} onChange={e => setIsBusiness(e.target.checked)} onClick={e => e.stopPropagation()}
                    style={{ accentColor: '#E8692A', width: 18, height: 18 }}
                  />
                  <label style={{ fontSize: 14, color: '#1E2133', cursor: 'pointer' }}>Ik verkoop zakelijk</label>
                </div>
              </div>

              {/* Business country */}
              {isBusiness && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ maxWidth: 350 }}>
                    <label style={{ fontWeight: 600, color: '#6b7280', fontSize: 13, display: 'block', marginBottom: 6 }}>Vestigingsland</label>
                    <select value={businessCountry} onChange={e => setBusinessCountry(e.target.value)} style={selectStyle}>
                      {countries.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>

                  <div style={{ marginTop: 16, padding: '16px 20px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                      <div>
                        <p style={{ margin: 0, color: '#1e40af', fontSize: 14, lineHeight: 1.6 }}>
                          Koopt u als bedrijf met een geldig BTW-nummer, dan:
                        </p>
                        <ul style={{ margin: '8px 0 0 16px', padding: 0, color: '#1e40af', fontSize: 14, lineHeight: 1.8 }}>
                          <li><strong>Nederland:</strong> BTW wordt in rekening gebracht</li>
                          <li><strong>Binnen de EU:</strong> BTW wordt verlegd (intracommunautaire levering)</li>
                          <li><strong>Buiten de EU:</strong> 0% BTW (export)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                <button style={btnSecondary} onClick={() => goToStep(2)}>← Vorige</button>
                <button style={btnPrimary} onClick={validateAndShowSummary}>Naar overzicht →</button>
              </div>
            </div>
          </div>
        </StepCard>

        {/* Step 4: Summary */}
        <StepCard num={4} title="Voorlopige offerte">
          {!submitted ? (
            <div style={{ animation: 'fadeIn 0.3s ease', maxWidth: 900, margin: '0 auto' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1E2133', textAlign: 'center', marginBottom: 4 }}>
                Overzicht van je aanvraag
              </h2>
              <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 14, textAlign: 'center' }}>
                Controleer je gegevens voordat je de aanvraag verstuurt
              </p>

              {/* Sell products summary */}
              <div style={{ background: '#fff', border: '1px solid #EEEEF2', borderLeft: '4px solid #E8692A', borderRadius: 8, padding: 16, marginBottom: 10 }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1E2133', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <span style={{ color: '#E8692A' }}>●</span> Te verkopen producten
                </h3>
                {sellProducts.map(product => {
                  let details = `Conditie: ${product.condition}`;
                  if (product.shutterCount) details += ` \u2022 Shuttercount: ${product.shutterCount}`;
                  if (product.glassCondition) details += ` \u2022 Glas: ${product.glassCondition}`;
                  if (product.dust) details += ` \u2022 Stof: ${product.dust}`;
                  return (
                    <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #EEEEF2' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: '#1E2133', fontSize: 14 }}>{product.productName}</div>
                        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{details}</div>
                      </div>
                      <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        Nog geen bod
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Buy products summary */}
              {selectedBuyProducts.length > 0 && (
                <div style={{ background: '#fff', border: '1px solid #EEEEF2', borderLeft: '4px solid #E8692A', borderRadius: 8, padding: 16, marginBottom: 10 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1E2133', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <span style={{ color: '#E8692A' }}>●</span> Te kopen producten
                  </h3>
                  {selectedBuyProducts.map(product => (
                    <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #EEEEF2' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: '#1E2133', fontSize: 14 }}>{product.name}</div>
                        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                          SKU: {product.sku} &bull; {product.condition}
                          {product.shutterCount ? ` \u2022 Shuttercount: ${product.shutterCount.toLocaleString('nl-NL')}` : ''}
                        </div>
                        {product.accessories.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                            {product.accessories.map(acc => (
                              <span key={acc} style={{ background: '#EEEEF2', padding: '2px 8px', borderRadius: 4, fontSize: 12, color: '#6b7280' }}>{acc}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span style={{ color: '#1E2133', fontWeight: 700, fontSize: 18, whiteSpace: 'nowrap' }}>
                        &euro; {Math.round(product.price).toLocaleString('nl-NL')}
                      </span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #EEEEF2', marginTop: 12, paddingTop: 12 }}>
                    <span style={{ fontWeight: 600, color: '#1E2133', fontSize: 14 }}>Totaal te betalen</span>
                    <span style={{ fontWeight: 700, color: '#1E2133', fontSize: 20 }}>
                      &euro; {Math.round(selectedBuyProducts.reduce((sum, p) => sum + p.price, 0)).toLocaleString('nl-NL')}
                    </span>
                  </div>
                </div>
              )}

              {/* Contact summary */}
              <div style={{ background: '#fff', border: '1px solid #EEEEF2', borderLeft: '4px solid #6B6D80', borderRadius: 8, padding: 16, marginBottom: 10 }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1E2133', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <span style={{ color: '#6B6D80' }}>●</span> Contactgegevens
                </h3>
                {[
                  ['Naam', `${firstName} ${lastName}`],
                  ['E-mail', email],
                  ['Telefoon', phone],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #EEEEF2' }}>
                    <span style={{ fontSize: 12, color: '#6b7280' }}>{label}</span>
                    <span style={{ fontSize: 14, color: '#1E2133', fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
                {isBusiness && (
                  <div style={{ borderTop: '1px solid #EEEEF2', marginTop: 12, paddingTop: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                      <span style={{ fontSize: 12, color: '#6b7280' }}>Type</span>
                      <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '4px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 600 }}>Zakelijk</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                      <span style={{ fontSize: 12, color: '#6b7280' }}>Land</span>
                      <span style={{ fontSize: 14, color: '#1E2133', fontWeight: 500 }}>
                        {countries.find(c => c.value === businessCountry)?.label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                      <span style={{ fontSize: 12, color: '#6b7280' }}>BTW</span>
                      <span style={{
                        padding: '4px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 600,
                        ...(businessCountry === 'NL'
                          ? { background: '#fef3c7', color: '#92400e' }
                          : nonEuCountries.includes(businessCountry)
                            ? { background: '#dcfce7', color: '#166534' }
                            : { background: '#dbeafe', color: '#1d4ed8' }),
                      }}>
                        {businessCountry === 'NL' ? 'BTW wordt in rekening gebracht'
                          : nonEuCountries.includes(businessCountry) ? '0% BTW (export)'
                          : 'BTW verlegd (ICL)'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                <button style={btnSecondary} onClick={() => goToStep(3)}>← Vorige</button>
                <button style={btnBlack} onClick={() => setSubmitted(true)}>Offerte aanvragen</button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', animation: 'fadeIn 0.3s ease' }}>
              <div style={{ width: 64, height: 64, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="32" height="32" fill="none" stroke="#166534" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#1E2133' }}>Aanvraag verstuurd!</h2>
              <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24 }}>
                We bekijken je aanvraag en sturen je binnen 2 werkdagen een offerte.
              </p>
              <a href="/" style={{ ...btnPrimary, textDecoration: 'none' }}>Terug naar home</a>
            </div>
          )}
        </StepCard>
      </div>

      {/* ── Trust Strip ── */}
      <section style={{ background: '#1E2133', padding: '36px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, textAlign: 'center' }}>
          {[
            { value: '100.000+', label: 'Producten verwerkt' },
            { value: '48u', label: 'Gemiddelde uitbetaling' },
            { value: '4.9/5', label: 'Klantbeoordeling' },
            { value: '100%', label: 'Verzekerde verzending' },
          ].map((stat, i) => (
            <div key={i}>
              <div style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: '#E8692A', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 6 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works section ── */}
      <section style={{ background: '#F8F8FA', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1E2133', textAlign: 'center', marginBottom: 8, letterSpacing: '-0.02em' }}>
            Hoe het werkt
          </h2>
          <p style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 32, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
            In vier eenvoudige stappen van aanvraag tot uitbetaling
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 20,
          }}>
            {[
              { num: 1, title: 'Ontvang een bod', desc: 'Voer je apparatuur in en ontvang direct een eerlijk bod op basis van de actuele marktwaarde.',
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> },
              { num: 2, title: 'Gratis verzenden', desc: 'Wij sturen je een vooraf betaald en verzekerd verzendlabel. Pak je spullen in en lever ze in bij een PostNL-punt.',
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> },
              { num: 3, title: 'Inspectie door experts', desc: 'Onze technici inspecteren elk item. Is de conditie beter dan verwacht? Dan verhogen wij het bod.',
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg> },
              { num: 4, title: 'Betaling binnen 48u', desc: 'Accepteer het definitieve bod en ontvang betaling binnen 48 uur via bankoverschrijving.',
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 10h20"/><path d="M6 16h4"/><path d="M14 16h4"/></svg> },
            ].map(step => (
              <div key={step.num} style={{
                background: '#fff', borderRadius: 14, padding: 24,
                border: '1.5px solid #EEEEF2',
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(45,48,71,.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ position: 'relative', width: 52, height: 52, marginBottom: 14 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%', background: '#E8692A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {step.icon}
                  </div>
                  <div style={{
                    position: 'absolute', top: -4, left: -4,
                    width: 20, height: 20, borderRadius: '50%', background: '#1E2133',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700, border: '2px solid #fff',
                  }}>{step.num}</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1E2133', marginBottom: 6 }}>{step.title}</div>
                <div style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why sell with Camify section ── */}
      <section style={{ background: '#fff', padding: '48px 24px', borderTop: '1px solid #EEEEF2' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1E2133', textAlign: 'center', marginBottom: 8, letterSpacing: '-0.02em' }}>
            Waarom verkopen bij Camify?
          </h2>
          <p style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 32, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
            Wij maken het verkopen van je camera-apparatuur zo eenvoudig en voordelig mogelijk
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
          }}>
            {[
              { num: 1, title: 'Beste waarde garantie', desc: 'Concurrerende prijzen op basis van realtime marktdata van meer dan 10 Europese platformen.',
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8692A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> },
              { num: 2, title: 'Betaling binnen 48 uur', desc: 'Snelle en betrouwbare betaling via bankoverschrijving, altijd binnen 48 uur na acceptatie.',
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8692A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
              { num: 3, title: 'Zonder gedoe', desc: 'Geen wachten op kopers, geen onderhandelen. Wij regelen alles van verzending tot betaling.',
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8692A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
              { num: 4, title: 'Eerlijkheidsbonus', desc: 'Is je apparatuur in betere staat dan je hebt aangegeven? Dan verhogen wij automatisch je uitbetaling.',
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8692A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> },
              { num: 5, title: 'Gratis verzekerde verzending', desc: 'Wij verstrekken een vooraf betaald, volledig verzekerd verzendlabel. Je apparatuur is gedekt van deur tot deur.',
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8692A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
              { num: 6, title: 'Gratis retour', desc: 'Niet tevreden met ons definitieve bod? Wij maken je apparatuur schoon en sturen het gratis terug.',
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8692A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> },
            ].map(item => (
              <div key={item.num} style={{
                border: '1.5px solid #EEEEF2', borderLeft: '4px solid #E8692A', borderRadius: 14, padding: 24, background: '#fff',
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(45,48,71,.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10, background: '#FFF0E8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 14,
                }}>{item.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1E2133', marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA section ── */}
      <section style={{ background: 'linear-gradient(135deg, #1E2133 0%, #2D3352 40%, #E8692A 100%)', padding: '56px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative camera illustration */}
        <svg style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', opacity: 0.08, width: 280, height: 280 }} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="60" width="140" height="100" rx="16" stroke="white" strokeWidth="3"/>
          <circle cx="100" cy="110" r="30" stroke="white" strokeWidth="3"/>
          <circle cx="100" cy="110" r="18" stroke="white" strokeWidth="2"/>
          <circle cx="100" cy="110" r="8" fill="white" fillOpacity="0.3"/>
          <rect x="60" y="45" width="40" height="20" rx="6" stroke="white" strokeWidth="2"/>
          <circle cx="145" cy="78" r="6" stroke="white" strokeWidth="2"/>
          <rect x="38" y="75" width="12" height="8" rx="2" stroke="white" strokeWidth="1.5"/>
          <line x1="55" y1="170" x2="145" y2="170" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <svg style={{ position: 'absolute', left: '3%', bottom: '10%', opacity: 0.05, width: 160, height: 160, transform: 'rotate(15deg)' }} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="60" width="140" height="100" rx="16" stroke="white" strokeWidth="4"/>
          <circle cx="100" cy="110" r="30" stroke="white" strokeWidth="4"/>
          <circle cx="100" cy="110" r="15" stroke="white" strokeWidth="3"/>
        </svg>
        <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, color: '#fff', marginBottom: 10 }}>
            Klaar om te verkopen?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.7)', marginBottom: 28, lineHeight: 1.6 }}>
            Vul het formulier in en ontvang direct een eerlijk bod op je camera, lens of accessoires.
          </p>
          <button
            onClick={scrollToWizard}
            style={{ ...btnPrimary, padding: '14px 36px', fontSize: 15, background: '#fff', color: '#1E2133' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Start met verkopen
          </button>
        </div>
      </section>

      {/* Modals */}

      {/* Variant selection modal */}
      {variantModal && (
        <div
          onClick={() => setVariantModal(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
        >
          <div onClick={e => e.stopPropagation()} style={{
            background: '#fff', borderRadius: 14, width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', padding: 32, position: 'relative',
          }}>
            <button onClick={() => setVariantModal(null)} style={{ position: 'absolute', top: 16, right: 16, background: '#F8F8FA', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B6D80' }}>
              &times;
            </button>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1E2133', marginBottom: 4 }}>{variantModal.name}</h3>
            <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 14 }}>
              {variantModal.category} &bull; {variantModal.variants.length} beschikbaar
            </p>
            {variantModal.variants.map(variant => {
              const isSelected = selectedBuyProducts.some(p => p.id === variant.id);
              return (
                <div
                  key={variant.id}
                  onClick={() => selectBuyVariant(variantModal, variant)}
                  style={{
                    border: `2px solid ${isSelected ? '#E8692A' : '#EEEEF2'}`,
                    borderRadius: 12, padding: 20, marginBottom: 12, cursor: 'pointer',
                    background: isSelected ? 'rgba(232,105,42,.04)' : 'white',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = '#E8692A'; e.currentTarget.style.background = '#fffbf7'; } }}
                  onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = '#EEEEF2'; e.currentTarget.style.background = 'white'; } }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>SKU: {variant.sku}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <span style={{ ...conditionBadgeStyle(variant.condition), display: 'inline-block', padding: '4px 8px', borderRadius: 4, fontSize: 12, fontWeight: 500 }}>
                          {variant.condition}
                        </span>
                        {variant.shutterCount !== undefined && (
                          <span style={{ fontSize: 14, color: '#6b7280' }}>Shuttercount: {variant.shutterCount.toLocaleString('nl-NL')}</span>
                        )}
                      </div>
                      <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 6 }}>Meegeleverde accessoires:</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {variant.accessories.map(acc => (
                          <span key={acc} style={{ background: '#EEEEF2', padding: '4px 8px', borderRadius: 4, fontSize: 12, color: '#6b7280' }}>{acc}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', marginLeft: 16 }}>
                      <div style={{ fontSize: 24, fontWeight: 600, color: '#1E2133' }}>
                        &euro; {Math.round(variant.price).toLocaleString('nl-NL')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Manual entry modal */}
      {showManualModal && (
        <div
          onClick={() => setShowManualModal(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
        >
          <div onClick={e => e.stopPropagation()} style={{
            background: '#fff', borderRadius: 14, width: '100%', maxWidth: 620, padding: 48, position: 'relative',
          }}>
            <button onClick={() => setShowManualModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: '#F8F8FA', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B6D80' }}>
              &times;
            </button>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#1E2133' }}>Product niet gevonden?</h3>

            {manualStep === 1 && (
              <>
                <p style={{ color: '#6b7280', lineHeight: 1.7, marginBottom: 32, fontSize: 14 }}>
                  We zijn altijd op zoek naar nieuwe apparatuur om ons assortiment uit te breiden. Laat ons weten wat je hebt!
                </p>
                <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, textAlign: 'center', color: '#6b7280' }}>Wat is jouw product?</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <OptionCard title="Camera" description="Systeemcamera, DSLR, compact" onClick={() => { setManualCategory('camera'); setManualStep(2); }} horizontal />
                  <OptionCard title="Lens" description="Objectief voor camera" onClick={() => { setManualCategory('lens'); setManualStep(2); }} horizontal />
                  <OptionCard title="Overig" description="Accessoires en andere apparatuur" onClick={() => { setManualCategory('accessory'); setManualStep(2); }} horizontal />
                </div>
              </>
            )}

            {manualStep === 2 && (
              <>
                <p style={{ color: '#6b7280', lineHeight: 1.7, marginBottom: 32, fontSize: 14 }}>
                  Vul de naam van je {manualCategory === 'camera' ? 'camera' : manualCategory === 'lens' ? 'lens' : 'product'} in zodat we je een passend aanbod kunnen doen.
                </p>
                <label style={{ fontWeight: 600, color: '#6b7280', fontSize: 13, display: 'block', marginBottom: 6 }}>Productnaam</label>
                <input
                  type="text"
                  value={manualName}
                  onChange={e => setManualName(e.target.value)}
                  placeholder="bijv. Sony A7 III, Canon RF 50mm f/1.2L"
                  autoFocus
                  style={inputStyle}
                  onKeyDown={e => { if (e.key === 'Enter') submitManualEntry(); }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                  <button style={btnSecondary} onClick={() => setManualStep(1)}>← Vorige</button>
                  <button style={btnPrimary} onClick={submitManualEntry}>Volgende →</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Help modal: Condition */}
      {showHelpCondition && (
        <div
          onClick={() => setShowHelpCondition(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
        >
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 520, padding: 32, position: 'relative' }}>
            <button onClick={() => setShowHelpCondition(false)} style={{ position: 'absolute', top: 16, right: 16, background: '#F8F8FA', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B6D80' }}>
              &times;
            </button>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1E2133', marginBottom: 12 }}>Hulp bij conditiebepaling</h3>
            <p style={{ color: '#6b7280', marginBottom: 16, fontSize: 14 }}>Selecteer de optie die het beste past bij de algehele staat van je product:</p>
            <ul style={{ color: '#1E2133', lineHeight: 2, paddingLeft: 20, fontSize: 14 }}>
              <li><strong>Zo goed als nieuw:</strong> Product is ongebruikt of nauwelijks te onderscheiden van nieuw</li>
              <li><strong>Zeer goed:</strong> Minimale gebruikssporen, uitstekende staat</li>
              <li><strong>Goed:</strong> Normale gebruikssporen, goede staat</li>
              <li><strong>Gebruikt:</strong> Zichtbare sporen maar functioneel</li>
              <li><strong>Zwaar gebruikt:</strong> Duidelijke slijtage, nog steeds functioneel</li>
            </ul>
          </div>
        </div>
      )}

      {/* Help modal: Shutter count */}
      {showHelpShutter && (
        <div
          onClick={() => setShowHelpShutter(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
        >
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 520, padding: 32, position: 'relative' }}>
            <button onClick={() => setShowHelpShutter(false)} style={{ position: 'absolute', top: 16, right: 16, background: '#F8F8FA', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B6D80' }}>
              &times;
            </button>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1E2133', marginBottom: 12 }}>Hulp bij shuttercount</h3>
            <p style={{ color: '#6b7280', marginBottom: 8, fontSize: 14 }}>De shuttercount geeft aan hoeveel foto&apos;s er met de camera zijn gemaakt.</p>
            <p style={{ color: '#1E2133', fontWeight: 600, marginBottom: 8, fontSize: 14 }}>Hoe vind je de shuttercount?</p>
            <ul style={{ color: '#6b7280', lineHeight: 2, paddingLeft: 20, fontSize: 14 }}>
              <li>Upload een recente foto naar camerashuttercount.com</li>
              <li>Bekijk de EXIF-data van een foto</li>
              <li>Gebruik de camera-instellingen (verschilt per merk)</li>
            </ul>
            <p style={{ color: '#6b7280', marginTop: 12, fontSize: 14 }}>
              Als je het exacte aantal niet weet, selecteer dan het bereik dat het beste past bij jouw inschatting.
            </p>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

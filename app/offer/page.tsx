'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check, Truck, Store, X, ChevronDown,
  Camera, ShieldCheck, RotateCcw, BadgeCheck, Lock,
} from 'lucide-react';

/* ───────── design tokens (gelijk aan checkout) ───────── */
const CSS = {
  accent: '#E8692A',
  accentHover: '#D15A20',
  accentLight: '#FFF0E8',
  border: '#EEEEF2',
  surface: '#F8F8FA',
  dark: '#1E2133',
  text: '#1E2133',
  textSec: '#6B6D80',
  textMuted: '#8B8DA8',
  green: '#22c55e',
  greenLight: '#dcfce7',
  r: 8,
  rl: 12,
} as const;

const inputStyle: React.CSSProperties = {
  border: `1.5px solid ${CSS.border}`, borderRadius: CSS.r, padding: '12px 14px',
  fontSize: '.9rem', fontFamily: 'inherit', color: CSS.text, background: '#fff',
  outline: 'none', width: '100%', boxSizing: 'border-box', transition: 'border-color .2s',
};
const selectStyle: React.CSSProperties = {
  ...inputStyle, appearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238B8DA8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
};
const labelStyle: React.CSSProperties = {
  fontSize: '.75rem', fontWeight: 600, color: CSS.text, textTransform: 'uppercase',
  letterSpacing: '.03em', display: 'block', marginBottom: 6,
};
const btnPrimary: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  fontFamily: 'inherit', fontSize: '.9rem', fontWeight: 600, padding: '14px 32px',
  borderRadius: 50, border: 'none', cursor: 'pointer', background: CSS.accent, color: '#fff', transition: 'all .2s',
};
const btnSecondary: React.CSSProperties = {
  ...btnPrimary, background: CSS.surface, color: CSS.text, border: `1px solid ${CSS.border}`,
};

/* ───────── Trustpilot badge (gelijk aan checkout) ───────── */
function TrustpilotBadge({ compact = false }: { compact?: boolean }) {
  const green = '#00B67A';
  const s = compact ? 18 : 22;
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
      <div style={{ display: 'flex', gap: 2 }}>{[1, 2, 3, 4, 5].map(i => <Star key={i} />)}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <svg width={compact ? 14 : 17} height={compact ? 14 : 17} viewBox="0 0 24 24">
          <polygon points="12,2 15.1,8.3 22,9.2 17,14 18.2,21 12,17.7 5.8,21 7,14 2,9.2 8.9,8.3" fill={green} />
        </svg>
        <span style={{ fontWeight: 600, fontSize: compact ? '.7rem' : '.8rem', color: '#191919', letterSpacing: '-0.01em' }}>Trustpilot</span>
      </div>
    </div>
  );
}

/* ───────── mock bod ───────── */
const QUOTE = {
  id: 'QTE000006',
  validUntil: '2026-06-11',
  showroom: { name: 'Showroom Geldermalsen', address: 'Kerkstraat 47 Bis, 4191 AA Geldermalsen' },
};
const SELL_ITEMS = [{ name: 'Nikon 105mm f/1.8 AI', condition: 'Uitstekend', price: 300 }];
const BUY_ITEMS = [{ name: 'Sony 24-105mm f/3.5-4.5 — Sony A', price: 400 }];

const SHOWROOM_TIMES = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
const SHOWROOM_DAYS = ['Donderdag 28 mei', 'Vrijdag 29 mei', 'Maandag 1 juni', 'Dinsdag 2 juni', 'Woensdag 3 juni'];

const SHIPPING_POINTS = [
  { k: 'postnl' as const, label: 'PostNL Servicepoint', desc: 'Lever af bij een PostNL-punt bij jou in de buurt' },
  { k: 'dhl' as const, label: 'DHL Servicepoint', desc: 'Lever af bij een DHL-punt bij jou in de buurt' },
];

const REJECT_REASONS = [
  { k: 'prijs', l: 'Ik vind de geboden prijs te laag' },
  { k: 'beter-aanbod', l: 'Ik heb een beter aanbod van een andere partij' },
  { k: 'zelf', l: 'Ik wil het eerst zelf proberen te verkopen' },
  { k: 'twijfel', l: 'Ik twijfel nog over de verkoop' },
  { k: 'anders', l: 'Anders, namelijk…' },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Is mijn verzending verzekerd?',
    a: 'Ja, volledig verzekerd tegen verlies en beschadiging van je pakket. We kunnen niet zien wat er precies in een pakket zit, dus verstuur exact de apparatuur uit dit bod en bewaar altijd je verzendbewijs. Raakt het pakket onderweg kwijt of beschadigd, dan ben je volledig gedekt.',
  },
  {
    q: 'Hoe snel word ik uitbetaald?',
    a: 'Binnen 2 tot 4 werkdagen nadat we je apparatuur hebben ontvangen en gecontroleerd.',
  },
  {
    q: 'Weet ik zeker dat ik dit bedrag krijg?',
    a: 'Ons bod is gebaseerd op de conditie die je hebt opgegeven. Ontbreken er originele accessoires of wijkt de staat af, dan kan het bedrag veranderen — maar je krijgt altijd eerst bericht van ons voordat er iets gebeurt.',
  },
  {
    q: 'En als ik het niet eens ben met de definitieve prijs?',
    a: 'Geen probleem, je zit nergens aan vast. We sturen je apparatuur dan gratis en verzekerd weer naar je terug.',
  },
  {
    q: 'Hoe verpak ik mijn apparatuur het beste?',
    a: 'Gebruik bij voorkeur het originele doosje, of een stevige doos met voldoende opvulling. Zo komt alles veilig bij ons aan.',
  },
];
const VAT_RATE = 0.21;
const STEPS = ['Overzicht', 'Gegevens', 'Bezorging'] as const;

/* BTW-weergave: particulier = geen btw; zakelijk NL = incl. 21%; zakelijk EU = verlegd (ex) */
type VatMode = 'none' | 'incl' | 'verlegd';
function vatPrice(gross: number, mode: VatMode): { v: number; note?: string } {
  if (mode === 'verlegd') return { v: gross / (1 + VAT_RATE), note: '21% btw verlegd' };
  if (mode === 'incl') return { v: gross, note: 'incl. 21% btw' };
  return { v: gross };
}

const fmtEUR = (n: number) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(n);
const fmtDate = (s: string) => new Date(s).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });

/* nette opvolging per afwijs-reden */
const REJECT_FOLLOWUP: Record<string, { title: string; body: string }> = {
  prijs: {
    title: 'Bedankt voor je feedback',
    body: 'We hebben je reden genoteerd. Bedankt dat je de moeite nam om het aan ons door te geven.',
  },
  'beter-aanbod': {
    title: 'Stuur ons je bod',
    body: 'Stuur je bod naar info@camera-tweedehands.nl, dan kijken we wat we kunnen doen. Een van onze specialisten neemt daarna contact met je op.',
  },
  zelf: {
    title: 'Succes met de verkoop!',
    body: 'Helemaal goed dat je het zelf probeert. Lukt het toch niet of verandert er iets? Vraag dan gerust een nieuw bod aan — we helpen je graag verder.',
  },
  twijfel: {
    title: 'Geen probleem, neem rustig de tijd',
    body: `Je bod blijft geldig t/m ${fmtDate(QUOTE.validUntil)}. Twijfel je later nog steeds of wil je een nieuwe taxatie? Je weet ons te vinden.`,
  },
  anders: {
    title: 'Bedankt voor je feedback!',
    body: 'We hebben je reden genoteerd. Mocht je later toch willen verkopen, vraag gerust een nieuw bod aan — we staan voor je klaar.',
  },
};

/* ───────── Page ───────── */
export default function OfferPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  /* preview: zakelijk btw-verlegd × betalen/ontvangen */
  const [receives, setReceives] = useState(false); // true = klant ontvangt geld (alleen verkoop)

  /* step 1 gegevens */
  const [phone, setPhone] = useState('615894922');
  const [country, setCountry] = useState('Nederland');
  const [postal, setPostal] = useState('');
  const [houseNr, setHouseNr] = useState('');
  const [addition, setAddition] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [kvk, setKvk] = useState('');
  const email = 'a***o@camera-tweedehands.nl';

  /* step 2 bezorging */
  const [delivery, setDelivery] = useState<'shipping' | 'showroom'>('showroom');
  const [shippingPoint, setShippingPoint] = useState<'postnl' | 'dhl'>('postnl');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [apptDay, setApptDay] = useState(SHOWROOM_DAYS[0]);
  const [apptTime, setApptTime] = useState('09:30');
  const [showModal, setShowModal] = useState(false);
  const [modalDay, setModalDay] = useState(apptDay);
  const [modalTime, setModalTime] = useState(apptTime);

  /* step 3 bevestigen */
  const [agree, setAgree] = useState(false);
  const [newsletter, setNewsletter] = useState(true);

  /* afwijzen */
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectNote, setRejectNote] = useState('');
  const [rejectSent, setRejectSent] = useState(false);

  /* berekeningen */
  const sellItems = SELL_ITEMS;
  const buyItems = receives ? [] : BUY_ITEMS; // bij "ontvangen" alleen verkoop
  const sellGross = sellItems.reduce((s, i) => s + i.price, 0);
  const buyGross = buyItems.reduce((s, i) => s + i.price, 0);
  const netGross = buyGross - sellGross; // > 0 klant betaalt, < 0 wij betalen

  const vatMode: VatMode = 'verlegd'; // preview toont zakelijk btw-verlegd
  const exSuffix = vatMode === 'verlegd' ? ' (ex. btw)' : '';
  const netVal = vatPrice(Math.abs(netGross), vatMode).v;
  const netLabel = (netGross >= 0 ? 'Te betalen' : 'Wij betalen jou') + exSuffix;

  /* nav */
  const goTo = (s: number) => setCurrentStep(s);
  const editStep = (s: number) => { if (completed.has(s) || s === currentStep) goTo(s); };
  const next = () => { setCompleted(prev => new Set(prev).add(currentStep)); setCurrentStep(s => Math.min(s + 1, STEPS.length - 1)); };
  const prev = () => setCurrentStep(s => Math.max(0, s - 1));

  const openModal = () => { setModalDay(apptDay); setModalTime(apptTime); setShowModal(true); };
  const confirmModal = () => { setApptDay(modalDay); setApptTime(modalTime); setShowModal(false); };
  const submit = () => setSubmitted(true);

  const stepSummary = (s: number): string => {
    if (!completed.has(s)) return '';
    if (s === 0) return `${netLabel} ${fmtEUR(netVal)}`;
    if (s === 1) return [city || 'Adres', country].filter(Boolean).join(', ');
    if (s === 2) return delivery === 'showroom' ? `Showroom · ${apptDay}, ${apptTime}` : 'Verzenden (gratis)';
    return '';
  };

  /* ───────── success ───────── */
  if (submitted) {
    return (
      <div style={{ background: CSS.surface, minHeight: '100vh' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '56px 20px' }}>
          <div style={{ background: '#fff', borderRadius: CSS.rl, border: `1.5px solid ${CSS.border}`, padding: '48px 28px', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: CSS.greenLight, display: 'grid', placeItems: 'center', margin: '0 auto 20px', color: CSS.green }}>
              <Check size={32} />
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: CSS.text, margin: '0 0 8px' }}>Bedankt, je bod is bevestigd!</h1>
            <p style={{ fontSize: '.9rem', color: CSS.textSec, lineHeight: 1.6, maxWidth: 440, margin: '0 auto 24px' }}>
              Je ontvangt binnen enkele minuten een bevestigingsmail met de vervolgstappen.
              {delivery === 'showroom'
                ? ` We zien je graag op ${apptDay.toLowerCase()} om ${apptTime} in onze ${QUOTE.showroom.name}.`
                : ' Je gratis verzendlabel zit in de bevestigingsmail.'}
            </p>
            <button style={btnPrimary} onClick={() => router.push('/')}>Terug naar home</button>
          </div>
        </div>
      </div>
    );
  }

  /* ───────── progress bar ───────── */
  const renderProgressBar = () => (
    <div style={{ background: '#fff', borderBottom: `1px solid ${CSS.border}`, padding: '20px 24px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center' }}>
        {STEPS.map((label, i) => {
          const isActive = i === currentStep;
          const isDone = completed.has(i);
          const isLast = i === STEPS.length - 1;
          return (
            <div key={label} style={{ flex: isLast ? 0 : 1, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                onClick={() => editStep(i)}
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: isDone ? CSS.green : isActive ? CSS.accent : CSS.border,
                  color: isDone || isActive ? '#fff' : CSS.textMuted,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '.8rem', fontWeight: 700, flexShrink: 0,
                  cursor: isDone ? 'pointer' : 'default', transition: 'all .3s',
                }}
              >
                {isDone ? <Check size={14} /> : i + 1}
              </div>
              <span className="offer-step-label" style={{
                fontSize: '.85rem', fontWeight: isActive ? 700 : 500,
                color: isActive ? CSS.text : isDone ? CSS.textSec : CSS.textMuted, whiteSpace: 'nowrap',
              }}>{label}</span>
              {!isLast && <div style={{ flex: 1, height: 2, margin: '0 16px', background: isDone ? CSS.green : CSS.border, borderRadius: 1, transition: 'background .3s' }} />}
            </div>
          );
        })}
      </div>
    </div>
  );

  /* ───────── step card wrapper (accordion) ───────── */
  const renderStepCard = (idx: number, title: string, content: React.ReactNode) => {
    const isActive = currentStep === idx;
    const isDone = completed.has(idx);
    const summary = stepSummary(idx);
    return (
      <div style={{
        background: '#fff', borderRadius: CSS.rl,
        border: `1.5px solid ${isActive ? CSS.dark : CSS.border}`, marginBottom: 12, overflow: 'hidden',
        boxShadow: isActive ? '0 2px 16px rgba(45,48,71,.06)' : 'none', transition: 'border-color .3s',
      }}>
        <div onClick={() => editStep(idx)} style={{
          padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12,
          cursor: isDone ? 'pointer' : 'default', userSelect: 'none',
          borderBottom: isActive ? `1px solid ${CSS.border}` : 'none',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: isDone ? CSS.green : isActive ? CSS.accent : CSS.border,
            color: isDone || isActive ? '#fff' : CSS.textMuted,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', fontWeight: 700, flexShrink: 0,
          }}>{isDone ? <Check size={12} /> : idx + 1}</div>
          <div style={{ fontSize: '.95rem', fontWeight: 600, color: CSS.text }}>{title}</div>
          {isDone && summary && <div style={{ fontSize: '.8rem', color: CSS.textMuted, marginLeft: 'auto' }}>{summary}</div>}
          {isDone && <div style={{ fontSize: '.8rem', color: CSS.accent, fontWeight: 600, marginLeft: summary ? 12 : 'auto' }}>Wijzigen</div>}
        </div>
        {isActive && <div style={{ padding: '24px 20px' }}>{content}</div>}
      </div>
    );
  };

  /* ───────── stap 2: gegevens ───────── */
  const gegevens = (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.85rem', color: CSS.textSec, marginBottom: 18 }}>
        <Camera size={15} /> {email}
        <span style={{ marginLeft: 'auto', color: CSS.green, fontWeight: 600 }}>Ingelogd</span>
      </div>

      <div className="offer-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div>
          <label style={labelStyle}>Telefoonnummer *</label>
          <div style={{ display: 'flex' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0 12px', border: `1.5px solid ${CSS.border}`, borderRight: 'none', borderRadius: `${CSS.r}px 0 0 ${CSS.r}px`, background: CSS.surface, fontSize: '.9rem' }}>🇳🇱 +31</span>
            <input style={{ ...inputStyle, borderRadius: `0 ${CSS.r}px ${CSS.r}px 0` }} value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Land *</label>
          <select style={selectStyle} value={country} onChange={e => setCountry(e.target.value)}>
            {['Nederland', 'België', 'Duitsland', 'Frankrijk', 'Luxemburg'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div style={{ fontSize: '.85rem', fontWeight: 700, color: CSS.accent, margin: '16px 0 10px' }}>Factuuradres</div>

      <div className="offer-row-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div><label style={labelStyle}>Postcode *</label><input style={inputStyle} placeholder="1234 AB" value={postal} onChange={e => setPostal(e.target.value)} /></div>
        <div><label style={labelStyle}>Huisnr. *</label><input style={inputStyle} placeholder="123" value={houseNr} onChange={e => setHouseNr(e.target.value)} /></div>
        <div><label style={labelStyle}>Toevoeging</label><input style={inputStyle} placeholder="A" value={addition} onChange={e => setAddition(e.target.value)} /></div>
      </div>
      <div style={{ marginBottom: 12 }}><label style={labelStyle}>Straat *</label><input style={inputStyle} placeholder="Straatnaam" value={street} onChange={e => setStreet(e.target.value)} /></div>
      <div style={{ marginBottom: 12 }}><label style={labelStyle}>Plaats *</label><input style={inputStyle} placeholder="Amsterdam" value={city} onChange={e => setCity(e.target.value)} /></div>

      <div className="offer-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 4 }}>
        <div><label style={labelStyle}>KVK-nummer</label><input style={inputStyle} placeholder="12345678" value={kvk} onChange={e => setKvk(e.target.value)} /></div>
        <div><label style={labelStyle}>BTW-nummer</label><div style={{ ...inputStyle, color: CSS.textSec, background: CSS.surface }}>NL2022210311B01</div></div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <button style={btnSecondary} onClick={prev}>← Terug</button>
        <button style={{ ...btnPrimary, marginLeft: 'auto' }} onClick={next}>Naar bezorging →</button>
      </div>
    </>
  );

  /* ───────── stap 3: bezorging ───────── */
  const bezorging = (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: CSS.greenLight, color: '#15803d', borderRadius: CSS.r, padding: '10px 14px', fontSize: '.82rem', fontWeight: 600, marginBottom: 14 }}>
        <Check size={15} /> Gratis verzekerd verzenden of langsbrengen
      </div>

      {[
        { k: 'shipping' as const, Icon: Truck, title: 'Verzenden', desc: 'Stuur je apparatuur gratis verzekerd op' },
        { k: 'showroom' as const, Icon: Store, title: 'Langsbrengen in de showroom', desc: 'Breng je apparatuur persoonlijk langs' },
      ].map(opt => {
        const OIcon = opt.Icon;
        const sel = delivery === opt.k;
        return (
          <button key={opt.k} onClick={() => setDelivery(opt.k)} style={{
            display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left',
            padding: 16, marginBottom: 10, borderRadius: CSS.r, cursor: 'pointer', fontFamily: 'inherit',
            border: sel ? `1.5px solid ${CSS.accent}` : `1.5px solid ${CSS.border}`, background: sel ? CSS.accentLight : '#fff', transition: 'all .15s',
          }}>
            <div style={{ width: 40, height: 40, borderRadius: CSS.r, background: '#fff', display: 'grid', placeItems: 'center', color: sel ? CSS.accent : CSS.textSec, border: `1px solid ${CSS.border}`, flexShrink: 0 }}>
              <OIcon size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '.9rem', fontWeight: 700, color: CSS.text }}>{opt.title}</div>
              <div style={{ fontSize: '.78rem', color: CSS.textSec }}>{opt.desc}</div>
            </div>
            <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, border: sel ? `6px solid ${CSS.accent}` : `2px solid ${CSS.border}`, background: '#fff' }} />
          </button>
        );
      })}

      {delivery === 'shipping' && (
        <div style={{ marginTop: 4, marginBottom: 4 }}>
          <div style={{ ...labelStyle, marginBottom: 8 }}>Kies een afgiftepunt</div>
          {SHIPPING_POINTS.map(p => {
            const sel = shippingPoint === p.k;
            return (
              <button key={p.k} onClick={() => setShippingPoint(p.k)} style={{
                display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left',
                padding: '12px 14px', marginBottom: 8, borderRadius: CSS.r, cursor: 'pointer', fontFamily: 'inherit',
                border: sel ? `1.5px solid ${CSS.accent}` : `1px solid ${CSS.border}`, background: sel ? CSS.accentLight : '#fff', transition: 'all .15s',
              }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, border: sel ? `6px solid ${CSS.accent}` : `2px solid ${CSS.border}`, background: '#fff' }} />
                <div>
                  <div style={{ fontSize: '.86rem', fontWeight: 700, color: CSS.text }}>{p.label}</div>
                  <div style={{ fontSize: '.76rem', color: CSS.textSec }}>{p.desc}</div>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: '.8rem', fontWeight: 600, color: CSS.green }}>Gratis</span>
              </button>
            );
          })}
        </div>
      )}

      {delivery === 'showroom' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, border: `1px solid ${CSS.border}`, borderRadius: CSS.r, marginTop: 4, gap: 12 }}>
          <div>
            <div style={{ fontSize: '.9rem', fontWeight: 700, color: CSS.text }}>{QUOTE.showroom.name}</div>
            <div style={{ fontSize: '.78rem', color: CSS.textSec, marginTop: 2 }}>Afspraak: {apptDay}, {apptTime}</div>
          </div>
          <button style={{ ...btnSecondary, padding: '10px 20px' }} onClick={openModal}>Wijzig</button>
        </div>
      )}

      {/* FAQ */}
      <div style={{ marginTop: 22, paddingTop: 18, borderTop: `1px solid ${CSS.border}` }}>
        <div style={{ fontSize: '.95rem', fontWeight: 700, color: CSS.text, marginBottom: 10 }}>Veelgestelde vragen</div>
        {FAQS.map((f, i) => {
          const open = openFaq === i;
          return (
            <div key={i} style={{ border: `1px solid ${CSS.border}`, borderRadius: CSS.r, marginBottom: 8, overflow: 'hidden' }}>
              <button
                onClick={() => setOpenFaq(open ? null : i)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 14px', background: open ? CSS.surface : '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}
              >
                <span style={{ fontSize: '.85rem', fontWeight: 600, color: CSS.text }}>{f.q}</span>
                <ChevronDown size={16} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s', color: CSS.textSec, flexShrink: 0 }} />
              </button>
              {open && <div style={{ padding: '0 14px 14px', fontSize: '.82rem', color: CSS.textSec, lineHeight: 1.6 }}>{f.a}</div>}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <button style={btnSecondary} onClick={prev}>← Terug</button>
        <button
          style={{ ...btnPrimary, marginLeft: 'auto', background: '#16a34a', padding: '16px 28px', borderRadius: CSS.rl }}
          onClick={submit}
        >
          <Lock size={15} /> Bevestigen
        </button>
      </div>
    </>
  );

  /* ───────── stap 1: overzicht (trustpilot · grote prijs · producten · CTA) ───────── */
  const overzicht = (
    <>
      {/* QTE + geldigheid */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        <div style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '.02em', color: CSS.text }}>{QUOTE.id}</div>
        <div style={{ fontSize: '.78rem', color: CSS.textMuted }}>geldig t/m {fmtDate(QUOTE.validUntil)}</div>
      </div>

      {/* Trustpilot */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
        <TrustpilotBadge />
      </div>

      {/* groot bedrag */}
      <div style={{ background: CSS.accentLight, borderRadius: CSS.rl, padding: '24px', marginBottom: 18, textAlign: 'center' }}>
        <div style={{ fontSize: '.8rem', fontWeight: 600, color: CSS.accentHover, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 4 }}>{netLabel}</div>
        <div style={{ fontSize: '2.8rem', fontWeight: 800, color: CSS.dark, lineHeight: 1.02, letterSpacing: '-0.02em' }}>{fmtEUR(netVal)}</div>
        <div style={{ fontSize: '.72rem', color: CSS.textSec, marginTop: 6 }}>bedragen excl. btw · 21% btw verlegd (reverse charge)</div>
      </div>

      {/* producten */}
      {sellItems.length > 0 && (
        <>
          <div style={{ fontSize: '.72rem', fontWeight: 700, color: CSS.textMuted, textTransform: 'uppercase', letterSpacing: '.05em', margin: '4px 0 6px' }}>Wij kopen van jou</div>
          {sellItems.map((it, i) => {
            const p = vatPrice(it.price, vatMode);
            return <ProductRow key={`s${i}`} name={it.name} condition={it.condition} price={p.v} note={p.note} accent />;
          })}
        </>
      )}
      {buyItems.length > 0 && (
        <>
          <div style={{ fontSize: '.72rem', fontWeight: 700, color: CSS.textMuted, textTransform: 'uppercase', letterSpacing: '.05em', margin: '14px 0 6px' }}>Jij koopt van ons</div>
          {buyItems.map((it, i) => {
            const p = vatPrice(it.price, vatMode);
            return <ProductRow key={`b${i}`} name={it.name} price={p.v} note={p.note} />;
          })}
        </>
      )}

      {/* trust-signalen */}
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${CSS.border}`, display: 'flex', flexWrap: 'wrap', gap: '8px 18px' }}>
        {[
          { Icon: Truck, t: 'Gratis & verzekerd verzenden' },
          { Icon: BadgeCheck, t: 'Uitbetaling binnen 48 uur' },
          { Icon: ShieldCheck, t: 'Taxatie door experts' },
          { Icon: RotateCcw, t: 'Vrijblijvend' },
        ].map(s => {
          const SI = s.Icon;
          return (
            <div key={s.t} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '.76rem', color: CSS.textSec }}>
              <SI size={15} color={CSS.green} /> {s.t}
            </div>
          );
        })}
      </div>

      {/* terms + nieuwsbrief */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '.85rem', color: CSS.text, cursor: 'pointer' }}>
          <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} style={{ width: 18, height: 18, accentColor: CSS.accent }} />
          Ik ga akkoord met de <a href="#" style={{ color: CSS.accent, textDecoration: 'none' }}>voorwaarden</a>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '.85rem', color: CSS.text, cursor: 'pointer' }}>
          <input type="checkbox" checked={newsletter} onChange={e => setNewsletter(e.target.checked)} style={{ width: 18, height: 18, accentColor: CSS.accent }} />
          Schrijf me in voor de nieuwsbrief
        </label>
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 20, flexWrap: 'wrap' }}>
        <button style={{ ...btnSecondary, color: CSS.textSec }} onClick={() => setShowReject(true)}>Afwijzen</button>
        <button
          style={{
            ...btnPrimary, marginLeft: 'auto', flex: '1 1 240px',
            padding: '16px 28px', fontSize: '1rem', borderRadius: CSS.rl,
            background: agree ? CSS.accent : '#f0b48f', cursor: agree ? 'pointer' : 'not-allowed',
          }}
          disabled={!agree}
          onClick={next}
        >
          Bod accepteren →
        </button>
      </div>
    </>
  );

  /* ───────── main render ───────── */
  return (
    <div style={{ background: CSS.surface, minHeight: '100vh', fontFamily: 'inherit' }}>
      <style>{`
        @media (max-width: 560px) {
          .offer-row { grid-template-columns: 1fr !important; }
          .offer-row-3 { grid-template-columns: 1fr 1fr !important; }
          .offer-step-label { display: none !important; }
        }
      `}</style>

      {renderProgressBar()}

      {/* preview-knoppen (design-referentie): zakelijk btw-verlegd */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '20px 24px 0', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: '.72rem', color: CSS.textMuted, marginRight: 'auto' }}>Voorbeeld (zakelijk · btw verlegd)</span>
        {[
          { r: false, l: 'Betalen' },
          { r: true, l: 'Ontvangen' },
        ].map(opt => {
          const sel = receives === opt.r;
          return (
            <button key={opt.l} onClick={() => setReceives(opt.r)} style={{
              padding: '6px 14px', borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit', fontSize: '.72rem', fontWeight: 600,
              border: `1px solid ${sel ? CSS.accent : CSS.border}`,
              background: sel ? CSS.accentLight : '#fff', color: sel ? CSS.accent : CSS.textSec,
            }}>{opt.l}</button>
          );
        })}
      </div>

      {/* één kolom: stappen */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '16px 24px 60px' }}>
        {renderStepCard(0, 'Overzicht', overzicht)}
        {renderStepCard(1, 'Gegevens', gegevens)}
        {renderStepCard(2, 'Bezorging', bezorging)}
      </div>

      {/* showroom modal */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(30,33,51,.55)', zIndex: 1000, display: 'grid', placeItems: 'center', padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 460, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,.25)' }}>
            <div style={{ height: 4, background: CSS.accent, borderRadius: '18px 18px 0 0' }} />
            <div style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: CSS.dark, display: 'grid', placeItems: 'center', color: CSS.accent }}><Camera size={16} /></div>
                  <span style={{ fontSize: '.9rem', fontWeight: 700, color: CSS.text }}>camera-tweedehands.nl</span>
                </div>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: CSS.textSec }}><X size={20} /></button>
              </div>
              <div style={{ background: CSS.accentLight, borderRadius: CSS.r, padding: 14, marginBottom: 18 }}>
                <div style={{ fontSize: '.9rem', fontWeight: 700, color: CSS.text }}>Langsbrengen in de showroom</div>
                <div style={{ fontSize: '.78rem', color: CSS.textSec, marginTop: 2 }}>{QUOTE.showroom.address}</div>
              </div>
              <div style={{ ...labelStyle, marginBottom: 8 }}>Datum</div>
              <div style={{ position: 'relative', marginBottom: 18 }}>
                <select value={modalDay} onChange={e => setModalDay(e.target.value)} style={{ ...selectStyle, backgroundImage: 'none' }}>
                  {SHOWROOM_DAYS.map(d => <option key={d}>{d}</option>)}
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: CSS.textSec }} />
              </div>
              <div style={{ ...labelStyle, marginBottom: 8 }}>Tijd</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 22 }}>
                {SHOWROOM_TIMES.map(t => {
                  const sel = modalTime === t;
                  return (
                    <button key={t} onClick={() => setModalTime(t)} style={{
                      padding: '9px 0', borderRadius: CSS.r, fontSize: '.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                      border: sel ? `1.5px solid ${CSS.accent}` : `1px solid ${CSS.border}`, background: sel ? CSS.accent : '#fff', color: sel ? '#fff' : CSS.text,
                    }}>{t}</button>
                  );
                })}
              </div>
              <button style={{ ...btnPrimary, width: '100%' }} onClick={confirmModal}>Afspraak bevestigen</button>
            </div>
          </div>
        </div>
      )}

      {/* afwijs-modal */}
      {showReject && (
        <div onClick={() => setShowReject(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(30,33,51,.55)', zIndex: 1000, display: 'grid', placeItems: 'center', padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,.25)' }}>
            <div style={{ height: 4, background: CSS.accent, borderRadius: '18px 18px 0 0' }} />
            <div style={{ padding: 24 }}>
              {!rejectSent ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: CSS.text, margin: 0 }}>Bod afwijzen</h3>
                    <button onClick={() => setShowReject(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: CSS.textSec }}><X size={20} /></button>
                  </div>
                  <p style={{ fontSize: '.85rem', color: CSS.textSec, margin: '0 0 16px', lineHeight: 1.55 }}>
                    Jammer dat ons bod (nog) niet bij je past. Mogen we vragen waarom? Zo kunnen we je beter helpen.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {REJECT_REASONS.map(r => {
                      const sel = rejectReason === r.k;
                      return (
                        <button key={r.k} onClick={() => setRejectReason(r.k)} style={{
                          display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
                          padding: '11px 14px', borderRadius: CSS.r, cursor: 'pointer', fontFamily: 'inherit',
                          border: sel ? `1.5px solid ${CSS.accent}` : `1px solid ${CSS.border}`, background: sel ? CSS.accentLight : '#fff',
                        }}>
                          <span style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, border: sel ? `5px solid ${CSS.accent}` : `2px solid ${CSS.border}`, background: '#fff' }} />
                          <span style={{ fontSize: '.86rem', fontWeight: 500, color: CSS.text }}>{r.l}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* follow-up: beter aanbod → vraag het bod door te sturen */}
                  {rejectReason === 'beter-aanbod' && (
                    <div style={{ marginTop: 14, padding: 14, background: CSS.accentLight, borderRadius: CSS.r }}>
                      <div style={{ fontSize: '.85rem', fontWeight: 700, color: CSS.text, marginBottom: 4 }}>Geef ons een kans om mee te bewegen</div>
                      <div style={{ fontSize: '.8rem', color: CSS.textSec, lineHeight: 1.5 }}>
                        Stuur je bod door naar <a href="mailto:info@camera-tweedehands.nl" style={{ color: CSS.accent, fontWeight: 600, textDecoration: 'none' }}>info@camera-tweedehands.nl</a>, dan kijken we wat we kunnen doen. Een van onze specialisten neemt daarna contact met je op.
                      </div>
                    </div>
                  )}

                  {rejectReason === 'anders' && (
                    <div style={{ marginTop: 14 }}>
                      <label style={labelStyle}>Vertel ons kort waarom</label>
                      <textarea style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} placeholder="Jouw reden…" value={rejectNote} onChange={e => setRejectNote(e.target.value)} />
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                    <button style={btnSecondary} onClick={() => setShowReject(false)}>Annuleren</button>
                    <button
                      style={{ ...btnPrimary, marginLeft: 'auto', background: rejectReason ? CSS.accent : '#f0b48f', cursor: rejectReason ? 'pointer' : 'not-allowed' }}
                      disabled={!rejectReason}
                      onClick={() => setRejectSent(true)}
                    >
                      Versturen
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '12px 4px' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: CSS.greenLight, display: 'grid', placeItems: 'center', margin: '0 auto 16px', color: CSS.green }}>
                    <Check size={28} />
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: CSS.text, margin: '0 0 8px' }}>
                    {(REJECT_FOLLOWUP[rejectReason] || REJECT_FOLLOWUP.anders).title}
                  </h3>
                  <p style={{ fontSize: '.85rem', color: CSS.textSec, lineHeight: 1.55, margin: '0 auto 20px', maxWidth: 380 }}>
                    {(REJECT_FOLLOWUP[rejectReason] || REJECT_FOLLOWUP.anders).body}
                  </p>
                  <button style={btnPrimary} onClick={() => router.push('/')}>Terug naar home</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────── product-regel in het bod-blok ───────── */
function ProductRow({ name, condition, price, note, accent }: { name: string; condition?: string; price: number; note?: string; accent?: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px',
      border: `1px solid ${CSS.border}`, borderLeft: `3px solid ${accent ? CSS.accent : CSS.dark}`,
      borderRadius: CSS.r, marginBottom: 8,
    }}>
      <div style={{ width: 44, height: 44, borderRadius: CSS.r, background: CSS.surface, display: 'grid', placeItems: 'center', flexShrink: 0, color: accent ? CSS.accent : CSS.textMuted }}>
        <Camera size={20} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '.9rem', fontWeight: 600, color: CSS.text, lineHeight: 1.3 }}>{name}</div>
        {condition && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <span style={{ fontSize: '.72rem', color: CSS.textMuted }}>Staat:</span>
            <span style={{ fontSize: '.7rem', fontWeight: 600, color: CSS.green, background: CSS.greenLight, padding: '2px 8px', borderRadius: 999 }}>{condition}</span>
          </div>
        )}
      </div>
      <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
        <div style={{ fontSize: '.95rem', fontWeight: 700, color: CSS.text }}>{fmtEUR(price)}</div>
        {note && <div style={{ fontSize: '.68rem', color: CSS.textMuted, marginTop: 1 }}>{note}</div>}
      </div>
    </div>
  );
}

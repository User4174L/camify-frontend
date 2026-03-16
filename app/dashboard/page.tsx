'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/* ------------------------------------------------------------------ */
const ACCENT  = '#E8692A';
const BORDER  = '#EEEEF2';
const SURFACE = '#F8F8FA';
const DARK    = '#1E2133';
const ACCENT_BG = '#FFF0E8';
const GREY    = '#6B7280';
const GREEN   = '#22C55E';
const BLUE    = '#3B82F6';
const RED     = '#EF4444';
const WHITE   = '#FFFFFF';

/* ------------------------------------------------------------------ */
/*  Navigation items                                                   */
/* ------------------------------------------------------------------ */
const NAV_ITEMS: { key: string; label: string; badge?: number }[] = [
  { key: 'overzicht', label: 'Overzicht' },
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'producten', label: 'Producten' },
  { key: 'varianten', label: 'Varianten' },
  { key: 'categories', label: 'Categories' },
  { key: 'orders', label: 'Orders' },
  { key: 'quotes', label: 'Quotes', badge: 2 },
  { key: 'verkoop-rapport', label: 'Verkoop rapport' },
  { key: 'reparaties', label: 'Reparaties' },
  { key: 'kasboek', label: 'Kasboek' },
  { key: 'reserveringen', label: 'Reserveringen' },
  { key: 'klanten', label: 'Klanten' },
  { key: 'incomplete-varianten', label: 'Incomplete varianten' },
  { key: 'accountinstellingen', label: 'Accountinstellingen' },
  { key: 'sandbox', label: 'Sandbox' },
];

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */
const MOCK_PRODUCTS = [
  { name: 'Venus Laowa 9mm T2.9 Zero-D', brand: 'Laowa', multipleStock: false, stock: 1, active: true, hardloper: false },
  { name: 'Z CAM E2-S6 Super 35mm 6K', brand: 'Z CAM', multipleStock: false, stock: 0, active: true, hardloper: false },
  { name: 'Canon EOS R5', brand: 'Canon', multipleStock: true, stock: 4, active: true, hardloper: true },
  { name: 'Nikon Z6 III', brand: 'Nikon', multipleStock: true, stock: 2, active: true, hardloper: false },
  { name: 'Sony A7 IV', brand: 'Sony', multipleStock: true, stock: 3, active: true, hardloper: true },
  { name: 'Fujifilm X-T5', brand: 'Fujifilm', multipleStock: false, stock: 1, active: true, hardloper: true },
  { name: 'Sigma 35mm f/1.4 DG DN Art', brand: 'Sigma', multipleStock: false, stock: 1, active: true, hardloper: false },
  { name: 'Tamron 28-75mm f/2.8 Di III VXD G2', brand: 'Tamron', multipleStock: false, stock: 0, active: false, hardloper: false },
  { name: 'Canon RF 50mm f/1.2L USM', brand: 'Canon', multipleStock: true, stock: 2, active: true, hardloper: false },
  { name: 'Nikon NIKKOR Z 24-70mm f/2.8 S', brand: 'Nikon', multipleStock: false, stock: 1, active: true, hardloper: false },
  { name: 'Sony FE 70-200mm f/2.8 GM OSS II', brand: 'Sony', multipleStock: true, stock: 3, active: true, hardloper: true },
  { name: 'Panasonic Lumix S5 IIX', brand: 'Panasonic', multipleStock: false, stock: 0, active: false, hardloper: false },
  { name: 'Leica Q3', brand: 'Leica', multipleStock: false, stock: 1, active: true, hardloper: false },
  { name: 'Hasselblad X2D 100C', brand: 'Hasselblad', multipleStock: false, stock: 1, active: true, hardloper: false },
  { name: 'Olympus OM-1 Mark II', brand: 'Olympus', multipleStock: false, stock: 0, active: false, hardloper: false },
];

const MOCK_VARIANTS = [
  { title: 'Canon EOS R5 Body', conditie: 'Als nieuw', sku: '21304', status: 'Verkoopbaar', shuttercount: 12450, stock: 1, locatie: 'C-L-3', inkoopprijs: 1850, verkoopprijs: 2199, btw: 'Marge', inkoopdatum: '12-01-2026' },
  { title: 'Canon EOS R5 Body', conditie: 'Uitstekend', sku: '21305', status: 'In reparatie', shuttercount: 34200, stock: 1, locatie: 'N-C-3', inkoopprijs: 1650, verkoopprijs: 1999, btw: '21%', inkoopdatum: '05-02-2026' },
  { title: 'Canon EOS R5 Body', conditie: 'Goed', sku: '21306', status: 'Afbeelding afwachten', shuttercount: 58100, stock: 1, locatie: 'L-L-5', inkoopprijs: 1450, verkoopprijs: 1799, btw: 'Marge', inkoopdatum: '18-02-2026' },
  { title: 'Canon EOS R5 Body', conditie: 'Als nieuw', sku: '21307', status: 'Gereserveerd', shuttercount: 3200, stock: 1, locatie: 'C-L-4', inkoopprijs: 1950, verkoopprijs: 2349, btw: 'Marge', inkoopdatum: '01-03-2026' },
  { title: 'Sony A7 IV Body', conditie: 'Als nieuw', sku: '04398', status: 'Verkoopbaar', shuttercount: 8900, stock: 1, locatie: 'C-L-1', inkoopprijs: 1350, verkoopprijs: 1599, btw: 'Marge', inkoopdatum: '20-01-2026' },
  { title: 'Sony A7 IV Body', conditie: 'Uitstekend', sku: '04399', status: 'Verkoopbaar', shuttercount: 21500, stock: 1, locatie: 'N-C-1', inkoopprijs: 1200, verkoopprijs: 1449, btw: '21%', inkoopdatum: '14-02-2026' },
  { title: 'Sony A7 IV Body', conditie: 'Gebruikt', sku: '04400', status: 'Defect', shuttercount: 95000, stock: 1, locatie: 'L-L-2', inkoopprijs: 750, verkoopprijs: 0, btw: 'Marge', inkoopdatum: '22-02-2026' },
  { title: 'Nikon Z6 III Body', conditie: 'Als nieuw', sku: '15201', status: 'Verkoopbaar', shuttercount: 1200, stock: 1, locatie: 'C-L-2', inkoopprijs: 1800, verkoopprijs: 2149, btw: 'Marge', inkoopdatum: '03-03-2026' },
  { title: 'Nikon Z6 III Body', conditie: 'Als nieuw', sku: '15202', status: 'Verkoopbaar', shuttercount: 15400, stock: 1, locatie: 'N-C-2', inkoopprijs: 1600, verkoopprijs: 1899, btw: '21%', inkoopdatum: '25-01-2026' },
  { title: 'Sigma 35mm f/1.4 DG DN Art', conditie: 'Als nieuw', sku: '30712', status: 'Verkoopbaar', shuttercount: 0, stock: 1, locatie: 'L-L-1', inkoopprijs: 450, verkoopprijs: 599, btw: 'Marge', inkoopdatum: '10-02-2026' },
  { title: 'Canon RF 50mm f/1.2L USM', conditie: 'Als nieuw', sku: '21480', status: 'Verkoopbaar', shuttercount: 0, stock: 1, locatie: 'C-L-5', inkoopprijs: 1500, verkoopprijs: 1799, btw: 'Marge', inkoopdatum: '28-02-2026' },
  { title: 'Canon RF 50mm f/1.2L USM', conditie: 'Goed', sku: '21481', status: 'Kwijt', shuttercount: 0, stock: 1, locatie: '\u2014', inkoopprijs: 1100, verkoopprijs: 1399, btw: '21%', inkoopdatum: '15-01-2026' },
  { title: 'Leica Q3', conditie: 'Als nieuw', sku: '50891', status: 'Verkoopbaar', shuttercount: 2100, stock: 1, locatie: 'C-L-6', inkoopprijs: 4200, verkoopprijs: 4899, btw: 'Marge', inkoopdatum: '06-03-2026' },
  { title: 'Fujifilm X-T5 Body', conditie: 'Als nieuw', sku: '18743', status: 'Afbeelding afwachten', shuttercount: 5600, stock: 1, locatie: 'N-C-4', inkoopprijs: 1100, verkoopprijs: 1349, btw: 'Marge', inkoopdatum: '08-03-2026' },
  { title: 'Hasselblad X2D 100C', conditie: 'Als nieuw', sku: '60125', status: 'Verkoopbaar', shuttercount: 800, stock: 1, locatie: 'C-L-7', inkoopprijs: 5800, verkoopprijs: 6499, btw: 'Marge', inkoopdatum: '02-03-2026' },
];

const MOCK_ORDERS = [
  { ordernummer: 'CT028945', factuurnummer: 'INV062569', prijs: 3448, datum: '09-03-2026', laatsteFactuur: '09-03-2026 14:32', naam: 'Adriaan Raesen', email: 'adriaan@raesen.nl', tel: '06-12345678', bedrijf: 'Raesen Fotografie', isBusiness: true, status: 'Verzonden', betaalmethode: 'Pin', herkomst: 'Quote', nieuwsbrief: false, adres: 'Meeuwenhof 23\n5103KD\nDongen\nNederland', orderregels: [{ variant: 'Canon EOS R5 Body — Als nieuw', type: 'Verkoop', prijs: 2199, btw: 'Marge' }, { variant: 'Canon RF 24-70mm f/2.8L IS USM — Uitstekend', type: 'Verkoop', prijs: 1549, btw: '21%' }, { variant: 'Sony A7 III Body — Goed', type: 'Inkoop', prijs: 650, btw: '0%' }] },
  { ordernummer: 'CT028944', factuurnummer: 'INV062568', prijs: 1599, datum: '08-03-2026', laatsteFactuur: '08-03-2026 10:15', naam: 'Maria Jansen', email: 'maria@fotostudio.nl', tel: '06-98765432', bedrijf: 'Fotostudio Amsterdam', isBusiness: true, status: 'In behandeling', betaalmethode: 'Pin', herkomst: 'Quote', nieuwsbrief: true, adres: 'Herengracht 45\n1015 BA\nAmsterdam\nNederland', orderregels: [{ variant: 'Sony A7 IV Body — Uitstekend', type: 'Verkoop', prijs: 1449, btw: '21%' }, { variant: 'Sony FE 24-70mm f/2.8 GM', type: 'Inkoop', prijs: 150, btw: '0%' }] },
  { ordernummer: 'CT028943', factuurnummer: 'INV062567', prijs: 4899, datum: '08-03-2026', laatsteFactuur: '08-03-2026 09:41', naam: 'Peter van der Berg', email: 'peter.berg@gmail.com', tel: '—', bedrijf: '—', isBusiness: false, status: 'Verzonden', betaalmethode: 'iDEAL', herkomst: 'Webshop', nieuwsbrief: false, adres: 'Meeuwenhof 23\n5103KD\nDongen\nNederland', orderregels: [{ variant: 'Leica Q3 — Als nieuw', type: 'Verkoop', prijs: 4899, btw: 'Marge' }] },
  { ordernummer: 'CT028942', factuurnummer: 'INV062566', prijs: 599, datum: '07-03-2026', laatsteFactuur: '07-03-2026 16:22', naam: 'Lisa Bakker', email: 'lisa@bakker.nl', tel: '06-11223344', bedrijf: '—', isBusiness: false, status: 'Afgerond', betaalmethode: 'Bankoverschrijving', herkomst: 'Webshop', nieuwsbrief: true, adres: 'Dorpsstraat 8\n3421 AB\nOudewater\nNederland', orderregels: [{ variant: 'Sigma 35mm f/1.4 DG DN Art — Als nieuw', type: 'Verkoop', prijs: 599, btw: 'Marge' }] },
  { ordernummer: 'CT028941', factuurnummer: 'INV062565', prijs: 3598, datum: '07-03-2026', laatsteFactuur: '', naam: 'Thomas Visser', email: 'thomas@visserfotografie.nl', tel: '06-55667788', bedrijf: 'Visser Fotografie', isBusiness: true, status: 'In behandeling', betaalmethode: 'Pin', herkomst: 'Quote', nieuwsbrief: false, adres: 'Industrieweg 12\n2600 AA\nDelft\nNederland', orderregels: [{ variant: 'Canon EOS R5 Body — Uitstekend', type: 'Verkoop', prijs: 1999, btw: '21%' }, { variant: 'Canon RF 50mm f/1.2L USM — Als nieuw', type: 'Verkoop', prijs: 1799, btw: 'Marge' }] },
  { ordernummer: 'CT028940', factuurnummer: 'INV062564', prijs: 1899, datum: '06-03-2026', laatsteFactuur: '06-03-2026 11:05', naam: 'Emma de Groot', email: 'emma.degroot@mail.nl', tel: '—', bedrijf: '—', isBusiness: false, status: 'Verzonden', betaalmethode: 'iDEAL', herkomst: 'Webshop', nieuwsbrief: false, adres: 'Plein 1945 nr 7\n5211 EA\nDen Bosch\nNederland', orderregels: [{ variant: 'Nikon Z6 III Body — Als nieuw', type: 'Verkoop', prijs: 1899, btw: '21%' }] },
  { ordernummer: 'CT028939', factuurnummer: 'INV062563', prijs: 6499, datum: '06-03-2026', laatsteFactuur: '', naam: 'Rick Mulder', email: 'rick@studiomulder.nl', tel: '06-99887766', bedrijf: 'Studio Mulder B.V.', isBusiness: true, status: 'Nieuw', betaalmethode: 'Bankoverschrijving', herkomst: 'Webshop', nieuwsbrief: true, adres: 'Lavendelweg 5\n3016 DK\nRotterdam\nNederland', orderregels: [{ variant: 'Hasselblad X2D 100C — Als nieuw', type: 'Verkoop', prijs: 6499, btw: 'Marge' }] },
  { ordernummer: 'CT028938', factuurnummer: 'INV062562', prijs: 1449, datum: '05-03-2026', laatsteFactuur: '05-03-2026 15:30', naam: 'Sophie Hendriks', email: 'sophie.h@outlook.com', tel: '06-44332211', bedrijf: '—', isBusiness: false, status: 'Afgerond', betaalmethode: 'iDEAL', herkomst: 'Webshop', nieuwsbrief: false, adres: 'Brinkstraat 19\n7411 HR\nDeventer\nNederland', orderregels: [{ variant: 'Sony A7 IV Body — Uitstekend', type: 'Verkoop', prijs: 1449, btw: '21%' }] },
  { ordernummer: 'CT028937', factuurnummer: 'INV062561', prijs: 2349, datum: '05-03-2026', laatsteFactuur: '', naam: 'David Smit', email: 'david.smit@gmail.com', tel: '—', bedrijf: '—', isBusiness: false, status: 'In behandeling', betaalmethode: 'Pin', herkomst: 'Quote', nieuwsbrief: false, adres: 'Markt 3\n6211 CK\nMaastricht\nNederland', orderregels: [{ variant: 'Canon EOS R5 Body — Als nieuw', type: 'Verkoop', prijs: 2349, btw: 'Marge' }] },
  { ordernummer: 'CT028936', factuurnummer: 'INV062560', prijs: 1799, datum: '04-03-2026', laatsteFactuur: '04-03-2026 09:12', naam: 'Anna Bos', email: 'anna@bosmedia.nl', tel: '06-77889900', bedrijf: 'Bos Media', isBusiness: true, status: 'Afgerond', betaalmethode: 'iDEAL', herkomst: 'Webshop', nieuwsbrief: true, adres: 'Stationsplein 1\n3511 ED\nUtrecht\nNederland', orderregels: [{ variant: 'Canon RF 50mm f/1.2L USM — Als nieuw', type: 'Verkoop', prijs: 1799, btw: 'Marge' }] },
];

const MOCK_KASBOEK = [
  { datum: '09-03-2026', omschrijving: 'Inkoop Canon EOS R5', bedrag: '-€ 1.850,00' },
  { datum: '08-03-2026', omschrijving: 'Verkoop Nikon Z6 III', bedrag: '€ 1.320,00' },
  { datum: '07-03-2026', omschrijving: 'Reparatie Sony A7 IV', bedrag: '-€ 125,00' },
  { datum: '06-03-2026', omschrijving: 'Verkoop Sigma 35mm f/1.4', bedrag: '€ 599,50' },
];

const MOCK_CATEGORIES = [
  { name: "Camera's", slug: 'cameras', active: true, navbar: true, market: 'NL', children: [
    { name: "Camera's DSLR", slug: 'cameras-dslr', active: true, navbar: true, market: 'NL', children: [
      { name: 'Canon DSLR-camera\'s', slug: 'canon-dslr-cameras', active: true, navbar: true, market: 'NL', children: [] },
      { name: 'Nikon DSLR-camera\'s', slug: 'nikon-dslr-cameras', active: true, navbar: false, market: 'NL', children: [] },
    ]},
  ]},
];

const MOCK_QUOTES = [
  { id: 'QTE000005', name: 'Jan de Vries', bedrijf: '—', email: 'jan@example.nl', created: '09-03-2026', status: 'Wacht op prijsvoorstel', sellCount: 3, buyCount: 0 },
  { id: 'QTE000004', name: 'Maria Jansen', bedrijf: 'Fotostudio Amsterdam', email: 'maria@fotostudio.nl', created: '08-03-2026', status: 'Wacht op akkoord', sellCount: 1, buyCount: 1 },
  { id: 'QTE000003', name: 'Peter van der Berg', bedrijf: '—', email: 'peter.berg@gmail.com', created: '07-03-2026', status: 'Controleren', sellCount: 2, buyCount: 0 },
  { id: 'QTE000002', name: 'Test Test', bedrijf: '—', email: 'test@test.nl', created: '09-03-2026', status: 'Wacht op prijsvoorstel', sellCount: 2, buyCount: 0 },
  { id: 'QTE000001', name: 'Test Test', bedrijf: '—', email: 'admin@camera-tweedehands.nl', created: '09-03-2026', status: 'Wacht op prijsvoorstel', sellCount: 1, buyCount: 0 },
];

/* ------------------------------------------------------------------ */
/*  Shared style helpers                                               */
/* ------------------------------------------------------------------ */
const cardStyle: React.CSSProperties = {
  background: WHITE,
  border: `1px solid ${BORDER}`,
  borderRadius: 12,
  padding: 20,
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};

const tableHeaderStyle: React.CSSProperties = {
  background: SURFACE,
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  color: GREY,
  letterSpacing: '0.5px',
};

const tableCellStyle: React.CSSProperties = {
  padding: '10px 14px',
  fontSize: 13,
  borderBottom: `1px solid ${BORDER}`,
};

const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  border: '1px solid #D1D5DB',
  borderRadius: 8,
  fontSize: 13,
  outline: 'none',
  fontFamily: 'inherit',
  background: WHITE,
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  background: WHITE,
  cursor: 'pointer',
};

const buttonAccent: React.CSSProperties = {
  background: ACCENT,
  color: WHITE,
  border: 'none',
  borderRadius: 8,
  padding: '10px 20px',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const buttonDark: React.CSSProperties = {
  ...buttonAccent,
  background: DARK,
};

const buttonOutline: React.CSSProperties = {
  background: 'transparent',
  color: DARK,
  border: `1px solid ${BORDER}`,
  borderRadius: 8,
  padding: '10px 20px',
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

/* ------------------------------------------------------------------ */
/*  Badge component                                                    */
/* ------------------------------------------------------------------ */
function Badge({ children, color = ACCENT, bg }: { children: React.ReactNode; color?: string; bg?: string }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 600,
      color: color,
      background: bg || (color === ACCENT ? ACCENT_BG : color === GREEN ? '#DCFCE7' : color === BLUE ? '#DBEAFE' : '#F3F4F6'),
    }}>
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Filter Pill component                                              */
/* ------------------------------------------------------------------ */
function FilterPill({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 14px',
        borderRadius: 999,
        border: active ? 'none' : `1px solid ${BORDER}`,
        background: active ? ACCENT : WHITE,
        color: active ? WHITE : DARK,
        fontSize: 12,
        fontWeight: 500,
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      {label} <span style={{ fontWeight: 600 }}>{count}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Toggle component                                                   */
/* ------------------------------------------------------------------ */
function Toggle({ checked }: { checked: boolean }) {
  return (
    <div style={{
      width: 36,
      height: 20,
      borderRadius: 10,
      background: checked ? ACCENT : '#D1D5DB',
      position: 'relative',
      cursor: 'pointer',
      transition: 'background 0.2s',
    }}>
      <div style={{
        width: 16,
        height: 16,
        borderRadius: '50%',
        background: WHITE,
        position: 'absolute',
        top: 2,
        left: checked ? 18 : 2,
        transition: 'left 0.2s',
        boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
      }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  KPI Card                                                           */
/* ------------------------------------------------------------------ */
function KPICard({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ ...cardStyle, flex: 1, minWidth: 160 }}>
      <div style={{ fontSize: 12, color: GREY, marginBottom: 6, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: DARK }}>{value}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section Header                                                     */
/* ------------------------------------------------------------------ */
function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: DARK, margin: 0 }}>{title}</h2>
      {description && <p style={{ fontSize: 13, color: GREY, margin: '4px 0 0' }}>{description}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard Page (overview)                                          */
/* ------------------------------------------------------------------ */
function DashboardPage() {
  const [orderFilter, setOrderFilter] = useState('alle');
  const [verzendFilter, setVerzendFilter] = useState('alle');

  return (
    <div>
      {/* Search bar */}
      <div style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Zoek order, quote, klant..."
          style={{ ...inputStyle, width: '100%', padding: '12px 16px', fontSize: 14, boxSizing: 'border-box' }}
        />
      </div>

      {/* KPI cards */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        <KPICard label="Openstaande orders" value={12} />
        <KPICard label="Te verzenden" value={7} />
        <KPICard label="Open quotes" value={0} />
        <KPICard label="Kas saldo" value="\u20AC1.245,50" />
      </div>

      {/* Orders */}
      <div style={{ ...cardStyle, marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: DARK, margin: '0 0 12px' }}>Orders</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <FilterPill label="Alle" count={24} active={orderFilter === 'alle'} onClick={() => setOrderFilter('alle')} />
          <FilterPill label="Nieuw" count={6} active={orderFilter === 'nieuw'} onClick={() => setOrderFilter('nieuw')} />
          <FilterPill label="In behandeling" count={10} active={orderFilter === 'behandeling'} onClick={() => setOrderFilter('behandeling')} />
          <FilterPill label="Klaar" count={8} active={orderFilter === 'klaar'} onClick={() => setOrderFilter('klaar')} />
        </div>
      </div>

      {/* Verzendingen */}
      <div style={{ ...cardStyle, marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: DARK, margin: '0 0 12px' }}>Verzendingen</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <FilterPill label="Alle" count={10} active={verzendFilter === 'alle'} onClick={() => setVerzendFilter('alle')} />
          <FilterPill label="Label nodig" count={4} active={verzendFilter === 'label'} onClick={() => setVerzendFilter('label')} />
          <FilterPill label="Onderweg" count={3} active={verzendFilter === 'onderweg'} onClick={() => setVerzendFilter('onderweg')} />
          <FilterPill label="Afgeleverd" count={3} active={verzendFilter === 'afgeleverd'} onClick={() => setVerzendFilter('afgeleverd')} />
        </div>
      </div>

      {/* Quote statussen */}
      <div style={{ ...cardStyle, marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: DARK, margin: '0 0 12px' }}>Quote statussen</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['Alle', 'Wacht op prijsvoorstel', 'Aangemaakt', 'Wacht op akkoord', 'Controleren', 'Uitbetalen', 'Afgekeurd', 'In transit', 'Afgerond'].map((s) => (
            <FilterPill key={s} label={s} count={0} active={false} onClick={() => {}} />
          ))}
        </div>
      </div>

      {/* Quote aanmaken */}
      <div style={{ ...cardStyle, marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: DARK, margin: '0 0 12px' }}>Quote aanmaken</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {['Store', 'B2B'].map((type) => (
            <button key={type} style={{
              flex: 1,
              minWidth: 140,
              padding: '24px 20px',
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              background: WHITE,
              fontSize: 16,
              fontWeight: 600,
              color: DARK,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'border-color 0.15s',
            }}>
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {/* Snelle acties */}
        <div style={{ ...cardStyle, flex: 1, minWidth: 280 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: DARK, margin: '0 0 14px' }}>Snelle acties</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Nieuwe order', 'Nieuwe quote', 'Nieuwe reservering', 'Kasbetaling'].map((a) => (
              <button key={a} style={buttonOutline}>{a}</button>
            ))}
          </div>
        </div>

        {/* Kasboek */}
        <div style={{ ...cardStyle, flex: 1.5, minWidth: 380 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: DARK, margin: 0 }}>Kasboek</h3>
            <input type="text" placeholder="Zoeken..." style={{ ...inputStyle, width: 160 }} />
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Datum', 'Omschrijving', 'Bedrag'].map((h) => (
                  <th key={h} style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: h === 'Bedrag' ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_KASBOEK.map((row, i) => (
                <tr key={i}>
                  <td style={tableCellStyle}>{row.datum}</td>
                  <td style={tableCellStyle}>{row.omschrijving}</td>
                  <td style={{ ...tableCellStyle, textAlign: 'right', color: row.bedrag.startsWith('-') ? RED : GREEN, fontWeight: 600 }}>{row.bedrag}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Producten Page                                                     */
/* ------------------------------------------------------------------ */
function ProductenPage() {
  const [search, setSearch] = useState('');
  const filtered = MOCK_PRODUCTS.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <SectionHeader title="Producten" description={`${MOCK_PRODUCTS.length} producten totaal`} />
      {/* Full-width search bar */}
      <input
        type="text"
        placeholder="Zoek op titel, merk, SKU..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ ...inputStyle, width: '100%', padding: '14px 18px', fontSize: 15, boxSizing: 'border-box', marginBottom: 20, borderRadius: 10 }}
      />
      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Titel</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Brand</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'center' }}>Hardloper</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'center' }}>Multiple stock</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'center' }}>Voorraad</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'center' }}>Active</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={i} style={{ cursor: 'pointer' }}>
                  <td style={{ ...tableCellStyle, fontWeight: 500, color: ACCENT }}>{p.name}</td>
                  <td style={tableCellStyle}>{p.brand}</td>
                  <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                    {p.hardloper && <Badge color={ACCENT} bg={ACCENT_BG}>Hardloper</Badge>}
                  </td>
                  <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                    <Badge color={p.multipleStock ? GREEN : GREY} bg={p.multipleStock ? '#DCFCE7' : '#F3F4F6'}>
                      {p.multipleStock ? 'Ja' : 'Nee'}
                    </Badge>
                  </td>
                  <td style={{ ...tableCellStyle, textAlign: 'center', fontWeight: 600 }}>{p.stock}</td>
                  <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: p.active ? GREEN : RED,
                    }} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ ...tableCellStyle, textAlign: 'center', padding: 40, color: GREY }}>Geen producten gevonden.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Varianten Page                                                     */
/* ------------------------------------------------------------------ */
function VariantenPage() {
  const [search, setSearch] = useState('');
  const filtered = MOCK_VARIANTS.filter(v =>
    !search || v.title.toLowerCase().includes(search.toLowerCase()) || v.sku.toLowerCase().includes(search.toLowerCase()) || v.status.toLowerCase().includes(search.toLowerCase()) || v.locatie.toLowerCase().includes(search.toLowerCase()) || v.conditie.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (s: string) => {
    switch (s) {
      case 'Verkoopbaar': return GREEN;
      case 'In reparatie': return '#F59E0B';
      case 'Afbeelding afwachten': return BLUE;
      case 'Gereserveerd': return '#8B5CF6';
      case 'Defect': return RED;
      case 'Kwijt': return '#6B7280';
      default: return GREY;
    }
  };

  return (
    <div>
      <SectionHeader title="Varianten" description={`${MOCK_VARIANTS.length} varianten totaal`} />
      <input
        type="text"
        placeholder="Zoek op titel, SKU, status, locatie..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ ...inputStyle, width: '100%', padding: '14px 18px', fontSize: 15, boxSizing: 'border-box', marginBottom: 20, borderRadius: 10 }}
      />
      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1100 }}>
            <thead>
              <tr>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Titel</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Conditie</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>SKU</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Status</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'right' }}>Shuttercount</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'center' }}>Voorraad</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Locatie</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'right' }}>Inkoopprijs</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'right' }}>Verkoopprijs</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'center' }}>BTW</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Inkoopdatum</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v, i) => (
                <tr key={i} style={{ cursor: 'pointer' }}>
                  <td style={{ ...tableCellStyle, fontWeight: 500, color: ACCENT, whiteSpace: 'nowrap' }}>{v.title}</td>
                  <td style={tableCellStyle}>
                    <Badge color={DARK} bg={SURFACE}>{v.conditie}</Badge>
                  </td>
                  <td style={{ ...tableCellStyle, fontSize: 12, fontFamily: 'monospace', color: GREY }}>{v.sku}</td>
                  <td style={tableCellStyle}>
                    <Badge color={statusColor(v.status)} bg={statusColor(v.status) + '18'}>{v.status}</Badge>
                  </td>
                  <td style={{ ...tableCellStyle, textAlign: 'right', fontFamily: 'monospace', fontSize: 12 }}>{v.shuttercount > 0 ? v.shuttercount.toLocaleString('nl-NL') : '\u2014'}</td>
                  <td style={{ ...tableCellStyle, textAlign: 'center', fontWeight: 600 }}>{v.stock}</td>
                  <td style={{ ...tableCellStyle, fontFamily: 'monospace', fontSize: 12 }}>{v.locatie}</td>
                  <td style={{ ...tableCellStyle, textAlign: 'right', fontWeight: 500 }}>&euro; {v.inkoopprijs.toLocaleString('nl-NL')}</td>
                  <td style={{ ...tableCellStyle, textAlign: 'right', fontWeight: 500 }}>{v.verkoopprijs > 0 ? `\u20AC ${v.verkoopprijs.toLocaleString('nl-NL')}` : '\u2014'}</td>
                  <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                    <Badge color={v.btw === 'Marge' ? ACCENT : BLUE} bg={v.btw === 'Marge' ? ACCENT_BG : '#DBEAFE'}>{v.btw}</Badge>
                  </td>
                  <td style={{ ...tableCellStyle, fontSize: 12, color: GREY }}>{v.inkoopdatum}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={11} style={{ ...tableCellStyle, textAlign: 'center', padding: 40, color: GREY }}>Geen varianten gevonden.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Categories Page                                                    */
/* ------------------------------------------------------------------ */
function CategoriesPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <SectionHeader title="Categories" description="View and manage webstore categories." />
        <button
          style={buttonAccent}
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Annuleren' : '+ Categorie aanmaken'}
        </button>
      </div>

      {/* Create categories — hidden until button click */}
      {showCreateForm && (
      <div style={{ ...cardStyle, marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: DARK, margin: '0 0 16px' }}>Categorie aanmaken</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 12, color: GREY, display: 'block', marginBottom: 4 }}>Market</label>
            <select style={{ ...selectStyle, width: '100%' }}><option>Nederland</option></select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: GREY, display: 'block', marginBottom: 4 }}>Parent</label>
            <select style={{ ...selectStyle, width: '100%' }}><option>root</option></select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: GREY, display: 'block', marginBottom: 4 }}>Visibility</label>
            <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
              <label style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}><input type="checkbox" defaultChecked /> Active</label>
              <label style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}><input type="checkbox" /> Show in navbar</label>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: GREY, display: 'block', marginBottom: 4 }}>New category name</label>
          <input type="text" placeholder="Category name" style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 12, color: GREY, display: 'block', marginBottom: 4 }}>Category image</label>
            <div style={{
              border: `2px dashed ${BORDER}`,
              borderRadius: 8,
              padding: 30,
              textAlign: 'center',
              color: GREY,
              fontSize: 13,
            }}>
              Drop image or click to upload
            </div>
          </div>
          <div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: GREY, display: 'block', marginBottom: 4 }}>SEO title</label>
              <input type="text" style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: GREY, display: 'block', marginBottom: 4 }}>SEO description</label>
              <textarea style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', minHeight: 60, resize: 'vertical' }} />
            </div>
          </div>
        </div>

        {/* Storefront content */}
        <h4 style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: GREY, letterSpacing: '0.5px', margin: '20px 0 12px' }}>STOREFRONT CONTENT</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 12, color: GREY, display: 'block', marginBottom: 4 }}>Heading</label>
            <input type="text" style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: GREY, display: 'block', marginBottom: 4 }}>Heading text</label>
            <input type="text" style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: GREY, display: 'block', marginBottom: 4 }}>Footer</label>
            <input type="text" style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: GREY, display: 'block', marginBottom: 4 }}>Footer text</label>
            <input type="text" style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} />
          </div>
        </div>

        {/* FAQs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h4 style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: GREY, letterSpacing: '0.5px', margin: 0 }}>STOREFRONT FAQS (0)</h4>
          <button style={buttonOutline}>Add FAQ</button>
        </div>

        <button style={buttonAccent}>Create</button>
      </div>
      )}

      {/* Category tree table */}
      <div style={cardStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Category', 'Slug', 'Active', 'Navbar', 'Market', 'Actions'].map((h) => (
                <th key={h} style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_CATEGORIES.map((cat) => (
              <>
                <tr key={cat.slug}>
                  <td style={{ ...tableCellStyle, fontWeight: 600 }}>{cat.name}</td>
                  <td style={{ ...tableCellStyle, color: GREY, fontSize: 12 }}>{cat.slug}</td>
                  <td style={tableCellStyle}><Toggle checked={cat.active} /></td>
                  <td style={tableCellStyle}><Toggle checked={cat.navbar} /></td>
                  <td style={tableCellStyle}>{cat.market}</td>
                  <td style={tableCellStyle}><button style={{ ...buttonOutline, padding: '4px 10px', fontSize: 11 }}>Edit</button></td>
                </tr>
                {cat.children?.map((sub) => (
                  <>
                    <tr key={sub.slug}>
                      <td style={{ ...tableCellStyle, paddingLeft: 32 }}>{sub.name}</td>
                      <td style={{ ...tableCellStyle, color: GREY, fontSize: 12 }}>{sub.slug}</td>
                      <td style={tableCellStyle}><Toggle checked={sub.active} /></td>
                      <td style={tableCellStyle}><Toggle checked={sub.navbar} /></td>
                      <td style={tableCellStyle}>{sub.market}</td>
                      <td style={tableCellStyle}><button style={{ ...buttonOutline, padding: '4px 10px', fontSize: 11 }}>Edit</button></td>
                    </tr>
                    {sub.children?.map((subsub) => (
                      <tr key={subsub.slug}>
                        <td style={{ ...tableCellStyle, paddingLeft: 56 }}>{subsub.name}</td>
                        <td style={{ ...tableCellStyle, color: GREY, fontSize: 12 }}>{subsub.slug}</td>
                        <td style={tableCellStyle}><Toggle checked={subsub.active} /></td>
                        <td style={tableCellStyle}><Toggle checked={subsub.navbar} /></td>
                        <td style={tableCellStyle}>{subsub.market}</td>
                        <td style={tableCellStyle}><button style={{ ...buttonOutline, padding: '4px 10px', fontSize: 11 }}>Edit</button></td>
                      </tr>
                    ))}
                  </>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Orders Page                                                        */
/* ------------------------------------------------------------------ */
function OrdersPage({ onSelectOrder }: { onSelectOrder: (id: string) => void }) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<string>('datum');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filtered = MOCK_ORDERS.filter(o =>
    !search || o.ordernummer.toLowerCase().includes(search.toLowerCase()) || o.factuurnummer.toLowerCase().includes(search.toLowerCase()) || o.naam.toLowerCase().includes(search.toLowerCase()) || o.bedrijf.toLowerCase().includes(search.toLowerCase()) || o.status.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    if (sortField === 'prijs') return (a.prijs - b.prijs) * dir;
    if (sortField === 'ordernummer') return a.ordernummer.localeCompare(b.ordernummer) * dir;
    return a.datum.localeCompare(b.datum) * dir;
  });

  const toggleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const orderStatusColor = (s: string) => {
    switch (s) {
      case 'Nieuw': return ACCENT;
      case 'In behandeling': return BLUE;
      case 'Verzonden': return '#8B5CF6';
      case 'Afgerond': return GREEN;
      default: return GREY;
    }
  };

  const SortIcon = ({ field }: { field: string }) => (
    <span style={{ marginLeft: 4, fontSize: 10, opacity: sortField === field ? 1 : 0.3 }}>
      {sortField === field ? (sortDir === 'asc' ? '\u25B2' : '\u25BC') : '\u25BC'}
    </span>
  );

  return (
    <div>
      <SectionHeader title="Orders" description={`${MOCK_ORDERS.length} orders totaal`} />
      <input
        type="text"
        placeholder="Zoek op ordernummer, factuurnummer, naam, bedrijf..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ ...inputStyle, width: '100%', padding: '14px 18px', fontSize: 15, boxSizing: 'border-box', marginBottom: 20, borderRadius: 10 }}
      />
      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left', cursor: 'pointer' }} onClick={() => toggleSort('ordernummer')}>
                  Ordernummer <SortIcon field="ordernummer" />
                </th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Factuurnummer</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'right', cursor: 'pointer' }} onClick={() => toggleSort('prijs')}>
                  Prijs <SortIcon field="prijs" />
                </th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left', cursor: 'pointer' }} onClick={() => toggleSort('datum')}>
                  Datum <SortIcon field="datum" />
                </th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Naam</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Bedrijf</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Orderstatus</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((o, i) => (
                <tr key={i} style={{ cursor: 'pointer' }} onClick={() => onSelectOrder(o.ordernummer)}>
                  <td style={{ ...tableCellStyle, fontWeight: 600, color: ACCENT }}>{o.ordernummer}</td>
                  <td style={{ ...tableCellStyle, fontSize: 12, color: GREY }}>{o.factuurnummer}</td>
                  <td style={{ ...tableCellStyle, textAlign: 'right', fontWeight: 500 }}>&euro; {o.prijs.toLocaleString('nl-NL')}</td>
                  <td style={{ ...tableCellStyle, fontSize: 12 }}>{o.datum}</td>
                  <td style={{ ...tableCellStyle, fontWeight: 500 }}>{o.naam}</td>
                  <td style={{ ...tableCellStyle, fontSize: 12, color: GREY }}>{o.bedrijf}</td>
                  <td style={tableCellStyle}>
                    <Badge color={orderStatusColor(o.status)} bg={orderStatusColor(o.status) + '18'}>{o.status}</Badge>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr><td colSpan={7} style={{ ...tableCellStyle, textAlign: 'center', padding: 40, color: GREY }}>Geen orders gevonden.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Order Detail Page                                                  */
/* ------------------------------------------------------------------ */
function OrderDetailPage({ ordernummer, onBack }: { ordernummer: string; onBack: () => void }) {
  const order = MOCK_ORDERS.find(o => o.ordernummer === ordernummer) || MOCK_ORDERS[0];
  const [showCreditForm, setShowCreditForm] = useState(false);
  const [creditSelected, setCreditSelected] = useState<Set<number>>(new Set());
  const [creditVerzendkosten, setCreditVerzendkosten] = useState(false);
  const [creditBetaalkosten, setCreditBetaalkosten] = useState(false);
  const [creditNewProduct, setCreditNewProduct] = useState('');
  const [creditNewPrice, setCreditNewPrice] = useState('');

  const infoRow = (label: string, value: string | React.ReactNode) => (
    <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: DARK, minWidth: 160 }}>{label}</span>
      <span style={{ fontSize: 13, color: GREY }}>{value}</span>
    </div>
  );

  const orderStatusColor = (s: string) => {
    switch (s) {
      case 'Nieuw': return ACCENT;
      case 'In behandeling': return BLUE;
      case 'Verzonden': return '#8B5CF6';
      case 'Afgerond': return GREEN;
      default: return GREY;
    }
  };

  const toggleCreditItem = (idx: number) => {
    setCreditSelected(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const creditTotal = (() => {
    let total = 0;
    creditSelected.forEach(idx => {
      const r = order.orderregels[idx];
      if (r) total -= r.prijs; // credit = negative
    });
    if (creditVerzendkosten) total -= 6.95;
    if (creditBetaalkosten) total -= 0.29;
    if (creditNewPrice && parseFloat(creditNewPrice) > 0) total += parseFloat(creditNewPrice);
    return total;
  })();

  return (
    <div>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: ACCENT, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>&larr; Alle orders</button>
          {order.herkomst === 'Quote' && (
            <button style={{ background: 'none', border: 'none', color: ACCENT, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>&larr; Naar quote</button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: 4 }}>
            <button style={buttonAccent}>Factuur versturen</button>
            {order.laatsteFactuur && (
              <span style={{ fontSize: 10, color: GREY, marginTop: 4 }}>Laatst verstuurd: {order.laatsteFactuur}</span>
            )}
          </div>
          <button style={buttonDark} onClick={() => setShowCreditForm(!showCreditForm)}>Credit factuur</button>
        </div>
      </div>

      {/* Credit factuur form */}
      {showCreditForm && (
        <div style={{ ...cardStyle, marginBottom: 20, border: `2px solid ${ACCENT}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 16 }}>Credit factuur aanmaken</h3>
          <p style={{ fontSize: 13, color: GREY, marginBottom: 16 }}>Selecteer welke regels je wilt crediteren. Optioneel kun je een vervangend product toevoegen (ruil).</p>

          {/* Selectable order lines */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: GREY, letterSpacing: '0.5px', marginBottom: 8 }}>Orderregels crediteren</div>
            {order.orderregels.map((r, i) => (
              <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${BORDER}`, cursor: 'pointer', fontSize: 13 }}>
                <input type="checkbox" checked={creditSelected.has(i)} onChange={() => toggleCreditItem(i)} />
                <span style={{ flex: 1, fontWeight: 500, color: creditSelected.has(i) ? RED : DARK }}>{r.variant}</span>
                <Badge color={r.type === 'Verkoop' ? GREEN : BLUE} bg={r.type === 'Verkoop' ? '#DCFCE7' : '#DBEAFE'}>{r.type}</Badge>
                <span style={{ fontWeight: 600, color: creditSelected.has(i) ? RED : DARK, minWidth: 80, textAlign: 'right' }}>
                  {creditSelected.has(i) ? '-' : ''}&euro; {r.prijs.toLocaleString('nl-NL')}
                </span>
              </label>
            ))}
          </div>

          {/* Extra kosten crediteren */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: GREY, letterSpacing: '0.5px', marginBottom: 8 }}>Extra kosten crediteren</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 13, cursor: 'pointer' }}>
              <input type="checkbox" checked={creditVerzendkosten} onChange={() => setCreditVerzendkosten(!creditVerzendkosten)} />
              <span style={{ flex: 1 }}>Verzendkosten</span>
              <span style={{ color: creditVerzendkosten ? RED : GREY, fontWeight: 500 }}>{creditVerzendkosten ? '-' : ''}&euro; 6,95</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 13, cursor: 'pointer' }}>
              <input type="checkbox" checked={creditBetaalkosten} onChange={() => setCreditBetaalkosten(!creditBetaalkosten)} />
              <span style={{ flex: 1 }}>Betaalkosten</span>
              <span style={{ color: creditBetaalkosten ? RED : GREY, fontWeight: 500 }}>{creditBetaalkosten ? '-' : ''}&euro; 0,29</span>
            </label>
          </div>

          {/* Vervangend product (ruil) */}
          <div style={{ marginBottom: 16, padding: 16, background: SURFACE, borderRadius: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: GREY, letterSpacing: '0.5px', marginBottom: 8 }}>
              Vervangend product toevoegen (optioneel)
            </div>
            <p style={{ fontSize: 12, color: GREY, marginBottom: 10 }}>
              Bij een ruil: het gecrediteerde bedrag wordt verrekend met het nieuwe product. Het nettobedrag wordt bijbetaald of teruggestort.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="Productnaam of SKU..."
                value={creditNewProduct}
                onChange={e => setCreditNewProduct(e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
              />
              <input
                type="text"
                placeholder="Prijs"
                value={creditNewPrice}
                onChange={e => setCreditNewPrice(e.target.value.replace(/[^\d.,]/g, ''))}
                style={{ ...inputStyle, width: 100 }}
              />
            </div>
            {creditNewProduct && creditNewPrice && (
              <div style={{ marginTop: 8, fontSize: 13, color: GREEN, fontWeight: 500 }}>
                + &euro; {parseFloat(creditNewPrice || '0').toLocaleString('nl-NL')} — {creditNewProduct}
              </div>
            )}
          </div>

          {/* Netto bedrag */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderTop: `2px solid ${BORDER}` }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: GREY, letterSpacing: '0.5px' }}>Nettobedrag</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: creditTotal < 0 ? RED : creditTotal > 0 ? GREEN : DARK }}>
                {creditTotal < 0 ? '-' : '+'}&euro; {Math.abs(creditTotal).toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: 12, color: GREY }}>
                {creditTotal < 0 ? 'Klant ontvangt terug' : creditTotal > 0 ? 'Klant betaalt bij' : 'Verrekend'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={buttonOutline} onClick={() => { setShowCreditForm(false); setCreditSelected(new Set()); setCreditVerzendkosten(false); setCreditBetaalkosten(false); setCreditNewProduct(''); setCreditNewPrice(''); }}>Annuleren</button>
              <button style={{ ...buttonAccent, background: creditSelected.size > 0 || creditVerzendkosten || creditBetaalkosten ? ACCENT : GREY }} disabled={creditSelected.size === 0 && !creditVerzendkosten && !creditBetaalkosten}>
                Credit factuur aanmaken
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order info + klantgegevens */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: DARK, marginBottom: 20 }}>Order {order.ordernummer}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ordergegevens</h3>
            {infoRow('Ordernummer', order.ordernummer)}
            {infoRow('Factuurnummer', order.factuurnummer)}
            {infoRow('Aangemaakt', order.datum)}
            {infoRow('Prijs totaal', `\u20AC ${order.prijs.toLocaleString('nl-NL')}`)}
            {infoRow('Betaalmethode', order.betaalmethode)}
            {infoRow('Status', <Badge color={orderStatusColor(order.status)} bg={orderStatusColor(order.status) + '18'}>{order.status}</Badge>)}
            {infoRow('Order afkomstig van', order.herkomst)}
          </div>
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Klantgegevens</h3>
            {infoRow('Naam', order.naam)}
            {infoRow('Email', order.email)}
            {infoRow('Tel.', order.tel)}
            {infoRow('Business', <Badge color={order.isBusiness ? GREEN : GREY} bg={order.isBusiness ? '#DCFCE7' : '#F3F4F6'}>{order.isBusiness ? 'Ja' : 'Nee'}</Badge>)}
            {order.isBusiness && order.bedrijf !== '—' && infoRow('Bedrijf', order.bedrijf)}
            {infoRow('Nieuwsbrief', order.nieuwsbrief ? 'Ja' : 'Nee')}
            {infoRow('Adres', <span style={{ whiteSpace: 'pre-line' }}>{order.adres}</span>)}
            {infoRow('Factuur adres', <span style={{ whiteSpace: 'pre-line' }}>{order.adres}</span>)}
          </div>
        </div>

        {/* Documenten */}
        <h3 style={{ fontSize: 13, fontWeight: 700, color: DARK, marginTop: 28, marginBottom: 12 }}>Documenten</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ ...buttonOutline, display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Factuur
          </button>
          <button style={{ ...buttonOutline, display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Pakbon
          </button>
        </div>
      </div>

      {/* Orderregels */}
      <div style={{ ...cardStyle, marginTop: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 16 }}>Orderregels</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Variant</th>
              <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Type</th>
              <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'right' }}>Prijs</th>
              <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>BTW</th>
            </tr>
          </thead>
          <tbody>
            {order.orderregels.map((r, i) => (
              <tr key={i}>
                <td style={{ ...tableCellStyle, fontWeight: 500, color: r.type === 'Inkoop' ? DARK : ACCENT }}>
                  {r.variant}
                  {r.type === 'Inkoop' && <span style={{ display: 'block', fontSize: 11, color: RED, fontWeight: 600, textTransform: 'uppercase' }}>GERESERVEERD</span>}
                </td>
                <td style={tableCellStyle}>
                  <Badge color={r.type === 'Verkoop' ? GREEN : BLUE} bg={r.type === 'Verkoop' ? '#DCFCE7' : '#DBEAFE'}>{r.type}</Badge>
                </td>
                <td style={{ ...tableCellStyle, textAlign: 'right', fontWeight: 500 }}>&euro; {r.prijs.toLocaleString('nl-NL')}</td>
                <td style={{ ...tableCellStyle, fontSize: 13 }}>{r.btw}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Verzendingen */}
      <div style={{ ...cardStyle, marginTop: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 16 }}>Verzendingen</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Bestemming', 'Verzendoptie', 'Vervoerder', 'Tracking nummer', 'Tracking url', 'Status', 'Externe status', 'Verzendlabel', 'Pakbon', 'Lightspeed verzending'].map(h => (
                <th key={h} style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left', fontSize: 10 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={10} style={{ ...tableCellStyle, textAlign: 'center', padding: 20, color: GREY, fontSize: 13 }}>Geen resultaten</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Credit facturen */}
      <div style={{ ...cardStyle, marginTop: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 16 }}>Credit facturen</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Referentie</th>
              <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Datum</th>
              <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'right' }}>Bedrag</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={3} style={{ ...tableCellStyle, textAlign: 'center', padding: 20, color: GREY, fontSize: 13 }}>Geen resultaten</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Notities */}
      <div style={{ ...cardStyle, marginTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK, margin: 0 }}>Notities</h3>
          <button style={buttonAccent}>Notitie opslaan</button>
        </div>
        <textarea
          placeholder="Order notitie"
          style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', minHeight: 100, resize: 'vertical' }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Quotes Page                                                        */
/* ------------------------------------------------------------------ */
function QuotesPage({ onSelectQuote }: { onSelectQuote: (id: string) => void }) {
  const [search, setSearch] = useState('');
  const filtered = MOCK_QUOTES.filter(q =>
    !search || q.id.toLowerCase().includes(search.toLowerCase()) || q.name.toLowerCase().includes(search.toLowerCase()) || q.email.toLowerCase().includes(search.toLowerCase()) || q.status.toLowerCase().includes(search.toLowerCase())
  );

  const quoteStatusColor = (s: string) => {
    switch (s) {
      case 'Wacht op prijsvoorstel': return ACCENT;
      case 'Wacht op akkoord': return BLUE;
      case 'Controleren': return '#F59E0B';
      case 'Uitbetalen': return GREEN;
      case 'Afgekeurd': return RED;
      case 'Afgerond': return GREEN;
      default: return GREY;
    }
  };

  return (
    <div>
      <SectionHeader title="Quotes" description={`${MOCK_QUOTES.length} quotes totaal`} />
      <input
        type="text"
        placeholder="Zoek op quotenummer, naam, email, status..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ ...inputStyle, width: '100%', padding: '14px 18px', fontSize: 15, boxSizing: 'border-box', marginBottom: 20, borderRadius: 10 }}
      />
      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Quotenummer</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Naam</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Bedrijf</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Aangemaakt</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Status</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'center' }}>Sell</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'center' }}>Buy</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((q) => (
                <tr key={q.id} onClick={() => onSelectQuote(q.id)} style={{ cursor: 'pointer' }}>
                  <td style={{ ...tableCellStyle, fontWeight: 600, color: ACCENT }}>{q.id}</td>
                  <td style={{ ...tableCellStyle, fontWeight: 500 }}>{q.name}</td>
                  <td style={{ ...tableCellStyle, fontSize: 12, color: GREY }}>{q.bedrijf}</td>
                  <td style={{ ...tableCellStyle, fontSize: 12 }}>{q.created}</td>
                  <td style={tableCellStyle}>
                    <Badge color={quoteStatusColor(q.status)} bg={quoteStatusColor(q.status) + '18'}>{q.status}</Badge>
                  </td>
                  <td style={{ ...tableCellStyle, textAlign: 'center', fontWeight: 600 }}>{q.sellCount}</td>
                  <td style={{ ...tableCellStyle, textAlign: 'center', fontWeight: 600 }}>{q.buyCount}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ ...tableCellStyle, textAlign: 'center', padding: 40, color: GREY }}>Geen quotes gevonden.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Quote Detail Page                                                  */
/* ------------------------------------------------------------------ */
function QuoteDetailPage({ quoteId, onBack }: { quoteId: string; onBack: () => void }) {
  const quote = MOCK_QUOTES.find((q) => q.id === quoteId) || MOCK_QUOTES[0];
  const isQTE2 = quoteId === 'QTE000002';

  const priceInputWrapper: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'stretch',
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    overflow: 'hidden',
    height: 34,
  };

  const euroPrefix: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 8px',
    background: SURFACE,
    color: GREY,
    fontSize: 13,
    borderRight: `1px solid ${BORDER}`,
    fontWeight: 500,
  };

  const priceInput: React.CSSProperties = {
    border: 'none',
    outline: 'none',
    padding: '0 8px',
    fontSize: 13,
    width: 80,
    fontFamily: 'inherit',
  };

  const inruilRows = isQTE2
    ? [
        { variant: 'Canon EOS R5 Body', conditie: 'A', inkoopprijs: '1850.00', verkoopprijs: '2199.00', btw: '21%' },
        { variant: 'Canon RF 50mm f/1.2L USM', conditie: 'B+', inkoopprijs: '1450.00', verkoopprijs: '1699.00', btw: '21%' },
      ]
    : [
        { variant: 'Sony A7 IV Body', conditie: 'A', inkoopprijs: '1350.00', verkoopprijs: '1599.00', btw: '21%' },
      ];

  return (
    <div>
      {/* Back link */}
      <button
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: ACCENT,
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          padding: 0,
          marginBottom: 16,
          fontFamily: 'inherit',
        }}
      >
        &larr; Alle quotes
      </button>

      {/* Header with cognito toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: DARK, margin: 0 }}>{quote.id}</h2>
        <button style={buttonOutline}>Cognito modus</button>
      </div>

      {/* 3-column top section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 24 }}>
        {/* Quotegegevens */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: DARK, margin: '0 0 12px' }}>Quotegegevens</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: GREY }}>Quotenummer</span><span style={{ fontWeight: 500 }}>{quote.id}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: GREY }}>Aangemaakt</span><span>{quote.created}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: GREY }}>Prijs totaal</span><span style={{ fontWeight: 600 }}>&euro; 0,00</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: GREY }}>Status</span><Badge color={ACCENT}>{quote.status}</Badge></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: GREY }}>Betaalstatus</span><Badge color={BLUE}>Openstaand</Badge></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: GREY }}>Verzendstatus</span><Badge color={GREY}>Niet verzonden</Badge></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: GREY }}>Ordernummer</span><span>\u2014</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: GREY }}>Actieve gebruiker</span><span>\u2014</span></div>
          </div>
        </div>

        {/* Klantgegevens */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: DARK, margin: 0 }}>Klantgegevens</h3>
            <button style={{ background: 'none', border: 'none', color: ACCENT, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Aanpassen</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: GREY }}>Naam</span><span>{quote.name}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: GREY }}>Email</span><span style={{ fontSize: 12 }}>{quote.email}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: GREY }}>Tel</span><span>\u2014</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: GREY }}>QTE Business</span><span>Nee</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: GREY }}>Adres</span><span>\u2014</span></div>
          </div>
        </div>

        {/* Offerte panel */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: DARK, margin: '0 0 12px' }}>Offerte</h3>
          <div style={{ fontSize: 13, color: GREY, marginBottom: 16 }}>Status: <Badge color={ACCENT}>{quote.status}</Badge></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button style={buttonAccent}>Offerte verzenden</button>
            <button style={buttonOutline}>Download offerte</button>
            <button style={buttonOutline}>Labels afdrukken</button>
            <button style={{ ...buttonOutline, color: RED, borderColor: RED }}>Offerte afwijzen</button>
          </div>
        </div>
      </div>

      {/* Inruil section */}
      <div style={{ ...cardStyle, marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: DARK, margin: '0 0 14px' }}>Inruil</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead>
              <tr>
                {['Variant', 'Conditie', 'Inkoopprijs', 'Verkoopprijs', 'BTW', 'Afwijzen', 'Gewijzigd'].map((h) => (
                  <th key={h} style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inruilRows.map((row, i) => (
                <tr key={i}>
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: GREEN, flexShrink: 0 }} />
                      <span style={{ color: ACCENT, fontWeight: 500, cursor: 'pointer' }}>{row.variant}</span>
                    </div>
                  </td>
                  <td style={tableCellStyle}>{row.conditie}</td>
                  <td style={tableCellStyle}>
                    <div style={priceInputWrapper}>
                      <span style={euroPrefix}>&euro;</span>
                      <input type="text" defaultValue={row.inkoopprijs} style={priceInput} />
                    </div>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={priceInputWrapper}>
                      <span style={euroPrefix}>&euro;</span>
                      <input type="text" defaultValue={row.verkoopprijs} style={priceInput} />
                    </div>
                  </td>
                  <td style={tableCellStyle}>{row.btw}</td>
                  <td style={tableCellStyle}>
                    <button style={{ background: 'none', border: 'none', color: RED, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Afwijzen</button>
                  </td>
                  <td style={{ ...tableCellStyle, color: GREY, fontSize: 12 }}>\u2014</td>
                </tr>
              ))}
              <tr>
                <td colSpan={7} style={{ ...tableCellStyle, color: ACCENT, fontWeight: 500, cursor: 'pointer', fontSize: 13 }}>+ Product toevoegen</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Verkoop section */}
      <div style={{ ...cardStyle, marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: DARK, margin: '0 0 14px' }}>Verkoop</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead>
              <tr>
                {['Variant', 'Conditie', 'Inkoopprijs', 'Verkoopprijs', 'BTW', 'Afwijzen', 'Gewijzigd'].map((h) => (
                  <th key={h} style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} style={{ ...tableCellStyle, color: ACCENT, fontWeight: 500, cursor: 'pointer', fontSize: 13 }}>+ Product toevoegen</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Overzicht summary */}
      <div style={{ ...cardStyle, marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: DARK, margin: '0 0 14px' }}>OVERZICHT</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, maxWidth: 340 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: GREY }}>Subtotaal inkoop</span><span>&euro; 0,00</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}><span>Totaal inkoop</span><span>&euro; 0,00</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: GREY }}>Subtotaal aankoop</span><span>&euro; 0,00</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}><span>Totaal aankoop</span><span>&euro; 0,00</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, padding: '8px 0', borderTop: `1px solid ${BORDER}` }}>
            <span style={{ color: ACCENT, fontWeight: 700 }}>Gratis ruil</span>
            <span style={{ color: ACCENT, fontWeight: 700 }}>&euro; 0,00</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <button style={buttonDark}>Opslaan</button>
        <button style={buttonAccent}>Betaling</button>
      </div>

      {/* Quote notes */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: DARK, margin: '0 0 12px' }}>Quote notes</h3>
        <textarea
          placeholder="Notities toevoegen..."
          style={{
            ...inputStyle,
            width: '100%',
            boxSizing: 'border-box',
            minHeight: 100,
            resize: 'vertical',
          }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Placeholder Page                                                   */
/* ------------------------------------------------------------------ */
function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <SectionHeader title={title} description={description} />
      <div style={{ ...cardStyle, textAlign: 'center', padding: 80, color: GREY }}>
        <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>&#128679;</div>
        <div style={{ fontSize: 15, fontWeight: 500 }}>Coming soon</div>
        <div style={{ fontSize: 13, marginTop: 4 }}>Deze pagina wordt binnenkort beschikbaar.</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN DASHBOARD COMPONENT                                           */
/* ------------------------------------------------------------------ */
export default function AdminDashboard() {
  const { isLoggedIn, isAdmin, hydrated } = useAuth();
  const dashboardRouter = useRouter();

  // Auth guard disabled for design export preview
  // useEffect(() => {
  //   if (hydrated && (!isLoggedIn || !isAdmin)) {
  //     dashboardRouter.push('/login');
  //   }
  // }, [hydrated, isLoggedIn, isAdmin, dashboardRouter]);

  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavClick = (key: string) => {
    setActiveSection(key);
    setSelectedQuote(null);
    setSelectedOrder(null);
    setSidebarOpen(false);
  };

  const sections: { key: string; content: React.ReactNode }[] = [
    { key: 'overzicht', content: <DashboardPage /> },
    { key: 'dashboard', content: <DashboardPage /> },
    { key: 'producten', content: <ProductenPage /> },
    { key: 'varianten', content: <VariantenPage /> },
    { key: 'categories', content: <CategoriesPage /> },
    { key: 'orders', content: <OrdersPage onSelectOrder={(id) => setSelectedOrder(id)} /> },
    { key: 'quotes', content: <QuotesPage onSelectQuote={(id) => setSelectedQuote(id)} /> },
    { key: 'verkoop-rapport', content: <PlaceholderPage title="Verkoop rapport" description="Bekijk verkooprapporten en statistieken." /> },
    { key: 'reparaties', content: <PlaceholderPage title="Reparaties" description="Beheer reparatie-orders en statussen." /> },
    { key: 'kasboek', content: <PlaceholderPage title="Kasboek" description="Volledig kasboek overzicht." /> },
    { key: 'reserveringen', content: <PlaceholderPage title="Reserveringen" description="Beheer productreserveringen." /> },
    { key: 'klanten', content: <PlaceholderPage title="Klanten" description="Klantenoverzicht en -beheer." /> },
    { key: 'incomplete-varianten', content: <PlaceholderPage title="Incomplete varianten" description="Varianten die nog aangevuld moeten worden." /> },
    { key: 'accountinstellingen', content: <PlaceholderPage title="Accountinstellingen" description="Beheer je accountinstellingen." /> },
    { key: 'sandbox', content: <PlaceholderPage title="Sandbox" description="Test- en ontwikkelomgeving." /> },
  ];

  const renderContent = () => {
    if (activeSection === 'quotes' && selectedQuote) {
      return (
        <QuoteDetailPage
          quoteId={selectedQuote}
          onBack={() => setSelectedQuote(null)}
        />
      );
    }

    if (activeSection === 'orders' && selectedOrder) {
      return (
        <OrderDetailPage
          ordernummer={selectedOrder}
          onBack={() => setSelectedOrder(null)}
        />
      );
    }

    return (
      <>
        {sections.map(s => (
          <div
            key={s.key}
            data-section={s.key}
            style={{ display: (activeSection === s.key || (activeSection === 'overzicht' && s.key === 'dashboard')) ? 'block' : 'none' }}
          >
            {s.content}
          </div>
        ))}
      </>
    );
  };

  return (
    <div style={{ minHeight: '80vh' }}>
      {/* Mobile nav toggle */}
      <div style={{
        display: 'none',
        padding: '12px 16px',
        borderBottom: `1px solid ${BORDER}`,
        background: WHITE,
      }}
        className="dashboard-mobile-toggle"
      >
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: 'none',
            border: `1px solid ${BORDER}`,
            borderRadius: 8,
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'inherit',
            color: DARK,
          }}
        >
          &#9776; Menu
        </button>
      </div>

      <div style={{ display: 'flex', minHeight: '80vh' }}>
        {/* Sidebar */}
        <aside
          style={{
            width: 260,
            minWidth: 260,
            background: WHITE,
            borderRight: `1px solid ${BORDER}`,
            display: 'flex',
            flexDirection: 'column',
            padding: '24px 0',
            overflowY: 'auto',
            position: 'relative',
          }}
          className="dashboard-sidebar"
        >
          <div style={{ padding: '0 20px', marginBottom: 20 }}>
            <div style={{
              fontSize: 10,
              fontWeight: 600,
              textTransform: 'uppercase',
              color: GREY,
              letterSpacing: '1px',
              marginBottom: 8,
            }}>
              VERKOPERSOMGEVING
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: DARK, marginBottom: 4 }}>Dashboard</div>
            <div style={{ fontSize: 12, color: GREY, lineHeight: 1.5 }}>
              Beheer je producten, orders en quotes vanuit &eacute;&eacute;n overzicht.
            </div>
          </div>

          <nav style={{ flex: 1 }}>
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '9px 20px',
                    border: 'none',
                    borderLeft: isActive ? `3px solid ${ACCENT}` : '3px solid transparent',
                    background: isActive ? ACCENT_BG : 'transparent',
                    color: isActive ? ACCENT : DARK,
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}
                >
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span style={{
                      background: ACCENT,
                      color: WHITE,
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 999,
                      minWidth: 18,
                      textAlign: 'center',
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div style={{
            padding: '16px 20px',
            borderTop: `1px solid ${BORDER}`,
            fontSize: 12,
            color: GREY,
          }}>
            Aangemeld als <span style={{ fontWeight: 600, color: DARK }}>admin</span>
          </div>
        </aside>

        {/* Main content */}
        <main style={{
          flex: 1,
          background: SURFACE,
          padding: 28,
          overflowY: 'auto',
          minWidth: 0,
        }}>
          {renderContent()}
        </main>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .dashboard-mobile-toggle {
            display: block !important;
          }
          .dashboard-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: ${sidebarOpen ? '0' : '-280px'} !important;
            height: 100vh !important;
            z-index: 1000 !important;
            box-shadow: ${sidebarOpen ? '4px 0 20px rgba(0,0,0,0.1)' : 'none'} !important;
            transition: left 0.3s ease !important;
          }
        }
      `}</style>
    </div>
  );
}

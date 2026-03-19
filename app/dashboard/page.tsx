'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  { name: 'Venus Laowa 9mm T2.9 Zero-D', brand: 'Laowa', type: 'Cinema' as const, category: 'Cinema / Cine Lenzen / Laowa', multipleStock: false, stock: 1, active: true, hardloper: false },
  { name: 'Z CAM E2-S6 Super 35mm 6K', brand: 'Z CAM', type: 'Cinema' as const, category: 'Cinema / Cine Camera\'s / Z CAM', multipleStock: false, stock: 0, active: true, hardloper: false },
  { name: 'Canon EOS R5', brand: 'Canon', type: 'Camera' as const, category: 'Camera\'s / Mirrorless / Canon RF', multipleStock: true, stock: 4, active: true, hardloper: true },
  { name: 'Nikon Z6 III', brand: 'Nikon', type: 'Camera' as const, category: 'Camera\'s / Mirrorless / Nikon Z', multipleStock: true, stock: 2, active: true, hardloper: false },
  { name: 'Sony A7 IV', brand: 'Sony', type: 'Camera' as const, category: 'Camera\'s / Mirrorless / Sony E/FE', multipleStock: true, stock: 3, active: true, hardloper: true },
  { name: 'Fujifilm X-T5', brand: 'Fujifilm', type: 'Camera' as const, category: 'Camera\'s / Mirrorless / Fujifilm X', multipleStock: false, stock: 1, active: true, hardloper: true },
  { name: 'Sigma 35mm f/1.4 DG DN Art', brand: 'Sigma', type: 'Lens' as const, category: 'Lenzen / Mirrorless / L-Mount', multipleStock: false, stock: 1, active: true, hardloper: false },
  { name: 'Tamron 28-75mm f/2.8 Di III VXD G2', brand: 'Tamron', type: 'Lens' as const, category: 'Lenzen / Mirrorless / Sony E/FE', multipleStock: false, stock: 0, active: false, hardloper: false },
  { name: 'Canon RF 50mm f/1.2L USM', brand: 'Canon', type: 'Lens' as const, category: 'Lenzen / Mirrorless / Canon RF', multipleStock: true, stock: 2, active: true, hardloper: false },
  { name: 'Nikon NIKKOR Z 24-70mm f/2.8 S', brand: 'Nikon', type: 'Lens' as const, category: 'Lenzen / Mirrorless / Nikon Z', multipleStock: false, stock: 1, active: true, hardloper: false },
  { name: 'Sony FE 70-200mm f/2.8 GM OSS II', brand: 'Sony', type: 'Lens' as const, category: 'Lenzen / Mirrorless / Sony E/FE', multipleStock: true, stock: 3, active: true, hardloper: true },
  { name: 'Panasonic Lumix S5 IIX', brand: 'Panasonic', type: 'Camera' as const, category: 'Camera\'s / Mirrorless / L-Mount', multipleStock: false, stock: 0, active: false, hardloper: false },
  { name: 'Leica Q3', brand: 'Leica', type: 'Camera' as const, category: 'Camera\'s / Compact / Leica', multipleStock: false, stock: 1, active: true, hardloper: false },
  { name: 'Hasselblad X2D 100C', brand: 'Hasselblad', type: 'Camera' as const, category: 'Camera\'s / Medium Format / Hasselblad', multipleStock: false, stock: 1, active: true, hardloper: false },
  { name: 'Olympus OM-1 Mark II', brand: 'Olympus', type: 'Camera' as const, category: 'Camera\'s / Mirrorless / Micro Four Thirds', multipleStock: false, stock: 0, active: false, hardloper: false },
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
  { ordernummer: 'CT028945', factuurnummer: 'INV062569', prijs: 3448, datum: '09-03-2026', laatsteFactuur: '09-03-2026 14:32', naam: 'Adriaan Raesen', email: 'adriaan@raesen.nl', tel: '06-12345678', bedrijf: 'Raesen Fotografie', isBusiness: true, status: 'Verzonden', betaalstatus: 'Betaald' as const, betaalmethode: 'Pin', herkomst: 'Quote' as const, nieuwsbrief: false, adres: 'Meeuwenhof 23\n5103KD\nDongen\nNederland', orderregels: [{ variant: 'Canon EOS R5 Body — Als nieuw', type: 'Verkoop', inkoopprijs: 1850, verkoopprijs: 2199, btw: 'Marge' }, { variant: 'Canon RF 24-70mm f/2.8L IS USM — Uitstekend', type: 'Verkoop', inkoopprijs: 1200, verkoopprijs: 1549, btw: '21%' }, { variant: 'Sony A7 III Body — Goed', type: 'Inkoop', inkoopprijs: 650, verkoopprijs: 0, btw: '0%' }] },
  { ordernummer: 'CT028944', factuurnummer: 'INV062568', prijs: 1599, datum: '08-03-2026', laatsteFactuur: '08-03-2026 10:15', naam: 'Maria Jansen', email: 'maria@fotostudio.nl', tel: '06-98765432', bedrijf: 'Fotostudio Amsterdam', isBusiness: true, status: 'In behandeling', betaalstatus: 'Betaald' as const, betaalmethode: 'Pin', herkomst: 'Quote' as const, nieuwsbrief: true, adres: 'Herengracht 45\n1015 BA\nAmsterdam\nNederland', orderregels: [{ variant: 'Sony A7 IV Body — Uitstekend', type: 'Verkoop', inkoopprijs: 1200, verkoopprijs: 1449, btw: '21%' }, { variant: 'Sony FE 24-70mm f/2.8 GM', type: 'Inkoop', inkoopprijs: 150, verkoopprijs: 0, btw: '0%' }] },
  { ordernummer: 'CT028943', factuurnummer: 'INV062567', prijs: 4899, datum: '08-03-2026', laatsteFactuur: '08-03-2026 09:41', naam: 'Peter van der Berg', email: 'peter.berg@gmail.com', tel: '—', bedrijf: '—', isBusiness: false, status: 'Verzonden', betaalstatus: 'Betaald' as const, betaalmethode: 'iDEAL', herkomst: 'Online' as const, nieuwsbrief: false, adres: 'Meeuwenhof 23\n5103KD\nDongen\nNederland', orderregels: [{ variant: 'Leica Q3 — Als nieuw', type: 'Verkoop', inkoopprijs: 4200, verkoopprijs: 4899, btw: 'Marge' }] },
  { ordernummer: 'CT028942', factuurnummer: 'INV062566', prijs: 599, datum: '07-03-2026', laatsteFactuur: '07-03-2026 16:22', naam: 'Lisa Bakker', email: 'lisa@bakker.nl', tel: '06-11223344', bedrijf: '—', isBusiness: false, status: 'Afgerond', betaalstatus: 'Betaald' as const, betaalmethode: 'Bankoverschrijving', herkomst: 'Online' as const, nieuwsbrief: true, adres: 'Dorpsstraat 8\n3421 AB\nOudewater\nNederland', orderregels: [{ variant: 'Sigma 35mm f/1.4 DG DN Art — Als nieuw', type: 'Verkoop', inkoopprijs: 450, verkoopprijs: 599, btw: 'Marge' }] },
  { ordernummer: 'CT028941', factuurnummer: 'INV062565', prijs: 3598, datum: '07-03-2026', laatsteFactuur: '', naam: 'Thomas Visser', email: 'thomas@visserfotografie.nl', tel: '06-55667788', bedrijf: 'Visser Fotografie', isBusiness: true, status: 'In behandeling', betaalstatus: 'Openstaand' as const, betaalmethode: 'Pin', herkomst: 'Store' as const, nieuwsbrief: false, adres: 'Industrieweg 12\n2600 AA\nDelft\nNederland', orderregels: [{ variant: 'Canon EOS R5 Body — Uitstekend', type: 'Verkoop', inkoopprijs: 1650, verkoopprijs: 1999, btw: '21%' }, { variant: 'Canon RF 50mm f/1.2L USM — Als nieuw', type: 'Verkoop', inkoopprijs: 1500, verkoopprijs: 1799, btw: 'Marge' }] },
  { ordernummer: 'CT028940', factuurnummer: 'INV062564', prijs: 1899, datum: '06-03-2026', laatsteFactuur: '06-03-2026 11:05', naam: 'Emma de Groot', email: 'emma.degroot@mail.nl', tel: '—', bedrijf: '—', isBusiness: false, status: 'Verzonden', betaalstatus: 'Betaald' as const, betaalmethode: 'iDEAL', herkomst: 'Online' as const, nieuwsbrief: false, adres: 'Plein 1945 nr 7\n5211 EA\nDen Bosch\nNederland', orderregels: [{ variant: 'Nikon Z6 III Body — Als nieuw', type: 'Verkoop', inkoopprijs: 1600, verkoopprijs: 1899, btw: '21%' }] },
  { ordernummer: 'CT028939', factuurnummer: 'INV062563', prijs: 6499, datum: '06-03-2026', laatsteFactuur: '', naam: 'Rick Mulder', email: 'rick@studiomulder.nl', tel: '06-99887766', bedrijf: 'Studio Mulder B.V.', isBusiness: true, status: 'Nieuw', betaalstatus: 'Openstaand' as const, betaalmethode: 'Bankoverschrijving', herkomst: 'Online' as const, nieuwsbrief: true, adres: 'Lavendelweg 5\n3016 DK\nRotterdam\nNederland', orderregels: [{ variant: 'Hasselblad X2D 100C — Als nieuw', type: 'Verkoop', inkoopprijs: 5800, verkoopprijs: 6499, btw: 'Marge' }] },
  { ordernummer: 'CT028938', factuurnummer: 'INV062562', prijs: 1449, datum: '05-03-2026', laatsteFactuur: '05-03-2026 15:30', naam: 'Sophie Hendriks', email: 'sophie.h@outlook.com', tel: '06-44332211', bedrijf: '—', isBusiness: false, status: 'Afgerond', betaalstatus: 'Betaald' as const, betaalmethode: 'iDEAL', herkomst: 'Online' as const, nieuwsbrief: false, adres: 'Brinkstraat 19\n7411 HR\nDeventer\nNederland', orderregels: [{ variant: 'Sony A7 IV Body — Uitstekend', type: 'Verkoop', inkoopprijs: 1200, verkoopprijs: 1449, btw: '21%' }] },
  { ordernummer: 'CT028937', factuurnummer: 'INV062561', prijs: 2349, datum: '05-03-2026', laatsteFactuur: '', naam: 'David Smit', email: 'david.smit@gmail.com', tel: '—', bedrijf: '—', isBusiness: false, status: 'In behandeling', betaalstatus: 'Openstaand' as const, betaalmethode: 'Pin', herkomst: 'Store' as const, nieuwsbrief: false, adres: 'Markt 3\n6211 CK\nMaastricht\nNederland', orderregels: [{ variant: 'Canon EOS R5 Body — Als nieuw', type: 'Verkoop', inkoopprijs: 1950, verkoopprijs: 2349, btw: 'Marge' }] },
  { ordernummer: 'CT028936', factuurnummer: 'INV062560', prijs: 1799, datum: '04-03-2026', laatsteFactuur: '04-03-2026 09:12', naam: 'Anna Bos', email: 'anna@bosmedia.nl', tel: '06-77889900', bedrijf: 'Bos Media', isBusiness: true, status: 'Afgerond', betaalstatus: 'Betaald' as const, betaalmethode: 'iDEAL', herkomst: 'Online' as const, nieuwsbrief: true, adres: 'Stationsplein 1\n3511 ED\nUtrecht\nNederland', orderregels: [{ variant: 'Canon RF 50mm f/1.2L USM — Als nieuw', type: 'Verkoop', inkoopprijs: 1500, verkoopprijs: 1799, btw: 'Marge' }] },
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
function Badge({ children, color = ACCENT, bg, solid }: { children: React.ReactNode; color?: string; bg?: string; solid?: boolean }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 600,
      color: solid ? WHITE : color,
      background: bg || (solid ? color : (color === ACCENT ? ACCENT_BG : color === GREEN ? '#DCFCE7' : color === BLUE ? '#DBEAFE' : color === RED ? '#FEE2E2' : '#F3F4F6')),
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
/*  Activity Log component                                             */
/* ------------------------------------------------------------------ */
function ActivityLog({ entries }: { entries: { date: string; user: string; action: string }[] }) {
  return (
    <div style={{ ...cardStyle, marginTop: 20 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 16 }}>Activiteitenlog</h3>
      <div style={{ maxHeight: 240, overflowY: 'auto' }}>
        {entries.map((e, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: i < entries.length - 1 ? `1px solid ${BORDER}` : 'none', fontSize: 13 }}>
            <span style={{ color: GREY, fontSize: 12, minWidth: 130, flexShrink: 0 }}>{e.date}</span>
            <span style={{ fontWeight: 600, color: DARK, minWidth: 80, flexShrink: 0 }}>{e.user}</span>
            <span style={{ color: GREY }}>{e.action}</span>
          </div>
        ))}
        {entries.length === 0 && <div style={{ color: GREY, fontSize: 13, padding: 12, textAlign: 'center' }}>Geen activiteit.</div>}
      </div>
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
        <KPICard label="Kas saldo" value="€1.245,50" />
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
  const [merkFilter, setMerkFilter] = useState('');
  const brands = [...new Set(MOCK_PRODUCTS.map(p => p.brand))].sort();
  const filtered = MOCK_PRODUCTS.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.brand.toLowerCase().includes(search.toLowerCase())) return false;
    if (merkFilter && p.brand.toLowerCase() !== merkFilter.toLowerCase()) return false;
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: DARK, margin: 0 }}>Producten</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button style={{ ...buttonOutline, borderColor: ACCENT, color: ACCENT }}>Product toevoegen</button>
          <select value={merkFilter} onChange={e => setMerkFilter(e.target.value)} style={selectStyle}>
            <option value="">Merk</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <input type="text" placeholder="Zoeken..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, width: 180 }} />
        </div>
      </div>
      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Titel</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Merk</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Hardloper</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Meervoudige voorraad</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Verkoopbare voorraad</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, width: 40 }} />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={i} style={{ cursor: 'pointer' }}>
                  <td style={{ ...tableCellStyle, fontWeight: 500 }}>{p.name}</td>
                  <td style={{ ...tableCellStyle, color: p.brand ? undefined : GREY }}>{p.brand || '\u2014'}</td>
                  <td style={tableCellStyle}>{p.hardloper ? 'Ja' : 'Nee'}</td>
                  <td style={tableCellStyle}>{p.multipleStock ? 'Ja' : 'Nee'}</td>
                  <td style={tableCellStyle}>{p.stock}</td>
                  <td style={{ ...tableCellStyle, color: GREY, cursor: 'pointer', textAlign: 'center' }}>&bull;&bull;&bull;</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ ...tableCellStyle, textAlign: 'center', padding: 40, color: GREY }}>Geen producten gevonden.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ActivityLog entries={[
        { date: '17-03-2026 09:14', user: 'Bart', action: 'Canon EOS R5 gemarkeerd als hardloper' },
        { date: '15-03-2026 11:30', user: 'Mike', action: 'Tamron 28-75mm f/2.8 Di III VXD G2 gedeactiveerd' },
        { date: '12-03-2026 14:22', user: 'Bart', action: 'Panasonic Lumix S5 IIX gedeactiveerd — geen voorraad' },
        { date: '10-03-2026 08:45', user: 'System', action: 'Olympus OM-1 Mark II automatisch gedeactiveerd — 30 dagen geen voorraad' },
      ]} />
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
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'right' }}>Dagen</th>
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
                  <td style={{ ...tableCellStyle, textAlign: 'right', fontWeight: 500 }}>{v.verkoopprijs > 0 ? `€ ${v.verkoopprijs.toLocaleString('nl-NL')}` : '\u2014'}</td>
                  <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                    <Badge color={v.btw === 'Marge' ? ACCENT : BLUE} bg={v.btw === 'Marge' ? ACCENT_BG : '#DBEAFE'}>{v.btw}</Badge>
                  </td>
                  <td style={{ ...tableCellStyle, fontSize: 12, color: GREY }}>{v.inkoopdatum}</td>
                  <td style={{ ...tableCellStyle, textAlign: 'right', fontWeight: 500 }}>{(() => {
                    const parts = v.inkoopdatum.split('-');
                    const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                    const days = Math.floor((new Date(2026, 2, 17).getTime() - d.getTime()) / 86400000);
                    return <span style={{ color: days > 60 ? RED : days > 30 ? '#F59E0B' : GREEN }}>{days}d</span>;
                  })()}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={12} style={{ ...tableCellStyle, textAlign: 'center', padding: 40, color: GREY }}>Geen varianten gevonden.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ActivityLog entries={[
        { date: '17-03-2026 10:05', user: 'Bart', action: 'SKU 21304 — Status gewijzigd naar Verkoopbaar' },
        { date: '16-03-2026 16:40', user: 'Mike', action: 'SKU 21305 — Verkoopprijs gewijzigd van €2.099 naar €1.999' },
        { date: '16-03-2026 14:12', user: 'System', action: 'SKU 18743 — Status automatisch naar Afbeelding afwachten' },
        { date: '15-03-2026 09:30', user: 'Bart', action: 'SKU 04400 — Status gewijzigd naar Defect' },
        { date: '14-03-2026 11:20', user: 'Mike', action: 'SKU 21481 — Status gewijzigd naar Kwijt, locatie gewist' },
      ]} />
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
  const [selected, setSelected] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState('');
  const [sortField, setSortField] = useState<string>('datum');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filtered = MOCK_ORDERS.filter(o => {
    if (search && !o.ordernummer.toLowerCase().includes(search.toLowerCase()) && !o.factuurnummer.toLowerCase().includes(search.toLowerCase()) && !o.naam.toLowerCase().includes(search.toLowerCase()) && !o.bedrijf.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeFilter && o.status !== activeFilter) return false;
    return true;
  });

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

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };
  const toggleAll = () => {
    if (selected.length === sorted.length) setSelected([]);
    else setSelected(sorted.map(o => o.ordernummer));
  };

  const SortIcon = ({ field }: { field: string }) => (
    <span style={{ marginLeft: 4, fontSize: 10, opacity: sortField === field ? 1 : 0.3 }}>
      {sortField === field ? (sortDir === 'asc' ? '\u25B2' : '\u25BC') : '\u2195'}
    </span>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: DARK, margin: 0 }}>Orders</h2>
          {activeFilter && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: ACCENT_BG, color: ACCENT, fontSize: 12, borderRadius: 999 }}>
              {activeFilter}
              <button onClick={() => setActiveFilter('')} style={{ background: 'none', border: 'none', color: ACCENT, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, padding: 0 }}>&times;</button>
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: GREY }}>{selected.length} geselecteerd</span>
          <button style={{ ...buttonOutline, opacity: selected.length > 0 ? 1 : 0.5, fontSize: 12, padding: '8px 14px' }} disabled={selected.length === 0}>Pakbonnen downloaden</button>
          <button style={{ ...buttonOutline, opacity: selected.length > 0 ? 1 : 0.5, fontSize: 12, padding: '8px 14px' }} disabled={selected.length === 0}>Verzendlabels aanmaken</button>
          <input type="text" placeholder="Zoeken..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, width: 180 }} />
        </div>
      </div>
      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, width: 40 }}>
                  <input type="checkbox" checked={selected.length === sorted.length && sorted.length > 0} onChange={toggleAll} style={{ cursor: 'pointer' }} />
                </th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left', cursor: 'pointer' }} onClick={() => toggleSort('ordernummer')}>
                  Ordernummer <SortIcon field="ordernummer" />
                </th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Factuurnummer</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Prijs</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left', cursor: 'pointer' }} onClick={() => toggleSort('datum')}>
                  Datum <SortIcon field="datum" />
                </th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Naam</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Bedrijf</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Orderstatus</th>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, width: 40 }} />
              </tr>
            </thead>
            <tbody>
              {sorted.map((o, i) => (
                <tr key={i} style={{ cursor: 'pointer' }} onClick={() => onSelectOrder(o.ordernummer)}>
                  <td style={tableCellStyle} onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selected.includes(o.ordernummer)} onChange={() => toggleSelect(o.ordernummer)} style={{ cursor: 'pointer' }} />
                  </td>
                  <td style={{ ...tableCellStyle, fontWeight: 600, color: ACCENT }}>{o.ordernummer}</td>
                  <td style={{ ...tableCellStyle, fontSize: 12, color: GREY }}>{o.factuurnummer}</td>
                  <td style={tableCellStyle}>&euro; {o.prijs.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</td>
                  <td style={{ ...tableCellStyle, fontSize: 12 }}>{o.datum}</td>
                  <td style={{ ...tableCellStyle, fontWeight: 500 }}>{o.naam}</td>
                  <td style={{ ...tableCellStyle, fontSize: 12, color: o.bedrijf === '\u2014' ? GREY : undefined }}>{o.bedrijf}</td>
                  <td style={tableCellStyle}>
                    <Badge color={orderStatusColor(o.status)} bg={orderStatusColor(o.status) + '18'}>{o.status}</Badge>
                  </td>
                  <td style={{ ...tableCellStyle, color: GREY, cursor: 'pointer', textAlign: 'center' }} onClick={e => e.stopPropagation()}>&bull;&bull;&bull;</td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr><td colSpan={9} style={{ ...tableCellStyle, textAlign: 'center', padding: 40, color: GREY }}>Geen orders gevonden.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ActivityLog entries={[
        { date: '17-03-2026 09:14', user: 'System', action: 'CT028945 — Factuur verstuurd naar adriaan@raesen.nl' },
        { date: '16-03-2026 15:22', user: 'Bart', action: 'CT028945 — Status gewijzigd naar Verzonden' },
        { date: '16-03-2026 14:32', user: 'System', action: 'CT028945 — Verzendlabel aangemaakt via PostNL' },
        { date: '09-03-2026 14:32', user: 'System', action: 'CT028945 — Betaling ontvangen via Pin' },
        { date: '09-03-2026 14:30', user: 'Bart', action: 'CT028945 — Order aangemaakt vanuit QUE-00001' },
      ]} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Order Detail Page                                                  */
/* ------------------------------------------------------------------ */
function OrderDetailPage({ ordernummer, onBack }: { ordernummer: string; onBack: () => void }) {
  const order = MOCK_ORDERS.find(o => o.ordernummer === ordernummer) || MOCK_ORDERS[0];
  const [showCreditForm, setShowCreditForm] = useState(false);
  const [creditConfirmed, setCreditConfirmed] = useState(false);
  const [creditSelected, setCreditSelected] = useState<Set<number>>(new Set());
  const [creditVerzendkosten, setCreditVerzendkosten] = useState(false);
  const [creditBetaalkosten, setCreditBetaalkosten] = useState(false);
  const [creditNewProducts, setCreditNewProducts] = useState<{ name: string; price: string }[]>([]);

  const addNewProduct = () => setCreditNewProducts(prev => [...prev, { name: '', price: '' }]);
  const updateNewProduct = (idx: number, field: 'name' | 'price', value: string) => {
    setCreditNewProducts(prev => prev.map((p, i) => i === idx ? { ...p, [field]: field === 'price' ? value.replace(/[^\d.,]/g, '') : value } : p));
  };
  const removeNewProduct = (idx: number) => setCreditNewProducts(prev => prev.filter((_, i) => i !== idx));

  const validNewProducts = creditNewProducts.filter(p => p.name && p.price && parseFloat(p.price) > 0);
  const hasExchange = validNewProducts.length > 0;
  const newProductsTotal = validNewProducts.reduce((sum, p) => sum + parseFloat(p.price || '0'), 0);
  const credNr = 'CRED-00012';
  const excNr = 'EXC-00003';
  const newOrdNr = 'CT028946';

  const infoRow = (label: string, value: string | React.ReactNode) => (
    <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: DARK, minWidth: 160 }}>{label}</span>
      <span style={{ fontSize: 13, color: GREY }}>{value}</span>
    </div>
  );

  const refLink = (ref: string, color: string = ACCENT) => (
    <span style={{ color, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>{ref}</span>
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

  const resetCreditForm = () => {
    setShowCreditForm(false);
    setCreditConfirmed(false);
    setCreditSelected(new Set());
    setCreditVerzendkosten(false);
    setCreditBetaalkosten(false);
    setCreditNewProducts([]);
  };

  const creditTotal = (() => {
    let total = 0;
    creditSelected.forEach(idx => {
      const r = order.orderregels[idx];
      if (r) total -= (r.type === 'Verkoop' ? r.verkoopprijs : r.inkoopprijs);
    });
    if (creditVerzendkosten) total -= 6.95;
    if (creditBetaalkosten) total -= 0.29;
    total += newProductsTotal;
    return total;
  })();

  return (
    <div>
      {/* Top bar — 3 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'start', marginBottom: 24, gap: 12 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: ACCENT, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>&larr; Alle orders</button>
          {order.herkomst === 'Quote' && (
            <button style={{ background: 'none', border: 'none', color: ACCENT, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>&larr; Naar quote</button>
          )}
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: GREY, fontWeight: 500 }}>{order.naam}</div>
          {order.isBusiness && order.bedrijf !== '—' && <div style={{ fontSize: 11, color: GREY }}>{order.bedrijf}</div>}
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <button style={buttonAccent}>Factuur versturen</button>
            {order.laatsteFactuur && (
              <span style={{ fontSize: 10, color: GREY, marginTop: 3 }}>Verstuurd: {order.laatsteFactuur}</span>
            )}
          </div>
          <button style={buttonDark} onClick={() => { if (creditConfirmed) resetCreditForm(); else setShowCreditForm(!showCreditForm); }}>Credit factuur</button>
        </div>
      </div>

      {/* Credit factuur bevestiging */}
      {creditConfirmed && (
        <div style={{ ...cardStyle, marginBottom: 20, border: `2px solid ${GREEN}`, background: '#F0FDF4' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK, margin: 0 }}>Credit factuur aangemaakt</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: hasExchange ? '1fr 1fr 1fr' : '1fr 1fr', gap: 20, marginBottom: 16 }}>
            <div style={{ padding: 16, background: WHITE, borderRadius: 8, border: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: GREY, letterSpacing: '0.5px', marginBottom: 6 }}>Credit factuur</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: RED }}>{credNr}</div>
              <div style={{ fontSize: 12, color: GREY, marginTop: 4 }}>Op order {order.ordernummer}</div>
            </div>
            {hasExchange && (
              <>
                <div style={{ padding: 16, background: WHITE, borderRadius: 8, border: `1px solid ${BORDER}` }}>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: GREY, letterSpacing: '0.5px', marginBottom: 6 }}>Exchange</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: ACCENT }}>{excNr}</div>
                  <div style={{ fontSize: 12, color: GREY, marginTop: 4 }}>Koppelt credit + nieuwe order</div>
                </div>
                <div style={{ padding: 16, background: WHITE, borderRadius: 8, border: `1px solid ${BORDER}` }}>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: GREY, letterSpacing: '0.5px', marginBottom: 6 }}>Nieuwe order</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: GREEN }}>{newOrdNr}</div>
                  <div style={{ fontSize: 12, color: GREY, marginTop: 4 }}>Wordt aangemaakt na betaling</div>
                </div>
              </>
            )}
          </div>

          <div style={{ padding: 16, background: WHITE, borderRadius: 8, border: `1px solid ${BORDER}`, marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: GREY, letterSpacing: '0.5px', marginBottom: 8 }}>Betaalreferentie voor terminal</div>
            <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: DARK, padding: '8px 12px', background: SURFACE, borderRadius: 6, display: 'inline-block' }}>
              {credNr}{hasExchange ? ` / ${excNr}` : ''}
            </div>
            <div style={{ fontSize: 12, color: GREY, marginTop: 6 }}>
              Nettobedrag: <span style={{ fontWeight: 700, color: creditTotal < 0 ? RED : GREEN }}>
                {creditTotal < 0 ? '-' : '+'}&euro; {Math.abs(creditTotal).toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              {' '}&mdash; {creditTotal < 0 ? 'Terug naar klant' : creditTotal > 0 ? 'Klant betaalt bij' : 'Verrekend, geen betaling nodig'}
            </div>
          </div>

          {hasExchange && (
            <div style={{ padding: 12, background: '#FFF7ED', borderRadius: 8, border: `1px solid #FED7AA`, fontSize: 13, color: '#9A3412' }}>
              <strong>Na betaling:</strong> Nieuwe order {newOrdNr} wordt aangemaakt met verwijzing {excNr}. In Exact Online komt {excNr} in het &ldquo;Uw ref.&rdquo; veld van de nieuwe verkoopfactuur.
            </div>
          )}

          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button style={buttonOutline} onClick={resetCreditForm}>Sluiten</button>
          </div>
        </div>
      )}

      {/* Credit factuur form */}
      {showCreditForm && !creditConfirmed && (
        <div style={{ ...cardStyle, marginBottom: 20, border: `2px solid ${ACCENT}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 4 }}>Credit factuur aanmaken</h3>
          <p style={{ fontSize: 13, color: GREY, marginBottom: 16 }}>Selecteer welke regels je wilt crediteren. Optioneel kun je een vervangend product toevoegen (exchange).</p>

          {/* Selectable order lines */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: GREY, letterSpacing: '0.5px', marginBottom: 8 }}>Orderregels crediteren</div>
            {order.orderregels.map((r, i) => (
              <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${BORDER}`, cursor: 'pointer', fontSize: 13 }}>
                <input type="checkbox" checked={creditSelected.has(i)} onChange={() => toggleCreditItem(i)} />
                <span style={{ flex: 1, fontWeight: 500, color: creditSelected.has(i) ? RED : DARK }}>{r.variant}</span>
                <Badge color={r.type === 'Verkoop' ? GREEN : BLUE} bg={r.type === 'Verkoop' ? '#DCFCE7' : '#DBEAFE'}>{r.type}</Badge>
                <span style={{ fontWeight: 600, color: creditSelected.has(i) ? RED : DARK, minWidth: 80, textAlign: 'right' }}>
                  {creditSelected.has(i) ? '-' : ''}&euro; {(r.type === 'Verkoop' ? r.verkoopprijs : r.inkoopprijs).toLocaleString('nl-NL')}
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

          {/* Vervangende producten (exchange) */}
          <div style={{ marginBottom: 16, padding: 16, background: SURFACE, borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: GREY, letterSpacing: '0.5px' }}>
                  Vervangende producten (exchange)
                </div>
                {hasExchange && <Badge color={ACCENT} bg={ACCENT_BG}>EXC wordt aangemaakt</Badge>}
              </div>
              <button style={{ ...buttonOutline, padding: '5px 12px', fontSize: 12 }} onClick={addNewProduct}>+ Product toevoegen</button>
            </div>
            <p style={{ fontSize: 12, color: GREY, marginBottom: 10 }}>
              Bij een exchange wordt een EXC-nummer aangemaakt dat de credit factuur ({credNr}) koppelt aan een nieuwe order ({newOrdNr}). Het nettobedrag wordt verrekend.
            </p>
            {creditNewProducts.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Productnaam of SKU..."
                  value={p.name}
                  onChange={e => updateNewProduct(i, 'name', e.target.value)}
                  style={{ ...inputStyle, flex: 1 }}
                />
                <input
                  type="text"
                  placeholder="Prijs"
                  value={p.price}
                  onChange={e => updateNewProduct(i, 'price', e.target.value)}
                  style={{ ...inputStyle, width: 100 }}
                />
                <button onClick={() => removeNewProduct(i)} style={{ background: 'none', border: 'none', color: RED, cursor: 'pointer', fontSize: 16, padding: '0 4px' }}>&times;</button>
              </div>
            ))}
            {creditNewProducts.length === 0 && (
              <div style={{ fontSize: 12, color: GREY, fontStyle: 'italic', padding: '8px 0' }}>Geen vervangende producten. Klik &ldquo;+ Product toevoegen&rdquo; voor een exchange.</div>
            )}
            {hasExchange && (
              <div style={{ marginTop: 10, padding: 10, background: WHITE, borderRadius: 6, border: `1px solid ${BORDER}`, fontSize: 12 }}>
                {validNewProducts.map((p, i) => (
                  <div key={i} style={{ color: GREEN, fontWeight: 600, marginBottom: i < validNewProducts.length - 1 ? 4 : 0 }}>
                    + &euro; {parseFloat(p.price).toLocaleString('nl-NL')} &mdash; {p.name}
                  </div>
                ))}
                <div style={{ color: GREY, marginTop: 6 }}>Nieuwe order {newOrdNr} met {validNewProducts.length} product{validNewProducts.length > 1 ? 'en' : ''} wordt aangemaakt na afronden. Verwijzing: {excNr}</div>
              </div>
            )}
          </div>

          {/* Samenvatting documenten die worden aangemaakt */}
          {(creditSelected.size > 0 || creditVerzendkosten || creditBetaalkosten) && (
            <div style={{ marginBottom: 16, padding: 12, background: '#FFFBEB', borderRadius: 8, border: '1px solid #FDE68A', fontSize: 12 }}>
              <strong style={{ color: '#92400E' }}>Wordt aangemaakt:</strong>
              <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
                <span style={{ color: RED }}>&#9679; {credNr} (credit factuur)</span>
                {hasExchange && <span style={{ color: ACCENT }}>&#9679; {excNr} (exchange)</span>}
                {hasExchange && <span style={{ color: GREEN }}>&#9679; {newOrdNr} (nieuwe order, na betaling)</span>}
              </div>
            </div>
          )}

          {/* Netto bedrag */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderTop: `2px solid ${BORDER}` }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: GREY, letterSpacing: '0.5px' }}>Nettobedrag</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: creditTotal < 0 ? RED : creditTotal > 0 ? GREEN : DARK }}>
                {creditTotal < 0 ? '-' : creditTotal > 0 ? '+' : ''}&euro; {Math.abs(creditTotal).toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: 12, color: GREY }}>
                {creditTotal < 0 ? 'Klant ontvangt terug' : creditTotal > 0 ? 'Klant betaalt bij' : 'Verrekend, geen betaling nodig'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={buttonOutline} onClick={resetCreditForm}>Annuleren</button>
              <button
                style={{ ...buttonAccent, background: creditSelected.size > 0 || creditVerzendkosten || creditBetaalkosten ? ACCENT : GREY }}
                disabled={creditSelected.size === 0 && !creditVerzendkosten && !creditBetaalkosten}
                onClick={() => { setShowCreditForm(false); setCreditConfirmed(true); }}
              >
                {hasExchange ? 'Credit + Exchange aanmaken' : 'Credit factuur aanmaken'}
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
            {infoRow('Prijs totaal', `€ ${order.prijs.toLocaleString('nl-NL')}`)}
            {infoRow('Betaalmethode', order.betaalmethode)}
            {infoRow('Status', <Badge color={orderStatusColor(order.status)} bg={orderStatusColor(order.status) + '18'}>{order.status}</Badge>)}
            {infoRow('Betaalstatus', <Badge color={order.betaalstatus === 'Betaald' ? GREEN : '#F59E0B'} bg={order.betaalstatus === 'Betaald' ? '#DCFCE7' : '#FEF3C7'}>{order.betaalstatus}</Badge>)}
            {infoRow('Order afkomstig van', <Badge color={order.herkomst === 'Store' ? '#8B5CF6' : order.herkomst === 'Quote' ? ACCENT : GREEN} bg={order.herkomst === 'Store' ? '#EDE9FE' : order.herkomst === 'Quote' ? ACCENT_BG : '#DCFCE7'}>{order.herkomst}</Badge>)}
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

      {/* Referenties */}
      <div style={{ ...cardStyle, marginTop: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 16 }}>Referenties</h3>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {order.herkomst === 'Quote' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: GREY }}>Quote:</span>
              {refLink('QUE-00001')}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: GREY }}>Order:</span>
            {refLink(order.ordernummer)}
          </div>
          {creditConfirmed && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: GREY }}>Credit:</span>
                {refLink(credNr, RED)}
              </div>
              {hasExchange && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: GREY }}>Exchange:</span>
                    {refLink(excNr)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: GREY }}>Nieuwe order:</span>
                    {refLink(newOrdNr, GREEN)}
                  </div>
                </>
              )}
            </>
          )}
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
              <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'right' }}>Inkoopprijs</th>
              <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'right' }}>Verkoopprijs</th>
              <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>BTW</th>
              <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'right' }}>Marge</th>
            </tr>
          </thead>
          <tbody>
            {order.orderregels.map((r, i) => {
              const marge = r.type === 'Verkoop' && r.verkoopprijs > 0 ? r.verkoopprijs - r.inkoopprijs : 0;
              return (
              <tr key={i}>
                <td style={{ ...tableCellStyle, fontWeight: 500, color: r.type === 'Inkoop' ? DARK : ACCENT }}>
                  {r.variant}
                  {r.type === 'Inkoop' && <span style={{ display: 'block', fontSize: 11, color: RED, fontWeight: 600, textTransform: 'uppercase' }}>GERESERVEERD</span>}
                </td>
                <td style={tableCellStyle}>
                  <Badge color={r.type === 'Verkoop' ? GREEN : BLUE} bg={r.type === 'Verkoop' ? '#DCFCE7' : '#DBEAFE'}>{r.type}</Badge>
                </td>
                <td style={{ ...tableCellStyle, textAlign: 'right', fontWeight: 500 }}>&euro; {r.inkoopprijs.toLocaleString('nl-NL')}</td>
                <td style={{ ...tableCellStyle, textAlign: 'right', fontWeight: 500 }}>{r.verkoopprijs > 0 ? `€ ${r.verkoopprijs.toLocaleString('nl-NL')}` : '\u2014'}</td>
                <td style={{ ...tableCellStyle, fontSize: 13 }}>{r.btw}</td>
                <td style={{ ...tableCellStyle, textAlign: 'right', fontWeight: 600, color: marge > 0 ? GREEN : GREY }}>{marge > 0 ? `€ ${marge.toLocaleString('nl-NL')}` : '\u2014'}</td>
              </tr>
              );
            })}
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
              <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Exchange</th>
              <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Datum</th>
              <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'right' }}>Bedrag</th>
              <th style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left' }}>Nieuwe order</th>
            </tr>
          </thead>
          <tbody>
            {creditConfirmed ? (
              <tr>
                <td style={{ ...tableCellStyle, fontWeight: 600, color: RED }}>{credNr}</td>
                <td style={tableCellStyle}>{hasExchange ? refLink(excNr) : <span style={{ color: GREY }}>&mdash;</span>}</td>
                <td style={{ ...tableCellStyle, fontSize: 12 }}>17-03-2026</td>
                <td style={{ ...tableCellStyle, textAlign: 'right', fontWeight: 600, color: RED }}>
                  -&euro; {Math.abs(creditTotal).toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td style={tableCellStyle}>{hasExchange ? refLink(newOrdNr, GREEN) : <span style={{ color: GREY }}>&mdash;</span>}</td>
              </tr>
            ) : (
              <tr>
                <td colSpan={5} style={{ ...tableCellStyle, textAlign: 'center', padding: 20, color: GREY, fontSize: 13 }}>Geen resultaten</td>
              </tr>
            )}
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

      <ActivityLog entries={[
        { date: '17-03-2026 09:14', user: 'System', action: 'Factuur verstuurd naar ' + order.email },
        { date: '16-03-2026 15:22', user: 'Bart', action: 'Status gewijzigd naar ' + order.status },
        { date: order.datum + ' 14:32', user: 'System', action: 'Betaling ontvangen via ' + order.betaalmethode + ' — ' + order.betaalstatus },
        { date: order.datum + ' 14:30', user: 'Bart', action: 'Order aangemaakt' + (order.herkomst === 'Quote' ? ' vanuit quote' : order.herkomst === 'Store' ? ' in winkel' : ' via webshop') },
      ]} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Quotes Page                                                        */
/* ------------------------------------------------------------------ */
function QuotesPage({ onSelectQuote }: { onSelectQuote: (id: string) => void }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = MOCK_QUOTES.filter(q => {
    if (search && !q.id.toLowerCase().includes(search.toLowerCase()) && !q.name.toLowerCase().includes(search.toLowerCase()) && !q.status.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && q.status !== statusFilter) return false;
    return true;
  });

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

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };
  const toggleAll = () => {
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map(q => q.id));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: DARK, margin: 0 }}>Quotes</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: GREY }}>{selected.length} geselecteerd</span>
          <button style={{ ...buttonOutline, opacity: selected.length > 0 ? 1 : 0.5, fontSize: 12, padding: '8px 14px' }} disabled={selected.length === 0}>Labels aanmaken</button>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
            <option value="">Status</option>
            <option value="Wacht op prijsvoorstel">Wacht op prijsvoorstel</option>
            <option value="Wacht op akkoord">Wacht op akkoord</option>
            <option value="Controleren">Controleren</option>
            <option value="Uitbetalen">Uitbetalen</option>
            <option value="Afgekeurd">Afgekeurd</option>
            <option value="Afgerond">Afgerond</option>
          </select>
          <input type="text" placeholder="Zoeken..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, width: 180 }} />
        </div>
      </div>
      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...tableHeaderStyle, ...tableCellStyle, width: 40 }}>
                  <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} style={{ cursor: 'pointer' }} />
                </th>
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
                  <td style={tableCellStyle} onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selected.includes(q.id)} onChange={() => toggleSelect(q.id)} style={{ cursor: 'pointer' }} />
                  </td>
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
                <tr><td colSpan={8} style={{ ...tableCellStyle, textAlign: 'center', padding: 40, color: GREY }}>Geen quotes gevonden.</td></tr>
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
  const [notesOpen, setNotesOpen] = useState(true);

  const priceInputWrapper: React.CSSProperties = { display: 'inline-flex', alignItems: 'stretch', border: `1px solid ${BORDER}`, borderRadius: 6, overflow: 'hidden', height: 32 };
  const euroPrefix: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px', background: SURFACE, color: GREY, fontSize: 13, borderRight: `1px solid ${BORDER}`, fontWeight: 500 };
  const priceInput: React.CSSProperties = { border: 'none', outline: 'none', padding: '0 8px', fontSize: 13, width: 80, fontFamily: 'inherit' };
  const denyBtn: React.CSSProperties = { padding: '4px 12px', border: `1px solid ${BORDER}`, borderRadius: 6, background: WHITE, color: DARK, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' };
  const deleteIcon = <span style={{ color: GREY, cursor: 'pointer', fontSize: 14 }}>&#128465;</span>;

  const tradeInRows = [
    { variant: '7Artisans 10mm f/2.8 – Canon RF', conditie: 'Excellent', purchase: '300.00', sell: '599.00', btw: '21%', changed: '16/03/26, 09:59', user: 'admin' },
    { variant: 'Sony A7 VI', conditie: 'Excellent', purchase: '2000.00', sell: '2999.00', btw: '21%', changed: '16/03/26, 09:51', user: 'admin' },
    { variant: '7Artisans 10mm f/2.8 – Fujifilm X', conditie: 'Excellent', purchase: '300.00', sell: '499.00', btw: '21%', changed: '16/03/26, 09:56', user: 'admin' },
    { variant: 'AstrHori 40mm f/5.6 – Leica M', conditie: 'Excellent', purchase: '500.00', sell: '699.00', btw: '21%', changed: '16/03/26, 09:53', user: 'admin' },
  ];
  const saleRows = [
    { variant: 'Sony A7 IV', conditie: 'Excellent', quantity: 'x 1', purchasePrice: '300.00', sellPrice: '499.00', btw: '0%', changed: '16/03/26, 09:44', user: 'admin' },
  ];

  const sellTotal = 2561.98;
  const buyTotal = 499.00;

  const DetailRow = ({ label, value, valueColor, valueWeight }: { label: string; value: React.ReactNode; valueColor?: string; valueWeight?: number }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13 }}>
      <span style={{ color: GREY }}>{label}</span>
      <span style={{ color: valueColor || DARK, fontWeight: valueWeight || 400 }}>{value}</span>
    </div>
  );

  return (
    <div>
      {/* Back link */}
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: ACCENT, fontSize: 13, fontWeight: 500, cursor: 'pointer', padding: 0, marginBottom: 20, fontFamily: 'inherit' }}>&larr; All quotes</button>

      {/* 3-column top: Quote details | Customer details | Quote panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 240px', gap: 16, marginBottom: 24, alignItems: 'start' }}>
        {/* Quote details */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: DARK, margin: '0 0 12px' }}>Quote details</h3>
          <DetailRow label="Quote number" value={quote.id} valueWeight={500} />
          <DetailRow label="Created" value={quote.created} />
          <DetailRow label="Total price" value={`-€2,601.00`} valueColor={RED} valueWeight={600} />
          <DetailRow label="Status" value={<Badge color={GREEN} solid>Completed</Badge>} />
          <DetailRow label="Payment status" value={<Badge color={GREEN} solid>Paid</Badge>} />
          <DetailRow label="Shipping status" value={<Badge color={GREY} solid>Not shipped</Badge>} />
          <DetailRow label="Order number" value={<span style={{ color: ACCENT, fontWeight: 500, cursor: 'pointer' }}>ORD000004</span>} />
          <DetailRow label="Active user" value="\u2014" />
        </div>

        {/* Customer details */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: DARK, margin: 0 }}>Customer details</h3>
            <button style={{ background: 'none', border: 'none', color: ACCENT, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Edit</button>
          </div>
          <DetailRow label="Name" value="Joop de Vries" />
          <DetailRow label="Email" value="joopdevries@gmail.com" />
          <DetailRow label="Phone" value="+31612345678" />
          <DetailRow label="QTE Business" value={<span style={{ color: GREEN }}>&#10003;</span>} />
          <DetailRow label="Business country" value="Australia" />
          <DetailRow label="KVK number" value="\u2014" />
          <DetailRow label="VAT number" value="PL7272445205" />
          <DetailRow label="Address" value="\u2014" />
        </div>

        {/* Quote panel (right sidebar) */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: DARK, margin: '0 0 8px' }}>Quote</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: GREY, marginBottom: 12 }}>
            <span style={{ color: GREEN }}>&#10003;</span> Sent: \u2014
            <span style={{ marginLeft: 'auto', cursor: 'pointer' }}>&#9881;</span>
          </div>
          <button style={{ ...buttonAccent, width: '100%', marginBottom: 8, padding: '10px 16px' }}>Send Quote</button>
          <button style={{ ...buttonOutline, width: '100%', marginBottom: 6, padding: '8px 16px', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <span style={{ fontSize: 14 }}>&#8595;</span> Download quote
          </button>
          <button style={{ ...buttonOutline, width: '100%', marginBottom: 12, padding: '8px 16px', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <span style={{ fontSize: 14 }}>&#9113;</span> Print labels
          </button>
          <button style={{ ...buttonOutline, width: '100%', padding: '8px 16px', fontSize: 12, borderColor: BORDER }}>View order</button>
        </div>
      </div>

      {/* Cognito mode button */}
      <div style={{ position: 'absolute', top: 0, right: 0 }}>
        <button style={{ background: 'none', border: 'none', color: GREY, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>&#9881;</span> Cognito mode
        </button>
      </div>

      {/* Trade-in section */}
      <h3 style={{ fontSize: 15, fontWeight: 600, color: DARK, margin: '0 0 12px' }}>Trade-in</h3>
      <div style={{ overflowX: 'auto', marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
          <thead>
            <tr>
              {['VARIANT', 'CONDITION', 'PURCHASE PRICE', 'SELL PRICE', 'VAT', 'DENY', 'CHANGED', ''].map((h) => (
                <th key={h} style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left', fontSize: 10, letterSpacing: '0.8px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tradeInRows.map((row, i) => (
              <tr key={i}>
                <td style={tableCellStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: GREEN, flexShrink: 0 }} />
                    <span style={{ color: ACCENT, fontWeight: 500, cursor: 'pointer' }}>{row.variant}</span>
                  </div>
                </td>
                <td style={tableCellStyle}><Badge color={GREEN}>{row.conditie}</Badge></td>
                <td style={tableCellStyle}><div style={priceInputWrapper}><span style={euroPrefix}>&euro;</span><input type="text" defaultValue={row.purchase} style={priceInput} /></div></td>
                <td style={tableCellStyle}><div style={priceInputWrapper}><span style={euroPrefix}>&euro;</span><input type="text" defaultValue={row.sell} style={priceInput} /></div></td>
                <td style={tableCellStyle}>{row.btw}</td>
                <td style={tableCellStyle}><button style={denyBtn}>Deny</button></td>
                <td style={{ ...tableCellStyle, fontSize: 11, color: GREY, lineHeight: 1.4 }}>{row.changed}<br />{row.user}</td>
                <td style={{ ...tableCellStyle, textAlign: 'center' }}>{deleteIcon}</td>
              </tr>
            ))}
            <tr><td colSpan={8} style={{ padding: '12px 14px', textAlign: 'center', color: ACCENT, fontWeight: 500, cursor: 'pointer', fontSize: 13 }}>+ Add product</td></tr>
          </tbody>
        </table>
      </div>

      {/* Sale section */}
      <h3 style={{ fontSize: 15, fontWeight: 600, color: DARK, margin: '0 0 12px' }}>Sale</h3>
      <div style={{ overflowX: 'auto', marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
          <thead>
            <tr>
              {['VARIANT', 'CONDITION', 'QUANTITY', 'PURCHASE PRICE', 'SELL PRICE', 'VAT', 'DENY', 'CHANGED', ''].map((h) => (
                <th key={h} style={{ ...tableHeaderStyle, ...tableCellStyle, textAlign: 'left', fontSize: 10, letterSpacing: '0.8px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {saleRows.map((row, i) => (
              <tr key={i}>
                <td style={tableCellStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: GREEN, flexShrink: 0 }} />
                    <span style={{ color: ACCENT, fontWeight: 500, cursor: 'pointer' }}>{row.variant}</span>
                  </div>
                </td>
                <td style={tableCellStyle}><Badge color={GREEN}>{row.conditie}</Badge></td>
                <td style={tableCellStyle}>{row.quantity}</td>
                <td style={tableCellStyle}>&euro;{row.purchasePrice}</td>
                <td style={tableCellStyle}><div style={priceInputWrapper}><span style={euroPrefix}>&euro;</span><input type="text" defaultValue={row.sellPrice} style={priceInput} /></div></td>
                <td style={tableCellStyle}>{row.btw}</td>
                <td style={tableCellStyle}><button style={denyBtn}>Deny</button></td>
                <td style={{ ...tableCellStyle, fontSize: 11, color: GREY, lineHeight: 1.4 }}>{row.changed}<br />{row.user}</td>
                <td style={{ ...tableCellStyle, textAlign: 'center' }}>{deleteIcon}</td>
              </tr>
            ))}
            <tr><td colSpan={9} style={{ padding: '12px 14px', textAlign: 'center', color: ACCENT, fontWeight: 500, cursor: 'pointer', fontSize: 13 }}>+ Add product</td></tr>
          </tbody>
        </table>
      </div>

      {/* Overview */}
      <div style={{ ...cardStyle, marginBottom: 20 }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: DARK, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>OVERVIEW</h3>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 13 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${BORDER}` }}><span style={{ color: GREY }}>Sell subtotal</span><span>&euro;{sellTotal.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${BORDER}`, fontWeight: 600 }}><span>Sell total</span><span>&euro;{sellTotal.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${BORDER}` }}><span style={{ color: GREY }}>Buy subtotal</span><span>&euro;{buyTotal.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${BORDER}`, fontWeight: 600 }}><span>Buy total</span><span>&euro;{buyTotal.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', marginTop: 4 }}>
            <span style={{ color: ACCENT, fontWeight: 700 }}>Customer receives</span>
            <span style={{ color: ACCENT, fontWeight: 700 }}>&euro;{(sellTotal - buyTotal).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button style={{ ...buttonDark, padding: '10px 24px' }}>Save</button>
        <button style={{ ...buttonAccent, padding: '10px 24px' }}>View order</button>
      </div>

      {/* Quote notes */}
      <div>
        <button onClick={() => setNotesOpen(!notesOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, padding: 0, marginBottom: notesOpen ? 8 : 0 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: DARK, margin: 0 }}>Quote notes</h3>
          <span style={{ fontSize: 10, color: GREY, transform: notesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>&#9660;</span>
        </button>
        {notesOpen && (
          <textarea placeholder="Add a note.." style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', minHeight: 80, resize: 'vertical' }} />
        )}
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
function AdminDashboardInner() {
  const { isLoggedIn, isAdmin, hydrated } = useAuth();
  const dashboardRouter = useRouter();

  // Auth guard disabled for design export preview
  // useEffect(() => {
  //   if (hydrated && (!isLoggedIn || !isAdmin)) {
  //     dashboardRouter.push('/login');
  //   }
  // }, [hydrated, isLoggedIn, isAdmin, dashboardRouter]);

  const searchParams = useSearchParams();
  const viewParam = searchParams?.get('view');

  const [activeSection, setActiveSection] = useState(() => {
    if (viewParam === 'orders' || viewParam === 'order-detail') return 'orders';
    if (viewParam === 'quotes' || viewParam === 'quote-detail') return 'quotes';
    return 'dashboard';
  });
  const [selectedQuote, setSelectedQuote] = useState<string | null>(() => {
    return viewParam === 'quote-detail' ? (MOCK_QUOTES[0]?.id || null) : null;
  });
  const [selectedOrder, setSelectedOrder] = useState<string | null>(() => {
    return viewParam === 'order-detail' ? (MOCK_ORDERS[0]?.ordernummer || null) : null;
  });
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
    return (
      <>
        {/* Detail pages */}
        <div style={{ display: activeSection === 'quotes' && selectedQuote ? 'block' : 'none' }}>
          {selectedQuote && (
            <QuoteDetailPage
              quoteId={selectedQuote}
              onBack={() => setSelectedQuote(null)}
            />
          )}
        </div>
        <div style={{ display: activeSection === 'orders' && selectedOrder ? 'block' : 'none' }}>
          {selectedOrder && (
            <OrderDetailPage
              ordernummer={selectedOrder}
              onBack={() => setSelectedOrder(null)}
            />
          )}
        </div>

        {/* Section pages */}
        {sections.map(s => (
          <div
            key={s.key}
            data-section={s.key}
            style={{ display: (activeSection === s.key || (activeSection === 'overzicht' && s.key === 'dashboard')) && !selectedOrder && !selectedQuote ? 'block' : 'none' }}
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

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>}>
      <AdminDashboardInner />
    </Suspense>
  );
}

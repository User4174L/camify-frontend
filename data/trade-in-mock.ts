/* Mockdata inruilflow — gedeeld door /trade-in (v1) en /trade-in/v2 */

/* ── Product databases ── */
export const SELL_PRODUCTS = [
  /* Sony */
  { name: 'Sony A7 IV', category: 'camera' },
  { name: 'Sony A7R V', category: 'camera' },
  { name: 'Sony A1', category: 'camera' },
  { name: 'Sony A7 III', category: 'camera' },
  { name: 'Sony A7C II', category: 'camera' },
  { name: 'Sony A7S III', category: 'camera' },
  { name: 'Sony A9 III', category: 'camera' },
  { name: 'Sony A6700', category: 'camera' },
  { name: 'Sony FE 24-70mm f/2.8 GM II', category: 'lens' },
  { name: 'Sony FE 70-200mm f/2.8 GM II', category: 'lens' },
  { name: 'Sony FE 35mm f/1.4 GM', category: 'lens' },
  { name: 'Sony NP-FZ100 Battery', category: 'accessory' },
  /* Nikon */
  { name: 'Nikon Z9', category: 'camera' },
  { name: 'Nikon Z8', category: 'camera' },
  { name: 'Nikon Z6 III', category: 'camera' },
  { name: 'Nikon Z7 II', category: 'camera' },
  { name: 'Nikon Zf', category: 'camera' },
  { name: 'Nikon Z5', category: 'camera' },
  { name: 'Nikon Z 24-70mm f/2.8 S', category: 'lens' },
  { name: 'Nikon Z 70-200mm f/2.8 VR S', category: 'lens' },
  { name: 'Nikon Z 50mm f/1.8 S', category: 'lens' },
  /* Canon */
  { name: 'Canon EOS R5', category: 'camera' },
  { name: 'Canon EOS R6 II', category: 'camera' },
  { name: 'Canon EOS R5 Mark II', category: 'camera' },
  { name: 'Canon EOS R3', category: 'camera' },
  { name: 'Canon EOS R8', category: 'camera' },
  { name: 'Canon EOS R7', category: 'camera' },
  { name: 'Canon RF 24-70mm f/2.8L IS USM', category: 'lens' },
  { name: 'Canon RF 70-200mm f/2.8L IS USM', category: 'lens' },
  { name: 'Canon RF 50mm f/1.2L USM', category: 'lens' },
  /* Overig */
  { name: 'Fujifilm X-T5', category: 'camera' },
];

export interface BuyVariant {
  id: number;
  sku: string;
  price: number;
  condition: string;
  shutterCount?: number;
  accessories: string[];
}

export interface BuyProduct {
  id: string;
  name: string;
  category: string;
  variants: BuyVariant[];
}

const LENS_ACC_BASIC = ['Lensdop voor', 'Lensdop achter'];
const LENS_ACC_FULL = ['Lensdop voor', 'Lensdop achter', 'Zonnekap', 'Lenstas', 'Originele doos'];
const BODY_ACC_BASIC = ['Body cap', 'Accu'];
const BODY_ACC_FULL = ['Body cap', 'Accu', 'Oplader', 'Originele doos', 'Handleiding'];

export const BUY_PRODUCTS: BuyProduct[] = [
  /* ── Sony ── */
  {
    id: 'sony-a7iv', name: 'Sony A7 IV', category: 'Sony Systeemcamera\'s',
    variants: [
      { id: 1001, sku: '236001', price: 1800, condition: 'Goed', shutterCount: 35000, accessories: BODY_ACC_BASIC },
      { id: 1002, sku: '236002', price: 1950, condition: 'Zeer goed', shutterCount: 15000, accessories: ['Body cap', 'Accu', 'Oplader'] },
      { id: 1003, sku: '236003', price: 2080, condition: 'Als nieuw', shutterCount: 2000, accessories: BODY_ACC_FULL },
    ],
  },
  {
    id: 'sony-a7rv', name: 'Sony A7R V', category: 'Sony Systeemcamera\'s',
    variants: [
      { id: 1011, sku: '234501', price: 3000, condition: 'Zeer goed', shutterCount: 1200, accessories: ['Body cap', 'Accu', 'Oplader'] },
      { id: 1012, sku: '234502', price: 3100, condition: 'Zo goed als nieuw', shutterCount: 450, accessories: ['Body cap', 'Accu', 'Oplader', 'Originele doos'] },
      { id: 1013, sku: '234503', price: 3250, condition: 'Als nieuw', shutterCount: 150, accessories: BODY_ACC_FULL },
    ],
  },
  {
    id: 'sony-a1', name: 'Sony A1', category: 'Sony Systeemcamera\'s',
    variants: [
      { id: 1021, sku: '231001', price: 4200, condition: 'Goed', shutterCount: 60000, accessories: BODY_ACC_BASIC },
      { id: 1022, sku: '231002', price: 4500, condition: 'Zeer goed', shutterCount: 22000, accessories: ['Body cap', 'Accu', 'Oplader'] },
      { id: 1023, sku: '231003', price: 4800, condition: 'Als nieuw', shutterCount: 3500, accessories: BODY_ACC_FULL },
    ],
  },
  {
    id: 'sony-a7iii', name: 'Sony A7 III', category: 'Sony Systeemcamera\'s',
    variants: [
      { id: 1031, sku: '237001', price: 1150, condition: 'Goed', shutterCount: 48000, accessories: BODY_ACC_BASIC },
      { id: 1032, sku: '237002', price: 1300, condition: 'Zeer goed', shutterCount: 19000, accessories: ['Body cap', 'Accu', 'Oplader'] },
    ],
  },
  {
    id: 'sony-a7cii', name: 'Sony A7C II', category: 'Sony Systeemcamera\'s',
    variants: [
      { id: 1041, sku: '238001', price: 1850, condition: 'Zeer goed', shutterCount: 6800, accessories: ['Body cap', 'Accu', 'Oplader'] },
      { id: 1042, sku: '238002', price: 1980, condition: 'Als nieuw', shutterCount: 900, accessories: BODY_ACC_FULL },
    ],
  },
  {
    id: 'sony-a7siii', name: 'Sony A7S III', category: 'Sony Systeemcamera\'s',
    variants: [
      { id: 1051, sku: '239001', price: 2900, condition: 'Zeer goed', shutterCount: 14000, accessories: ['Body cap', 'Accu', 'Oplader'] },
      { id: 1052, sku: '239002', price: 3100, condition: 'Zo goed als nieuw', shutterCount: 4200, accessories: ['Body cap', 'Accu', 'Oplader', 'Originele doos'] },
    ],
  },
  {
    id: 'sony-fe-24-70', name: 'Sony FE 24-70mm f/2.8 GM II', category: 'Sony Lenzen',
    variants: [
      { id: 1061, sku: '300101', price: 1400, condition: 'Goed', accessories: LENS_ACC_BASIC },
      { id: 1062, sku: '300102', price: 1480, condition: 'Zeer goed', accessories: ['Lensdop voor', 'Lensdop achter', 'Zonnekap'] },
      { id: 1063, sku: '300103', price: 1580, condition: 'Als nieuw', accessories: LENS_ACC_FULL },
    ],
  },
  {
    id: 'sony-fe-70-200', name: 'Sony FE 70-200mm f/2.8 GM II', category: 'Sony Lenzen',
    variants: [
      { id: 1071, sku: '301101', price: 1900, condition: 'Zeer goed', accessories: ['Lensdop voor', 'Lensdop achter', 'Zonnekap'] },
      { id: 1072, sku: '301102', price: 2050, condition: 'Als nieuw', accessories: LENS_ACC_FULL },
    ],
  },
  {
    id: 'sony-fe-35-14', name: 'Sony FE 35mm f/1.4 GM', category: 'Sony Lenzen',
    variants: [
      { id: 1081, sku: '302101', price: 1150, condition: 'Goed', accessories: LENS_ACC_BASIC },
      { id: 1082, sku: '302102', price: 1280, condition: 'Zeer goed', accessories: LENS_ACC_FULL },
    ],
  },
  {
    id: 'sony-fe-16-35', name: 'Sony FE 16-35mm f/2.8 GM II', category: 'Sony Lenzen',
    variants: [
      { id: 1091, sku: '303101', price: 1850, condition: 'Zeer goed', accessories: ['Lensdop voor', 'Lensdop achter', 'Zonnekap'] },
      { id: 1092, sku: '303102', price: 1990, condition: 'Als nieuw', accessories: LENS_ACC_FULL },
    ],
  },

  /* ── Nikon ── */
  {
    id: 'nikon-z9', name: 'Nikon Z9', category: 'Nikon Systeemcamera\'s',
    variants: [
      { id: 2001, sku: '401101', price: 4400, condition: 'Goed', shutterCount: 90000, accessories: BODY_ACC_BASIC },
      { id: 2002, sku: '401102', price: 4700, condition: 'Zeer goed', shutterCount: 32000, accessories: ['Body cap', 'Accu', 'Oplader'] },
      { id: 2003, sku: '401103', price: 4950, condition: 'Als nieuw', shutterCount: 5000, accessories: BODY_ACC_FULL },
    ],
  },
  {
    id: 'nikon-z8', name: 'Nikon Z8', category: 'Nikon Systeemcamera\'s',
    variants: [
      { id: 2011, sku: '400101', price: 3200, condition: 'Zeer goed', shutterCount: 8500, accessories: ['Body cap', 'Accu', 'Oplader'] },
      { id: 2012, sku: '400102', price: 3350, condition: 'Zo goed als nieuw', shutterCount: 3200, accessories: ['Body cap', 'Accu', 'Oplader', 'Originele doos'] },
      { id: 2013, sku: '400103', price: 3500, condition: 'Als nieuw', shutterCount: 800, accessories: BODY_ACC_FULL },
    ],
  },
  {
    id: 'nikon-z6iii', name: 'Nikon Z6 III', category: 'Nikon Systeemcamera\'s',
    variants: [
      { id: 2021, sku: '402101', price: 2100, condition: 'Goed', shutterCount: 28000, accessories: BODY_ACC_BASIC },
      { id: 2022, sku: '402102', price: 2250, condition: 'Zeer goed', shutterCount: 9000, accessories: ['Body cap', 'Accu', 'Oplader'] },
      { id: 2023, sku: '402103', price: 2390, condition: 'Als nieuw', shutterCount: 1500, accessories: BODY_ACC_FULL },
    ],
  },
  {
    id: 'nikon-z7ii', name: 'Nikon Z7 II', category: 'Nikon Systeemcamera\'s',
    variants: [
      { id: 2031, sku: '403101', price: 1900, condition: 'Goed', shutterCount: 41000, accessories: BODY_ACC_BASIC },
      { id: 2032, sku: '403102', price: 2050, condition: 'Zeer goed', shutterCount: 16000, accessories: ['Body cap', 'Accu', 'Oplader'] },
    ],
  },
  {
    id: 'nikon-zf', name: 'Nikon Zf', category: 'Nikon Systeemcamera\'s',
    variants: [
      { id: 2041, sku: '404101', price: 1650, condition: 'Zeer goed', shutterCount: 7400, accessories: ['Body cap', 'Accu', 'Oplader'] },
      { id: 2042, sku: '404102', price: 1780, condition: 'Als nieuw', shutterCount: 600, accessories: BODY_ACC_FULL },
    ],
  },
  {
    id: 'nikon-z5', name: 'Nikon Z5', category: 'Nikon Systeemcamera\'s',
    variants: [
      { id: 2051, sku: '405101', price: 850, condition: 'Goed', shutterCount: 33000, accessories: BODY_ACC_BASIC },
      { id: 2052, sku: '405102', price: 950, condition: 'Zeer goed', shutterCount: 12000, accessories: ['Body cap', 'Accu', 'Oplader'] },
    ],
  },
  {
    id: 'nikon-z-24-70', name: 'Nikon Z 24-70mm f/2.8 S', category: 'Nikon Lenzen',
    variants: [
      { id: 2061, sku: '410101', price: 1500, condition: 'Goed', accessories: LENS_ACC_BASIC },
      { id: 2062, sku: '410102', price: 1620, condition: 'Zeer goed', accessories: ['Lensdop voor', 'Lensdop achter', 'Zonnekap'] },
      { id: 2063, sku: '410103', price: 1720, condition: 'Als nieuw', accessories: LENS_ACC_FULL },
    ],
  },
  {
    id: 'nikon-z-70-200', name: 'Nikon Z 70-200mm f/2.8 VR S', category: 'Nikon Lenzen',
    variants: [
      { id: 2071, sku: '411101', price: 1850, condition: 'Zeer goed', accessories: ['Lensdop voor', 'Lensdop achter', 'Zonnekap'] },
      { id: 2072, sku: '411102', price: 1980, condition: 'Als nieuw', accessories: LENS_ACC_FULL },
    ],
  },
  {
    id: 'nikon-z-50-18', name: 'Nikon Z 50mm f/1.8 S', category: 'Nikon Lenzen',
    variants: [
      { id: 2081, sku: '412101', price: 430, condition: 'Goed', accessories: LENS_ACC_BASIC },
      { id: 2082, sku: '412102', price: 490, condition: 'Als nieuw', accessories: LENS_ACC_FULL },
    ],
  },
  {
    id: 'nikon-z-14-24', name: 'Nikon Z 14-24mm f/2.8 S', category: 'Nikon Lenzen',
    variants: [
      { id: 2091, sku: '413101', price: 1750, condition: 'Zeer goed', accessories: ['Lensdop voor', 'Lensdop achter', 'Zonnekap'] },
      { id: 2092, sku: '413102', price: 1890, condition: 'Als nieuw', accessories: LENS_ACC_FULL },
    ],
  },

  /* ── Canon ── */
  {
    id: 'canon-eos-r5', name: 'Canon EOS R5', category: 'Canon Systeemcamera\'s',
    variants: [
      { id: 3001, sku: '500101', price: 2800, condition: 'Goed', shutterCount: 42000, accessories: BODY_ACC_BASIC },
      { id: 3002, sku: '500102', price: 2950, condition: 'Zeer goed', shutterCount: 25000, accessories: ['Body cap', 'Accu', 'Oplader'] },
      { id: 3003, sku: '500103', price: 3100, condition: 'Zo goed als nieuw', shutterCount: 12000, accessories: ['Body cap', 'Accu', 'Oplader', 'Originele doos'] },
    ],
  },
  {
    id: 'canon-eos-r6ii', name: 'Canon EOS R6 Mark II', category: 'Canon Systeemcamera\'s',
    variants: [
      { id: 3011, sku: '501101', price: 1900, condition: 'Goed', shutterCount: 38000, accessories: BODY_ACC_BASIC },
      { id: 3012, sku: '501102', price: 2050, condition: 'Zeer goed', shutterCount: 14000, accessories: ['Body cap', 'Accu', 'Oplader'] },
      { id: 3013, sku: '501103', price: 2200, condition: 'Als nieuw', shutterCount: 1800, accessories: BODY_ACC_FULL },
    ],
  },
  {
    id: 'canon-eos-r5ii', name: 'Canon EOS R5 Mark II', category: 'Canon Systeemcamera\'s',
    variants: [
      { id: 3021, sku: '502101', price: 3700, condition: 'Zeer goed', shutterCount: 9500, accessories: ['Body cap', 'Accu', 'Oplader'] },
      { id: 3022, sku: '502102', price: 3950, condition: 'Als nieuw', shutterCount: 1100, accessories: BODY_ACC_FULL },
    ],
  },
  {
    id: 'canon-eos-r3', name: 'Canon EOS R3', category: 'Canon Systeemcamera\'s',
    variants: [
      { id: 3031, sku: '503101', price: 3600, condition: 'Goed', shutterCount: 70000, accessories: BODY_ACC_BASIC },
      { id: 3032, sku: '503102', price: 3900, condition: 'Zeer goed', shutterCount: 24000, accessories: ['Body cap', 'Accu', 'Oplader'] },
    ],
  },
  {
    id: 'canon-eos-r8', name: 'Canon EOS R8', category: 'Canon Systeemcamera\'s',
    variants: [
      { id: 3041, sku: '504101', price: 1150, condition: 'Zeer goed', shutterCount: 11000, accessories: ['Body cap', 'Accu', 'Oplader'] },
      { id: 3042, sku: '504102', price: 1280, condition: 'Als nieuw', shutterCount: 1300, accessories: BODY_ACC_FULL },
    ],
  },
  {
    id: 'canon-eos-r7', name: 'Canon EOS R7', category: 'Canon Systeemcamera\'s',
    variants: [
      { id: 3051, sku: '505101', price: 980, condition: 'Goed', shutterCount: 29000, accessories: BODY_ACC_BASIC },
      { id: 3052, sku: '505102', price: 1090, condition: 'Zeer goed', shutterCount: 9000, accessories: ['Body cap', 'Accu', 'Oplader'] },
    ],
  },
  {
    id: 'canon-rf-24-70', name: 'Canon RF 24-70mm f/2.8L IS USM', category: 'Canon Lenzen',
    variants: [
      { id: 3061, sku: '510101', price: 1700, condition: 'Goed', accessories: LENS_ACC_BASIC },
      { id: 3062, sku: '510102', price: 1820, condition: 'Zeer goed', accessories: ['Lensdop voor', 'Lensdop achter', 'Zonnekap'] },
      { id: 3063, sku: '510103', price: 1950, condition: 'Als nieuw', accessories: LENS_ACC_FULL },
    ],
  },
  {
    id: 'canon-rf-70-200', name: 'Canon RF 70-200mm f/2.8L IS USM', category: 'Canon Lenzen',
    variants: [
      { id: 3071, sku: '511101', price: 1950, condition: 'Zeer goed', accessories: ['Lensdop voor', 'Lensdop achter', 'Zonnekap'] },
      { id: 3072, sku: '511102', price: 2100, condition: 'Als nieuw', accessories: LENS_ACC_FULL },
    ],
  },
  {
    id: 'canon-rf-50-12', name: 'Canon RF 50mm f/1.2L USM', category: 'Canon Lenzen',
    variants: [
      { id: 3081, sku: '512101', price: 1650, condition: 'Goed', accessories: LENS_ACC_BASIC },
      { id: 3082, sku: '512102', price: 1820, condition: 'Als nieuw', accessories: LENS_ACC_FULL },
    ],
  },
  {
    id: 'canon-rf-15-35', name: 'Canon RF 15-35mm f/2.8L IS USM', category: 'Canon Lenzen',
    variants: [
      { id: 3091, sku: '513101', price: 1600, condition: 'Zeer goed', accessories: ['Lensdop voor', 'Lensdop achter', 'Zonnekap'] },
      { id: 3092, sku: '513102', price: 1740, condition: 'Als nieuw', accessories: LENS_ACC_FULL },
    ],
  },
];

/* ── Bod-dekking (mock voor v2) ──
 * instant  = prijsmodel heeft genoeg marktdata → direct bod
 * minutes  = te weinig data, live-opvraag bij marktbronnen → bod binnen ± 5 min per mail
 * manual   = geen data / bijzonder product → handmatige beoordeling, binnen 2 werkdagen
 * basePrice = indicatief bod bij "Zo goed als nieuw" (mock).
 */
export type BidCoverage = 'instant' | 'minutes' | 'manual';

export const SELL_PRICING: Record<string, { coverage: BidCoverage; basePrice?: number }> = {
  'Sony A7 IV': { coverage: 'instant', basePrice: 1450 },
  'Sony A7R V': { coverage: 'instant', basePrice: 2550 },
  'Sony A1': { coverage: 'instant', basePrice: 3900 },
  'Sony A7 III': { coverage: 'instant', basePrice: 900 },
  'Sony A7C II': { coverage: 'instant', basePrice: 1400 },
  'Sony A7S III': { coverage: 'minutes' },
  'Sony A9 III': { coverage: 'minutes' },
  'Sony A6700': { coverage: 'instant', basePrice: 900 },
  'Sony FE 24-70mm f/2.8 GM II': { coverage: 'instant', basePrice: 1500 },
  'Sony FE 70-200mm f/2.8 GM II': { coverage: 'instant', basePrice: 1700 },
  'Sony FE 35mm f/1.4 GM': { coverage: 'instant', basePrice: 900 },
  'Sony NP-FZ100 Battery': { coverage: 'manual' },
  'Nikon Z9': { coverage: 'instant', basePrice: 3300 },
  'Nikon Z8': { coverage: 'instant', basePrice: 2500 },
  'Nikon Z6 III': { coverage: 'minutes' },
  'Nikon Z7 II': { coverage: 'instant', basePrice: 1400 },
  'Nikon Zf': { coverage: 'instant', basePrice: 1350 },
  'Nikon Z5': { coverage: 'instant', basePrice: 650 },
  'Nikon Z 24-70mm f/2.8 S': { coverage: 'instant', basePrice: 1300 },
  'Nikon Z 70-200mm f/2.8 VR S': { coverage: 'instant', basePrice: 1500 },
  'Nikon Z 50mm f/1.8 S': { coverage: 'instant', basePrice: 350 },
  'Canon EOS R5': { coverage: 'instant', basePrice: 1900 },
  'Canon EOS R6 II': { coverage: 'instant', basePrice: 1400 },
  'Canon EOS R5 Mark II': { coverage: 'minutes' },
  'Canon EOS R3': { coverage: 'instant', basePrice: 2900 },
  'Canon EOS R8': { coverage: 'instant', basePrice: 850 },
  'Canon EOS R7': { coverage: 'instant', basePrice: 850 },
  'Canon RF 24-70mm f/2.8L IS USM': { coverage: 'instant', basePrice: 1500 },
  'Canon RF 70-200mm f/2.8L IS USM': { coverage: 'instant', basePrice: 1700 },
  'Canon RF 50mm f/1.2L USM': { coverage: 'instant', basePrice: 1350 },
  'Fujifilm X-T5': { coverage: 'manual' },
};

/* Conditie-factoren op het bod (mock; in productie uit pricing_rules.json — wear = MIN(conditie, shutter)) */
export const CONDITION_FACTOR: Record<string, number> = {
  'Zo goed als nieuw': 1.0,
  'Zeer goed': 0.93,
  'Goed': 0.85,
  'Gebruikt': 0.74,
  'Zwaar gebruikt': 0.6,
};

/* Shutter-staffel (mock) — bereik → factor */
export const SHUTTER_RANGES: { label: string; factor: number }[] = [
  { label: 'Tot 25.000', factor: 1.0 },
  { label: '25.000 – 75.000', factor: 0.93 },
  { label: '75.000 – 150.000', factor: 0.84 },
  { label: 'Meer dan 150.000', factor: 0.7 },
];

export function estimateBid(name: string, condition: string, shutterLabel?: string): { coverage: BidCoverage; price?: number } {
  const p = SELL_PRICING[name] ?? { coverage: 'manual' as BidCoverage };
  if (p.coverage !== 'instant' || !p.basePrice) return { coverage: p.coverage };
  const cf = CONDITION_FACTOR[condition] ?? 0.85;
  const sf = shutterLabel ? (SHUTTER_RANGES.find(r => r.label === shutterLabel)?.factor ?? 1) : 1;
  // niet dubbel tellen: slijtage = MIN(conditie, shutter)
  const wear = Math.min(cf, sf);
  const price = Math.round((p.basePrice * wear) / 5) * 5;
  return { coverage: 'instant', price };
}

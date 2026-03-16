export interface ProductVariant {
  sku: string;
  price: number;
  condition: string;
  conditionLabel: string;
  shutterCount?: number;
  cosmeticRemark?: string;
  sensorCleaned?: boolean;
  firmwareVersion?: string;
  boxIncluded?: boolean;
  accessories?: string[];
  images: string[];
  inclVat?: boolean;
  badges?: ('outlet' | 'new' | 'sale' | 'vat')[];
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  fromPrice?: boolean;
  stock: number;
  image: string;
  badge?: 'vat' | 'outlet' | 'sale' | 'new';
  description?: string;
  variants: ProductVariant[];
  specs?: Record<string, string>;
}

export const products: Product[] = [
  {
    id: '1',
    slug: 'sony-a7-iv',
    title: 'Sony A7 IV',
    brand: 'Sony',
    category: 'cameras',
    price: 1749,
    fromPrice: true,
    stock: 8,
    image: '/images/sony-a7-iv.jpg',
    badge: 'vat',
    description: 'Full-frame mirrorless camera with 33MP sensor',
    variants: [
      { sku: '257962', price: 1749, condition: 'excellent', conditionLabel: 'Excellent', shutterCount: 12400, cosmeticRemark: 'On the back screen is a small scratch — does not impact display quality or functionality.', sensorCleaned: true, firmwareVersion: '2.01', boxIncluded: false, accessories: ['Body cap', 'Battery NP-FZ100', 'Charger', 'Strap'], images: ['/images/sony-a7-iv.jpg', '/images/sony-a7-iv.jpg', '/images/sony-a7-iv.jpg', '/images/sony-a7-iv.jpg'], inclVat: true, badges: ['vat'] },
      { sku: '257999', price: 1649, condition: 'good', conditionLabel: 'Good', shutterCount: 34200, cosmeticRemark: 'Light wear marks on the top plate and bottom plate. Fully functional.', sensorCleaned: true, firmwareVersion: '1.06', boxIncluded: false, accessories: ['Body cap', 'Battery NP-FZ100'], images: ['/images/sony-a7-iv.jpg'], inclVat: true, badges: ['outlet', 'vat'] },
      { sku: '258040', price: 1499, condition: 'used', conditionLabel: 'Used', shutterCount: 67800, cosmeticRemark: 'Visible wear on body edges and grip rubber. LCD has minor scratches. All functions work perfectly.', sensorCleaned: true, firmwareVersion: '1.06', boxIncluded: false, accessories: ['Body cap'], images: ['/images/sony-a7-iv.jpg'] },
      { sku: '258041', price: 1849, condition: 'as-new', conditionLabel: 'As New', shutterCount: 980, sensorCleaned: true, firmwareVersion: '2.01', boxIncluded: true, accessories: ['Body cap', 'Battery NP-FZ100', 'Charger', 'Strap', 'USB-C cable', 'Box'], images: ['/images/sony-a7-iv.jpg'], inclVat: true, badges: ['new'] },
      { sku: '258042', price: 1699, condition: 'excellent', conditionLabel: 'Excellent', shutterCount: 18500, cosmeticRemark: 'Tiny mark on the hot shoe — cosmetic only.', sensorCleaned: true, firmwareVersion: '1.06', boxIncluded: false, accessories: ['Body cap', 'Battery NP-FZ100', 'Charger'], images: ['/images/sony-a7-iv.jpg'], inclVat: true, badges: ['vat'] },
      { sku: '258043', price: 1599, condition: 'good', conditionLabel: 'Good', shutterCount: 41200, cosmeticRemark: 'General wear on grip and dials. Screen in good condition.', sensorCleaned: true, firmwareVersion: '1.06', boxIncluded: false, accessories: ['Body cap', 'Battery NP-FZ100'], images: ['/images/sony-a7-iv.jpg'], badges: ['outlet'] },
      { sku: '258044', price: 1549, condition: 'good', conditionLabel: 'Good', shutterCount: 52000, cosmeticRemark: 'Wear marks on bottom plate and edges.', sensorCleaned: true, firmwareVersion: '1.06', boxIncluded: false, accessories: ['Body cap'], images: ['/images/sony-a7-iv.jpg'], inclVat: true, badges: ['vat'] },
      { sku: '258045', price: 1399, condition: 'used', conditionLabel: 'Used', shutterCount: 89000, cosmeticRemark: 'Heavy use visible. Brassing on edges, grip wear. Fully functional.', sensorCleaned: true, firmwareVersion: '1.06', boxIncluded: false, accessories: ['Body cap'], images: ['/images/sony-a7-iv.jpg'] },
    ],
    specs: { 'Sensor': '33MP Full Frame CMOS', 'Mount': 'Sony E', 'ISO Range': '100-51200', 'Video': '4K 60p', 'Weight': '658g', 'Year': '2021' },
  },
  {
    id: '2',
    slug: 'canon-eos-r5',
    title: 'Canon EOS R5',
    brand: 'Canon',
    category: 'cameras',
    price: 2899,
    fromPrice: true,
    stock: 4,
    image: '/images/canon-r5.jpg',
    badge: 'vat',
    description: '45MP full-frame mirrorless with 8K video',
    variants: [
      { sku: '258093', price: 2899, condition: 'as-new', conditionLabel: 'As New', shutterCount: 2100, sensorCleaned: true, firmwareVersion: '1.8.1', boxIncluded: true, accessories: ['Body cap', 'Battery LP-E6NH', 'Charger', 'Strap', 'USB-C cable'], images: ['/images/canon-r5.jpg'], inclVat: true },
      { sku: '258130', price: 2649, condition: 'excellent', conditionLabel: 'Excellent', shutterCount: 18700, cosmeticRemark: 'Minor scuff marks on the bottom plate — barely visible in use.', sensorCleaned: true, firmwareVersion: '1.8.1', boxIncluded: false, accessories: ['Body cap', 'Battery LP-E6NH', 'Charger'], images: ['/images/canon-r5.jpg'], inclVat: true },
    ],
    specs: { 'Sensor': '45MP Full Frame CMOS', 'Mount': 'Canon RF', 'ISO Range': '100-51200', 'Video': '8K 30p / 4K 120p', 'Weight': '738g', 'Year': '2020' },
  },
  {
    id: '3',
    slug: 'nikon-z8',
    title: 'Nikon Z8',
    brand: 'Nikon',
    category: 'cameras',
    price: 3199,
    fromPrice: true,
    stock: 3,
    image: '/images/nikon-z8.jpg',
    description: 'Flagship mirrorless with 45.7MP stacked sensor',
    variants: [
      { sku: '258177', price: 3199, condition: 'excellent', conditionLabel: 'Excellent', shutterCount: 8900, cosmeticRemark: 'Faint mark on the eyecup — cosmetic only.', sensorCleaned: true, firmwareVersion: '2.10', boxIncluded: true, accessories: ['Body cap', 'Battery EN-EL15c', 'Charger', 'Strap'], images: ['/images/nikon-z8.jpg'], inclVat: true },
      { sku: '258214', price: 2999, condition: 'good', conditionLabel: 'Good', shutterCount: 24500, cosmeticRemark: 'Light wear on grip rubber and minor marks on the bottom plate.', sensorCleaned: true, firmwareVersion: '2.00', boxIncluded: false, accessories: ['Body cap', 'Battery EN-EL15c'], images: ['/images/nikon-z8.jpg'] },
    ],
    specs: { 'Sensor': '45.7MP Stacked CMOS', 'Mount': 'Nikon Z', 'ISO Range': '64-25600', 'Video': '8K 30p / 4K 120p', 'Weight': '910g', 'Year': '2023' },
  },
  {
    id: '4',
    slug: 'fujifilm-x-t4',
    title: 'Fujifilm X-T4',
    brand: 'Fujifilm',
    category: 'cameras',
    price: 1099,
    fromPrice: true,
    stock: 5,
    image: '/images/fujifilm-x-t4.jpg',
    badge: 'new',
    description: '26.1MP APS-C mirrorless with IBIS and classic design',
    variants: [
      { sku: '258267', price: 1099, condition: 'excellent', conditionLabel: 'Excellent', shutterCount: 8200, sensorCleaned: true, firmwareVersion: '1.22', boxIncluded: false, accessories: ['Body cap', 'Battery NP-W235', 'Charger', 'Strap'], images: ['/images/fujifilm-x-t4.jpg'], inclVat: true },
      { sku: '258308', price: 949, condition: 'good', conditionLabel: 'Good', shutterCount: 22400, cosmeticRemark: 'Light paint wear on edges. Screen protector was applied (included).', sensorCleaned: true, firmwareVersion: '1.20', boxIncluded: false, accessories: ['Body cap', 'Battery NP-W235'], images: ['/images/fujifilm-x-t4.jpg'], inclVat: true },
      { sku: '258345', price: 849, condition: 'used', conditionLabel: 'Used', shutterCount: 51000, cosmeticRemark: 'Visible wear on body and dials. Small dent on hot shoe — does not affect flash mounting.', sensorCleaned: true, firmwareVersion: '1.13', boxIncluded: false, accessories: ['Body cap'], images: ['/images/fujifilm-x-t4.jpg'] },
    ],
    specs: { 'Sensor': '26.1MP APS-C X-Trans 4', 'Mount': 'Fujifilm X', 'ISO Range': '160-12800', 'Video': '4K 60p', 'IBIS': '6.5 stops', 'Weight': '607g', 'Year': '2020' },
  },
  {
    id: '5',
    slug: 'sony-fe-24-70mm-f28-gm',
    title: 'Sony FE 24-70mm f/2.8 GM',
    brand: 'Sony',
    category: 'lenses',
    price: 1399,
    fromPrice: true,
    stock: 5,
    image: '/images/sony-fe-24-70mm-f28-gm.jpg',
    badge: 'vat',
    description: 'Professional standard zoom lens',
    variants: [
      { sku: '258398', price: 1399, condition: 'excellent', conditionLabel: 'Excellent', firmwareVersion: '03', boxIncluded: true, accessories: ['Front cap', 'Rear cap', 'Hood', 'Pouch'], images: ['/images/sony-fe-24-70mm-f28-gm.jpg'], inclVat: true },
      { sku: '258439', price: 1249, condition: 'good', conditionLabel: 'Good', cosmeticRemark: 'Light wear ring on the zoom barrel — does not affect smoothness.', firmwareVersion: '03', boxIncluded: false, accessories: ['Front cap', 'Rear cap'], images: ['/images/sony-fe-24-70mm-f28-gm.jpg'], inclVat: true },
    ],
    specs: { 'Focal Length': '24-70mm', 'Aperture': 'f/2.8', 'Mount': 'Sony E', 'Stabilization': 'No (IBIS compatible)', 'Weight': '886g', 'Year': '2016' },
  },
  {
    id: '6',
    slug: 'canon-rf-24-70mm-f28-l-is-usm',
    title: 'Canon RF 24-70mm f/2.8L IS USM',
    brand: 'Canon',
    category: 'lenses',
    price: 1849,
    fromPrice: true,
    stock: 3,
    image: '/images/canon-rf-24-70mm-f28-l-is-usm.jpg',
    description: 'Professional standard zoom with IS',
    variants: [
      { sku: '258476', price: 1849, condition: 'excellent', conditionLabel: 'Excellent', firmwareVersion: '1.0.6', boxIncluded: true, accessories: ['Front cap', 'Rear cap', 'Hood', 'Case'], images: ['/images/canon-rf-24-70mm-f28-l-is-usm.jpg'], inclVat: true },
      { sku: '258529', price: 1649, condition: 'good', conditionLabel: 'Good', cosmeticRemark: 'Minor marks on the lens hood. Glass elements are clean and scratch-free.', firmwareVersion: '1.0.6', boxIncluded: false, accessories: ['Front cap', 'Rear cap', 'Hood'], images: ['/images/canon-rf-24-70mm-f28-l-is-usm.jpg'] },
    ],
    specs: { 'Focal Length': '24-70mm', 'Aperture': 'f/2.8', 'Mount': 'Canon RF', 'Stabilization': '5 stops IS', 'Weight': '900g', 'Year': '2019' },
  },
  {
    id: '7',
    slug: 'sony-a7r-v',
    title: 'Sony A7R V',
    brand: 'Sony',
    category: 'cameras',
    price: 2999,
    fromPrice: true,
    stock: 2,
    image: '/images/sony-a7r-v.jpg',
    description: '61MP full-frame mirrorless with AI-based AF',
    variants: [
      { sku: '258570', price: 2999, condition: 'excellent', conditionLabel: 'Excellent', shutterCount: 4800, sensorCleaned: true, firmwareVersion: '2.01', boxIncluded: true, accessories: ['Body cap', 'Battery NP-FZ100', 'Charger', 'Strap', 'Box'], images: ['/images/sony-a7r-v.jpg'], inclVat: true },
      { sku: '258607', price: 2749, condition: 'good', conditionLabel: 'Good', shutterCount: 21500, cosmeticRemark: 'Small scuff on the bottom plate near the tripod mount.', sensorCleaned: true, firmwareVersion: '2.00', boxIncluded: false, accessories: ['Body cap', 'Battery NP-FZ100', 'Charger'], images: ['/images/sony-a7r-v.jpg'] },
    ],
    specs: { 'Sensor': '61MP Full Frame BSI CMOS', 'Mount': 'Sony E', 'ISO Range': '100-32000', 'Video': '8K 24p / 4K 60p', 'Weight': '723g', 'Year': '2022' },
  },
  {
    id: '8',
    slug: 'sony-a1',
    title: 'Sony A1',
    brand: 'Sony',
    category: 'cameras',
    price: 5499,
    fromPrice: true,
    stock: 2,
    image: '/images/sony-a1.jpg',
    badge: 'sale',
    description: '50.1MP flagship with 30fps burst and 8K video',
    variants: [
      { sku: '258660', price: 5499, condition: 'excellent', conditionLabel: 'Excellent', shutterCount: 11200, sensorCleaned: true, firmwareVersion: '2.10', boxIncluded: true, accessories: ['Body cap', 'Battery NP-FZ100', 'Charger', 'Strap', 'HDMI cable'], images: ['/images/sony-a1.jpg'], inclVat: true },
      { sku: '258701', price: 4999, condition: 'good', conditionLabel: 'Good', shutterCount: 45600, cosmeticRemark: 'Wear marks on the grip and bottom plate. EVF and LCD in perfect condition.', sensorCleaned: true, firmwareVersion: '2.02', boxIncluded: false, accessories: ['Body cap', 'Battery NP-FZ100'], images: ['/images/sony-a1.jpg'] },
    ],
    specs: { 'Sensor': '50.1MP Stacked CMOS', 'Mount': 'Sony E', 'ISO Range': '100-32000', 'Video': '8K 30p / 4K 120p', 'Burst': '30fps', 'Weight': '737g', 'Year': '2021' },
  },
  {
    id: '9',
    slug: 'nikon-zf',
    title: 'Nikon Zf',
    brand: 'Nikon',
    category: 'cameras',
    price: 1699,
    fromPrice: true,
    stock: 3,
    image: '/images/nikon-zf.jpg',
    badge: 'new',
    description: 'Retro-styled 24.5MP full-frame mirrorless',
    variants: [
      { sku: '258738', price: 1699, condition: 'as-new', conditionLabel: 'As New', shutterCount: 1200, sensorCleaned: true, firmwareVersion: '1.40', boxIncluded: true, accessories: ['Body cap', 'Battery EN-EL15c', 'Charger', 'Strap', 'USB-C cable'], images: ['/images/nikon-zf.jpg'], inclVat: true },
      { sku: '258791', price: 1549, condition: 'excellent', conditionLabel: 'Excellent', shutterCount: 7800, cosmeticRemark: 'Very faint mark on the top dial — barely visible.', sensorCleaned: true, firmwareVersion: '1.30', boxIncluded: false, accessories: ['Body cap', 'Battery EN-EL15c', 'Charger'], images: ['/images/nikon-zf.jpg'], inclVat: true },
    ],
    specs: { 'Sensor': '24.5MP Full Frame CMOS', 'Mount': 'Nikon Z', 'ISO Range': '100-64000', 'Video': '4K 30p', 'IBIS': '8 stops', 'Weight': '710g', 'Year': '2023' },
  },
  {
    id: '10',
    slug: 'dji-mavic-2-pro',
    title: 'DJI Mavic 2 Pro',
    brand: 'DJI',
    category: 'drones',
    price: 899,
    stock: 0,
    image: '/images/dji-mavic-2-pro.jpg',
    description: 'Foldable drone with Hasselblad 1" sensor camera',
    variants: [],
    specs: { 'Camera': '20MP 1" Hasselblad CMOS', 'Video': '4K 30p 10-bit', 'Flight Time': '31 min', 'Weight': '907g', 'Year': '2018' },
  },
  {
    id: '11',
    slug: 'hasselblad-x2d-100c',
    title: 'Hasselblad X2D 100C',
    brand: 'Hasselblad',
    category: 'cameras',
    price: 7499,
    stock: 1,
    image: '/images/hasselblad-x2d-100c.jpg',
    description: '100MP medium format mirrorless camera',
    variants: [
      { sku: '258832', price: 7499, condition: 'excellent', conditionLabel: 'Excellent', shutterCount: 1800, sensorCleaned: true, firmwareVersion: '1.4.0', boxIncluded: true, accessories: ['Body cap', 'Battery', 'Charger', 'Strap', 'Box'], images: ['/images/hasselblad-x2d-100c.jpg'], inclVat: true },
    ],
    specs: { 'Sensor': '100MP Medium Format CMOS', 'Mount': 'Hasselblad X', 'ISO Range': '64-25600', 'Video': '2.7K', 'Weight': '895g', 'Year': '2022' },
  },
  {
    id: '12',
    slug: 'sony-fe-70-200mm-f28-gm-oss-ii',
    title: 'Sony FE 70-200mm f/2.8 GM OSS II',
    brand: 'Sony',
    category: 'lenses',
    price: 2149,
    fromPrice: true,
    stock: 3,
    image: '/images/sony-fe-70-200mm-f28-gm-oss-ii.jpg',
    badge: 'outlet',
    description: 'Professional telephoto zoom lens',
    variants: [
      { sku: '258869', price: 2149, condition: 'as-new', conditionLabel: 'As New', firmwareVersion: '04', boxIncluded: true, accessories: ['Front cap', 'Rear cap', 'Hood', 'Case', 'Strap'], images: ['/images/sony-fe-70-200mm-f28-gm-oss-ii.jpg'], inclVat: true },
      { sku: '258922', price: 1949, condition: 'excellent', conditionLabel: 'Excellent', cosmeticRemark: 'Tiny mark on the lens hood — glass is perfect.', firmwareVersion: '04', boxIncluded: false, accessories: ['Front cap', 'Rear cap', 'Hood'], images: ['/images/sony-fe-70-200mm-f28-gm-oss-ii.jpg'], inclVat: true },
      { sku: '258963', price: 1749, condition: 'good', conditionLabel: 'Good', cosmeticRemark: 'Light wear on focus ring and barrel. Optics are clean.', firmwareVersion: '03', boxIncluded: false, accessories: ['Front cap', 'Rear cap'], images: ['/images/sony-fe-70-200mm-f28-gm-oss-ii.jpg'] },
    ],
    specs: { 'Focal Length': '70-200mm', 'Aperture': 'f/2.8', 'Mount': 'Sony E', 'Stabilization': 'OSS', 'Weight': '1045g', 'Year': '2021' },
  },
  {
    id: '13',
    slug: 'sony-a7-v',
    title: 'Sony Alpha A7 V',
    brand: 'Sony',
    category: 'cameras',
    price: 2799,
    stock: 0,
    image: '/images/sony-a7-iv.jpg',
    description: 'Full-frame mirrorless camera',
    variants: [],
  },
  {
    id: '14',
    slug: 'sony-a7c-ii',
    title: 'Sony Alpha A7C II',
    brand: 'Sony',
    category: 'cameras',
    price: 1899,
    stock: 0,
    image: '/images/sony-a7-iv.jpg',
    description: 'Compact full-frame mirrorless camera',
    variants: [],
  },
  {
    id: '15',
    slug: 'sony-a7-ii',
    title: 'Sony Alpha A7 II',
    brand: 'Sony',
    category: 'cameras',
    price: 699,
    stock: 0,
    image: '/images/sony-a7-iv.jpg',
    description: 'Full-frame mirrorless camera',
    variants: [],
  },
  {
    id: '16',
    slug: 'nikon-z6-iii',
    title: 'Nikon Z6 III',
    brand: 'Nikon',
    category: 'cameras',
    price: 2499,
    stock: 0,
    image: '/images/nikon-z8.jpg',
    description: '24.5MP full-frame mirrorless with partially stacked sensor',
    variants: [],
  },
  {
    id: '17',
    slug: 'canon-eos-r6-mark-ii',
    title: 'Canon EOS R6 Mark II',
    brand: 'Canon',
    category: 'cameras',
    price: 1999,
    stock: 0,
    image: '/images/canon-r5.jpg',
    description: '24.2MP full-frame mirrorless with 40fps burst',
    variants: [],
  },
  {
    id: '18',
    slug: 'fujifilm-x-t5',
    title: 'Fujifilm X-T5',
    brand: 'Fujifilm',
    category: 'cameras',
    price: 1399,
    stock: 0,
    image: '/images/fujifilm-x-t4.jpg',
    description: '40.2MP APS-C mirrorless with classic design',
    variants: [],
  },
  {
    id: '19',
    slug: 'leica-q3',
    title: 'Leica Q3',
    brand: 'Leica',
    category: 'cameras',
    price: 5499,
    stock: 0,
    image: '/images/nikon-zf.jpg',
    description: '60.3MP full-frame compact with fixed 28mm f/1.7 lens',
    variants: [],
  },
  {
    id: '20',
    slug: 'canon-eos-r3',
    title: 'Canon EOS R3',
    brand: 'Canon',
    category: 'cameras',
    price: 4499,
    stock: 0,
    image: '/images/canon-r5.jpg',
    description: '24.1MP full-frame mirrorless with eye-control AF',
    variants: [],
  },
];

export const categories = [
  { label: 'Cameras', icon: 'camera', count: 1247, href: '/cameras' },
  { label: 'Lenses', icon: 'lens', count: 2341, href: '/lenses' },
  { label: 'Video', icon: 'cinema', count: 189, href: '/cinema' },
  { label: 'Drones', icon: 'drone', count: 67, href: '/action-drones' },
  { label: 'Accessories', icon: 'accessories', count: 4521, href: '/accessories' },
  { label: 'Sale', icon: 'sale', count: 342, href: '/sale' },
];

export interface SearchProduct {
  slug: string;
  title: string;
  image: string;
  stock: string;
  keywords: string[];
}

export const searchProducts: SearchProduct[] = [
  { slug: 'sony-a7-iv', title: 'Sony A7 IV', image: '/images/sony-a7-iv.jpg', stock: '6 in stock', keywords: ['sony', 'a7', 'a7iv', 'a7 iv', 'full frame', 'mirrorless'] },
  { slug: 'canon-eos-r5', title: 'Canon EOS R5', image: '/images/canon-r5.jpg', stock: '4 in stock', keywords: ['canon', 'r5', 'eos r5', 'eos', 'full frame', 'mirrorless', '8k'] },
  { slug: 'nikon-z8', title: 'Nikon Z8', image: '/images/nikon-z8.jpg', stock: '3 in stock', keywords: ['nikon', 'z8', 'z 8', 'flagship', 'full frame'] },
  { slug: 'fujifilm-x-t4', title: 'Fujifilm X-T4', image: '/images/fujifilm-x-t4.jpg', stock: '5 in stock', keywords: ['fujifilm', 'fuji', 'xt4', 'x-t4', 'aps-c'] },
  { slug: 'sony-fe-24-70mm-f28-gm', title: 'Sony FE 24-70mm f/2.8 GM', image: '/images/sony-24-70-gm.jpg', stock: '5 in stock', keywords: ['sony', '24-70', '24-70mm', 'gm', 'zoom', 'lens'] },
  { slug: 'canon-rf-24-70mm-f28-l-is-usm', title: 'Canon RF 24-70mm f/2.8L IS USM', image: '/images/canon-rf-24-70.jpg', stock: '3 in stock', keywords: ['canon', '24-70', '24-70mm', 'rf', 'zoom', 'lens'] },
  { slug: 'sony-a7r-v', title: 'Sony A7R V', image: '/images/sony-a7r-v.jpg', stock: '2 in stock', keywords: ['sony', 'a7r', 'a7rv', 'a7r v', '61mp', 'high-res'] },
  { slug: 'sony-a1', title: 'Sony A1', image: '/images/sony-a1.jpg', stock: '2 in stock', keywords: ['sony', 'a1', 'flagship', '50mp'] },
  { slug: 'hasselblad-x2d-100c', title: 'Hasselblad X2D 100C', image: '/images/hasselblad-x2d.jpg', stock: '1 in stock', keywords: ['hasselblad', 'x2d', 'medium format', '100mp'] },
  { slug: 'dji-mavic-2-pro', title: 'DJI Mavic 2 Pro', image: '/images/dji-mavic-2.jpg', stock: 'Out of stock', keywords: ['dji', 'mavic', 'drone', 'mavic 2'] },
  { slug: 'nikon-zf', title: 'Nikon Zf', image: '/images/nikon-zf.jpg', stock: '3 in stock', keywords: ['nikon', 'zf', 'retro', 'full frame'] },
  { slug: 'sony-fe-70-200mm-f28-gm-oss-ii', title: 'Sony FE 70-200mm f/2.8 GM OSS II', image: '/images/sony-70-200-gm-ii.jpg', stock: '3 in stock', keywords: ['sony', '70-200', '70-200mm', 'gm', 'telephoto', 'lens'] },
  { slug: 'canon-eos-r6-ii', title: 'Canon EOS R6 II', image: '/images/canon-r6-ii.jpg', stock: 'Out of stock', keywords: ['canon', 'r6', 'r6 ii', 'eos r6', 'full frame', 'mirrorless'] },
  { slug: 'sony-fe-135mm-f18-gm', title: 'Sony FE 135mm f/1.8 GM', image: '/images/sony-135-gm.jpg', stock: 'Out of stock', keywords: ['sony', '135mm', '135', 'gm', 'portrait', 'lens', 'prime', 'fe 135mm', 'f/1.8', 'sony fe 135mm f/1.8 gm'] },
  { slug: 'leica-m11', title: 'Leica M11', image: '/images/leica-m11.jpg', stock: 'Out of stock', keywords: ['leica', 'm11', 'm 11', 'rangefinder', 'full frame'] },
];

export interface BlogPost {
  slug: string;
  title: string;
  tag: string;
}

export const searchBlogPosts: BlogPost[] = [
  { slug: 'sony-a7-iv-review', title: 'Sony A7 IV vs A7 III — Is it worth the upgrade?', tag: 'Review' },
  { slug: 'best-lenses-2025', title: 'Best Lenses to Buy in 2025', tag: 'Guide' },
  { slug: 'shutter-count-guide', title: 'Understanding Shutter Count: What You Need to Know', tag: 'Guide' },
  { slug: 'canon-vs-nikon-2025', title: 'Canon vs Nikon in 2025: Which System to Choose?', tag: 'Comparison' },
];

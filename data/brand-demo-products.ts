import { Product } from './products';

// Extra demo-producten per merk zodat de merkpagina een gevuld grid van 16
// producten toont (de basisdataset heeft er maar 3-4 per merk). Puur voor de
// design-reference; prijzen/condities zijn indicatief.
interface DemoSeed {
  title: string;
  category: string;
  price: number;
  image: string;
  stock?: number;
}

const CANON_SEEDS: DemoSeed[] = [
  { title: 'Canon EOS R7', category: 'cameras', price: 1199, image: '/images/canon-r5.jpg', stock: 3 },
  { title: 'Canon EOS R8', category: 'cameras', price: 1349, image: '/images/canon-r5.jpg', stock: 2 },
  { title: 'Canon EOS RP', category: 'cameras', price: 749, image: '/images/canon-r5.jpg', stock: 5 },
  { title: 'Canon EOS R10', category: 'cameras', price: 849, image: '/images/canon-r5.jpg', stock: 2 },
  { title: 'Canon EOS 5D Mark IV', category: 'cameras', price: 999, image: '/images/canon-r5.jpg', stock: 4 },
  { title: 'Canon EOS 90D', category: 'cameras', price: 799, image: '/images/canon-r5.jpg', stock: 1 },
  { title: 'Canon RF 70-200mm f/2.8L IS USM', category: 'lenses', price: 2199, image: '/images/lenses/canon-rf-70-200-f28.webp', stock: 2 },
  { title: 'Canon RF 24-105mm f/4L IS USM', category: 'lenses', price: 899, image: '/images/lenses/canon-rf-24-105-f4.webp', stock: 4 },
  { title: 'Canon RF 28-70mm f/2L USM', category: 'lenses', price: 2399, image: '/images/lenses/canon-rf-28-70-f2.webp', stock: 1 },
  { title: 'Canon RF 200-800mm f/6.3-9 IS USM', category: 'lenses', price: 1799, image: '/images/lenses/canon-rf-200-800.webp', stock: 1 },
  { title: 'Canon RF 50mm f/1.8 STM', category: 'lenses', price: 159, image: '/images/placeholder-lens.svg', stock: 6 },
  { title: 'Canon Speedlite 600EX II-RT', category: 'accessories', price: 279, image: '/images/placeholder-camera.svg', stock: 3 },
];

const NIKON_SEEDS: DemoSeed[] = [
  { title: 'Nikon Z7 II', category: 'cameras', price: 1599, image: '/images/nikon-z8.jpg', stock: 2 },
  { title: 'Nikon Z6 II', category: 'cameras', price: 1099, image: '/images/nikon-z8.jpg', stock: 4 },
  { title: 'Nikon Z5', category: 'cameras', price: 749, image: '/images/nikon-z8.jpg', stock: 3 },
  { title: 'Nikon Zfc', category: 'cameras', price: 699, image: '/images/nikon-zf.jpg', stock: 2 },
  { title: 'Nikon D850', category: 'cameras', price: 1299, image: '/images/nikon-z8.jpg', stock: 3 },
  { title: 'Nikon D780', category: 'cameras', price: 1149, image: '/images/nikon-z8.jpg', stock: 1 },
  { title: 'Nikon Z 24-70mm f/2.8 S', category: 'lenses', price: 1699, image: '/images/placeholder-lens.svg', stock: 2 },
  { title: 'Nikon Z 70-200mm f/2.8 VR S', category: 'lenses', price: 2099, image: '/images/placeholder-lens.svg', stock: 2 },
  { title: 'Nikon Z 14-30mm f/4 S', category: 'lenses', price: 899, image: '/images/placeholder-lens.svg', stock: 3 },
  { title: 'Nikon Z 50mm f/1.8 S', category: 'lenses', price: 449, image: '/images/placeholder-lens.svg', stock: 5 },
  { title: 'Nikon Z 85mm f/1.8 S', category: 'lenses', price: 549, image: '/images/placeholder-lens.svg', stock: 2 },
  { title: 'Nikon SB-5000 Speedlight', category: 'accessories', price: 329, image: '/images/placeholder-camera.svg', stock: 2 },
  { title: 'Nikon FTZ II adapter', category: 'accessories', price: 199, image: '/images/placeholder-camera.svg', stock: 4 },
];

const SEEDS_BY_BRAND: Record<string, DemoSeed[]> = {
  canon: CANON_SEEDS,
  nikon: NIKON_SEEDS,
};

function seedToProduct(seed: DemoSeed, brand: string, index: number): Product {
  const slug = seed.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const goodPrice = Math.round(seed.price * 0.88);
  return {
    id: `demo-${brand.toLowerCase()}-${index}`,
    slug,
    title: seed.title,
    brand,
    category: seed.category,
    price: seed.price,
    fromPrice: true,
    stock: seed.stock ?? 2,
    image: seed.image,
    badge: index % 3 === 0 ? 'vat' : undefined,
    variants: [
      {
        sku: `9${(1000 + index).toString()}${brand.length}`,
        price: seed.price,
        condition: 'excellent',
        conditionLabel: 'Excellent',
        boxIncluded: false,
        images: [seed.image],
        inclVat: index % 3 === 0,
        badges: index % 3 === 0 ? ['vat'] : undefined,
      },
      {
        sku: `9${(2000 + index).toString()}${brand.length}`,
        price: goodPrice,
        condition: 'good',
        conditionLabel: 'Good',
        boxIncluded: false,
        images: [seed.image],
      },
    ],
  };
}

/**
 * Vul de productlijst van een merk aan met demo-producten tot `target` stuks,
 * zodat het grid gevuld oogt. Merken zonder seed-lijst blijven ongewijzigd.
 */
export function padBrandProducts(base: Product[], brand: string, target = 16): Product[] {
  const seeds = SEEDS_BY_BRAND[brand.toLowerCase()];
  if (!seeds || base.length >= target) return base;
  const extras = seeds.slice(0, target - base.length).map((seed, i) => seedToProduct(seed, brand, i));
  return [...base, ...extras];
}

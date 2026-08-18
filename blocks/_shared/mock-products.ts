import { products } from '@/data/products';
import type { RefProduct } from './product-card';

/** Mock-catalogus voor de referentie, met een `type` zoals V2's product_type. */
const TYPE: Record<string, string> = { cameras: 'Camera', lenses: 'Lens', drones: 'Drone' };
export const MOCK: RefProduct[] = products.map((p) => {
  const prices = p.variants.map((v) => v.price);
  return {
    id: p.id, title: p.title, href: `/product/${p.slug}`, image: p.image,
    fromPrice: prices.length ? Math.min(...prices) : p.price,
    toPrice: prices.length ? Math.max(...prices) : undefined,
    stock: p.stock, brand: p.brand, category: p.category, type: TYPE[p.category] ?? p.category,
    badge: p.badge === 'new' ? 'Nieuw binnen' : p.badge === 'vat' ? 'BTW-factuur' : undefined,
  };
});

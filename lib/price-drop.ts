/* Was/nu-prijs (referentie ticket T2): alleen bij een echte verlaging
   (>=5% of >= EUR 20 t.o.v. de laagste prijs van de 30 dagen ervoor) en
   maximaal 14 dagen na de verlaging. Daarna is de nieuwe prijs gewoon de
   prijs. Verhogingen tonen nooit iets. */
export const PRICE_DROP_MIN_PCT = 0.05;
export const PRICE_DROP_MIN_EUR = 20;
export const PRICE_DROP_SHOW_DAYS = 14;

export function activePriceDrop(v: { price: number; previousPrice?: number; priceDroppedAt?: string }): { was: number; pct: number } | null {
  if (!v.previousPrice || !v.priceDroppedAt || v.previousPrice <= v.price) return null;
  const drop = v.previousPrice - v.price;
  if (drop < PRICE_DROP_MIN_EUR && drop / v.previousPrice < PRICE_DROP_MIN_PCT) return null;
  const days = (Date.now() - new Date(v.priceDroppedAt).getTime()) / 86400000;
  if (days > PRICE_DROP_SHOW_DAYS) return null;
  return { was: v.previousPrice, pct: Math.round((drop / v.previousPrice) * 100) };
}

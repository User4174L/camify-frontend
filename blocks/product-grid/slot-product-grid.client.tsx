'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ProductCard, SectionHeader, type RefProduct } from '../_shared/product-card';
import { Section } from '../_shared/section';
import type { ProductGridContent, ProductGridData } from './types';

/**
 * Product Grid (#429): grid van producten uit meerdere categorieën met
 * filterknoppen. In V2 komt `products` uit de listing-endpoint
 * (catalog/categories/<id>/products/ met brands=/product_type=); hier mock.
 */
export function ProductGridView({ content, data, products, mockFilters }: {
  content: ProductGridContent;
  data: ProductGridData;
  products: RefProduct[];
  /** Referentie-only: per filterknop een simpele match op de mock-data (in V2 doet de listing-endpoint dit). */
  mockFilters?: Array<{ category?: string; brand?: string }>;
}) {
  const [active, setActive] = useState<number>(-1); // -1 = Alles
  const filterMatch = mockFilters ? (p: RefProduct, i: number) => { const f = mockFilters[i]; return !!f && (!f.category || p.category === f.category) && (!f.brand || p.brand === f.brand); } : undefined;
  const labels = content.filterLabels ?? [];
  const cols = data.columns ?? 4;
  const shown = (active < 0 || !filterMatch ? products : products.filter((p) => filterMatch(p, active))).slice(0, data.count ?? 16);
  return (
    <Section section={data.section}>
      <SectionHeader as={data.heading_level ?? 'h2'} title={content.title ?? ''} titleAccent={content.titleAccent} subtitle={content.subtitle} link={data.viewAllHref ? { href: data.viewAllHref, label: content.viewAllLabel ?? 'Bekijk alles' } : undefined} />
      {labels.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {['Alles', ...labels].map((l, i) => {
            const idx = i - 1;
            const on = idx === active;
            return (
              <button key={l} type="button" onClick={() => setActive(idx)} className={cn('rounded-full border px-4 py-1.5 text-sm font-semibold transition', on ? 'border-brand-500 bg-brand-500 text-white' : 'border-border-strong bg-surface text-text-secondary hover:border-brand-400 hover:text-text-primary')}>
                {l}
              </button>
            );
          })}
        </div>
      )}
      <div className={cn('grid grid-cols-2 gap-4', cols === 3 ? 'md:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4')}>
        {shown.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
      {shown.length === 0 && <p className="py-10 text-center text-sm text-text-muted">Geen producten in deze selectie.</p>}
    </Section>
  );
}

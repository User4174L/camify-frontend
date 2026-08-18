'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { ProductCard, type RefProduct } from '../_shared/product-card';
import { Section } from '../_shared/section';
import type { ProductRailContent, ProductRailData } from './types';

/** product_rail met display=carousel: horizontale scroll-snap, pijlen op desktop. */
export function SlotProductCarousel({ content, data, products }: { content: ProductRailContent; data: ProductRailData; products: RefProduct[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = data.visible ?? 5;
  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: 'smooth' });
  const w = { 4: 'lg:basis-[calc((100%-3*16px)/4)]', 5: 'lg:basis-[calc((100%-4*16px)/5)]', 6: 'lg:basis-[calc((100%-5*16px)/6)]' }[visible];
  return (
    <Section section={data.section}>
      <div className="relative">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">{content.title}{content.titleAccent ? <> <span className="italic text-brand-500">{content.titleAccent}</span></> : null}</h2>
            {content.subtitle && <p className="mt-1 text-sm text-text-secondary">{content.subtitle}</p>}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {data.viewAllHref && <a href={data.viewAllHref} className="text-sm font-semibold text-brand-500 transition-colors hover:text-brand-600">{content.viewAllLabel ?? 'Bekijk alles'} →</a>}
            <div className="hidden gap-2 lg:flex">
              {([-1, 1] as const).map((d) => (
                <button key={d} type="button" aria-label={d < 0 ? 'Vorige' : 'Volgende'} onClick={() => scroll(d)} className="flex h-9 w-9 items-center justify-center rounded-full border border-border-strong bg-surface text-text-secondary shadow-soft transition hover:border-brand-400 hover:text-brand-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{d < 0 ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}</svg>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div ref={ref} className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
          {products.slice(0, data.count ?? 12).map((p) => (
            <div key={p.id} className={cn('shrink-0 snap-start basis-[70%] sm:basis-[calc((100%-16px)/2)] md:basis-[calc((100%-2*16px)/3)]', w)}>
              <ProductCard p={p} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

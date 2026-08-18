import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Section } from '../_shared/section';
import type { CtaBandContent, CtaBandData } from './types';

const VARIANT = {
  brand: { box: 'bg-brand-500 text-white', sub: 'text-white/85', btn: 'bg-white text-brand-600 hover:bg-brand-50', btn2: 'border border-white/60 text-white hover:bg-white/10' },
  inverse: { box: 'bg-surface-inverse text-text-inverse', sub: 'text-text-inverse/75', btn: 'bg-brand-500 text-white hover:bg-brand-600', btn2: 'border border-text-inverse/40 text-text-inverse hover:bg-text-inverse/10' },
  light: { box: 'bg-surface-raised text-text-primary border border-border-soft', sub: 'text-text-secondary', btn: 'bg-brand-500 text-white hover:bg-brand-600', btn2: 'border border-border-strong text-text-primary hover:bg-surface-muted' },
} as const;

/** CTA-band: één boodschap + 1–2 knoppen. Vertaalbaar per markt, presets voor terugkerende oproepen. */
export function SlotCtaBand({ content, data }: { content: CtaBandContent; data: CtaBandData }) {
  const v = VARIANT[data.variant ?? 'brand'];
  const center = data.align === 'center';
  const compact = data.compact ?? false;
  return (
    <Section section={{ padding: 'sm', ...data.section }}>
      <div className={cn('flex flex-col gap-4 rounded-2xl', compact ? 'px-6 py-4 md:flex-row md:items-center md:justify-between' : 'px-7 py-8 sm:px-10 sm:py-10 md:flex-row md:items-center md:justify-between', center && 'md:flex-col md:items-center md:text-center', v.box)}>
        <div className={cn('min-w-0', !center && 'md:max-w-2xl')}>
          {content.title && <p className={cn('font-extrabold tracking-tight', compact ? 'text-lg' : 'text-2xl sm:text-[28px]')}>{content.title}</p>}
          {content.subtitle && !compact && <p className={cn('mt-1.5 text-[15px] leading-relaxed', v.sub)}>{content.subtitle}</p>}
          {content.subtitle && compact && <p className={cn('text-sm', v.sub)}>{content.subtitle}</p>}
        </div>
        {(content.primary_label || content.secondary_label) && (
          <div className={cn('flex shrink-0 flex-wrap gap-3', center && 'justify-center')}>
            {content.primary_label && <Link href={content.primary_href ?? '#'} className={cn('inline-flex items-center gap-2 rounded-full font-semibold shadow-soft transition hover:-translate-y-0.5', compact ? 'px-5 py-2 text-sm' : 'px-6 py-2.5 text-[15px]', v.btn)}>{content.primary_label} →</Link>}
            {content.secondary_label && <Link href={content.secondary_href ?? '#'} className={cn('inline-flex items-center rounded-full font-semibold transition', compact ? 'px-5 py-2 text-sm' : 'px-6 py-2.5 text-[15px]', v.btn2)}>{content.secondary_label}</Link>}
          </div>
        )}
      </div>
    </Section>
  );
}

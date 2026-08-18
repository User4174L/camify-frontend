import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Sectie-wrapper — de generieke schil om élk blok (voorstel voor V2).
 * Leest `data.section` en zet achtergrond, breedte en verticale ruimte.
 * Eén keer bouwen in V2 (om elke freeform-renderer heen), daarna heeft ieder
 * blok dezelfde vier knoppen. Zie SECTION_FIELDS in registry-types.ts.
 */
export type SectionSettings = {
  background?: 'none' | 'raised' | 'muted' | 'brand' | 'inverse';
  width?: 'full' | 'container';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  anchor_id?: string;
};

const BG: Record<NonNullable<SectionSettings['background']>, string> = {
  none: '',
  raised: 'bg-surface-raised',
  muted: 'bg-surface-muted',
  brand: 'bg-brand-50',
  inverse: 'bg-surface-inverse text-text-inverse',
};

const PAD: Record<NonNullable<SectionSettings['padding']>, string> = {
  none: 'py-0',
  sm: 'py-6',
  md: 'py-12',
  lg: 'py-20',
};

export function Container({ children, className, as: Tag = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'section' | 'header' | 'nav' }) {
  // 1-op-1 met APP-Frontend-V2/components/ui/container.tsx
  return <Tag className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>{children}</Tag>;
}

export function Section({ section, children, className, bleed = false }: { section?: SectionSettings; children: ReactNode; className?: string; /** true = het blok regelt zijn eigen volle breedte (banner) en krijgt geen container. */ bleed?: boolean }) {
  const bg = section?.background ?? 'none';
  const width = section?.width ?? 'full';
  const pad = section?.padding ?? 'md';
  const inverse = bg === 'inverse';

  if (bleed) {
    return (
      <section id={section?.anchor_id || undefined} className={cn(BG[bg], className)}>
        {children}
      </section>
    );
  }
  if (width === 'container') {
    return (
      <section id={section?.anchor_id || undefined} className={cn(className)}>
        <Container>
          <div className={cn('rounded-2xl', bg !== 'none' && 'px-6 sm:px-10', BG[bg], PAD[pad], inverse && 'text-text-inverse')}>{children}</div>
        </Container>
      </section>
    );
  }
  return (
    <section id={section?.anchor_id || undefined} className={cn(BG[bg], PAD[pad], className)}>
      <Container>{children}</Container>
    </section>
  );
}

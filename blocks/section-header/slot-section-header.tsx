import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Section } from '../_shared/section';
import type { SectionHeaderContent, SectionHeaderData } from './types';

/**
 * Sectiekop als los blok — 1-op-1 de markup van V2's HomeSectionHeader
 * (home-section-header.tsx), plus kopniveau en uitlijning. Default padding
 * 'sm' onder, zodat hij dicht op het volgende blok zit.
 */
export function SectionHeaderView({ content, data }: { content: SectionHeaderContent; data: SectionHeaderData }) {
  const Heading = data.heading_level ?? 'h2';
  const center = data.align === 'center';
  const inverse = data.section?.background === 'inverse';
  return (
    <Section section={{ padding: 'sm', ...data.section }} className="[&+section]:pt-0">
      <div className={cn('flex items-end justify-between gap-4', center && 'flex-col items-center text-center')}>
        <div>
          <Heading className={cn('text-2xl font-extrabold tracking-tight sm:text-3xl', inverse ? 'text-text-inverse' : 'text-text-primary')}>
            {content.title}
            {content.titleAccent ? <> <span className="italic text-brand-500">{content.titleAccent}</span></> : null}
          </Heading>
          {content.subtitle && <p className={cn('mt-1 text-sm', inverse ? 'text-text-inverse/75' : 'text-text-secondary')}>{content.subtitle}</p>}
        </div>
        {content.linkLabel && (
          <Link href={content.linkHref ?? '#'} className="shrink-0 text-sm font-semibold text-brand-500 transition-colors hover:text-brand-600">{content.linkLabel} →</Link>
        )}
      </div>
    </Section>
  );
}

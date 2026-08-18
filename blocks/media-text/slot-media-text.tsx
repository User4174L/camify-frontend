import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Markdown } from '../_shared/markdown';
import { Section } from '../_shared/section';
import type { MediaTextContent, MediaTextData } from './types';

const RATIO: Record<NonNullable<MediaTextData['ratio']>, string> = {
  '1:1': 'md:grid-cols-2',
  '2:3': 'md:grid-cols-[2fr_3fr]',
  '3:2': 'md:grid-cols-[3fr_2fr]',
};

/** Beeld + tekst split — de standaard bouwsteen van elke lange pagina. */
export function SlotMediaText({ content, data }: { content: MediaTextContent; data: MediaTextData }) {
  const right = data.media_side === 'right';
  const ratio = data.ratio ?? '1:1';
  const Heading = data.heading_level ?? 'h2';
  const style = data.media_style ?? 'rounded';
  const inverse = data.section?.background === 'inverse';
  return (
    <Section section={data.section}>
      <div className={cn('grid grid-cols-1 gap-8 md:gap-12', RATIO[ratio], (data.align ?? 'center') === 'center' ? 'items-center' : 'items-start')}>
        <div className={cn('relative aspect-[4/3] overflow-hidden', right && 'md:order-2', style === 'rounded' && 'rounded-2xl', style === 'card' && 'rounded-2xl border-[1.5px] border-border-soft bg-surface-raised p-2 shadow-soft')}>
          {data.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.image_url} alt={content.image_alt ?? ''} className={cn('h-full w-full object-cover', style === 'card' && 'rounded-xl')} />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface-muted text-text-muted">Afbeelding</div>
          )}
        </div>
        <div className={cn('min-w-0', right && 'md:order-1')}>
          {content.eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[.08em] text-brand-500">{content.eyebrow}</p>}
          {content.title && <Heading className={cn('text-[clamp(22px,2.6vw,30px)] font-extrabold leading-tight tracking-tight', inverse ? 'text-text-inverse' : 'text-text-primary')}>{content.title}</Heading>}
          {content.body && <Markdown source={content.body} className={cn('mt-4 text-[15px]', inverse ? 'text-text-inverse/80' : 'text-text-secondary')} />}
          {content.cta_label && (
            <Link href={content.cta_href ?? '#'} className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-500">
              {content.cta_label} <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      </div>
    </Section>
  );
}

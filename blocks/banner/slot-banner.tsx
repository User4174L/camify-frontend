import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Container, Section } from '../_shared/section';
import type { BannerContent, BannerData } from './types';

/**
 * Banner-renderer met de voorgestelde `layout`-uitbreiding.
 * hero  = huidige V2-band (structuur overgenomen uit trade-in-hero.tsx)
 * compact = lage paginakop: min-h 200/220, tekst links, geen icoon,
 *           kopniveau instelbaar, Trustpilot optioneel.
 */
export function SlotBanner({ content, data }: { content: BannerContent; data: BannerData }) {
  const layout = data.layout ?? 'hero';
  const compact = layout === 'compact';
  const Heading = (data.heading_level ?? 'h1') === 'none' ? 'p' : (data.heading_level ?? 'h1');
  const overlay = data.overlay_style ?? 'gradient';
  const theme = data.text_theme ?? (overlay === 'scrim' ? 'light' : 'dark');
  const light = theme === 'light';
  const center = data.text_align === 'center';
  const showIcon = data.show_icon ?? !compact;
  const posX = data.image_position ?? 'right';
  const posY = data.image_position_y ?? 'center';

  return (
    <Section section={{ ...data.section, padding: 'none' }} bleed>
      <div className={cn('relative flex items-center overflow-hidden bg-gradient-to-r from-surface-muted via-surface-muted to-surface-raised', compact ? 'min-h-[200px] md:min-h-[220px]' : 'mb-12 min-h-[320px] md:min-h-[400px]')}>
        {data.image_url && (
          <div aria-hidden className={cn('pointer-events-none absolute inset-0', overlay === 'gradient' && 'md:left-auto md:w-[62%]', overlay === 'gradient' && '[mask-image:linear-gradient(to_right,transparent,black_35%)]')}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.image_url} alt={content.image_alt ?? ''} className="h-full w-full object-cover" style={{ objectPosition: `${posX} ${posY}`, opacity: data.image_opacity ?? 1, transform: `scale(${data.image_zoom ?? 1})` }} />
            {overlay === 'scrim' && <div className="absolute inset-0 bg-black/45" />}
          </div>
        )}
        <Container className={cn('relative z-[2]', center && 'text-center')}>
          <div className={cn(compact ? 'max-w-2xl py-7' : 'max-w-xl py-9', center && 'mx-auto')}>
            {showIcon && (
              <span className={cn('mb-4 flex text-brand-500', center && 'justify-center')} aria-hidden>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 3 4 4-4 4" /><path d="M20 7H4" /><path d="m8 21-4-4 4-4" /><path d="M4 17h16" /></svg>
              </span>
            )}
            {(content.title_lead || content.title_accent) && (
              <Heading className={cn('font-extrabold leading-tight tracking-tight', compact ? 'text-[clamp(24px,3.2vw,34px)]' : 'text-2xl sm:text-3xl', light ? 'text-white' : 'text-text-primary')}>
                {content.title_lead}
                {content.title_accent && <span className={cn('text-brand-500', compact ? ' ' : 'block')}>{compact ? ` ${content.title_accent}` : content.title_accent}</span>}
              </Heading>
            )}
            {content.subtitle && <p className={cn('mt-2.5 text-sm sm:text-[15px] leading-relaxed', light ? 'text-white/85' : 'text-text-secondary')}>{content.subtitle}</p>}
            {content.cta_label && (
              <Link href={content.cta_href ?? '#'} className={cn('inline-flex items-center gap-2 rounded-full bg-brand-500 font-semibold text-white shadow-elevated transition hover:-translate-y-0.5 hover:bg-brand-600', compact ? 'mt-4 px-5 py-2 text-sm' : 'mt-5 px-7 py-2.5 text-[15px]')}>
                {content.cta_label} →
              </Link>
            )}
            {data.show_trustpilot && (
              <div className={cn('mt-4 inline-flex items-center gap-2 rounded-lg bg-white/90 px-2.5 py-1.5 text-xs font-semibold text-text-primary shadow-soft')}>
                <span className="text-[#00b67a]">★★★★★</span> 4,8 op Trustpilot
              </div>
            )}
          </div>
        </Container>
      </div>
    </Section>
  );
}

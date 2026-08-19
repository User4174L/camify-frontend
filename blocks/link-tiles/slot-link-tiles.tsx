import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Section } from '../_shared/section';
import type { LinkTileItem, LinkTilesData } from './types';

const RATIO = { '4:3': 'aspect-[4/3]', '1:1': 'aspect-square', '16:9': 'aspect-video' } as const;
const COLS = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'grid-cols-2 lg:grid-cols-4' } as const;

/** Linktegels met foto: navigatiesectie voor merk-/landingspagina's ("Canon RF → camera's / lenzen / accessoires"). */
export function LinkTilesView({ items, data }: { items: LinkTileItem[]; data: LinkTilesData }) {
  const style = data.style ?? 'photo';
  const ratio = data.ratio ?? '4:3';
  const cols = data.columns ?? 3;
  return (
    <Section section={data.section}>
      <div className={cn('grid grid-cols-1 gap-4', COLS[cols])}>
        {items.map((t) => (
          <Link key={t.href + t.title} href={t.href} className={cn('group relative block overflow-hidden rounded-2xl border border-border-soft bg-surface transition hover:border-brand-300 hover:shadow-elevated', style === 'overlay' && 'border-0')}>
            <div className={cn('relative overflow-hidden bg-surface-muted', RATIO[ratio])}>
              {t.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.image_url} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
              ) : (
                <div className="flex h-full items-center justify-center text-text-muted">Foto</div>
              )}
              {t.badge && <span className="absolute left-3 top-3 rounded-full bg-surface px-3 py-1 text-[11px] font-bold text-text-primary shadow-soft">{t.badge}</span>}
              {style === 'overlay' && <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />}
              {style === 'overlay' && (
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-lg font-extrabold leading-tight">{t.title}</p>
                  {t.subtitle && <p className="mt-1 text-sm text-white/80">{t.subtitle}</p>}
                  <span className="mt-2 inline-block text-sm font-semibold text-brand-300">Bekijk →</span>
                </div>
              )}
            </div>
            {style === 'photo' && (
              <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-bold text-text-primary">{t.title}</p>
                  {t.subtitle && <p className="truncate text-sm text-text-secondary">{t.subtitle}</p>}
                </div>
                <span aria-hidden className="shrink-0 text-brand-500 transition group-hover:translate-x-0.5">→</span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </Section>
  );
}

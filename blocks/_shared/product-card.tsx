import Link from 'next/link';
import { cn } from '@/lib/utils';

/** Minimale kopie van V2's HomeProductCard (home-product-card.tsx) voor de referentie. */
export type RefProduct = { id: string; title: string; href: string; image: string; fromPrice: number; toPrice?: number; stock: number; badge?: string; brand: string; category: string; type?: string };

function stock(n: number) {
  if (n <= 0) return { label: 'Uitverkocht', dot: 'bg-text-muted', text: 'text-text-secondary' };
  if (n <= 2) return { label: `Laatste ${n}`, dot: 'bg-error', text: 'text-error font-semibold' };
  if (n <= 5) return { label: `Nog ${n} op voorraad`, dot: 'bg-warning', text: 'text-warning font-semibold' };
  return { label: `${n} op voorraad`, dot: 'bg-success', text: 'text-text-secondary' };
}

export function ProductCard({ p, className }: { p: RefProduct; className?: string }) {
  const s = stock(p.stock);
  return (
    <div className={cn('group relative flex flex-col overflow-hidden rounded-xl border border-border-soft bg-surface transition hover:border-brand-300 hover:shadow-elevated', className)}>
      <Link href={p.href} aria-label={p.title} className="absolute inset-0 z-[1] rounded-xl" />
      <div className={cn('relative aspect-square overflow-hidden bg-surface', p.stock <= 0 && 'opacity-60')}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image} alt={p.title} className="h-full w-full object-contain p-[12%]" />
        {p.badge && <span className="pointer-events-none absolute left-2.5 top-2.5 z-10 rounded-full bg-success-bg px-3 py-[3px] text-[11px] font-semibold text-success">{p.badge}</span>}
        <span className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center bg-surface-inverse/55 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="rounded-full bg-brand-500 px-8 py-2.5 text-sm font-semibold text-white">Bekijk</span>
        </span>
      </div>
      <div className="flex flex-col gap-1 px-3.5 pb-3.5 pt-3">
        <span className="text-[15px] font-semibold leading-tight text-text-primary">{p.title}</span>
        <span className="text-sm text-text-secondary">Vanaf <span className="font-bold text-text-primary">€{p.fromPrice.toLocaleString('nl-NL')}</span>{p.toPrice && p.toPrice !== p.fromPrice ? ` – €${p.toPrice.toLocaleString('nl-NL')}` : ''}</span>
        <span className={cn('mt-0.5 flex items-center gap-1.5 text-xs', s.text)}><span className={cn('h-2 w-2 rounded-full', s.dot)} />{s.label}</span>
      </div>
    </div>
  );
}

export function SectionHeader({ title, titleAccent, subtitle, link, as: Tag = 'h2' }: { title: string; titleAccent?: string; subtitle?: string; link?: { href: string; label: string }; as?: 'h1' | 'h2' }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <Tag className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
          {title}{titleAccent ? <> <span className="italic text-brand-500">{titleAccent}</span></> : null}
        </Tag>
        {subtitle && <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>}
      </div>
      {link && <Link href={link.href} className="shrink-0 text-sm font-semibold text-brand-500 transition-colors hover:text-brand-600">{link.label} →</Link>}
    </div>
  );
}

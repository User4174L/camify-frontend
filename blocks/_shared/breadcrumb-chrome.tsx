import Link from 'next/link';
import { Container } from './section';

/**
 * Breadcrumb als PAGINA-CHROME (geen blok): staat op elke pagina behalve home,
 * boven het eerste blok, afgeleid uit slug/groep. V2 heeft dit al op
 * categoriepagina's (`BreadcrumbNav`); voorstel is dezelfde component ook op
 * landings- en tekstpagina's te renderen. Compacte banner laat er ruimte voor.
 */
export function BreadcrumbChrome({ items }: { items: Array<{ label: string; href?: string }> }) {
  return (
    <Container as="nav" className="pt-4 pb-2 text-[13px] text-text-muted" >
      <ol className="flex flex-wrap items-center gap-1.5">
        <li><Link href="/blocks" className="hover:text-text-primary">Home</Link></li>
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <span aria-hidden>/</span>
            {it.href ? <Link href={it.href} className="hover:text-text-primary">{it.label}</Link> : <span className="text-text-secondary">{it.label}</span>}
          </li>
        ))}
      </ol>
    </Container>
  );
}

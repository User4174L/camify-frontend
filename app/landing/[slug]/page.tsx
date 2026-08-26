import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BreadcrumbChrome } from '@/blocks/_shared/breadcrumb-chrome';
import { Container } from '@/blocks/_shared/section';
import { Markdown } from '@/blocks/_shared/markdown';
import { MOCK } from '@/blocks/_shared/mock-products';
import { BannerView } from '@/blocks/banner/slot-banner';
import { ProductGridView } from '@/blocks/product-grid/slot-product-grid.client';
import { LANDING_CONTENT } from '@/data/landing-content';

/**
 * Opzet landingspagina (#387/#534): één vast template, per pagina alleen
 * andere inhoud. Elk element komt 1-op-1 uit het content-werkbestand
 * (tab `paginas` + tab `faq`); de veldnaam staat als label bij elk blok.
 * Stramien: banner (compact, h1) → intro → productgrid met filterselectie
 * → SEO-tekst → FAQ.
 */

export function generateStaticParams() {
  return Object.keys(LANDING_CONTENT).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = LANDING_CONTENT[slug];
  if (!c) return {};
  return { title: c.seo_title, description: c.seo_description, robots: { index: false } };
}

function FieldTag({ name }: { name: string }) {
  return (
    <span className="pointer-events-none absolute -top-2.5 left-4 z-10 rounded bg-brand-600/90 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white">
      {name}
    </span>
  );
}

export default async function LandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = LANDING_CONTENT[slug];
  if (!c) notFound();

  const merk = c.banner_title_accent.split(' ')[0].toLowerCase();
  const products = (
    c.filter_machine.includes('product_type=camera')
      ? MOCK.filter((p) => p.category === 'cameras' && (!c.filter_machine.includes('brands=sony') || p.brand === 'Sony'))
      : MOCK.filter((p) => p.category === 'lenses')
  ).sort((a, b) => Number(b.brand?.toLowerCase() === merk) - Number(a.brand?.toLowerCase() === merk));
  const mockFilters = c.grid_filter_labels.map(() => ({ category: products[0]?.category }));

  return (
    <div className="v2 pb-16">
      <div className="border-b border-border-soft bg-surface-raised">
        <Container className="flex items-center justify-between py-2 text-xs text-text-muted">
          <span>
            Opzet landingspagina · inhoud = content-werkbestand ·{' '}
            <Link href="/landing" className="font-semibold text-brand-600 hover:underline">alle pagina&apos;s</Link>
          </span>
          <span className="hidden font-mono sm:inline">/nl-nl/{c.slug} · blok {c.blok}</span>
        </Container>
      </div>

      {/* pagina-chrome: breadcrumb afgeleid uit het filter */}
      <BreadcrumbChrome items={c.breadcrumb} />

      {/* banner_title_lead / banner_title_accent / banner_subtitle / banner_image / banner_cta_* */}
      <div className="relative">
        <FieldTag name="banner_*" />
        <BannerView
          data={{ layout: 'compact', heading_level: 'h1', show_icon: false, image_url: c.banner_image, overlay_style: 'gradient', text_theme: 'dark' }}
          content={{ title_lead: c.banner_title_lead, title_accent: c.banner_title_accent, subtitle: c.banner_subtitle, cta_label: c.banner_cta_label, cta_href: c.banner_cta_href }}
        />
      </div>

      {/* intro_boven_producten */}
      <Container className="relative mt-8 max-w-3xl">
        <FieldTag name="intro_boven_producten" />
        <Markdown source={c.intro_boven_producten} className="text-[15px] text-text-secondary" />
      </Container>

      {/* productgrid — selectie uit filter_machine (#534) */}
      <div id="producten" className="relative scroll-mt-20">
        <FieldTag name="filter_machine" />
        <ProductGridView
          data={{ count: 12, columns: 4, viewAllHref: '#', section: { background: 'raised', padding: 'md' } }}
          content={{ title: c.pagina.split(' ')[0], titleAccent: c.pagina.split(' ').slice(1).join(' '), subtitle: c.filter_omschrijving, viewAllLabel: 'Bekijk alles', filterLabels: c.grid_filter_labels }}
          products={products}
          mockFilters={mockFilters}
        />
        <Container className="pb-2 pt-1 text-xs text-text-muted">
          Selectie op V2: <code className="rounded bg-surface-muted px-1 py-0.5 font-mono text-[11px]">{c.filter_machine}</code>{' '}
          (listingblok #534 — hier mock-producten)
        </Container>
      </div>

      {/* seo_tekst_onder_producten */}
      <Container className="relative mt-10 max-w-3xl">
        <FieldTag name="seo_tekst_onder_producten" />
        <Markdown source={c.seo_tekst_onder_producten} className="text-[15px] text-text-secondary" />
      </Container>

      {/* faq (tab `faq`, gekoppeld op slug) — op V2 het bestaande FAQ-blok */}
      {c.faq.length > 0 && (
        <Container className="relative mt-12 max-w-3xl">
          <FieldTag name="faq" />
          <h2 className="mb-4 text-2xl font-bold tracking-tight">Veelgestelde vragen</h2>
          <div className="divide-y divide-border-soft rounded-xl border border-border-soft bg-surface-raised">
            {c.faq.map((f, i) => (
              <details key={i} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-text-primary [&::-webkit-details-marker]:hidden">
                  {f.vraag}
                  <span aria-hidden className="text-text-muted transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-[15px] leading-[1.7] text-text-secondary">{f.antwoord}</p>
              </details>
            ))}
          </div>
          <p className="mt-2 text-xs text-text-muted">Op V2 rendert dit via het bestaande FAQ-blok (niet in de bibliotheek).</p>
        </Container>
      )}
    </div>
  );
}

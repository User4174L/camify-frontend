import type { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbChrome } from '@/blocks/_shared/breadcrumb-chrome';
import { Container } from '@/blocks/_shared/section';
import { MOCK } from '@/blocks/_shared/mock-products';
import { BannerView } from '@/blocks/banner/slot-banner';
import { CtaBandView } from '@/blocks/cta-band/slot-cta-band';
import { MediaTextView } from '@/blocks/media-text/slot-media-text';
import { ProductGridView } from '@/blocks/product-grid/slot-product-grid.client';
import { ProductCarouselView } from '@/blocks/product-carousel/slot-product-carousel.client';

export const metadata: Metadata = { title: 'Voorbeeld landingspagina — alleen bibliotheek-blokken', robots: { index: false } };

/**
 * Voorbeeld: landingspagina "Canon RF-lenzen" opgebouwd uit uitsluitend
 * bibliotheek-blokken, in de volgorde die Bart als standaard noemde:
 * kop → intro → grid met filters → tekstblokken → CTA → (FAQ = bestaand V2-blok).
 * Blokvolgorde = layout-slot `main`; elk blok = één regel in de publish-body.
 */
export default function VoorbeeldPage() {
  const canon = MOCK.filter((p) => p.brand === 'Canon' || p.category === 'lenses');
  const mockFilters = [{ category: 'cameras' }, { category: 'lenses', brand: 'Canon' }, { category: 'lenses' }];
  return (
    <div className="v2 pb-16">
      <div className="border-b border-border-soft bg-surface-raised">
        <Container className="flex items-center justify-between py-2 text-xs text-text-muted">
          <span>Voorbeeldpagina · alleen bibliotheek-blokken · <Link href="/blocks" className="font-semibold text-brand-600 hover:underline">terug naar /blocks</Link></span>
          <span className="hidden sm:inline">volgorde: banner(compact) → media_text → product_grid → media_text ×2 → cta_band → product_rail(carousel) → cta_band(compact)</span>
        </Container>
      </div>

      {/* pagina-chrome */}
      <BreadcrumbChrome items={[{ label: 'Lenzen', href: '#' }, { label: 'Canon RF-lenzen' }]} />

      {/* 1. banner · layout compact · h1 */}
      <BannerView
        data={{ layout: 'compact', heading_level: 'h1', show_icon: false, image_url: '/images/hero-photographer-2.jpg', overlay_style: 'gradient', text_theme: 'dark' }}
        content={{ title_lead: 'Tweedehands Canon RF-lenzen,', title_accent: 'getest en met garantie', subtitle: 'Elke lens gecontroleerd op glas, AF en vatting. 12 maanden garantie, 14 dagen bedenktijd, gratis verzending vanaf €50.', cta_label: 'Verkoop je RF-lens', cta_href: '#' }}
      />

      {/* 2. intro · media_text zonder beeld zou een content-blok zijn; hier bewust met beeld */}
      <MediaTextView
        data={{ image_url: '/images/canon-rf-24-70mm-f28-l-is-usm.jpg', media_side: 'right', ratio: '3:2', media_style: 'card', section: { padding: 'md' } }}
        content={{ eyebrow: 'Canon RF', title: 'Het snelst groeiende lenzensysteem, nu ook betaalbaar tweedehands', body: 'RF-glas is nieuw duur en houdt zijn waarde goed — juist daarom is tweedehands interessant. Wij hebben doorlopend RF-lenzen van 16 mm tot 800 mm op voorraad, van de f/1.8-primes tot de L-serie. Elke lens is getest op een Canon R-body en heeft een eerlijke conditie-gradering.', cta_label: 'Zo bepalen wij de conditie', cta_href: '#' }}
      />

      {/* 3. product grid met filterknoppen (#429) */}
      <ProductGridView
        data={{ count: 12, columns: 4, viewAllHref: '#', section: { background: 'raised', padding: 'md' } }}
        content={{ title: 'Canon RF', titleAccent: 'op voorraad', subtitle: 'Getest, gegradeerd en met 12 maanden garantie.', viewAllLabel: 'Bekijk alle RF-lenzen', filterLabels: ["Camera's", 'RF-lenzen', 'Alle lenzen'] }}
        products={canon}
        mockFilters={mockFilters}
      />

      {/* 4. twee tekstblokken, wisselende kant */}
      <MediaTextView
        data={{ image_url: '/images/hero-photographer-1.jpg', media_side: 'left', ratio: '1:1', media_style: 'rounded', section: { padding: 'lg' } }}
        content={{ eyebrow: 'Zo testen wij', title: 'Elke RF-lens krijgt dezelfde 6-puntscontrole', body: 'Glas en coating onder fel licht, autofocus op een Canon R-body, beeldstabilisatie, diafragmalamellen, vatting en contacten, cosmetische staat.\n\n- Conditie waar je op kunt vertrouwen\n- Foto\'s van het echte exemplaar\n- 12 maanden garantie', cta_label: 'Lees over onze gradering', cta_href: '#' }}
      />
      <MediaTextView
        data={{ image_url: '/images/sony-fe-24-70mm-f28-gm.jpg', media_side: 'right', ratio: '2:3', media_style: 'card', section: { background: 'muted', padding: 'lg' } }}
        content={{ eyebrow: 'Welke RF-lens?', title: 'Van eerste prime tot L-serie: zo kies je', body: 'Begin je net met een R-body? Een RF 50mm f/1.8 of 35mm f/1.8 Macro is de goedkoopste stap naar mooi bokeh. Fotografeer je evenementen of portretten, dan is de RF 24-70mm f/2.8L of 70-200mm f/2.8L de werkpaard-keuze. Voor wildlife: 100-500mm L of de RF 800mm f/11.', cta_label: 'Alle RF-lenzen vergelijken', cta_href: '#' }}
      />

      {/* 5. CTA-band */}
      <CtaBandView
        data={{ variant: 'brand', align: 'left', section: { padding: 'md' } }}
        content={{ title: 'Heb je een Canon RF-lens die je niet meer gebruikt?', subtitle: 'Binnen 2 minuten een bod. Gratis verzending, binnen 2 werkdagen betaald.', primary_label: 'Vraag een bod aan', primary_href: '#', secondary_label: 'Zo werkt inruilen', secondary_href: '#' }}
      />

      {/* 6. carrousel: net binnen */}
      <ProductCarouselView
        data={{ source: 'newest', count: 12, display: 'carousel', visible: 5, viewAllHref: '#', section: { padding: 'md' } }}
        content={{ title: 'Net', titleAccent: 'binnen', subtitle: 'Deze week nieuw in de winkel', viewAllLabel: 'Bekijk alles' }}
        products={MOCK}
      />

      {/* 7. compacte CTA als afsluiter · daarna zou het bestaande FAQ-blok komen */}
      <CtaBandView data={{ variant: 'light', compact: true, section: { padding: 'sm' } }} content={{ title: 'Twijfel je welke RF-lens bij je past?', subtitle: 'We denken graag mee.', primary_label: 'Chat met ons', primary_href: '#' }} />
      <Container className="pt-6 text-center text-xs text-text-muted">↓ hier volgt op V2 het bestaande FAQ-blok (niet in de bibliotheek, bestaat al)</Container>
    </div>
  );
}

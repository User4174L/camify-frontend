import Link from 'next/link';
import type { Metadata } from 'next';
import { BLOCKS } from '@/blocks';
import { BreadcrumbChrome } from '@/blocks/_shared/breadcrumb-chrome';
import { Container } from '@/blocks/_shared/section';
import type { SlotField } from '@/blocks/_shared/registry-types';
import { BannerView } from '@/blocks/banner/slot-banner';
import bannerExample from '@/blocks/banner/example.json';
import { CtaBandView } from '@/blocks/cta-band/slot-cta-band';
import { SectionHeaderView } from '@/blocks/section-header/slot-section-header';
import sectionHeaderExample from '@/blocks/section-header/example.json';
import { SlotTilesLike } from '@/blocks/_shared/tiles-like';
import ctaExample from '@/blocks/cta-band/example.json';
import { MediaTextView } from '@/blocks/media-text/slot-media-text';
import mediaExample from '@/blocks/media-text/example.json';
import { ProductGridView } from '@/blocks/product-grid/slot-product-grid.client';
import gridExample from '@/blocks/product-grid/example.json';
import { ProductCarouselView } from '@/blocks/product-carousel/slot-product-carousel.client';
import railExample from '@/blocks/product-carousel/example.json';
import { MOCK } from '@/blocks/_shared/mock-products';
import type { BannerData } from '@/blocks/banner/types';
import type { CtaBandData } from '@/blocks/cta-band/types';
import type { MediaTextData } from '@/blocks/media-text/types';
import type { ProductGridData } from '@/blocks/product-grid/types';
import type { ProductRailData } from '@/blocks/product-carousel/types';

export const metadata: Metadata = { title: 'Blokkenbibliotheek — V2 bouwblokken', robots: { index: false } };

const IMG = '/images/hero-photographer-2.jpg';
const IMG2 = '/images/hero-photographer-1.jpg';
const IMG3 = '/images/canon-rf-24-70mm-f28-l-is-usm.jpg';

/* ---------- documentatie-hulpjes ---------- */

function FieldsTable({ fields }: { fields: SlotField[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border-soft">
      <table className="w-full text-left text-[13px]">
        <thead className="bg-surface-raised text-xs uppercase tracking-wide text-text-muted">
          <tr><th className="px-3 py-2 font-semibold">key</th><th className="px-3 py-2 font-semibold">label</th><th className="px-3 py-2 font-semibold">type</th><th className="px-3 py-2 font-semibold">where</th><th className="px-3 py-2 font-semibold">options / default</th><th className="px-3 py-2 font-semibold">help</th></tr>
        </thead>
        <tbody>
          {fields.map((f) => (
            <tr key={f.key} className="border-t border-border-soft align-top">
              <td className="whitespace-nowrap px-3 py-2 font-mono text-[12px] text-text-primary">{f.key}</td>
              <td className="px-3 py-2">{f.label}</td>
              <td className="px-3 py-2 font-mono text-[12px]">{f.type}{f.itemFields ? ` [${f.itemFields.map((i) => i.key).join(', ')}]` : ''}</td>
              <td className="whitespace-nowrap px-3 py-2">{f.translatable ? <span className="rounded bg-info-bg px-1.5 py-0.5 text-[11px] font-semibold text-info">content · per markt</span> : <span className="rounded bg-surface-muted px-1.5 py-0.5 text-[11px] font-semibold text-text-secondary">data</span>}</td>
              <td className="px-3 py-2 text-text-secondary">{f.options ? f.options.map((o) => o.value).join(' | ') : ''}{f.default !== undefined ? <span className="text-text-muted"> (default {String(f.default)})</span> : ''}{f.min !== undefined ? `${f.min}–${f.max}` : ''}</td>
              <td className="px-3 py-2 text-text-secondary">{f.help ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Doc({ id, children }: { id: string; children: React.ReactNode }) {
  const b = BLOCKS.find((x) => x.id === id)!;
  const r = b.registry;
  return (
    <article id={id} className="scroll-mt-24 border-t border-border-strong pt-10">
      <Container>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${b.status === 'nieuw' ? 'bg-success-bg text-success' : 'bg-info-bg text-info'}`}>{b.status === 'nieuw' ? 'nieuw type' : 'uitbreiding bestaand'}</span>
          <span className="font-mono text-xs text-text-muted">type: {r.type}</span>
          {b.ticket && <span className="font-mono text-xs text-text-muted">· {b.ticket}</span>}
          <span className="font-mono text-xs text-text-muted">· {b.folder}</span>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-text-primary">{r.label}</h2>
        <p className="mt-1 max-w-3xl text-[15px] text-text-secondary">{b.summary}</p>
        <p className="mt-2 text-xs text-text-muted">Picker-categorie: {r.category} · Toegestaan in: {r.allowedGroups.join(', ')} · Max per pagina: {r.maxPerPage ?? 'onbeperkt'}</p>
      </Container>
      <div className="my-6">{children}</div>
      <Container>
        <details className="group mb-3 rounded-xl border border-border-soft bg-surface-raised">
          <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold text-text-primary">Velden (registry-schema → editor)</summary>
          <div className="px-4 pb-4"><FieldsTable fields={r.fields} /></div>
        </details>
      </Container>
    </article>
  );
}

function Example({ json }: { json: unknown }) {
  return (
    <Container>
      <details className="rounded-xl border border-border-soft bg-surface-raised">
        <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold text-text-primary">Voorbeeld-spec (landing-CLI / publish-API)</summary>
        <pre className="overflow-x-auto px-4 pb-4 text-[12px] leading-relaxed text-text-secondary">{JSON.stringify(json, null, 2)}</pre>
      </details>
    </Container>
  );
}

const nl = <T,>(ex: { content: Record<string, T> }) => ex.content['nl-nl'];

/* ---------- pagina ---------- */

export default function BlocksPage() {
  const banner = bannerExample as unknown as { data: BannerData; content: Record<string, Record<string, string>> };
  const cta = ctaExample as unknown as { data: CtaBandData; content: Record<string, Record<string, string>> };
  const media = mediaExample as unknown as { data: MediaTextData; content: Record<string, Record<string, string>> };
  const grid = gridExample as unknown as { data: ProductGridData; content: Record<string, { title: string; titleAccent: string; subtitle: string; viewAllLabel: string; filterLabels: string[] }> };
  const rail = railExample as unknown as { data: ProductRailData; content: Record<string, Record<string, string>> };
  const canon = MOCK.filter((p) => p.brand === 'Canon' || p.category === 'lenses');
  const mockFilters = [{ category: 'cameras' }, { category: 'lenses', brand: 'Canon' }, { category: 'lenses' }];

  return (
    <div className="v2 pb-24">
      <BreadcrumbChrome items={[{ label: 'Blokkenbibliotheek' }]} />
      <Container className="pt-4 pb-10">
        <p className="text-xs font-bold uppercase tracking-[.08em] text-brand-500">Referentie voor V2 · niet-indexeerbaar</p>
        <h1 className="mt-2 text-[clamp(28px,4vw,40px)] font-extrabold tracking-tight text-text-primary">Blokkenbibliotheek</h1>
        <p className="mt-3 max-w-3xl text-[15px] leading-[1.7] text-text-secondary">
          Bouwblokken voor tekst- en landingspagina&apos;s, geschreven in V2-dialect (zelfde tokens.css, Container, registry-schema). Alleen wat <strong>nieuw</strong> is of een <strong>uitbreiding</strong> van een bestaand blok staat hier; blokken die V2 al heeft (tiles, steps, statistics, trust bar, FAQ, …) niet. Zie <Link href="/blocks/voorbeeld" className="font-semibold text-brand-600 hover:underline">/blocks/voorbeeld</Link> voor een complete landingspagina die alleen uit deze blokken bestaat.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BLOCKS.map((b) => (
            <a key={b.id} href={`#${b.id}`} className="rounded-xl border border-border-soft bg-surface-raised px-4 py-3 transition hover:border-brand-400 hover:shadow-soft">
              <span className="block text-sm font-bold text-text-primary">{b.registry.label}</span>
              <span className="block text-xs text-text-muted">{b.status === 'nieuw' ? 'nieuw type' : 'uitbreiding'} · {b.registry.type}</span>
            </a>
          ))}
        </div>
        <div className="mt-8 grid gap-6 rounded-2xl border border-border-soft bg-surface-raised p-6 md:grid-cols-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-text-muted">Per blok leveren wij</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-text-secondary">
              <li><span className="font-mono text-[12px]">slot-&lt;naam&gt;.tsx</span> — renderer in V2-dialect</li>
              <li><span className="font-mono text-[12px]">registry.ts</span> — label, categorie, groepen, <em>fields</em>-schema (→ editor)</li>
              <li><span className="font-mono text-[12px]">types.ts</span> — content/data-shape</li>
              <li><span className="font-mono text-[12px]">example.json</span> — spec voor landing-CLI / publish-API</li>
              <li><span className="font-mono text-[12px]">README.md</span> — doel, keuzes, wat Mike doet</li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-text-muted">Stempel-checklist Mike (per nieuw blok identiek)</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-text-secondary">
              <li>backend: <span className="font-mono text-[12px]">ComponentType</span>-entry + migratie · allow-list in <span className="font-mono text-[12px]">page_groups.py</span> · optioneel serializer in <span className="font-mono text-[12px]">component_schemas.py</span></li>
              <li>frontend: type-union + content-type in <span className="font-mono text-[12px]">types/storefront-component.ts</span></li>
              <li>registry-regel overnemen (<span className="font-mono text-[12px]">component-type-registry.tsx</span>) → editor bestaat</li>
              <li>onze <span className="font-mono text-[12px]">&lt;Naam&gt;View</span> = de pure View; <span className="font-mono text-[12px]">Slot&lt;Naam&gt;</span>-wrapper is de stamp uit <span className="font-mono text-[12px]">slot-tiles.tsx</span></li>
              <li>extractor in <span className="font-mono text-[12px]">storefront-utils.ts</span></li>
              <li>handler in <span className="font-mono text-[12px]">freeform-slot.client.tsx</span> + toevoegen aan <span className="font-mono text-[12px]">contentBlockHandlers()</span> (geen registratie per pagina nodig)</li>
              <li>voorbeeldcontent + preview in <span className="font-mono text-[12px]">preset-preview-registry.tsx</span></li>
              <li>tests · uitbreidingen (banner, rail): alleen data-velden + renderer-branch, geen enum/migratie</li>
            </ol>
            <p className="mt-3 text-sm text-text-secondary">Alle snippets per bestand staan uitgeschreven in <a href="https://github.com/User4174L/camify-frontend/blob/main/camify-next/blocks/HANDOVER.md" className="font-semibold text-brand-600 hover:underline">blocks/HANDOVER.md</a> (cta_band volledig uitgewerkt, de rest is dezelfde stamp).</p>
          </div>
        </div>
        <div className="mt-6 rounded-2xl border border-border-soft p-6 text-sm text-text-secondary">
          <h2 className="text-sm font-bold uppercase tracking-wide text-text-muted">Spelregels</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Alleen schema-blokken: geen eigen editors, alleen <em>fields</em>.</li>
            <li>Velden alleen toevoegen, nooit hernoemen (bestaande content mag niet breken).</li>
            <li>Eerst preset of veld op een bestaand blok; pas een nieuw blok als de layout écht anders is.</li>
            <li>Elk blok kiest zelf zijn kopniveau (h1 / h2 / geen) — nooit een verplichte h1.</li>
            <li>Breadcrumb is pagina-chrome (boven het eerste blok, elke pagina behalve home), geen blok.</li>
          </ul>
        </div>
      </Container>

      {/* ---------------- Banner compact ---------------- */}
      <Doc id="banner">
        <p className="mx-auto mb-3 max-w-7xl px-4 text-xs font-semibold uppercase tracking-wide text-text-muted sm:px-6 lg:px-8">Compact · h1 · gradient · tekst links (met breadcrumb-chrome erboven)</p>
        <BreadcrumbChrome items={[{ label: 'Lenzen', href: '#' }, { label: 'Canon RF' }]} />
        <BannerView data={{ ...banner.data, image_url: IMG }} content={nl(banner)} />
        <p className="mx-auto mb-3 mt-8 max-w-7xl px-4 text-xs font-semibold uppercase tracking-wide text-text-muted sm:px-6 lg:px-8">Compact · h2 · scrim · gecentreerd · Trustpilot aan</p>
        <BannerView data={{ ...banner.data, image_url: IMG2, overlay_style: 'scrim', text_theme: 'light', text_align: 'center', heading_level: 'h2', show_trustpilot: true }} content={{ ...nl(banner), cta_label: '' }} />
        <p className="mx-auto mb-3 mt-8 max-w-7xl px-4 text-xs font-semibold uppercase tracking-wide text-text-muted sm:px-6 lg:px-8">Compact · geen afbeelding · h1 · zonder knop (kale tekstpagina-kop)</p>
        <BannerView data={{ layout: 'compact', heading_level: 'h1', show_icon: false }} content={{ title_lead: 'Kwaliteit &', title_accent: 'gradering', subtitle: 'Hoe wij de conditie van elke camera en lens bepalen, testen en communiceren.' }} />
        <div className="mt-6"><Example json={bannerExample} /></div>
      </Doc>

      {/* ---------------- Section-wrapper ---------------- */}
      <Doc id="section">
        <CtaBandView data={{ variant: 'light', compact: true, section: { background: 'none', padding: 'sm' } }} content={{ title: 'section.background = none', subtitle: 'zelfde blok, andere schil →' }} />
        <CtaBandView data={{ variant: 'light', compact: true, section: { background: 'muted', padding: 'sm' } }} content={{ title: 'section.background = muted · width = full', subtitle: 'achtergrond volle breedte, inhoud in container' }} />
        <CtaBandView data={{ variant: 'light', compact: true, section: { background: 'brand', width: 'container', padding: 'sm' } }} content={{ title: 'section.background = brand · width = container', subtitle: 'alles binnen de container als afgeronde kaart' }} />
        <CtaBandView data={{ variant: 'inverse', compact: true, section: { background: 'inverse', padding: 'md' } }} content={{ title: 'section.background = inverse · padding = md', subtitle: 'donker vlak, meer ruimte' }} />
      </Doc>

      {/* ---------------- Section header ---------------- */}
      <Doc id="section-header">
        <SectionHeaderView data={{ heading_level: 'h2' }} content={{ title: 'Net', titleAccent: 'binnen', subtitle: 'Vers binnengekomen deze week', linkLabel: 'Bekijk alles', linkHref: '#' }} />
        <SlotTilesLike />
        <SectionHeaderView data={{ heading_level: 'h2', align: 'center', section: { background: 'muted', padding: 'md' } }} content={{ title: 'Waarom', titleAccent: 'Camify', subtitle: 'Vier redenen om tweedehands bij ons te kopen' }} />
        <div className="mt-2"><Example json={sectionHeaderExample} /></div>
      </Doc>

      {/* ---------------- CTA-band ---------------- */}
      <Doc id="cta-band">
        <CtaBandView data={cta.data} content={nl(cta)} />
        <CtaBandView data={{ variant: 'inverse', align: 'center' }} content={{ title: 'Kom langs in de showroom in Rotterdam', subtitle: 'Bekijk en test voordat je koopt. Ma–za 10:00–17:30.', primary_label: 'Route & openingstijden', primary_href: '#' }} />
        <CtaBandView data={{ variant: 'light', compact: true }} content={{ title: 'Twijfel je welke RF-lens bij je past?', primary_label: 'Chat met ons', primary_href: '#' }} />
        <div className="mt-2"><Example json={ctaExample} /></div>
      </Doc>

      {/* ---------------- Beeld + tekst ---------------- */}
      <Doc id="media-text">
        <MediaTextView data={{ ...media.data, image_url: IMG2 }} content={nl(media)} />
        <MediaTextView data={{ image_url: IMG3, media_side: 'right', ratio: '2:3', media_style: 'card', section: { background: 'raised', padding: 'md' } }} content={{ eyebrow: 'Inruilen', title: 'Van oude lens naar nieuwe lens in één stap', body: 'Ruil je huidige glas in en betaal alleen het verschil. Wij regelen de verzending, jij krijgt binnen 2 werkdagen een bod.\n\n- Gratis verzendlabel\n- Betaling binnen 2 werkdagen\n- Ook zonder aankoop', cta_label: 'Zo werkt inruilen', cta_href: '#' }} />
        <MediaTextView data={{ image_url: IMG, media_side: 'left', ratio: '3:2', media_style: 'plain', align: 'top', section: { background: 'inverse', padding: 'lg' } }} content={{ eyebrow: 'Garantie', title: '12 maanden garantie op alles wat we verkopen', body: 'Gaat er binnen een jaar iets kapot? Dan repareren, vervangen of vergoeden wij. Zonder kleine lettertjes.', cta_label: 'Garantievoorwaarden', cta_href: '#' }} />
        <div className="mt-2"><Example json={mediaExample} /></div>
      </Doc>

      {/* ---------------- Product grid ---------------- */}
      <Doc id="product-grid">
        <ProductGridView data={grid.data} content={nl(grid)} products={canon} mockFilters={mockFilters} />
        <div className="mt-2"><Example json={gridExample} /></div>
      </Doc>

      {/* ---------------- Product carousel ---------------- */}
      <Doc id="product-carousel">
        <ProductCarouselView data={rail.data} content={nl(rail)} products={MOCK} />
        <div className="mt-2"><Example json={railExample} /></div>
      </Doc>
    </div>
  );
}

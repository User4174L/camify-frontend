/**
 * Blokkenbibliotheek — bouwblokken voor de V2-storefront, geschreven in
 * V2-dialect (tokens, Container, registry-schema) zodat Mike ze 1-op-1 kan
 * overnemen. Per blok één map met: renderer, registry-regel (fields-schema →
 * de editor), types, example.json (landing-CLI-spec) en README.
 *
 * Wat WIJ leveren: renderer + registry + types + voorbeeld + README.
 * Wat MIKE stempelt: ComponentType-entry + allow-list (page_groups.py),
 * extractor (storefront-utils.ts), freeform-handler + registratie op de
 * pagina-slots, tests. Zie /blocks voor de checklist per blok.
 */
import { bannerRegistry } from './banner/registry';
import { ctaBandRegistry } from './cta-band/registry';
import { mediaTextRegistry } from './media-text/registry';
import { productGridRegistry } from './product-grid/registry';
import { productRailRegistry } from './product-carousel/registry';
import type { RegistryEntry } from './_shared/registry-types';

export type BlockMeta = {
  id: string;
  registry: RegistryEntry;
  status: 'uitbreiding' | 'nieuw' | 'chrome';
  summary: string;
  ticket?: string;
  folder: string;
};

export const BLOCKS: BlockMeta[] = [
  { id: 'banner', registry: bannerRegistry, status: 'uitbreiding', summary: 'Bestaande banner krijgt layout hero|compact, kopniveau, icoon aan/uit en tekstuitlijning. Compact = paginakop voor tekst- en landingspagina\'s.', ticket: '#522 (+ #430)', folder: 'blocks/banner' },
  { id: 'section', registry: { type: '(alle blokken)', label: 'Sectie-instellingen', category: 'content', maxPerPage: null, allowedGroups: ['landing', 'information', 'catalog', 'detail', 'brand'], defaultContent: {}, defaultData: {}, fields: bannerRegistry.fields.filter((f) => f.key.startsWith('section.')) }, status: 'uitbreiding', summary: 'Eén generieke schil om elk blok: achtergrond, breedte, ruimte boven/onder, anker. Eén keer bouwen om de freeform-renderer heen; daarna heeft ieder blok dezelfde vier knoppen.', folder: 'blocks/_shared/section.tsx' },
  { id: 'cta-band', registry: ctaBandRegistry, status: 'nieuw', summary: 'Eén oproep + 1–2 knoppen. Drie varianten, smalle of normale band. Presets voor terugkerende oproepen.', folder: 'blocks/cta-band' },
  { id: 'media-text', registry: mediaTextRegistry, status: 'nieuw', summary: 'Beeld naast tekst; links/rechts, verhouding, beeldstijl, markdown-tekst en een link. Wisselend stapelen = lange-pagina-ritme.', folder: 'blocks/media-text' },
  { id: 'product-grid', registry: productGridRegistry, status: 'nieuw', summary: 'Grid uit meerdere categorieën met filterknoppen (categorieën-multi óf product_type). Uiterlijk + schema hier; data-koppeling via bestaande listing-endpoint.', ticket: '#429', folder: 'blocks/product-grid' },
  { id: 'product-carousel', registry: productRailRegistry, status: 'uitbreiding', summary: 'Bestaande product_rail krijgt display grid|carousel. Zelfde kaart, kop en bron.', folder: 'blocks/product-carousel' },
];

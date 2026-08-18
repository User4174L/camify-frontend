import type { RegistryEntry } from '../_shared/registry-types';
import { SECTION_FIELDS } from '../_shared/registry-types';

/**
 * Registry-regel voor de UITBREIDING van het bestaande `banner`-type.
 * Alleen de nieuwe velden staan hier; de bestaande banner-velden
 * (afbeelding, overlay, thema, Trustpilot, copy) blijven zoals ze zijn.
 */
export const bannerRegistry: RegistryEntry = {
  type: 'banner',
  extends: 'banner',
  label: 'Banner',
  category: 'banners',
  maxPerPage: 20,
  allowedGroups: ['landing', 'information', 'catalog', 'detail', 'brand'],
  defaultContent: {},
  defaultData: { layout: 'hero', heading_level: 'h1', show_icon: true, text_align: 'left' },
  fields: [
    {
      key: 'layout',
      label: 'Layout',
      type: 'select',
      default: 'hero',
      options: [
        { value: 'hero', label: 'Hero (homepage, 400 px)' },
        { value: 'compact', label: 'Compact (paginakop, ~220 px)' },
      ],
      help: 'Compact = lage band, tekst links, geen icoon, geen h1-dwang. Bedoeld voor tekst- en landingspagina\'s.',
    },
    {
      key: 'heading_level',
      label: 'Kopniveau',
      type: 'select',
      default: 'h1',
      options: [
        { value: 'h1', label: 'h1 (pagina-titel)' },
        { value: 'h2', label: 'h2' },
        { value: 'none', label: 'Geen kop-tag (visueel gelijk)' },
      ],
      help: 'Op een pagina die al een h1 heeft (of de sr-only h1) → h2 of geen. Voorkomt dubbele h1 (#520).',
    },
    { key: 'show_icon', label: 'Icoon boven titel', type: 'boolean', default: true },
    {
      key: 'text_align',
      label: 'Tekstuitlijning',
      type: 'select',
      default: 'left',
      options: [
        { value: 'left', label: 'Links' },
        { value: 'center', label: 'Gecentreerd' },
      ],
    },
    ...SECTION_FIELDS,
  ],
};

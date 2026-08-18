import type { RegistryEntry } from '../_shared/registry-types';
import { SECTION_FIELDS } from '../_shared/registry-types';

/** Product Grid — het open ticket #429; hier het uiterlijk + schema, de data-koppeling (listing-endpoint) is Mike's. */
export const productGridRegistry: RegistryEntry = {
  type: 'product_grid',
  label: 'Product grid',
  category: 'products',
  maxPerPage: null,
  allowedGroups: ['landing', 'brand', 'information'],
  defaultContent: { title: '', titleAccent: '', subtitle: '', viewAllLabel: 'Bekijk alles' },
  defaultData: { count: 16, columns: 4, categories: [], brands: [], filters: [] },
  fields: [
    { key: 'title', label: 'Titel', type: 'text', translatable: true, perMarket: true },
    { key: 'titleAccent', label: 'Titel-accent (oranje woord)', type: 'text', translatable: true, perMarket: true },
    { key: 'subtitle', label: 'Subregel', type: 'text', translatable: true, perMarket: true },
    { key: 'categories', label: 'Bron: categorieën (multi)', type: 'category-badge-list', help: 'Fase 1. Alle producten uit deze categorieën samen. Fase 2: spec-filter (bv. sensor = full frame).' },
    { key: 'brands', label: 'Bron: merken (optioneel)', type: 'brand-badge-list', help: 'Beperkt de bron tot deze merken (listing-endpoint kan brands= al).' },
    { key: 'count', label: 'Aantal producten', type: 'range', min: 4, max: 48, step: 4, default: 16 },
    { key: 'columns', label: 'Kolommen', type: 'select', default: '4', numeric: true, options: [{ value: '3', label: '3' }, { value: '4', label: '4' }] },
    {
      key: 'filters', label: 'Filterknoppen', type: 'repeater', addLabel: 'Knop toevoegen',
      itemFields: [
        { key: 'label', label: 'Label', perMarket: true },
        { key: 'categories', label: 'Categorieën', type: 'category-badge-list' },
        { key: 'product_type', label: 'óf product-type', type: 'text', placeholder: 'bv. Lens' },
      ],
      help: 'Eerste knop = "Alles" (automatisch). Per knop: categorieën (multi) óf een product_type binnen de grid-scope.',
    },
    { key: 'viewAllHref', label: '"Bekijk alles"-link', type: 'url' },
    { key: 'viewAllLabel', label: '"Bekijk alles"-label', type: 'text', translatable: true, perMarket: true },
    { key: 'heading_level', label: 'Kopniveau', type: 'select', default: 'h2', options: [{ value: 'h1', label: 'h1' }, { value: 'h2', label: 'h2' }] },
    ...SECTION_FIELDS,
  ],
};

import type { RegistryEntry } from '../_shared/registry-types';
import { SECTION_FIELDS } from '../_shared/registry-types';

export const ctaBandRegistry: RegistryEntry = {
  type: 'cta_band',
  label: 'CTA-band',
  category: 'marketing',
  maxPerPage: null,
  allowedGroups: ['landing', 'information', 'catalog', 'detail', 'brand'],
  defaultContent: { title: '', subtitle: '', primary_label: '', primary_href: '', secondary_label: '', secondary_href: '' },
  defaultData: { variant: 'brand', align: 'left', compact: false },
  fields: [
    { key: 'title', label: 'Titel', type: 'text', translatable: true, perMarket: true },
    { key: 'subtitle', label: 'Subregel', type: 'text', translatable: true, perMarket: true },
    { key: 'primary_label', label: 'Knop 1 — label', type: 'text', translatable: true, perMarket: true },
    { key: 'primary_href', label: 'Knop 1 — link', type: 'url', translatable: true, perMarket: true, help: 'Per markt, zodat NL naar /verkopen en DE naar /verkaufen kan.' },
    { key: 'secondary_label', label: 'Knop 2 — label (optioneel)', type: 'text', translatable: true, perMarket: true },
    { key: 'secondary_href', label: 'Knop 2 — link', type: 'url', translatable: true, perMarket: true },
    {
      key: 'variant', label: 'Variant', type: 'select', default: 'brand',
      options: [
        { value: 'brand', label: 'Oranje' },
        { value: 'inverse', label: 'Donker' },
        { value: 'light', label: 'Licht met rand' },
      ],
    },
    { key: 'align', label: 'Uitlijning', type: 'select', default: 'left', options: [{ value: 'left', label: 'Links (tekst links, knoppen rechts)' }, { value: 'center', label: 'Gecentreerd' }] },
    { key: 'compact', label: 'Smalle band', type: 'boolean', default: false, help: 'Eén regel hoog; voor tussen twee tekstblokken.' },
    ...SECTION_FIELDS,
  ],
};

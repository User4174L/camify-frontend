import type { RegistryEntry } from '../_shared/registry-types';
import { SECTION_FIELDS } from '../_shared/registry-types';

export const ctaBandRegistry: RegistryEntry = {
  type: 'cta_band',
  label: 'CTA band',
  category: 'marketing',
  maxPerPage: null,
  allowedGroups: ['landing', 'information', 'catalog', 'detail', 'brand'],
  defaultContent: { title: '', subtitle: '', primary_label: '', primary_href: '', secondary_label: '', secondary_href: '' },
  defaultData: { variant: 'brand', align: 'left', compact: false },
  fields: [
    { key: 'title', label: 'Title', type: 'text', translatable: true, perMarket: true },
    { key: 'subtitle', label: 'Subtitle', type: 'text', translatable: true, perMarket: true },
    { key: 'primary_label', label: 'Button 1 — label', type: 'text', translatable: true, perMarket: true },
    { key: 'primary_href', label: 'Button 1 — link', type: 'url', translatable: true, perMarket: true, help: 'Per market, so NL can point to /verkopen and DE to /verkaufen.' },
    { key: 'secondary_label', label: 'Button 2 — label (optional)', type: 'text', translatable: true, perMarket: true },
    { key: 'secondary_href', label: 'Button 2 — link', type: 'url', translatable: true, perMarket: true },
    {
      key: 'variant', label: 'Variant', type: 'select', default: 'brand',
      options: [
        { value: 'brand', label: 'Brand (orange)' },
        { value: 'inverse', label: 'Dark' },
        { value: 'light', label: 'Light with border' },
      ],
    },
    { key: 'align', label: 'Alignment', type: 'select', default: 'left', options: [{ value: 'left', label: 'Left (text left, buttons right)' }, { value: 'center', label: 'Centered' }] },
    { key: 'compact', label: 'Compact band', type: 'boolean', default: false, help: 'One line high; for in between two text blocks.' },
    ...SECTION_FIELDS,
  ],
};

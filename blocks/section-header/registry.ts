import type { RegistryEntry } from '../_shared/registry-types';
import { SECTION_FIELDS } from '../_shared/registry-types';

export const sectionHeaderRegistry: RegistryEntry = {
  type: 'section_header',
  label: 'Section header',
  category: 'content',
  maxPerPage: null,
  allowedGroups: ['landing', 'information', 'catalog', 'detail', 'brand'],
  defaultContent: { title: '', titleAccent: '', subtitle: '', linkLabel: '', linkHref: '' },
  defaultData: { heading_level: 'h2', align: 'left' },
  fields: [
    { key: 'title', label: 'Title', type: 'text', translatable: true, perMarket: true },
    { key: 'titleAccent', label: 'Title accent (brand-coloured, italic)', type: 'text', translatable: true, perMarket: true, help: 'The "binnen" in "Net binnen". Optional.' },
    { key: 'subtitle', label: 'Subtitle', type: 'text', translatable: true, perMarket: true },
    { key: 'linkLabel', label: 'Link — label', type: 'text', translatable: true, perMarket: true, help: 'e.g. "View all". Leave empty for no link.' },
    { key: 'linkHref', label: 'Link — href', type: 'url', translatable: true, perMarket: true },
    { key: 'heading_level', label: 'Heading level', type: 'select', default: 'h2', options: [{ value: 'h1', label: 'h1' }, { value: 'h2', label: 'h2' }, { value: 'h3', label: 'h3' }] },
    { key: 'align', label: 'Alignment', type: 'select', default: 'left', options: [{ value: 'left', label: 'Left (link right)' }, { value: 'center', label: 'Centered' }] },
    ...SECTION_FIELDS,
  ],
};

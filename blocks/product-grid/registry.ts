import type { RegistryEntry } from '../_shared/registry-types';
import { SECTION_FIELDS } from '../_shared/registry-types';

/** Product Grid — open ticket #429; look + schema here, the data coupling (listing endpoint) is Mike's. */
export const productGridRegistry: RegistryEntry = {
  type: 'product_grid',
  label: 'Product grid',
  category: 'products',
  maxPerPage: null,
  allowedGroups: ['landing', 'brand', 'information'],
  defaultContent: { title: '', titleAccent: '', subtitle: '', viewAllLabel: 'View all', filterLabels: [] },
  defaultData: { count: 16, columns: 4, categories: [], brands: [], filters: [] },
  fields: [
    { key: 'title', label: 'Title', type: 'text', translatable: true, perMarket: true },
    { key: 'titleAccent', label: 'Title accent (brand-coloured word)', type: 'text', translatable: true, perMarket: true },
    { key: 'subtitle', label: 'Subtitle', type: 'text', translatable: true, perMarket: true },
    { key: 'categories', label: 'Source: categories (multi)', type: 'category-badge-list', help: 'Phase 1. All products from these categories together. Phase 2: spec filter (e.g. sensor = full frame).' },
    { key: 'brands', label: 'Source: brands (optional)', type: 'brand-badge-list', help: 'Limits the source to these brands (listing endpoint already supports brands=).' },
    { key: 'count', label: 'Number of products', type: 'range', min: 4, max: 24, step: 4, default: 16, help: 'Max 24 = one category listing page (PAGE_SIZE). Never bigger than a category page.' },
    { key: 'columns', label: 'Columns', type: 'select', default: '4', numeric: true, options: [{ value: '3', label: '3' }, { value: '4', label: '4' }] },
    {
      key: 'filters', label: 'Filter buttons', type: 'repeater', addLabel: 'Add button',
      itemFields: [
        { key: 'label', label: 'Label', perMarket: true },
        { key: 'categories', label: 'Categories', type: 'category-badge-list' },
        { key: 'product_type', label: 'or product type', type: 'text', placeholder: 'e.g. Lens' },
      ],
      help: 'First button "All" is automatic. Per button: categories (multi) OR a product_type within the grid scope (#429).',
    },
    { key: 'viewAllHref', label: '"View all" link', type: 'url' },
    { key: 'viewAllLabel', label: '"View all" label', type: 'text', translatable: true, perMarket: true },
    { key: 'heading_level', label: 'Heading level', type: 'select', default: 'h2', options: [{ value: 'h1', label: 'h1' }, { value: 'h2', label: 'h2' }] },
    ...SECTION_FIELDS,
  ],
};

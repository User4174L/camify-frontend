import type { RegistryEntry } from '../_shared/registry-types';
import { SECTION_FIELDS } from '../_shared/registry-types';

export const productRailRegistry: RegistryEntry = {
  type: 'product_rail',
  extends: 'product_rail',
  label: 'Product rail',
  category: 'products',
  maxPerPage: null,
  allowedGroups: ['landing', 'catalog', 'detail', 'brand'],
  defaultContent: {},
  defaultData: { display: 'grid', visible: 5 },
  fields: [
    { key: 'source', label: 'Source', type: 'select', default: 'newest', options: [{ value: 'newest', label: 'Newest (V2)' }, { value: 'relevance', label: 'Relevance / bestsellers (V2)' }, { value: 'outlet', label: 'Outlet / on sale — NEW: variants with is_outlet_product' }], help: 'outlet = new source; enables a "Now on sale" rail preset.' },
    { key: 'display', label: 'Display', type: 'select', default: 'carousel', options: [{ value: 'carousel', label: 'Carousel (swipe on mobile, arrows on desktop) — proposed default' }, { value: 'grid', label: 'Grid (current V2: 5→4→3→2 columns, RAIL_SIZE 5, not swipeable)' }], help: 'Today\'s grid shows 5 cards in 2 columns on mobile (3 rows with a hole) and cannot be swiped. Carousel fixes that.' },
    { key: 'visible', label: 'Cards side by side (carousel)', type: 'select', default: '5', numeric: true, options: [{ value: '4', label: '4' }, { value: '5', label: '5' }, { value: '6', label: '6' }] },
    ...SECTION_FIELDS,
  ],
};

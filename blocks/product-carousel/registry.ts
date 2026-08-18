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
    { key: 'display', label: 'Display', type: 'select', default: 'grid', options: [{ value: 'grid', label: 'Grid (current)' }, { value: 'carousel', label: 'Carousel (horizontal scroll, arrows)' }] },
    { key: 'visible', label: 'Cards side by side (carousel)', type: 'select', default: '5', numeric: true, options: [{ value: '4', label: '4' }, { value: '5', label: '5' }, { value: '6', label: '6' }] },
    ...SECTION_FIELDS,
  ],
};

import type { RegistryEntry } from '../_shared/registry-types';
import { SECTION_FIELDS } from '../_shared/registry-types';

/** Link tiles — photo cards linking to categories / landing pages / articles (the "collection list" of Shopify, the category tiles of MPB/KE). */
export const linkTilesRegistry: RegistryEntry = {
  type: 'link_tiles',
  label: 'Link tiles (photo)',
  category: 'products',
  maxPerPage: null,
  allowedGroups: ['landing', 'information', 'catalog', 'brand'],
  defaultContent: { items: [] },
  defaultData: { columns: 3, style: 'photo', ratio: '4:3', items: [] },
  fields: [
    {
      key: 'items', label: 'Tiles', type: 'repeater', addLabel: 'Add tile',
      itemFields: [
        { key: 'title', label: 'Title', perMarket: true },
        { key: 'subtitle', label: 'Subtitle', perMarket: true },
        { key: 'badge', label: 'Badge (optional)', perMarket: true, placeholder: 'e.g. New' },
        { key: 'href', label: 'Link', type: 'url', perMarket: true },
        { key: 'image_url', label: 'Image', type: 'text', placeholder: 'upload → /static/…webp' },
      ],
      help: 'Link per market (localized slugs); image is language-independent. Category tiles: pick a category via the internal linker.',
    },
    { key: 'columns', label: 'Columns', type: 'select', default: '3', numeric: true, options: [{ value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }] },
    { key: 'style', label: 'Style', type: 'select', default: 'photo', options: [{ value: 'photo', label: 'Photo with text below' }, { value: 'overlay', label: 'Text on the photo (dark gradient)' }] },
    { key: 'ratio', label: 'Image ratio', type: 'select', default: '4:3', options: [{ value: '4:3', label: '4 : 3' }, { value: '1:1', label: '1 : 1' }, { value: '16:9', label: '16 : 9' }] },
    ...SECTION_FIELDS,
  ],
};

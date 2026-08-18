import type { RegistryEntry } from '../_shared/registry-types';
import { SECTION_FIELDS } from '../_shared/registry-types';

export const mediaTextRegistry: RegistryEntry = {
  type: 'media_text',
  label: 'Media + text',
  category: 'content',
  maxPerPage: null,
  allowedGroups: ['landing', 'information', 'catalog', 'detail', 'brand'],
  defaultContent: { eyebrow: '', title: '', body: '', cta_label: '', cta_href: '', image_alt: '' },
  defaultData: { media_side: 'left', ratio: '1:1', media_style: 'rounded', heading_level: 'h2', align: 'center' },
  fields: [
    { key: 'image_url', label: 'Image', type: 'image', help: 'Same upload/WebP flow as the banner.' },
    { key: 'image_alt', label: 'Alt text', type: 'text', translatable: true, perMarket: true },
    { key: 'eyebrow', label: 'Eyebrow (small, brand colour)', type: 'text', translatable: true, perMarket: true },
    { key: 'title', label: 'Title', type: 'text', translatable: true, perMarket: true },
    { key: 'body', label: 'Body', type: 'markdown', translatable: true, perMarket: true },
    { key: 'cta_label', label: 'Link — label', type: 'text', translatable: true, perMarket: true },
    { key: 'cta_href', label: 'Link — href', type: 'url', translatable: true, perMarket: true },
    { key: 'media_side', label: 'Media side', type: 'select', default: 'left', options: [{ value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }], help: 'Stack several with alternating sides = the classic long-page rhythm.' },
    { key: 'ratio', label: 'Ratio media : text', type: 'select', default: '1:1', options: [{ value: '1:1', label: '1 : 1' }, { value: '2:3', label: '2 : 3 (narrow media)' }, { value: '3:2', label: '3 : 2 (wide media)' }] },
    { key: 'media_style', label: 'Media style', type: 'select', default: 'rounded', options: [{ value: 'rounded', label: 'Rounded' }, { value: 'card', label: 'Card with border and shadow' }, { value: 'plain', label: 'Plain' }] },
    { key: 'heading_level', label: 'Heading level', type: 'select', default: 'h2', options: [{ value: 'h2', label: 'h2' }, { value: 'h3', label: 'h3' }] },
    { key: 'align', label: 'Vertical alignment', type: 'select', default: 'center', options: [{ value: 'center', label: 'Center' }, { value: 'top', label: 'Top' }] },
    ...SECTION_FIELDS,
  ],
};

import type { RegistryEntry } from '../_shared/registry-types';
import { SECTION_FIELDS } from '../_shared/registry-types';

/**
 * Registry entry for the EXTENSION of the existing `banner` type. Only the new
 * fields are listed; the existing banner fields (image, overlay, theme,
 * Trustpilot, copy) stay as they are. Defaults preserve today's hero exactly.
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
        { value: 'compact', label: 'Compact (page header, ~220 px)' },
      ],
      help: 'Compact = low band, text left, no icon, no forced h1. For text and landing pages.',
    },
    {
      key: 'heading_level',
      label: 'Heading level',
      type: 'select',
      default: 'h1',
      options: [
        { value: 'h1', label: 'h1 (page title)' },
        { value: 'h2', label: 'h2' },
        { value: 'none', label: 'No heading tag (visually identical)' },
      ],
      help: 'On a page that already has an h1 (or the sr-only h1) use h2 or none. Prevents double h1 (#520).',
    },
    { key: 'show_icon', label: 'Icon above title', type: 'boolean', default: true },
    {
      key: 'text_align',
      label: 'Text alignment',
      type: 'select',
      default: 'left',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Centered' },
      ],
    },
    ...SECTION_FIELDS,
  ],
};

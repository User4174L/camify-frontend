import type { RegistryEntry } from '../_shared/registry-types';
import { SECTION_FIELDS } from '../_shared/registry-types';

export const mediaTextRegistry: RegistryEntry = {
  type: 'media_text',
  label: 'Beeld + tekst',
  category: 'content',
  maxPerPage: null,
  allowedGroups: ['landing', 'information', 'catalog', 'detail', 'brand'],
  defaultContent: { eyebrow: '', title: '', body: '', cta_label: '', cta_href: '', image_alt: '' },
  defaultData: { media_side: 'left', ratio: '1:1', media_style: 'rounded', heading_level: 'h2', align: 'center' },
  fields: [
    { key: 'image_url', label: 'Afbeelding', type: 'image', help: 'Zelfde upload/WebP-flow als de banner.' },
    { key: 'image_alt', label: 'Alt-tekst', type: 'text', translatable: true, perMarket: true },
    { key: 'eyebrow', label: 'Bovenregel (klein, oranje)', type: 'text', translatable: true, perMarket: true },
    { key: 'title', label: 'Titel', type: 'text', translatable: true, perMarket: true },
    { key: 'body', label: 'Tekst', type: 'markdown', translatable: true, perMarket: true },
    { key: 'cta_label', label: 'Knop — label', type: 'text', translatable: true, perMarket: true },
    { key: 'cta_href', label: 'Knop — link', type: 'url', translatable: true, perMarket: true },
    { key: 'media_side', label: 'Beeld links/rechts', type: 'select', default: 'left', options: [{ value: 'left', label: 'Links' }, { value: 'right', label: 'Rechts' }], help: 'Meerdere blokken onder elkaar met wisselende kant = het klassieke lange-pagina-ritme.' },
    { key: 'ratio', label: 'Verhouding beeld : tekst', type: 'select', default: '1:1', options: [{ value: '1:1', label: '1 : 1' }, { value: '2:3', label: '2 : 3 (smal beeld)' }, { value: '3:2', label: '3 : 2 (breed beeld)' }] },
    { key: 'media_style', label: 'Beeldstijl', type: 'select', default: 'rounded', options: [{ value: 'rounded', label: 'Afgerond' }, { value: 'card', label: 'Kaart met rand en schaduw' }, { value: 'plain', label: 'Recht' }] },
    { key: 'heading_level', label: 'Kopniveau', type: 'select', default: 'h2', options: [{ value: 'h2', label: 'h2' }, { value: 'h3', label: 'h3' }] },
    { key: 'align', label: 'Verticale uitlijning', type: 'select', default: 'center', options: [{ value: 'center', label: 'Gecentreerd' }, { value: 'top', label: 'Bovenaan' }] },
    ...SECTION_FIELDS,
  ],
};

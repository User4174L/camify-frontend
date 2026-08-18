/**
 * Spiegel van het `fields`-schema uit APP-Frontend-V2
 * (`components/ui/slots/engine/component-type-registry.tsx`, type `SlotField`).
 * Uit dit schema genereert de V2-inspector de editor: wij hoeven per blok
 * géén editor te schrijven, alleen dit object aan te leveren.
 */

export type SlotFieldType =
  | 'text'
  | 'textarea'
  | 'markdown'
  | 'url'
  | 'select'
  | 'boolean'
  | 'image'
  | 'range'
  | 'category-badge-list'
  | 'brand-badge-list'
  | 'data-source'
  | 'repeater';

export type SelectOption = { value: string; label: string };

export type RepeaterItemField = {
  key: string;
  label: string;
  type?: 'text' | 'markdown' | 'icon' | 'boolean' | 'select' | 'url' | 'category-badge-list';
  placeholder?: string;
  /** Vertaalbaar per markt (zit in `content`, niet in `data`). */
  perMarket?: boolean;
  default?: unknown;
  options?: SelectOption[];
};

export type SlotField = {
  key: string;
  label: string;
  type: SlotFieldType;
  /**
   * `true` = het veld leeft in `content` (per markt, vertaalbaar);
   * `false`/weggelaten = taal-onafhankelijk, leeft in `data`.
   */
  translatable?: boolean;
  perMarket?: boolean;
  numeric?: boolean;
  options?: SelectOption[];
  default?: unknown;
  min?: number;
  max?: number;
  step?: number;
  addLabel?: string;
  itemFields?: RepeaterItemField[];
  /** Korte toelichting voor de inspector (en voor Mike). */
  help?: string;
};

export type ComponentCategory = 'banners' | 'products' | 'content' | 'trust' | 'marketing';

/** Eén regel in de V2-registry — precies wat Mike overneemt. */
export type RegistryEntry = {
  /** ComponentType-waarde in de backend (`storefront/models/component_content.py`). */
  type: string;
  label: string;
  category: ComponentCategory;
  /** Bestaand type dat uitgebreid wordt (dan geen nieuwe enum-entry nodig). */
  extends?: string;
  /** Max. instanties per pagina (COMPONENT_MULTIPLICITY), `null` = onbeperkt. */
  maxPerPage: number | null;
  /** In welke paginagroepen het blok mag (page_groups.py allow-list). */
  allowedGroups: Array<'landing' | 'information' | 'catalog' | 'detail' | 'brand'>;
  defaultContent: Record<string, unknown>;
  defaultData: Record<string, unknown>;
  fields: SlotField[];
};

/** Gedeelde sectie-instellingen die élk blok in `data.section` krijgt. */
export const SECTION_FIELDS: SlotField[] = [
  {
    key: 'section.background',
    label: 'Achtergrond',
    type: 'select',
    default: 'none',
    options: [
      { value: 'none', label: 'Geen (pagina-achtergrond)' },
      { value: 'raised', label: 'Licht grijs (surface-raised)' },
      { value: 'muted', label: 'Grijs (surface-muted)' },
      { value: 'brand', label: 'Oranje-tint (brand-50)' },
      { value: 'inverse', label: 'Donker (surface-inverse)' },
    ],
    help: 'Wisselende achtergronden geven ritme op een lange pagina.',
  },
  {
    key: 'section.width',
    label: 'Breedte',
    type: 'select',
    default: 'full',
    options: [
      { value: 'full', label: 'Achtergrond volle breedte, inhoud in container' },
      { value: 'container', label: 'Alles binnen de container (afgeronde kaart)' },
    ],
  },
  {
    key: 'section.padding',
    label: 'Ruimte boven/onder',
    type: 'select',
    default: 'md',
    options: [
      { value: 'none', label: 'Geen' },
      { value: 'sm', label: 'Klein (24 px)' },
      { value: 'md', label: 'Normaal (48 px)' },
      { value: 'lg', label: 'Groot (80 px)' },
    ],
  },
  {
    key: 'section.anchor_id',
    label: 'Anker-id',
    type: 'text',
    help: 'Optioneel: maakt #anker-links naar dit blok mogelijk (bv. vanuit een CTA).',
  },
];

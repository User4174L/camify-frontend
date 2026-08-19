import type { SectionSettings } from '../_shared/section';

/** Eén tegel: foto + titel + subregel + link (categorie, landingspagina, artikel). */
export type LinkTileItem = {
  title: string;
  subtitle?: string;
  href: string;
  image_url?: string;
  /** Optioneel klein label linksboven ("Nieuw", "Populair"). */
  badge?: string;
};

export type LinkTilesContent = {
  /** Vertaalbare kaartteksten, in dezelfde volgorde als data.items. */
  items?: Array<{ title: string; subtitle?: string; badge?: string; href?: string }>;
};

export type LinkTilesData = {
  /** Beeld + (fallback-)link per tegel, taal-onafhankelijk. */
  items?: Array<{ image_url?: string; href: string }>;
  columns?: 2 | 3 | 4;
  /** photo = foto met tekst eronder; overlay = tekst óp de foto (donkere gradient). */
  style?: 'photo' | 'overlay';
  ratio?: '4:3' | '1:1' | '16:9';
  role?: string;
  preset_id?: number;
  section?: SectionSettings;
};

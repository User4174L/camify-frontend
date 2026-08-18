import type { SectionSettings } from '../_shared/section';

/** Eén filterknop boven het grid: label per markt + de bron-scope (data). */
export type GridFilter = {
  /** Vertaalbaar label (content). */
  label: string;
  /** Categorie-id's (multi) óf een product_type binnen de grid-scope — één van beide is genoeg (#429). */
  categories?: number[];
  product_type?: string;
};

export type ProductGridContent = {
  title?: string;
  titleAccent?: string;
  subtitle?: string;
  viewAllLabel?: string;
  /** Labels van de filterknoppen, in dezelfde volgorde als data.filters. */
  filterLabels?: string[];
};

export type ProductGridData = {
  /** Bron: categorie-id's (fase 1) — of later een spec-filter (fase 2). */
  categories?: number[];
  brands?: string[];
  count?: number;
  columns?: 3 | 4;
  filters?: Array<Omit<GridFilter, 'label'>>;
  viewAllHref?: string;
  heading_level?: 'h1' | 'h2';
  role?: string;
  section?: SectionSettings;
};

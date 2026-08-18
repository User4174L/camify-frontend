import type { SectionSettings } from '../_shared/section';

/** product_rail bestaat al in V2 (grid). Voorstel: `display: grid|carousel` als extra data-veld. */
export type ProductRailContent = { title?: string; titleAccent?: string; subtitle?: string; viewAllLabel?: string };
export type ProductRailData = {
  source?: 'newest' | 'relevance'; // (V2)
  count?: number;                    // (V2)
  viewAllHref?: string;              // (V2)
  filterCategories?: Array<{ id: number; label: string }>; // (V2)
  // NIEUW
  display?: 'grid' | 'carousel';
  /** Zichtbare kaarten naast elkaar op desktop (carousel). */
  visible?: 4 | 5 | 6;
  role?: string;
  section?: SectionSettings;
};

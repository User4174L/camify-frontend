import type { SectionSettings } from '../_shared/section';

export type MediaTextContent = {
  eyebrow?: string;
  title?: string;
  /** Markdown. */
  body?: string;
  cta_label?: string;
  cta_href?: string;
  image_alt?: string;
};

export type MediaTextData = {
  image_url?: string;
  media_side?: 'left' | 'right';
  /** Kolomverhouding media:tekst. */
  ratio?: '1:1' | '2:3' | '3:2';
  media_style?: 'rounded' | 'plain' | 'card';
  heading_level?: 'h2' | 'h3';
  /** Tekst verticaal centreren t.o.v. de media (default) of bovenaan uitlijnen. */
  align?: 'center' | 'top';
  role?: string;
  preset_id?: number;
  section?: SectionSettings;
};

import type { SectionSettings } from '../_shared/section';

/** Losse sectiekop: V2's HomeSectionHeader als eigen blok, boven elk ander blok te zetten. */
export type SectionHeaderContent = {
  title?: string;
  titleAccent?: string;
  subtitle?: string;
  linkLabel?: string;
  linkHref?: string;
};

export type SectionHeaderData = {
  heading_level?: 'h1' | 'h2' | 'h3';
  align?: 'left' | 'center';
  /** Verticale ruimte: default zit hij dicht op het volgende blok. */
  role?: string;
  preset_id?: number;
  section?: SectionSettings;
};

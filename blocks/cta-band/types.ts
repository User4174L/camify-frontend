import type { SectionSettings } from '../_shared/section';

export type CtaBandContent = {
  title?: string;
  subtitle?: string;
  primary_label?: string;
  primary_href?: string;
  secondary_label?: string;
  secondary_href?: string;
};

export type CtaBandData = {
  /** brand = oranje vlak; inverse = donker; light = licht met rand. */
  variant?: 'brand' | 'inverse' | 'light';
  align?: 'left' | 'center';
  /** Smalle band (één regel) voor tussen tekstblokken. */
  compact?: boolean;
  role?: string;
  preset_id?: number;
  section?: SectionSettings;
};

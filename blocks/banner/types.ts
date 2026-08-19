import type { SectionSettings } from '../_shared/section';

/**
 * Banner — bestaand V2-blok (`banner`, renderer trade-in-hero.tsx) met
 * VOORGESTELDE extra velden. Alles wat hier al in V2 zit is gemarkeerd (V2);
 * de rest is nieuw. Nieuwe velden hebben defaults die het huidige gedrag
 * exact behouden, dus bestaande homepage-banners veranderen niet.
 */
export type BannerContent = {
  title_lead?: string;      // (V2)
  title_accent?: string;    // (V2)
  subtitle?: string;        // (V2)
  cta_label?: string;       // (V2)
  cta_href?: string;        // (V2)
  image_alt?: string;       // (V2)
  /** NIEUW: label bij de aftelling, bv. "Black Friday eindigt over". */
  countdown_label?: string;
};

export type BannerData = {
  // ---- (V2) bestaand ----
  image_url?: string;
  image_position?: 'left' | 'center' | 'right';
  image_position_y?: 'top' | 'center' | 'bottom';
  image_fit?: 'cover' | 'contain';
  image_zoom?: number;
  image_opacity?: number;
  overlay_style?: 'none' | 'gradient' | 'scrim';
  text_theme?: 'auto' | 'light' | 'dark';
  show_trustpilot?: boolean;
  preset_id?: number;
  // ---- NIEUW ----
  /** hero = huidige 400 px-band (default); compact = lage kop voor tekst-/landingspagina's. */
  layout?: 'hero' | 'compact';
  /** h1 op home, h2 of geen op pagina's die al een titel hebben (zie #520/#522). */
  heading_level?: 'h1' | 'h2' | 'none';
  /** Het inruil-pijltjes-icoon boven de titel (nu altijd aan). */
  show_icon?: boolean;
  text_align?: 'left' | 'center';
  /** Optioneel: ISO-datum/tijd; banner toont een aftelling en verbergt de teller (of zichzelf) na afloop. */
  countdown_until?: string;
  countdown_hide_after?: boolean;
  section?: SectionSettings;
};

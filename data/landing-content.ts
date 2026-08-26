/**
 * Content voor de landingspagina-opzet (/landing/[slug]).
 *
 * De velden spiegelen 1-op-1 de kolommen van het content-werkbestand
 * (OneDrive: 6. Website & Productontwikkeling/Landingspaginas/concepten/
 * "Landingspaginas V2 - content werkbestand (CONCEPT).xlsx", tab `paginas`
 * + tab `faq`). Eén template, per pagina alleen andere inhoud — precies
 * zoals Mike het straks vanuit dat bestand inlaadt.
 */

export type LandingFaq = { vraag: string; antwoord: string };

export type LandingContent = {
  slug: string;
  pagina: string;
  blok: 'A' | 'B';
  breadcrumb: Array<{ label: string; href?: string }>;
  // Banner
  banner_title_lead: string;
  banner_title_accent: string;
  banner_subtitle: string;
  banner_image: string;
  banner_cta_label: string;
  banner_cta_href: string;
  // Productselectie
  filter_omschrijving: string;
  filter_machine: string;
  grid_filter_labels: string[];
  // SEO meta
  seo_title: string;
  seo_description: string;
  // Teksten
  intro_boven_producten: string;
  seo_tekst_onder_producten: string;
  faq: LandingFaq[];
};

export const LANDING_CONTENT: Record<string, LandingContent> = {
  'canon-lenzen': {
    slug: 'canon-lenzen',
    pagina: 'Lenzen voor Canon',
    blok: 'A',
    breadcrumb: [{ label: 'Lenzen', href: '/lenses' }, { label: 'Lenzen voor Canon' }],
    banner_title_lead: 'Lenzen voor',
    banner_title_accent: 'Canon',
    banner_subtitle:
      'Van lichtsterke primes tot veelzijdige zooms: ruim duizend geteste tweedehands lenzen met RF-, EF-, EF-S- of EF-M-vatting, met garantie.',
    banner_image: '/images/canon-rf-24-70mm-f28-l-is-usm.jpg',
    banner_cta_label: 'Bekijk het aanbod',
    banner_cta_href: '#producten',
    filter_omschrijving: 'Alle lenzen met Canon-vatting: RF, EF, EF-S, EF-M',
    filter_machine:
      'categories=lenses/mirrorless/canon-rf-fit,lenses/dslr/canon-fit,lenses/dslr/canon-efs-fit,lenses/mirrorless/canon-efm-fit',
    grid_filter_labels: ['RF-vatting', 'EF-vatting'],
    seo_title: 'Tweedehands Canon lenzen kopen | Camera-tweedehands.nl',
    seo_description:
      'Op zoek naar een tweedehands lens voor je Canon? Bekijk ons geteste aanbod RF-, EF-, EF-S- en EF-M-lenzen met garantie. Eerlijke condities, scherpe prijzen.',
    intro_boven_producten:
      'Een tweedehands lens is de slimste upgrade voor je Canon. Hieronder vind je alles wat op je camera past: RF-lenzen voor de EOS R-serie en EF-, EF-S- en EF-M-lenzen voor je DSLR of EOS M. Elk exemplaar is door ons getest en eerlijk beoordeeld, zodat je precies weet wat je in huis haalt.',
    seo_tekst_onder_producten: [
      '## Welke lens past op mijn Canon?',
      'Dat hangt af van je camera. Heb je een spiegelloze camera uit de EOS R-serie (zoals de R5, R6 of R8), dan is de RF-vatting je thuisbasis — en met de EF-EOS R adapter passen ook alle EF-lenzen, zonder verlies van kwaliteit of autofocussnelheid. Fotografeer je met een DSLR (zoals de 5D, 6D of 90D), dan kies je uit EF-lenzen (full-frame) of EF-S-lenzen (APS-C). Voor de compacte EOS M-serie zijn er EF-M-lenzen.',
      '',
      '## Waarom een tweedehands Canon lens?',
      'Glas veroudert nauwelijks. Een goed onderhouden lens van een paar jaar oud presteert optisch hetzelfde als nieuw, maar kost vaak tientallen procenten minder. Wij testen elke lens op autofocus, diafragma, stabilisatie en glaskwaliteit (krassen, schimmel, stof) en beschrijven de conditie eerlijk — inclusief foto’s van het echte exemplaar.',
      '',
      '## Eerst je oude lens inruilen?',
      'Dat kan. Vraag online een bod aan en verreken de waarde direct met je aankoop, of laat het bedrag uitbetalen.',
    ].join('\n'),
    faq: [
      {
        vraag: 'Passen EF-lenzen op mijn Canon EOS R-camera?',
        antwoord:
          'Ja. Met de Canon EF-EOS R adapter werken alle EF- en EF-S-lenzen volledig op de R-serie, inclusief autofocus en beeldstabilisatie. Er is geen kwaliteitsverlies: de adapter bevat geen glas.',
      },
      {
        vraag: 'Hoe testen jullie een tweedehands lens?',
        antwoord:
          'Elke lens wordt gecontroleerd op autofocus, diafragmawerking, beeldstabilisatie, zoom- en focusring en de staat van het glas (krassen, schimmel, waas, stof). Wat we vinden, zetten we eerlijk in de conditieomschrijving — met foto’s van het exemplaar dat je koopt.',
      },
      {
        vraag: 'Krijg ik garantie op een tweedehands lens?',
        antwoord: 'Ja, alle lenzen worden geleverd met garantie. De exacte termijn staat bij het product.',
      },
      {
        vraag: 'Kan ik mijn huidige lens inruilen?',
        antwoord:
          'Ja. Vraag online een bod aan; je kunt de waarde direct verrekenen met je nieuwe lens of laten uitbetalen.',
      },
    ],
  },

  'sony-cameras': {
    slug: 'sony-cameras',
    pagina: "Sony camera's",
    blok: 'A',
    breadcrumb: [{ label: "Camera's", href: '/cameras' }, { label: "Sony camera's" }],
    banner_title_lead: 'Tweedehands',
    banner_title_accent: "Sony camera's",
    banner_subtitle:
      'Van de A7-serie tot de compacte ZV-lijn: geteste Sony-camera’s met eerlijke conditieomschrijving en garantie.',
    banner_image: '/images/sony-a7-iv.jpg',
    banner_cta_label: 'Bekijk het aanbod',
    banner_cta_href: '#producten',
    filter_omschrijving: "Alle camera's van het merk Sony",
    filter_machine: 'brands=sony&product_type=camera',
    grid_filter_labels: ['Systeemcamera’s', 'Compact'],
    seo_title: "Tweedehands Sony camera kopen | Camera-tweedehands.nl",
    seo_description:
      'Tweedehands Sony camera kopen? Bekijk ons geteste aanbod: A7, A7R, A6000-serie en meer. Met garantie, eerlijke condities en de shuttercount gecheckt.',
    intro_boven_producten:
      'Sony maakt al jaren de populairste spiegelloze camera’s — en juist daardoor is het tweedehands aanbod groot. Hieronder vind je alle geteste Sony-body’s uit onze winkel, van instapmodel tot professionele A1.',
    seo_tekst_onder_producten: [
      '## Welke Sony past bij jou?',
      'Begin je met fotograferen, dan is een A6000-model of een oudere A7 een prima start. Wil je full-frame met moderne autofocus, kijk dan naar de A7 III of A7 IV. Voor video zijn de ZV-serie en de FX-lijn gemaakt.',
      '',
      '## Zo testen wij een Sony-body',
      'Elke camera wordt gecontroleerd op sensor, sluiter (shuttercount uitgelezen), autofocus, scherm en zoeker, en alle bediening. De conditie beschrijven we eerlijk, met foto’s van het echte exemplaar.',
    ].join('\n'),
    faq: [
      {
        vraag: 'Lezen jullie de shuttercount uit?',
        antwoord:
          'Ja, bij elke camera waar dat technisch kan lezen we het aantal sluiterklikken uit. Het aantal staat bij het product.',
      },
      {
        vraag: 'Passen mijn oude A-vatting lenzen op een nieuwe Sony?',
        antwoord:
          'Met een LA-EA-adapter passen A-vatting lenzen op de moderne E-vatting body’s. De autofocusprestaties verschillen per adapter en lens.',
      },
    ],
  },
};

/** Volledige beslislijst 20/21-08-2026 — voor de indexpagina. */
export const LANDING_INDEX: Array<{ slug: string; pagina: string; blok: 'A' | 'B'; klikken: number }> = [
  { slug: 'canon-lenzen', pagina: 'Lenzen voor Canon', blok: 'A', klikken: 3607 },
  { slug: 'nikon-lenzen', pagina: 'Lenzen voor Nikon', blok: 'A', klikken: 2045 },
  { slug: 'canon-cameras', pagina: "Canon camera's", blok: 'A', klikken: 1608 },
  { slug: 'sony-lenzen', pagina: 'Lenzen voor Sony', blok: 'A', klikken: 1513 },
  { slug: 'sony-cameras', pagina: "Sony camera's", blok: 'A', klikken: 1046 },
  { slug: 'nikon-cameras', pagina: "Nikon camera's", blok: 'A', klikken: 1002 },
  { slug: 'fujifilm-lenzen', pagina: 'Lenzen voor Fujifilm', blok: 'A', klikken: 453 },
  { slug: 'leica-cameras', pagina: "Leica camera's", blok: 'A', klikken: 298 },
  { slug: 'hasselblad-cameras', pagina: "Hasselblad camera's", blok: 'A', klikken: 259 },
  { slug: 'fujifilm-cameras', pagina: "Fujifilm camera's", blok: 'A', klikken: 257 },
  { slug: 'olympus-cameras', pagina: "Olympus & OM System camera's", blok: 'A', klikken: 245 },
  { slug: 'hasselblad-lenzen', pagina: 'Hasselblad lenzen', blok: 'A', klikken: 204 },
  { slug: 'leica-lenzen', pagina: 'Leica lenzen', blok: 'A', klikken: 151 },
  { slug: '70-200mm-lenzen', pagina: '70-200mm lenzen', blok: 'B', klikken: 1008 },
  { slug: '24-70mm-lenzen', pagina: '24-70mm lenzen', blok: 'B', klikken: 701 },
  { slug: '500mm-lenzen', pagina: '500mm lenzen', blok: 'B', klikken: 541 },
  { slug: '100-400mm-lenzen', pagina: '100-400mm lenzen', blok: 'B', klikken: 377 },
  { slug: '16-35mm-lenzen', pagina: '16-35mm lenzen', blok: 'B', klikken: 211 },
  { slug: '85mm-lenzen', pagina: '85mm lenzen', blok: 'B', klikken: 75 },
];

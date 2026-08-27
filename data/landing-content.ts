/**
 * Content voor de landingspagina-opzet (/landing/[slug]).
 *
 * Een landingspagina is identiek aan een categoriepagina (H1 + intro,
 * filters, grid), met SEO-tekst + FAQ onderaan als enige extra. De contentvelden spiegelen 1-op-1 de kolommen van het
 * content-werkbestand (OneDrive: 6. Website & Productontwikkeling/
 * Landingspaginas/concepten/"Landingspaginas V2 - content werkbestand
 * (CONCEPT).xlsx", tab `paginas` + tab `faq`). `filters` en `producten`
 * zijn hier mock-weergavedata: op V2 komen die uit de listing zelf (#534).
 */

export type LandingFaq = { vraag: string; antwoord: string };

export type LandingProduct = {
  id: string;
  name: string;
  price: number;
  priceMax: number;
  stock: number;
  image: string;
  href?: string;
};

export type LandingContent = {
  slug: string;
  pagina: string;
  blok: 'A' | 'B';
  breadcrumb: Array<{ label: string; href?: string }>;
  // Productselectie (Excel-spiegel; op V2 het listingblok #534)
  filter_omschrijving: string;
  filter_machine: string;
  aanbod: number;
  // SEO meta
  seo_title: string;
  seo_description: string;
  // Teksten
  intro_boven_producten: string;
  seo_tekst_onder_producten: string;
  faq: LandingFaq[];
  // Weergavedata voor de mockup (op V2 uit de listing)
  filters: Array<{ naam: string; opties: string[] }>;
  producten: LandingProduct[];
};

const LENS_FILTERS_CANON: Array<{ naam: string; opties: string[] }> = [
  { naam: 'Merk', opties: ['Canon', 'Sigma', 'Tamron', 'Samyang', 'Zeiss'] },
  { naam: 'Prijs', opties: ['Tot €250', '€250 – €500', '€500 – €1.000', '€1.000 – €2.000', '€2.000+'] },
  { naam: 'Vatting', opties: ['Canon RF', 'Canon EF', 'Canon EF-S', 'Canon EF-M'] },
  { naam: 'Brandpunt', opties: ['< 35mm (groothoek)', '35 – 70mm (standaard)', '70 – 200mm (tele)', '200mm+ (supertele)'] },
  { naam: 'Prime / Zoom', opties: ['Prime', 'Zoom'] },
  { naam: 'Max. diafragma', opties: ['f/1.2 – f/1.8', 'f/2 – f/2.8', 'f/3.5 – f/4', 'f/4.5+'] },
  { naam: 'Stabilisatie', opties: ['Met IS', 'Zonder IS'] },
  { naam: 'Gebruik', opties: ['Portret', 'Landschap', 'Wildlife', 'Macro', 'Straat', 'Bruiloft', 'Sport', 'Allround'] },
  { naam: 'Niveau', opties: ['Instap', 'Enthousiast', 'Pro'] },
  { naam: 'Op voorraad', opties: ['Alleen op voorraad'] },
];

const CAMERA_FILTERS: Array<{ naam: string; opties: string[] }> = [
  { naam: 'Prijs', opties: ['Tot €500', '€500 – €1.000', '€1.000 – €2.000', '€2.000 – €5.000', '€5.000+'] },
  { naam: 'Type camera', opties: ['Mirrorless', 'DSLR', 'Compact', 'Analoog'] },
  { naam: 'Sensor', opties: ['Full frame', 'APS-C', '1-inch'] },
  { naam: 'Megapixels', opties: ['Tot 24 MP', '24 – 40 MP', '40+ MP'] },
  { naam: 'Video', opties: ['4K', '4K 120fps', '8K'] },
  { naam: 'IBIS', opties: ['Met IBIS', 'Zonder IBIS'] },
  { naam: 'Shuttercount', opties: ['Tot 10.000', 'Tot 50.000', 'Tot 100.000'] },
  { naam: 'Gebruik', opties: ['Portret', 'Landschap', 'Wildlife', 'Video', 'Reizen', 'Allround'] },
  { naam: 'Niveau', opties: ['Instap', 'Enthousiast', 'Pro'] },
  { naam: 'Op voorraad', opties: ['Alleen op voorraad'] },
];

export const LANDING_CONTENT: Record<string, LandingContent> = {
  'canon-lenzen': {
    slug: 'canon-lenzen',
    pagina: 'Lenzen voor Canon',
    blok: 'A',
    breadcrumb: [{ label: 'Lenzen', href: '/lenses' }, { label: 'Lenzen voor Canon' }],
    filter_omschrijving: 'Alle lenzen met Canon-vatting: RF, EF, EF-S, EF-M',
    filter_machine:
      'categories=lenses/mirrorless/canon-rf-fit,lenses/dslr/canon-fit,lenses/dslr/canon-efs-fit,lenses/mirrorless/canon-efm-fit',
    aanbod: 1173,
    seo_title: 'Tweedehands Canon lenzen kopen | Camera-tweedehands.nl',
    seo_description:
      'Op zoek naar een tweedehands lens voor je Canon? Bekijk ons geteste aanbod RF-, EF-, EF-S- en EF-M-lenzen met garantie. Eerlijke condities, scherpe prijzen.',
    intro_boven_producten:
      'Een tweedehands lens is de slimste upgrade voor je Canon. Hieronder vind je alles wat op je camera past: RF-lenzen voor de EOS R-serie en EF-, EF-S- en EF-M-lenzen voor je DSLR of EOS M. Elk exemplaar is door ons getest en eerlijk beoordeeld.',
    seo_tekst_onder_producten: [
      "## Welke lens past op mijn Canon?",
      "Dat hangt af van je camera. Heb je een spiegelloze camera uit de EOS R-serie (zoals de R5, R6 of R8), dan is de RF-vatting je thuisbasis — en met de EF-EOS R adapter passen ook alle EF-lenzen, zonder verlies van kwaliteit of autofocussnelheid. Fotografeer je met een DSLR (zoals de 5D, 6D of 90D), dan kies je uit EF-lenzen (full-frame) of EF-S-lenzen (APS-C). Voor de compacte EOS M-serie zijn er EF-M-lenzen.",
      "",
      "## Waarom een tweedehands Canon lens?",
      "Glas veroudert nauwelijks. Een goed onderhouden lens van een paar jaar oud presteert optisch hetzelfde als nieuw, maar kost vaak tientallen procenten minder. Wij testen elke lens op autofocus, diafragma, stabilisatie en glaskwaliteit (krassen, schimmel, stof) en beschrijven de conditie eerlijk — inclusief foto's van het echte exemplaar.",
      "",
      "## De populairste Canon-lenzen van dit moment",
      "De **RF 24-70mm f/2.8L** en **RF 70-200mm f/2.8L** zijn de werkpaarden voor de R-serie, en hun EF-voorgangers (24-70mm f/2.8L II, 70-200mm f/2.8L IS II en III) blijven tweedehands minstens zo gewild — zeker met adapter op een R-body. De **RF 24-105mm f/4L** is de veelzijdige allrounder, en voor sport- en natuurfotografen hebben we geregeld superteles op voorraad, van de EF 400mm f/2.8L tot de EF 500mm f/4L en de RF 100-500mm.",
      "",
      "## Eerst je oude lens inruilen?",
      "Dat kan. Vraag online een bod aan en verreken de waarde direct met je aankoop, of laat het bedrag uitbetalen. En wil je een lens eerst zelf proberen: in onze showroom in Geldermalsen zet je hem gewoon op je eigen body. Op alles krijg je 12 maanden garantie.",
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
    filters: LENS_FILTERS_CANON,
    producten: [
      { id: 'cl1', name: 'Canon RF 24-70mm f/2.8L IS USM', price: 1349, priceMax: 1649, stock: 3, image: '/images/canon-rf-24-70mm-f28-l-is-usm.jpg' },
      { id: 'cl2', name: 'Canon RF 70-200mm f/2.8L IS USM', price: 1499, priceMax: 1799, stock: 2, image: '/images/lenses/canon-rf-70-200-f28.webp' },
      { id: 'cl3', name: 'Canon RF 24-105mm f/4L IS USM', price: 599, priceMax: 849, stock: 5, image: '/images/lenses/canon-rf-24-105-f4.webp' },
      { id: 'cl4', name: 'Canon RF 28-70mm f/2L USM', price: 1949, priceMax: 2249, stock: 1, image: '/images/lenses/canon-rf-28-70-f2.webp' },
      { id: 'cl5', name: 'Canon RF 200-800mm f/6.3-9 IS USM', price: 1849, priceMax: 1849, stock: 1, image: '/images/lenses/canon-rf-200-800.webp' },
      { id: 'cl6', name: 'Canon RF 50mm f/1.8 STM', price: 139, priceMax: 169, stock: 8, image: '/images/placeholder-lens.svg' },
      { id: 'cl7', name: 'Canon RF 35mm f/1.8 Macro IS STM', price: 329, priceMax: 399, stock: 4, image: '/images/placeholder-lens.svg' },
      { id: 'cl8', name: 'Canon RF 100-500mm f/4.5-7.1L IS USM', price: 1999, priceMax: 2299, stock: 2, image: '/images/placeholder-lens.svg' },
      { id: 'cl9', name: 'Canon EF 24-70mm f/2.8L II USM', price: 899, priceMax: 1199, stock: 4, image: '/images/lenses/canon-rf-24-105-f4.webp' },
      { id: 'cl10', name: 'Canon EF 70-200mm f/2.8L IS III USM', price: 1099, priceMax: 1399, stock: 2, image: '/images/lenses/canon-rf-70-200-f28.webp' },
      { id: 'cl11', name: 'Canon EF 50mm f/1.4 USM', price: 219, priceMax: 269, stock: 6, image: '/images/placeholder-lens.svg' },
      { id: 'cl12', name: 'Canon EF 85mm f/1.8 USM', price: 229, priceMax: 279, stock: 3, image: '/images/placeholder-lens.svg' },
      { id: 'cl13', name: 'Canon EF 16-35mm f/4L IS USM', price: 449, priceMax: 549, stock: 3, image: '/images/placeholder-lens.svg' },
      { id: 'cl14', name: 'Canon EF 100mm f/2.8L Macro IS USM', price: 479, priceMax: 599, stock: 2, image: '/images/placeholder-lens.svg' },
      { id: 'cl15', name: 'Canon EF-S 17-55mm f/2.8 IS USM', price: 279, priceMax: 349, stock: 4, image: '/images/placeholder-lens.svg' },
      { id: 'cl16', name: 'Canon EF-S 10-18mm f/4.5-5.6 IS STM', price: 129, priceMax: 159, stock: 7, image: '/images/placeholder-lens.svg' },
      { id: 'cl17', name: 'Sigma 35mm f/1.4 DG HSM Art (EF)', price: 449, priceMax: 599, stock: 3, image: '/images/placeholder-lens.svg' },
      { id: 'cl18', name: 'Sigma 150-600mm f/5-6.3 Contemporary (EF)', price: 649, priceMax: 799, stock: 2, image: '/images/placeholder-lens.svg' },
      { id: 'cl19', name: 'Tamron 24-70mm f/2.8 G2 (EF)', price: 649, priceMax: 799, stock: 6, image: '/images/placeholder-lens.svg' },
      { id: 'cl20', name: 'Samyang 14mm f/2.8 (EF)', price: 219, priceMax: 269, stock: 2, image: '/images/placeholder-lens.svg' },
    ],
  },

  'sony-cameras': {
    slug: 'sony-cameras',
    pagina: "Sony camera's",
    blok: 'A',
    breadcrumb: [{ label: "Camera's", href: '/cameras' }, { label: "Sony camera's" }],
    filter_omschrijving: "Alle camera's van het merk Sony",
    filter_machine: 'brands=sony&product_type=camera',
    aanbod: 140,
    seo_title: 'Tweedehands Sony camera kopen | Camera-tweedehands.nl',
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
    filters: CAMERA_FILTERS,
    producten: [
      { id: 'sc1', name: 'Sony A7 IV', price: 1549, priceMax: 1849, stock: 4, image: '/images/sony-a7-iv.jpg' },
      { id: 'sc2', name: 'Sony A7R V', price: 2799, priceMax: 3199, stock: 2, image: '/images/sony-a7r-v.jpg' },
      { id: 'sc3', name: 'Sony A1', price: 3999, priceMax: 4499, stock: 1, image: '/images/sony-a1.jpg' },
      { id: 'sc4', name: 'Sony A7 III', price: 949, priceMax: 1249, stock: 6, image: '/images/placeholder-camera.svg' },
      { id: 'sc5', name: 'Sony A7C', price: 1099, priceMax: 1349, stock: 3, image: '/images/placeholder-camera.svg' },
      { id: 'sc6', name: 'Sony A7S III', price: 2299, priceMax: 2699, stock: 2, image: '/images/placeholder-camera.svg' },
      { id: 'sc7', name: 'Sony A9', price: 1699, priceMax: 1999, stock: 2, image: '/images/placeholder-camera.svg' },
      { id: 'sc8', name: 'Sony A7R IV', price: 1999, priceMax: 2399, stock: 3, image: '/images/sony-a7r-v.jpg' },
      { id: 'sc9', name: 'Sony A6700', price: 1149, priceMax: 1349, stock: 4, image: '/images/placeholder-camera.svg' },
      { id: 'sc10', name: 'Sony A6400', price: 649, priceMax: 849, stock: 5, image: '/images/placeholder-camera.svg' },
      { id: 'sc11', name: 'Sony A6100', price: 499, priceMax: 649, stock: 4, image: '/images/placeholder-camera.svg' },
      { id: 'sc12', name: 'Sony A6000', price: 279, priceMax: 379, stock: 8, image: '/images/placeholder-camera.svg' },
      { id: 'sc13', name: 'Sony ZV-E10', price: 499, priceMax: 649, stock: 3, image: '/images/placeholder-camera.svg' },
      { id: 'sc14', name: 'Sony ZV-E1', price: 1699, priceMax: 1949, stock: 1, image: '/images/placeholder-camera.svg' },
      { id: 'sc15', name: 'Sony A7 II', price: 549, priceMax: 699, stock: 5, image: '/images/placeholder-camera.svg' },
      { id: 'sc16', name: 'Sony RX100 VII', price: 799, priceMax: 949, stock: 2, image: '/images/placeholder-camera.svg' },
      { id: 'sc17', name: 'Sony A9 II', price: 2499, priceMax: 2899, stock: 1, image: '/images/placeholder-camera.svg' },
    ],
  },

  '70-200mm-lenzen': {
    slug: '70-200mm-lenzen',
    pagina: 'Tweedehands 70-200mm lenzen',
    blok: 'B',
    breadcrumb: [{ label: 'Lenzen', href: '/lenses' }, { label: '70-200mm lenzen' }],
    filter_omschrijving: 'Alle zoomlenzen 70-200mm, alle vattingen',
    filter_machine: 'focal_min=70; focal_max=200; prime_or_zoom=zoom',
    aanbod: 70,
    seo_title: 'Tweedehands 70-200mm lens kopen | Camera-tweedehands.nl',
    seo_description: 'Tweedehands 70-200mm kopen? Bekijk ons geteste aanbod voor Canon, Nikon, Sony en meer — f/2.8 en f/4, met garantie en eerlijke condities.',
    intro_boven_producten: 'De 70-200mm is niet voor niets de meest verkochte professionele zoom: portret, sport, bruiloft, reportage — hij kan het allemaal. Hieronder vind je alle geteste 70-200\'s uit onze winkel, voor elke vatting.',
    seo_tekst_onder_producten: [
      '## f/2.8 of f/4?',
      'De f/2.8-versies zijn de werkpaarden: maximale lichtsterkte en het mooiste bokeh, maar zwaarder en duurder. Een f/4 is de helft lichter, compacter en tweedehands opvallend betaalbaar — voor daglicht en reizen vaak de slimmere keuze.',
      '',
      '## Voor welke camera?',
      'We hebben 70-200\'s voor vrijwel elke vatting: Canon EF en RF, Nikon F en Z, Sony E/FE en meer. Ook de uitstekende versies van Sigma en Tamron vind je hier. Gebruik het vatting-filter hierboven om alleen te zien wat op jouw camera past.',
      '',
      '## De populairste 70-200\'s van dit moment',
      'De **Canon RF en EF 70-200mm f/2.8L**, **Sony FE 70-200mm f/2.8 GM (II)** en **Nikon Z 70-200mm f/2.8 S** zijn de professionele toppers; de f/4-versies van dezelfde merken zijn de slimme lichtgewichten. Van Sigma is de 70-200mm f/2.8 Sport het scherpe alternatief voor minder geld.',
      '',
      '## Zo testen wij',
      'Elke telezoom wordt gecontroleerd op autofocus, stabilisatie, zoombereik, diafragma en de staat van het glas. De conditie beschrijven we eerlijk, met foto\'s van het echte exemplaar — en er zit garantie op.',
    ].join('\n'),
    faq: [
      { vraag: 'Is een oudere 70-200 f/2.8 nog een goede koop?', antwoord: 'Ja. Juist deze klasse is optisch al jaren uitstekend; een vorige generatie doet het beeldkwalitatief nauwelijks onder voor de nieuwste en scheelt fors in prijs.' },
      { vraag: 'Werkt een EF- of F-vatting 70-200 op mijn spiegelloze camera?', antwoord: 'Ja, met de adapter van je merk (Canon EF-EOS R, Nikon FTZ) werken deze lenzen volledig, inclusief autofocus en stabilisatie.' },
      { vraag: 'Krijg ik garantie op een tweedehands lens?', antwoord: 'Ja. Standaard 12 maanden garantie, zonder kleine lettertjes.' },
    ],
    filters: [
      { naam: 'Merk', opties: ['Canon', 'Nikon', 'Sony', 'Sigma', 'Tamron', 'Panasonic'] },
      { naam: 'Prijs', opties: ['Tot €500', '€500 – €1.000', '€1.000 – €1.500', '€1.500+'] },
      { naam: 'Vatting', opties: ['Canon RF', 'Canon EF', 'Nikon Z', 'Nikon F', 'Sony E/FE', 'L-Mount'] },
      { naam: 'Lichtsterkte', opties: ['f/2.8', 'f/4'] },
      { naam: 'Stabilisatie', opties: ['Met IS', 'Zonder IS'] },
      { naam: 'Gebruik', opties: ['Portret', 'Sport', 'Wildlife', 'Bruiloft', 'Reportage'] },
      { naam: 'Op voorraad', opties: ['Alleen op voorraad'] },
    ],
    producten: [
      { id: 'tz1', name: 'Canon RF 70-200mm f/2.8L IS USM', price: 1499, priceMax: 1799, stock: 2, image: '/images/lenses/canon-rf-70-200-f28.webp' },
      { id: 'tz2', name: 'Sony FE 70-200mm f/2.8 GM OSS II', price: 1749, priceMax: 2149, stock: 3, image: '/images/sony-fe-70-200mm-f28-gm-oss-ii.jpg' },
      { id: 'tz3', name: 'Canon EF 70-200mm f/2.8L IS III USM', price: 1099, priceMax: 1399, stock: 2, image: '/images/lenses/canon-rf-70-200-f28.webp' },
      { id: 'tz4', name: 'Sony FE 70-200mm f/2.8 GM OSS', price: 1199, priceMax: 1449, stock: 4, image: '/images/sony-fe-70-200mm-f28-gm-oss-ii.jpg' },
      { id: 'tz5', name: 'Nikon Z 70-200mm f/2.8 VR S', price: 1649, priceMax: 1949, stock: 1, image: '/images/placeholder-lens.svg' },
      { id: 'tz6', name: 'Canon EF 70-200mm f/2.8L IS II USM', price: 849, priceMax: 1099, stock: 5, image: '/images/placeholder-lens.svg' },
      { id: 'tz7', name: 'Nikon AF-S 70-200mm f/2.8E FL ED VR', price: 1249, priceMax: 1499, stock: 2, image: '/images/placeholder-lens.svg' },
      { id: 'tz8', name: 'Canon EF 70-200mm f/4L IS II USM', price: 799, priceMax: 949, stock: 3, image: '/images/placeholder-lens.svg' },
      { id: 'tz9', name: 'Sony FE 70-200mm f/4 G OSS', price: 649, priceMax: 849, stock: 4, image: '/images/placeholder-lens.svg' },
      { id: 'tz10', name: 'Sony FE 70-200mm f/4 Macro G OSS II', price: 1149, priceMax: 1349, stock: 2, image: '/images/placeholder-lens.svg' },
      { id: 'tz11', name: 'Sigma 70-200mm f/2.8 DG OS HSM Sport (EF)', price: 749, priceMax: 949, stock: 3, image: '/images/placeholder-lens.svg' },
      { id: 'tz12', name: 'Sigma 70-200mm f/2.8 DG DN OS Sport (E)', price: 1099, priceMax: 1299, stock: 1, image: '/images/placeholder-lens.svg' },
      { id: 'tz13', name: 'Tamron SP 70-200mm f/2.8 Di VC USD G2 (EF)', price: 699, priceMax: 899, stock: 2, image: '/images/placeholder-lens.svg' },
      { id: 'tz14', name: 'Nikon AF-S 70-200mm f/4G ED VR', price: 599, priceMax: 749, stock: 3, image: '/images/placeholder-lens.svg' },
      { id: 'tz15', name: 'Panasonic Lumix S PRO 70-200mm f/2.8 O.I.S.', price: 1349, priceMax: 1549, stock: 1, image: '/images/placeholder-lens.svg' },
      { id: 'tz16', name: 'Panasonic Lumix S PRO 70-200mm f/4 O.I.S.', price: 899, priceMax: 1099, stock: 2, image: '/images/placeholder-lens.svg' },
      { id: 'tz17', name: 'Canon RF 70-200mm f/4L IS USM', price: 1149, priceMax: 1349, stock: 2, image: '/images/lenses/canon-rf-70-200-f28.webp' },
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

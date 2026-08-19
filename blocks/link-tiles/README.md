# Link tiles (nieuw type `link_tiles`)

**Doel:** foto-tegels die naar een categorie, landingspagina of artikel linken — de navigatiesectie van elke merk-/systeempagina ("Canon RF → camera's / lenzen / accessoires") en van de kennisbank-overzichten. Het "collection list"-blok van Shopify, de categorietegels van MPB/Kamera Express. V2 heeft `tiles` (icoon-tegels) en `brand_grid` (logo's), maar geen foto-tegel met link.

**Content (per markt):** items[title, subtitle, badge, href] — link per markt i.v.m. gelokaliseerde slugs. **Data:** items[image_url, href-fallback], columns 2|3|4, style photo|overlay, ratio 4:3|1:1|16:9, section.*.

**Later:** bron "categorieën" i.p.v. handmatige items (tegel = categorie-afbeelding + naam + aantal), zodra de categoriefoto's in V2 staan (zie default category images).

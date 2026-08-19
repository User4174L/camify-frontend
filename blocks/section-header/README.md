# Section header (nieuw type `section_header`)

**Doel:** de kop die nu vast in rail/grid/brand-grid zit (titel + accentwoord + subregel + "Bekijk alles →") als los blok, boven élk ander blok te zetten — tiles, statistics, steps, media_text, of gewoon boven een tekst.

**Waarom niet het bestaande Article-blok:** dat heeft geen accentwoord en geen link, en zit visueel anders (artikel-H1/H2). Dit blok is de "shop-kop".

**Content (per markt):** title, titleAccent, subtitle, linkLabel, linkHref. **Data:** heading_level (h1|h2|h3), align (left|center), section.*.

**Render-detail:** default `section.padding = sm`; het volgende blok begint zonder eigen top-padding (`[&+section]:pt-0`) zodat kop en blok één geheel zijn. In V2: `HomeSectionHeader` hergebruiken.

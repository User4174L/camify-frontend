# Banner — layout `compact` (uitbreiding bestaand blok)

**Status:** uitbreiding van het bestaande V2-type `banner` (geen nieuw type). Dekt #522 en #430.

**Waarom uitbreiden en niet nieuw:** de banner heeft al afbeelding, positie, fit, zoom, opacity, overlay, tekstthema, Trustpilot, presets, per-markt copy en de vertaalknop. Een tweede blok zou dat dupliceren. Vier nieuwe `data`-velden zijn genoeg; hun defaults houden de homepage-hero exact zoals hij is.

**Nieuw in `data`:** `layout` (hero|compact), `heading_level` (h1|h2|none), `show_icon` (bool), `text_align` (left|center) + `section.*` (zie _shared).

**Compact-gedrag:** band 200/220 px i.p.v. 320/400, tekstkolom `max-w-2xl`, geen icoon, geen `mb-12` eronder (de section-padding regelt de ruimte), accentregel loopt door op dezelfde regel. Breadcrumb komt NIET uit de banner maar uit de pagina-chrome erboven.

**Wat Mike doet:** `layout`/`heading_level`/`show_icon`/`text_align` toevoegen aan `BannerData` + `BannerPreset`-serializer, renderer-branch in `trade-in-hero.tsx` (zie slot-banner.tsx), 4 velden in het preset-editor-schema. Geen migratie (JSON-data).

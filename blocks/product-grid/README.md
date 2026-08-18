# Product grid (nieuw type `product_grid` — ticket #429)

**Doel:** grid van producten uit meerdere (sub)categorieën met filterknoppen; ~90% van de landingspagina's draait hierop.

**Bron (data):** categories (multi, fase 1) + brands (optioneel), count (4–24, default 16; 24 = één categoriepagina, PAGE_SIZE in V2), columns. **Filterknoppen:** repeater; per knop categorieën (multi) óf een product_type binnen de scope — één van beide is genoeg (zie comment #429). Eerste knop "Alles" automatisch. **Fase 2:** spec-filter als bron (sensor = full frame).

**Content (per markt):** title, titleAccent, subtitle, viewAllLabel, filterLabels (zelfde volgorde als data.filters).

**Wat hier NIET zit:** de data-koppeling. V2 haalt producten via de bestaande listing-endpoint (`catalog/categories/<id>/products/` kan brand/type/prijs/conditie al). Kaart = bestaande HomeProductCard.

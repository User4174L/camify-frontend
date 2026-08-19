# Product rail — weergave `carousel` (uitbreiding bestaand blok)

**Status:** uitbreiding van het bestaande V2-type `product_rail` (nu altijd een grid). Nieuw `data.display: grid|carousel` + `visible: 4|5|6`. Default `grid` = huidig gedrag.

**Carrousel:** horizontale scroll-snap, pijlen op desktop, 70%-kaart op mobiel. Zelfde kaart (HomeProductCard), zelfde kop, zelfde bron (newest/relevance + filterCategories).

**Aanvullingen 19-08:** `source: outlet` (variants met `is_outlet_product`) → rail-preset "Nu in de aanbieding". Advies: **carrousel als default** — de huidige grid toont op mobiel 5 kaarten in 2 kolommen (3 rijen met gat) en is niet te swipen.

# Camera-tweedehands / Camify — Brandbook (Design Tokens)

## Doel van dit document

Dit is de **canonieke kleur- en stijlreferentie** voor camera-tweedehands.nl / Camify, en de
**leidraad voor V2**. Het legt de basis-tokens vast — kleuren, hover-states, schaduwen,
transitions, radii — zodat iedere ontwikkelaar of LLM die aan V2 bouwt of het design aanpast
consistente, on-brand waarden gebruikt.

- **Bron van waarheid = het goedgekeurde referentie-design** (de Vercel-build /
  `camify-next/app/globals.css`). Houd dit altijd aan.
- **Niet elk component of elke knop is al ontworpen.** Dat hoeft ook niet: dit zijn de
  vaste fundament-tokens. Nieuwe features en nog-niet-bepaalde knoppen **erven** hiervan.
  Kies altijd uit deze tokens; verzin geen nieuwe tints, schaduwen of timings.
- **Tokennamen komen overeen met V2's `styles/tokens.css`.** De hex-waarde is het anker;
  de tokennaam ernaast is hoe je het in code aanroept.
- **Dark mode = geen prioriteit nu.** Dit brandbook beschrijft het **light theme** (de
  Vercel-referentie is light-only). V2 heeft een dark theme, maar daar geldt geen
  vastgelegde merkwaarde voor — laat het voorlopig zoals het is; pak het later op.

> **De #1 regel:** knoppen/accenten zijn `brand-500` (`#E8692A`), hover `brand-600`
> (`#D15A20`). Neutralen (tekst, achtergronden, zoekbalk, borders) zijn **warm** — een
> off-white/navy palet, géén koele blauwe tint.

---

## 1. TL;DR (lees dit eerst)

**Kleur**
- Primair accent = `brand-500` = `#E8692A`. Hover/active = `brand-600` = `#D15A20`.
- Oranje palet = alleen `brand-100 / 500 / 600`. Geen `brand-700+` — als je "donkerder oranje" denkt nodig te hebben, gebruik `brand-600`.
- Tekst: `text-primary` `#1E2133` (warme navy, géén zwart). Secundair `#6B6D80`.
- Neutralen zijn **warm** off-white/navy — geen koele blauwe tint in achtergronden, zoekbalk, borders of tekst.

**Interactie**
- Oranje element hover → `brand-600`. Donkere knop hover → `#2D3047` (`text-primary` net lichter).
- Ghost/list hover → `brand-100` (of `rgba(232,105,42,.04–.08)`), of `surface-raised`.
- Cards liften op hover: `translateY(-2px)` + `shadow-card`. Knoppen: `translateY(-1px)`.
- Transition default **`.2s`** (kleur/bg), **`.25s ease`** (knoppen), **`.3s`** (cards).
- Focus: border `brand-500` + ring `0 0 0 3px rgba(232,105,42,.08)`.
- Schaduwen zijn zacht, grote radius, lage zwart-opacity — nooit hard/donker.

---

## 2. Brand orange

Anker = `brand-500 = #E8692A`. `brand-600` is de echte hover. Dit is het **hele** oranje
palet — er zijn bewust geen donkerdere stappen.

| Token (`--…`)  | Hex       | Rol         | Gebruik voor |
|----------------|-----------|-------------|--------------|
| `brand-100`    | `#FFF0E8` | Tint        | Subtiele oranje vlakken, icon-bg, ghost-hover fill |
| **`brand-500`**| **`#E8692A`** | **PRIMAIR** | Knoppen, accenten, actieve nav, icons, focus, badges, link-hover |
| **`brand-600`**| **`#D15A20`** | **HOVER**   | Hover/active/pressed van elk oranje element |

> Er is geen `brand-700`+. Als je "donkerder oranje" denkt nodig te hebben (bv. voor een
> knop-hover), gebruik `brand-600`. Knoppen zijn `brand-500`, hover `brand-600`.

---

## 3. Neutralen (tekst, surfaces, borders) — WARM off-white/navy

| Token (`--…`)     | Hex       | Gebruik voor |
|-------------------|-----------|--------------|
| `text-primary`    | `#1E2133` | Primaire tekst, koppen, donkere knoppen, footer/newsletter-bg |
| `text-secondary`  | `#6B6D80` | Secundaire tekst, captions, meta, placeholders, inactieve icons |
| `text-muted`      | `#8B8DA8` | Tertiaire tekst (diepe sub-menu links) |
| `surface-raised`  | `#F8F8FA` | Sectie-/card-achtergronden, **inputs & zoekbalk**, chips, neutrale hover-fill |
| `surface-muted`   | `#EEEEF2` | Subtiele gevulde vlakken |
| `border-soft`     | `#EEEEF2` | Alle hairline-borders, dividers, input-borders |
| (white)           | `#FFFFFF` | Pagina-achtergrond, cards, modals |

- Donkere-knop hover: `#2D3047` (`text-primary` iets opgelicht).
- Hero-gradient: `linear-gradient(135deg, #F0F0F2, #E8E8EC)` (neutraal, niet oranje).
- Deze neutralen zijn bewust **warm**. Gebruik géén puur zwart (`#000`) en geen koele/blauwe
  grijstinten — achtergronden, zoekbalk en borders horen warm-neutraal te zijn, zoals hierboven.

---

## 4. Semantische kleuren (status & feedback)

Pastel-achtergrond + donkere leesbare tekst. Gebruik deze exacte paren.

| Betekenis            | Background | Tekst/Fg  | Notitie |
|----------------------|-----------|-----------|---------|
| Success / op voorraad| `#DCFCE7` | `#166534` | Voorraad-dot = solide `#22C55E` |
| Info / BTW           | `#DBEAFE` | `#1E40AF` | |
| Warning / outlet     | `#FEF9C3` | `#854D0E` | |
| Error / sale         | `#FECACA` | `#991B1B` | |
| Sterren (rating)     | —         | `#F59E0B` | Conditie-/review-sterren |
| Trustpilot groen     | —         | `#00B67A` | Alleen Trustpilot — nooit als UI-accent |

> Oranje is de **merk**kleur; deze zijn **functioneel**. Gebruik nooit een semantische
> kleur als primair accent, en nooit oranje om "success/error" aan te duiden.

---

## 5. Conditie-badges (5 tiers)

| Conditie       | Background | Tekst     |
|----------------|-----------|-----------|
| As new         | `#DCFCE7` | `#166534` |
| Excellent      | `#DBEAFE` | `#1E40AF` |
| Good           | `#FEF9C3` | `#854D0E` |
| Used           | `#FED7AA` | `#9A3412` |
| Heavily used   | `#FECACA` | `#991B1B` |

---

## 6. Hover & interactie-states

| Element-type | Default | Hover |
|--------------|---------|-------|
| Oranje knop / CTA / icon-btn | `brand-500` | `brand-600` |
| Donkere (primaire) knop | `text-primary` `#1E2133` | `#2D3047` + `shadow-button` |
| Tekstlink → accent | `text-secondary`/`text-primary` | `brand-500` |
| Outline-knop | transparant / border `#1E2133` | fill `#1E2133`, tekst wit |
| Neutrale icon-knop | tekst `#1E2133` | bg `surface-raised` |
| Pill / tag / filter-tab | border `border-soft` | border `#1E2133` **of** border+tekst `brand-500` |

**Ghost-hover fills:** `brand-100` `#FFF0E8` ≈ `rgba(232,105,42,.04–.08)`.
**Lift:** `-1px` (knoppen, kleine cards) · `-2px` (product/why/category cards) · `-3px` (feature/brand cards).
**Focus:** border `brand-500` + ring `0 0 0 3px rgba(232,105,42,.08)`; checkbox/radio `accent-color: #E8692A`.

---

## 7. Schaduwen / elevatie

Zacht, grote radius, lage zwart-opacity. Kies op rol; verzin geen eigen blur.

| Token             | Waarde                              | Gebruik voor |
|-------------------|-------------------------------------|--------------|
| `shadow-card-sm`  | `0 4px 20px rgba(0,0,0,.06)`        | Review-cards, subtiele rust-elevatie |
| `shadow-card`     | `0 8px 32px rgba(0,0,0,.08)`        | Product-cards op hover, standaard verhoogde card |
| `shadow-dropdown` | `0 12px 40px rgba(0,0,0,.10)`       | Dropdowns, mega-menu, filter-panels, popovers |
| `shadow-modal`    | `0 24px 80px rgba(0,0,0,.20)`       | Quick-view / dialogs |
| `shadow-pop`      | `0 -4px 20px rgba(0,0,0,.08)`       | Onder-vastgezette balken (cookie, sticky cart) |
| `shadow-button`   | `0 4px 16px rgba(30,33,51,.20)`     | Donkere/primaire knop op hover (ink-getint) |
| `shadow-brand`    | `0 8px 28px rgba(232,105,42,.08)`   | Oranje glow op hover (why-cards, accent-vlakken) |

> Nooit harde schaduwen (`rgba(0,0,0,.3+)`, kleine blur) — off-brand.

---

## 8. Motion / transitions

| Waarde       | Gebruik |
|--------------|---------|
| `.15s`       | Mini-changes (list-item bg, tag, sub-link kleur) |
| `.2s`        | **Default** — kleur/bg/border hovers, icon-knoppen |
| `.25s ease`  | Knoppen (`all .25s ease`), cards, tiles |
| `.3s`        | Card schaduw+transform op hover, header show/hide |
| `.4s`        | Uitklappen (accordion, SEO read-more `max-height`) |

Houd motion subtiel: liften ≤3px, duur ≤.3s voor hovers.

---

## 9. Overlays & wit-op-donker

**Overlays:** modal-backdrop `rgba(0,0,0,.5)` + `blur(4px)` · card-hover scrim `rgba(26,26,46,.45)` · foto-counter `rgba(0,0,0,.6)` · gallery-arrow `rgba(255,255,255,.92)` + blur.
**Wit op donkere (`#1E2133`) secties:** `rgba(255,255,255,.7)` secundair · `.6` muted · `.4` placeholder/fineprint · `.12–.15` input-bg/borders. (Nooit een grijze hex op donker — gebruik wit-met-opacity.)

---

## 10. Radius, font, layout

| Token        | Waarde | Gebruik |
|--------------|--------|---------|
| Font         | `'DM Sans', -apple-system, sans-serif` | Alle UI-tekst |
| `radius-r`   | `8px`  | Knoppen, inputs, kleine cards |
| `radius-rl`  | `12px` | Cards, panels |
| Modal radius | `16px` | Dialogs / quick-view |
| Pill radius  | `50px` | Pills, tags, primaire CTAs, badges |
| Max width    | `1280px` | Content-container |
| Line-height  | `1.5` | Body |

---

## 11. tokens.css (correcte waarden voor V2)

Dit zijn de canonieke waarden voor `styles/tokens.css`. Roep in componenten altijd deze
tokens aan (`bg-brand-500`, `text-text-primary`, `bg-surface-raised`, …); zet de waarden niet hard-coded.

```css
:root {
  /* Brand — heel het oranje palet (geen donkerdere stappen) */
  --brand-100: #FFF0E8;
  --brand-500: #E8692A; /* PRIMAIR — knoppen, accenten */
  --brand-600: #D15A20; /* hover / active */
  /* geen --brand-700+ */

  /* Neutralen — WARM, geen Tailwind Slate */
  --text-primary:    #1E2133;
  --text-secondary:  #6B6D80;
  --text-muted:      #8B8DA8;
  --surface-raised:  #F8F8FA;
  --surface-muted:   #EEEEF2;
  --border-soft:     #EEEEF2;

  /* Semantisch */
  --success: #166534; --success-bg: #DCFCE7;
  --info:    #1E40AF; --info-bg:    #DBEAFE;
  --warning: #854D0E; --warning-bg: #FEF9C3;
  --error:   #991B1B; --error-bg:   #FECACA;
  --trustpilot: #00B67A;

  /* Elevatie */
  --shadow-card-sm:  0 4px 20px rgba(0,0,0,.06);
  --shadow-card:     0 8px 32px rgba(0,0,0,.08);
  --shadow-dropdown: 0 12px 40px rgba(0,0,0,.10);
  --shadow-modal:    0 24px 80px rgba(0,0,0,.20);
  --shadow-pop:      0 -4px 20px rgba(0,0,0,.08);
  --shadow-brand:    0 8px 28px rgba(232,105,42,.08);

  /* Radii */
  --radius-r: 8px; --radius-rl: 12px; --radius-pill: 50px;
}
```

**Goed / fout**
```html
<!-- ✅ -->
<button class="bg-brand-500 hover:bg-brand-600 text-white rounded-full transition-colors duration-200">Bekijk</button>
<a class="hover:bg-brand-100 hover:text-brand-500 transition">nav link</a>
<button class="bg-[--text-primary] hover:bg-[#2D3047] text-white shadow-button">Donkere CTA</button>

<!-- ❌ -->
<button class="bg-brand-700">…</button>                 <!-- bestaat niet; gebruik brand-500/600 -->
<p class="text-black">…</p>                              <!-- gebruik text-primary #1E2133 -->
<input class="bg-slate-100">                             <!-- koud/blauw; zoekbalk = surface-raised #F8F8FA -->
```

---

## 12. Beslis-cheatsheet voor de LLM

- Accent/primaire knop? → `brand-500`, hover `brand-600`, `duration-200`.
- Donkere/neutrale knop? → `text-primary` `#1E2133`, hover `#2D3047` + `shadow-button`, tekst wit.
- Zacht oranje vlak / icon-bg? → `brand-100` `#FFF0E8`.
- Ghost list/nav hover? → fill `brand-100` (of `surface-raised`), tekst → `brand-500`.
- Verhoogde card? → `shadow-card`, hover `-translate-y-0.5`, `duration-300`.
- Dropdown/menu? → `shadow-dropdown`. Modal? → backdrop `rgba(0,0,0,.5)`+blur, `shadow-modal`, radius `16px`.
- Tekst? → `text-primary` primair, `text-secondary` secundair. **Nooit** zwart of Slate.
- Tekst op donkere sectie? → wit `.7` / `.4`, geen grijze hex.
- Status-badge? → §4. Conditie-badge? → §5.
- Verleid tot donkerder oranje, zwart, Slate-neutraal, harde schaduw of willekeurige timing? → **niet doen.** Gebruik de tokens hierboven.

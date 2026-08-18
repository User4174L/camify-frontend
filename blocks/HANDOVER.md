# Handover — block library → APP-Frontend-V2 / APP-Backend-V2

Live: https://camify-frontend.vercel.app/blocks (pin 4174) · example page: /blocks/voorbeeld
Source: `camify-frontend/camify-next/blocks/` (this folder). Written against V2 as of 2026-08-18.

## 0. What maps to what

| In this folder | In V2 | Note |
|---|---|---|
| `blocks/<name>/slot-<name>.tsx` → `<Name>View` | `components/ui/slots/blocks/slot-<name>.tsx` → `<Name>View` (pure) | Our renderer **is** the pure View. The `Slot<Name>` wrapper (state, preset pointer, docked editor portal) is the ~60-line stamp from `slot-tiles.tsx`; see §3. |
| `blocks/<name>/registry.ts` | entry in `components/ui/slots/engine/component-type-registry.tsx` | Same field shape (`SlotFieldSchema`). Drop `extends`/`maxPerPage`/`allowedGroups`/`defaultData` (those live in the backend), keep `label`/`category`/`defaultContent`/`fields`, add `maxPerSlot`. |
| `blocks/<name>/types.ts` | `types/storefront-component.ts` | Add to the `StorefrontComponentType` union + the per-type content map. |
| `blocks/<name>/example.json` | body for `POST /api/v1/admin/storefront/publish/` | Smoke test after wiring; also the spec our landing-CLI applies. |
| `_shared/section.tsx` `Section`/`Container` | `components/ui/container.tsx` + **new** `Section` wrapper | One-time, see §2. |
| `_shared/markdown.tsx` `Markdown` | `components/ui/markdown/markdown-renderer.tsx` `MarkdownRenderer` | Replace import. |
| `_shared/product-card.tsx` `ProductCard`/`SectionHeader` | `home-product-card.tsx` `HomeProductCard` / `home-section-header.tsx` | Replace import; ours is a trimmed copy. |
| `_shared/breadcrumb-chrome.tsx` | `components/ui/breadcrumb-nav.tsx` `BreadcrumbNav` | Not a block: render on landing/information pages above the first block, like catalog pages already do. |
| `cn` from `@/lib/utils` | same | — |
| tokens (`.v2` scope in `styles/v2-tokens.css`) | `styles/tokens.css` | Identical values; the scope is only for the reference site. |

Where a View uses `next/link` `Link` with `href` we did not add `externalLinkProps(href)`; add it as in `trade-in-hero.tsx`.

## 1. Touchpoints per NEW schema block (the stamp)

Backend (APP-Backend-V2)
1. `storefront/models/component_content.py` — `ComponentType` entry (+ `makemigrations`: choices AlterField).
2. `storefront/page_groups.py` — add to the family sets used by the allow-lists (`_EDITORIAL_TYPES` for media_text, `_MERCH_TYPES` for cta_band/product_grid); `COMPONENT_MULTIPLICITY` only if capped (none of ours are).
3. optional: `storefront/component_schemas.py` serializer (validation is non-stripping; unregistered types stay opaque). Concept serializers in §4.

Frontend (APP-Frontend-V2)
4. `types/storefront-component.ts` — union member + `<Name>Content` type + map entry.
5. `components/ui/slots/engine/component-type-registry.tsx` — registry entry (from `registry.ts`).
6. `components/ui/slots/blocks/slot-<name>.tsx` — `<Name>View` (ours) + `Slot<Name>` wrapper (stamp).
7. `lib/storefront-utils.ts` — `extract<Name>FromComponents(components, role)`.
8. `components/ui/slots/blocks/freeform-slot.client.tsx` — `<name>Handler()` + add to `contentBlockHandlers()` (content blocks) or to the merch handler list. Because landing/about/etc. spread `contentBlockHandlers()`, a content block needs **no per-page registration**.
9. `components/ui/slots/previews/preset-preview-registry.tsx` — sample content + `(preset) => <NameView …/>` for the picker gallery.
10. tests (`tests/unit/component-type-registry.test.tsx`, `freeform-slot.test.tsx`, `preset-preview-registry.test.tsx` already iterate over types).

For an EXTENSION of an existing block (banner, product_rail) only: new `data` keys in the type, the registry/preset-editor schema fields, and a branch in the existing renderer. No enum, no migration.

## 2. Section wrapper (one-time, all blocks)

`data.section = { background?, width?, padding?, anchor_id? }` (see `_shared/section.tsx`).
Wire it once where a freeform block's `element` is rendered (the definition renderer in `freeform-slot.client.tsx` / `useFreeformDefinitions`), wrapping `element` in `<Section section={data.section}>`. Append `SECTION_FIELDS` (from `_shared/registry-types.ts`) to each block's registry `fields`, or render them as a shared "Section" group in `SchemaPresetContentEditor` so no per-block change is needed. Keys are dotted (`section.background`) — if the schema editor cannot write nested keys, flatten to `section_background` etc.; the View only reads `data.section`.
Banner uses `bleed` (no container); the compact banner drops the hero's `mb-12` — spacing comes from the section padding.

## 3. Snippets — `cta_band` fully worked out (media_text is the same stamp with its own registry.ts / types.ts)

### 3.1 backend — `component_content.py`
```py
    CTA_BAND = "cta_band", _("CTA band")
    MEDIA_TEXT = "media_text", _("Media + text")
    PRODUCT_GRID = "product_grid", _("Product grid")
```
### 3.2 backend — `page_groups.py`
```py
_EDITORIAL_TYPES = frozenset({..., ComponentType.MEDIA_TEXT})
_MERCH_TYPES = frozenset({..., ComponentType.CTA_BAND, ComponentType.PRODUCT_GRID})
```
(cta_band on every group like the editorial blocks: put it in `_EDITORIAL_TYPES` instead if you prefer it on Information pages too — we want it there.)

### 3.3 frontend — `types/storefront-component.ts`
```ts
  | "cta_band" | "media_text" | "product_grid"

export type CtaBandContent = {
  title?: string; subtitle?: string;
  primary_label?: string; primary_href?: string;
  secondary_label?: string; secondary_href?: string;
};
export type CtaBandData = {
  variant?: "brand" | "inverse" | "light";
  align?: "left" | "center";
  compact?: boolean;
  role?: string; preset_id?: number;
  section?: SectionSettings;
};
// map entry: cta_band: CtaBandContent;
// plus (once): export type SectionSettings = { background?: "none"|"raised"|"muted"|"brand"|"inverse"; width?: "full"|"container"; padding?: "none"|"sm"|"md"|"lg"; anchor_id?: string };
```
### 3.4 frontend — registry entry
Copy `fields` from `blocks/cta-band/registry.ts` verbatim; wrap as
```ts
  cta_band: {
    label: "CTA band",
    category: "marketing",
    defaultContent: { title: "", subtitle: "", primary_label: "", primary_href: "", secondary_label: "", secondary_href: "" },
    fields: [ /* … from registry.ts … */ ],
  },
```
Non-translatable fields need an explicit `translatable: false` in V2's `SlotFieldSchema`.

### 3.5 frontend — extractor (`lib/storefront-utils.ts`)
```ts
export function extractCtaBandFromComponents(
  components: StorefrontComponent[] | undefined,
  role?: string,
): { content: CtaBandContent; data: CtaBandData; componentId: number | null } {
  const comp = (components ?? []).find(
    (c) => c.type === "cta_band" && (role ? c.data?.role === role : !c.data?.role),
  );
  if (!comp) return { content: {}, data: {}, componentId: null };
  const c = comp.content as Record<string, unknown>;
  const d = (comp.data ?? {}) as Record<string, unknown>;
  const s = (k: string) => String(c[k] ?? "");
  return {
    content: {
      title: s("title"), subtitle: s("subtitle"),
      primary_label: s("primary_label"), primary_href: s("primary_href"),
      secondary_label: s("secondary_label"), secondary_href: s("secondary_href"),
    },
    data: {
      variant: (d.variant as CtaBandData["variant"]) ?? "brand",
      align: (d.align as CtaBandData["align"]) ?? "left",
      compact: Boolean(d.compact),
      section: d.section as SectionSettings | undefined,
    },
    componentId: comp.id,
  };
}
```
### 3.6 frontend — handler (`freeform-slot.client.tsx`), copy of `tilesHandler`
```tsx
export function ctaBandHandler(opts?: { role?: string; label?: string; description?: string; maxBlocks?: number }): FreeformTypeHandler {
  return {
    type: "cta_band",
    label: opts?.label ?? "CTA band",
    description: opts?.description,
    rolePrefix: opts?.role ?? "cta_band",
    maxBlocks: opts?.maxBlocks ?? typeMaxPerSlot("cta_band"),
    editPreset: (props) => <SchemaPresetContentEditor type="cta_band" {...props} />,
    buildBlock: (ctx, role, preset) => {
      const { content, data, componentId } = extractCtaBandFromComponents(ctx.overlaid, role);
      const active = preset.activePreset;
      const usingPreset = active != null && active.is_default !== true;
      return {
        componentId,
        hasContent: usingPreset || Boolean(content.title || content.primary_label),
        seed: { data, content },
        element: (
          <SlotCtaBand
            savedContent={content} savedData={data}
            componentId={componentId} target={ctx.target} locale={ctx.locale} routeTag={ctx.routeTag}
            role={role} slotId={ctx.slotId}
            activePreset={active} onSelectPreset={preset.onSelectPreset} onChanged={preset.onChanged}
            renderPresetEditor={(p, c) => (
              <SchemaPresetContentEditor type="cta_band" preset={p} onSaved={c.onSaved} onCancel={c.onCancel} registerSave={c.registerSave} />
            )}
          />
        ),
      };
    },
  };
}
// contentBlockHandlers(): add ctaBandHandler(), mediaTextHandler()
```
### 3.7 frontend — `Slot<Name>` wrapper (stamp from `slot-tiles.tsx`)
```tsx
export function SlotCtaBand({ savedContent, savedData, role, slotId, inspectorId, componentId: initialComponentId = null, locale, activePreset, onSelectPreset, onChanged, renderPresetEditor }: SlotCtaBandProps) {
  const inspector = useDockedModalEditor({ slotId, role, layoutId: inspectorId, type: "cta_band", componentId: initialComponentId, locale });
  const usingPreset = activePreset != null && !activePreset.is_default;
  const preset = (activePreset ?? {}) as Record<string, unknown>;
  const content = usingPreset ? (preset as CtaBandContent) : savedContent;
  const data = usingPreset ? { ...savedData, ...((preset.data as CtaBandData) ?? {}) } : savedData;
  return (
    <>
      <CtaBandView content={content} data={data} />
      {inspector.portalTarget && onSelectPreset && renderPresetEditor
        ? createPortal(
            <StructuredPresetEditor key={inspector.revertNonce} type="cta_band" label="CTA band presets"
              activePresetId={usingPreset ? activePreset.id : null} onSelect={onSelectPreset} onChanged={onChanged}
              onClose={inspector.onClose} onRevert={inspector.onRevert}
              defaultContent={{ title: "", subtitle: "", primary_label: "", primary_href: "" }} renderEditor={renderPresetEditor} />,
            inspector.portalTarget)
        : null}
    </>
  );
}
```
### 3.8 frontend — preview registry
```tsx
// sample content
cta_band: { title: "Have gear you no longer use?", subtitle: "Get a quote in 2 minutes.", primary_label: "Get a quote", primary_href: "/sell" },
// renderer
cta_band: (preset) => { const c = contentOrSeed(preset, "cta_band", (x) => !str(x.title) && !str(x.primary_label)); return <CtaBandView content={c as CtaBandContent} data={{ variant: "brand" }} />; },
```

## 4. Concept serializers (`component_schemas.py`, optional)
```py
class CtaBandContentSerializer(serializers.Serializer):
    title = serializers.CharField(required=False, allow_blank=True, max_length=200)
    subtitle = serializers.CharField(required=False, allow_blank=True, max_length=400)
    primary_label = serializers.CharField(required=False, allow_blank=True, max_length=80)
    primary_href = LinkField()
    secondary_label = serializers.CharField(required=False, allow_blank=True, max_length=80)
    secondary_href = LinkField()

class SectionSerializer(serializers.Serializer):
    background = serializers.ChoiceField(choices=["none", "raised", "muted", "brand", "inverse"], required=False)
    width = serializers.ChoiceField(choices=["full", "container"], required=False)
    padding = serializers.ChoiceField(choices=["none", "sm", "md", "lg"], required=False)
    anchor_id = serializers.RegexField(r"^[a-z0-9-]{0,64}$", required=False, allow_blank=True)

class CtaBandDataSerializer(CommonComponentDataSerializer):
    variant = serializers.ChoiceField(choices=["brand", "inverse", "light"], required=False)
    align = serializers.ChoiceField(choices=["left", "center"], required=False)
    compact = serializers.BooleanField(required=False)
    section = SectionSerializer(required=False)
```
`media_text`: content title/eyebrow/body(markdown, max 4000)/cta_label/cta_href(LinkField)/image_alt; data image_url(LinkField or your image ref), media_side/ratio/media_style/heading_level/align choices, section.
`product_grid`: data categories (ListField of IntegerField), brands (ListField of CharField), count (IntegerField 4–24), columns (3|4), filters (list of {categories?, product_type?}), viewAllHref (LinkField), heading_level; content title/titleAccent/subtitle/viewAllLabel/filterLabels (ListField).

## 5. Extensions

**banner** (`trade-in-hero.tsx`, `BannerPreset` serializer + `types`, preset editor schema): new `data` keys `layout: "hero"|"compact"` (default hero), `heading_level: "h1"|"h2"|"none"` (default h1), `show_icon: bool` (default true), `text_align: "left"|"center"` (default left). Renderer branch: see `blocks/banner/slot-banner.tsx` (`compact` = `min-h-[200px] md:min-h-[220px]`, `max-w-2xl py-7`, no icon, accent inline, no `mb-12`; heading tag from `heading_level`; gradient overlay stays right-anchored `md:w-[62%]`).

**product_rail** (`home-product-rail.tsx`): `data.display: "grid"|"carousel"` (default grid), `data.visible: 4|5|6`. Carousel markup: `blocks/product-carousel/slot-product-carousel.client.tsx` (scroll-snap track, arrows in the header next to "View all"). Same `HomeProductCard`, same header, same source.

**product_grid** data source: `catalog/categories/<id>/products/` already accepts `brands=` and `product_type=`; the grid unions the configured `categories` (phase 1) and each filter button re-queries with its own categories or `product_type` within the grid scope. `count` max 24 = category `PAGE_SIZE`.

## 6. Ground rules we propose
schema blocks only (no bespoke editors) · add fields, never rename · preset/field on an existing block before a new block · every block picks its heading level · breadcrumb is page chrome, not a block.

'use client';

/** Wizard scherm 1 — Wat verkoop je? Zoekbalk → kaart met conditie + shuttercount → item toevoegen. */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import VersionSwitch from '@/components/trade-in/VersionSwitch';
import ShutterHelp from '@/components/trade-in/ShutterHelp';
import { SELL_PRODUCTS, SHUTTER_RANGES, OPERATION_HOURS_RANGES } from '@/data/trade-in-mock';
import {
  useWizardState, WizardBanner, Page, PageTitle, StickyBar, Thumb, IconBtn,
  CONDITIONS, C, input, card, btnGhost, btnCta, base, hasBid, wearLine, scrollIntoViewSoon, centerOnFocus, useIsMobile, SearchSheet, type SellItem, type Variant,
} from './shared';

const DEFAULT_SHUTTER = SHUTTER_RANGES[0].label;          // "Tot 25.000"
const DEFAULT_HOURS = OPERATION_HOURS_RANGES[0].label;   // "Tot 500 uur"

/** Camera's tellen sluiterkliks, cinema-camera's draaiuren — zelfde plek in de flow. */
function wearFor(category?: string) {
  if (category === 'cinema') {
    return { ranges: OPERATION_HOURS_RANGES, title: 'Draaiuren', hint: 'Staat in het menu van je camera onder "operation hours".', fallback: 'max. 500 uur' };
  }
  return { ranges: SHUTTER_RANGES, title: 'Shuttercount', hint: 'Weet je ’m niet? Laat "Tot 25.000" staan.', fallback: 'max. 25.000' };
}

export default function SellScreen({ variant }: { variant: Variant }) {
  const router = useRouter();
  const [state, update, ready] = useWizardState(variant);
  const { items } = state;

  const [editId, setEditId] = useState<number | null>(null);
  const [q, setQ] = useState('');
  const [picked, setPicked] = useState<{ name: string; category: string } | null>(null);
  const [condition, setCondition] = useState('');
  const [shutter, setShutter] = useState<string | undefined>(undefined);
  const [showHelp, setShowHelp] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [shutterHelp, setShutterHelp] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false); // na eerste item: zoekbalk pas na '+ Nog een product'
  const [sheet, setSheet] = useState(false);
  const isMobile = useIsMobile();
  /** Na toevoegen springt de kaart weg; zonder dit blijf je op mobiel onderaan een leeg scherm staan. */
  const listRef = useRef<HTMLDivElement>(null);
  /** Na de eerste conditiekeuze de vervolgvraag in beeld brengen; die staat op
   *  mobiel onder de vouw en wordt anders overgeslagen. */
  const wearRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready || !state.editingId) return;
    const it = state.items.find(i => i.id === state.editingId);
    if (it) { setEditId(it.id); setPicked({ name: it.name, category: it.category }); setCondition(it.condition); setShutter(it.shutter); }
    update({ editingId: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  /* Een gekozen product hoort op mobiel in het venster; anders zou het formulier
     nergens zichtbaar zijn (de kaart in de pagina is desktop-only). */
  useEffect(() => { if (isMobile && picked && !sheet) setSheet(true); }, [isMobile, picked, sheet]);

  /* Prefill vanaf bv. de shuttercount-check: /trade-in/v3?product=Nikon%20Z8 */
  useEffect(() => {
    if (!ready) return;
    const wanted = new URLSearchParams(window.location.search).get('product');
    if (!wanted || picked || state.items.some(i => i.name.toLowerCase() === wanted.toLowerCase())) return;
    const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9]/g, '');
    const exact = SELL_PRODUCTS.find(p => norm(p.name) === norm(wanted));
    if (exact) pick(exact);
    else { setQ(wanted); setShowResults(true); setSearchOpen(true); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const results = useMemo(() => {
    if (q.trim().length < 2) return [] as typeof SELL_PRODUCTS;
    const t = q.toLowerCase().split(/\s+/).filter(Boolean);
    return SELL_PRODUCTS.filter(p => t.every(w => p.name.toLowerCase().includes(w))).slice(0, 8);
  }, [q]);

  const pick = (p: { name: string; category: string }) => {
    setPicked(p); setQ(''); setShowResults(false); setCondition(''); setShowHelp(false);
    // op mobiel blijft het venster open: conditie en shuttercount horen bij dezelfde handeling
    setSheet(isMobile);
    setShutter(p.category === 'camera' ? DEFAULT_SHUTTER : p.category === 'cinema' ? DEFAULT_HOURS : undefined);
  };
  const reset = () => { setQ(''); setPicked(null); setCondition(''); setShutter(undefined); setShowHelp(false); setEditId(null); };
  const canAdd = !!picked && !!condition;
  const addItem = () => {
    if (!picked || !condition) return;
    const item: SellItem = { id: editId ?? Date.now(), name: picked.name, category: picked.category, condition, shutter };
    update(s => ({ ...s, items: editId ? s.items.map(i => (i.id === editId ? item : i)) : [...s.items, item] }));
    reset(); setSearchOpen(false); setSheet(false);
    scrollIntoViewSoon(listRef);
  };
  const removeItem = (id: number) => update(s => ({ ...s, items: s.items.filter(i => i.id !== id) }));
  const editItem = (it: SellItem) => { setEditId(it.id); setPicked({ name: it.name, category: it.category }); setCondition(it.condition); setShutter(it.shutter); setQ(''); if (isMobile) setSheet(true); else window.scrollTo({ top: 0, behavior: 'smooth' }); };
  /** Tijdens het zoeken staat de resultatenlijst open; de onderbalk zou eroverheen vallen. */
  const zoekActief = !picked && showResults && q.trim().length >= 2;
  const hasWear = picked?.category === 'camera' || picked?.category === 'cinema';
  const wear = wearFor(picked?.category);
  const visibleItems = items.filter(i => i.id !== editId);

  /** Alles wat je over één product invult. Op mobiel staat dit in het
   *  zoekvenster, op desktop als kaart in de pagina — zelfde inhoud. */
  const productForm = () => picked && (
    <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Thumb category={picked.category} name={picked.name} size={44} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>{picked.name}</div>
              </div>
              <button onClick={reset} className="tiw-textlink" style={{ background: 'none', border: 'none', color: C.sec, cursor: 'pointer', fontSize: 12.5, textDecoration: 'underline', fontFamily: 'inherit' }}>ander product</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '20px 0 8px' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Wat is de conditie?</span>
              <button onClick={() => setShowHelp(h => !h)} className="tiw-textlink" style={{ background: 'none', border: 'none', color: C.accent, fontSize: 12.5, fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', fontFamily: 'inherit' }}>Help me kiezen</button>
            </div>
            <div className="tiw-cond-grid">
              {CONDITIONS.map(c => {
                const sel = condition === c.label;
                return (
                  <button key={c.label} onClick={() => { const first = !condition; setCondition(c.label); if (first) scrollIntoViewSoon(wearRef); }} className="tiw-cond" style={{ borderColor: sel ? C.accent : C.border, background: sel ? C.accentSoft : '#fff', color: C.text, boxShadow: sel ? `inset 0 0 0 1px ${C.accent}` : 'none' }}>
                    <span style={{ fontWeight: 700 }}>{c.label}</span>
                    <span className="tiw-cond-short">{c.short}</span>
                  </button>
                );
              })}
            </div>
            {showHelp && (
              <div style={{ marginTop: 12, border: `1px solid ${C.border}`, borderRadius: 12, padding: '4px 16px', background: C.tint }}>
                {CONDITIONS.map((c, i) => (
                  <div key={c.label} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 12, padding: '10px 0', borderBottom: i < CONDITIONS.length - 1 ? `1px solid ${C.border}` : 'none', fontSize: 13, lineHeight: 1.55 }}>
                    <strong style={{ color: C.text }}>{c.label}{picked?.category === 'camera' && <span style={{ display: 'block', fontSize: 11.5, color: C.accent, fontWeight: 700 }}>{c.maxClicks}</span>}</strong>
                    <span style={{ color: C.sec }}>{c.criteria}</span>
                  </div>
                ))}
                <div style={{ fontSize: 12, color: C.sec, padding: '10px 0 8px' }}>Twijfel je? Kies de lagere conditie — bij ontvangst beoordelen we eerlijk en {hasBid(variant) ? 'passen we het bod zo nodig omhoog aan' : 'valt het bod zo nodig hoger uit'}.</div>
              </div>
            )}

            {hasWear && (
              <div ref={wearRef} style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{wear.title}</span>
                  <span style={{ fontSize: 12.5, color: C.sec }}>{wear.hint}</span>
                  {picked?.category === 'camera' && (
                    <button onClick={() => setShutterHelp(true)} className="tiw-textlink" style={{ background: 'none', border: 'none', fontSize: 12.5, color: C.accent, fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', fontFamily: 'inherit', marginLeft: 'auto' }}>Hoe vind ik dit?</button>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {wear.ranges.map(r => {
                    const sel = shutter === r.label;
                    return <button key={r.label} onClick={() => setShutter(r.label)} style={{ border: `1.5px solid ${sel ? C.accent : C.border}`, background: sel ? C.accentSoft : '#fff', color: C.text, borderRadius: 999, padding: '9px 16px', fontSize: 13, fontWeight: sel ? 700 : 600, cursor: 'pointer', fontFamily: 'inherit', boxShadow: sel ? `inset 0 0 0 1px ${C.accent}` : 'none' }}>{r.label}</button>;
                  })}
                </div>
              </div>
            )}

    </>
  );

  /** Zelfde lijst in het venster (mobiel) en in de dropdown (desktop). */
  const resultaten = () => (
    results.length ? results.map((p, i) => (
      <div key={p.name} onMouseDown={() => pick(p)} className="tiw-row" style={{ borderBottom: i < results.length - 1 ? `1px solid ${C.border}` : 'none' }}>
        <Thumb category={p.category} name={p.name} size={40} />
        <span style={{ flex: 1, fontWeight: 600, fontSize: 14.5, color: C.text }}>{p.name}</span>
      </div>
    )) : q.trim().length >= 2 ? (
      <div style={{ padding: 16, fontSize: 13.5, color: C.sec }}>
        Niet gevonden. <button onMouseDown={() => pick({ name: q.trim(), category: 'camera' })} style={{ background: 'none', border: 'none', color: C.accent, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>“{q.trim()}” toch toevoegen</button> — we beoordelen het handmatig.
      </div>
    ) : null
  );

  return (
    <>
      <VersionSwitch active={variant} />
      <WizardBanner variant={variant} step={1} />
      <ShutterHelp open={shutterHelp} onClose={() => setShutterHelp(false)} />

      <Page>
        <PageTitle
          title="Wat verkoop je?"
          sub={hasBid(variant)
            ? 'Zoek je product en kies de conditie. Hoe preciezer, hoe scherper het bod.'
            : 'Zoek je product en kies de conditie. Onze experts bepalen daarna je persoonlijke bod.'}
        />

        {/* Toegevoegde items */}
        <div ref={listRef}>
        {visibleItems.map(it => (
          <div key={it.id} style={{ ...card, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', marginBottom: 10 }}>
            <Thumb category={it.category} name={it.name} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{it.name}</div>
              <div style={{ fontSize: 13.5, color: C.sec, marginTop: 2 }}>
                Conditie: <strong style={{ color: C.text }}>{it.condition}</strong>
                {wearLine(it)}
              </div>
            </div>
            <IconBtn kind="edit" title="Wijzigen" onClick={() => editItem(it)} />
            <IconBtn kind="trash" title="Verwijderen" onClick={() => removeItem(it.id)} />
          </div>
        ))}

        {/* Grote zoekbalk — altijd zichtbaar zolang er geen product gekozen is */}
        {!picked && visibleItems.length > 0 && !searchOpen && (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '18px 0 0' }}>
            <button onClick={() => setSearchOpen(true)} className="tiw-add" style={btnGhost}><span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Nog een product toevoegen</button>
          </div>
        )}
        </div>
        {/* Resultaten: op mobiel in een schermvullend venster, op desktop als lijst onder het veld */}
        {!picked && (visibleItems.length === 0 || searchOpen) && (
          isMobile ? (
            <>
              <button onClick={() => setSheet(true)} className="tiw-fakefield" style={{ margin: visibleItems.length ? '14px 0 0' : 0 }}>
                <span>Zoek je product…</span>
                <span className="tiw-fakefield-ico">
                  <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                </span>
              </button>
            </>
          ) : (
          <div style={{ position: 'relative', margin: visibleItems.length ? '14px 0 0' : 0 }}>
            <input
              autoFocus
              value={q}
              onChange={e => { setQ(e.target.value); setShowResults(true); }}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 180)}
              placeholder="Zoek je product…"
              autoComplete="off"
              style={{ ...input, borderRadius: 999, padding: '18px 60px 18px 24px', fontSize: 16 }}
            />
            <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 42, height: 42, borderRadius: '50%', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            </div>
            {showResults && q.trim().length >= 2 && (
              <div className="tiw-results" style={{ position: 'absolute', left: 8, right: 8, top: 'calc(100% + 8px)', zIndex: 20, background: '#fff', borderRadius: 14, boxShadow: '0 12px 32px rgba(45,48,71,.16)', overflowY: 'auto' }}>
                {resultaten()}
              </div>
            )}
          </div>
          )
        )}

        {/* Gekozen product: op desktop als kaart, op mobiel in het zoekvenster */}
        {picked && !isMobile && (
          <div style={{ ...card, padding: 22, marginTop: visibleItems.length ? 14 : 0, marginBottom: 12, border: `1.5px solid ${C.accent}` }}>
            {productForm()}
          </div>
        )}
      </Page>

      {/* Het venster staat los van het zoekblok: het blijft open terwijl je
          conditie en shuttercount invult, en sluit pas als het item erin staat. */}
      {sheet && (
        <SearchSheet
          title={picked ? (editId ? 'Item wijzigen' : 'Product toevoegen') : 'Wat verkoop je?'}
          onClose={() => { setSheet(false); reset(); }}
          footer={picked ? (
            <button disabled={!canAdd} onClick={addItem} style={{ ...btnCta, width: '100%', justifyContent: 'center', padding: '15px 20px', opacity: canAdd ? 1 : 0.45, cursor: canAdd ? 'pointer' : 'default' }}>
              {editId ? 'Wijziging opslaan' : 'Voeg dit item toe +'}
            </button>
          ) : undefined}
        >
          {picked ? productForm() : (
            <>
              <input
                autoFocus
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Zoek je product…"
                autoComplete="off"
                style={{ ...input, borderRadius: 999, padding: '16px 22px', fontSize: 16 }}
              />
              <div style={{ marginTop: 14 }}>{resultaten()}</div>
            </>
          )}
        </SearchSheet>
      )}

      {/* Eén knop onderin die meeloopt met wat je nu moet doen: eerst het item
          afronden, daarna pas de volgende stap. Anders staat "Voeg dit item toe"
          op mobiel onder de vouw terwijl "Verder" grijs is, en weet niemand wat te doen. */}
      {zoekActief || (isMobile && sheet) ? null : picked && !isMobile ? (
        <StickyBar
          add={!editId}
          note={!condition
            ? 'Kies hierboven de conditie.'
            : hasWear
              ? <>Klopt de {wear.title.toLowerCase()}? Dan kun je dit item toevoegen.</>
              : <>Klaar — voeg dit item toe aan je aanvraag.</>}
          cta={editId ? 'Wijziging opslaan' : 'Voeg dit item toe'}
          disabled={!canAdd}
          onClick={addItem}
          secondary={visibleItems.length > 0 || editId ? (
            <button onClick={reset} style={{ background: 'none', border: 'none', padding: 0, fontSize: 13.5, color: C.sec, textDecoration: 'underline', cursor: 'pointer', fontFamily: 'inherit' }}>
              Annuleren
            </button>
          ) : undefined}
        />
      ) : (
        <StickyBar
          note={items.length
            ? <><strong style={{ color: C.text }}>{items.length} item{items.length > 1 ? 's' : ''}</strong> — geen verkoopkosten, gratis verzekerd verzenden.</>
            : 'Voeg minimaal één item toe om verder te gaan.'}
          cta="Verder"
          disabled={!items.length}
          onClick={() => router.push(`${base(variant)}/kopen`)}
        />
      )}

      <style>{`
        /* Zonder maximum liep de resultatenlijst honderden pixels buiten beeld. */
        .tiw-results{max-height:min(46vh,320px)}
        @media(max-width:760px){.tiw-results{max-height:min(52vh,300px)}}
        /* Raakvlak van tekstlinks: 19px is te klein om betrouwbaar te tikken. */
        .tiw-textlink{display:inline-flex;align-items:center;min-height:36px;padding:0 2px}
        .tiw-fakefield{display:flex;align-items:center;justify-content:space-between;width:100%;border:1.5px solid ${'#EEEEF2'};border-radius:999px;background:#fff;padding:12px 8px 12px 24px;font-family:inherit;font-size:16px;color:#6B6D80;cursor:pointer;text-align:left}
        .tiw-fakefield-ico{display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:50%;background:#E8692A;flex-shrink:0}
        .tiw-row{display:flex;align-items:center;gap:12px;padding:13px 16px;cursor:pointer}
        .tiw-row:hover{background:#FFFBF7}
        .tiw-cond-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
        .tiw-cond{border:1.5px solid #EEEEF2;border-radius:12px;padding:14px 8px;font-size:14px;cursor:pointer;font-family:inherit;transition:all .15s;text-align:center;line-height:1.2}
        .tiw-cond:hover{border-color:#E8692A}
        /* Desktop: vijf kolommen, label is genoeg. De omschrijving staat in "Help me kiezen". */
        .tiw-cond-short{display:none}
        /* Mobiel: één kolom met de omschrijving erbij. Vijf knoppen in twee kolommen
           breekt de lange labels en laat de vijfde alleen staan; een dropdown (zoals MPB)
           verbergt juist de belangrijkste vraag van het scherm. */
        @media(max-width:760px){
          .tiw-cond-grid{grid-template-columns:1fr;gap:6px}
          .tiw-cond{display:flex;flex-direction:column;align-items:flex-start;gap:2px;text-align:left;padding:12px 14px}
          .tiw-cond-short{display:block;font-size:12.5px;color:#6B6D80;font-weight:500}
        }
      `}</style>
    </>
  );
}

'use client';

/** Wizard scherm 2 — Wil je er iets voor terug? Optionele koopstap uit onze eigen voorraad. */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import VersionSwitch from '@/components/trade-in/VersionSwitch';
import { BUY_PRODUCTS, type BuyProduct, type BuyVariant } from '@/data/trade-in-mock';
import {
  useWizardState, WizardBanner, Page, PageTitle, StickyBar, BackLink, IconBtn,
  C, input, card, btnGhost, fmt, base, hasBid, Thumb, scrollIntoViewSoon, useIsMobile, SearchSheet, type Variant,
} from './shared';

export default function BuyScreen({ variant }: { variant: Variant }) {
  const router = useRouter();
  const [state, update, ready] = useWizardState(variant);
  const { items, picks } = state;
  const [q, setQ] = useState('');
  /** Aangeklikt product: dan tonen we alléén de varianten daarvan, niet de hele resultatenlijst. */
  const [openId, setOpenId] = useState<string | null>(null);
  /** Net als in stap 1: zodra er iets gekozen is verschijnt eerst een knop, niet meteen het zoekveld. */
  const [searchOpen, setSearchOpen] = useState(false);
  const [sheet, setSheet] = useState(false);
  const isMobile = useIsMobile();
  /** Na "Ja" moet de zoeker in beeld springen; anders opent hij ongemerkt onder de vouw. */
  const searchRef = useRef<HTMLDivElement>(null);
  /** Na het toevoegen richten we op de knop "Nog een product toevoegen": dan
   *  staat je keuze er nét boven en zie je meteen hoe je verder kunt. */
  const picksRef = useRef<HTMLDivElement>(null);
  /** null = nog niets gekozen, true = wil kopen, false = alleen verkopen */
  const [wants, setWants] = useState<boolean | null>(null);

  useEffect(() => { if (ready && items.length === 0) router.replace(base(variant)); }, [ready, items.length, router, variant]);
  useEffect(() => {
    if (!ready) return;
    if (picks.length) setWants(true);
    else if (state.buySkipped) setWants(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const results = useMemo(() => {
    if (q.trim().length < 2) return [] as BuyProduct[];
    const t = q.toLowerCase().split(/\s+/).filter(Boolean);
    return BUY_PRODUCTS.filter(p => t.every(w => (p.name + ' ' + p.category + ' ' + p.variants.map(v => v.sku).join(' ')).toLowerCase().includes(w))).slice(0, 8);
  }, [q]);

  const openProduct = openId ? BUY_PRODUCTS.find(p => p.id === openId) ?? null : null;
  /** Variant kiezen = meteen toevoegen en de zoeker sluiten — geen open dropdown met meervoudige selectie. */
  const addPick = (p: BuyProduct, v: BuyVariant) => {
    update(s => (s.picks.some(x => x.id === v.id) ? s : { ...s, picks: [...s.picks, { ...v, name: p.name, productId: p.id }] }));
    setOpenId(null); setQ(''); setSearchOpen(false); setSheet(false);
    scrollIntoViewSoon(picksRef);
  };
  const buyTotal = picks.reduce((s, p) => s + p.price, 0);

  const choose = (yes: boolean) => {
    setWants(yes);
    update(s => ({ ...s, buySkipped: !yes, picks: yes ? s.picks : [] }));
    if (!yes) { setQ(''); setOpenId(null); setSearchOpen(false); setSheet(false); return; }
    scrollIntoViewSoon(searchRef);
  };

  /** Zoekresultaten: zelfde lijst in het mobiele venster en in de kaart op desktop. */
  const resultaten = () => (
    results.length ? results.map((p, i) => {
      const prices = p.variants.map(v => v.price);
      return (
        <div key={p.id} onClick={() => setOpenId(p.id)} className="tiw-hit" style={{ borderBottom: i < results.length - 1 ? `1px solid ${C.border}` : 'none' }}>
          <Thumb category={p.category.toLowerCase().includes('lenzen') ? 'lens' : 'camera'} name={p.name} size={40} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{p.name}</div>
            <div style={{ fontSize: 12, color: C.sec }}>{p.category}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: C.sec }}>{p.variants.length} op voorraad</div>
            <div style={{ fontWeight: 700, fontSize: 14.5, color: C.text }}>{fmt(Math.min(...prices))}{prices.length > 1 ? ` – ${fmt(Math.max(...prices))}` : ''}</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.sec} strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg>
        </div>
      );
    }) : <div style={{ padding: 14, fontSize: 13.5, color: C.sec }}>Niets gevonden in onze voorraad.</div>
  );

  /** Varianten van het gekozen product — ook gedeeld tussen venster en kaart. */
  const varianten = () => openProduct && (
    <>
      <div style={{ marginBottom: 4 }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>{openProduct.name}</div>
        <div style={{ fontSize: 13, color: C.sec, marginTop: 2 }}>
          {openProduct.variants.length} exemplaar{openProduct.variants.length > 1 ? 'en' : ''} op voorraad — kies er één om toe te voegen.
        </div>
      </div>
      {openProduct.variants.map(v => {
        const chosen = picks.some(x => x.id === v.id);
        return (
          <div key={v.id} onClick={() => !chosen && addPick(openProduct, v)} className={chosen ? 'tiw-var is-chosen' : 'tiw-var'}>
            <Thumb category={openProduct.category.toLowerCase().includes('lenzen') ? 'lens' : 'camera'} name={openProduct.name} size={40} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, color: C.text }}><strong>{v.condition}</strong> <span style={{ color: C.sec }}>· SKU {v.sku}{v.shutterCount !== undefined ? ` · ${v.shutterCount.toLocaleString('nl-NL')} clicks` : ''}</span></div>
              <div style={{ fontSize: 12, color: C.sec, marginTop: 3 }}>Incl. {v.accessories.join(', ')}</div>
            </div>
            <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>{fmt(v.price)}</div>
            <span className="tiw-var-cta">{chosen ? 'Toegevoegd ✓' : 'Kies deze'}</span>
          </div>
        );
      })}
    </>
  );

  return (
    <>
      <VersionSwitch active={variant} />
      <WizardBanner variant={variant} step={2} back={base(variant)} />

      <Page>
        <BackLink href={base(variant)} label="Terug naar je items" />
        {/* Alleen de vraag; de twee kaarten zeggen de rest. */}
        <PageTitle title={picks.length ? 'Wat je meeneemt' : 'Wil je er iets voor terug?'} />

        {/* Keuze — verdwijnt zodra er iets gekozen is: de vraag is dan beantwoord
            en de ruimte hoort bij je lijst en de knop om nog iets toe te voegen. */}
        {picks.length === 0 && (
        <div className={wants === true ? 'tiw-choice tiw-choice--single' : 'tiw-choice'}>
          <button onClick={() => choose(true)} className={`tiw-choice-btn tiw-choice-btn--yes${wants === true ? ' is-on' : ''}`}>
            <span className="tiw-choice-ico">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18M16 10a4 4 0 0 1-8 0" /></svg>
            </span>
            <span className="tiw-choice-text">
              <strong>Ja, kies iets uit onze voorraad</strong>
            </span>
            <span className="tiw-choice-check" aria-hidden="true">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </span>
          </button>
          {wants !== true && (
          <button onClick={() => choose(false)} className={`tiw-choice-btn tiw-choice-btn--no${wants === false ? ' is-on' : ''}`}>
            <span className="tiw-choice-ico">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            </span>
            <span className="tiw-choice-text">
              <strong>Nee, ik wil alleen verkopen</strong>
            </span>
            <span className="tiw-choice-check" aria-hidden="true">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </span>
          </button>
          )}
        </div>
        )}

        {/* Gekozen items */}
        {wants && picks.length > 0 && (
          <div style={{ marginTop: 4 }}>
            {picks.map(p => (
              <div key={p.id} style={{ ...card, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', marginBottom: 10 }}>
                <Thumb category="camera" name={p.name} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: C.sec, marginTop: 2 }}>{p.condition} · SKU {p.sku}{p.shutterCount !== undefined ? ` · ${p.shutterCount.toLocaleString('nl-NL')} clicks` : ''} · incl. {p.accessories.join(', ')}</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: 18, color: C.text }}>{fmt(p.price)}</div>
                <IconBtn kind="trash" title="Verwijderen" onClick={() => update(s => ({ ...s, picks: s.picks.filter(x => x.id !== p.id) }))} />
              </div>
            ))}
          </div>
        )}

        {/* Na een eerste keuze eerst een knop — consistent met stap 1 */}
        {wants && picks.length > 0 && !searchOpen && !openProduct && (
          <div ref={picksRef} style={{ display: 'flex', justifyContent: 'center', margin: '18px 0 0' }}>
            <button onClick={() => setSearchOpen(true)} className="tiw-add" style={btnGhost}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Nog een product toevoegen
            </button>
          </div>
        )}

        {/* Voorraadzoeker: op mobiel schermvullend, op desktop in een kaart */}
        {wants && (picks.length === 0 || searchOpen || openProduct) && (
          isMobile ? (
            <>
              <button onClick={() => setSheet(true)} className="tiw-fakefield" style={{ marginTop: picks.length ? 4 : 14 }}>
                <span>Zoek op merk, model of SKU…</span>
                <span className="tiw-fakefield-ico">
                  <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                </span>
              </button>
              {sheet && (
                <SearchSheet
                  title={openProduct ? openProduct.name : 'Zoek in onze voorraad'}
                  onClose={() => { setSheet(false); setOpenId(null); setQ(''); }}
                >
                  {openProduct ? (
                    <>
                      <button onClick={() => setOpenId(null)} style={{ background: 'none', border: 'none', padding: 0, fontSize: 13, color: C.sec, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 36 }}>← Andere resultaten</button>
                      {varianten()}
                    </>
                  ) : (
                    <>
                      <input
                        autoFocus
                        value={q}
                        onChange={e => setQ(e.target.value)}
                        placeholder="Zoek op merk, model of SKU…"
                        autoComplete="off"
                        style={{ ...input, borderRadius: 999, padding: '16px 22px' }}
                      />
                      <div style={{ marginTop: 14 }}>{q.trim().length >= 2 && resultaten()}</div>
                    </>
                  )}
                </SearchSheet>
              )}
            </>
          ) : (
          <div ref={searchRef} style={{ ...card, padding: 18, marginTop: picks.length ? 4 : 14 }}>
            {!openProduct ? (
              <>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 10 }}>Zoek in onze voorraad</div>
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Zoek op merk, model of SKU…" autoComplete="off" style={input} />
                {q.trim().length >= 2 && (
                  <div style={{ marginTop: 10, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                    {resultaten()}
                  </div>
                )}
              </>
            ) : (
              <>
                <button onClick={() => { setOpenId(null); setSearchOpen(true); }} style={{ background: 'none', border: 'none', padding: 0, fontSize: 13, color: C.sec, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6 }}>← Andere resultaten</button>
                <div style={{ marginTop: 12 }}>{varianten()}</div>
              </>
            )}
          </div>
          )
        )}

        {wants === true && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
            <button onClick={() => choose(false)} style={{ background: 'none', border: 'none', padding: 0, fontSize: 13.5, color: C.sec, textDecoration: 'underline', cursor: 'pointer', fontFamily: 'inherit' }}>
              Toch alleen verkopen
            </button>
          </div>
        )}
      </Page>

      <StickyBar
        note={picks.length
          ? <><strong style={{ color: C.text }}>{picks.length} item{picks.length > 1 ? 's' : ''}</strong> gekozen — {fmt(buyTotal)} {hasBid(variant) ? 'wordt verrekend met je bod' : 'verrekenen we met het bod dat je krijgt'}.</>
          : wants === false ? 'Prima — je krijgt het bedrag op je rekening.'
            : wants ? 'Je kunt dit later ook nog toevoegen.'
            : 'Maak eerst je keuze hierboven.'}
        cta="Verder"
        disabled={wants === null}
        onClick={() => router.push(`${base(variant)}/gegevens`)}
      />

      <style>{`
        .tiw-choice{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        /* Zodra "ja" gekozen is verdwijnt de tweede kaart en komt de zoeker er direct
           onder — anders opent die op mobiel onder de vouw en zie je niet dat er iets
           gebeurt. Terugweg staat als tekstlink onderaan. */
        .tiw-choice--single{grid-template-columns:1fr}
        .tiw-choice-btn{position:relative;display:flex;align-items:flex-start;gap:15px;text-align:left;border:2px solid transparent;border-radius:16px;padding:20px;cursor:pointer;font-family:inherit;transition:transform .16s ease,box-shadow .16s ease,border-color .16s ease;overflow:hidden}
        .tiw-choice-btn:hover{transform:translateY(-2px)}
        .tiw-choice-text{display:block;min-width:0}
        .tiw-choice-btn strong{display:block;font-size:15.5px;font-weight:800;color:#1E2133;margin-bottom:4px;letter-spacing:-.01em}
        .tiw-choice-text span{display:block;font-size:13px;color:#6B6D80;line-height:1.5}
        .tiw-choice-ico{width:46px;height:46px;border-radius:13px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;color:#fff;transition:transform .16s ease}
        .tiw-choice-btn:hover .tiw-choice-ico{transform:scale(1.06)}
        .tiw-choice-check{position:absolute;top:14px;right:14px;width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:#fff;opacity:0;transform:scale(.6);transition:all .18s ease}
        .tiw-choice-btn.is-on .tiw-choice-check{opacity:1;transform:scale(1)}

        /* Ja = merkoranje */
        .tiw-choice-btn--yes{background:linear-gradient(140deg,#FFF6F1 0%,#FFEADD 100%);border-color:#F7D9C6}
        .tiw-choice-btn--yes .tiw-choice-ico{background:linear-gradient(140deg,#F2833F 0%,#E8692A 100%);box-shadow:0 5px 14px rgba(232,105,42,.32)}
        .tiw-choice-btn--yes:hover{box-shadow:0 10px 24px rgba(232,105,42,.18)}
        .tiw-choice-btn--yes.is-on{border-color:#E8692A;box-shadow:0 8px 22px rgba(232,105,42,.22)}
        .tiw-choice-btn--yes .tiw-choice-check{background:#E8692A}

        .tiw-fakefield{display:flex;align-items:center;justify-content:space-between;width:100%;border:1.5px solid #EEEEF2;border-radius:999px;background:#fff;padding:12px 8px 12px 24px;font-family:inherit;font-size:16px;color:#6B6D80;cursor:pointer;text-align:left}
        .tiw-fakefield-ico{display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:50%;background:#E8692A;flex-shrink:0}
        .tiw-hit{display:flex;align-items:center;gap:12px;padding:12px 14px;cursor:pointer;background:#fff;transition:background .12s}
        .tiw-hit:hover{background:#FFFBF7}
        .tiw-var{display:flex;align-items:center;gap:12px;padding:12px 14px;margin-top:8px;border-radius:12px;border:1.5px solid #EEEEF2;background:#fff;cursor:pointer;transition:border-color .15s,box-shadow .15s,transform .15s}
        .tiw-var:hover{border-color:#E8692A;box-shadow:0 5px 16px rgba(232,105,42,.14);transform:translateY(-1px)}
        .tiw-var-cta{flex-shrink:0;border-radius:999px;border:1.5px solid #E8692A;color:#E8692A;font-size:12.5px;font-weight:700;padding:7px 14px;white-space:nowrap}
        .tiw-var:hover .tiw-var-cta{background:#E8692A;color:#fff}
        .tiw-var.is-chosen{cursor:default;border-color:#22c55e;background:#F3FBF5;transform:none;box-shadow:none}
        .tiw-var.is-chosen .tiw-var-cta{border-color:#22c55e;color:#16A34A;background:transparent}

        /* Nee = rustig blauw, zodat het geen tweede CTA lijkt */
        .tiw-choice-btn--no{background:linear-gradient(140deg,#F5F7FD 0%,#E9EDF9 100%);border-color:#D9DFF0}
        .tiw-choice-btn--no .tiw-choice-ico{background:linear-gradient(140deg,#3D4468 0%,#252943 100%);box-shadow:0 5px 14px rgba(37,41,67,.26)}
        .tiw-choice-btn--no:hover{box-shadow:0 10px 24px rgba(37,41,67,.14)}
        .tiw-choice-btn--no.is-on{border-color:#252943;box-shadow:0 8px 22px rgba(37,41,67,.18)}
        .tiw-choice-btn--no .tiw-choice-check{background:#252943}

        @media(max-width:760px){
          /* Compacter, zodat beide opties zonder scrollen in beeld komen. */
          .tiw-choice{grid-template-columns:1fr;gap:8px}
          .tiw-choice-btn{padding:14px;gap:12px;border-radius:14px}
          .tiw-choice-btn strong{font-size:15px;margin-bottom:2px}
          .tiw-choice-text span{font-size:12.5px;line-height:1.4}
          .tiw-choice-ico{width:38px;height:38px;border-radius:11px}
          .tiw-choice-ico svg{width:19px;height:19px}
        }
      `}</style>
    </>
  );
}

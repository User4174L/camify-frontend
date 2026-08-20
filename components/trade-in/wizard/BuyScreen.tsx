'use client';

/** Wizard scherm 2 — Wil je er iets voor terug? Optionele koopstap uit onze eigen voorraad. */

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import VersionSwitch from '@/components/trade-in/VersionSwitch';
import { BUY_PRODUCTS, type BuyProduct, type BuyVariant } from '@/data/trade-in-mock';
import {
  useWizardState, WizardBanner, Page, PageTitle, StickyBar, BackLink, IconBtn,
  C, input, card, fmt, base, hasBid, type Variant,
} from './shared';

export default function BuyScreen({ variant }: { variant: Variant }) {
  const router = useRouter();
  const [state, update, ready] = useWizardState(variant);
  const { items, picks } = state;
  const [q, setQ] = useState('');
  /** Aangeklikt product: dan tonen we alléén de varianten daarvan, niet de hele resultatenlijst. */
  const [openId, setOpenId] = useState<string | null>(null);
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
    setOpenId(null); setQ('');
  };
  const buyTotal = picks.reduce((s, p) => s + p.price, 0);

  const choose = (yes: boolean) => {
    setWants(yes);
    update(s => ({ ...s, buySkipped: !yes, picks: yes ? s.picks : [] }));
    if (!yes) { setQ(''); setOpenId(null); }
  };

  return (
    <>
      <VersionSwitch active={variant} />
      <WizardBanner variant={variant} step={2} />

      <Page>
        <BackLink href={base(variant)} label="Terug naar je items" />
        <PageTitle
          title="Wil je er iets voor terug?"
          sub={hasBid(variant)
            ? 'Kies iets uit onze voorraad en we verrekenen het direct met je bod. Liever alleen verkopen? Ook prima.'
            : 'Kies iets uit onze voorraad en we verrekenen het met het bod dat je van ons krijgt. Liever alleen verkopen? Ook prima.'}
        />

        {/* Keuze */}
        <div className="tiw-choice">
          <button onClick={() => choose(true)} className={`tiw-choice-btn tiw-choice-btn--yes${wants === true ? ' is-on' : ''}`}>
            <span className="tiw-choice-ico">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18M16 10a4 4 0 0 1-8 0" /></svg>
            </span>
            <span className="tiw-choice-text">
              <strong>Ja, laat zien wat jullie hebben</strong>
              <span>Ruim 2.000 gecontroleerde tweedehands items, met garantie.</span>
            </span>
            <span className="tiw-choice-check" aria-hidden="true">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </span>
          </button>
          <button onClick={() => choose(false)} className={`tiw-choice-btn tiw-choice-btn--no${wants === false ? ' is-on' : ''}`}>
            <span className="tiw-choice-ico">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            </span>
            <span className="tiw-choice-text">
              <strong>Nee, ik wil alleen verkopen</strong>
              <span>Je krijgt het bedrag gewoon op je rekening.</span>
            </span>
            <span className="tiw-choice-check" aria-hidden="true">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </span>
          </button>
        </div>

        {/* Gekozen items */}
        {wants && picks.length > 0 && (
          <div style={{ marginTop: 26 }}>
            <div className="svc-eyebrow" style={{ margin: '0 0 12px' }}>Wat je meeneemt</div>
            {picks.map(p => (
              <div key={p.id} style={{ ...card, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', marginBottom: 10 }}>
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

        {/* Voorraadzoeker */}
        {wants && (
          <div style={{ ...card, padding: 18, marginTop: picks.length ? 4 : 26 }}>
            {!openProduct ? (
              <>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 10 }}>Zoek in onze voorraad</div>
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Zoek op merk, model of SKU…" autoComplete="off" style={input} />
                {q.trim().length >= 2 && (
                  <div style={{ marginTop: 10, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                    {results.length ? results.map((p, i) => {
                      const prices = p.variants.map(v => v.price);
                      return (
                        <div key={p.id} onClick={() => setOpenId(p.id)} className="tiw-hit" style={{ borderBottom: i < results.length - 1 ? `1px solid ${C.border}` : 'none' }}>
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
                    }) : <div style={{ padding: 14, fontSize: 13.5, color: C.sec }}>Niets gevonden in onze voorraad.</div>}
                  </div>
                )}
              </>
            ) : (
              /* Eén product gekozen → alleen de varianten daarvan */
              <>
                <button onClick={() => setOpenId(null)} style={{ background: 'none', border: 'none', padding: 0, fontSize: 13, color: C.sec, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6 }}>← Andere resultaten</button>
                <div style={{ marginTop: 12, marginBottom: 4 }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>{openProduct.name}</div>
                  <div style={{ fontSize: 13, color: C.sec, marginTop: 2 }}>
                    {openProduct.variants.length} exemplaar{openProduct.variants.length > 1 ? 'en' : ''} op voorraad — kies er één om toe te voegen.
                  </div>
                </div>
                {openProduct.variants.map(v => {
                  const chosen = picks.some(x => x.id === v.id);
                  return (
                    <div
                      key={v.id}
                      onClick={() => !chosen && addPick(openProduct, v)}
                      className={chosen ? 'tiw-var is-chosen' : 'tiw-var'}
                    >
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
            )}
            <div style={{ marginTop: 12, fontSize: 12.5, color: C.sec, lineHeight: 1.6 }}>
              Je zit nergens aan vast: we leggen het voor je apart en je beslist definitief zodra je {hasBid(variant) ? 'het bod' : 'ons bod'} accepteert.
            </div>
          </div>
        )}
      </Page>

      <StickyBar
        note={picks.length
          ? <><strong style={{ color: C.text }}>{picks.length} item{picks.length > 1 ? 's' : ''}</strong> gekozen — {fmt(buyTotal)} {hasBid(variant) ? 'wordt verrekend met je bod' : 'verrekenen we met het bod dat je krijgt'}.</>
          : wants === false ? 'Prima — je krijgt het bedrag op je rekening.'
            : wants ? 'Zoek iets uit onze voorraad, of ga gewoon verder — je kunt het later nog toevoegen.'
            : 'Kies hierboven of je iets wilt terugkopen.'}
        cta="Verder"
        disabled={wants === null}
        onClick={() => router.push(`${base(variant)}/gegevens`)}
      />

      <style>{`
        .tiw-choice{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        @media(max-width:760px){.tiw-choice{grid-template-columns:1fr}}
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
      `}</style>
    </>
  );
}

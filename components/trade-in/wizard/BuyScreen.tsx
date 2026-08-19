'use client';

/** Wizard scherm 2 — Wil je er iets voor terug? Optionele koopstap uit onze eigen voorraad. */

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import VersionSwitch from '@/components/trade-in/VersionSwitch';
import { BUY_PRODUCTS, type BuyProduct, type BuyVariant } from '@/data/trade-in-mock';
import {
  useWizardState, WizardBanner, TrustBar, Page, PageTitle, StickyBar, BackLink, IconBtn,
  C, input, card, fmt, base, hasBid, type Variant,
} from './shared';

export default function BuyScreen({ variant }: { variant: Variant }) {
  const router = useRouter();
  const [state, update, ready] = useWizardState(variant);
  const { items, picks } = state;
  const [q, setQ] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
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

  const togglePick = (p: BuyProduct, v: BuyVariant) => update(s => ({
    ...s,
    picks: s.picks.some(x => x.id === v.id) ? s.picks.filter(x => x.id !== v.id) : [...s.picks, { ...v, name: p.name, productId: p.id }],
  }));
  const buyTotal = picks.reduce((s, p) => s + p.price, 0);

  const choose = (yes: boolean) => {
    setWants(yes);
    update(s => ({ ...s, buySkipped: !yes, picks: yes ? s.picks : [] }));
    if (!yes) { setQ(''); setExpanded(null); }
  };

  return (
    <>
      <VersionSwitch active={variant} />
      <WizardBanner variant={variant} step={2} />
      <TrustBar variant={variant} />

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
          <button onClick={() => choose(true)} className="tiw-choice-btn" style={{ borderColor: wants === true ? C.accent : C.border, background: wants === true ? C.accentSoft : '#fff' }}>
            <span className="tiw-choice-ico" style={{ background: wants === true ? C.accent : C.tint, color: wants === true ? '#fff' : C.text }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18M16 10a4 4 0 0 1-8 0" /></svg>
            </span>
            <span>
              <strong>Ja, laat zien wat jullie hebben</strong>
              <span>Ruim 2.000 gecontroleerde tweedehands items, met garantie.</span>
            </span>
          </button>
          <button onClick={() => choose(false)} className="tiw-choice-btn" style={{ borderColor: wants === false ? C.text : C.border, background: wants === false ? C.tint : '#fff' }}>
            <span className="tiw-choice-ico" style={{ background: wants === false ? C.text : C.tint, color: wants === false ? '#fff' : C.text }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            </span>
            <span>
              <strong>Nee, ik wil alleen verkopen</strong>
              <span>Je krijgt het bedrag gewoon op je rekening.</span>
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
            <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 10 }}>Zoek in onze voorraad</div>
            <input value={q} onChange={e => { setQ(e.target.value); setExpanded(null); }} placeholder="Zoek op merk, model of SKU…" autoComplete="off" style={input} />
            {q.trim().length >= 2 && (
              <div style={{ marginTop: 10, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                {results.length ? results.map((p, i) => {
                  const prices = p.variants.map(v => v.price); const open = expanded === p.id;
                  return (
                    <div key={p.id} style={{ borderBottom: i < results.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                      <div onClick={() => setExpanded(open ? null : p.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', cursor: 'pointer', background: open ? C.tint : '#fff' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{p.name}</div>
                          <div style={{ fontSize: 12, color: C.sec }}>{p.category}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 12, color: C.sec }}>{p.variants.length} op voorraad</div>
                          <div style={{ fontWeight: 700, fontSize: 14.5, color: C.text }}>{fmt(Math.min(...prices))}{prices.length > 1 ? ` – ${fmt(Math.max(...prices))}` : ''}</div>
                        </div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.sec} strokeWidth="2" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}><path d="M6 9l6 6 6-6" /></svg>
                      </div>
                      {open && (
                        <div style={{ padding: '4px 12px 12px', background: C.tint }}>
                          {p.variants.map(v => {
                            const sel = picks.some(x => x.id === v.id);
                            return (
                              <div key={v.id} onClick={() => togglePick(p, v)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', marginTop: 6, borderRadius: 10, border: `1.5px solid ${sel ? C.text : C.border}`, background: '#fff', cursor: 'pointer' }}>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: 13.5, color: C.text }}><strong>{v.condition}</strong> <span style={{ color: C.sec }}>· SKU {v.sku}{v.shutterCount !== undefined ? ` · ${v.shutterCount.toLocaleString('nl-NL')} clicks` : ''}</span></div>
                                  <div style={{ fontSize: 12, color: C.sec, marginTop: 3 }}>Incl. {v.accessories.join(', ')}</div>
                                </div>
                                <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>{fmt(v.price)}</div>
                                <span style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${sel ? C.text : C.border}`, background: sel ? C.text : '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {sel && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }) : <div style={{ padding: 14, fontSize: 13.5, color: C.sec }}>Niets gevonden in onze voorraad.</div>}
              </div>
            )}
            <div style={{ marginTop: 12, fontSize: 12.5, color: C.sec, lineHeight: 1.6 }}>
              Je zit nergens aan vast: we leggen het voor je apart en je beslist definitief zodra je {hasBid(variant) ? 'het bod' : 'ons bod'} accepteert.
            </div>
          </div>
        )}
      </Page>

      <StickyBar
        note={picks.length
          ? <><strong style={{ color: C.text }}>{picks.length} item{picks.length > 1 ? 's' : ''}</strong> gekozen — {fmt(buyTotal)} wordt verrekend met je bod.</>
          : wants === false ? 'Prima — je krijgt het bedrag op je rekening.'
            : wants ? 'Zoek iets uit onze voorraad, of ga gewoon verder — je kunt het later nog toevoegen.'
            : 'Kies hierboven of je iets wilt terugkopen.'}
        cta="Verder"
        disabled={wants === null}
        onClick={() => router.push(`${base(variant)}/gegevens`)}
      />

      <style>{`
        .tiw-choice{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        @media(max-width:760px){.tiw-choice{grid-template-columns:1fr}}
        .tiw-choice-btn{display:flex;align-items:flex-start;gap:14px;text-align:left;border:1.5px solid #EEEEF2;border-radius:14px;padding:18px;cursor:pointer;font-family:inherit;transition:all .15s}
        .tiw-choice-btn:hover{border-color:#C9CAD3}
        .tiw-choice-btn strong{display:block;font-size:15px;font-weight:700;color:#1E2133;margin-bottom:3px}
        .tiw-choice-btn span span{display:block;font-size:13px;color:#6B6D80;line-height:1.5}
        .tiw-choice-ico{width:40px;height:40px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s}
      `}</style>
    </>
  );
}

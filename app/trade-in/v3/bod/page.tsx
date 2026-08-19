'use client';

/** Inruilflow v3 — scherm 3: Je bod (laadstatus → items met prijs/status, overzichtskaart, optioneel inruilen). */

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import VersionSwitch from '@/components/trade-in/VersionSwitch';
import { BUY_PRODUCTS, estimateBid, type BuyProduct, type BuyVariant } from '@/data/trade-in-mock';
import { useV3State, clearV3State, V3Header, BackLink, Thumb, IconBtn, INCLUDED, C, card, input, btnCta, btnGhost, fmt, vatLineFor, NON_EU, type SellItem } from '@/components/trade-in/v3/shared';

function ItemBid({ it }: { it: SellItem }) {
  const bid = estimateBid(it.name, it.condition, it.shutter);
  if (bid.coverage === 'instant' && bid.price) return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: C.accent }}>Ons bod</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: C.text, whiteSpace: 'nowrap', lineHeight: 1.15 }}>{fmt(bid.price)}</div>
    </div>
  );
  const minutes = bid.coverage === 'minutes';
  return (
    <div style={{ textAlign: 'right', maxWidth: 220 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 700, borderRadius: 999, padding: '5px 10px', background: minutes ? C.accentSoft : C.surface, color: minutes ? C.accent : C.text, whiteSpace: 'nowrap' }}>
        {minutes ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg> : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h10" /></svg>}
        {minutes ? 'Bod volgt binnen enkele minuten' : 'Bod binnen 2 werkdagen'}
      </span>
      <div style={{ fontSize: 11.5, color: C.sec, marginTop: 5 }}>{minutes ? 'We halen extra marktdata op en mailen je bod.' : 'Dit product beoordelen we handmatig.'}</div>
    </div>
  );
}

export default function BodPage() {
  const router = useRouter();
  const [state, update, ready] = useV3State();
  const { items, picks, contact } = state;
  const [loading, setLoading] = useState(true);
  const [openIncl, setOpenIncl] = useState<number | null>(null);
  const [tradeOpen, setTradeOpen] = useState(false);
  const [bq, setBq] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => { if (ready && (items.length === 0 || !contact.email)) router.replace('/trade-in/v3'); }, [ready, items.length, contact.email, router]);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1600); return () => clearTimeout(t); }, []);
  useEffect(() => { if (ready && picks.length) setTradeOpen(true); }, [ready, picks.length]);

  const bids = items.map(it => ({ it, bid: estimateBid(it.name, it.condition, it.shutter) }));
  const instantTotal = bids.reduce((s, b) => s + (b.bid.coverage === 'instant' && b.bid.price ? b.bid.price : 0), 0);
  const nInstant = bids.filter(b => b.bid.coverage === 'instant').length;
  const nMinutes = bids.filter(b => b.bid.coverage === 'minutes').length;
  const nManual = bids.filter(b => b.bid.coverage === 'manual').length;
  const buyTotal = picks.reduce((s, p) => s + p.price, 0);
  const net = instantTotal - buyTotal;

  const buyResults = useMemo(() => {
    if (bq.trim().length < 2) return [] as BuyProduct[];
    const t = bq.toLowerCase().split(/\s+/).filter(Boolean);
    return BUY_PRODUCTS.filter(p => t.every(w => (p.name + ' ' + p.category + ' ' + p.variants.map(v => v.sku).join(' ')).toLowerCase().includes(w))).slice(0, 8);
  }, [bq]);
  const togglePick = (p: BuyProduct, v: BuyVariant) => update(s => ({ ...s, picks: s.picks.some(x => x.id === v.id) ? s.picks.filter(x => x.id !== v.id) : [...s.picks, { ...v, name: p.name, productId: p.id }] }));
  const removeItem = (id: number) => update(s => ({ ...s, items: s.items.filter(i => i.id !== id) }));
  const editItem = (id: number) => { update({ editingId: id }); router.push('/trade-in/v3'); };

  if (!ready) return null;

  if (done) {
    return (
      <>
        <VersionSwitch active={3} />
        <V3Header step={3} />
        <div style={{ background: C.surface, padding: '48px 0 96px' }}>
          <div style={{ ...card, maxWidth: 620, margin: '0 auto', padding: 32, textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px', color: C.text }}>Verzending geregeld</h2>
            <p style={{ color: C.sec, margin: '0 auto 18px', maxWidth: 480, fontSize: 14.5, lineHeight: 1.6 }}>
              Het gratis, verzekerde verzendlabel staat in je mail op <strong style={{ color: C.text }}>{contact.email}</strong>.
              {nInstant > 0 && <> Je bod van <strong style={{ color: C.text }}>{fmt(instantTotal)}</strong> staat 7 dagen vast.</>}
              {nMinutes > 0 && <> Voor {nMinutes} item{nMinutes > 1 ? 's' : ''} volgt het bod binnen enkele minuten per mail.</>}
              {nManual > 0 && <> {nManual} item{nManual > 1 ? 's' : ''} beoordelen we handmatig — binnen 2 werkdagen hoor je van ons.</>}
              {' '}Na ontvangst controleren we alles en betalen we binnen 3 werkdagen uit.
            </p>
            <button style={btnGhost} onClick={() => { clearV3State(); router.push('/trade-in/v3'); }}>Nog een aanvraag</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <VersionSwitch active={3} />
      <V3Header step={3} />
      <div style={{ background: C.surface, padding: '36px 0 96px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          {loading ? (
            <div style={{ ...card, maxWidth: 560, margin: '40px auto', padding: 36, textAlign: 'center' }}>
              <div className="ti3-spin" />
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '16px 0 6px', color: C.text }}>We berekenen je bod…</h2>
              <p style={{ color: C.sec, fontSize: 14, margin: 0 }}>We vergelijken met actuele marktprijzen. Dit duurt een paar seconden.</p>
            </div>
          ) : (
            <>
              <BackLink href="/trade-in/v3/gegevens" label="Terug naar je gegevens" />
              <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.02em', margin: '10px 0 22px', color: C.text }}>Je bod</h2>

              <div className="ti3-bod-grid">
                {/* Links: items */}
                <div>
                  <div className="svc-eyebrow" style={{ margin: '0 0 12px' }}>Wat je verkoopt</div>
                  {items.map(it => (
                    <div key={it.id} style={{ ...card, padding: 22, marginBottom: 14, borderLeft: `4px solid ${C.accent}`, lineHeight: 1.6 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                        <Thumb category={it.category} size={56} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>{it.name}</div>
                          <div style={{ fontSize: 14, color: C.sec, marginTop: 6 }}>
                            Conditie: <strong style={{ color: C.text }}>{it.condition}</strong>
                            {it.category === 'camera' && <> · Shuttercount: <strong style={{ color: C.text }}>{it.shutter ?? 'onbekend'}</strong>{!it.shutter && <span style={{ color: C.sec }}> (we gaan uit van max. 25.000)</span>}<strong></strong></>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                          <ItemBid it={it} />
                          <div style={{ display: 'flex', gap: 6 }}>
                            <IconBtn kind="edit" title="Wijzigen" onClick={() => editItem(it.id)} />
                            <IconBtn kind="trash" title="Verwijderen" onClick={() => removeItem(it.id)} />
                          </div>
                        </div>
                      </div>
                      <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.border}`, fontSize: 13.5, color: C.sec, lineHeight: 1.65 }}>
                        <strong style={{ color: C.text }}>Let op:</strong> prijs is inclusief de originele accessoires en gaat uit van de door jou gekozen conditie.
                        <button onClick={() => setOpenIncl(openIncl === it.id ? null : it.id)} style={{ display: 'block', background: 'none', border: 'none', padding: 0, marginTop: 6, color: C.text, fontWeight: 700, fontSize: 13.5, textDecoration: 'underline', cursor: 'pointer', fontFamily: 'inherit' }}>
                          Wat is inbegrepen? {openIncl === it.id ? '▴' : '▾'}
                        </button>
                        {openIncl === it.id && (
                          <div style={{ marginTop: 10, padding: '14px 16px', background: C.accentSoft, borderRadius: 10, lineHeight: 1.7 }}>
                            <div style={{ fontWeight: 700, color: C.text, marginBottom: 4 }}>We verwachten bij dit bod:</div>
                            <ul style={{ margin: 0, paddingLeft: 18, listStyle: 'disc' }}>{(INCLUDED[it.category] ?? INCLUDED.accessory).map(a => <li key={a}>{a}</li>)}</ul>
                            <div style={{ marginTop: 10 }}>Ontbreekt iets of wijkt de conditie/shuttercount af? Dan passen we het bod aan volgens onze vaste staffel. Jij beslist daarna — niet akkoord is gratis retour.</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0 26px' }}>
                    <button onClick={() => router.push('/trade-in/v3')} style={btnGhost}>Nog een item verkopen <span style={{ fontSize: 18, lineHeight: 1 }}>+</span></button>
                  </div>

                  {/* Inruilen */}
                  {tradeOpen && (
                    <div>
                      <div className="svc-eyebrow" style={{ margin: '0 0 12px' }}>Wat je koopt</div>
                      {picks.map(p => (
                        <div key={p.id} style={{ ...card, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', marginBottom: 10 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{p.name}</div>
                            <div style={{ fontSize: 13, color: C.sec }}>{p.condition} · SKU {p.sku}{p.shutterCount !== undefined ? ` · ${p.shutterCount.toLocaleString('nl-NL')} clicks` : ''} · incl. {p.accessories.join(', ')}</div>
                          </div>
                          <div style={{ fontWeight: 800, fontSize: 18, color: C.text }}>{fmt(p.price)}</div>
                          <IconBtn kind="trash" title="Verwijderen" onClick={() => update(s => ({ ...s, picks: s.picks.filter(x => x.id !== p.id) }))} />
                        </div>
                      ))}
                      <div style={{ ...card, padding: 18 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                          <span style={{ fontWeight: 700, fontSize: 14, color: C.text }}>Kies uit onze voorraad</span>
                          <button onClick={() => { setTradeOpen(false); update({ picks: [] }); setBq(''); }} style={{ background: 'none', border: 'none', color: C.sec, cursor: 'pointer', fontSize: 12.5, textDecoration: 'underline', fontFamily: 'inherit' }}>Toch niet ruilen</button>
                        </div>
                        <input value={bq} onChange={e => { setBq(e.target.value); setExpanded(null); }} placeholder="Zoek op merk, model of SKU…" autoComplete="off" style={input} />
                        {bq.trim().length >= 2 && (
                          <div style={{ marginTop: 10, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                            {buyResults.length ? buyResults.map((p, i) => {
                              const prices = p.variants.map(v => v.price); const open = expanded === p.id;
                              return (
                                <div key={p.id} style={{ borderBottom: i < buyResults.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                                  <div onClick={() => setExpanded(open ? null : p.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', cursor: 'pointer', background: open ? C.surface : '#fff' }}>
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
                                    <div style={{ padding: '4px 12px 12px', background: C.surface }}>
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
                      </div>
                    </div>
                  )}
                </div>

                {/* Rechts: overzicht */}
                <aside>
                  <div style={{ ...card, padding: 0, position: 'sticky', top: 24, overflow: 'hidden' }}>
                    <div style={{ background: 'linear-gradient(135deg, #1B1E2E 0%, #2A2D45 60%, #3A2519 100%)', color: '#fff', padding: '18px 24px' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: '#FF8A4C' }}>Ons bod voor jou</div>
                      <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.1, marginTop: 4 }}>{fmt(Math.abs(net))}</div>
                      <div style={{ fontSize: 12.5, opacity: .8, marginTop: 2 }}>{net >= 0 ? 'wij betalen jou' : 'jij betaalt bij'} · bod staat 7 dagen vast</div>
                    </div>
                    <div style={{ padding: 22 }}>
                    <div className="ti3-line"><span>Totaal verkoop{nInstant < items.length ? ` (${nInstant} van ${items.length})` : ''}</span><strong>{fmt(instantTotal)}</strong></div>
                    {nMinutes > 0 && <div className="ti3-line" style={{ color: C.accent }}><span>{nMinutes} bod volgt per e-mail</span><span>binnen enkele min.</span></div>}
                    {nManual > 0 && <div className="ti3-line"><span>{nManual} handmatige beoordeling</span><span>binnen 2 werkdagen</span></div>}
                    {picks.length > 0 && <div className="ti3-line"><span>Je koopt</span><strong>− {fmt(buyTotal)}</strong></div>}
                    {contact.isBusiness && <div style={{ fontSize: 12, color: C.sec, marginTop: 2 }}>{vatLineFor(contact)}{!NON_EU.includes(contact.country) && contact.vat ? ` · ${contact.vat.toUpperCase()}` : ''}</div>}
                    <button onClick={() => setDone(true)} style={{ ...btnCta, width: '100%', justifyContent: 'center', marginTop: 16, padding: '15px 20px' }}>Regel de verzending</button>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 14 }}>
                      {[['Gratis & verzekerd', 'verzenden'], ['7 dagen', 'bod vast'], ['3 werkdagen', 'uitbetaling']].map(([a, b]) => (
                        <div key={a} style={{ textAlign: 'center', fontSize: 11.5, color: C.sec, lineHeight: 1.35 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto 4px' }}><polyline points="20 6 9 17 4 12" /></svg>
                          <strong style={{ color: C.text }}>{a}</strong><br />{b}
                        </div>
                      ))}
                    </div>
                    {!tradeOpen && (
                      <button onClick={() => setTradeOpen(true)} style={{ width: '100%', marginTop: 14, background: C.surface, border: 'none', borderRadius: 10, padding: '12px 14px', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13.5, color: C.text }}>
                        <strong>Wil je er iets voor terug?</strong><br /><span style={{ color: C.sec }}>Kies uit onze voorraad — we verrekenen het met je bod.</span>
                      </button>
                    )}
                    <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${C.border}`, textAlign: 'center', fontSize: 13, color: C.sec }}>
                      <strong style={{ color: C.text, fontSize: 14 }}>Heb je vragen?</strong><br />
                      <a href="/faq" style={{ color: C.text, textDecoration: 'underline' }}>Bekijk de veelgestelde vragen over verkopen en inruilen</a>
                    </div>
                    </div>
                  </div>
                </aside>
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`
        .ti3-bod-grid{display:grid;grid-template-columns:1fr 340px;gap:24px;align-items:start}
        @media(max-width:900px){.ti3-bod-grid{grid-template-columns:1fr}}
        .ti3-line{display:flex;justify-content:space-between;gap:12px;padding:11px 0;border-bottom:1px solid #EEEEF2;font-size:14px;color:#1E2133;line-height:1.5}
        .ti3-spin{width:38px;height:38px;border-radius:50%;border:3px solid #EEEEF2;border-top-color:#E8692A;margin:0 auto;animation:ti3spin .8s linear infinite}
        @keyframes ti3spin{to{transform:rotate(360deg)}}
      `}</style>
    </>
  );
}

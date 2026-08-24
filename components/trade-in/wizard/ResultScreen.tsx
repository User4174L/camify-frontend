'use client';

/**
 * Wizard scherm 4 — het slotscherm, met twee gezichten:
 *   variant 3: het bod staat er direct (laadstatus → prijzen → verzending regelen)
 *   variant 2: geen bod vooraf — overzicht van de aanvraag, bod volgt per e-mail
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import VersionSwitch from '@/components/trade-in/VersionSwitch';
import { estimateBid } from '@/data/trade-in-mock';
import {
  useWizardState, clearWizardState, WizardBanner, Page, PageTitle, BackLink, StickyBar, Thumb, IconBtn, useIsMobile,
  INCLUDED, C, card, btnCta, btnGhost, fmt, vatLineFor, NON_EU, base, hasBid, LEAD_TIME, wearLine, type SellItem, type Variant,
} from './shared';

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
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 700, borderRadius: 999, padding: '5px 10px', background: minutes ? C.accentSoft : C.tint, color: minutes ? C.accent : C.text, whiteSpace: 'nowrap' }}>
        {minutes ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg> : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h10" /></svg>}
        {minutes ? 'Bod volgt binnen enkele minuten' : 'Bod binnen 2 werkdagen'}
      </span>
      <div style={{ fontSize: 11.5, color: C.sec, marginTop: 5 }}>{minutes ? 'We halen extra marktdata op en mailen je bod.' : 'Dit product beoordelen we handmatig.'}</div>
    </div>
  );
}

export default function ResultScreen({ variant }: { variant: Variant }) {
  const router = useRouter();
  const withBid = hasBid(variant);
  const isMobile = useIsMobile();
  const [state, update, ready] = useWizardState(variant);
  const { items, picks, contact } = state;
  const [loading, setLoading] = useState(withBid);
  const [openIncl, setOpenIncl] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => { if (ready && (items.length === 0 || !contact.email)) router.replace(base(variant)); }, [ready, items.length, contact.email, router, variant]);
  useEffect(() => { if (!withBid) return; const t = setTimeout(() => setLoading(false), 1600); return () => clearTimeout(t); }, [withBid]);

  const bids = items.map(it => ({ it, bid: estimateBid(it.name, it.condition, it.shutter) }));
  const instantTotal = bids.reduce((s, b) => s + (b.bid.coverage === 'instant' && b.bid.price ? b.bid.price : 0), 0);
  const nInstant = bids.filter(b => b.bid.coverage === 'instant').length;
  const nMinutes = bids.filter(b => b.bid.coverage === 'minutes').length;
  const nManual = bids.filter(b => b.bid.coverage === 'manual').length;
  const buyTotal = picks.reduce((s, p) => s + p.price, 0);
  const net = instantTotal - buyTotal;

  const removeItem = (id: number) => update(s => ({ ...s, items: s.items.filter(i => i.id !== id) }));
  const editItem = (id: number) => { update({ editingId: id }); router.push(base(variant)); };

  if (!ready) return null;

  /* ── Bevestiging ── */
  if (done) {
    return (
      <>
        <VersionSwitch active={variant} />
        <WizardBanner variant={variant} step={4} />
        <Page width={680}>
          <div style={{ ...card, padding: 32, textAlign: 'center', marginTop: 20 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px', color: C.text }}>{withBid ? 'Verzending geregeld' : 'Bedankt voor je aanvraag'}</h2>
            <p style={{ color: C.sec, margin: '0 auto 18px', maxWidth: 480, fontSize: 14.5, lineHeight: 1.6 }}>
              {withBid ? (
                <>
                  Het gratis, verzekerde verzendlabel staat in je mail op <strong style={{ color: C.text }}>{contact.email}</strong>.
                  {nInstant > 0 && <> Je bod van <strong style={{ color: C.text }}>{fmt(instantTotal)}</strong> staat 7 dagen vast.</>}
                  {nMinutes > 0 && <> Voor {nMinutes} item{nMinutes > 1 ? 's' : ''} volgt het bod binnen enkele minuten per mail.</>}
                  {nManual > 0 && <> {nManual} item{nManual > 1 ? 's' : ''} beoordelen we handmatig — binnen 2 werkdagen hoor je van ons.</>}
                  {' '}Na ontvangst controleren we alles en betalen we binnen 3 werkdagen uit.
                </>
              ) : (
                <>
                  Een van onze experts kijkt naar je {items.length === 1 ? 'item' : `${items.length} items`} en stuurt je persoonlijke bod <strong style={{ color: C.text }}>binnen {LEAD_TIME}</strong> naar <strong style={{ color: C.text }}>{contact.email}</strong>.
                  {picks.length > 0 && <> {picks.length === 1 ? 'Het gekozen item' : `De ${picks.length} gekozen items`} uit onze voorraad leggen we zolang voor je apart.</>}
                  {' '}Ga je akkoord, dan krijg je meteen een gratis verzekerd verzendlabel. Zo niet, dan houdt het daar op — je zit nergens aan vast.
                </>
              )}
            </p>
            <button className="tiw-add" style={btnGhost} onClick={() => { clearWizardState(variant); router.push(base(variant)); }}>Nog een aanvraag</button>
          </div>
        </Page>
      </>
    );
  }

  return (
    <>
      <VersionSwitch active={variant} />
      <WizardBanner variant={variant} step={4} back={`${base(variant)}/gegevens`} />

      <Page width={1080}>
        {loading ? (
          <div style={{ ...card, maxWidth: 560, margin: '40px auto', padding: 36, textAlign: 'center' }}>
            <div className="tiw-spin" />
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: '16px 0 6px', color: C.text }}>We berekenen je bod…</h2>
            <p style={{ color: C.sec, fontSize: 14, margin: 0 }}>We vergelijken met actuele marktprijzen. Dit duurt een paar seconden.</p>
          </div>
        ) : (
          <>
            <BackLink href={`${base(variant)}/gegevens`} label="Terug naar je gegevens" />
            <PageTitle
              title={withBid ? 'Je bod' : 'Klopt dit zo?'}
              sub={withBid ? undefined : 'Controleer je aanvraag en verstuur hem. Onze expert bepaalt daarna het bod — geen automaat, maar iemand die je spullen echt bekijkt.'}
            />

            <div className="tiw-result-grid">
              {/* Links: items */}
              <div>
                <div className="svc-eyebrow" style={{ margin: '0 0 12px' }}>Wat je verkoopt</div>
                {items.map(it => (
                  <div key={it.id} style={{ ...card, padding: 22, marginBottom: 14, borderLeft: `4px solid ${C.accent}`, lineHeight: 1.6 }}>
                    <div className="tiw-item-row">
                      <Thumb category={it.category} name={it.name} size={56} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>{it.name}</div>
                        <div style={{ fontSize: 14, color: C.sec, marginTop: 6 }}>
                          Conditie: <strong style={{ color: C.text }}>{it.condition}</strong>
                          {wearLine(it)}
                        </div>
                      </div>
                      <div className="tiw-item-side">
                        {withBid && <ItemBid it={it} />}
                        <div style={{ display: 'flex', gap: 6 }}>
                          <IconBtn kind="edit" title="Wijzigen" onClick={() => editItem(it.id)} />
                          <IconBtn kind="trash" title="Verwijderen" onClick={() => removeItem(it.id)} />
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.border}`, fontSize: 13.5, color: C.sec, lineHeight: 1.65 }}>
                      <strong style={{ color: C.text }}>Let op:</strong> {withBid
                        ? 'prijs is inclusief de originele accessoires en gaat uit van de door jou gekozen conditie.'
                        : 'we gaan uit van de conditie die je hebt gekozen, inclusief de originele accessoires.'}
                      <button onClick={() => setOpenIncl(openIncl === it.id ? null : it.id)} style={{ display: 'block', background: 'none', border: 'none', padding: 0, marginTop: 6, color: C.text, fontWeight: 700, fontSize: 13.5, textDecoration: 'underline', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Wat is inbegrepen? {openIncl === it.id ? '▴' : '▾'}
                      </button>
                      {openIncl === it.id && (
                        <div style={{ marginTop: 10, padding: '14px 16px', background: C.accentSoft, borderRadius: 10, lineHeight: 1.7 }}>
                          <div style={{ fontWeight: 700, color: C.text, marginBottom: 4 }}>We verwachten {withBid ? 'bij dit bod' : 'hierbij'}:</div>
                          <ul style={{ margin: 0, paddingLeft: 18, listStyle: 'disc' }}>{(INCLUDED[it.category] ?? INCLUDED.accessory).map(a => <li key={a}>{a}</li>)}</ul>
                          <div style={{ marginTop: 10 }}>Ontbreekt iets of wijkt de conditie/shuttercount af? Dan {withBid ? 'passen we het bod aan' : 'houden we daar rekening mee'} volgens onze vaste staffel. Jij beslist daarna — niet akkoord is gratis retour.</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0 26px' }}>
                  <button onClick={() => router.push(base(variant))} className="tiw-add" style={btnGhost}>Nog een item verkopen <span style={{ fontSize: 18, lineHeight: 1 }}>+</span></button>
                </div>

                {/* Wat je koopt (gekozen in stap 2) */}
                <div>
                  <div className="svc-eyebrow" style={{ margin: '0 0 12px' }}>Wat je koopt</div>
                  {picks.length ? (
                    <>
                      {picks.map(p => (
                        <div key={p.id} style={{ ...card, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', marginBottom: 10 }}>
                          <Thumb category="camera" name={p.name} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{p.name}</div>
                            <div style={{ fontSize: 13, color: C.sec }}>{p.condition} · SKU {p.sku}{p.shutterCount !== undefined ? ` · ${p.shutterCount.toLocaleString('nl-NL')} clicks` : ''} · incl. {p.accessories.join(', ')}</div>
                          </div>
                          <div style={{ fontWeight: 800, fontSize: 18, color: C.text }}>{fmt(p.price)}</div>
                          <IconBtn kind="trash" title="Verwijderen" onClick={() => update(s => ({ ...s, picks: s.picks.filter(x => x.id !== p.id) }))} />
                        </div>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0 0' }}>
                        <button onClick={() => router.push(`${base(variant)}/kopen`)} className="tiw-add" style={btnGhost}>Iets anders kiezen</button>
                      </div>
                    </>
                  ) : (
                    <button onClick={() => router.push(`${base(variant)}/kopen`)} style={{ ...card, width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', padding: 18 }}>
                      <strong style={{ display: 'block', fontSize: 14.5, color: C.text, marginBottom: 3 }}>Wil je er toch iets voor terug?</strong>
                      <span style={{ fontSize: 13, color: C.sec }}>Kies uit onze voorraad — we verrekenen het met je bod.</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Rechts: overzicht */}
              <aside>
                <div style={{ ...card, padding: 0, position: 'sticky', top: 24, overflow: 'hidden' }}>
                  {withBid ? (
                    <div style={{ background: 'linear-gradient(135deg, #1B1E2E 0%, #2A2D45 60%, #3A2519 100%)', color: '#fff', padding: '18px 24px' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: '#FF8A4C' }}>Ons bod voor jou</div>
                      <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.1, marginTop: 4 }}>{fmt(Math.abs(net))}</div>
                      <div style={{ fontSize: 12.5, opacity: .8, marginTop: 2 }}>{net >= 0 ? 'wij betalen jou' : 'jij betaalt bij'} · bod staat 7 dagen vast</div>
                    </div>
                  ) : (
                    <div style={{ background: 'linear-gradient(135deg, #1B1E2E 0%, #2A2D45 60%, #3A2519 100%)', color: '#fff', padding: '18px 24px' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: '#FF8A4C' }}>Je persoonlijke bod</div>
                      <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.15, marginTop: 4 }}>Binnen {LEAD_TIME}</div>
                      <div style={{ fontSize: 12.5, opacity: .8, marginTop: 2 }}>per e-mail, opgesteld door een expert</div>
                    </div>
                  )}
                  <div style={{ padding: 22 }}>
                    {withBid ? (
                      <>
                        <div className="tiw-line"><span>Totaal verkoop{nInstant < items.length ? ` (${nInstant} van ${items.length})` : ''}</span><strong>{fmt(instantTotal)}</strong></div>
                        {nMinutes > 0 && <div className="tiw-line" style={{ color: C.accent }}><span>{nMinutes} bod volgt per e-mail</span><span>binnen enkele min.</span></div>}
                        {nManual > 0 && <div className="tiw-line"><span>{nManual} handmatige beoordeling</span><span>binnen 2 werkdagen</span></div>}
                        {picks.length > 0 && <div className="tiw-line"><span>Je koopt</span><strong>− {fmt(buyTotal)}</strong></div>}
                      </>
                    ) : (
                      <>
                        <div className="tiw-line"><span>Je verkoopt</span><strong>{items.length} item{items.length > 1 ? 's' : ''}</strong></div>
                        {picks.length > 0 && <div className="tiw-line"><span>Je koopt</span><strong>{picks.length} item{picks.length > 1 ? 's' : ''} · {fmt(buyTotal)}</strong></div>}
                        <div style={{ fontSize: 12.5, color: C.sec, padding: '11px 0', lineHeight: 1.6 }}>
                          We noemen bewust nog geen bedrag: een expert kijkt eerst naar je spullen{picks.length > 0 ? ' en verrekent daarna wat je meeneemt' : ''}. Je hoort het als eerste per mail en beslist dan pas.
                        </div>
                      </>
                    )}
                    {contact.isBusiness && <div style={{ fontSize: 12, color: C.sec, marginTop: 2 }}>{vatLineFor(contact)}{!NON_EU.includes(contact.country) && contact.vat ? ` · ${contact.vat.toUpperCase()}` : ''}</div>}
                    {!isMobile && (
                      <>
                        <button onClick={() => setDone(true)} style={{ ...btnCta, width: '100%', justifyContent: 'center', marginTop: 16, padding: '15px 20px' }}>
                          {withBid ? 'Akkoord, regel de verzending' : 'Verstuur je aanvraag'}
                        </button>
                        <p style={{ fontSize: 12.5, color: C.sec, textAlign: 'center', margin: '10px 0 0' }}>
                          {withBid ? 'Je bod staat 7 dagen vast.' : 'Je aanvraag is nog niet verstuurd.'}
                        </p>
                      </>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 18 }}>
                      {(withBid
                        ? [['Gratis & verzekerd', 'verzenden'], ['7 dagen', 'bod vast'], ['3 werkdagen', 'uitbetaling']]
                        : [['Gratis & verzekerd', 'verzenden'], [LEAD_TIME, 'je bod'], ['Nergens aan', 'vast']]
                      ).map(([a, b]) => (
                        <div key={a} style={{ textAlign: 'center', fontSize: 11.5, color: C.sec, lineHeight: 1.35 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto 4px' }}><polyline points="20 6 9 17 4 12" /></svg>
                          <strong style={{ color: C.text }}>{a}</strong><br />{b}
                        </div>
                      ))}
                    </div>
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
      </Page>

      {!loading && isMobile && (
        <StickyBar
          width={1080}
          note={withBid
            ? <>Je bod van <strong style={{ color: C.text }}>{fmt(Math.abs(net))}</strong> staat 7 dagen vast — gratis verzekerd verzenden.</>
            : <>Je aanvraag is <strong style={{ color: C.text }}>nog niet verstuurd</strong>. Klopt alles? Dan gaat hij naar onze expert.</>}
          cta={withBid ? 'Akkoord, regel de verzending' : 'Verstuur je aanvraag'}
          onClick={() => setDone(true)}
        />
      )}

      <style>{`
        .tiw-item-row{display:flex;align-items:flex-start;gap:14px}
        .tiw-item-side{display:flex;flex-direction:column;align-items:flex-end;gap:10px}
        @media(max-width:760px){
          /* Prijs naast de tekst knijpt de productregel tot drie regels; onder elkaar leest beter. */
          .tiw-item-row{flex-wrap:wrap}
          .tiw-item-side{flex-direction:row;align-items:center;justify-content:space-between;width:100%;margin-top:4px}
        }
        .tiw-result-grid{display:grid;grid-template-columns:1fr 340px;gap:24px;align-items:start}
        @media(max-width:900px){.tiw-result-grid{grid-template-columns:1fr}}
        .tiw-line{display:flex;justify-content:space-between;gap:12px;padding:11px 0;border-bottom:1px solid #EEEEF2;font-size:14px;color:#1E2133;line-height:1.5}
        .tiw-spin{width:38px;height:38px;border-radius:50%;border:3px solid #EEEEF2;border-top-color:#E8692A;margin:0 auto;animation:tiwspin .8s linear infinite}
        @keyframes tiwspin{to{transform:rotate(360deg)}}
      `}</style>
    </>
  );
}

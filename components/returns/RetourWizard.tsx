'use client';

import { useEffect, useMemo, useState } from 'react';

/**
 * RetourWizard — pop-up met stappen om een retourzending aan te maken.
 *
 * Doel: dezelfde helderheid als het Sendcloud-retourportaal, maar in onze eigen UI,
 * op onze eigen site, met onze eigen regels (kosten per zone, € 0 bij defect,
 * verzekering boven € 1.000 op onze kosten, betalen vóór het label).
 *
 * Stappen
 *   0  Opzoeken     bestelnummer + e-mailadres (overgeslagen als de order al bekend is)
 *   1  Wat & waarom gekochte artikelen aanvinken (inruil staat er niet in: verkocht is verkocht), reden, toelichting, foto
 *   2  Hoe          afgiftepunt met QR (geen printer) of label printen; vervoerder per land vast
 *   3  Overzicht    kosten, voorwaarden, betalen (pay.nl) of bevestigen bij € 0
 *   4  Klaar        label/QR, retouradres, uiterste datum, statushistorie
 *
 * Twee ingangen
 *   - vanuit /bestelling-annuleren of het account: order is bekend → start bij stap 1
 *   - via een link van de klantenservice (/retour?link=…): order én reden staan vast
 *     (bijv. "reparatie" binnen de garantie) → kosten € 0, start bij stap 1
 *
 * Alles hier is mock: er wordt niets aangemaakt. In de echte app:
 *   opzoeken → backend valideert order + e-mail; betaling → pay.nl; label → Sendcloud API
 *   (return parcel, evt. met additional_insured_price); status → Sendcloud webhook.
 */

export type RetourArtikel = { id: string; naam: string; sub: string; prijs: number };
export type RetourOrder = {
  nummer: string;
  email: string;
  land: 'NL' | 'BE' | 'DE' | 'FR' | 'ES' | 'IT' | 'AT' | 'PL';
  geleverdOp: string; // ISO
  artikelen: RetourArtikel[];
};

export type RetourLinkContext = {
  /** Wie de link stuurde en waarom — staat vast voor de klant. */
  reden: RedenCode;
  toelichting: string;
  medewerker: string;
};

const REDENEN: { code: RedenCode; label: string; gratis: boolean }[] = [
  { code: 'bedacht',      label: 'Bedenktijd — geen reden nodig',              gratis: false },
  { code: 'verwachting',  label: 'Voldoet niet aan mijn verwachtingen',        gratis: false },
  { code: 'beschrijving', label: 'Komt niet overeen met de beschrijving',      gratis: true  },
  { code: 'defect',       label: 'Defect of werkt niet',                       gratis: true  },
  { code: 'beschadigd',   label: 'Beschadigd aangekomen',                      gratis: true  },
  { code: 'verkeerd',     label: 'Verkeerd product ontvangen',                 gratis: true  },
  { code: 'reparatie',    label: 'Reparatie (in overleg met klantenservice)',  gratis: true  },
  { code: 'anders',       label: 'Anders',                                     gratis: false },
];
export type RedenCode = 'bedacht' | 'verwachting' | 'beschrijving' | 'defect' | 'beschadigd' | 'verkeerd' | 'reparatie' | 'anders';

/** Vast tarief per zone = wat het label ons kost, afgerond. Geen opslag naar waarde. */
const TARIEF: Record<RetourOrder['land'], { zone: string; bedrag: number; vervoerder: string; methode: string }> = {
  NL: { zone: 'Nederland',  bedrag: 6.95,  vervoerder: 'PostNL',               methode: 'PostNL Retour' },
  BE: { zone: 'België',     bedrag: 12.95, vervoerder: 'DHL eCommerce',        methode: 'DHL Parcel Connect Retour' },
  DE: { zone: 'Duitsland',  bedrag: 12.95, vervoerder: 'DHL eCommerce',        methode: 'DHL Parcel Connect Retour' },
  FR: { zone: 'Frankrijk',  bedrag: 12.95, vervoerder: 'DPD',                  methode: 'DPD Shop Return' },
  ES: { zone: 'Spanje',     bedrag: 24.95, vervoerder: 'DHL eCommerce',        methode: 'DHL Parcel Connect Retour' },
  IT: { zone: 'Italië',     bedrag: 24.95, vervoerder: 'DHL eCommerce',        methode: 'DHL Parcel Connect Retour' },
  AT: { zone: 'Oostenrijk', bedrag: 24.95, vervoerder: 'DHL eCommerce',        methode: 'DHL Parcel Connect Retour' },
  PL: { zone: 'Polen',      bedrag: 24.95, vervoerder: 'DHL eCommerce',        methode: 'DHL Parcel Connect Retour' },
};

/** Elke retour wordt verzekerd (XCover via Sendcloud, ~0,6% NL / ~1,5% EU van de waarde, op onze kosten).
 *  Geen handmatige goedkeuring: binnen de termijn betaalt de klant en heeft direct het label;
 *  bij defect/onze fout is het label direct gratis. Nemen we contact op, dan achteraf. */

const eur = (n: number) => '€ ' + n.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const datumNL = (iso: string) => new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });

/* ---------- stijl (zelfde taal als /bestelling-annuleren) ---------- */
const label: React.CSSProperties = {
  display: 'block', fontSize: 12.5, fontWeight: 700, letterSpacing: '.04em',
  textTransform: 'uppercase', color: '#8A8C99', marginBottom: 6,
};
const input: React.CSSProperties = {
  width: '100%', padding: '11px 13px', fontSize: 14.5, borderRadius: 9,
  border: '1.5px solid var(--border)', background: '#fff', color: 'var(--text)', fontFamily: 'inherit',
};
const p: React.CSSProperties = { fontSize: 14, color: 'var(--text-sec)', margin: '0 0 12px', lineHeight: 1.6 };
const knop: React.CSSProperties = {
  padding: '12px 22px', fontSize: 14.5, fontWeight: 700, color: '#fff', background: '#1E2133',
  border: 'none', borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit',
};
const knopLicht: React.CSSProperties = {
  ...knop, background: '#fff', color: 'var(--text)', border: '1.5px solid var(--border)',
};
const kaartje: React.CSSProperties = { border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px' };

function Melding({ kleur, titel, children }: { kleur: 'groen' | 'oranje' | 'grijs'; titel?: string; children: React.ReactNode }) {
  const t = kleur === 'groen'
    ? { bg: '#E8F5EE', rand: '#BFE3CF', tekst: '#1B7F4B' }
    : kleur === 'oranje'
      ? { bg: '#FDF1E7', rand: '#F5D5BB', tekst: '#B85C16' }
      : { bg: 'var(--surface)', rand: 'var(--border)', tekst: 'var(--text)' };
  return (
    <div style={{ background: t.bg, border: `1px solid ${t.rand}`, borderRadius: 11, padding: '12px 14px', marginBottom: 14 }}>
      {titel && <div style={{ fontSize: 14, fontWeight: 700, color: t.tekst, marginBottom: 4 }}>{titel}</div>}
      <div style={{ fontSize: 13.5, color: 'var(--text-sec)', lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

function Stappenbalk({ actief, links }: { actief: number; links: boolean }) {
  const stappen = links
    ? ['Artikelen', 'Verzenden', 'Overzicht', 'Klaar']
    : ['Opzoeken', 'Artikelen', 'Verzenden', 'Overzicht', 'Klaar'];
  const idx = links ? actief - 1 : actief;
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
      {stappen.map((s, i) => (
        <div key={s} style={{ flex: 1, minWidth: 0 }}>
          <div style={{ height: 4, borderRadius: 999, background: i <= idx ? '#E8692A' : '#EEEEF2', marginBottom: 6 }} />
          <div style={{ fontSize: 11.5, fontWeight: i === idx ? 700 : 500, color: i === idx ? 'var(--text)' : '#8A8C99', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- de wizard ---------- */
export default function RetourWizard({
  open, onClose, order, link,
}: {
  open: boolean;
  onClose: () => void;
  /** Bekende order → stap 0 wordt overgeslagen. */
  order?: RetourOrder;
  /** Link van de klantenservice → reden staat vast, kosten € 0. */
  link?: RetourLinkContext;
}) {
  const [stap, setStap] = useState(order ? 1 : 0);
  const [gevonden, setGevonden] = useState<RetourOrder | undefined>(order);
  const [nummer, setNummer] = useState(order?.nummer ?? '');
  const [email, setEmail] = useState(order?.email ?? '');
  const [zoekFout, setZoekFout] = useState<string | null>(null);

  const [gekozen, setGekozen] = useState<Record<string, boolean>>({});
  const [reden, setReden] = useState<Record<string, RedenCode | ''>>({});
  const [toelichting, setToelichting] = useState(link?.toelichting ?? '');
  const [fotoNaam, setFotoNaam] = useState<string | null>(null);
  const [methode, setMethode] = useState<'qr' | 'print'>('qr');
  const [betaald, setBetaald] = useState(false);

  // Bij openen: alles aangevinkt, reden leeg (of vast vanuit de link).
  useEffect(() => {
    if (!open) return;
    const o = order;
    setStap(o ? 1 : 0);
    setGevonden(o);
    setNummer(o?.nummer ?? '');
    setEmail(o?.email ?? '');
    setZoekFout(null);
    const g: Record<string, boolean> = {};
    const r: Record<string, RedenCode | ''> = {};
    o?.artikelen.forEach(a => { g[a.id] = true; r[a.id] = link?.reden ?? 'bedacht'; });
    setGekozen(g); setReden(r);
    setToelichting(link?.toelichting ?? '');
    setFotoNaam(null); setMethode('qr'); setBetaald(false);
  }, [open, order, link]);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);

  const artikelen = gevonden?.artikelen ?? [];
  const geselecteerd = artikelen.filter(a => gekozen[a.id]);
  const waarde = geselecteerd.reduce((s, a) => s + a.prijs, 0);
  const tarief = gevonden ? TARIEF[gevonden.land] : TARIEF.NL;
  const alleRedenenGekozen = geselecteerd.length > 0 && geselecteerd.every(a => reden[a.id]);
  const gratis = link ? true : geselecteerd.length > 0 && geselecteerd.every(a => REDENEN.find(r => r.code === reden[a.id])?.gratis);
  /** Iemand koos een gratis reden (defect/beschadigd/verkeerd/beschrijving) → toelichting + foto verplicht. */
  const gratisReden = !link && geselecteerd.some(a => REDENEN.find(r => r.code === reden[a.id])?.gratis);
  const stap1Compleet = alleRedenenGekozen && (!gratisReden || (toelichting.trim().length >= 10 && !!fotoNaam));
  const kosten = gratis ? 0 : tarief.bedrag;
  const handmatig = false;
  const verzekerd = waarde > 0;
  const uiterlijk = useMemo(() => datumNL(new Date(Date.now() + 14 * 864e5).toISOString()), []);

  const zoek = () => {
    // Mock: alles wat op ORD lijkt + een e-mailadres met @ vinden we.
    if (!/^ORD\d{4,}$/i.test(nummer.trim()) || !email.includes('@')) {
      setZoekFout('We vinden geen bestelling met deze combinatie. Controleer het bestelnummer (staat in je bevestigingsmail) en het e-mailadres waarmee je hebt besteld.');
      return;
    }
    const o = DEMO_ORDER_NL({ nummer: nummer.trim().toUpperCase(), email: email.trim() });
    setGevonden(o);
    const g: Record<string, boolean> = {}; const r: Record<string, RedenCode | ''> = {};
    o.artikelen.forEach(a => { g[a.id] = true; r[a.id] = 'bedacht'; });
    setGekozen(g); setReden(r); setZoekFout(null); setStap(1);
  };

  if (!open) return null;

  const laatsteStapTitel = handmatig && !betaald ? 'Aanvraag ingediend' : 'Je retourlabel staat klaar';

  return (
    <div role="dialog" aria-modal="true" aria-label="Retourzending aanmaken"
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(30,33,51,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 640, maxHeight: 'calc(100vh - 32px)', overflow: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,.25)', fontFamily: 'var(--font)' }}>
        {/* kop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 22px 0' }}>
          <div style={{ width: 34, height: 34, borderRadius: 999, background: '#FDF1E7', display: 'grid', placeItems: 'center', color: '#B85C16', fontWeight: 800 }}>↺</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>Retourzending aanmaken</div>
            {gevonden && <div style={{ fontSize: 12.5, color: '#8A8C99' }}>{gevonden.nummer} · geleverd {datumNL(gevonden.geleverdOp)} · {tarief.zone}</div>}
          </div>
          <button type="button" onClick={onClose} aria-label="Sluiten" style={{ border: 'none', background: 'transparent', fontSize: 22, cursor: 'pointer', color: '#8A8C99', lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: '14px 22px 22px' }}>
          <Stappenbalk actief={stap} links={!!order} />

          {link && stap < 4 && (
            <Melding kleur="grijs" titel={`Aangevraagd door ${link.medewerker} (klantenservice)`}>
              Reden staat vast: <strong style={{ color: 'var(--text)' }}>{REDENEN.find(r => r.code === link.reden)?.label}</strong>.
              De verzendkosten zijn voor ons. {link.toelichting}
            </Melding>
          )}

          {/* ---------- 0 opzoeken ---------- */}
          {stap === 0 && (
            <>
              <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
                <div><label style={label} htmlFor="rw-nr">Bestelnummer</label><input id="rw-nr" style={input} placeholder="ORD000481" value={nummer} onChange={e => setNummer(e.target.value)} /></div>
                <div><label style={label} htmlFor="rw-mail">E-mailadres van de bestelling</label><input id="rw-mail" style={input} type="email" placeholder="jij@example.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
              </div>
              {zoekFout && <div style={{ marginTop: 12 }}><Melding kleur="oranje">{zoekFout}</Melding></div>}
              <div style={{ display: 'flex', gap: 10, marginTop: 16, alignItems: 'center' }}>
                <button type="button" style={knop} onClick={zoek}>Verder</button>
                <span style={{ fontSize: 12, color: '#C7C9D4' }}>demo: ORD000481 + e-mailadres</span>
              </div>
            </>
          )}

          {/* ---------- 1 artikelen + reden ---------- */}
          {stap === 1 && gevonden && (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Wat stuur je terug?</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                {artikelen.map(a => (
                  <div key={a.id} style={{ ...kaartje, borderColor: gekozen[a.id] ? '#E8692A' : 'var(--border)' }}>
                    <label style={{ display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer' }}>
                      <input type="checkbox" checked={!!gekozen[a.id]} onChange={e => setGekozen({ ...gekozen, [a.id]: e.target.checked })} style={{ width: 17, height: 17, accentColor: '#E8692A' }} />
                      <span style={{ flex: 1, minWidth: 0 }}><span style={{ display: 'block', fontSize: 14, fontWeight: 600 }}>{a.naam}</span><span style={{ fontSize: 12.5, color: '#8A8C99' }}>{a.sub}</span></span>
                      <span style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' }}>{eur(a.prijs)}</span>
                    </label>
                    {gekozen[a.id] && (
                      <div style={{ marginTop: 10, marginLeft: 29 }}>
                        <select
                          value={reden[a.id] ?? ''} disabled={!!link}
                          onChange={e => setReden({ ...reden, [a.id]: e.target.value as RedenCode })}
                          style={{ ...input, padding: '9px 11px', fontSize: 14, background: link ? 'var(--surface)' : '#fff' }}
                        >
                          {REDENEN.filter(r => link || r.code !== 'reparatie').map(r => <option key={r.code} value={r.code}>{r.label}{r.gratis ? ' — gratis retour' : ''}</option>)}
                        </select>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <label style={label} htmlFor="rw-toel">Toelichting{gratisReden && !link ? '' : ' (optioneel)'}</label>
              <textarea id="rw-toel" value={toelichting} onChange={e => setToelichting(e.target.value)} rows={2}
                placeholder={gratisReden ? 'Wat is er precies mis? Bijv. sluiter blijft hangen bij 1/1000.' : 'Wil je nog iets kwijt?'} style={{ ...input, resize: 'vertical' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                <label style={{ ...knopLicht, padding: '8px 14px', fontSize: 13.5, display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                  📎 Foto toevoegen{gratisReden && !link ? '' : ' (optioneel)'}
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setFotoNaam(e.target.files?.[0]?.name ?? null)} />
                </label>
                {fotoNaam && <span style={{ fontSize: 12.5, color: '#8A8C99' }}>{fotoNaam}</span>}
              </div>
              {gratisReden && !link && (
                <p style={{ ...p, fontSize: 12.5, margin: '10px 0 0' }}>
                  Bij een defect, schade of verkeerde levering is de retour gratis. Blijkt bij controle dat het product in orde is, dan verrekenen we de retourkosten ({eur(tarief.bedrag)}) met je terugbetaling.
                </p>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18 }}>
                {order ? <span /> : <button type="button" style={knopLicht} onClick={() => setStap(0)}>Terug</button>}
                <button type="button" style={{ ...knop, opacity: stap1Compleet ? 1 : .45 }} disabled={!stap1Compleet} onClick={() => setStap(2)}>Verder</button>
              </div>
            </>
          )}

          {/* ---------- 2 verzendmethode ---------- */}
          {stap === 2 && gevonden && (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Hoe wil je terugsturen?</div>
              <p style={{ ...p, fontSize: 13.5 }}>Met {tarief.vervoerder}, af te geven bij een afgiftepunt in de buurt.</p>
              {(['qr', 'print'] as const).map(m => (
                <label key={m} style={{ ...kaartje, display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', marginBottom: 8, borderColor: methode === m ? '#E8692A' : 'var(--border)' }}>
                  <input type="radio" name="rw-methode" checked={methode === m} onChange={() => setMethode(m)} style={{ marginTop: 3, accentColor: '#E8692A' }} />
                  <span>
                    <span style={{ display: 'block', fontSize: 14, fontWeight: 600 }}>{m === 'qr' ? 'Afgiftepunt — geen printer nodig' : 'Afgiftepunt — label zelf printen'}</span>
                    <span style={{ fontSize: 12.5, color: '#8A8C99' }}>{m === 'qr' ? 'Je krijgt een QR-code; het afgiftepunt print het label voor je.' : 'Je krijgt het label als pdf in je account en per e-mail.'}</span>
                  </span>
                </label>
              ))}
              <p style={{ ...p, fontSize: 12.5 }}>Alles wat erbij zat gaat mee. Haal je geheugenkaart eruit en verpak stevig.</p>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="button" style={knopLicht} onClick={() => setStap(1)}>Terug</button>
                <button type="button" style={knop} onClick={() => setStap(3)}>Verder</button>
              </div>
            </>
          )}

          {/* ---------- 3 overzicht + kosten ---------- */}
          {stap === 3 && gevonden && (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Overzicht</div>
              <div style={{ ...kaartje, marginBottom: 10 }}>
                {geselecteerd.map(a => (
                  <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '4px 0' }}>
                    <span>{a.naam} <span style={{ color: '#8A8C99', fontSize: 12.5 }}>· {REDENEN.find(r => r.code === reden[a.id])?.label}</span></span>
                    <span style={{ fontWeight: 600 }}>{eur(a.prijs)}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid var(--border)', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span>Terug te betalen na controle</span><span style={{ fontWeight: 700 }}>{eur(waarde)}</span>
                </div>
              </div>
              <div style={{ ...kaartje, marginBottom: 12, background: 'var(--surface)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span>Retourzending {tarief.zone} · {tarief.vervoerder} · {methode === 'qr' ? 'QR-code' : 'label printen'}</span>
                  <span style={{ fontWeight: 700 }}>{gratis ? 'Gratis' : eur(kosten)}</span>
                </div>
                {verzekerd && <div style={{ fontSize: 12.5, color: '#1B7F4B', marginTop: 6, fontWeight: 600 }}>✓ Verzekerd tijdens het vervoer voor {eur(waarde)}, zonder extra kosten.</div>}
              </div>
              <p style={{ ...p, fontSize: 12.5, marginBottom: 14 }}>
                Hiermee herroep je de koop van deze artikelen. Je krijgt direct een bevestiging per e-mail met datum en tijd — ook als je het label later regelt.
                Stuur het compleet en in dezelfde staat terug, uiterlijk {uiterlijk}.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button type="button" style={knopLicht} onClick={() => setStap(2)}>Terug</button>
                <button type="button" style={{ ...knop, background: '#E8692A' }}
                  onClick={() => { setBetaald(!handmatig); setStap(4); }}>
                  {handmatig ? 'Aanvraag indienen' : gratis ? 'Retour bevestigen' : `Betalen ${eur(kosten)} en label ontvangen`}
                </button>
              </div>
              {!gratis && !handmatig && <div style={{ fontSize: 12, color: '#8A8C99', marginTop: 8, textAlign: 'right' }}>iDEAL · Bancontact · creditcard · PayPal (via pay.nl)</div>}
            </>
          )}

          {/* ---------- 4 klaar ---------- */}
          {stap === 4 && gevonden && (
            <>
              <Melding kleur="groen" titel={laatsteStapTitel}>
                {betaald || gratis && !handmatig
                  ? <>Het label {methode === 'qr' ? 'en de QR-code staan' : 'staat'} in je account en in je mail. Lever het pakket af bij een {tarief.vervoerder}-afgiftepunt, uiterlijk {uiterlijk}.</>
                  : <>We hebben je aanvraag ontvangen. Je hoort binnen één werkdag van ons; daarna staat je label klaar. Je hoeft nu niets te doen.</>}
              </Melding>

              {(betaald || (gratis && !handmatig)) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                  <div style={{ ...kaartje, textAlign: 'center' }}>
                    <div style={{ width: 96, height: 96, margin: '4px auto 8px', borderRadius: 8, background: 'repeating-linear-gradient(90deg,#1E2133 0 6px,#fff 6px 10px), repeating-linear-gradient(0deg,#1E2133 0 6px,#fff 6px 10px)', backgroundBlendMode: 'multiply' }} aria-hidden="true" />
                    <div style={{ fontSize: 12.5, color: '#8A8C99' }}>{methode === 'qr' ? 'Laat deze QR-code zien bij het afgiftepunt' : 'Label als pdf'}</div>
                    <button type="button" style={{ ...knopLicht, padding: '7px 12px', fontSize: 13, marginTop: 8 }}>{methode === 'qr' ? 'QR-code opslaan' : 'Label downloaden'}</button>
                  </div>
                  <div style={{ ...kaartje, fontSize: 13.5, lineHeight: 1.6 }}>
                    <div style={{ fontWeight: 700, marginBottom: 2 }}>Retouradres</div>
                    Camera-tweedehands.nl B.V.<br />Kerkstraat 47<br />4191 AA Geldermalsen<br />
                    <div style={{ marginTop: 8, fontWeight: 700 }}>Track &amp; trace</div>
                    <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12.5 }}>3SYZXG{Math.abs(gevonden.nummer.length * 7919 % 9000000 + 1000000)}</span>
                  </div>
                </div>
              )}

              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Status</div>
              <ol style={{ listStyle: 'none', margin: '0 0 16px', padding: 0 }}>
                {[
                  ['Aanvraag ontvangen', true],
                  [gratis ? 'Geen kosten' : 'Verzendkosten betaald', betaald || gratis && !handmatig],
                  ['Label aangemaakt', betaald || gratis && !handmatig],
                  ['Pakket onderweg naar ons', false],
                  ['Ontvangen en gecontroleerd', false],
                  ['Terugbetaald', false],
                ].map(([t, done], i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13.5, padding: '4px 0', color: done ? 'var(--text)' : '#A0A2AE' }}>
                    <span style={{ width: 18, height: 18, borderRadius: 999, background: done ? '#1B7F4B' : '#EEEEF2', color: '#fff', fontSize: 11, display: 'grid', placeItems: 'center' }}>{done ? '✓' : ''}</span>{t as string}
                  </li>
                ))}
              </ol>
              <p style={{ ...p, fontSize: 12.5 }}>Terugbetaling binnen 3 tot 5 werkdagen na ontvangst. Alles staat ook onder Mijn account › Bestellingen › {gevonden.nummer}.</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" style={knop} onClick={onClose}>Sluiten</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- demo-orders ---------- */
export const DEMO_ORDER_NL = (over: Partial<RetourOrder> = {}): RetourOrder => ({
  nummer: 'ORD000481', email: 'jij@example.com', land: 'NL', geleverdOp: '2026-08-12',
  artikelen: [
    { id: 'a1', naam: 'Canon EOS R6 Mark II', sub: 'Zeer goed · SKU 21326', prijs: 1999 },
    { id: 'a2', naam: 'Canon RF 24-105mm f/4 L IS USM', sub: 'Goed · SKU 19685', prijs: 699 },
  ],
  ...over,
});
export const DEMO_ORDER_BE: RetourOrder = {
  nummer: 'ORD000512', email: 'lien@example.be', land: 'BE', geleverdOp: '2026-08-14',
  artikelen: [{ id: 'b1', naam: 'Fujifilm X-T4 body', sub: 'Goed · SKU 20911', prijs: 849 }],
};
export const DEMO_LINK_REPARATIE: RetourLinkContext = {
  reden: 'reparatie', medewerker: 'Eva',
  toelichting: 'Zoals besproken: sluiter hapert. Stuur de body zonder lens en zonder geheugenkaart.',
};

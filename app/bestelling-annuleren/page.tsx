'use client';

import { useState } from 'react';
import Link from 'next/link';
import SimplePage from '@/components/layout/SimplePage';

/**
 * Herroepingsfunctie — verplicht sinds 19 juni 2026 (EU 2023/2673, art. 11a).
 *
 * Opzet in twee stappen:
 *   1. Bestelling opzoeken op bestelnummer + e-mail. Daar valt de leverdatum uit,
 *      en dus of de bedenktijd nog loopt. Ook of het een zakelijke order is.
 *   2. Annulering bevestigen, met de producten erbij.
 *
 * Drie uitkomsten na stap 1: binnen de termijn, termijn verstreken, of zakelijk.
 * Bij de laatste twee bestaat er geen herroepingsrecht, dus dan is contact de
 * route. Belangrijk: nooit hard blokkeren. Klopt onze datum niet, dan moet de
 * klant er alsnog langs kunnen — vandaar de fallback onderaan elke melding.
 *
 * De producten staan standaard allemaal aangevinkt. Zo is er geen extra
 * handeling nodig om te annuleren; wie alles terugstuurt klikt gewoon door.
 */

type Uitkomst = 'geen' | 'binnen' | 'telaat' | 'zakelijk';

const REGELS = [
  { naam: 'Canon EOS R6 Mark II', sub: 'Zeer goed · SKU 21326', prijs: '€ 1.999,00' },
  { naam: 'Canon RF 24-105mm f/4 L IS USM', sub: 'Goed · SKU 19685', prijs: '€ 699,00' },
  { naam: 'SanDisk Extreme Pro 128 GB', sub: 'Nieuw · SKU 20845', prijs: '€ 39,00' },
];

const h2: React.CSSProperties = { fontSize: 20, fontWeight: 700, margin: '38px 0 10px' };
const p: React.CSSProperties = { fontSize: 14.5, color: 'var(--text-sec)', margin: '0 0 14px', lineHeight: 1.65 };
const label: React.CSSProperties = {
  display: 'block', fontSize: 12.5, fontWeight: 700, letterSpacing: '.04em',
  textTransform: 'uppercase', color: '#8A8C99', marginBottom: 6,
};
const input: React.CSSProperties = {
  width: '100%', padding: '11px 13px', fontSize: 14.5, borderRadius: 9,
  border: '1.5px solid var(--border)', background: '#fff', color: 'var(--text)', fontFamily: 'inherit',
};
const kaart: React.CSSProperties = {
  background: '#fff', border: '1.5px solid #EEEEF2', borderRadius: 14, padding: '22px 24px',
};
const stapNr: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24,
  borderRadius: 999, background: '#1E2133', color: '#fff', fontSize: 13, fontWeight: 700, flex: '0 0 auto',
};

function Melding({ kleur, titel, children }: { kleur: 'groen' | 'oranje'; titel: string; children: React.ReactNode }) {
  const tinten = kleur === 'groen'
    ? { bg: '#E8F5EE', rand: '#BFE3CF', tekst: '#1B7F4B' }
    : { bg: '#FDF1E7', rand: '#F5D5BB', tekst: '#B85C16' };
  return (
    <div style={{ background: tinten.bg, border: `1px solid ${tinten.rand}`, borderRadius: 11, padding: '14px 16px', marginBottom: 18 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: tinten.tekst, marginBottom: 5 }}>{titel}</div>
      <div style={{ fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

export default function BestellingAnnulerenPage() {
  const [uitkomst, setUitkomst] = useState<Uitkomst>('geen');
  const [klaar, setKlaar] = useState(false);

  return (
    <SimplePage
      title="Bestelling annuleren"
      breadcrumb="Bestelling annuleren"
      parent={{ label: 'Klantenservice', href: '/customer-service' }}
      eyebrow="Klantenservice"
      image="/images/hero-photographer-2.jpg"
      intro="Van gedachten veranderd? Je hebt veertien dagen na ontvangst om je aankoop te annuleren, zonder dat je hoeft uit te leggen waarom. Zoek hieronder je bestelling op, dan regelen we het in twee stappen."
    >
      {/* Alleen voor deze referentiepagina: schakelaar om de drie uitkomsten te tonen. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 20, fontSize: 12.5, color: '#8A8C99' }}>
        <span style={{ fontWeight: 700 }}>Voorbeeld tonen:</span>
        {([['binnen', 'binnen de termijn'], ['telaat', 'termijn verstreken'], ['zakelijk', 'zakelijke order']] as const).map(([k, l]) => (
          <button
            key={k}
            type="button"
            onClick={() => { setUitkomst(k); setKlaar(false); }}
            style={{
              padding: '4px 11px', borderRadius: 999, fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit',
              border: `1px solid ${uitkomst === k ? '#E8692A' : 'var(--border)'}`,
              background: uitkomst === k ? '#FDF1E7' : '#fff',
              color: uitkomst === k ? '#B85C16' : 'var(--text-sec)',
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* ---------- Stap 1 ---------- */}
      <div style={{ ...kaart, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={stapNr}>1</span>
          <span style={{ fontSize: 17, fontWeight: 700 }}>Zoek je bestelling op</span>
        </div>
        <p style={{ ...p, fontSize: 13.5, margin: '0 0 18px 34px' }}>
          Je bestelnummer staat in je bevestigingsmail. Inloggen is niet nodig.
        </p>

        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', marginLeft: 34 }}>
          <div>
            <label style={label} htmlFor="ordernr">Bestelnummer</label>
            <input style={input} id="ordernr" placeholder="ORD000123" />
          </div>
          <div>
            <label style={label} htmlFor="email">E-mailadres</label>
            <input style={input} id="email" type="email" placeholder="jij@example.com" />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setUitkomst(uitkomst === 'geen' ? 'binnen' : uitkomst)}
          style={{
            marginLeft: 34, marginTop: 16, padding: '11px 22px', fontSize: 14.5, fontWeight: 700,
            color: '#fff', background: '#1E2133', border: 'none', borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Bestelling opzoeken
        </button>
      </div>

      {/* ---------- Stap 2, afhankelijk van de uitkomst ---------- */}
      {uitkomst !== 'geen' && (
        <div style={kaart}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <span style={{ ...stapNr, background: uitkomst === 'binnen' ? '#1E2133' : '#C7C9D4' }}>2</span>
            <span style={{ fontSize: 17, fontWeight: 700 }}>
              {uitkomst === 'binnen' ? 'Bevestig je annulering' : 'Neem contact met ons op'}
            </span>
          </div>

          <div style={{ marginLeft: 34 }}>
            {uitkomst === 'binnen' && !klaar && (
              <>
                <Melding kleur="groen" titel="Bestelling gevonden">
                  ORD000481, geleverd op 12 augustus 2026. Je kunt deze aankoop nog annuleren
                  <strong style={{ color: 'var(--text)' }}> tot en met 26 augustus</strong>.
                </Melding>

                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Wat stuur je terug?</div>
                <p style={{ ...p, fontSize: 13.5, marginBottom: 12 }}>
                  Alles staat aangevinkt. Stuur je maar een deel terug, vink dan af wat je houdt.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
                  {REGELS.map(r => (
                    <label key={r.naam} style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px',
                      border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer',
                    }}>
                      <input type="checkbox" defaultChecked style={{ width: 17, height: 17, accentColor: '#E8692A' }} />
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{r.naam}</span>
                        <span style={{ display: 'block', fontSize: 12.5, color: '#8A8C99', marginTop: 1 }}>{r.sub}</span>
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' }}>{r.prijs}</span>
                    </label>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setKlaar(true)}
                  style={{
                    padding: '13px 26px', fontSize: 15, fontWeight: 700, color: '#fff', background: '#E8692A',
                    border: 'none', borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Annulering bevestigen
                </button>
                <p style={{ fontSize: 12.5, color: '#8A8C99', margin: '10px 0 0', lineHeight: 1.55 }}>
                  Je krijgt direct een bevestiging per e-mail, met de datum en het tijdstip erin.
                </p>
              </>
            )}

            {uitkomst === 'binnen' && klaar && (
              <>
                <Melding kleur="groen" titel="Je annulering is geregistreerd">
                  De bevestiging is onderweg naar je mailbox, met de datum en het tijdstip erin. Hieronder
                  staat je retourlabel; je hebt veertien dagen om het pakket op de post te doen.
                </Melding>
                <button
                  type="button"
                  style={{
                    padding: '13px 26px', fontSize: 15, fontWeight: 700, color: '#fff', background: '#1E2133',
                    border: 'none', borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Retourlabel en pakbon downloaden
                </button>
                <p style={{ fontSize: 12.5, color: '#8A8C99', margin: '10px 0 0', lineHeight: 1.55 }}>
                  Ook meegestuurd per mail, dus je kunt dit scherm rustig sluiten.
                </p>
              </>
            )}

            {uitkomst === 'telaat' && (
              <>
                <Melding kleur="oranje" titel="De bedenktijd is verstreken">
                  ORD000312 is geleverd op 3 juli 2026. De veertien dagen liepen daarmee af op 17 juli,
                  dus annuleren kan niet meer.
                </Melding>
                <p style={p}>
                  Dat betekent niet dat wij niets voor je kunnen doen. <strong style={{ color: 'var(--text)' }}>Je
                  garantie loopt gewoon door</strong>, dus is er iets mis met het toestel, dan lossen wij dat op.
                  En zit je ermee in je maag om een andere reden, bel ons dan even — vaak is er meer mogelijk
                  dan je denkt.
                </p>
                <p style={{ ...p, marginBottom: 0 }}>
                  Bel <a href="tel:+31853018332" style={{ color: 'var(--accent)' }}>085 301 83 32</a> of mail{' '}
                  <a href="mailto:klantenservice@camera-tweedehands.nl" style={{ color: 'var(--accent)' }}>klantenservice@camera-tweedehands.nl</a>.
                </p>
              </>
            )}

            {uitkomst === 'zakelijk' && (
              <>
                <Melding kleur="oranje" titel="Dit is een zakelijke bestelling">
                  ORD000377 is geplaatst op een zakelijk account. Het wettelijke herroepingsrecht geldt
                  alleen voor particuliere aankopen, dus het geldt hier niet.
                </Melding>
                <p style={p}>
                  Wij kijken wel altijd wat er mogelijk is. <strong style={{ color: 'var(--text)' }}>Je garantie
                  geldt onverkort</strong>, en is er iets mis of past het toestel niet bij het werk waarvoor je
                  het kocht, neem dan contact op. Dan zoeken we samen naar een oplossing.
                </p>
                <p style={{ ...p, marginBottom: 0 }}>
                  Bel <a href="tel:+31853018332" style={{ color: 'var(--accent)' }}>085 301 83 32</a> of mail{' '}
                  <a href="mailto:klantenservice@camera-tweedehands.nl" style={{ color: 'var(--accent)' }}>klantenservice@camera-tweedehands.nl</a>.
                </p>
              </>
            )}

            {uitkomst !== 'binnen' && (
              <p style={{ fontSize: 12.5, color: '#8A8C99', margin: '16px 0 0', lineHeight: 1.55 }}>
                Klopt onze datum niet, of is deze bestelling toch particulier geplaatst? Laat het weten,
                dan zetten wij het recht.
              </p>
            )}
          </div>
        </div>
      )}

      <h2 style={h2}>Wat er daarna gebeurt</h2>
      <ol style={{ margin: '0 0 16px', paddingLeft: 20, fontSize: 14.5, color: 'var(--text-sec)', lineHeight: 1.8 }}>
        <li>Je annulering staat geregistreerd op het moment dat je bevestigt. Daar hangt verder niets aan vast.</li>
        <li>De bevestigingsmail met datum en tijdstip gaat er meteen uit.</li>
        <li>Je hebt <strong style={{ color: 'var(--text)' }}>veertien dagen</strong> om het pakket op de post te doen.</li>
        <li>Wij betalen binnen veertien dagen na ontvangst terug, inclusief de verzendkosten die je bij de bestelling hebt betaald.</li>
      </ol>
      <p style={p}>
        De kosten van het terugsturen zijn voor jou, tenzij het product defect of verkeerd geleverd is.
        Dan nemen wij ze voor onze rekening.
      </p>
      <p style={p}>
        Heb je een account? Dan kun je ook vanuit je bestelling starten, met alles al ingevuld. Het is
        geen voorwaarde &mdash; dit formulier werkt zonder in te loggen.
      </p>

      <h2 style={h2}>Wat je met het product mag doen</h2>
      <p style={p}>
        Uitproberen zoals je in een winkel zou doen: uitpakken, vasthouden, instellen en een aantal
        opnamen maken. Daar is de bedenktijd voor.
      </p>
      <p style={p}>
        Gebruik je het duidelijk verder dan uitproberen, dan mogen wij de waardevermindering verrekenen.
        Om daar geen discussie over te krijgen hanteren wij één harde grens: bij een camera rekenen wij
        <strong style={{ color: 'var(--text)' }}> tot 200 opnamen</strong> als uitproberen. Daarboven
        brengen wij het verschil in dagwaarde in mindering.
      </p>
      <p style={{ ...p, marginBottom: 0 }}>
        Stuur het toestel terug met alles wat erbij zat, en verpak het stevig genoeg om de reis te
        doorstaan. Wat wij per staat hanteren lees je bij{' '}
        <Link href="/quality-grading" style={{ color: 'var(--accent)' }}>productcondities</Link>.
      </p>
    </SimplePage>
  );
}

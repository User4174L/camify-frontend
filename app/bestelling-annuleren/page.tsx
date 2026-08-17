'use client';

import { useState } from 'react';
import Link from 'next/link';
import SimplePage from '@/components/layout/SimplePage';
import RetourWizard, { DEMO_ORDER_NL } from '@/components/returns/RetourWizard';

/**
 * Herroepingsfunctie — verplicht sinds 19 juni 2026 (EU 2023/2673, art. 11a).
 *
 * Twee stappen: bestelling opzoeken, dan bevestigen. Vier uitkomsten na stap 1:
 *   binnen de termijn  → herroepen kan
 *   termijn verstreken → geen herroeping meer, wel garantie en contact
 *   zakelijke order    → geen wettelijk herroepingsrecht
 *   winkelverkoop      → geen koop op afstand, dus geen bedenktijd
 *
 * Opzoeken kan alleen op ordernummer ÉN e-mailadres. Ordernummers lopen op, dus
 * met alleen een nummer zou je de bestelling van een ander kunnen annuleren. Het
 * e-mailadres is bovendien wettelijk onderdeel van de verklaring (art. 11a eist
 * elektronische contactgegevens).
 *
 * Nooit hard blokkeren: onder elke afwijzing een route naar de klantenservice.
 * Klopt onze leverdatum niet, dan mag dat iemands recht niet kosten.
 *
 * Inruilregels staan niet in de lijst: wat aan ons verkocht is, kan niet retour.
 */

type Uitkomst = 'geen' | 'binnen' | 'telaat' | 'zakelijk' | 'winkel';

const GEKOCHT = [
  { naam: 'Canon EOS R6 Mark II', sub: 'Zeer goed · SKU 21326', prijs: '€ 1.999,00' },
  { naam: 'Canon RF 24-105mm f/4 L IS USM', sub: 'Goed · SKU 19685', prijs: '€ 699,00' },
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
const knopDonker: React.CSSProperties = {
  padding: '13px 26px', fontSize: 15, fontWeight: 700, color: '#fff', background: '#1E2133',
  border: 'none', borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit',
};

function Melding({ kleur, titel, children }: { kleur: 'groen' | 'oranje'; titel: string; children: React.ReactNode }) {
  const t = kleur === 'groen'
    ? { bg: '#E8F5EE', rand: '#BFE3CF', tekst: '#1B7F4B' }
    : { bg: '#FDF1E7', rand: '#F5D5BB', tekst: '#B85C16' };
  return (
    <div style={{ background: t.bg, border: `1px solid ${t.rand}`, borderRadius: 11, padding: '14px 16px', marginBottom: 18 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: t.tekst, marginBottom: 5 }}>{titel}</div>
      <div style={{ fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

function ContactRegel() {
  return (
    <p style={{ ...p, marginBottom: 0 }}>
      Bel <a href="tel:+31853018332" style={{ color: 'var(--accent)' }}>085 301 83 32</a> of mail{' '}
      <a href="mailto:klantenservice@camera-tweedehands.nl" style={{ color: 'var(--accent)' }}>klantenservice@camera-tweedehands.nl</a>.
    </p>
  );
}

export default function BestellingAnnulerenPage() {
  const [uitkomst, setUitkomst] = useState<Uitkomst>('geen');
  const [klaar, setKlaar] = useState(false);
  const [retourOpen, setRetourOpen] = useState(false);

  // De uiterste verzenddatum is de dag van de aanvraag plus veertien dagen.
  // In de echte app komt die uit het systeem; hier gerekend vanaf vandaag.
  const uiterlijk = new Date(Date.now() + 14 * 864e5).toLocaleDateString('nl-NL', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const isAfwijzing = uitkomst === 'telaat' || uitkomst === 'zakelijk' || uitkomst === 'winkel';

  return (
    <SimplePage
      title="Bestelling annuleren"
      breadcrumb="Bestelling annuleren"
      parent={{ label: 'Klantenservice', href: '/customer-service' }}
      eyebrow="Klantenservice"
      image="/images/hero-photographer-2.jpg"
      intro="Van gedachten veranderd? Je hebt veertien dagen na ontvangst om je online aankoop te annuleren, zonder dat je hoeft uit te leggen waarom. Zoek hieronder je bestelling op, dan regelen we het in twee stappen."
    >
      {/* Het hele proces in één oogopslag, vóór het formulier. Wie weet wat er komt,
          belt niet halverwege om te vragen hoe het zit. */}
      <div style={{
        display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit,minmax(168px,1fr))', margin: '0 0 26px',
      }}>
        {[
          { n: 1, t: 'Opzoeken', d: 'Bestelnummer en e-mailadres' },
          { n: 2, t: 'Bevestigen', d: 'Kies wat terugkomt' },
          { n: 3, t: 'Terugsturen', d: 'Met het label uit de mail' },
          { n: 4, t: 'Geld terug', d: '3 tot 5 werkdagen na controle' },
        ].map(s => (
          <div key={s.n} style={{
            background: '#fff', border: '1.5px solid #EEEEF2', borderRadius: 12, padding: '15px 16px',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22,
              borderRadius: 999, background: '#FDF1E7', color: '#B85C16', fontSize: 12, fontWeight: 700,
              marginBottom: 9,
            }}>
              {s.n}
            </div>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>{s.t}</div>
            <div style={{ fontSize: 12.5, color: '#8A8C99', lineHeight: 1.5 }}>{s.d}</div>
          </div>
        ))}
      </div>

      {/* Alleen voor deze referentiepagina: schakelaar om de uitkomsten te tonen. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 20, fontSize: 12.5, color: '#8A8C99' }}>
        <span style={{ fontWeight: 700 }}>Voorbeeld tonen:</span>
        {([['binnen', 'binnen de termijn'], ['telaat', 'termijn verstreken'], ['zakelijk', 'zakelijke order'], ['winkel', 'winkelverkoop']] as const).map(([k, l]) => (
          <button
            key={k} type="button" onClick={() => { setUitkomst(k); setKlaar(false); }}
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
          Je bestelnummer staat in je bevestigingsmail. Wij vragen ook je e-mailadres, zodat niemand
          anders jouw bestelling kan annuleren. Inloggen is niet nodig.
        </p>

        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', marginLeft: 34 }}>
          <div>
            <label style={label} htmlFor="ordernr">Bestelnummer</label>
            <input style={input} id="ordernr" placeholder="ORD000123" />
          </div>
          <div>
            <label style={label} htmlFor="email">E-mailadres van de bestelling</label>
            <input style={input} id="email" type="email" placeholder="jij@example.com" />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setUitkomst(uitkomst === 'geen' ? 'binnen' : uitkomst)}
          style={{ ...knopDonker, marginLeft: 34, marginTop: 16, padding: '11px 22px', fontSize: 14.5 }}
        >
          Bestelling opzoeken
        </button>
      </div>

      {/* ---------- Stap 2 ---------- */}
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
                  ORD000481, geleverd op 12 augustus 2026. Je kunt deze aankoop nog annuleren.
                </Melding>

                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Wat stuur je terug?</div>
                <p style={{ ...p, fontSize: 13.5, marginBottom: 12 }}>
                  Alles staat aangevinkt. Stuur je maar een deel terug, vink dan af wat je houdt.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                  {GEKOCHT.map(r => (
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

                <button type="button" onClick={() => setKlaar(true)} style={{ ...knopDonker, background: '#E8692A' }}>
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
                  De bevestiging is onderweg naar je mailbox, met de datum en het tijdstip erin. In die
                  mail zit ook een pdf met het retouradres en de producten die je terugstuurt.
                </Melding>
                <p style={p}>
                  Stuur het pakket het liefst zo snel mogelijk terug, maar in elk geval{' '}
                  <strong style={{ color: 'var(--text)' }}>uiterlijk {uiterlijk}</strong>. Stuur je later
                  terug, dan kunnen wij het niet meer als annulering verwerken en kunnen wij kosten in
                  rekening brengen.
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button type="button" style={{ ...knopDonker, background: '#E8692A' }} onClick={() => setRetourOpen(true)}>
                    Retourzending aanmaken
                  </button>
                  <button type="button" style={{ ...knopDonker, background: '#fff', color: 'var(--text)', border: '1.5px solid var(--border)' }}>Retourformulier downloaden</button>
                </div>
                <p style={{ fontSize: 12.5, color: '#8A8C99', margin: '10px 0 0', lineHeight: 1.55 }}>
                  Met &lsquo;Retourzending aanmaken&rsquo; kies je meteen wat teruggaat, betaal je de retourkosten en
                  krijg je je label of QR-code. Liever later? Het formulier zit ook als pdf bij de bevestigingsmail.
                </p>
                <RetourWizard open={retourOpen} onClose={() => setRetourOpen(false)} order={DEMO_ORDER_NL()} />
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
                  garantie loopt gewoon door</strong>, dus is er iets mis met het toestel, dan lossen wij dat
                  op. En zit je er om een andere reden mee, bel dan even &mdash; vaak is er meer mogelijk
                  dan je denkt.
                </p>
                <ContactRegel />
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
                  geldt onverkort</strong>, en past het toestel niet bij het werk waarvoor je het kocht, neem
                  dan contact op. Dan zoeken we samen naar een oplossing.
                </p>
                <ContactRegel />
              </>
            )}

            {uitkomst === 'winkel' && (
              <>
                <Melding kleur="oranje" titel="Dit is een aankoop in de showroom">
                  ORD000290 is in onze winkel in Geldermalsen afgerekend. De wettelijke bedenktijd geldt
                  voor aankopen op afstand en niet voor aankopen in een winkel.
                </Melding>
                <p style={p}>
                  Die regel bestaat omdat je bij een online aankoop het product niet vooraf kunt zien.
                  In de showroom is dat anders, en daarom kent de wet daar geen bedenktijd.
                </p>
                <p style={p}>
                  <strong style={{ color: 'var(--text)' }}>Je garantie geldt onverkort</strong>, dus is er
                  iets mis met het toestel, dan lossen wij dat op. En loop je ergens tegenaan, kom dan
                  gerust langs of bel ons even &mdash; we kijken altijd wat er mogelijk is.
                </p>
                <ContactRegel />
              </>
            )}

            {isAfwijzing && (
              <p style={{ fontSize: 12.5, color: '#8A8C99', margin: '16px 0 0', lineHeight: 1.55 }}>
                Klopt onze datum niet, of is deze bestelling toch particulier en op afstand geplaatst?
                Laat het weten, dan zetten wij het recht.
              </p>
            )}
          </div>
        </div>
      )}

      <h2 style={h2}>Wat er daarna gebeurt</h2>
      <ol style={{ margin: '0 0 16px', paddingLeft: 20, fontSize: 14.5, color: 'var(--text-sec)', lineHeight: 1.8 }}>
        <li>Je annulering staat geregistreerd op het moment dat je bevestigt.</li>
        <li>De bevestigingsmail gaat er meteen uit, met datum, tijdstip en een pdf met het retouradres en je producten.</li>
        <li>Je stuurt het pakket terug, het liefst meteen en uiterlijk veertien dagen na je aanvraag.</li>
        <li>Wij controleren het pakket en betalen binnen <strong style={{ color: 'var(--text)' }}>drie tot vijf werkdagen</strong> terug.</li>
      </ol>
      <p style={p}>
        Stuur je je hele bestelling terug, dan krijg je ook de verzendkosten terug die je bij het
        bestellen hebt betaald. Bij een gedeeltelijke retour vergoeden wij die niet, want de zending is
        dan gewoon gemaakt.
      </p>
      <p style={p}>
        De kosten van het terugsturen zijn voor jou, tenzij het product defect of verkeerd geleverd is.
        Dan nemen wij ze voor onze rekening. Bewaar je verzendbewijs tot je het geld hebt ontvangen.
      </p>
      <p style={p}>
        Heb je een account? Dan kun je ook vanuit je bestelling starten, met alles al ingevuld. Het is
        geen voorwaarde &mdash; dit formulier werkt zonder in te loggen.
      </p>

      <h2 style={h2}>Hoe het toestel terug moet komen</h2>
      <p style={p}>
        Je mag het uitproberen zoals je in een winkel zou doen: uitpakken, vasthouden, instellen en een
        aantal opnamen maken. Daar is de bedenktijd voor. Verder gaan mag ook, maar dan verrekenen wij
        de waardevermindering.
      </p>
      <p style={p}>
        Om daar geen discussie over te krijgen hanteren wij één duidelijke grens: bij een camera rekenen
        wij <strong style={{ color: 'var(--text)' }}>tot 200 opnamen</strong> als uitproberen. Daarboven
        brengen wij het verschil in dagwaarde in mindering. Datzelfde geldt als er iets ontbreekt of
        beschadigd is geraakt.
      </p>

      <div style={{ ...kaart, padding: '20px 22px', marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Loop dit even na voor je inpakt</div>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14.5, color: 'var(--text-sec)', lineHeight: 1.85 }}>
          <li>Alles wat erbij zat gaat mee: accu, lader, doppen, riem, kabels en de doos.</li>
          <li>Het toestel is in dezelfde staat als toen je het kreeg.</li>
          <li><strong style={{ color: 'var(--text)' }}>Haal je geheugenkaart eruit.</strong> Wij kunnen niet aansprakelijk zijn voor kaarten of foto&rsquo;s die meekomen.</li>
          <li>Verpak het stevig genoeg om de reis te doorstaan, het liefst in de doos waarin je het ontving.</li>
          <li>Doe het retourformulier erbij, of print hem uit de bevestigingsmail.</li>
          <li>Bewaar je verzendbewijs tot het geld op je rekening staat.</li>
        </ul>
      </div>

      <p style={{ ...p, marginBottom: 0 }}>
        Wat wij per staat hanteren lees je bij{' '}
        <Link href="/quality-grading" style={{ color: 'var(--accent)' }}>productcondities</Link>.
      </p>
    </SimplePage>
  );
}

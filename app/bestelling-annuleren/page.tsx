'use client';

import { useState } from 'react';
import Link from 'next/link';
import SimplePage from '@/components/layout/SimplePage';

/**
 * Herroepingsfunctie — wettelijk verplicht sinds 19 juni 2026 (EU-richtlijn
 * 2023/2673, artikel 11a van de Richtlijn consumentenrechten).
 *
 * De wet stelt vier harde eisen, en die bepalen de opbouw van deze pagina:
 *  1. Een knop met het opschrift "hier de overeenkomst herroepen" of een
 *     ondubbelzinnig alternatief. "Bestelling annuleren" wordt in de
 *     toelichting expliciet als toegestaan alternatief genoemd.
 *  2. Een herroepingsfunctie waarin de klant naam, gegevens ter identificatie
 *     van de overeenkomst en elektronische contactgegevens opgeeft.
 *  3. Een aparte bevestigingsfunctie ("herroeping bevestigen").
 *  4. Onverwijld een ontvangstbevestiging op een duurzame gegevensdrager, met
 *     de inhoud, datum en tijd van de melding.
 *
 * Verder: geen inlog, geen telefoontje, en de knop moet de hele
 * herroepingstermijn bereikbaar zijn. Alleen verwijzen naar een mailadres of
 * een printbaar modelformulier voldoet sinds 19 juni 2026 niet meer.
 *
 * Bewust ontwerp: de hulpoptie staat NAAST het formulier, niet ervoor. Een
 * tussenscherm dat je eerst moet wegklikken is een extra stap, en de wet eist
 * dat herroepen minstens zo makkelijk is als bestellen.
 */

const h2: React.CSSProperties = { fontSize: 20, fontWeight: 700, margin: '36px 0 10px' };
const p: React.CSSProperties = { fontSize: 14.5, color: 'var(--text-sec)', margin: '0 0 14px', lineHeight: 1.65 };
const label: React.CSSProperties = {
  display: 'block', fontSize: 12.5, fontWeight: 700, letterSpacing: '.04em',
  textTransform: 'uppercase', color: '#8A8C99', marginBottom: 6,
};
const input: React.CSSProperties = {
  width: '100%', padding: '11px 13px', fontSize: 14.5, borderRadius: 9,
  border: '1.5px solid var(--border)', background: '#fff', color: 'var(--text)',
  fontFamily: 'inherit',
};

export default function BestellingAnnulerenPage() {
  const [bevestigd, setBevestigd] = useState(false);

  return (
    <SimplePage
      title="Bestelling annuleren"
      breadcrumb="Bestelling annuleren"
      parent={{ label: 'Klantenservice', href: '/customer-service' }}
      intro="Hiermee herroep je je aankoop. Vul je gegevens in, bevestig, en je krijgt direct een bevestiging per e-mail. Inloggen of bellen is niet nodig."
    >
      <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', margin: '0 0 8px' }}>
        {/* De herroepingsfunctie zelf. Staat bovenaan en is de eerste interactie
            op de pagina — geen drempel ervoor. */}
        <form
          onSubmit={e => { e.preventDefault(); setBevestigd(true); }}
          style={{ background: '#fff', border: '1.5px solid #EEEEF2', borderRadius: 14, padding: '22px 24px' }}
        >
          {bevestigd ? (
            /* Stap 2: de logistiek. Bewust NA de bevestiging, want de herroeping is
               op dat moment al rechtsgeldig. Zou je het aanvinken vóór de bevestiging
               eisen, dan hang je een voorwaarde aan een wettelijk recht. */
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 700,
                color: '#1B7F4B', background: '#E8F5EE', borderRadius: 999, padding: '5px 12px', marginBottom: 12,
              }}>
                Herroeping geregistreerd
              </div>
              <p style={{ ...p, marginBottom: 18 }}>
                Je bestelling is herroepen. De bevestiging met datum en tijdstip is onderweg naar je
                mailbox. <strong style={{ color: 'var(--text)' }}>Vanaf hier is het alleen nog
                praktisch.</strong>
              </p>

              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Wat stuur je terug?</div>
              <p style={{ ...p, fontSize: 13.5, marginBottom: 12 }}>
                Vink aan wat er terugkomt, dan maken wij het label en de pakbon voor je klaar.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 16 }}>
                {[
                  { naam: 'Canon EOS R6 Mark II', sub: 'Zeer goed · SKU 21326', prijs: '€ 1.999,00' },
                  { naam: 'Canon RF 24-105mm f/4 L IS USM', sub: 'Goed · SKU 19685', prijs: '€ 699,00' },
                  { naam: 'SanDisk Extreme Pro 128 GB', sub: 'Nieuw · SKU 20845', prijs: '€ 39,00' },
                ].map(r => (
                  <label
                    key={r.naam}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px',
                      border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer',
                    }}
                  >
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
                style={{
                  width: '100%', padding: '13px 18px', fontSize: 15, fontWeight: 700, color: '#fff',
                  background: '#E8692A', border: 'none', borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Retourlabel aanmaken
              </button>
              <p style={{ fontSize: 12.5, color: '#8A8C99', margin: '10px 0 0', lineHeight: 1.55 }}>
                Sluit je dit scherm? Geen probleem, je herroeping staat al geregistreerd. In de
                bevestigingsmail zit een link waarmee je hier terugkomt.
              </p>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Herroepingsformulier</div>
              <p style={{ ...p, fontSize: 13.5, marginBottom: 18 }}>
                Alle velden zijn nodig om je bestelling terug te vinden.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={label} htmlFor="ordernr">Bestelnummer</label>
                  <input style={input} id="ordernr" name="ordernr" placeholder="ORD000123" required />
                </div>
                <div>
                  <label style={label} htmlFor="naam">Naam</label>
                  <input style={input} id="naam" name="naam" placeholder="Voor- en achternaam" required />
                </div>
                <div>
                  <label style={label} htmlFor="email">E-mailadres</label>
                  <input style={input} id="email" name="email" type="email" placeholder="jij@example.com" required />
                  <p style={{ fontSize: 12.5, color: '#8A8C99', margin: '6px 0 0', lineHeight: 1.5 }}>
                    Hier sturen wij de bevestiging naartoe.
                  </p>
                </div>
                <div>
                  <label style={label} htmlFor="wat">Wat wil je terugsturen?</label>
                  <select style={input} id="wat" name="wat" defaultValue="alles">
                    <option value="alles">De hele bestelling</option>
                    <option value="deel">Een deel van de bestelling</option>
                  </select>
                </div>
                <div>
                  <label style={label} htmlFor="reden">Reden (niet verplicht)</label>
                  <select style={input} id="reden" name="reden" defaultValue="">
                    <option value="">Liever niet zeggen</option>
                    <option>Voldoet niet aan de verwachting</option>
                    <option>Verkeerd besteld</option>
                    <option>Product werkt niet naar behoren</option>
                    <option>Te laat geleverd</option>
                    <option>Anders</option>
                  </select>
                  <p style={{ fontSize: 12.5, color: '#8A8C99', margin: '6px 0 0', lineHeight: 1.5 }}>
                    Je hoeft geen reden op te geven. Het helpt ons wel om het beter te doen.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%', marginTop: 20, padding: '13px 18px', fontSize: 15, fontWeight: 700,
                  color: '#fff', background: '#1E2133', border: 'none', borderRadius: 999, cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Herroeping bevestigen
              </button>
              <p style={{ fontSize: 12.5, color: '#8A8C99', margin: '10px 0 0', lineHeight: 1.5 }}>
                Je ontvangt direct een bevestiging per e-mail met de datum en het tijdstip.
              </p>
            </>
          )}
        </form>

        {/* Hulpaanbod NAAST het formulier. Nadrukkelijk geen tussenstap: de wet
            eist dat herroepen minstens zo eenvoudig is als bestellen. */}
        <aside style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '22px 24px' }}>
          <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>Is er iets anders aan de hand?</div>
          <p style={{ ...p, fontSize: 14 }}>
            Je hoeft hier niets mee te doen, het formulier hiernaast werkt gewoon. Maar soms is er een
            snellere oplossing dan terugsturen.
          </p>
          <ul style={{ margin: '0 0 16px', paddingLeft: 18, fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.7 }}>
            <li><strong style={{ color: 'var(--text)' }}>Werkt iets niet?</strong> Vaak lossen wij het op of ruilen wij om, ook na de veertien dagen.</li>
            <li><strong style={{ color: 'var(--text)' }}>Twijfel je of het het juiste toestel is?</strong> Bel ons, dan denken we mee.</li>
            <li><strong style={{ color: 'var(--text)' }}>Is er iets beschadigd aangekomen?</strong> Dan regelen wij het transport en de kosten.</li>
          </ul>
          <p style={{ ...p, marginBottom: 0 }}>
            Bel <a href="tel:+31853018332" style={{ color: 'var(--accent)' }}>085 301 83 32</a> of mail{' '}
            <a href="mailto:klantenservice@camera-tweedehands.nl" style={{ color: 'var(--accent)' }}>klantenservice@camera-tweedehands.nl</a>.
          </p>
        </aside>
      </div>

      <h2 style={h2}>Hoe het verder gaat</h2>
      <ol style={{ margin: '0 0 16px', paddingLeft: 20, fontSize: 14.5, color: 'var(--text-sec)', lineHeight: 1.8 }}>
        <li>Je herroeping is geregistreerd zodra je op bevestigen klikt. Daar hangt verder niets aan vast.</li>
        <li>Je krijgt direct een bevestiging per e-mail, met de datum en het tijdstip erin.</li>
        <li>Je vinkt aan wat je terugstuurt en wij maken het retourlabel en de pakbon klaar.</li>
        <li>Je hebt <strong style={{ color: 'var(--text)' }}>veertien dagen</strong> om het pakket op de post te doen.</li>
        <li>Wij betalen binnen veertien dagen na ontvangst terug, inclusief de verzendkosten die je bij de bestelling hebt betaald.</li>
      </ol>
      <p style={p}>
        De kosten van het terugsturen zijn voor jou, tenzij het product defect of verkeerd geleverd is.
        Dan nemen wij ze voor onze rekening.
      </p>
      <p style={p}>
        Heb je een account? Dan kun je ook vanuit je bestelling starten, dan staan je gegevens en de
        producten al ingevuld. Het is geen voorwaarde &mdash; dit formulier werkt zonder in te loggen.
      </p>

      <h2 style={h2}>Wat je met het product mag doen</h2>
      <p style={p}>
        Je mag het toestel uitproberen zoals je in een winkel zou doen: uitpakken, vasthouden, instellen
        en een aantal opnamen maken. Dat is precies waar de bedenktijd voor is.
      </p>
      <p style={p}>
        Gebruik je het duidelijk verder dan uitproberen, dan mogen wij de waardevermindering verrekenen.
        Om te voorkomen dat daar discussie over ontstaat, hebben wij één harde grens: bij een camera
        rekenen wij <strong style={{ color: 'var(--text)' }}>tot 200 opnamen</strong> als uitproberen.
        Daarboven brengen wij het verschil in dagwaarde in mindering.
      </p>
      <p style={p}>
        Stuur het toestel terug met alles wat erbij zat, en verpak het stevig genoeg om de reis te
        doorstaan. Zie <Link href="/quality-grading" style={{ color: 'var(--accent)' }}>productcondities</Link> voor
        wat wij per staat hanteren.
      </p>

      <h2 style={h2}>Tot wanneer kun je annuleren</h2>
      <p style={p}>
        Vanaf het moment dat je bestelt tot <strong style={{ color: 'var(--text)' }}>veertien dagen na
        ontvangst</strong>. Je hebt dus geen apart formulier nodig als je bestelling nog niet verzonden
        is; dit is dezelfde weg. Heb je meerdere producten in één bestelling die apart geleverd worden,
        dan telt de dag waarop je het laatste product ontving.
      </p>
      <p style={{ ...p, marginBottom: 0 }}>
        Je hoeft geen reden op te geven, en wij mogen je niet om een reden vragen als voorwaarde.
      </p>
    </SimplePage>
  );
}

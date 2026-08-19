import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ShutterTool from '@/components/shuttercount/ShutterTool';
import FaqList from '@/components/ui/FaqList';

/**
 * Shuttercount checken — SEO-informatiepagina + gratis browser-check.
 * Doel: iedereen die zoekt op "shuttercount checken / hoe vind ik shutter count / clicks camera
 * achterhalen / is X clicks veel" landt hier en wordt écht geholpen. Technisch jargon (EXIF/
 * MakerNote) bewust weggelaten; praktische stappen + misverstanden + FAQ met JSON-LD.
 * Feiten geverifieerd (onderzoek 19-08-2026, CHANGES.md); tool gevalideerd tegen ExifTool.
 */

export const metadata: Metadata = {
  title: 'Shuttercount checken? Gratis online check + uitleg per merk | Camera-tweedehands.nl',
  description:
    'Hoeveel clicks heeft je camera? Check de shuttercount gratis in je browser (Nikon, Sony, Canon, Pentax) en lees per merk hoe je hem vindt, wat een normaal aantal is en welke fouten je moet vermijden.',
};

const C = { text: '#1E2133', sec: '#6B6D80', border: '#EEEEF2', surface: '#F4F4F7', accent: '#E8692A', ok: '#16A34A' };
const h2: React.CSSProperties = { fontSize: 22, fontWeight: 800, margin: '40px 0 8px', color: C.text, scrollMarginTop: 90 };
const h3s: React.CSSProperties = { fontSize: 16.5, fontWeight: 800, margin: '20px 0 6px', color: C.text };
const p: React.CSSProperties = { fontSize: 14.5, color: C.sec, margin: '0 0 12px', lineHeight: 1.7 };
const chipBase: React.CSSProperties = { display: 'inline-block', fontSize: 11.5, fontWeight: 800, letterSpacing: '.04em', borderRadius: 999, padding: '4px 10px', marginBottom: 10 };
const chipTool: React.CSSProperties = { ...chipBase, background: '#F0FDF4', color: C.ok };
const chipMenu: React.CSSProperties = { ...chipBase, background: '#EFF6FF', color: '#1e40af' };
const chipHard: React.CSSProperties = { ...chipBase, background: C.surface, color: C.sec };

function BrandCard({ id, name, chip, chipStyle, children }: { id: string; name: string; chip: string; chipStyle: React.CSSProperties; children: React.ReactNode }) {
  return (
    <section id={id} style={{ background: '#fff', border: `1.5px solid ${C.border}`, borderRadius: 16, padding: '20px 24px', scrollMarginTop: 90 }}>
      <span style={chipStyle}>{chip}</span>
      <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 8px', color: C.text }}>{name}</h3>
      {children}
    </section>
  );
}

const Step = ({ n, children }: { n: number; children: React.ReactNode }) => (
  <li style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: 14, color: C.sec, lineHeight: 1.6 }}>
    <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: '50%', background: C.surface, color: C.text, fontSize: 12, fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>{n}</span>
    <span>{children}</span>
  </li>
);

/* FAQ — ook als JSON-LD (FAQPage) voor rich results. Antwoorden hier = plain text. */
const FAQS = [
  { q: 'Wat is een shuttercount precies?', a: 'De shuttercount (sluitertelling) is het aantal foto’s dat de mechanische sluiter van een camera heeft gemaakt. De sluiter is een bewegend onderdeel dat slijt — vergelijk het met de kilometerstand van een auto: het zegt iets over hoeveel er gewerkt is, maar niet alles over de staat.' },
  { q: 'Hoe kan ik de shuttercount van mijn camera checken?', a: 'Bij Nikon, Sony en Pentax/Ricoh staat de teller in elke originele foto — die lees je gratis uit met onze online check, direct in je browser. Canon EOS R3 en R1 tonen hem in het menu; voor de meeste andere Canon-modellen heb je een programma met USB-kabel nodig. Fujifilm toont hem op de X100V/VI in het menu en bij nieuwere X-modellen via de XApp. Olympus/OM System en Panasonic hebben een verborgen servicemenu.' },
  { q: 'Zegt het bestandsnummer op mijn geheugenkaart iets over de shuttercount?', a: 'Nee. Het nummer in de bestandsnaam (bijv. DSC_4832 of IMG_9999) is een doorlopende bestandsteller die na 9999 opnieuw begint en die je kunt resetten of laten doorlopen bij een nieuwe kaart. Het zegt niets over het werkelijke aantal sluiteropnamen.' },
  { q: 'Tellen elektronische of stille foto’s mee in de shuttercount?', a: 'Nee. Bij elektronisch of stil fotograferen beweegt de mechanische sluiter niet, dus die slijt ook niet en de teller loopt niet op. Sony telt daarom alleen mechanische opnamen. Camera’s zonder mechanische sluiter, zoals de Nikon Z8/Z9 en Sony a9 III, hebben geen slijtende sluiter — daar is de conditie de maatstaf.' },
  { q: 'Telt video-opnemen mee in de shuttercount?', a: 'Nee. Tijdens video staat de sluiter open en beweegt hij niet. Ook live view telt bij de meeste merken niet mee.' },
  { q: 'Hoeveel clicks is veel voor een camera?', a: 'Dat hangt van het model af. Instapcamera’s zijn getest voor zo’n 50.000–100.000 opnamen, middenklassers voor 100.000–200.000 en professionele modellen voor 300.000–500.000. Een pro-body met 80.000 clicks heeft dus nog het grootste deel van zijn leven voor zich; bij een instapmodel is datzelfde getal veel.' },
  { q: 'Wat gebeurt er als de sluiter stuk gaat?', a: 'Dan kan de sluiter vervangen worden — vervelend, maar geen einde verhaal. Een sluiterrevisie kost doorgaans een fractie van een nieuwe camera. De opgegeven levensduur is bovendien een testgemiddelde, geen houdbaarheidsdatum: veel sluiters gaan er ruim overheen.' },
  { q: 'Moet ik de shuttercount weten om mijn camera te verkopen?', a: 'Nee. Bij ons kun je gewoon een bod aanvragen zonder de teller te kennen — wij lezen hem uit zodra de camera binnen is en passen het bod eerlijk aan volgens een vaste staffel. Weet je hem wel, dan is je bod direct scherper.' },
  { q: 'Is de online shuttercount-check veilig?', a: 'Ja. De check draait volledig in je browser: je foto wordt niet geüpload en verlaat je computer niet. We lezen alleen de technische gegevens die de camera zelf in het bestand zet.' },
  { q: 'Waarom vindt de check niets in mijn foto?', a: 'Meestal omdat de foto niet origineel is: WhatsApp, Instagram, e-mailprogramma’s en bewerkingssoftware verwijderen de cameragegevens. Gebruik een foto rechtstreeks van de geheugenkaart. Bij sommige merken (de meeste Canon-modellen, Fujifilm, Olympus, Panasonic, Leica) zet de camera het getal simpelweg niet in de foto.' },
];

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          }),
        }}
      />

      {/* Header */}
      <div className="svc-header">
        <div className="container">
          <div className="svc-header__inner">
            <Breadcrumb items={[{ label: 'Customer service', href: '/customer-service' }, { label: 'Shuttercount checken' }]} />
            <div className="svc-eyebrow">Gratis check</div>
            <h1 className="svc-title">Shuttercount checken</h1>
            <p className="svc-intro">
              Hoeveel clicks heeft je camera gemaakt? Check het hieronder gratis in je browser, of vind per merk
              waar je de sluitertelling vindt — en lees wat het getal wél en níet zegt over de staat van je camera.
            </p>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 80 }}>
        <div style={{ maxWidth: 920 }}>
          {/* Tool */}
          <ShutterTool />
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', margin: '12px 2px 0', fontSize: 12.5, color: C.sec }}>
            <span>✓ Werkt voor <strong style={{ color: C.text }}>Nikon</strong>, <strong style={{ color: C.text }}>Sony</strong>, <strong style={{ color: C.text }}>Pentax/Ricoh GR</strong> en (bèta) <strong style={{ color: C.text }}>Canon R5/R6/R6 II/R8/R50</strong></span>
            <span>✓ 100% in je browser — je foto wordt nergens geüpload</span>
          </div>

          {/* Per merk */}
          <h2 style={h2}>Hoe vind ik de shuttercount van mijn camera?</h2>
          <p style={p}>
            Gebruik voor de check altijd een <strong style={{ color: C.text }}>originele foto rechtstreeks van de geheugenkaart</strong>.
            Foto&rsquo;s die via WhatsApp, Instagram of e-mail zijn gedeeld of door een bewerkingsprogramma zijn geëxporteerd,
            verliezen de cameragegevens waar het getal in staat.
          </p>

          <div style={{ display: 'grid', gap: 14 }}>
            <BrandCard id="nikon" name="Nikon shuttercount checken" chip="Direct via onze check" chipStyle={chipTool}>
              <p style={p}>Elke Nikon zet de shuttercount in elke originele foto (JPEG en NEF) — van DSLR&rsquo;s als de D750 en D850 tot de hele Z-serie. Sleep een foto in de check hierboven en je ziet het getal direct; bij Z-camera&rsquo;s tonen we waar mogelijk ook het aantal mechanische sluiteropnamen apart.</p>
              <p style={{ ...p, marginBottom: 0 }}><strong style={{ color: C.text }}>Z8 en Z9:</strong> deze hebben geen mechanische sluiter. Het getal telt elektronische opnamen en zegt niets over slijtage — kijk daar vooral naar de algehele conditie.</p>
            </BrandCard>

            <BrandCard id="sony" name="Sony shuttercount checken" chip="Direct via onze check" chipStyle={chipTool}>
              <p style={p}>Ook Sony zet de teller in elke originele foto (JPEG en ARW). Onze check leest hem uit voor vrijwel alle Alpha-modellen: de A7-serie (I t/m IV, R, S, C), A9, A1, de A6000-serie t/m A6700 en de A7C II/A7CR. Het getal telt alleen <em>mechanische</em> sluiteropnamen — stil fotograferen telt niet mee.</p>
              <p style={{ ...p, marginBottom: 0 }}><strong style={{ color: C.text }}>Uitzonderingen:</strong> bij de a1 II en a7 V lukt het alleen met een foto die met de mechanische sluiter is gemaakt (zet stille modus even uit). De a9 III heeft geen mechanische sluiter — daar bestaat geen shuttercount.</p>
            </BrandCard>

            <BrandCard id="canon" name="Canon shuttercount checken" chip="Menu of USB-tool" chipStyle={chipMenu}>
              <p style={p}>Canon maakt het lastiger dan de meeste merken — zo vind je hem wel:</p>
              <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                <Step n={1}><strong style={{ color: C.text }}>EOS R3 en R1</strong> (en 1D X Mark III): menu <em>Set-up → Systeemstatus</em> → &ldquo;shutter-release cycles&rdquo;. Afgerond op 1.000.</Step>
                <Step n={2}><strong style={{ color: C.text }}>EOS R5, R6, R6 Mark II, R8, R50</strong>: onze check hierboven leest het uit een originele JPEG (bèta).</Step>
                <Step n={3}><strong style={{ color: C.text }}>Alle overige EOS-modellen</strong> (ook R5 Mark II, R7, R10 en oudere DSLR&rsquo;s): alleen via een programma met USB-verbinding, zoals de <a href="https://www.direstudio.com/shuttercount/" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, fontWeight: 700 }}>ShutterCount-app ↗</a> (Mac/iOS, betaald).</Step>
              </ol>
              <p style={{ ...p, margin: '6px 0 0' }}>Lukt het niet? Geen probleem — wij lezen de teller uit zodra je camera bij ons binnen is.</p>
            </BrandCard>

            <BrandCard id="fujifilm" name="Fujifilm shuttercount checken" chip="Menu of app" chipStyle={chipMenu}>
              <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                <Step n={1}><strong style={{ color: C.text }}>X100V en X100VI</strong>: menu <em>SET UP → USER SETTING → SHUTTER COUNT</em>.</Step>
                <Step n={2}><strong style={{ color: C.text }}>X-H2, X-H2S, X-T5, X-S20</strong>: verbind met de <em>Fujifilm XApp</em> en kijk onder <em>Equipment</em>.</Step>
                <Step n={3}>Oudere modellen tonen het niet — wij meten het bij ontvangst.</Step>
              </ol>
            </BrandCard>

            <BrandCard id="olympus" name="OM System / Olympus shuttercount checken" chip="Verborgen servicemenu" chipStyle={chipMenu}>
              <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                <Step n={1}>Camera uit. Houd <strong style={{ color: C.text }}>MENU</strong> ingedrukt en zet de camera aan.</Step>
                <Step n={2}>Ga naar <em>Setup → Monitor-helderheid</em> en druk op <strong style={{ color: C.text }}>OK</strong>.</Step>
                <Step n={3}>Druk <strong style={{ color: C.text }}>INFO</strong> → <strong style={{ color: C.text }}>OK</strong>; je ziet het logoscherm.</Step>
                <Step n={4}>Druk <strong style={{ color: C.text }}>omhoog, omlaag, links, rechts</strong>, dan de <strong style={{ color: C.text }}>ontspanknop</strong>, dan <strong style={{ color: C.text }}>omhoog</strong>.</Step>
                <Step n={5}>Regel <strong style={{ color: C.text }}>R</strong> is het aantal sluiteropnamen (OM-1: <strong style={{ color: C.text }}>MS</strong>). Uit- en aanzetten sluit het menu weer af.</Step>
              </ol>
            </BrandCard>

            <BrandCard id="pentax" name="Pentax / Ricoh GR shuttercount checken" chip="Direct via onze check" chipStyle={chipTool}>
              <p style={{ ...p, marginBottom: 0 }}>Pentax-DSLR&rsquo;s (vanaf de K10D) en de Ricoh GR III/IIIx zetten de teller in elke originele foto (JPEG, PEF en DNG) — onze check leest hem direct uit. Let op: het getal kan bij een servicebeurt gereset zijn.</p>
            </BrandCard>

            <BrandCard id="panasonic" name="Panasonic Lumix shuttercount checken" chip="Servicemodus" chipStyle={chipMenu}>
              <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                <Step n={1}>Camera uit. Houd <strong style={{ color: C.text }}>Afspelen</strong> én <strong style={{ color: C.text }}>AF/AE LOCK</strong> ingedrukt en zet de camera aan.</Step>
                <Step n={2}>Druk daarna <strong style={{ color: C.text }}>Afspelen</strong> + <strong style={{ color: C.text }}>MENU/SET</strong> + tweemaal <strong style={{ color: C.text }}>links</strong>.</Step>
                <Step n={3}><strong style={{ color: C.text }}>SHTCNT</strong> = shuttercount. Uit- en aanzetten verlaat de modus.</Step>
              </ol>
            </BrandCard>

            <BrandCard id="leica" name="Leica en overige merken" chip="Bij ontvangst door ons" chipStyle={chipHard}>
              <p style={{ ...p, marginBottom: 0 }}>Leica (M, SL, Q), Hasselblad en Sigma bieden geen consumentenmethode — alleen de fabrikantsservice kan de teller uitlezen. Geen zorgen: <strong style={{ color: C.text }}>je hoeft dit niet zelf te weten om te verkopen</strong> — wij beoordelen elk toestel bij ontvangst en zijn daar transparant over in ons bod.</p>
            </BrandCard>
          </div>

          {/* Informatief: wat zegt het getal, misverstanden */}
          <h2 style={h2}>Waarom is de shuttercount belangrijk?</h2>
          <p style={p}>
            De sluiter is een van de weinige mechanische slijtdelen van een camera. De shuttercount vertelt hoeveel er
            mee gewerkt is — daarom kijken kopers (en wij) ernaar bij tweedehands camera&rsquo;s, net als naar de
            kilometerstand van een auto. Maar het is niet het hele verhaal: een camera met 100.000 opnamen uit een
            studio verkeert vaak in betere staat dan een toestel met 30.000 opnamen dat jarenlang mee naar het strand
            is geweest. Het getal vertelt <em>hoeveel</em> er gewerkt is; de conditie vertelt <em>hoe</em>.
          </p>

          <h3 style={h3s}>Hoeveel clicks gaat een sluiter mee?</h3>
          <div style={{ overflowX: 'auto', margin: '0 0 12px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 420 }}>
              <thead>
                <tr>
                  {['Type camera', 'Geteste levensduur sluiter'].map(hd => (
                    <th key={hd} style={{ textAlign: 'left', padding: '10px 14px', background: C.surface, borderBottom: `1px solid ${C.border}`, fontWeight: 700, color: C.text }}>{hd}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[['Instapmodellen', '50.000 – 100.000 opnamen'], ['Middenklasse', '100.000 – 200.000 opnamen'], ['Professionele modellen', '300.000 – 500.000 opnamen']].map(([a, b]) => (
                  <tr key={a}>
                    <td style={{ padding: '10px 14px', borderBottom: `1px solid ${C.border}`, color: C.sec }}>{a}</td>
                    <td style={{ padding: '10px 14px', borderBottom: `1px solid ${C.border}`, fontWeight: 600, color: C.text }}>{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={p}>
            Dit zijn testgemiddelden, geen houdbaarheidsdatums — veel sluiters gaan er ruim overheen. En gaat een
            sluiter stuk, dan is hij te vervangen voor een fractie van de prijs van een nieuwe camera.
          </p>

          <h3 style={h3s}>Veelgemaakte fouten bij het checken</h3>
          <ul style={{ margin: '0 0 12px', paddingLeft: 20, listStyle: 'disc' }}>
            {[
              ['Het bestandsnummer is géén shuttercount.', 'Het nummer in de bestandsnaam (DSC_4832, IMG_9999) begint na 9999 opnieuw en kan gereset worden — het zegt niets over het werkelijke aantal opnamen.'],
              ['Elektronisch/stil fotograferen telt niet mee.', 'De mechanische sluiter beweegt dan niet en slijt dus ook niet. Een lage teller bij een intensief (stil) gebruikte camera is dus goed mogelijk — en geen probleem: er is geen mechanische slijtage.'],
              ['Video en live view tellen niet mee.', 'Tijdens filmen staat de sluiter open; vloggers kunnen dus tienduizenden uren draaien met een lage teller.'],
              ['Een bewerkte of doorgestuurde foto werkt niet.', 'WhatsApp, Instagram en exports uit Lightroom verwijderen de cameragegevens. Gebruik het originele bestand van de kaart.'],
              ['Spiegelloos zonder mechanische sluiter = geen teller.', 'Nikon Z8/Z9 en Sony a9 III hebben geen slijtende sluiter; beoordeel daar de conditie, niet een getal.'],
            ].map(([b, rest]) => (
              <li key={b} style={{ fontSize: 14.5, color: C.sec, lineHeight: 1.7, marginBottom: 8 }}>
                <strong style={{ color: C.text }}>{b}</strong> {rest}
              </li>
            ))}
          </ul>
          <p style={p}>
            Meer over wat het getal betekent voor de waarde — en onze garantie op de sluiter — lees je op{' '}
            <Link href="/shuttercount" style={{ color: C.accent, fontWeight: 700 }}>de shuttercount-uitlegpagina</Link>.
            Hoe wij condities beoordelen staat bij <Link href="/quality-grading" style={{ color: C.accent, fontWeight: 700 }}>Quality &amp; grading</Link>.
          </p>

          {/* CTA */}
          <div style={{ marginTop: 28, borderRadius: 16, padding: '26px 28px', background: 'linear-gradient(135deg, #1B1E2E 0%, #2A2D45 60%, #3A2519 100%)', color: '#fff', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: '#FF8A4C' }}>Shuttercount bekend?</div>
              <div style={{ fontSize: 21, fontWeight: 800, margin: '4px 0 6px' }}>Verkoop of ruil je camera — vaak méér bod met een bekende teller</div>
              <div style={{ fontSize: 13.5, opacity: .85, lineHeight: 1.6 }}>Gratis verzekerd opsturen, eerlijke beoordeling door fotografie-experts en uitbetaling binnen 3 werkdagen.</div>
            </div>
            <Link href="/trade-in/v3" style={{ background: '#16A34A', color: '#fff', borderRadius: 999, padding: '14px 26px', fontSize: 15, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>Vraag direct je bod aan →</Link>
          </div>

          {/* FAQ */}
          <section style={{ marginTop: 40 }}>
            <h2 style={{ ...h2, margin: '0 0 8px' }}>Veelgestelde vragen over de shuttercount</h2>
            <FaqList items={FAQS.map(f => ({ q: f.q, a: f.a }))} />
          </section>
        </div>
      </div>
    </>
  );
}

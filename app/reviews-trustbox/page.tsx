import SimplePage from '@/components/layout/SimplePage';
import TrustpilotWidget, { TP } from '@/components/ui/TrustpilotWidget';
import {
  WebwinkelKeurLogo, FacebookLogo, GoogleLogo, TrustedShopsLogo, ScoreStar,
} from '@/components/ui/PlatformLogos';

// VARIANT van /reviews die zich houdt aan de Trustpilot-merkregels.
//
// Aanleiding: Trustpilot verbiedt een handmatig ingetypte of statische TrustScore
// ("static image of your TrustScore or Star Rating") en het tonen van Trustpilot-
// content via "unauthorised widgets or applications". Waar hun cijfer of hun
// reviews staan, moet dat uit een officiële TrustBox komen, met hun logo en een
// link terug naar het profiel. Camera-tweedehands zit op het Premium-pakket, dus
// het tonen zelf mag — alleen niet in eigen opmaak.
//
// Wat hier dus uit de widget komt: de Trustpilot-score, het aantal Trustpilot-
// reviews en de Trustpilot-citaten. Die cijfers zijn daarmee ook automatisch
// actueel; er hoeft niets meer met de hand bijgewerkt te worden.
//
// Wat eigen opmaak blijft: onze eigen cijfers (verkochte producten), de andere
// platformen (die hebben eigen regels, maar geen widget-plicht bij ons plan) en
// alle uitleg.
//
// Wat we hiermee inleveren staat onderaan in NOTE_VERLIES.

const SOLD = '50.000+';

// Cijfers van de andere bronnen, opgehaald 08-08-2026. Trustpilot staat hier
// bewust NIET meer tussen: dat cijfer komt uit de widget.
const sources: { name: string; Logo: (p: { size?: number }) => React.JSX.Element; score: string; count: string; href: string; note: string }[] = [
  {
    name: 'WebwinkelKeur',
    Logo: WebwinkelKeurLogo,
    score: '9,4',
    count: '1.893',
    href: 'https://www.webwinkelkeur.nl/webshop/Camera-tweedehands-nl_4043/reviews',
    note: 'Keurmerk waar wij sinds 2015 bij aangesloten zijn',
  },
  {
    name: 'Trusted Shops',
    Logo: TrustedShopsLogo,
    score: '10',
    count: '953',
    href: 'https://www.webwinkelkeur.nl/webshop/Camera-tweedehands-nl_4043',
    note: 'Opgebouwd in de jaren dat wij daar aangesloten waren',
  },
  {
    name: 'Google',
    Logo: GoogleLogo,
    score: '9,6',
    count: '187',
    href: 'https://www.google.com/search?q=Camera-Tweedehands.nl+Geldermalsen',
    note: 'Vooral van mensen die in de winkel in Geldermalsen zijn geweest',
  },
  {
    name: 'Facebook',
    Logo: FacebookLogo,
    score: '10',
    count: '23',
    href: 'https://www.facebook.com/cameratweedehands',
    note: 'Ruim 5.100 mensen volgen ons daar',
  },
];

const h2: React.CSSProperties = { fontSize: 20, fontWeight: 700, margin: '38px 0 10px' };
const p: React.CSSProperties = { fontSize: 14.5, color: 'var(--text-sec)', margin: '0 0 14px', lineHeight: 1.65 };

export default function ReviewsTrustboxPage() {
  return (
    <SimplePage
      title="Wat klanten van ons vinden"
      breadcrumb="Beoordelingen"
      intro="Wij verkopen sinds 2011 tweedehands apparatuur, en onze klanten laten weten wat ze ervan vinden. Hieronder de cijfers, met een link naar de bron zodat je ze zelf kunt nalezen."
    >
      {/* Werkbalk — alleen voor intern vergelijken, hoort niet op de echte pagina. */}
      <div style={{ background: '#FFF4E8', border: '1.5px solid #F5D9BC', borderRadius: 12, padding: '14px 18px', margin: '0 0 20px', fontSize: 13.5, lineHeight: 1.6, color: '#6B4A2B' }}>
        <strong>Interne variant.</strong> Dit is <code>/reviews</code> met officiële Trustpilot-widgets in
        plaats van handmatig ingetypte cijfers en citaten. Alles wat Trustpilot betreft is hier live en
        altijd actueel. Vergelijk met <a href="/reviews" style={{ color: '#B4560F' }}>/reviews</a>.
      </div>

      {/* Kopblok. De donkere kaart bevat nu de officiële Mini-TrustBox in donker
          thema, in plaats van een zelf getypte 9,8. */}
      <div
        style={{
          display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))',
          margin: '0 0 12px',
        }}
      >
        <div style={{ background: '#1E2133', borderRadius: 16, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TrustpilotWidget
            templateId={TP.mini}
            token="720be403-8271-420a-a7d0-42f2770c932b"
            height="150px"
            width="100%"
            theme="dark"
          />
        </div>

        <div style={{ background: '#fff', border: '1.5px solid #EEEEF2', borderRadius: 16, padding: '24px 26px' }}>
          <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.1, color: '#1E2133', fontVariantNumeric: 'tabular-nums' }}>
            {SOLD}
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--text-sec)', marginTop: 8, lineHeight: 1.5 }}>
            Producten verkocht<br />sinds 2011
          </div>
        </div>

        <div style={{ background: '#fff', border: '1.5px solid #EEEEF2', borderRadius: 16, padding: '24px 26px' }}>
          <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.1, color: '#1E2133', fontVariantNumeric: 'tabular-nums' }}>
            5
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--text-sec)', marginTop: 8, lineHeight: 1.5 }}>
            Onafhankelijke platformen<br />waar je ons kunt nalezen
          </div>
        </div>
      </div>

      {/* Officiële Micro Combo: score + aantal + logo + link, in één regel. */}
      <div style={{ background: '#fff', border: '1.5px solid #EEEEF2', borderRadius: 14, padding: '16px 20px', margin: '0 0 10px' }}>
        <TrustpilotWidget templateId={TP.microCombo} token="e1c08f67-ab5d-4665-8ad1-7bfe4d849fbf" height="24px" />
      </div>

      <h2 style={h2}>De cijfers per platform</h2>
      <p style={p}>
        Onze Trustpilot-score staat hierboven en komt rechtstreeks van Trustpilot. De overige platformen:
      </p>
      <div style={{ background: '#fff', border: '1.5px solid #EEEEF2', borderRadius: 16, padding: '4px 22px', margin: '0 0 10px' }}>
        {sources.map((s, i) => (
          <a
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: '17px 0',
              borderTop: i === 0 ? 'none' : '1px solid #EEEEF2',
              textDecoration: 'none', color: 'inherit',
            }}
          >
            <span style={{ flex: '0 0 auto', display: 'flex' }}>
              <s.Logo size={38} />
            </span>
            <span style={{ flex: '1 1 auto', minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 15.5, fontWeight: 700, color: 'var(--text)' }}>
                {s.name}
              </span>
              <span style={{ display: 'block', fontSize: 13, color: '#8A8C99', marginTop: 2 }}>
                {s.count} beoordelingen
              </span>
              <span style={{ display: 'block', fontSize: 12.5, color: '#A0A2AE', marginTop: 3, lineHeight: 1.45 }}>
                {s.note}
              </span>
            </span>
            <span style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 6 }}>
              <ScoreStar size={18} />
              <span style={{ fontSize: 21, fontWeight: 700, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
                {s.score}
              </span>
            </span>
          </a>
        ))}
      </div>
      <p style={{ fontSize: 12.5, color: '#8A8C99', margin: '0 0 8px', lineHeight: 1.6 }}>
        Cijfers per 8 augustus 2026, op een schaal van 10. Google en Facebook werken zelf met een schaal
        van 5; die is lineair omgerekend. Klik door voor het actuele beeld.
      </p>

      <h2 style={h2}>Hoe onze beoordelingen tot stand komen</h2>
      <p style={p}>
        Elke klant krijgt na een aankoop automatisch een uitnodiging. Wij kiezen niet wie er gevraagd
        wordt, en wij kunnen een beoordeling niet verwijderen of aanpassen &mdash; dat is precies waarom
        een cijfer van een onafhankelijk platform iets waard is.
      </p>
      <p style={p}>
        Een winkel die zelf bepaalt welke beoordelingen zichtbaar worden, kan alleen maar goede
        beoordelingen laten zien. Dan zegt een tien niets meer. Daarom staan onze beoordelingen bij
        anderen, staan ze er op meerdere plekken, en staat overal het aantal erbij.
      </p>

      <h2 style={h2}>Wat klanten schrijven</h2>
      <p style={p}>
        Rechtstreeks van Trustpilot, in willekeurige volgorde en zonder dat wij er iets aan kunnen
        veranderen.
      </p>
      <div style={{ margin: '0 0 6px' }}>
        <TrustpilotWidget
          templateId={TP.carousel}
          token="e1170bee-073b-47bf-a04f-f21dd7333a21"
          height="160px"
          stars="1,2,3,4,5"
          reviewLanguages="nl"
        />
      </div>
      <div style={{ margin: '18px 0 6px' }}>
        <TrustpilotWidget
          templateId={TP.grid}
          token="f56ab03c-1709-47a4-8c2e-8a7abd7bb07a"
          height="500px"
          stars="1,2,3,4,5"
          reviewLanguages="nl"
        />
      </div>

      <h2 style={h2}>Niet tevreden?</h2>
      <p style={p}>
        Laat het ons dan eerst weten. Bel{' '}
        <a href="tel:+31853018332" style={{ color: 'var(--accent)' }}>085 301 83 32</a> of mail naar{' '}
        <a href="mailto:info@camera-tweedehands.nl" style={{ color: 'var(--accent)' }}>info@camera-tweedehands.nl</a>.
        In verreweg de meeste gevallen lossen wij het op, en dat is voor iedereen prettiger dan een
        beoordeling waar niets mee gebeurt.
      </p>
      <p style={{ ...p, marginBottom: 0 }}>
        Komen wij er samen niet uit, dan kun je terecht bij WebwinkelKeur. Zij bemiddelen onafhankelijk
        en wij zijn daar bij aangesloten.
      </p>
    </SimplePage>
  );
}

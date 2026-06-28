import SimplePage from '@/components/layout/SimplePage';

// Afgeleid van de cookie-sectie van het privacybeleid (geen aparte cookie-pagina
// op de live site). Hangt samen met de cookie-consent-banner.
const md = `We gebruiken cookies om je websitebezoek te optimaliseren en te analyseren. Cookies zijn kleine tekstbestanden die op je apparaat worden opgeslagen.

## Soorten cookies

- **Functioneel** — noodzakelijk voor de werking van de site (o.a. Session ID, auto-login, winkelwagen).
- **Analytisch** — om bezoekgedrag te meten en de site te verbeteren.
- **Marketing** — voor relevante advertenties (third-party, bijv. social media).

## Toestemming beheren

Bij je eerste bezoek vraag we via de cookie-banner om je toestemming. Je kunt je keuze op elk moment wijzigen. De meeste browsers accepteren cookies standaard; je kunt je browser instellen om cookies te weigeren, maar dan werken sommige functies mogelijk niet correct.

## Contact

Vragen over cookies? Mail naar info@camera-tweedehands.nl.`;

export default function Page() {
  return (
    <SimplePage
      title="Cookie policy"
      breadcrumb="Cookie policy"
      eyebrow="Cookies"
      intro="Welke cookies we gebruiken en hoe je je toestemming beheert."
      markdown={md}
    />
  );
}

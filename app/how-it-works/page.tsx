import SimplePage from '@/components/layout/SimplePage';

const md = `Bij ons koop én verkoop je tweedehands camera-apparatuur net zo eenvoudig en vertrouwd als nieuw.

## Kopen in 4 stappen

- **Blader** door de catalogus en kies de conditie en prijs die bij je past.
- **Bekijk** per product de echte foto's, de exacte conditie, de shuttercount (waar van toepassing) en de meegeleverde accessoires.
- **Reken veilig af** met je voorkeursbetaalmethode.
- **Ontvang je gear** — aangetekend en verzekerd — met minimaal 12 maanden garantie en 14 dagen retourrecht.

## Verkopen of inruilen

- Gebruik onze **inruiltool** voor een directe indicatie van de waarde van je huidige apparatuur.
- Akkoord met de offerte? Je ontvangt een **gratis verzendlabel**.
- Wij **inspecteren en testen** alles binnen enkele werkdagen.
- Daarna word je uitbetaald, of je verrekent het bedrag tegen een nieuwe aankoop.

## Waarom Camify

- Elk item wordt **professioneel geïnspecteerd** en eerlijk gegradeerd.
- **Echte productfoto's** van het exacte item — geen stockbeelden.
- **Minimaal 12 maanden garantie** op alles, en een eerlijke, transparante prijs.`;

export default function Page() {
  return (
    <SimplePage
      title="How it works"
      breadcrumb="How it works"
      intro="Van browsen tot bezorgen — en van inruilen tot uitbetaald, in een paar stappen."
      markdown={md}
    />
  );
}

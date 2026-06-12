import SimplePage from '@/components/layout/SimplePage';

const md = `Elk item wordt professioneel geïnspecteerd en eerlijk gegradeerd, zodat je precies weet wat je koopt. We controleren onder andere sensor, autofocus, lensglas, sluitermechanisme en cosmetische staat.

## Onze 5 conditieniveaus

- **Zo goed als nieuw** — vrijwel ongebruikt, geen zichtbare gebruikssporen.
- **Uitstekend** — minimale cosmetische slijtage; ziet er nagenoeg perfect uit.
- **Goed** — lichte, normale gebruikssporen van regulier gebruik.
- **Gebruikt** — duidelijk zichtbare slijtage, maar alles werkt perfect.
- **Veel gebruikt** — duidelijke cosmetische slijtage, volledig functioneel en getest.

## Shuttercount

Waar van toepassing lezen we de shuttercount uit met professionele diagnosetools — uit de EXIF-data of via fabrikant-servicesoftware — en vermelden we deze op de productpagina.

## Echte foto's

Elke listing bevat echte foto's van het exacte item dat je ontvangt — geen stockbeelden. Zo zie je vooraf precies de cosmetische staat: wat je ziet, is wat je krijgt.`;

export default function Page() {
  return (
    <SimplePage
      title="Quality &amp; grading"
      breadcrumb="Quality & grading"
      intro="Hoe we conditie bepalen, testen en transparant communiceren."
      markdown={md}
    />
  );
}

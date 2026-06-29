import SimplePage from '@/components/layout/SimplePage';

// Afgeleid van Artikel 10 (Conformiteit en Garantie) van de algemene voorwaarden
// (geen aparte garantie/reparatie-pagina op de live site).
const md = `Elk product voldoet aan de overeenkomst en de wettelijke normen. Op tweedehands producten geldt een **minimale garantie van 12 maanden**; op nieuwe artikelen 24 maanden.

## Wat valt niet onder garantie

- Slijtage en normale gebruikssporen.
- Accu's: minimaal 30% capaciteit; flitsbuizen gelden als slijtageonderdeel.
- Voor tweedehands producten wordt uitgegaan van een jaarlijkse afschrijving van 20%.
- Maximaal 5 heldere pixels op sensoren voor bepaalde condities.

Meld gebreken binnen 7 dagen na ontvangst.

## Reparatie aanvragen

Heb je een reparatie nodig — binnen of buiten garantie? Neem contact met ons op via de contactpagina of info@camera-tweedehands.nl met je ordernummer en een omschrijving van het probleem. We laten je weten wat de mogelijkheden, doorlooptijd en eventuele kosten zijn.`;

export default function Page() {
  return (
    <SimplePage
      title="Warranty &amp; repair"
      breadcrumb="Warranty & repair"
      eyebrow="Garantie"
      parent={{ label: 'Help', href: '/help' }}
      image="/images/hero-photographer-2.jpg"
      intro="Elk product heeft minimaal 12 maanden garantie. Reparatie nodig? We helpen."
      markdown={md}
    />
  );
}

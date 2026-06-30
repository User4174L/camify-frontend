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

Heb je een reparatie nodig — binnen of buiten garantie? Neem contact met ons op via de contactpagina of info@camera-tweedehands.nl met je ordernummer en een omschrijving van het probleem.

We besteden reparaties uit aan **gespecialiseerde partners**. Een reparatie duurt doorgaans **4–8 weken**, en op een uitgevoerde reparatie zit **minimaal 6 maanden garantie**. We laten je vooraf weten wat de mogelijkheden en eventuele kosten zijn.`;

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
      related={[
        { label: 'Shipping & returns', desc: 'Retourneren, terugbetaling en levertijden.', href: '/shipping-returns' },
        { label: 'Quality & grading', desc: 'Hoe we conditie bepalen en testen.', href: '/quality-grading' },
        { label: 'Contact', desc: 'Een probleem met je bestelling? We helpen je graag.', href: '/contact' },
      ]}
      faqs={[
        { q: 'Hoe lang heb ik garantie?', a: 'Op tweedehands producten geldt minimaal 12 maanden garantie, op nieuwe producten 24 maanden — tenzij anders vermeld bij het product.' },
        { q: 'Wat valt niet onder de garantie?', a: 'Normale slijtage en gebruikssporen, accu’s onder 30% van de opgegeven capaciteit, flitsbuizen (slijtageonderdeel) en schade door verkeerd gebruik of externe invloeden. Voor tweedehands geldt een jaarlijkse afschrijving van 20%.' },
        { q: 'Hoe meld ik een garantieclaim of reparatie?', a: 'Neem contact op via info@camera-tweedehands.nl met je ordernummer en een omschrijving van het probleem. Zichtbare transport- of valschade meld je binnen 7 dagen na ontvangst.' },
        { q: 'Hoe lang duurt een reparatie?', a: 'Een reparatie duurt doorgaans 4–8 weken. We besteden reparaties uit aan gespecialiseerde partners, en op een uitgevoerde reparatie zit minimaal 6 maanden garantie.' },
        { q: 'Is de garantie overdraagbaar?', a: 'Nee, de garantie kan alleen worden ingeroepen door de oorspronkelijke koper en is niet overdraagbaar; een garantiebewijs is vereist.' },
      ]}
    />
  );
}

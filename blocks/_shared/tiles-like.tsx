import { Container } from './section';

/** Referentie-only: een neutraal "volgend blok" (tiles-achtig) om te tonen hoe de sectiekop erop aansluit. Bestaat in V2 als `tiles`. */
export function SlotTilesLike() {
  const items = ['Getest & gegradeerd', '12 maanden garantie', '14 dagen bedenktijd', 'Gratis verzending vanaf €50'];
  return (
    <section className="pb-12">
      <Container>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((t) => (
            <div key={t} className="rounded-xl border border-border-soft bg-surface-raised px-4 py-5 text-sm font-semibold text-text-primary">{t}</div>
          ))}
        </div>
      </Container>
    </section>
  );
}

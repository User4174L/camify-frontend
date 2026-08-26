import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/blocks/_shared/section';
import { LANDING_CONTENT, LANDING_INDEX } from '@/data/landing-content';

export const metadata: Metadata = {
  title: 'Landingspagina’s — opzet en status',
  robots: { index: false },
};

/**
 * Overzicht van de 19 landingspagina's uit de beslislijst (20/21-08-2026).
 * Pagina's met content in het werkbestand zijn klikbaar; de rest volgt
 * zodra de rij in het werkbestand is ingevuld.
 */
export default function LandingIndex() {
  return (
    <div className="v2 pb-16">
      <Container className="max-w-3xl pt-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Landingspagina’s <span className="text-brand-600">V2</span>
        </h1>
        <p className="mt-3 text-[15px] leading-[1.7] text-text-secondary">
          Eén vast template (banner → intro → productgrid → SEO-tekst → FAQ); per pagina verschilt alleen de
          inhoud. De inhoud komt 1-op-1 uit het content-werkbestand in OneDrive
          (<span className="font-mono text-[13px]">Landingspaginas V2 - content werkbestand</span>). Blok A wacht op
          het listingblok (#534), blok B daarnaast op de spec-tabel (#535).
        </p>

        {(['A', 'B'] as const).map((blok) => (
          <section key={blok} className="mt-8">
            <h2 className="mb-3 text-lg font-bold">
              Blok {blok} — {blok === 'A' ? 'merk × type (redirect-doelen)' : 'brandpunt (zoekvraag)'}
            </h2>
            <ul className="divide-y divide-border-soft overflow-hidden rounded-xl border border-border-soft bg-surface-raised">
              {LANDING_INDEX.filter((p) => p.blok === blok).map((p) => {
                const ready = p.slug in LANDING_CONTENT;
                return (
                  <li key={p.slug} className="flex items-center justify-between gap-4 px-5 py-3">
                    <div>
                      {ready ? (
                        <Link href={`/landing/${p.slug}`} className="font-semibold text-brand-600 hover:underline">
                          {p.pagina}
                        </Link>
                      ) : (
                        <span className="font-semibold text-text-primary">{p.pagina}</span>
                      )}
                      <span className="ml-2 font-mono text-xs text-text-muted">/nl-nl/{p.slug}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-text-muted">{p.klikken.toLocaleString('nl-NL')} klikken</span>
                      <span
                        className={
                          ready
                            ? 'rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-700'
                            : 'rounded-full bg-surface-muted px-2 py-0.5 text-text-muted'
                        }
                      >
                        {ready ? 'voorbeeld klaar' : 'content volgt'}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </Container>
    </div>
  );
}

import type { ReactNode } from 'react';
import Reveal from '@/components/ui/Reveal';

export type TrustItem = { ic: ReactNode; n: string; l: string };

/** Rij met vertrouwens-/USP-punten (icoon + korte kop + label). Hergebruikt op service-pagina's. */
export default function TrustStrip({ items }: { items: TrustItem[] }) {
  return (
    <div className="svc-trust">
      {items.map((m, i) => (
        <Reveal key={m.n} delay={i * 70}>
          <div className="svc-trust__i cam-lift">
            <span className="svc-trust__ic">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {m.ic}
              </svg>
            </span>
            <div>
              <div className="svc-trust__n">{m.n}</div>
              <div className="svc-trust__l">{m.l}</div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

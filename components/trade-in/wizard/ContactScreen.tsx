'use client';

/** Wizard scherm 3 — Je gegevens. */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VersionSwitch from '@/components/trade-in/VersionSwitch';
import {
  useWizardState, WizardBanner, TrustBar, Page, PageTitle, BackLink,
  C, input, card, btnCta, NON_EU, vatLineFor, base, hasBid, lastPath, type Variant,
} from './shared';

const COUNTRIES: [string, string][] = [['NL', 'Nederland'], ['BE', 'België'], ['DE', 'Duitsland'], ['FR', 'Frankrijk'], ['LU', 'Luxemburg'], ['AT', 'Oostenrijk'], ['ES', 'Spanje'], ['IT', 'Italië'], ['PL', 'Polen'], ['DK', 'Denemarken'], ['SE', 'Zweden'], ['GB', 'Verenigd Koninkrijk'], ['CH', 'Zwitserland'], ['NO', 'Noorwegen'], ['US', 'Verenigde Staten'], ['NON_EU', 'Ander land buiten de EU']];

export default function ContactScreen({ variant }: { variant: Variant }) {
  const router = useRouter();
  const [state, update, ready] = useWizardState(variant);
  const c = state.contact;
  useEffect(() => { if (ready && state.items.length === 0) router.replace(base(variant)); }, [ready, state.items.length, router, variant]);

  const set = (patch: Partial<typeof c>) => update(s => ({ ...s, contact: { ...s.contact, ...patch } }));
  const vatClean = c.vat.replace(/[\s.-]/g, '').toUpperCase();
  const vatOk = !c.isBusiness || NON_EU.includes(c.country) || /^[A-Z]{2}[A-Z0-9]{8,12}$/.test(vatClean);
  const ok = c.firstName.trim() && c.lastName.trim() && /.+@.+\..+/.test(c.email) && vatOk;

  return (
    <>
      <VersionSwitch active={variant} />
      <WizardBanner variant={variant} step={3} />
      <TrustBar variant={variant} />

      <Page width={680}>
        <BackLink href={`${base(variant)}/kopen`} label="Terug" />
        <PageTitle
          title="Je gegevens"
          sub={hasBid(variant)
            ? 'We sturen je bod ook per e-mail, zodat je het rustig kunt bekijken. We delen je gegevens nooit met derden.'
            : 'Zodra onze expert naar je spullen heeft gekeken, sturen we het bod naar dit e-mailadres. We delen je gegevens nooit met derden.'}
        />

        <div style={{ ...card, padding: 24 }}>
          <div className="tiw-form-grid">
            <label className="tiw-label"><span>Voornaam *</span><input value={c.firstName} onChange={e => set({ firstName: e.target.value })} style={input} /></label>
            <label className="tiw-label"><span>Achternaam *</span><input value={c.lastName} onChange={e => set({ lastName: e.target.value })} style={input} /></label>
            <label className="tiw-label"><span>E-mailadres *</span><input type="email" value={c.email} onChange={e => set({ email: e.target.value })} style={input} placeholder="jij@voorbeeld.nl" /></label>
            <label className="tiw-label"><span>Telefoon <span style={{ color: C.sec, fontWeight: 500 }}>(optioneel)</span></span><input type="tel" value={c.phone} onChange={e => set({ phone: e.target.value })} style={input} placeholder="06 12345678" /></label>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, padding: '12px 14px', border: `1.5px solid ${c.isBusiness ? C.text : C.border}`, borderRadius: 10, cursor: 'pointer', fontSize: 14, color: C.text }}>
            <input type="checkbox" checked={c.isBusiness} onChange={e => set({ isBusiness: e.target.checked })} style={{ width: 16, height: 16, accentColor: C.accent }} />
            Ik verkoop zakelijk
          </label>

          {c.isBusiness && (
            <div style={{ marginTop: 14 }}>
              <div className="tiw-form-grid">
                <label className="tiw-label"><span>Vestigingsland *</span>
                  <select value={c.country} onChange={e => set({ country: e.target.value })} style={input}>
                    {COUNTRIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </label>
                {!NON_EU.includes(c.country) && (
                  <label className="tiw-label"><span>BTW-nummer *</span>
                    <input value={c.vat} onChange={e => set({ vat: e.target.value })} style={{ ...input, borderColor: c.vat && !vatOk ? '#dc2626' : C.border }} placeholder={c.country === 'NL' ? 'NL123456789B01' : `${c.country}…`} />
                    {c.vat && !vatOk && <span style={{ fontSize: 12, color: '#dc2626', fontWeight: 500 }}>Controleer het BTW-nummer (landcode + 8–12 tekens).</span>}
                  </label>
                )}
              </div>
              <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: '#EFF6FF', color: '#1e40af', fontSize: 13 }}>
                <strong>{vatLineFor(c)}.</strong> Zakelijk met geldig BTW-nummer: NL = BTW in rekening · EU = verlegd · buiten EU = 0%.
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 22 }}>
            <button disabled={!ok} onClick={() => router.push(`${base(variant)}/${lastPath(variant)}`)} style={{ ...btnCta, opacity: ok ? 1 : 0.45, cursor: ok ? 'pointer' : 'default' }}>
              {hasBid(variant) ? 'Ontvang je bod' : 'Verstuur je aanvraag'} →
            </button>
          </div>
        </div>
      </Page>

      <style>{`
        .tiw-label{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:700;color:#1E2133}
        .tiw-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        @media(max-width:620px){.tiw-form-grid{grid-template-columns:1fr}}
      `}</style>
    </>
  );
}

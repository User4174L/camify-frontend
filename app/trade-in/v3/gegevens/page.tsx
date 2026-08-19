'use client';

/** Inruilflow v3 — scherm 2: Je gegevens (e-mail vóór het bod). */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VersionSwitch from '@/components/trade-in/VersionSwitch';
import { useV3State, V3Header, BackLink, C, input, card, btnCta, NON_EU, vatLineFor } from '@/components/trade-in/v3/shared';

const COUNTRIES: [string, string][] = [['NL', 'Nederland'], ['BE', 'België'], ['DE', 'Duitsland'], ['FR', 'Frankrijk'], ['LU', 'Luxemburg'], ['AT', 'Oostenrijk'], ['ES', 'Spanje'], ['IT', 'Italië'], ['PL', 'Polen'], ['DK', 'Denemarken'], ['SE', 'Zweden'], ['GB', 'Verenigd Koninkrijk'], ['CH', 'Zwitserland'], ['NO', 'Noorwegen'], ['US', 'Verenigde Staten'], ['NON_EU', 'Ander land buiten de EU']];

export default function GegevensPage() {
  const router = useRouter();
  const [state, update, ready] = useV3State();
  const c = state.contact;
  useEffect(() => { if (ready && state.items.length === 0) router.replace('/trade-in/v3'); }, [ready, state.items.length, router]);

  const set = (patch: Partial<typeof c>) => update(s => ({ ...s, contact: { ...s.contact, ...patch } }));
  const vatClean = c.vat.replace(/[\s.-]/g, '').toUpperCase();
  const vatOk = !c.isBusiness || NON_EU.includes(c.country) || /^[A-Z]{2}[A-Z0-9]{8,12}$/.test(vatClean);
  const ok = c.firstName.trim() && c.lastName.trim() && /.+@.+\..+/.test(c.email) && vatOk;

  return (
    <>
      <VersionSwitch active={3} />
      <V3Header step={2} />
      <div style={{ background: C.surface, padding: '36px 0 80px', minHeight: 420 }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px' }}>
          <BackLink href="/trade-in/v3" label="Terug naar je items" />
          <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.02em', margin: '10px 0 0', color: C.text }}>Je gegevens</h2>
          <p style={{ color: C.sec, margin: '6px 0 22px', fontSize: 15 }}>We sturen je bod ook per e-mail, zodat je het rustig kunt bekijken. We delen je gegevens nooit met derden.</p>

          <div style={{ ...card, padding: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <label className="ti3-label"><span>Voornaam *</span><input value={c.firstName} onChange={e => set({ firstName: e.target.value })} style={input} /></label>
              <label className="ti3-label"><span>Achternaam *</span><input value={c.lastName} onChange={e => set({ lastName: e.target.value })} style={input} /></label>
              <label className="ti3-label"><span>E-mailadres *</span><input type="email" value={c.email} onChange={e => set({ email: e.target.value })} style={input} placeholder="jij@voorbeeld.nl" /></label>
              <label className="ti3-label"><span>Telefoon <span style={{ color: C.sec, fontWeight: 500 }}>(optioneel)</span></span><input type="tel" value={c.phone} onChange={e => set({ phone: e.target.value })} style={input} placeholder="06 12345678" /></label>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, padding: '12px 14px', border: `1.5px solid ${c.isBusiness ? C.text : C.border}`, borderRadius: 10, cursor: 'pointer', fontSize: 14, color: C.text }}>
              <input type="checkbox" checked={c.isBusiness} onChange={e => set({ isBusiness: e.target.checked })} style={{ width: 16, height: 16, accentColor: C.accent }} />
              Ik verkoop zakelijk
            </label>

            {c.isBusiness && (
              <div style={{ marginTop: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <label className="ti3-label"><span>Vestigingsland *</span>
                    <select value={c.country} onChange={e => set({ country: e.target.value })} style={input}>
                      {COUNTRIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </label>
                  {!NON_EU.includes(c.country) && (
                    <label className="ti3-label"><span>BTW-nummer *</span>
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
              <button disabled={!ok} onClick={() => router.push('/trade-in/v3/bod')} style={{ ...btnCta, opacity: ok ? 1 : 0.45, cursor: ok ? 'pointer' : 'default' }}>Ontvang je bod →</button>
            </div>
          </div>
        </div>
      </div>
      <style>{`.ti3-label{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:700;color:#1E2133}`}</style>
    </>
  );
}

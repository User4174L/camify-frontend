'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import SimplePage from '@/components/layout/SimplePage';
import RetourWizard, { DEMO_LINK_REPARATIE, DEMO_ORDER_BE, DEMO_ORDER_NL, type RetourLinkContext, type RetourOrder } from '@/components/returns/RetourWizard';

/**
 * /retour — retourzending aanmaken.
 *
 * Drie manieren om hier te komen:
 *   1. los, via klantenservice/footer: klant zoekt zelf de bestelling op (stap 0)
 *   2. vanuit /bestelling-annuleren of het account: bestelling al bekend (start bij artikelen)
 *   3. via een link van de klantenservice (?link=…): bestelling én reden staan vast, € 0
 *      → voor gevallen buiten het normale herroepingsproces, zoals een reparatie in de
 *        garantie of een defect na de bedenktijd. Eén link per zaak, met vervaldatum.
 *
 * Referentiepagina: de scenario-knoppen tonen elke variant met demo-data.
 */

type Scenario = 'zelf' | 'nl' | 'be' | 'duur' | 'link';

const SCENARIOS: { k: Scenario; l: string; d: string }[] = [
  { k: 'zelf', l: 'Zelf opzoeken',           d: 'Bestelnummer + e-mail, NL, herroeping € 6,95' },
  { k: 'nl',   l: 'Vanuit bestelling (NL)',   d: 'Order bekend, herroeping, € 6,95, direct betalen' },
  { k: 'be',   l: 'België, defect',           d: 'DHL Parcel Connect, gratis retour' },
  { k: 'duur', l: 'Dure retour (€ 2.700)',    d: 'Direct betalen, verzekerd door ons' },
  { k: 'link', l: 'Link van klantenservice',  d: 'Reden reparatie staat vast, € 0' },
];

function pick(s: Scenario): { order?: RetourOrder; link?: RetourLinkContext } {
  switch (s) {
    case 'zelf': return {};
    case 'nl':   return { order: DEMO_ORDER_NL({ artikelen: [{ id: 'a2', naam: 'Canon RF 24-105mm f/4 L IS USM', sub: 'Goed · SKU 19685', prijs: 699 }] }) };
    case 'be':   return { order: DEMO_ORDER_BE };
    case 'duur': return { order: DEMO_ORDER_NL() };
    case 'link': return { order: DEMO_ORDER_NL({ artikelen: [{ id: 'a1', naam: 'Canon EOS R6 Mark II', sub: 'Zeer goed · SKU 21326', prijs: 1999 }] }), link: DEMO_LINK_REPARATIE };
  }
}

function RetourInner() {
  const params = useSearchParams();
  const viaLink = !!params.get('link');
  const [scenario, setScenario] = useState<Scenario>(viaLink ? 'link' : 'zelf');
  const [open, setOpen] = useState(false);
  useEffect(() => { if (viaLink) setOpen(true); }, [viaLink]);
  const ctx = pick(scenario);

  return (
    <SimplePage
      title="Retourzending aanmaken"
      breadcrumb="Retourzending"
      parent={{ label: 'Klantenservice', href: '/customer-service' }}
      eyebrow="Klantenservice"
      image="/images/hero-photographer-2.jpg"
      intro="Iets terugsturen? Zoek je bestelling op, kies wat je terugstuurt en waarom, en je hebt binnen een minuut je retourlabel of QR-code. Geen printer nodig."
    >
      <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit,minmax(168px,1fr))', margin: '0 0 26px' }}>
        {[
          { n: 1, t: 'Opzoeken', d: 'Bestelnummer en e-mailadres' },
          { n: 2, t: 'Kiezen', d: 'Wat gaat terug en waarom' },
          { n: 3, t: 'Verzenden', d: 'QR-code of label, afgiftepunt in de buurt' },
          { n: 4, t: 'Geld terug', d: '3 tot 5 werkdagen na controle' },
        ].map(s => (
          <div key={s.n} style={{ background: '#fff', border: '1.5px solid #EEEEF2', borderRadius: 12, padding: '15px 16px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 999, background: '#FDF1E7', color: '#B85C16', fontSize: 12, fontWeight: 700, marginBottom: 9 }}>{s.n}</div>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>{s.t}</div>
            <div style={{ fontSize: 12.5, color: '#8A8C99', lineHeight: 1.5 }}>{s.d}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1.5px solid #EEEEF2', borderRadius: 14, padding: '22px 24px', marginBottom: 22 }}>
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Start je retour</div>
        <p style={{ fontSize: 14, color: 'var(--text-sec)', margin: '0 0 10px', lineHeight: 1.6 }}>
          Retourkosten — precies wat het label ons kost:
        </p>
        <ul style={{ listStyle: 'none', margin: '0 0 14px', padding: 0, maxWidth: 420 }}>
          {[
            ['Nederland', '€ 6,95'],
            ['België, Duitsland, Frankrijk', '€ 12,95'],
            ['Overige EU-landen', '€ 24,95'],
            ['Defect, beschadigd of verkeerd geleverd', 'Gratis'],
          ].map(([l, b]) => (
            <li key={l} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
              <span style={{ color: 'var(--text-sec)' }}>{l}</span>
              <strong style={{ color: 'var(--text)', whiteSpace: 'nowrap' }}>{b}</strong>
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => setOpen(true)} style={{ padding: '13px 26px', fontSize: 15, fontWeight: 700, color: '#fff', background: '#E8692A', border: 'none', borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit' }}>
          Retourzending aanmaken
        </button>
        <span style={{ marginLeft: 14, fontSize: 13, color: '#8A8C99' }}>Ingelogd? Start dan vanuit <Link href="/account" style={{ color: 'var(--accent)' }}>je bestelling</Link>, dan staat alles al klaar.</span>
      </div>

      {/* Alleen voor deze referentiepagina */}
      <div style={{ fontSize: 12.5, color: '#8A8C99', marginBottom: 8, fontWeight: 700 }}>Voorbeeld tonen (demo):</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 30 }}>
        {SCENARIOS.map(s => (
          <button key={s.k} type="button" title={s.d} onClick={() => { setScenario(s.k); setOpen(true); }} style={{
            padding: '6px 12px', borderRadius: 999, fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit',
            border: `1px solid ${scenario === s.k ? '#E8692A' : 'var(--border)'}`,
            background: scenario === s.k ? '#FDF1E7' : '#fff', color: scenario === s.k ? '#B85C16' : 'var(--text-sec)',
          }}>{s.l}</button>
        ))}
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 10px' }}>Hoe het werkt</h2>
      <ul style={{ listStyle: 'disc outside', margin: '0 0 16px', paddingLeft: 22, fontSize: 14.5, color: 'var(--text-sec)', lineHeight: 1.85 }}>
        <li>Je zoekt je bestelling op met bestelnummer en e-mailadres — inloggen hoeft niet.</li>
        <li>Je vinkt aan wat teruggaat en kiest per artikel de reden. Een foto erbij mag.</li>
        <li>Je kiest: QR-code (geen printer nodig) of label printen. De vervoerder ligt per land vast, zodat het altijd het goedkoopste label is.</li>
        <li>Je ziet de retourkosten en betaalt die direct (iDEAL, Bancontact, creditcard). Bij een defect of onze fout is het gratis.</li>
        <li>Je label of QR-code staat meteen klaar; je hoeft nergens op te wachten.</li>
        <li>Elke retour is tijdens het vervoer verzekerd, zonder extra kosten.</li>
        <li>De status volg je in je account: onderweg, ontvangen, terugbetaald.</li>
        <li>Reparatie of retour buiten de bedenktijd? Dan sturen wij je een link — reden staat al ingevuld en je betaalt niets.</li>
      </ul>
      <p style={{ fontSize: 14.5, color: 'var(--text-sec)', lineHeight: 1.65 }}>
        Wil je alleen je bestelling annuleren (herroepen) en het label later? Dat kan via <Link href="/bestelling-annuleren" style={{ color: 'var(--accent)' }}>bestelling annuleren</Link>.
      </p>

      <RetourWizard open={open} onClose={() => setOpen(false)} order={ctx.order} link={ctx.link} />
    </SimplePage>
  );
}

export default function RetourPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '48px 24px' }}>Laden…</div>}>
      <RetourInner />
    </Suspense>
  );
}

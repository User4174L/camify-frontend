'use client';

/**
 * Pop-up "Hoe vind ik mijn shuttercount?" — per merk 1-3 regels, met (externe) tools waar nodig.
 * Inhoud wordt bijgewerkt op basis van het merk-onderzoek (zie CHANGES.md); teksten bewust voorzichtig
 * ("bij de meeste", "nieuwere modellen") waar we niet elk model kunnen verifiëren.
 * Externe links: rel="noopener noreferrer" — uitgaande links naar relevante hulpmiddelen zijn geen SEO-nadeel.
 */

import { useEffect } from 'react';
import Link from 'next/link';

const C = { text: '#1E2133', sec: '#6B6D80', border: '#EEEEF2', surface: '#F4F4F7', accent: '#E8692A' };

type Brand = { name: string; how: string; tool?: { label: string; href: string; ext?: boolean }; note?: string };

export const SHUTTER_BRANDS: Brand[] = [
  {
    name: 'Nikon',
    how: 'Staat in elke originele foto (JPEG of NEF). Gebruik onze gratis check — sleep een foto van de geheugenkaart erin en je ziet het getal direct.',
    tool: { label: 'Gratis check (in je browser, niets wordt geüpload)', href: '/shuttercount-checken#tool' },
    note: 'Let op: de Z8 en Z9 hebben geen mechanische sluiter — het getal is daar geen slijtage-indicatie.',
  },
  {
    name: 'Sony',
    how: 'Staat versleuteld in elke originele foto (JPEG of ARW). Onze check leest het uit voor vrijwel alle A7/A9/A1/A6000-modellen.',
    tool: { label: 'Gratis check (in je browser)', href: '/shuttercount-checken#tool' },
    note: 'a1 II / a7 V: alleen uit een foto die met de mechanische sluiter is gemaakt. a9 III heeft geen mechanische sluiter.',
  },
  {
    name: 'Canon',
    how: 'Alleen de EOS R3 en R1 tonen het in het menu (Set-up → Systeemstatus, afgerond op 1.000). Voor de R5, R6, R6 II, R8 en R50 leest onze check het uit een originele JPEG (bèta). Overige EOS-modellen: alleen via een programma met USB-kabel.',
    tool: { label: 'Gratis check (R5/R6/R6 II/R8/R50, JPEG)', href: '/shuttercount-checken#tool' },
    note: 'Geen mogelijkheid? Geen probleem — wij lezen het uit bij ontvangst.',
  },
  {
    name: 'Fujifilm',
    how: 'X100V en X100VI: menu SET UP → USER SETTING → SHUTTER COUNT. X-H2, X-H2S, X-T5 en X-S20: via de Fujifilm XApp (tab Equipment, na firmware-update). Het staat niet in de foto.',
  },
  {
    name: 'OM System / Olympus',
    how: 'Via het verborgen servicemenu (MENU ingedrukt houden bij inschakelen, daarna een toetsencombinatie). De regel “R” is het aantal sluiteropnamen.',
    tool: { label: 'Stappen per model', href: '/shuttercount-checken#olympus' },
  },
  {
    name: 'Pentax / Ricoh GR',
    how: 'Staat (versleuteld) in elke originele foto (JPEG, PEF of DNG). Onze check leest het direct uit.',
    tool: { label: 'Gratis check (in je browser)', href: '/shuttercount-checken#tool' },
  },
  {
    name: 'Panasonic / Leica / overig',
    how: 'Lumix: via de servicemodus (regel SHTCNT). Leica en de meeste overige merken: alleen via de fabrikant. Weet je het niet, dan is dat geen probleem — wij lezen het uit zodra je camera binnen is.',
    tool: { label: 'Alle stappen per merk', href: '/shuttercount-checken' },
  },
];

export default function ShutterHelp({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(30,33,51,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="shutter-help-title" style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 640, maxHeight: '88vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,.25)' }}>
        <div style={{ padding: '18px 22px 12px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'flex-start', gap: 12, position: 'sticky', top: 0, background: '#fff', borderRadius: '16px 16px 0 0' }}>
          <div style={{ flex: 1 }}>
            <h3 id="shutter-help-title" style={{ margin: 0, fontSize: 18, fontWeight: 800, color: C.text }}>Hoe vind ik mijn shuttercount?</h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: C.sec, lineHeight: 1.5 }}>Kort per merk. Weet je het niet zeker? Laat “Tot 25.000” staan — we controleren het bij ontvangst en passen het bod eerlijk aan.</p>
          </div>
          <button onClick={onClose} aria-label="Sluiten" style={{ width: 32, height: 32, borderRadius: '50%', border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', color: C.sec, fontSize: 18, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: '6px 22px 18px' }}>
          {SHUTTER_BRANDS.map((b, i) => (
            <div key={b.name} style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 14, padding: '12px 0', borderBottom: i < SHUTTER_BRANDS.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: C.text }}>{b.name}</div>
              <div style={{ fontSize: 13.5, color: C.sec, lineHeight: 1.6 }}>
                {b.how}
                {b.tool && (
                  <div style={{ marginTop: 4 }}>
                    {b.tool.ext ? (
                      <a href={b.tool.href} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, fontWeight: 700 }}>{b.tool.label} ↗</a>
                    ) : (
                      <Link href={b.tool.href} target="_blank" style={{ color: C.accent, fontWeight: 700 }}>{b.tool.label} →</Link>
                    )}
                  </div>
                )}
                {b.note && <div style={{ marginTop: 4, fontSize: 12.5, color: C.text }}>{b.note}</div>}
              </div>
            </div>
          ))}
          <div style={{ marginTop: 14, padding: '12px 14px', borderRadius: 10, background: C.surface, fontSize: 13, color: C.text, lineHeight: 1.55 }}>
            <strong>Tip:</strong> gebruik altijd een originele foto rechtstreeks van de geheugenkaart. Foto’s via WhatsApp, e-mail of bewerkingsprogramma’s verliezen deze informatie.
            {' '}<Link href="/shuttercount-checken" target="_blank" style={{ color: C.accent, fontWeight: 700 }}>Alle uitleg + gratis check →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

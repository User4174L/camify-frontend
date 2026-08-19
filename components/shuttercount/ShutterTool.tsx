'use client';

/**
 * Shuttercount-check: dropzone met diafragma-animatie + resultaat met gericht advies per situatie.
 * - Herkent camera (merk+model) ook als de teller niet leesbaar is → verkoop-CTA met model voorgevuld
 *   (/trade-in/v3?product=… — de flow leest de query-param; in echte V2: zelfde patroon op de inruilpagina).
 * - Foutgevallen krijgen concreet advies (WhatsApp/export, PNG/screenshot, HEIC, video, CR3, merk zonder
 *   teller-in-foto) zodat de klant niet met een vraagteken blijft zitten.
 */

import { useCallback, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { readShutterCount, friendlyCameraName, type ShutterResult } from '@/lib/shuttercount';

const C = { text: '#1E2133', sec: '#6B6D80', border: '#EEEEF2', surface: '#F4F4F7', accent: '#E8692A', ok: '#16A34A' };

/* ── Diafragma (6 bladen) — draait traag; sneller + dichtknijpen tijdens analyse ── */
function Aperture({ busy, drag }: { busy: boolean; drag: boolean }) {
  const blades = Array.from({ length: 6 });
  return (
    <div className={`sc-ap ${busy ? 'sc-ap--busy' : ''} ${drag ? 'sc-ap--drag' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 120 120" width="96" height="96">
        <circle cx="60" cy="60" r="57" fill="none" stroke="currentColor" strokeOpacity=".22" strokeWidth="5" />
        <circle cx="60" cy="60" r="49" fill="none" stroke="currentColor" strokeOpacity=".12" strokeWidth="1.5" />
        <g className="sc-ap-blades">
          {blades.map((_, i) => (
            <path
              key={i}
              d="M60 60 L60 14 A46 46 0 0 1 99.8 37 Z"
              fill="currentColor"
              fillOpacity={i % 2 ? 0.32 : 0.5}
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinejoin="round"
              transform={`rotate(${i * 60} 60 60)`}
            />
          ))}
        </g>
        <circle className="sc-ap-iris" cx="60" cy="60" r="15" fill="#fff" />
        <circle className="sc-ap-iris" cx="60" cy="60" r="11" fill="currentColor" />
      </svg>
    </div>
  );
}

function niceCount(n?: number) { return n === undefined ? '' : n.toLocaleString('nl-NL'); }

/** Advies-regels per uitkomst (aanvullend op result.message). */
function adviceFor(res: ShutterResult): string[] {
  if (res.status === 'ok') return [];
  if (res.status === 'no-makernote') {
    return [
      'Gebruik het originele bestand rechtstreeks van de geheugenkaart (kaartlezer of USB).',
      'Via WhatsApp versturen kan wél: kies "Document" in plaats van "Foto" — dan blijven de gegevens behouden.',
      'Exports uit Lightroom/Photoshop en downloads van social media werken niet.',
    ];
  }
  if (res.fileKind === 'png' || res.fileKind === 'webp') return ['Maak geen schermafbeelding van de foto — sleep het originele bestand zelf hierheen.'];
  if (res.fileKind === 'heic') return ['Zet de camera (of telefoon-export) op JPEG, of pak het RAW-bestand van de kaart.'];
  if (res.fileKind === 'video') return ['Maak één foto met de camera en gebruik dat bestand.'];
  return [];
}

export default function ShutterTool() {
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<ShutterResult | null>(null);
  const [fileName, setFileName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = useCallback(async (file: File) => {
    setBusy(true); setRes(null); setFileName(file.name);
    const started = Date.now();
    try {
      const slice = file.size > 8 * 1024 * 1024 ? file.slice(0, 8 * 1024 * 1024) : file;
      const buf = await slice.arrayBuffer();
      const r = readShutterCount(buf);
      // korte minimumduur zodat de analyse-animatie niet "flitst"
      const wait = Math.max(0, 900 - (Date.now() - started));
      setTimeout(() => { setRes(r); setBusy(false); }, wait);
    } catch {
      setRes({ status: 'unreadable', message: 'Kon dit bestand niet lezen.' }); setBusy(false);
    }
  }, []);

  const camera = useMemo(() => (res ? friendlyCameraName(res.make, res.model) : undefined), [res]);
  const sellHref = camera ? `/trade-in/v3?product=${encodeURIComponent(camera)}` : '/trade-in/v3';
  const ok = res?.status === 'ok';
  const advice = res ? adviceFor(res) : [];

  return (
    <div id="tool" style={{ background: '#fff', border: `1.5px solid ${C.border}`, borderRadius: 20, padding: 22, boxShadow: '0 2px 14px rgba(30,33,51,.05)' }}>
      <div className="sc-grid">
        {/* Dropzone */}
        <div
          className={`sc-drop ${drag ? 'sc-drop--drag' : ''} ${busy ? 'sc-drop--busy' : ''}`}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) handle(f); }}
          onClick={() => inputRef.current?.click()}
          role="button"
          aria-label="Kies of sleep een originele foto"
        >
          <input ref={inputRef} type="file" accept=".jpg,.jpeg,.nef,.nrw,.pef,.dng,.arw,.tif,.tiff,image/jpeg,image/tiff" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handle(f); }} />
          <Aperture busy={busy} drag={drag} />
          <div style={{ fontWeight: 800, fontSize: 16.5, color: C.text, marginTop: 14 }}>
            {busy ? 'Foto wordt geanalyseerd…' : drag ? 'Laat maar los!' : 'Sleep je foto hierheen'}
          </div>
          <div style={{ fontSize: 13, color: C.sec, marginTop: 5, lineHeight: 1.55 }}>
            {busy ? 'We lezen de cameragegevens — dit blijft in je browser.' : <>of <span style={{ color: C.accent, fontWeight: 700, textDecoration: 'underline' }}>kies een bestand</span> · JPEG of RAW, rechtstreeks van de geheugenkaart</>}
          </div>
          {busy && <div className="sc-scan" />}
        </div>

        {/* Resultaat / uitleg */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 220 }}>
          {!res && !busy && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: C.accent, marginBottom: 6 }}>Gratis &amp; privé</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.text, lineHeight: 1.35, marginBottom: 8 }}>Je shuttercount in één seconde</div>
              <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
                {['Werkt voor Nikon, Sony, Pentax/Ricoh en (bèta) Canon R5/R6/R6 II/R8/R50', 'Je foto wordt níet geüpload — alles gebeurt in je browser', 'We herkennen ook je cameramodel: direct een bod aanvragen kan meteen'].map(t => (
                  <li key={t} style={{ display: 'flex', gap: 8, fontSize: 13.5, color: C.sec, lineHeight: 1.55, marginBottom: 7 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.ok} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 3 }}><polyline points="20 6 9 17 4 12" /></svg>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {busy && (
            <div style={{ color: C.sec, fontSize: 14 }}>
              <div className="sc-pulse" style={{ fontWeight: 700, color: C.text, fontSize: 15 }}>Bezig met analyseren van {fileName}…</div>
              <div style={{ marginTop: 6 }}>Cameramodel herkennen → teller zoeken → ontcijferen.</div>
            </div>
          )}

          {res && !busy && (
            <div className="sc-result" style={{ borderRadius: 14, padding: '18px 20px', background: ok ? '#F0FDF4' : C.surface, border: `1.5px solid ${ok ? '#BBF7D0' : C.border}` }}>
              <div style={{ fontSize: 12, color: C.sec, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <span>{fileName}</span>
                {camera && <span style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 999, padding: '2px 10px', fontWeight: 700, color: C.text }}>📷 {camera}</span>}
              </div>

              {ok ? (
                <>
                  <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: C.ok, marginTop: 8 }}>Shuttercount</div>
                  <div style={{ fontSize: 42, fontWeight: 800, color: C.text, lineHeight: 1.05 }}>{niceCount(res.shutterCount)}</div>
                  {res.mechanicalShutterCount !== undefined && res.mechanicalShutterCount !== res.shutterCount && (
                    <div style={{ fontSize: 13, color: C.sec, marginTop: 2 }}>waarvan mechanisch: <strong style={{ color: C.text }}>{niceCount(res.mechanicalShutterCount)}</strong></div>
                  )}
                  <div style={{ fontSize: 12.5, color: C.sec, marginTop: 8, lineHeight: 1.55 }}>{res.message}</div>
                </>
              ) : (
                <>
                  <div style={{ fontWeight: 800, fontSize: 15.5, color: C.text, marginTop: 8 }}>
                    {res.status === 'unsupported-brand' && camera ? `We herkennen je ${camera} — alleen staat de teller bij dit model niet in de foto` : 'Geen shuttercount gevonden — dit is er aan de hand'}
                  </div>
                  <div style={{ fontSize: 13.5, color: C.sec, marginTop: 6, lineHeight: 1.65 }}>{res.message}</div>
                  {advice.length > 0 && (
                    <ul style={{ margin: '8px 0 0', paddingLeft: 0, listStyle: 'none' }}>
                      {advice.map(a => (
                        <li key={a} style={{ display: 'flex', gap: 8, fontSize: 13, color: C.sec, lineHeight: 1.55, marginBottom: 5 }}>
                          <span style={{ color: C.accent, fontWeight: 800 }}>→</span>{a}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}

              <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <Link href={sellHref} style={{ background: C.ok, color: '#fff', borderRadius: 999, padding: '12px 22px', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
                  {camera ? `Verkoop je ${camera} — vraag een bod aan →` : 'Verkopen? Vraag direct een bod aan →'}
                </Link>
                <button onClick={() => { setRes(null); setFileName(''); }} style={{ background: 'none', border: 'none', color: C.sec, fontSize: 13, fontWeight: 600, textDecoration: 'underline', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Nog een foto checken
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .sc-grid{display:grid;grid-template-columns:minmax(260px,340px) 1fr;gap:22px;align-items:stretch}
        @media(max-width:760px){.sc-grid{grid-template-columns:1fr}}
        .sc-drop{position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;aspect-ratio:1/1;max-height:340px;border:2px dashed #EEEEF2;border-radius:18px;background:
          radial-gradient(120% 120% at 80% 0%, #FBE9DF 0%, #F8F8FA 55%, #fff 100%);cursor:pointer;padding:26px;transition:border-color .2s, transform .2s, box-shadow .2s;color:#E8692A}
        .sc-drop:hover{border-color:#E8692A;box-shadow:0 6px 24px rgba(232,105,42,.12)}
        .sc-drop--drag{border-color:#E8692A;transform:scale(1.015);box-shadow:0 10px 32px rgba(232,105,42,.18)}
        .sc-drop--busy{cursor:progress}
        .sc-ap{color:#E8692A;filter:drop-shadow(0 3px 8px rgba(232,105,42,.18))}
        .sc-ap-blades{transform-origin:60px 60px;animation:scSpin 14s linear infinite}
        .sc-ap--drag .sc-ap-blades{animation-duration:4s}
        .sc-ap--busy .sc-ap-blades{animation-duration:1.6s}
        .sc-ap-iris{transform-origin:60px 60px;transition:transform .4s}
        .sc-ap svg{display:block}
        .sc-ap--busy .sc-ap-iris{animation:scIris 1.2s ease-in-out infinite}
        .sc-ap--drag .sc-ap-iris{transform:scale(.6)}
        @keyframes scSpin{to{transform:rotate(360deg)}}
        @keyframes scIris{0%,100%{transform:scale(1)}50%{transform:scale(.45)}}
        .sc-scan{position:absolute;left:8%;right:8%;height:2px;border-radius:2px;background:linear-gradient(90deg,transparent,#E8692A,transparent);animation:scScan 1.4s ease-in-out infinite}
        @keyframes scScan{0%{top:18%}50%{top:80%}100%{top:18%}}
        .sc-pulse{animation:scPulse 1.2s ease-in-out infinite}
        @keyframes scPulse{0%,100%{opacity:1}50%{opacity:.55}}
        .sc-result{animation:scIn .35s cubic-bezier(.16,1,.3,1)}
        @keyframes scIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @media(prefers-reduced-motion:reduce){.sc-ap-blades,.sc-ap-iris,.sc-scan,.sc-pulse,.sc-result{animation:none !important}}
      `}</style>
    </div>
  );
}

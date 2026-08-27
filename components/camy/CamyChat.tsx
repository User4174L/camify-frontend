'use client';

/**
 * Camy — chatwidget in twee verschijningsvormen, één gesprek.
 *
 *  <CamyLauncher />  floating knop rechtsonder; paneel klapt naar boven open.
 *  <CamyInline />    knop in de pagina (product-/variantpagina); paneel klapt naar beneden open.
 *
 * Beide gebruiken hetzelfde paneel en dezelfde `useCamy`-hook. Wat verschilt is de scope die
 * meegaat naar de agent — die bepaalt daar welke gegevens bereikbaar zijn.
 *
 * Vormgeving volgt het brandbook: warme neutralen (#1E2133 / #F8F8FA / #EEEEF2), accent #E8692A
 * met hover #D15A20, DM Sans, zachte schaduwen, lift van 1–2px, bewegingen van 0.2–0.3s. Geen
 * glaseffecten, geen gradients — de widget hoort bij de winkel, niet erbovenop.
 */

import { useCallback, useEffect, useId, useRef, useState } from 'react';

export type CamyScope = 'variant' | 'product' | 'general' | 'customer' | 'internal';

export interface CamyContext {
  scope: CamyScope;
  variantId?: string;
  productId?: string;
  customerId?: string;
  /** Alleen testopstelling — in productie bepaalt de sessie de rol. */
  role?: 'anonymous' | 'customer' | 'employee';
  employee?: boolean;
  /** Toont responstijd, kosten en gebruikte tools onder elk antwoord. Alleen voor onszelf. */
  debug?: boolean;
}

interface Turn {
  role: 'user' | 'assistant';
  text: string;
  meta?: { costEur?: number; latencyMs?: number; tools?: string[] };
}

/* ------------------------------------------------------------------ */
/*  Gesprekslogica                                                     */
/* ------------------------------------------------------------------ */

function useCamy(ctx: CamyContext) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Andere pagina of andere rol → schoon beginnen; anders praat je door in een andere context.
  useEffect(() => {
    setTurns([]);
    setError(null);
  }, [ctx.scope, ctx.variantId, ctx.productId, ctx.customerId, ctx.role]);

  const send = useCallback(
    async (question: string) => {
      const q = question.trim();
      if (!q || busy) return;
      const next: Turn[] = [...turns, { role: 'user', text: q }];
      setTurns(next);
      setBusy(true);
      setError(null);
      try {
        const res = await fetch('/api/camy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scope: ctx.scope,
            role: ctx.role,
            employee: ctx.employee,
            context: {
              variant_id: ctx.variantId,
              product_id: ctx.productId,
              customer_id: ctx.customerId,
            },
            messages: next.map((t) => ({ role: t.role, text: t.text })),
          }),
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          setError(
            typeof data.detail === 'string'
              ? data.detail
              : data.error?.message || data.error || 'Er ging even iets mis. Probeer het opnieuw.',
          );
        } else {
          setTurns([
            ...next,
            {
              role: 'assistant',
              text: data.text ?? '',
              meta: { costEur: data.cost_eur, latencyMs: data.latency_ms, tools: data.tools_used },
            },
          ]);
        }
      } catch {
        setError('Kon Camy niet bereiken.');
      } finally {
        setBusy(false);
      }
    },
    [busy, ctx, turns],
  );

  return { turns, busy, error, send };
}

/** Showroom-uren: ma t/m vr 09:00–16:30, zaterdag op afspraak, zondag dicht. */
function useTeamOnline(): boolean | null {
  const [online, setOnline] = useState<boolean | null>(null);
  useEffect(() => {
    const check = () => {
      const parts = new Intl.DateTimeFormat('nl-NL', {
        timeZone: 'Europe/Amsterdam',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).formatToParts(new Date());
      const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
      const day = get('weekday').toLowerCase();
      const minutes = Number(get('hour')) * 60 + Number(get('minute'));
      const weekday = !day.startsWith('za') && !day.startsWith('zo');
      setOnline(weekday && minutes >= 9 * 60 && minutes < 16 * 60 + 30);
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);
  return online;
}

/* ------------------------------------------------------------------ */
/*  Tekstweergave                                                      */
/* ------------------------------------------------------------------ */

function inline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1] !== undefined) parts.push(<strong key={`b${m.index}`}>{m[1]}</strong>);
    else
      parts.push(
        <a key={`a${m.index}`} href={m[3]} target="_blank" rel="noopener noreferrer" className="camy-link">
          {m[2]}
        </a>,
      );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function Rich({ text }: { text: string }) {
  const nodes: React.ReactNode[] = [];
  let bullets: React.ReactNode[] = [];
  const flush = () => {
    if (bullets.length) {
      nodes.push(
        <ul key={`u${nodes.length}`} className="camy-list">
          {bullets}
        </ul>,
      );
      bullets = [];
    }
  };
  text.split('\n').forEach((line, i) => {
    const b = line.match(/^\s*[-*•]\s+(.*)$/);
    if (b) {
      bullets.push(<li key={i}>{inline(b[1])}</li>);
      return;
    }
    flush();
    if (line.trim() === '') nodes.push(<div key={`s${i}`} style={{ height: 6 }} />);
    else nodes.push(<p key={i}>{inline(line)}</p>);
  });
  flush();
  return <>{nodes}</>;
}

/* ------------------------------------------------------------------ */
/*  Iconen                                                             */
/* ------------------------------------------------------------------ */

const ChatIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HelpIcon = ({ size = 19 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="9.2" stroke="currentColor" strokeWidth="1.7" />
    <path
      d="M9.4 9.3a2.7 2.7 0 0 1 5.2.9c0 1.8-2.6 2.3-2.6 3.9"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <circle cx="12" cy="17.2" r="1.05" fill="currentColor" />
  </svg>
);

const CloseIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M4 12h15m0 0-6-6m6 6-6 6"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Paneel                                                             */
/* ------------------------------------------------------------------ */

const OPENERS: Record<CamyScope, { greeting: string; chips: string[] }> = {
  variant: {
    greeting: 'Vraag maar raak over dit exemplaar — conditie, wat erbij zit, garantie of btw.',
    chips: ['Wat zit erbij?', 'In welke staat is dit?', 'Marge of btw?'],
  },
  product: {
    greeting: 'Ik zie welke exemplaren we van dit product hebben. Waar kan ik mee helpen?',
    chips: ['Welke hebben jullie?', 'Wat is het verschil?'],
  },
  general: {
    greeting: 'Hoi! Vraag me iets over onze voorraad, verzending, garantie of inruilen.',
    chips: ['Hoe werkt inruilen?', 'Wat is de garantie?', 'Wanneer verzenden jullie?'],
  },
  customer: { greeting: 'Orders en quotes van deze klant.', chips: ['Status laatste order?'] },
  internal: {
    greeting: 'Volledige leestoegang: voorraad, orders, inkoop, marges, handleidingen.',
    chips: ['Van wie kwam SKU 21720?', 'Hoe pakken we garantie op?'],
  },
};

function Panel({
  ctx,
  onClose,
  variant,
}: {
  ctx: CamyContext;
  onClose: () => void;
  variant: 'floating' | 'inline';
}) {
  const { turns, busy, error, send } = useCamy(ctx);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const online = useTeamOnline();
  const opener = OPENERS[ctx.scope];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns, busy]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className={`camy-panel camy-panel--${variant}`} role="dialog" aria-label="Chat met Camy">
      <header className="camy-head">
        <span className="camy-avatar" aria-hidden>
          C
        </span>
        <div className="camy-head-text">
          <strong>Camy</strong>
          <span className="camy-status">
            <i className={online === false ? 'camy-dot camy-dot--off' : 'camy-dot'} />
            {online === false ? 'Team offline · ik help je direct' : 'Online'}
          </span>
        </div>
        <button onClick={onClose} className="camy-icon-btn" aria-label="Sluiten">
          <CloseIcon />
        </button>
      </header>

      <div className="camy-feed" ref={feedRef}>
        {turns.length === 0 && <p className="camy-greeting">{opener.greeting}</p>}

        {turns.map((t, i) =>
          t.role === 'user' ? (
            <div key={i} className="camy-bubble camy-bubble--me">
              {t.text}
            </div>
          ) : (
            <div key={i} className="camy-bubble camy-bubble--camy">
              <Rich text={t.text} />
              {t.meta && ctx.debug && (
                <span className="camy-meta">
                  {t.meta.latencyMs ? `${(t.meta.latencyMs / 1000).toFixed(1)}s` : ''}
                  {t.meta.costEur != null ? ` · €${t.meta.costEur.toFixed(4)}` : ''}
                  {t.meta.tools?.length ? ` · ${t.meta.tools.join(', ')}` : ' · direct uit de voorraad'}
                </span>
              )}
            </div>
          ),
        )}

        {busy && (
          <div className="camy-bubble camy-bubble--camy camy-typing" aria-label="Camy typt">
            <i /><i /><i />
          </div>
        )}

        {error && <p className="camy-error">{error}</p>}

        {turns.length === 0 && (
          <div className="camy-chips">
            {opener.chips.map((c) => (
              <button key={c} onClick={() => send(c)} className="camy-chip">
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        className="camy-compose"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
          setInput('');
        }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Stel je vraag…"
          aria-label="Je vraag"
          disabled={busy}
        />
        <button type="submit" disabled={busy || !input.trim()} aria-label="Versturen">
          <SendIcon />
        </button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Verschijningsvorm 1 — floating launcher                            */
/* ------------------------------------------------------------------ */

export function CamyLauncher(props: CamyContext & { label?: string }) {
  const [open, setOpen] = useState(false);
  const online = useTeamOnline();
  const id = useId();

  return (
    <div className="camy-root camy-root--floating">
      <CamyStyles />
      {open && (
        <div id={id} className="camy-pop camy-pop--up">
          <Panel ctx={props} variant="floating" onClose={() => setOpen(false)} />
        </div>
      )}
      <button
        className={`camy-launch${open ? ' camy-launch--open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        aria-label={open ? 'Chat sluiten' : 'Chat met Camy openen'}
      >
        {open ? (
          <CloseIcon size={20} />
        ) : (
          <>
            <span className="camy-launch-icon" aria-hidden>
              <ChatIcon />
            </span>
            <span className="camy-launch-text">
              {props.label ?? 'Vragen? Chat met ons'}
              <span className="camy-launch-sub">
                <i className={online === false ? 'camy-dot camy-dot--off' : 'camy-dot'} />
                {online === false ? 'Direct antwoord' : 'Online'}
              </span>
            </span>
          </>
        )}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Verschijningsvorm 2 — knop in de pagina                            */
/* ------------------------------------------------------------------ */

export function CamyInline(props: CamyContext & { label?: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const label =
    props.label ?? (props.scope === 'variant' ? 'Vraag over dit exemplaar' : 'Vraag over dit product');

  return (
    <div className="camy-root camy-root--inline">
      <CamyStyles />
      <button
        className={`camy-trigger${open ? ' camy-trigger--open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        aria-label={open ? `${label} — sluiten` : label}
      >
        <span className="camy-trigger-icon" aria-hidden>
          <HelpIcon />
        </span>
        <span className="camy-trigger-text">
          {label}
          <small>Conditie, accessoires, garantie of btw</small>
        </span>
        <svg className="camy-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div id={id} className={`camy-collapse${open ? ' camy-collapse--open' : ''}`}>
        <div className="camy-collapse-inner">
          {open && <Panel ctx={props} variant="inline" onClose={() => setOpen(false)} />}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stijl                                                              */
/* ------------------------------------------------------------------ */

function CamyStyles() {
  return (
    <style
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `
.camy-root{--camy-accent:var(--accent,#E8692A);--camy-accent-h:var(--accent-h,#D15A20);
  --camy-ink:var(--text,#1E2133);--camy-ink-2:var(--text-sec,#6B6D80);
  --camy-line:var(--border,#EEEEF2);--camy-surface:var(--surface,#F8F8FA);
  font-family:var(--font,'DM Sans',-apple-system,sans-serif);color:var(--camy-ink);}
.camy-root--floating{position:fixed;right:20px;bottom:20px;z-index:60;display:flex;flex-direction:column;align-items:flex-end;gap:12px;}

/* Launcher */
.camy-launch{display:inline-flex;align-items:center;gap:10px;background:#fff;color:var(--camy-ink);
  border:1px solid var(--camy-line);border-radius:50px;padding:8px 18px 8px 8px;cursor:pointer;
  box-shadow:0 6px 24px rgba(30,33,51,.10);transition:transform .25s ease,box-shadow .25s ease,background .2s;}
.camy-launch:hover{transform:translateY(-1px);box-shadow:0 10px 30px rgba(30,33,51,.14);}
.camy-launch-icon{width:36px;height:36px;border-radius:50%;background:var(--camy-accent);color:#fff;
  display:inline-flex;align-items:center;justify-content:center;flex:none;}
.camy-launch-text{display:flex;flex-direction:column;align-items:flex-start;font-size:14px;font-weight:600;line-height:1.25;}
.camy-launch-sub{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:500;color:var(--camy-ink-2);margin-top:1px;}
.camy-launch--open{width:52px;height:52px;padding:0;justify-content:center;background:var(--camy-ink);color:#fff;border-color:var(--camy-ink);}
.camy-dot{width:7px;height:7px;border-radius:50%;background:#22C55E;flex:none;box-shadow:0 0 0 2px rgba(34,197,94,.18);}
.camy-dot--off{background:#F59E0B;box-shadow:0 0 0 2px rgba(245,158,11,.18);}

/* Trigger in de pagina */
.camy-trigger{display:flex;align-items:center;gap:11px;width:100%;background:#fff;
  border:1px solid var(--camy-line);border-radius:var(--rl,12px);padding:12px 14px;cursor:pointer;text-align:left;
  transition:border-color .2s,box-shadow .25s ease,transform .25s ease;}
.camy-trigger:hover{border-color:#93B4F0;transform:translateY(-1px);box-shadow:0 4px 20px rgba(0,0,0,.06);}
.camy-trigger--open{border-color:#93B4F0;border-bottom-left-radius:0;border-bottom-right-radius:0;}
.camy-trigger-icon{width:34px;height:34px;border-radius:50%;background:#DBEAFE;color:#1E40AF;
  display:inline-flex;align-items:center;justify-content:center;flex:none;}
.camy-trigger-text{display:flex;flex-direction:column;font-size:14px;font-weight:600;line-height:1.3;flex:1;min-width:0;}
.camy-trigger-text small{font-weight:400;font-size:12px;color:var(--camy-ink-2);margin-top:2px;}
.camy-chevron{color:var(--camy-ink-2);transition:transform .25s ease;flex:none;}
.camy-trigger--open .camy-chevron{transform:rotate(180deg);}

/* Uitklappen zonder height te animeren */
.camy-collapse{display:grid;grid-template-rows:0fr;transition:grid-template-rows .3s cubic-bezier(.22,1,.36,1);}
.camy-collapse--open{grid-template-rows:1fr;}
.camy-collapse-inner{overflow:hidden;min-height:0;}

/* Paneel */
.camy-pop{transform-origin:bottom right;animation:camy-in .25s cubic-bezier(.22,1,.36,1);}
@keyframes camy-in{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}
.camy-panel{display:flex;flex-direction:column;background:#fff;overflow:hidden;}
.camy-panel--floating{width:376px;height:min(560px,calc(100vh - 130px));border-radius:16px;
  border:1px solid var(--camy-line);box-shadow:0 18px 50px rgba(30,33,51,.16);}
.camy-panel--inline{min-height:230px;max-height:400px;border:1px solid #93B4F0;border-top:0;
  border-radius:0 0 var(--rl,12px) var(--rl,12px);}

.camy-head{display:flex;align-items:center;gap:10px;padding:12px 12px 12px 14px;background:var(--camy-ink);color:#fff;}
.camy-avatar{width:32px;height:32px;border-radius:50%;background:var(--camy-accent);color:#fff;font-weight:700;
  font-size:14px;display:inline-flex;align-items:center;justify-content:center;flex:none;}
.camy-head-text{display:flex;flex-direction:column;line-height:1.2;flex:1;}
.camy-head-text strong{font-size:14.5px;}
.camy-status{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;color:rgba(255,255,255,.7);margin-top:2px;}
.camy-icon-btn{background:transparent;border:0;color:rgba(255,255,255,.7);cursor:pointer;padding:6px;border-radius:8px;
  display:inline-flex;transition:background .2s,color .2s;}
.camy-icon-btn:hover{background:rgba(255,255,255,.12);color:#fff;}

.camy-feed{flex:1;overflow-y:auto;padding:16px 14px;display:flex;flex-direction:column;gap:10px;background:#fff;}
.camy-greeting{margin:0;font-size:13.5px;color:var(--camy-ink-2);line-height:1.55;}
.camy-bubble{max-width:86%;font-size:13.5px;line-height:1.55;border-radius:14px;padding:10px 13px;}
.camy-bubble p{margin:0 0 2px;}
.camy-bubble--me{align-self:flex-end;background:var(--camy-surface);border-bottom-right-radius:5px;white-space:pre-wrap;}
.camy-bubble--camy{align-self:flex-start;background:#fff;border:1px solid var(--camy-line);border-bottom-left-radius:5px;
  box-shadow:0 2px 10px rgba(30,33,51,.04);}
.camy-list{margin:4px 0;padding-left:17px;}
.camy-list li{margin:1px 0;}
.camy-link{color:var(--camy-accent);text-decoration:underline;}
.camy-meta{display:block;margin-top:7px;font-size:10.5px;color:var(--camy-ink-2);opacity:.75;}
.camy-error{margin:0;font-size:12.5px;color:#991B1B;background:#FECACA;padding:8px 11px;border-radius:10px;}

.camy-typing{display:inline-flex;gap:4px;align-items:center;padding:13px;}
.camy-typing i{width:6px;height:6px;border-radius:50%;background:var(--camy-ink-2);opacity:.35;animation:camy-blink 1.2s infinite;}
.camy-typing i:nth-child(2){animation-delay:.18s}.camy-typing i:nth-child(3){animation-delay:.36s}
@keyframes camy-blink{0%,60%,100%{opacity:.25;transform:translateY(0)}30%{opacity:.85;transform:translateY(-2px)}}

.camy-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:2px;}
.camy-chip{border:1px solid var(--camy-line);background:#fff;border-radius:50px;padding:6px 12px;font-size:12.5px;
  color:var(--camy-ink);cursor:pointer;font-family:inherit;transition:border-color .2s,background .2s;}
.camy-chip:hover{border-color:var(--camy-accent);background:#FFF0E8;}

.camy-compose{display:flex;align-items:center;gap:8px;padding:10px 12px;border-top:1px solid var(--camy-line);background:#fff;}
.camy-compose input{flex:1;border:1px solid var(--camy-line);background:var(--camy-surface);border-radius:50px;
  padding:10px 14px;font-size:13.5px;font-family:inherit;color:var(--camy-ink);outline:none;transition:border-color .2s,box-shadow .2s;}
.camy-compose input:focus{border-color:var(--camy-accent);box-shadow:0 0 0 3px rgba(232,105,42,.08);background:#fff;}
.camy-compose button{width:38px;height:38px;border-radius:50%;border:0;background:var(--camy-accent);color:#fff;
  display:inline-flex;align-items:center;justify-content:center;cursor:pointer;flex:none;transition:background .2s,transform .2s;}
.camy-compose button:hover:not(:disabled){background:var(--camy-accent-h);transform:translateY(-1px);}
.camy-compose button:disabled{background:var(--camy-surface);color:var(--camy-ink-2);cursor:default;}

@media (max-width:520px){
  .camy-root--floating{right:12px;bottom:12px;left:12px;align-items:stretch;}
  .camy-panel--floating{width:auto;height:min(70vh,520px);}
  .camy-launch{align-self:flex-end;}
}
@media (prefers-reduced-motion:reduce){
  .camy-root *,.camy-pop{animation:none!important;transition:none!important;}
}
`,
      }}
    />
  );
}

export default CamyLauncher;

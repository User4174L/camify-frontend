'use client';

/**
 * CamyAsk — één blokje, meerdere plekken.
 *
 * Hetzelfde component bedient het variantblokje, het productblokje, de algemene widget en het
 * vraag-antwoordveld in de back office. Wat verschilt is de `scope` die meegaat naar de agent;
 * die bepaalt aan de serverkant welke gegevens er überhaupt bereikbaar zijn.
 */

import { useEffect, useRef, useState } from 'react';

const ACCENT = '#E8692A';

export type CamyScope = 'variant' | 'product' | 'general' | 'customer' | 'internal';

export interface CamyAskProps {
  scope: CamyScope;
  variantId?: string;
  productId?: string;
  customerId?: string;
  /** Alleen testopstelling — in productie bepaalt de sessie de rol. */
  role?: 'anonymous' | 'customer' | 'employee';
  /** Alleen testopstelling — vraagt de proxy om de medewerkerssleutel mee te sturen. */
  employee?: boolean;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  suggestions?: string[];
  compact?: boolean;
}

interface Turn {
  role: 'user' | 'assistant';
  text: string;
  meta?: { costEur?: number; latencyMs?: number; tools?: string[] };
}

/**
 * Minimale markdown-weergave: **vet**, opsommingen en links. Het model antwoordt in markdown en
 * zonder dit lees je letterlijke sterretjes. Bewust geen library — dit is alles wat we nodig hebben,
 * en het rendert als React-nodes (dus geen dangerouslySetInnerHTML met modeltekst erin).
 */
function renderRich(text: string): React.ReactNode {
  const lines = text.split('\n');
  const out: React.ReactNode[] = [];
  let bullets: React.ReactNode[] = [];

  const flush = () => {
    if (bullets.length) {
      out.push(
        <ul key={`ul-${out.length}`} style={{ margin: '4px 0', paddingLeft: 18 }}>
          {bullets}
        </ul>,
      );
      bullets = [];
    }
  };

  lines.forEach((line, i) => {
    const bullet = line.match(/^\s*[-*•]\s+(.*)$/);
    if (bullet) {
      bullets.push(<li key={`li-${i}`}>{inline(bullet[1])}</li>);
      return;
    }
    flush();
    if (line.trim() === '') {
      out.push(<div key={`sp-${i}`} style={{ height: 6 }} />);
      return;
    }
    out.push(<div key={`p-${i}`}>{inline(line)}</div>);
  });
  flush();
  return out;
}

function inline(text: string): React.ReactNode[] {
  // **vet** en losse [tekst](url) — alles daarbuiten blijft platte tekst.
  const parts: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      parts.push(<strong key={`b-${m.index}`}>{m[1]}</strong>);
    } else {
      parts.push(
        <a
          key={`a-${m.index}`}
          href={m[3]}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: ACCENT, textDecoration: 'underline' }}
        >
          {m[2]}
        </a>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

const DEFAULTS: Record<CamyScope, { title: string; subtitle: string; suggestions: string[] }> = {
  variant: {
    title: 'Vraag over dit exemplaar',
    subtitle: 'Conditie, accessoires, garantie, btw of marge — je krijgt direct antwoord.',
    suggestions: ['Wat zit erbij?', 'In welke staat is dit exemplaar?', 'Is dit marge of btw?'],
  },
  product: {
    title: 'Vraag over dit product',
    subtitle: 'Welke exemplaren we hebben en wat het verschil is.',
    suggestions: ['Welke exemplaren hebben jullie?', 'Wat is het verschil in staat?'],
  },
  general: {
    title: 'Stel je vraag',
    subtitle: 'Over onze voorraad, verzending, garantie of inruil.',
    suggestions: ['Hoe werkt inruilen?', 'Wat is jullie garantie?', 'Wanneer wordt er verzonden?'],
  },
  customer: {
    title: 'Camy — deze klant',
    subtitle: 'Orders en quotes van de klant uit dit gesprek.',
    suggestions: ['Wat is de status van de laatste order?', 'Lopen er open quotes?'],
  },
  internal: {
    title: 'Camy intern',
    subtitle: 'Volledige leestoegang: varianten, orders, inkoop, marges, handleidingen.',
    suggestions: ['Van wie kwam SKU 21720?', 'Hoe pakken we een garantiegeval op?'],
  },
};

export default function CamyAsk(props: CamyAskProps) {
  const { scope, variantId, productId, customerId, role, employee, compact } = props;
  const d = DEFAULTS[scope];
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [turns, busy]);

  // Van scope of pagina gewisseld → schoon beginnen, anders praat je verder in een andere context.
  useEffect(() => {
    setTurns([]);
    setError(null);
  }, [scope, variantId, productId, customerId, role]);

  async function send(question: string) {
    const q = question.trim();
    if (!q || busy) return;
    const next: Turn[] = [...turns, { role: 'user', text: q }];
    setTurns(next);
    setInput('');
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/camy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scope,
          role,
          employee,
          context: { variant_id: variantId, product_id: productId, customer_id: customerId },
          messages: next.map((t) => ({ role: t.role, text: t.text })),
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.detail || data.error || `Er ging iets mis (${res.status}).`);
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
  }

  return (
    <section
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        background: '#fff',
        padding: compact ? 16 : 20,
        maxWidth: 720,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <span
          aria-hidden
          style={{
            width: 28, height: 28, borderRadius: '50%', background: ACCENT, color: '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700,
          }}
        >
          C
        </span>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{props.title ?? d.title}</h3>
      </div>
      <p style={{ margin: '0 0 12px 38px', fontSize: 13, color: '#6b7280' }}>
        {props.subtitle ?? d.subtitle}
      </p>

      {turns.length > 0 && (
        <div
          style={{
            display: 'flex', flexDirection: 'column', gap: 10,
            maxHeight: 360, overflowY: 'auto', marginBottom: 12,
          }}
        >
          {turns.map((t, i) => (
            <div
              key={i}
              style={{
                alignSelf: t.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '88%',
                background: t.role === 'user' ? '#f3f4f6' : '#fff7f2',
                border: `1px solid ${t.role === 'user' ? '#e5e7eb' : '#fde3d1'}`,
                borderRadius: 10,
                padding: '10px 12px',
                fontSize: 14,
                lineHeight: 1.5,
                whiteSpace: t.role === 'user' ? 'pre-wrap' : 'normal',
              }}
            >
              {t.role === 'user' ? t.text : renderRich(t.text)}
              {t.meta && (
                <div style={{ marginTop: 6, fontSize: 11, color: '#9ca3af' }}>
                  {t.meta.latencyMs ? `${(t.meta.latencyMs / 1000).toFixed(1)}s` : null}
                  {t.meta.costEur != null ? ` · €${t.meta.costEur.toFixed(4)}` : null}
                  {t.meta.tools && t.meta.tools.length > 0
                    ? ` · ${t.meta.tools.join(', ')}`
                    : ' · geen lookups nodig'}
                </div>
              )}
            </div>
          ))}
          <div ref={endRef} />
        </div>
      )}

      {turns.length === 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {(props.suggestions ?? d.suggestions).map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              disabled={busy}
              style={{
                border: '1px solid #e5e7eb', borderRadius: 999, background: '#fafafa',
                padding: '6px 12px', fontSize: 13, cursor: 'pointer', color: '#374151',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        style={{ display: 'flex', gap: 8 }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={props.placeholder ?? 'Typ je vraag…'}
          disabled={busy}
          style={{
            flex: 1, border: '1px solid #d1d5db', borderRadius: 8,
            padding: '10px 12px', fontSize: 14, outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          style={{
            background: busy || !input.trim() ? '#f3f4f6' : ACCENT,
            color: busy || !input.trim() ? '#9ca3af' : '#fff',
            border: 'none', borderRadius: 8, padding: '10px 18px',
            fontSize: 14, fontWeight: 600,
            cursor: busy || !input.trim() ? 'default' : 'pointer',
          }}
        >
          {busy ? '…' : 'Vraag'}
        </button>
      </form>

      {busy && (
        <p style={{ margin: '10px 0 0', fontSize: 13, color: '#6b7280' }}>Camy zoekt het uit…</p>
      )}
      {error && (
        <p style={{ margin: '10px 0 0', fontSize: 13, color: '#b91c1c' }}>{error}</p>
      )}
    </section>
  );
}

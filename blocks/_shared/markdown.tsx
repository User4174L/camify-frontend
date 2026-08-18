import type { ReactNode } from 'react';

/**
 * Mini-markdown voor de referentie: alinea's, **vet**, [links](url), lijsten,
 * ## en ### koppen. In V2 vervangt `MarkdownRenderer` dit — de content-velden
 * met type 'markdown' zijn daar volwaardig.
 */
function inline(text: string, k: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    if (part.startsWith('**')) return <strong key={`${k}-${i}`}>{part.slice(2, -2)}</strong>;
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (m) return <a key={`${k}-${i}`} href={m[2]} className="font-semibold text-brand-600 underline-offset-2 hover:underline">{m[1]}</a>;
    return <span key={`${k}-${i}`}>{part}</span>;
  });
}

export function Markdown({ source, className }: { source: string; className?: string }) {
  const out: ReactNode[] = [];
  let list: string[] = [];
  const flush = (k: string) => {
    if (!list.length) return;
    out.push(<ul key={k} className="mb-4 list-disc space-y-1.5 pl-5">{list.map((li, i) => <li key={i}>{inline(li, `${k}-${i}`)}</li>)}</ul>);
    list = [];
  };
  source.split('\n').forEach((raw, i) => {
    const line = raw.trimEnd();
    const k = `l${i}`;
    if (line.startsWith('### ')) { flush(k); out.push(<h3 key={k} className="mb-2 mt-6 text-lg font-bold">{inline(line.slice(4), k)}</h3>); }
    else if (line.startsWith('## ')) { flush(k); out.push(<h2 key={k} className="mb-2 mt-8 text-2xl font-bold tracking-tight">{inline(line.slice(3), k)}</h2>); }
    else if (line.startsWith('- ')) list.push(line.slice(2));
    else if (line.trim() === '') flush(k);
    else { flush(k); out.push(<p key={k} className="mb-3.5 leading-[1.7]">{inline(line, k)}</p>); }
  });
  flush('end');
  return <div className={className}>{out}</div>;
}

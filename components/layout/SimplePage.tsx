import type { ReactNode } from 'react';
import Breadcrumb from '@/components/layout/Breadcrumb';

/**
 * Herbruikbare standalone tekstpagina (legal / customer-care / info).
 * In de echte app komt de content uit de StorefrontPage-CMS en is hij als
 * admin inline (markdown) bewerkbaar. Hier in de referentie tonen we de
 * content als markdown-string (basis overgenomen van camera-tweedehands.nl).
 */

function renderInline(text: string, keyBase: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={`${keyBase}-${i}`}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={`${keyBase}-${i}`}>{part}</span>
    ),
  );
}

function Markdown({ source }: { source: string }) {
  const lines = source.split('\n');
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  const flush = (key: string) => {
    if (list.length) {
      blocks.push(
        <ul key={key} style={{ margin: '0 0 16px', paddingLeft: 22, listStyle: 'disc' }}>
          {list.map((it, i) => (
            <li key={i} style={{ marginBottom: 6, paddingLeft: 4 }}>
              {renderInline(it, `${key}-${i}`)}
            </li>
          ))}
        </ul>,
      );
      list = [];
    }
  };
  lines.forEach((raw, idx) => {
    const line = raw.trimEnd();
    const key = `b-${idx}`;
    if (line.startsWith('### ')) {
      flush(`${key}-l`);
      blocks.push(
        <h3 key={key} style={{ fontSize: 17, fontWeight: 700, margin: '22px 0 8px' }}>
          {renderInline(line.slice(4), key)}
        </h3>,
      );
    } else if (line.startsWith('## ')) {
      flush(`${key}-l`);
      blocks.push(
        <h2 key={key} style={{ fontSize: 22, fontWeight: 700, margin: '30px 0 10px' }}>
          {renderInline(line.slice(3), key)}
        </h2>,
      );
    } else if (line.startsWith('- ')) {
      list.push(line.slice(2));
    } else if (line.trim() === '') {
      flush(`${key}-l`);
    } else {
      flush(`${key}-l`);
      blocks.push(
        <p key={key} style={{ margin: '0 0 14px' }}>
          {renderInline(line, key)}
        </p>,
      );
    }
  });
  flush('b-end');
  return <>{blocks}</>;
}

export default function SimplePage({
  title,
  breadcrumb,
  intro,
  markdown,
  children,
}: {
  title: string;
  breadcrumb: string;
  intro?: string;
  markdown?: string;
  children?: ReactNode;
}) {
  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 80 }}>
      <Breadcrumb items={[{ label: breadcrumb }]} />
      <h1
        style={{
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: '-.02em',
          margin: '14px 0 14px',
          color: 'var(--text)',
        }}
      >
        {title}
      </h1>
      {intro ? (
        <p style={{ fontSize: 16, color: '#5A5C6B', maxWidth: 920, margin: '0 0 28px' }}>
          {intro}
        </p>
      ) : null}
      <div style={{ maxWidth: 920, fontSize: 15, lineHeight: 1.75, color: 'var(--text)' }}>
        {markdown ? <Markdown source={markdown} /> : children}
      </div>
    </div>
  );
}

import type { ReactNode } from 'react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import WordReveal from '@/components/ui/WordReveal';
import RelatedLinks from '@/components/ui/RelatedLinks';
import FaqList from '@/components/ui/FaqList';

/**
 * Herbruikbare standalone tekstpagina (legal / customer-care / info).
 * In de echte app komt de content uit de StorefrontPage-CMS en is hij als
 * admin inline (markdown) bewerkbaar. Hier in de referentie tonen we de
 * content als markdown-string (basis overgenomen van camera-tweedehands.nl).
 */

function slugify(text: string): string {
  return text
    .replace(/\*\*/g, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

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
        <h3 key={key} id={slugify(line.slice(4))} style={{ fontSize: 17, fontWeight: 700, margin: '22px 0 8px', scrollMarginTop: 90 }}>
          {renderInline(line.slice(4), key)}
        </h3>,
      );
    } else if (line.startsWith('## ')) {
      flush(`${key}-l`);
      blocks.push(
        <h2 key={key} id={slugify(line.slice(3))} style={{ fontSize: 22, fontWeight: 700, margin: '30px 0 10px', scrollMarginTop: 90 }}>
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
  titleReveal = false,
  eyebrow,
  parent,
  image,
  related,
  faqs,
}: {
  title: string;
  breadcrumb: string;
  intro?: string;
  markdown?: string;
  children?: ReactNode;
  titleReveal?: boolean;
  eyebrow?: string;
  parent?: { label: string; href: string };
  image?: string;
  related?: { label: string; desc: string; href: string }[];
  faqs?: { q: string; a: string }[];
}) {
  const crumbs = parent ? [parent, { label: breadcrumb }] : [{ label: breadcrumb }];
  return (
    <>
      <div className={image ? 'svc-header svc-header--photo' : 'svc-header'}>
        {image ? <div className="svc-header__photo" style={{ backgroundImage: `url(${image})` }} aria-hidden="true" /> : null}
        <div className="container">
          <div className="svc-header__inner">
          <Breadcrumb items={crumbs} />
          {eyebrow ? <div className="svc-eyebrow">{eyebrow}</div> : null}
          <h1 className="svc-title" style={!eyebrow ? { marginTop: 14 } : undefined}>
            {titleReveal ? <WordReveal text={title} /> : title}
          </h1>
          {intro ? (
            <p
              className="svc-intro"
              style={
                titleReveal
                  ? { animation: 'camWordReveal .6s cubic-bezier(.16,1,.3,1) both', animationDelay: '320ms' }
                  : undefined
              }
            >
              {intro}
            </p>
          ) : null}
          </div>
        </div>
      </div>
      <div className="container" style={{ paddingBottom: 80 }}>
        <div style={{ maxWidth: 920, fontSize: 15, lineHeight: 1.75, color: 'var(--text)' }}>
          {markdown ? <Markdown source={markdown} /> : children}
        </div>
        {faqs && faqs.length ? (
          <section style={{ maxWidth: 920, marginTop: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 14px', color: 'var(--text)' }}>Veelgestelde vragen</h2>
            <FaqList items={faqs} />
          </section>
        ) : null}
        {related && related.length ? (
          <div style={{ maxWidth: 920 }}>
            <RelatedLinks items={related} />
          </div>
        ) : null}
      </div>
    </>
  );
}

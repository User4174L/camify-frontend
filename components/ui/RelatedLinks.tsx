import Link from 'next/link';

/** Curated "Lees ook"-blok onderaan een service-pagina (2–4 relevante links). */
export default function RelatedLinks({ items }: { items: { label: string; desc: string; href: string }[] }) {
  return (
    <section style={{ marginTop: 44, borderTop: '1px solid var(--border)', paddingTop: 24 }}>
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--text-sec)', marginBottom: 14 }}>
        Lees ook
      </div>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
        {items.map(it => (
          <Link
            key={it.href}
            href={it.href}
            className="cam-lift"
            style={{ display: 'block', border: '1px solid var(--border)', borderRadius: 12, padding: '15px 17px', background: '#fff' }}
          >
            <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--text)', marginBottom: 3 }}>
              {it.label} <span style={{ color: 'var(--accent)' }}>&rarr;</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-sec)', lineHeight: 1.5 }}>{it.desc}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

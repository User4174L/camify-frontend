/** Herbruikbaar FAQ-accordion met native <details> (werkt ook in de Pages-export). */
export default function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq">
      {items.map(f => (
        <details key={f.q} className="cam-lift">
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}

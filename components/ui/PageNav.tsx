/** "Op deze pagina"-navigatie met ankerlinks naar secties op een lange pillar-pagina. */
export default function PageNav({ items }: { items: { label: string; href: string }[] }) {
  return (
    <nav className="pagenav" aria-label="Op deze pagina">
      <span className="pagenav__label">Op deze pagina</span>
      <div className="pagenav__links">
        {items.map(it => (
          <a key={it.href} href={it.href} className="pagenav__link">{it.label}</a>
        ))}
      </div>
    </nav>
  );
}

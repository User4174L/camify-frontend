import Link from 'next/link';
import { navCategories, brands } from '@/data/navigation';

export default function MegaMenu() {
  return (
    <nav className="nav">
      <ul className="nav__list">
        {/* Shop by Brand */}
        <li className="nav__item nav__item--brand">
          <Link href="/brands" className="nav__link nav__link--brand">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            Shop By Brand
          </Link>
          <div className="mega-menu mega-menu--brand">
            <div className="mega-menu__brand-grid">
              {brands.map(b => (
                <Link key={b.href} href={b.href} className="brand-link">{b.label}</Link>
              ))}
            </div>
            <Link href="/brands" className="mega-menu__see-all">See all brands →</Link>
          </div>
        </li>

        <div className="nav__cats">
          {navCategories.map(cat => (
            <li key={cat.label} className="nav__item">
              <Link href={cat.href} className="nav__link">{cat.label}</Link>
              <div className={`mega-menu mega-menu--${cat.menuClass || `${cat.menuCols}col`}`}>
                {cat.columns.map(col => (
                  <div key={col.title} className="mega-menu__col">
                    <h4><Link href={col.titleHref}>{col.title}</Link></h4>
                    {col.items.map(item => (
                      <Link key={item.href} href={item.href}>{item.label}</Link>
                    ))}
                    {col.sub && (
                      <div className="mega-menu__sub">
                        {col.sub.map(s => (
                          <Link key={s.href} href={s.href}>{s.label}</Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </li>
          ))}

          <li><Link href="/sale" className="nav__link nav__link--sale">Sale</Link></li>
          <li><Link href="/new" className="nav__link">New</Link></li>
        </div>
      </ul>
    </nav>
  );
}

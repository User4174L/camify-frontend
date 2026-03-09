'use client';

import { useState } from 'react';
import Link from 'next/link';
import { navCategories, brands } from '@/data/navigation';

const ChevronDown = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
);

export default function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose?: () => void }) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className={`mobile-menu${isOpen ? ' is-open' : ''}`}>
      <div className="mobile-menu__inner">
        <div className="mobile-menu__section">
          <div className="mobile-menu__heading">Categories</div>
          {navCategories.map(cat => (
            <div key={cat.label}>
              <div className={`mobile-menu__item${openItems[cat.label] ? ' is-open' : ''}`} onClick={() => toggle(cat.label)}>
                <Link href={cat.href} className="mobile-menu__link" onClick={e => { e.stopPropagation(); onClose?.(); }}>{cat.label}</Link>
                <button className="mobile-menu__expand"><ChevronDown /></button>
              </div>
              {openItems[cat.label] && (
                <div className="mobile-menu__sub" style={{ display: 'block' }}>
                  {cat.columns.map(col => (
                    <div key={col.title}>
                      {col.items.length > 0 ? (
                        <>
                          <div className={`mobile-menu__subitem${openItems[`${cat.label}-${col.title}`] ? ' is-open' : ''}`} onClick={() => toggle(`${cat.label}-${col.title}`)}>
                            <Link href={col.titleHref} className="mobile-menu__sublink" onClick={e => { e.stopPropagation(); onClose?.(); }}>{col.title}</Link>
                            <button className="mobile-menu__expand"><ChevronDown size={14} /></button>
                          </div>
                          {openItems[`${cat.label}-${col.title}`] && (
                            <div className="mobile-menu__subsub" style={{ display: 'block' }}>
                              {col.items.map(item => (
                                <Link key={item.href} href={item.href} onClick={onClose}>{item.label}</Link>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link href={col.titleHref} className="mobile-menu__sublink">{col.title}</Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mobile-menu__section">
          <Link href="/sale" className="mobile-menu__link mobile-menu__link--sale" onClick={onClose}>Sale</Link>
          <Link href="/new" className="mobile-menu__link" onClick={onClose}>New</Link>
        </div>

        <div className="mobile-menu__section">
          <div className="mobile-menu__heading">Brands</div>
          <div className="mobile-menu__brands">
            {brands.slice(0, 8).map(b => (
              <Link key={b.href} href={b.href}>{b.label}</Link>
            ))}
          </div>
          <Link href="/brands" className="mobile-menu__link" style={{ color: 'var(--accent)', fontSize: 13, padding: '8px 0' }}>See all brands →</Link>
        </div>

        <div className="mobile-menu__section" style={{ borderBottom: 'none' }}>
          <span className="mobile-menu__link" style={{ fontSize: 13, color: 'var(--text-sec)' }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ verticalAlign: -3, marginRight: 6 }}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            English (EN)
          </span>
        </div>
      </div>
    </div>
  );
}

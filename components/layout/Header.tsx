'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchBar from './SearchBar';
import MegaMenu from './MegaMenu';
import MobileMenu from './MobileMenu';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount, openDrawer } = useCart();
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const router = useRouter();

  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');
  const langRef = useRef<HTMLDivElement>(null);

  const [btwMode, setBtwMode] = useState(false);
  const [btwTooltip, setBtwTooltip] = useState(false);
  const btwRef = useRef<HTMLDivElement>(null);

  // Sync BTW mode with sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('btw_only') === '1') setBtwMode(true);
  }, []);
  const toggleBtw = () => {
    const next = !btwMode;
    setBtwMode(next);
    if (typeof window !== 'undefined') {
      if (next) sessionStorage.setItem('btw_only', '1');
      else sessionStorage.removeItem('btw_only');
    }
  };

  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
      if (btwRef.current && !btwRef.current.contains(e.target as Node)) {
        setBtwTooltip(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* --- Smart hide-on-scroll --- */
  const [headerHidden, setHeaderHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const threshold = 80;

    function onScroll() {
      const currentY = window.scrollY;
      if (currentY > threshold && currentY > lastScrollY.current) {
        setHeaderHidden(true);
      } else {
        setHeaderHidden(false);
      }
      lastScrollY.current = currentY;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className={`header${headerHidden ? ' header--hidden' : ''}`}>
        <div className="container">

          {/* ===== DESKTOP LAYOUT (hidden on mobile via CSS) ===== */}
          <div className="header__top header__desktop">
            <Link href="/" className="logo">
              <div className="logo__icon">C</div>Camify
            </Link>

            <SearchBar />

            <div className="header__actions">
              {/* BTW / Zakelijk toggle */}
              <div ref={btwRef} style={{ position: 'relative' }}>
                <button
                  onClick={toggleBtw}
                  onMouseEnter={() => setBtwTooltip(true)}
                  onMouseLeave={() => setBtwTooltip(false)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 14px',
                    borderRadius: 999,
                    border: btwMode ? '1.5px solid #E8692A' : '1.5px solid #e5e7eb',
                    background: btwMode ? 'rgba(232,105,42,0.08)' : 'transparent',
                    color: btwMode ? '#E8692A' : '#6b7280',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
                  </svg>
                  {btwMode ? 'VAT only ✓' : 'Show only VAT'}
                </button>

                {/* Tooltip */}
                {btwTooltip && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    background: '#1E2133',
                    color: '#fff',
                    padding: '12px 16px',
                    borderRadius: 10,
                    fontSize: 12,
                    lineHeight: 1.6,
                    width: 280,
                    zIndex: 200,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>
                      {btwMode ? '✓ VAT filter active' : 'Filter by VAT reclaimable products'}
                    </div>
                    <div style={{ color: '#a1a1aa' }}>
                      {btwMode
                        ? 'You\'re only seeing products with 21% VAT — prices shown excl. VAT. Business buyers can reclaim VAT on these products.'
                        : 'Show only products with 21% VAT that are reclaimable for business buyers. Products sold under margin scheme (no VAT) are hidden — though these can still be great value for business use.'}
                    </div>
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #333', color: '#a1a1aa', fontSize: 11 }}>
                      Products with the <span style={{ background: '#3b82f6', color: '#fff', padding: '1px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600 }}>21% VAT</span> label are reclaimable. Margin scheme products can still offer excellent value.
                    </div>
                  </div>
                )}
              </div>

              <div ref={langRef} style={{ position: 'relative' }}>
                <button className="lang-selector" onClick={() => setLangOpen(prev => !prev)}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  {selectedLang} <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                {langOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: 6,
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 100,
                    minWidth: 80,
                    overflow: 'hidden',
                  }}>
                    {['EN', 'NL', 'DE'].map(lang => (
                      <button
                        key={lang}
                        onClick={() => { setSelectedLang(lang); setLangOpen(false); }}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '8px 16px',
                          border: 'none',
                          background: selectedLang === lang ? '#f3f4f6' : '#fff',
                          fontSize: 14,
                          fontWeight: selectedLang === lang ? 600 : 400,
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontFamily: 'inherit',
                        }}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div ref={accountRef} style={{ position: 'relative' }}>
                <button
                  className="header__action-btn"
                  aria-label="Account"
                  onClick={() => {
                    if (!isLoggedIn) {
                      router.push('/login');
                    } else {
                      setAccountOpen(prev => !prev);
                    }
                  }}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </button>
                {accountOpen && isLoggedIn && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: 6,
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 100,
                    minWidth: 160,
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      padding: '10px 16px',
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#111',
                      borderBottom: '1px solid #f3f4f6',
                    }}>
                      {user?.username}
                    </div>
                    <a
                      href="/account"
                      onClick={() => setAccountOpen(false)}
                      style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: '#111', textDecoration: 'none', borderBottom: '1px solid #f3f4f6', fontFamily: 'inherit' }}
                    >
                      Mijn Account
                    </a>
                    {isAdmin && (
                      <a
                        href="/dashboard"
                        onClick={() => setAccountOpen(false)}
                        style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: '#111', textDecoration: 'none', borderBottom: '1px solid #f3f4f6', fontFamily: 'inherit' }}
                      >
                        Dashboard
                      </a>
                    )}
                    <a
                      href="/account"
                      onClick={() => setAccountOpen(false)}
                      style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: '#111', textDecoration: 'none', borderBottom: '1px solid #f3f4f6', fontFamily: 'inherit' }}
                    >
                      Bestelgeschiedenis
                    </a>
                    <button
                      onClick={() => { logout(); setAccountOpen(false); router.push('/'); }}
                      style={{ display: 'block', width: '100%', padding: '10px 16px', fontSize: 14, color: '#111', textDecoration: 'none', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      Uitloggen
                    </button>
                  </div>
                )}
              </div>

              <button className="header__action-btn" aria-label="Wishlist">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>

              <button className="header__action-btn" aria-label="Cart" onClick={openDrawer}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                {itemCount > 0 && <span className="badge">{itemCount}</span>}
              </button>
            </div>
          </div>

          {/* ===== MOBILE LAYOUT (hidden on desktop via CSS) ===== */}
          <div className="header__mobile">
            {/* Row 1: hamburger | logo | cart + wishlist */}
            <div className="header__mobile-row1">
              <button
                className={`hamburger${mobileMenuOpen ? ' is-active' : ''}`}
                aria-label="Menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span /><span /><span />
              </button>

              <Link href="/" className="logo header__mobile-logo">
                <div className="logo__icon">C</div>Camify
              </Link>

              <div className="header__mobile-actions">
                <button className="header__action-btn" aria-label="Wishlist">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
                <button className="header__action-btn" aria-label="Cart" onClick={openDrawer}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  {itemCount > 0 && <span className="badge">{itemCount}</span>}
                </button>
              </div>
            </div>

            {/* Row 2: brands button + search bar (hidden when menu open) */}
            {!mobileMenuOpen && <SearchBar mobile />}
          </div>

          <MegaMenu />
        </div>
      </header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}

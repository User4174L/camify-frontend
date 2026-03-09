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

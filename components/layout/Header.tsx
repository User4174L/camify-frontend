'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchBar from './SearchBar';
import MegaMenu from './MegaMenu';
import MobileMenu from './MobileMenu';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { User, Heart, ShoppingBag, Globe, ChevronDown, CreditCard, LogOut, LayoutDashboard, ClipboardList } from 'lucide-react';

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
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
      if (btwRef.current && !btwRef.current.contains(e.target as Node)) setBtwTooltip(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [headerHidden, setHeaderHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const threshold = 80;
    function onScroll() {
      const currentY = window.scrollY;
      if (currentY > threshold && currentY > lastScrollY.current) setHeaderHidden(true);
      else setHeaderHidden(false);
      lastScrollY.current = currentY;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className={cn('header sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md', headerHidden && 'header--hidden')}>
        <div className="container">

          {/* DESKTOP */}
          <div className="header__desktop flex items-center justify-between gap-6 py-4">
            <Link href="/" className="flex shrink-0 items-center gap-2.5 text-2xl font-bold">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8692A] text-sm font-bold text-white">C</div>
              Camify
            </Link>

            <SearchBar />

            <div className="flex shrink-0 items-center gap-2">
              {/* BTW toggle */}
              <div ref={btwRef} className="relative">
                <button
                  onClick={toggleBtw}
                  onMouseEnter={() => setBtwTooltip(true)}
                  onMouseLeave={() => setBtwTooltip(false)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all',
                    btwMode
                      ? 'border-[#E8692A] bg-orange-50 text-[#E8692A]'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  )}
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  {btwMode ? 'VAT only \u2713' : 'Show only VAT'}
                </button>

                {btwTooltip && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-[280px] rounded-xl bg-[#1E2133] p-4 text-xs leading-relaxed text-white shadow-xl">
                    <div className="mb-1 font-bold">
                      {btwMode ? '\u2713 VAT filter active' : 'Filter by VAT reclaimable products'}
                    </div>
                    <div className="text-gray-400">
                      {btwMode
                        ? 'You\'re only seeing products with 21% VAT \u2014 prices shown excl. VAT. Business buyers can reclaim VAT on these products.'
                        : 'Show only products with 21% VAT that are reclaimable for business buyers.'}
                    </div>
                  </div>
                )}
              </div>

              {/* Language */}
              <div ref={langRef} className="relative">
                <button
                  onClick={() => setLangOpen(prev => !prev)}
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-[13px] font-medium text-gray-500 transition-colors hover:bg-gray-50"
                >
                  <Globe className="h-4 w-4" />
                  {selectedLang}
                  <ChevronDown className="h-3 w-3" />
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full z-50 mt-1.5 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                    {['EN', 'NL', 'DE'].map(lang => (
                      <button
                        key={lang}
                        onClick={() => { setSelectedLang(lang); setLangOpen(false); }}
                        className={cn(
                          'block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50',
                          selectedLang === lang ? 'bg-gray-50 font-semibold' : ''
                        )}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Account */}
              <div ref={accountRef} className="relative">
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-50"
                  aria-label="Account"
                  onClick={() => {
                    if (!isLoggedIn) router.push('/login');
                    else setAccountOpen(prev => !prev);
                  }}
                >
                  <User className="h-5 w-5" />
                </button>
                {accountOpen && isLoggedIn && (
                  <div className="absolute right-0 top-full z-50 mt-1.5 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                    <div className="border-b border-gray-100 px-4 py-3 text-sm font-semibold text-gray-900">
                      {user?.username}
                    </div>
                    <a href="/account" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50">
                      <User className="h-4 w-4 text-gray-400" /> Mijn Account
                    </a>
                    {isAdmin && (
                      <a href="/dashboard" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50">
                        <LayoutDashboard className="h-4 w-4 text-gray-400" /> Dashboard
                      </a>
                    )}
                    <a href="/account" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50">
                      <ClipboardList className="h-4 w-4 text-gray-400" /> Bestelgeschiedenis
                    </a>
                    <button
                      onClick={() => { logout(); setAccountOpen(false); router.push('/'); }}
                      className="flex w-full items-center gap-2 border-t border-gray-100 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <LogOut className="h-4 w-4 text-gray-400" /> Uitloggen
                    </button>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <button className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-50" aria-label="Wishlist">
                <Heart className="h-5 w-5" />
              </button>

              {/* Cart */}
              <button className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-50" aria-label="Cart" onClick={openDrawer}>
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#E8692A] text-[10px] font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* MOBILE */}
          <div className="header__mobile hidden">
            <div className="header__mobile-row1">
              <button
                className={`hamburger${mobileMenuOpen ? ' is-active' : ''}`}
                aria-label="Menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span /><span /><span />
              </button>
              <Link href="/" className="logo header__mobile-logo flex items-center gap-2 text-xl font-bold">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8692A] text-xs font-bold text-white">C</div>
                Camify
              </Link>
              <div className="header__mobile-actions">
                <button className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600" aria-label="Wishlist">
                  <Heart className="h-5 w-5" />
                </button>
                <button className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-600" aria-label="Cart" onClick={openDrawer}>
                  <ShoppingBag className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#E8692A] text-[10px] font-bold text-white">
                      {itemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
            {!mobileMenuOpen && <SearchBar mobile />}
          </div>

          <MegaMenu />
        </div>
      </header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}

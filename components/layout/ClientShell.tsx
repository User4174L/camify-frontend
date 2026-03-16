'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { CartProvider, useCart } from '@/context/CartContext';
import { RecentlyViewedProvider } from '@/context/RecentlyViewedContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import UspBar from '@/components/layout/UspBar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import UpsellPopup from '@/components/cart/UpsellPopup';

const SITE_PIN = '4174';
const SKIP_PIN = process.env.NEXT_PUBLIC_SKIP_PIN === '1';

function PinGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(SKIP_PIN);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (SKIP_PIN || sessionStorage.getItem('site_unlocked') === '1') setUnlocked(true);
  }, []);

  if (unlocked) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === SITE_PIN) {
      sessionStorage.setItem('site_unlocked', '1');
      setUnlocked(true);
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8fa', fontFamily: 'var(--font)' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '48px 40px', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,.08)', textAlign: 'center', maxWidth: 340, width: '100%' }}>
        <div style={{ width: 48, height: 48, background: '#E8692A', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#fff', fontWeight: 700, fontSize: 20 }}>C</div>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: '#1E2133' }}>Camify Preview</h1>
        <p style={{ fontSize: 14, color: '#6B6D80', marginBottom: 24 }}>Voer de pincode in om de site te bekijken</p>
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={pin}
          onChange={e => { setPin(e.target.value.replace(/\D/g, '')); setError(false); }}
          placeholder="••••"
          autoFocus
          style={{ width: '100%', padding: '14px 16px', fontSize: 24, textAlign: 'center', letterSpacing: 12, border: `2px solid ${error ? '#ef4444' : '#EEEEF2'}`, borderRadius: 12, outline: 'none', fontFamily: 'inherit', transition: 'border-color .2s' }}
        />
        {error && <p style={{ color: '#ef4444', fontSize: 13, marginTop: 8 }}>Onjuiste pincode</p>}
        <button type="submit" style={{ width: '100%', marginTop: 16, padding: '14px', background: '#E8692A', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Openen</button>
      </form>
    </div>
  );
}

function ShellInner({ children }: { children: React.ReactNode }) {
  const { lastAddedItem, lastAddedProduct, clearLastAdded, openDrawer } = useCart();
  const { isAdmin } = useAuth();
  const pathname = usePathname();

  // Checkout has its own standalone layout — skip header/footer/drawer
  if (pathname?.startsWith('/checkout')) {
    return <>{children}</>;
  }

  return (
    <>
      <UspBar />
      <Header />
      <main>{children}</main>
      {!isAdmin && <Footer />}
      <CartDrawer />
      {lastAddedItem && lastAddedProduct && (
        <UpsellPopup
          item={lastAddedItem}
          product={lastAddedProduct}
          onClose={clearLastAdded}
          onViewCart={() => {
            clearLastAdded();
            setTimeout(() => openDrawer(), 50);
          }}
        />
      )}
    </>
  );
}

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <PinGate>
      <AuthProvider>
        <CartProvider>
          <RecentlyViewedProvider>
            <ShellInner>{children}</ShellInner>
          </RecentlyViewedProvider>
        </CartProvider>
      </AuthProvider>
    </PinGate>
  );
}

'use client';

import { usePathname } from 'next/navigation';
import { CartProvider, useCart } from '@/context/CartContext';
import { RecentlyViewedProvider } from '@/context/RecentlyViewedContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import UspBar from '@/components/layout/UspBar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import UpsellPopup from '@/components/cart/UpsellPopup';

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
    <AuthProvider>
      <CartProvider>
        <RecentlyViewedProvider>
          <ShellInner>{children}</ShellInner>
        </RecentlyViewedProvider>
      </CartProvider>
    </AuthProvider>
  );
}

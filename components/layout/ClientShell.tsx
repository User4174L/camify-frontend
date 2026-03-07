'use client';

import { CartProvider, useCart } from '@/context/CartContext';
import Header from '@/components/layout/Header';
import UspBar from '@/components/layout/UspBar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import UpsellPopup from '@/components/cart/UpsellPopup';

function ShellInner({ children }: { children: React.ReactNode }) {
  const { lastAddedItem, lastAddedProduct, clearLastAdded, openDrawer } = useCart();

  return (
    <>
      <UspBar />
      <Header />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
      {lastAddedItem && lastAddedProduct && (
        <UpsellPopup
          item={lastAddedItem}
          product={lastAddedProduct}
          onClose={clearLastAdded}
          onViewCart={() => {
            clearLastAdded();
            openDrawer();
          }}
        />
      )}
    </>
  );
}

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ShellInner>{children}</ShellInner>
    </CartProvider>
  );
}

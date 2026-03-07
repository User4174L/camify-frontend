'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Product } from '@/data/products';

export interface CartItem {
  id: string;
  sku: string;
  name: string;
  price: number;
  condition: string;
  image: string;
  inclVat: boolean;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem, product?: Product) => void;
  removeItem: (id: string) => void;
  itemCount: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  subtotal: number;
  vatAmount: number;
  total: number;
  lastAddedItem: CartItem | null;
  lastAddedProduct: Product | null;
  clearLastAdded: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  const [lastAddedProduct, setLastAddedProduct] = useState<Product | null>(null);

  const addItem = useCallback((item: CartItem, product?: Product) => {
    setItems(prev => [...prev, item]);
    setLastAddedItem(item);
    setLastAddedProduct(product ?? null);
  }, []);

  const clearLastAdded = useCallback(() => {
    setLastAddedItem(null);
    setLastAddedProduct(null);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const subtotal = items.reduce((sum, item) => {
    if (item.inclVat) {
      return sum + (item.price / 1.21);
    }
    return sum + item.price;
  }, 0);

  const vatAmount = items.reduce((sum, item) => {
    if (item.inclVat) {
      return sum + (item.price - item.price / 1.21);
    }
    return sum;
  }, 0);

  const total = subtotal + vatAmount;

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      itemCount: items.length,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      subtotal,
      vatAmount,
      total,
      lastAddedItem,
      lastAddedProduct,
      clearLastAdded,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}

'use client';

import { useCart } from '@/context/CartContext';
import { assetPath } from '@/lib/utils';

export default function CartDrawer() {
  const { items, removeItem, isDrawerOpen, closeDrawer, subtotal, vatAmount, total } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10001,
    }}>
      <div
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(2px)' }}
        onClick={closeDrawer}
      />
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 400,
        background: '#fff', boxShadow: '-8px 0 40px rgba(0,0,0,.12)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid var(--border)',
        }}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>Cart ({items.length})</span>
          <button onClick={closeDrawer} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'var(--surface)' }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-sec)', fontSize: 14 }}>
              Your cart is empty
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} style={{
                display: 'flex', gap: 12, padding: '16px 0',
                borderBottom: '1px solid var(--border)',
              }}>
                <div style={{
                  width: 64, height: 64, background: 'var(--surface)', borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8, flexShrink: 0,
                }}>
                  <img src={assetPath(item.image)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-sec)', marginBottom: 4 }}>
                    {item.sku} · {item.condition}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>&euro;{item.price.toLocaleString()}</div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  style={{ alignSelf: 'flex-start', color: 'var(--text-sec)', padding: 4 }}
                  aria-label="Remove"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-sec)', marginBottom: 6 }}>
              <span>Subtotal (ex. VAT)</span>
              <span>&euro;{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-sec)', marginBottom: 12 }}>
              <span>VAT (21%)</span>
              <span>&euro;{vatAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
              <span>Total</span>
              <span>&euro;{total.toFixed(2)}</span>
            </div>
            <a
              href="/checkout"
              className="btn btn--primary"
              style={{ width: '100%', justifyContent: 'center', textAlign: 'center' }}
            >
              Checkout
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

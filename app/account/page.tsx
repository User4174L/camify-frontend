'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const ACCENT = '#E8692A';
const BORDER = '#EEEEF2';
const DARK   = '#1E2133';

export default function AccountPage() {
  const { user, isLoggedIn, hydrated, logout } = useAuth();
  const router = useRouter();

  // Auth guard disabled for design export preview
  // useEffect(() => {
  //   if (hydrated && !isLoggedIn) router.push('/login');
  // }, [hydrated, isLoggedIn, router]);

  return (
    <div style={{
      minHeight: '60vh',
      maxWidth: 600,
      margin: '0 auto',
      padding: '48px 16px',
    }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: DARK, marginBottom: 8 }}>
        Mijn Account
      </h1>
      <p style={{ fontSize: 16, color: '#6B7280', marginBottom: 32 }}>
        Welkom, {user?.username}
      </p>

      {/* Order history placeholder */}
      <div style={{
        background: '#fff',
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        padding: 24,
        marginBottom: 24,
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: DARK, marginTop: 0, marginBottom: 12 }}>
          Bestelgeschiedenis
        </h2>
        <p style={{ fontSize: 14, color: '#9CA3AF', margin: 0 }}>
          Je hebt nog geen bestellingen geplaatst.
        </p>
      </div>

      <button
        onClick={() => { logout(); router.push('/'); }}
        style={{
          padding: '12px 24px',
          background: DARK,
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        Uitloggen
      </button>
    </div>
  );
}

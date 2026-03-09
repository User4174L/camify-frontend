'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const ACCENT = '#E8692A';
const BORDER = '#EEEEF2';
const DARK   = '#1E2133';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const role = login(username, password);
    if (role === 'admin') {
      router.push('/dashboard');
    } else {
      router.push('/account');
    }
  }

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 16px',
      background: '#F8F8FA',
    }}>
      {/* Title */}
      <h1 style={{
        fontSize: 28,
        fontWeight: 700,
        color: DARK,
        marginBottom: 8,
        textAlign: 'center',
      }}>
        Log in bij Camera Tweedehands
      </h1>
      <p style={{
        fontSize: 15,
        color: '#6B7280',
        marginBottom: 32,
        textAlign: 'center',
        maxWidth: 480,
        lineHeight: 1.5,
      }}>
        Voer je gegevens in om het verkopersdashboard te openen en je gear te beheren.
      </p>

      {/* Card */}
      <div style={{
        background: '#fff',
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        padding: 32,
        width: '100%',
        maxWidth: 480,
        boxSizing: 'border-box',
      }}>
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: DARK, marginBottom: 6 }}>
            Gebruikersnaam of e-mail
          </label>
          <input
            type="text"
            placeholder="jij@example.com"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              border: `1.5px solid ${BORDER}`,
              borderRadius: 8,
              fontSize: 14,
              outline: 'none',
              boxSizing: 'border-box',
              marginBottom: 20,
              fontFamily: 'inherit',
            }}
          />

          {/* Password */}
          <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: DARK, marginBottom: 6 }}>
            Wachtwoord
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              border: `1.5px solid ${BORDER}`,
              borderRadius: 8,
              fontSize: 14,
              outline: 'none',
              boxSizing: 'border-box',
              marginBottom: 8,
              fontFamily: 'inherit',
            }}
          />

          {/* Forgot password */}
          <div style={{ textAlign: 'right', marginBottom: 24 }}>
            <a href="#" style={{ fontSize: 13, color: ACCENT, textDecoration: 'none', fontWeight: 500 }}>
              Wachtwoord vergeten?
            </a>
          </div>

          {/* Submit */}
          <button type="submit" style={{
            width: '100%',
            padding: 14,
            background: DARK,
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}>
            Inloggen
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          margin: '24px 0',
        }}>
          <div style={{ flex: 1, height: 1, background: BORDER }} />
          <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>OF</span>
          <div style={{ flex: 1, height: 1, background: BORDER }} />
        </div>

        {/* Google button */}
        <button style={{
          width: '100%',
          padding: 14,
          background: '#fff',
          color: DARK,
          border: `1.5px solid ${BORDER}`,
          borderRadius: 8,
          fontSize: 15,
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          fontFamily: 'inherit',
        }}>
          {/* Google G icon */}
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.0 24.0 0 0 0 0 21.56l7.98-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Ga verder met Google
        </button>

        {/* Create account */}
        <p style={{ textAlign: 'center', marginTop: 24, marginBottom: 0, fontSize: 14 }}>
          <a href="#" style={{ color: ACCENT, textDecoration: 'none', fontWeight: 500 }}>
            Account aanmaken
          </a>
        </p>
      </div>

      {/* Back link */}
      <Link href="/" style={{
        marginTop: 28,
        fontSize: 14,
        color: ACCENT,
        textDecoration: 'none',
        fontWeight: 500,
      }}>
        &larr; Terug naar de homepage
      </Link>
    </div>
  );
}

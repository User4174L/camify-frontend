'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = { username: string; role: 'admin' | 'customer' } | null;

interface AuthContextType {
  user: User;
  isLoggedIn: boolean;
  isAdmin: boolean;
  hydrated: boolean;
  login: (username: string, password: string) => 'admin' | 'customer';
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('camify_user');
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setHydrated(true);
  }, []);

  // Persist to sessionStorage on change
  useEffect(() => {
    if (!hydrated) return;
    try {
      if (user) {
        sessionStorage.setItem('camify_user', JSON.stringify(user));
      } else {
        sessionStorage.removeItem('camify_user');
      }
    } catch {}
  }, [user, hydrated]);

  function login(username: string, password: string): 'admin' | 'customer' {
    if (username === 'admin' && password === 'admin') {
      setUser({ username: 'admin', role: 'admin' });
      return 'admin';
    }
    setUser({ username, role: 'customer' });
    return 'customer';
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: user !== null,
      isAdmin: user?.role === 'admin',
      hydrated,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { clearTokens, getCurrentUser, logout } from '@/lib/api';

// ==============================================
// TYPES
// ==============================================

interface UserData {
  accountUuid: string;
  memberUuid: string;
  displayName: string;
  mobileNumber: string;
  refreshToken?: string;
}

interface AuthContextValue {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => void;
  refreshAuth: () => void;
}

// ==============================================
// CONTEXT
// ==============================================

const AuthContext = createContext<AuthContextValue | null>(null);

// ==============================================
// HELPERS
// ==============================================

/**
 * Decode a JWT payload without a library.
 * Returns null if the token is malformed or expired.
 */
const decodeJwt = (token: string): { exp?: number } | null => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch {
    return null;
  }
};

const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) return true; // no exp claim → treat as expired
  const nowInSeconds = Math.floor(Date.now() / 1000);
  return decoded.exp < nowInSeconds;
};

const getStoredToken = (): string | null => localStorage.getItem('omnea_access_token');

// ==============================================
// PROVIDER
// ==============================================

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true); // true on mount while we validate

  const resolveAuth = useCallback(() => {
    const token = getStoredToken();
    const storedUser = getCurrentUser();

    if (!token || !storedUser) {
      // Nothing in storage — definitely not authenticated
      setUser(null);
      setIsLoading(false);
      return;
    }

    if (isTokenExpired(token)) {
      // Token exists but is expired — clear it and treat as logged out
      clearTokens();
      setUser(null);
      setIsLoading(false);
      return;
    }

    // Token exists and is valid
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  // Run on mount (handles page refresh case)
  useEffect(() => {
    resolveAuth();
  }, [resolveAuth]);

  const signOut = useCallback(() => {
    clearTokens();
    setUser(null);
    logout(); // redirects to /login
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signOut,
        refreshAuth: resolveAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ==============================================
// HOOK
// ==============================================

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return context;
};
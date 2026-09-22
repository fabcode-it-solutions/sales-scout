'use client';
import { createContext, useContext, useMemo, useState } from 'react';

/**
 * NOTE: This is a portfolio/showcase build of SalesScout.
 * The production authentication implementation (session handling, CSRF
 * flow, token refresh, role resolution) has been withheld and is not
 * included in this repository. This file is a non-functional stub kept
 * only so the surrounding UI components remain readable.
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user] = useState(null);
  const [loading] = useState(false);

  const login = async () => {
    throw new Error('Authentication logic is not included in this showcase build.');
  };

  const signup = async () => {
    throw new Error('Authentication logic is not included in this showcase build.');
  };

  const logout = async () => {
    throw new Error('Authentication logic is not included in this showcase build.');
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      signup,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

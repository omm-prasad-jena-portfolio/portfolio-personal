import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { checkPrivateSession, logoutPrivate } from '../services/privateApi';

interface PrivateAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isBackendUnavailable: boolean;
  checkSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const PrivateAuthContext = createContext<PrivateAuthContextType | undefined>(undefined);

const PUBLIC_PORTFOLIO_URL = (
  import.meta.env.VITE_PUBLIC_PORTFOLIO_URL ||
  import.meta.env.VITE_PUBLIC_APP_URL ||
  'http://localhost:5173'
).replace(/\/$/, '');


export const PrivateAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBackendUnavailable, setIsBackendUnavailable] = useState<boolean>(false);

  const checkSession = useCallback(async () => {
    setIsLoading(true);
    setIsBackendUnavailable(false);
    try {
      const res = await checkPrivateSession();
      if (res.authenticated) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // Redirect unauthenticated user to public portfolio
        window.location.href = PUBLIC_PORTFOLIO_URL;
      }
    } catch {
      setIsAuthenticated(false);
      setIsBackendUnavailable(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const logout = async () => {
    try {
      await logoutPrivate();
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setIsAuthenticated(false);
      window.location.href = PUBLIC_PORTFOLIO_URL;
    }
  };

  return (
    <PrivateAuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        isBackendUnavailable,
        checkSession,
        logout,
      }}
    >
      {children}
    </PrivateAuthContext.Provider>
  );
};

export const usePrivateAuth = (): PrivateAuthContextType => {
  const context = useContext(PrivateAuthContext);
  if (!context) {
    throw new Error('usePrivateAuth must be used within a PrivateAuthProvider');
  }
  return context;
};

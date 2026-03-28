import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../config/adminCredentials';

const SESSION_KEY = 'delvonza_admin_session';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    try {
      const ok = sessionStorage.getItem(SESSION_KEY) === '1';
      setIsAuthenticated(ok);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const login = useCallback((email, password) => {
    const e = String(email || '').trim().toLowerCase();
    const p = String(password || '');
    if (e === String(ADMIN_EMAIL).trim().toLowerCase() && p === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, message: 'Invalid email or password.' };
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      authLoading,
      login,
      logout,
      adminEmail: ADMIN_EMAIL
    }),
    [isAuthenticated, authLoading, login, logout]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return ctx;
};

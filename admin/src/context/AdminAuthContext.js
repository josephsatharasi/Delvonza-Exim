import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { adminAuthApi, adminTokenStore } from '../api/client';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);

  const applySession = useCallback((token, admin) => {
    if (token) {
      adminTokenStore.set(token);
      setAdminUser(admin || null);
      setIsAuthenticated(true);
    } else {
      adminTokenStore.clear();
      setAdminUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const boot = async () => {
      const token = adminTokenStore.get();
      if (!token) {
        if (!cancelled) {
          setIsAuthenticated(false);
          setAdminUser(null);
          setAuthLoading(false);
        }
        return;
      }
      try {
        const { admin } = await adminAuthApi.me();
        if (!cancelled) {
          setAdminUser(admin);
          setIsAuthenticated(true);
        }
      } catch {
        if (!cancelled) {
          adminTokenStore.clear();
          setAdminUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    };
    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const { accessToken, admin } = await adminAuthApi.login({ email, password });
      applySession(accessToken, admin);
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message || 'Login failed.' };
    }
  }, [applySession]);

  const register = useCallback(async (payload) => {
    try {
      const { accessToken, admin } = await adminAuthApi.register(payload);
      applySession(accessToken, admin);
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message || 'Registration failed.' };
    }
  }, [applySession]);

  const logout = useCallback(() => {
    applySession(null, null);
  }, [applySession]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      authLoading,
      login,
      register,
      logout,
      adminUser,
      adminEmail: adminUser?.email || '',
      adminUsername: adminUser?.username || ''
    }),
    [isAuthenticated, authLoading, login, register, logout, adminUser]
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

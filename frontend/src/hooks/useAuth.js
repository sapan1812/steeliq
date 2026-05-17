import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore.js';
import * as authApi from '../api/auth.js';

// Role-based access control map
// Keys are module slugs used in routes and nav
export const ROLE_ACCESS = {
  super_admin: ['overview', 'castx', 'eaf', 'dri', 'alerts', 'admin'],
  plant_manager: ['overview', 'castx', 'eaf', 'dri', 'alerts'],
  castx_operator: ['overview', 'castx', 'alerts'],
  eaf_operator: ['overview', 'eaf', 'alerts'],
  dri_operator: ['overview', 'dri', 'alerts'],
};

export function useAuth() {
  const { user, token, theme, setAuth, clearAuth, toggleTheme } = useAuthStore();

  const login = useCallback(async (email, password) => {
    const { access_token, user: userData } = await authApi.login(email, password);
    setAuth(userData, access_token);
    return userData;
  }, [setAuth]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Proceed with local logout even if server call fails
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const hasAccess = useCallback((module) => {
    if (!user?.role) return false;
    const allowed = ROLE_ACCESS[user.role] ?? [];
    return allowed.includes(module);
  }, [user]);

  return {
    user,
    token,
    theme,
    isAuthenticated: !!token,
    login,
    logout,
    toggleTheme,
    hasAccess,
  };
}

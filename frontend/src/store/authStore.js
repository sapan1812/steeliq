import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const applyTheme = (theme) => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
  }
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      theme: 'light',

      setAuth: (user, token) => {
        set({ user, token });
      },

      clearAuth: () => {
        set({ user: null, token: null });
      },

      toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light';
        applyTheme(next);
        set({ theme: next });
      },

      setTheme: (t) => {
        applyTheme(t);
        set({ theme: t });
      },
    }),
    {
      name: 'steeliq-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        theme: state.theme,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          applyTheme(state.theme);
        }
      },
    }
  )
);

// Apply theme immediately on module load from any stored value
const stored = (() => {
  try {
    const raw = localStorage.getItem('steeliq-auth');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();
if (stored?.state?.theme) {
  applyTheme(stored.state.theme);
}

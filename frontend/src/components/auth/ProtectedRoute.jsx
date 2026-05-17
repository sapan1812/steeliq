import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';
import { ROLE_ACCESS } from '../../hooks/useAuth.js';

// Maps route path segments to module slugs for access checking
function routeToModule(pathname) {
  const segments = pathname.replace('/app', '').split('/').filter(Boolean);
  const first = segments[0] || 'overview';
  if (first === '' || first === undefined) return 'overview';
  // castx → castx, eaf → eaf, dri → dri, admin → admin, alerts → alerts
  return first;
}

export default function ProtectedRoute({ requiredModule, children }) {
  const { token, user } = useAuthStore();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const module = requiredModule || routeToModule(location.pathname);

  if (module && user?.role) {
    const allowed = ROLE_ACCESS[user.role] ?? [];
    if (!allowed.includes(module)) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: '16px',
          fontFamily: 'var(--font-sans)',
          color: 'var(--text)',
          padding: '48px',
          textAlign: 'center',
        }}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <circle cx="32" cy="32" r="30" stroke="var(--red)" strokeWidth="2" />
            <path d="M20 20L44 44M44 20L20 44" stroke="var(--red)" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
              403 — Access Denied
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '360px' }}>
              Your role (<strong>{user.role}</strong>) does not have permission to access this module.
              Contact your plant manager or system administrator.
            </p>
          </div>
          <a
            href="/app"
            style={{
              marginTop: '8px',
              padding: '10px 24px',
              background: 'var(--blue)',
              color: '#fff',
              borderRadius: 'var(--radius)',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            Back to Overview
          </a>
        </div>
      );
    }
  }

  // Support both usage patterns:
  // 1. <Route element={<ProtectedRoute />}> ... children routes ... </Route>  → renders <Outlet />
  // 2. <ProtectedRoute requiredModule="admin"><AdminPage /></ProtectedRoute>   → renders children
  return children ? <>{children}</> : <Outlet />;
}

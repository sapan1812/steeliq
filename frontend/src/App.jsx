import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore.js';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import AppLayout from './components/layout/AppLayout.jsx';

// Eagerly loaded public pages
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';

// Lazy-loaded app pages for code splitting
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const CastXPage     = lazy(() => import('./pages/modules/CastXPage.jsx'));
const EAFPage       = lazy(() => import('./pages/modules/EAFPage.jsx'));
const DRIPage       = lazy(() => import('./pages/modules/DRIPage.jsx'));
const AdminPage     = lazy(() => import('./pages/AdminPage.jsx'));
const AlertsPage    = lazy(() => import('./pages/AlertsPage.jsx'));

function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      minHeight: 240,
    }}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <circle cx="16" cy="16" r="13" stroke="var(--border)" strokeWidth="2.5" />
        <path d="M16 3a13 13 0 0113 13" stroke="var(--blue)" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// Redirects authenticated users away from /login
function LoginGuard() {
  const token = useAuthStore((s) => s.token);
  if (token) return <Navigate to="/app" replace />;
  return <LoginPage />;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginGuard />} />

      {/* Protected app shell */}
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<AppLayout />}>
          <Route
            index
            element={
              <Suspense fallback={<PageLoader />}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path="castx/:sub?"
            element={
              <Suspense fallback={<PageLoader />}>
                <CastXPage />
              </Suspense>
            }
          />
          <Route
            path="eaf/:sub?"
            element={
              <Suspense fallback={<PageLoader />}>
                <EAFPage />
              </Suspense>
            }
          />
          <Route
            path="dri/:sub?"
            element={
              <Suspense fallback={<PageLoader />}>
                <DRIPage />
              </Suspense>
            }
          />
          <Route
            path="admin/:section?"
            element={
              <ProtectedRoute requiredModule="admin">
                <Suspense fallback={<PageLoader />}>
                  <AdminPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="alerts"
            element={
              <Suspense fallback={<PageLoader />}>
                <AlertsPage />
              </Suspense>
            }
          />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

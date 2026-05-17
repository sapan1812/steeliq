import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';
import { useAuth } from '../../hooks/useAuth.js';
import { getAlerts } from '../../api/analytics.js';

// ─── Navigation config ────────────────────────────────────────────────────────
const MODULE_CONFIG = [
  {
    id: 'overview',
    label: 'Overview',
    icon: '◈',
    cls: 'si-ov',
    route: '/app',
    exact: true,
  },
  {
    id: 'castx',
    label: 'CastX',
    icon: 'Q',
    cls: 'si-q',
    route: '/app/castx',
    badge: 'NEW',
    badgeColor: 'var(--amber)',
    badgeBg: 'var(--amber-lo)',
    subs: [
      { label: 'Snapshot', sub: 'snapshot' },
      { label: 'Outlier Detection', sub: 'outliers' },
      { label: 'Defect Prediction', sub: 'defects' },
      { label: 'NLP Analytics', sub: 'nlp' },
      { label: 'Time-Series', sub: 'timeseries' },
    ],
  },
  {
    id: 'eaf',
    label: 'EAF',
    icon: 'E',
    cls: 'si-e',
    route: '/app/eaf',
    subs: [
      { label: 'Energy Optimization', sub: 'energy' },
      { label: 'Arc Stability', sub: 'arc' },
      { label: 'Charge Mix', sub: 'charge' },
      { label: 'Tap-to-Tap', sub: 'tap' },
      { label: 'Predictive Maint.', sub: 'maintenance' },
    ],
  },
  {
    id: 'dri',
    label: 'DRI',
    icon: 'G',
    cls: 'si-g',
    route: '/app/dri',
    subs: [
      { label: 'Gas Consumption', sub: 'gas' },
      { label: 'Metallization', sub: 'metallization' },
      { label: 'Temperature Profile', sub: 'temperature' },
      { label: 'Process Yield', sub: 'yield' },
      { label: 'Anomaly Detection', sub: 'anomalies' },
    ],
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: '⚙',
    cls: 'si-ad',
    route: '/app/admin',
  },
  {
    id: 'alerts',
    label: 'Alerts',
    icon: '⚠',
    cls: 'si-al',
    route: '/app/alerts',
  },
];

const ROLE_LABELS = {
  super_admin: 'Super Admin',
  plant_manager: 'Plant Manager',
  castx_operator: 'CastX Operator',
  eaf_operator: 'EAF Operator',
  dri_operator: 'DRI Operator',
};

const ROLE_COLORS = {
  super_admin: '#a060ff',
  plant_manager: '#4a7fff',
  castx_operator: '#4a7fff',
  eaf_operator: '#ffa528',
  dri_operator: '#3acc7a',
};

// Logout icon
const IconLogout = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
  </svg>
);

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const { user } = useAuthStore();
  const { hasAccess, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [alertCount, setAlertCount] = useState(0);
  const [expanded, setExpanded] = useState({ castx: true, eaf: false, dri: false });

  // Fetch alert count
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await getAlerts();
        const active = Array.isArray(data)
          ? data.filter((a) => a.status === 'active' || a.active).length
          : (data?.active_count ?? 0);
        setAlertCount(active);
      } catch {
        // ignore
      }
    };
    fetchAlerts();
    const id = setInterval(fetchAlerts, 30000);
    return () => clearInterval(id);
  }, []);

  // Auto-expand active module
  useEffect(() => {
    const active = MODULE_CONFIG.find(
      (m) => m.route !== '/app' && location.pathname.startsWith(m.route)
    );
    if (active?.subs) {
      setExpanded((p) => ({ ...p, [active.id]: true }));
    }
  }, [location.pathname]);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate('/login', { replace: true });
  }, [logout, navigate]);

  const roleLabel = ROLE_LABELS[user?.role] || user?.role || 'Operator';
  const userColor = ROLE_COLORS[user?.role] || 'var(--blue)';
  const initials = user
    ? (user.name || user.email || '?')
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  const visibleModules = MODULE_CONFIG.filter((m) => hasAccess(m.id === 'overview' ? 'overview' : m.id));

  const isModuleActive = (m) => {
    if (m.exact) return location.pathname === m.route || location.pathname === '/app/';
    return location.pathname.startsWith(m.route);
  };

  const isSubActive = (moduleRoute, sub) => {
    const path = `${moduleRoute}/${sub}`;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const sidebarContent = (
    <>
      {/* Toggle row */}
      <div className="sb-toggle-row">
        <button
          className="sb-toggle-btn"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '▷' : '◁'}
        </button>
      </div>

      {/* Nav items */}
      <div className="sb-nav">
        {visibleModules.map((m, idx) => {
          const active = isModuleActive(m);
          const isExpanded = expanded[m.id];
          const hasSubs = !!m.subs;

          // Divider before all items after overview (except directly after overview would be idx===1)
          // Prototype shows divider between every module group
          const showDivider = idx > 0;

          return (
            <div key={m.id}>
              {showDivider && <div className="sb-divider" />}

              <button
                className={`sb-item${active ? ' active' : ''}`}
                onClick={() => {
                  if (hasSubs) {
                    setExpanded((p) => ({ ...p, [m.id]: !p[m.id] }));
                  }
                  navigate(m.route);
                  if (mobileOpen) onMobileClose?.();
                }}
              >
                <div className={`sb-icon-wrap ${m.cls}`}>
                  {m.icon}
                </div>

                {!collapsed && (
                  <>
                    <span className="sb-label">{m.label}</span>

                    {/* Alerts count badge */}
                    {m.id === 'alerts' && alertCount > 0 && (
                      <span className="sb-badge" style={{
                        background: 'var(--red-lo)',
                        color: 'var(--red)',
                      }}>
                        {alertCount > 99 ? '99+' : alertCount}
                      </span>
                    )}

                    {/* CastX NEW badge */}
                    {m.badge && m.id !== 'alerts' && (
                      <span className="sb-badge" style={{
                        background: m.badgeBg,
                        color: m.badgeColor,
                      }}>
                        {m.badge}
                      </span>
                    )}

                    {/* Chevron for expandable items */}
                    {hasSubs && (
                      <span className={`sb-chevron${isExpanded ? ' open' : ''}`}>▼</span>
                    )}
                  </>
                )}
              </button>

              {/* Sub-items */}
              {!collapsed && hasSubs && (
                <div className={`sb-sub${isExpanded ? ' open' : ''}`}>
                  {m.subs.map((s) => (
                    <button
                      key={s.sub}
                      className={`sb-sub-btn${isSubActive(m.route, s.sub) ? ' active' : ''}`}
                      onClick={() => {
                        navigate(`${m.route}/${s.sub}`);
                        if (mobileOpen) onMobileClose?.();
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom user card */}
      <div className="sb-bottom">
        {!collapsed ? (
          <div className="sb-user">
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: `${userColor}22`,
              border: `1px solid ${userColor}44`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 800,
              color: userColor,
              flexShrink: 0,
            }}>
              {initials}
            </div>
            <div className="sb-user-info">
              <div className="sb-user-name">{user?.name || user?.email || 'User'}</div>
              <div className="sb-user-role">{roleLabel}</div>
            </div>
            <button
              className="sb-logout"
              onClick={(e) => { e.stopPropagation(); handleLogout(); }}
              title="Sign out"
            >
              <IconLogout />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 7,
                background: `${userColor}22`,
                border: `1px solid ${userColor}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 800,
                color: userColor,
                cursor: 'pointer',
              }}
              onClick={handleLogout}
              title="Sign out"
            >
              {initials}
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside style={{
        position: 'fixed',
        top: 'var(--header-h)',
        left: 0,
        bottom: 0,
        width: collapsed ? 'var(--sb-closed)' : 'var(--sb-open)',
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 41,
        transition: 'width .28s cubic-bezier(.4,0,.2,1)',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="sidebar-overlay"
            onClick={onMobileClose}
            style={{ display: 'block' }}
          />
          <aside style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: 'var(--sb-open)',
            background: 'var(--sidebar-bg)',
            borderRight: '1px solid var(--border)',
            zIndex: 50,
            boxShadow: '0 0 32px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}

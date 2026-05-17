import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';
import { useAuth } from '../../hooks/useAuth.js';
import { getAlerts } from '../../api/analytics.js';

// ─── Icons ────────────────────────────────────────────────────────────────────
const icons = {
  overview: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  castx: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>
      <line x1="12" y1="3" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="21"/>
      <line x1="3" y1="12" x2="8" y2="12"/><line x1="16" y1="12" x2="21" y2="12"/>
    </svg>
  ),
  eaf: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <path d="M13 2L4.09 12.96A1 1 0 005 14.5h5.5l-1 7.5 8.91-10.96A1 1 0 0017.5 9.5H12L13 2z"/>
    </svg>
  ),
  dri: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <path d="M12 2a10 10 0 1010 10"/><path d="M12 6a6 6 0 016 6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  alerts: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  ),
  admin: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/>
    </svg>
  ),
  chevron: (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  ),
  logout: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
    </svg>
  ),
};

// ─── Sub-navigation definitions ───────────────────────────────────────────────
const MODULE_SUBS = {
  castx: [
    { label: 'Outlier Detection', sub: 'outliers' },
    { label: 'Defect Prediction', sub: 'defects' },
    { label: 'Snapshot', sub: 'snapshot' },
    { label: 'NLP Analytics', sub: 'nlp' },
    { label: 'Time-Series', sub: 'timeseries' },
  ],
  eaf: [
    { label: 'Energy Optimization', sub: 'energy' },
    { label: 'Arc Stability', sub: 'arc' },
    { label: 'Charge Mix', sub: 'charge' },
    { label: 'Tap-to-Tap', sub: 'tap' },
    { label: 'Predictive Maintenance', sub: 'maintenance' },
  ],
  dri: [
    { label: 'Gas Consumption', sub: 'gas' },
    { label: 'Metallization', sub: 'metallization' },
    { label: 'Temperature Profile', sub: 'temperature' },
    { label: 'Yield', sub: 'yield' },
    { label: 'Anomaly Detection', sub: 'anomalies' },
  ],
};

const ADMIN_SUBS = [
  { label: 'Module Registry', sub: 'modules' },
  { label: 'Platform Architecture', sub: 'architecture' },
  { label: 'Data Sources', sub: 'datasources' },
  { label: 'User Management', sub: 'users' },
  { label: 'Self-Support', sub: 'support' },
];

// Module color map
const MODULE_COLORS = {
  castx: 'var(--blue)',
  eaf: 'var(--amber)',
  dri: 'var(--green)',
  admin: 'var(--purple)',
};

// ─── NavItem ──────────────────────────────────────────────────────────────────
function NavItem({ to, icon, label, color, badge, collapsed, children, defaultOpen }) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);
  const [open, setOpen] = useState(defaultOpen || isActive);
  const hasChildren = !!children;

  useEffect(() => {
    if (isActive && hasChildren) setOpen(true);
  }, [isActive, hasChildren]);

  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: collapsed ? '10px 0' : '9px 12px',
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    fontSize: '13.5px',
    fontWeight: 500,
    color: isActive ? (color || 'var(--blue)') : 'var(--text-secondary)',
    background: isActive ? (color
      ? color.replace('var(--blue)', 'rgba(58,120,255,0.10)')
           .replace('var(--amber)', 'rgba(255,174,74,0.10)')
           .replace('var(--green)', 'rgba(58,204,122,0.10)')
           .replace('var(--purple)', 'rgba(160,96,255,0.10)')
      : 'rgba(58,120,255,0.10)') : 'transparent',
    transition: 'background var(--transition), color var(--transition)',
    textDecoration: 'none',
    width: '100%',
    border: 'none',
    justifyContent: collapsed ? 'center' : 'flex-start',
    position: 'relative',
    flexShrink: 0,
  };

  const iconEl = (
    <span style={{ color: isActive ? (color || 'var(--blue)') : 'var(--text-muted)', flexShrink: 0 }}>
      {icon}
    </span>
  );

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setOpen((v) => !v)}
          title={collapsed ? label : undefined}
          style={baseStyle}
        >
          {iconEl}
          {!collapsed && (
            <>
              <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
              {badge != null && badge > 0 && (
                <span style={{
                  background: 'var(--red)',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: 700,
                  borderRadius: 10,
                  padding: '1px 5px',
                  minWidth: 18,
                  textAlign: 'center',
                  lineHeight: 1.5,
                }}>
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
              <span style={{
                transform: open ? 'rotate(90deg)' : 'none',
                transition: 'transform var(--transition)',
                flexShrink: 0,
                opacity: 0.5,
              }}>
                {icons.chevron}
              </span>
            </>
          )}
        </button>
        {!collapsed && open && (
          <div style={{ paddingLeft: 30, paddingTop: 2, paddingBottom: 4 }}>
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      title={collapsed ? label : undefined}
      style={baseStyle}
    >
      {iconEl}
      {!collapsed && (
        <>
          <span style={{ flex: 1 }}>{label}</span>
          {badge != null && badge > 0 && (
            <span style={{
              background: 'var(--red)',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 700,
              borderRadius: 10,
              padding: '1px 5px',
              minWidth: 18,
              textAlign: 'center',
              lineHeight: 1.5,
            }}>
              {badge > 99 ? '99+' : badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

// ─── SubNavItem ───────────────────────────────────────────────────────────────
function SubNavItem({ to, label, color }) {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <NavLink
      to={to}
      style={{
        display: 'block',
        padding: '6px 10px',
        borderRadius: 6,
        fontSize: '12.5px',
        fontWeight: isActive ? 600 : 400,
        color: isActive ? (color || 'var(--blue)') : 'var(--text-muted)',
        background: isActive ? (color || 'var(--blue)').replace('var(--blue)', 'rgba(58,120,255,0.08)')
                                                       .replace('var(--amber)', 'rgba(255,174,74,0.08)')
                                                       .replace('var(--green)', 'rgba(58,204,122,0.08)')
                                                       .replace('var(--purple)', 'rgba(160,96,255,0.08)') : 'transparent',
        textDecoration: 'none',
        transition: 'background var(--transition), color var(--transition)',
        borderLeft: `2px solid ${isActive ? (color || 'var(--blue)') : 'var(--border)'}`,
        marginBottom: 1,
      }}
    >
      {label}
    </NavLink>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const { user } = useAuthStore();
  const { hasAccess, logout } = useAuth();
  const navigate = useNavigate();
  const [alertCount, setAlertCount] = useState(0);

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

  const handleLogout = useCallback(async () => {
    await logout();
    navigate('/login', { replace: true });
  }, [logout, navigate]);

  const roleLabel = {
    super_admin: 'Super Admin',
    plant_manager: 'Plant Manager',
    castx_operator: 'CastX Operator',
    eaf_operator: 'EAF Operator',
    dri_operator: 'DRI Operator',
  }[user?.role] || user?.role || 'Operator';

  const sidebarW = collapsed ? 'var(--sidebar-w-closed)' : 'var(--sidebar-w)';

  const sidebarContent = (
    <nav style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Collapse toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-end',
        padding: '8px 10px',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            borderRadius: 6,
            color: 'var(--text-muted)',
            transition: 'background var(--transition)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
            style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform var(--transition-md)' }}>
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
      </div>

      {/* Scrollable nav items */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '10px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}>
        {/* Overview */}
        {hasAccess('overview') && (
          <NavItem to="/app" icon={icons.overview} label="Overview" collapsed={collapsed} />
        )}

        {/* CastX / Q */}
        {hasAccess('castx') && (
          <NavItem
            to="/app/castx"
            icon={icons.castx}
            label="CastX / Q"
            color={MODULE_COLORS.castx}
            collapsed={collapsed}
          >
            {MODULE_SUBS.castx.map((s) => (
              <SubNavItem
                key={s.sub}
                to={`/app/castx/${s.sub}`}
                label={s.label}
                color={MODULE_COLORS.castx}
              />
            ))}
          </NavItem>
        )}

        {/* EAF / E */}
        {hasAccess('eaf') && (
          <NavItem
            to="/app/eaf"
            icon={icons.eaf}
            label="EAF / E"
            color={MODULE_COLORS.eaf}
            collapsed={collapsed}
          >
            {MODULE_SUBS.eaf.map((s) => (
              <SubNavItem
                key={s.sub}
                to={`/app/eaf/${s.sub}`}
                label={s.label}
                color={MODULE_COLORS.eaf}
              />
            ))}
          </NavItem>
        )}

        {/* DRI / G */}
        {hasAccess('dri') && (
          <NavItem
            to="/app/dri"
            icon={icons.dri}
            label="DRI / G"
            color={MODULE_COLORS.dri}
            collapsed={collapsed}
          >
            {MODULE_SUBS.dri.map((s) => (
              <SubNavItem
                key={s.sub}
                to={`/app/dri/${s.sub}`}
                label={s.label}
                color={MODULE_COLORS.dri}
              />
            ))}
          </NavItem>
        )}

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--border)', margin: '6px 4px' }} />

        {/* Alerts */}
        {hasAccess('alerts') && (
          <NavItem
            to="/app/alerts"
            icon={icons.alerts}
            label="Alerts"
            badge={alertCount}
            collapsed={collapsed}
          />
        )}

        {/* Admin (super_admin only) */}
        {hasAccess('admin') && (
          <NavItem
            to="/app/admin"
            icon={icons.admin}
            label="Admin"
            color={MODULE_COLORS.admin}
            collapsed={collapsed}
          >
            {ADMIN_SUBS.map((s) => (
              <SubNavItem
                key={s.sub}
                to={`/app/admin/${s.sub}`}
                label={s.label}
                color={MODULE_COLORS.admin}
              />
            ))}
          </NavItem>
        )}
      </div>

      {/* Bottom: user card + logout */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: '10px 8px',
        flexShrink: 0,
      }}>
        {!collapsed ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            padding: '8px 10px',
            borderRadius: 'var(--radius)',
            background: 'var(--bg-secondary)',
          }}>
            {/* Avatar */}
            <div style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--blue), var(--purple))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 11,
              color: '#fff',
              flexShrink: 0,
            }}>
              {(user?.name || user?.email || '?').slice(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || user?.email || 'User'}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>
                {roleLabel}
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 26,
                height: 26,
                borderRadius: 6,
                color: 'var(--text-muted)',
                flexShrink: 0,
                transition: 'color var(--transition), background var(--transition)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.background = 'rgba(255,74,106,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none'; }}
            >
              {icons.logout}
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            title="Sign out"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: '8px 0',
              borderRadius: 'var(--radius)',
              color: 'var(--text-muted)',
              transition: 'color var(--transition), background var(--transition)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.background = 'rgba(255,74,106,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none'; }}
          >
            {icons.logout}
          </button>
        )}
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside style={{
        position: 'fixed',
        top: 'var(--header-h)',
        left: 0,
        bottom: 0,
        width: sidebarW,
        background: 'var(--bg-card)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        transition: 'width var(--transition-md)',
        overflow: 'hidden',
      }}>
        {sidebarContent}
      </aside>

      {/* Mobile slide-over overlay */}
      {mobileOpen && (
        <>
          <div
            onClick={onMobileClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 300,
              backdropFilter: 'blur(2px)',
            }}
          />
          <aside style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: 'var(--sidebar-w)',
            background: 'var(--bg-card)',
            borderRight: '1px solid var(--border)',
            zIndex: 400,
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideIn 200ms cubic-bezier(0.4,0,0.2,1)',
          }}>
            <style>{`@keyframes slideIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}`}</style>
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}

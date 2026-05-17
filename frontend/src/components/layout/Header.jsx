import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';
import { useAuth } from '../../hooks/useAuth.js';
import { getKPIs } from '../../api/analytics.js';

// ─── Clock ────────────────────────────────────────────────────────────────────
function Clock() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n) => String(n).padStart(2, '0');
  return (
    <span className="clock-tag">
      {pad(time.getHours())}:{pad(time.getMinutes())}:{pad(time.getSeconds())}
    </span>
  );
}

// ─── User Dropdown ────────────────────────────────────────────────────────────
function UserDropdown({ user, theme, onToggleTheme, onLogout, onClose, userColor }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const roleLabel = {
    super_admin: 'Super Admin',
    plant_manager: 'Plant Manager',
    castx_operator: 'CastX Operator',
    eaf_operator: 'EAF Operator',
    dri_operator: 'DRI Operator',
  }[user?.role] || user?.role || 'User';

  const initials = user
    ? (user.name || user.email || '?')
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  return (
    <div
      ref={ref}
      className="user-dropdown"
      onClick={(e) => e.stopPropagation()}
    >
      {/* User info header */}
      <div style={{ padding: '10px 10px 8px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: `${userColor}22`,
            border: `1px solid ${userColor}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 800, color: userColor,
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700 }}>{user?.name || 'User'}</div>
            <div style={{ fontSize: 10, color: userColor }}>{roleLabel}</div>
            <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>{user?.email}</div>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div style={{ padding: '2px 10px 8px' }}>
        <div style={{ fontSize: 8.5, color: 'var(--text-dim)', letterSpacing: 1.2, fontWeight: 700, margin: '6px 0 5px', textTransform: 'uppercase' }}>
          Appearance
        </div>
        <div style={{ display: 'flex', gap: 3, background: 'var(--surface-1)', padding: 3, borderRadius: 7, border: '1px solid var(--border)' }}>
          {[{ k: 'light', l: 'Light', icon: '☀' }, { k: 'dark', l: 'Dark', icon: '☾' }].map((t) => (
            <button
              key={t.k}
              onClick={(e) => { e.stopPropagation(); onToggleTheme(); }}
              style={{
                flex: 1, padding: '5px 8px', fontSize: 10.5, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                background: theme === t.k ? 'var(--bg2)' : 'transparent',
                border: '1px solid ' + (theme === t.k ? 'var(--border2)' : 'transparent'),
                borderRadius: 5,
                color: theme === t.k ? 'var(--text)' : 'var(--text-dim)',
                cursor: 'pointer', fontFamily: 'var(--sans)', transition: 'all .15s',
                boxShadow: theme === t.k ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <span style={{ fontSize: 12 }}>{t.icon}</span>{t.l}
            </button>
          ))}
        </div>
      </div>

      {/* Menu items */}
      {[
        { icon: '👤', label: 'My Profile' },
        { icon: '⚙', label: 'Preferences' },
        { icon: '🔑', label: 'Change Password' },
        { icon: '📊', label: 'My Dashboard' },
      ].map((it) => (
        <div key={it.label} className="ud-item">
          <span>{it.icon}</span><span>{it.label}</span>
        </div>
      ))}

      <div className="ud-divider" />
      <div className="ud-item danger" onClick={onLogout}>
        <span>↩</span><span>Sign Out</span>
      </div>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
export default function Header({ onMenuClick, sidebarOpen }) {
  const { user, theme } = useAuthStore();
  const { toggleTheme, logout } = useAuth();
  const navigate = useNavigate();
  const [kpis, setKpis] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const userMenuRef = useRef(null);

  const fetchKPIs = useCallback(async () => {
    try {
      const data = await getKPIs();
      setKpis(data);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchKPIs();
    const id = setInterval(fetchKPIs, 5000);
    return () => clearInterval(id);
  }, [fetchKPIs]);

  const handleLogout = useCallback(async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/login', { replace: true });
  }, [logout, navigate]);

  // Close dropdown on outside click
  useEffect(() => {
    const check = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', check);
    return () => document.removeEventListener('mousedown', check);
  }, []);

  const roleColors = {
    super_admin: '#a060ff',
    plant_manager: '#4a7fff',
    castx_operator: '#4a7fff',
    eaf_operator: '#ffa528',
    dri_operator: '#3acc7a',
  };
  const userColor = roleColors[user?.role] || 'var(--blue)';

  const initials = user
    ? (user.name || user.email || '?')
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  const kpiItems = [
    { l: 'Yield Rate', v: kpis ? `${kpis.yield_rate?.toFixed(1)}%` : '—', c: kpis?.yield_rate > 93 ? 'var(--green)' : 'var(--amber)' },
    { l: 'EAF kWh/t', v: kpis ? `${kpis.eaf_kwh_per_t?.toFixed(0)}` : '—', c: kpis?.eaf_kwh_per_t < 400 ? 'var(--green)' : 'var(--amber)' },
    { l: 'Metallization %', v: kpis ? `${kpis.metallization_pct?.toFixed(1)}%` : '—', c: kpis?.metallization_pct > 91 ? 'var(--green)' : 'var(--amber)' },
    { l: 'Tundish °C', v: kpis ? `${kpis.tundish_temp?.toFixed(0)}°C` : '—', c: Math.abs((kpis?.tundish_temp || 1545) - 1545) < 15 ? 'var(--blue)' : 'var(--red)' },
    { l: 'T2T min', v: kpis ? `${kpis.tap_to_tap_min?.toFixed(0)}` : '—', c: kpis?.tap_to_tap_min < 46 ? 'var(--green)' : 'var(--amber)' },
  ];

  return (
    <header className="header">
      {/* Left: logo zone — width animates with sidebar state */}
      <div className={`header-logo-zone${sidebarOpen ? ' open' : ''}`}>
        <button
          className="hamburger"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
          style={{ display: 'flex' }}
        >
          ☰
        </button>
        <div
          className="logo-mark"
          style={{ boxShadow: '0 0 16px oklch(65% 0.22 248deg / 0.35)' }}
        >
          SQ
        </div>
        <div style={{ overflow: 'hidden', transition: 'opacity .28s', opacity: sidebarOpen ? 1 : 0 }}>
          <div className="logo-text">Steel<em>IQ</em></div>
          <div className="logo-sub">by Zealogics</div>
        </div>
      </div>

      {/* Center: KPI strip */}
      <div className="header-kpis">
        {kpiItems.map((m) => (
          <div key={m.l} className="hkpi" style={{ borderRight: '1px solid var(--border)' }}>
            <div className="hkpi-label">{m.l}</div>
            <div className="hkpi-val" style={{ color: m.c }}>{m.v}</div>
          </div>
        ))}
      </div>

      {/* Right section */}
      <div className="header-right">
        {/* Systems Operational status pill */}
        <div className="status-pill">
          <div className="sdot" />
          Systems Operational
        </div>

        {/* Heat tag */}
        <div className="heat-tag">HEAT #2847</div>

        {/* Clock */}
        <Clock />

        {/* Notification bell */}
        <div
          className="notif-btn"
          title="Notifications"
          role="button"
          tabIndex={0}
        >
          <span>🔔</span>
          <div className="notif-badge" />
        </div>

        {/* User button + dropdown */}
        <div ref={userMenuRef} style={{ position: 'relative' }}>
          <div
            className="user-btn"
            onClick={(e) => { e.stopPropagation(); setDropdownOpen((v) => !v); }}
            role="button"
            tabIndex={0}
            aria-expanded={dropdownOpen}
          >
            <div
              className="user-avatar"
              style={{
                background: `${userColor}22`,
                border: `1px solid ${userColor}44`,
                color: userColor,
                borderRadius: 7,
              }}
            >
              {initials}
            </div>
            <span className="user-name">{user?.name?.split(' ')[0] || 'User'}</span>
            <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>▾</span>
          </div>

          {dropdownOpen && (
            <UserDropdown
              user={user}
              theme={theme}
              onToggleTheme={toggleTheme}
              onLogout={handleLogout}
              onClose={() => setDropdownOpen(false)}
              userColor={userColor}
            />
          )}
        </div>
      </div>
    </header>
  );
}

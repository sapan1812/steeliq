import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SteelIQMark from '../logo/SteelIQMark.jsx';
import SteelIQWordmark from '../logo/SteelIQWordmark.jsx';
import { useAuthStore } from '../../store/authStore.js';
import { useAuth } from '../../hooks/useAuth.js';
import { getKPIs } from '../../api/analytics.js';

// ─── Animated KPI Number ──────────────────────────────────────────────────────
function AnimatedNumber({ value, decimals = 1, unit = '' }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);
  const rafRef = useRef(null);

  useEffect(() => {
    if (value === null || value === undefined) return;
    const from = prevRef.current ?? value;
    const to = value;
    const duration = 600;
    const start = performance.now();

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (to - from) * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        prevRef.current = to;
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [value]);

  if (display === null || display === undefined) return <span>—</span>;
  return (
    <span>
      {display.toFixed(decimals)}
      {unit && <span style={{ fontSize: '0.78em', opacity: 0.7, marginLeft: '1px' }}>{unit}</span>}
    </span>
  );
}

// ─── KPI Strip Item ───────────────────────────────────────────────────────────
function KPIItem({ label, value, decimals, unit, accentColor }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0 16px',
      borderRight: '1px solid var(--border)',
      minWidth: 0,
    }}>
      <span style={{
        fontSize: '10px',
        fontWeight: 500,
        color: 'var(--text-muted)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '14px',
        fontWeight: 600,
        color: accentColor || 'var(--text)',
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
      }}>
        <AnimatedNumber value={value} decimals={decimals} unit={unit} />
      </span>
    </div>
  );
}

// ─── Live Dot ─────────────────────────────────────────────────────────────────
function LiveDot({ active }) {
  return (
    <span style={{
      display: 'inline-block',
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: active ? 'var(--green)' : 'var(--text-muted)',
      boxShadow: active ? '0 0 0 2px rgba(58,204,122,0.3)' : 'none',
      flexShrink: 0,
      transition: 'background var(--transition), box-shadow var(--transition)',
    }} />
  );
}

// ─── User Avatar ──────────────────────────────────────────────────────────────
function Avatar({ user, size = 32 }) {
  const initials = user
    ? (user.name || user.email || '?')
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, var(--blue), var(--purple))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: size * 0.38,
      color: '#fff',
      flexShrink: 0,
      letterSpacing: '-0.02em',
    }}>
      {initials}
    </div>
  );
}

// ─── Clock ────────────────────────────────────────────────────────────────────
function Clock() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '13px',
      fontWeight: 500,
      color: 'var(--text-secondary)',
      letterSpacing: '0.02em',
      whiteSpace: 'nowrap',
    }}>
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  );
}

// ─── User Dropdown ────────────────────────────────────────────────────────────
function UserDropdown({ user, theme, onToggleTheme, onLogout, onClose }) {
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

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
        right: 0,
        width: 240,
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden',
        zIndex: 1000,
        animation: 'dropIn 150ms cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <style>{`@keyframes dropIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* User info */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar user={user} size={36} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'User'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email}
            </div>
            <div style={{
              display: 'inline-block',
              marginTop: 3,
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              padding: '1px 6px',
              borderRadius: 4,
              background: 'var(--blue)',
              color: '#fff',
            }}>
              {roleLabel}
            </div>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div style={{ padding: '6px 0' }}>
        <DropdownItem icon={<IconPerson />} label="Profile" onClick={onClose} />
        <DropdownItem
          icon={theme === 'dark' ? <IconSun /> : <IconMoon />}
          label={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          onClick={() => { onToggleTheme(); }}
        />
        <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
        <DropdownItem icon={<IconSignOut />} label="Sign Out" onClick={onLogout} danger />
      </div>
    </div>
  );
}

function DropdownItem({ icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        padding: '9px 16px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
        color: danger ? 'var(--red)' : 'var(--text)',
        fontFamily: 'var(--font-sans)',
        textAlign: 'left',
        transition: 'background var(--transition)',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
    >
      <span style={{ opacity: 0.7, flexShrink: 0 }}>{icon}</span>
      {label}
    </button>
  );
}

// Icons
const IconPerson = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);
const IconSun = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
);
const IconMoon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
    <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/>
  </svg>
);
const IconSignOut = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
  </svg>
);
const IconMenu = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
    <path d="M3 12h18M3 6h18M3 18h18"/>
  </svg>
);

// ─── Header ───────────────────────────────────────────────────────────────────
export default function Header({ onMenuClick }) {
  const { user, theme } = useAuthStore();
  const { toggleTheme, logout } = useAuth();
  const navigate = useNavigate();
  const [kpis, setKpis] = useState(null);
  const [live, setLive] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fetchKPIs = useCallback(async () => {
    try {
      const data = await getKPIs();
      setKpis(data);
      setLive(true);
    } catch {
      setLive(false);
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

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 'var(--header-h)',
      background: 'var(--bg-card)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      zIndex: 200,
      boxShadow: 'var(--shadow)',
    }}>
      {/* Left: hamburger + logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0 14px',
        width: 'var(--sidebar-w)',
        flexShrink: 0,
        borderRight: '1px solid var(--border)',
        height: '100%',
      }}>
        <button
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: 6,
            color: 'var(--text-secondary)',
            transition: 'background var(--transition)',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
        >
          <IconMenu />
        </button>
        <SteelIQMark size={28} variant={theme === 'dark' ? 'full' : 'full'} />
        <SteelIQWordmark theme={theme} size={0.88} />
      </div>

      {/* Center: KPI strip */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
        overflow: 'hidden',
        height: '100%',
      }}>
        {/* Live indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '0 16px',
          borderRight: '1px solid var(--border)',
        }}>
          <LiveDot active={live} />
          <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Live
          </span>
        </div>

        <KPIItem
          label="Yield Rate"
          value={kpis?.yield_rate ?? null}
          decimals={1}
          unit="%"
          accentColor="var(--green)"
        />
        <KPIItem
          label="EAF kWh/t"
          value={kpis?.eaf_kwh_per_t ?? null}
          decimals={0}
          accentColor="var(--amber)"
        />
        <KPIItem
          label="Metallization"
          value={kpis?.metallization_pct ?? null}
          decimals={1}
          unit="%"
          accentColor="var(--blue)"
        />
        <KPIItem
          label="Tundish Temp"
          value={kpis?.tundish_temp ?? null}
          decimals={0}
          unit="°C"
          accentColor="var(--red)"
        />
        <KPIItem
          label="Tap-to-Tap"
          value={kpis?.tap_to_tap_min ?? null}
          decimals={1}
          unit="min"
          accentColor="var(--purple)"
        />
      </div>

      {/* Right: clock + user */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '0 18px',
        borderLeft: '1px solid var(--border)',
        height: '100%',
        flexShrink: 0,
      }}>
        <Clock />

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            aria-label="User menu"
            aria-expanded={dropdownOpen}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 8px 4px 4px',
              borderRadius: 20,
              background: dropdownOpen ? 'var(--bg-secondary)' : 'none',
              border: '1px solid transparent',
              cursor: 'pointer',
              transition: 'background var(--transition)',
            }}
            onMouseEnter={(e) => { if (!dropdownOpen) e.currentTarget.style.background = 'var(--bg-secondary)'; }}
            onMouseLeave={(e) => { if (!dropdownOpen) e.currentTarget.style.background = 'none'; }}
          >
            <Avatar user={user} size={28} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name?.split(' ')[0] || 'User'}
            </span>
            <svg width="12" height="12" fill="none" stroke="var(--text-secondary)" strokeWidth="2" viewBox="0 0 24 24"
              style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--transition)', flexShrink: 0 }}>
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>

          {dropdownOpen && (
            <UserDropdown
              user={user}
              theme={theme}
              onToggleTheme={toggleTheme}
              onLogout={handleLogout}
              onClose={() => setDropdownOpen(false)}
            />
          )}
        </div>
      </div>
    </header>
  );
}

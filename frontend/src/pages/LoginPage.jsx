import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const COLORS = {
  blue: '#3a78ff',
  amber: '#ffae4a',
  green: '#3acc7a',
  red: '#e84a4a',
};

const DEMO_ACCOUNTS = [
  { label: 'Super Admin', role: 'super_admin', email: 'admin@emsteel.ae', password: 'Admin@123', color: COLORS.red },
  { label: 'Plant Manager', role: 'plant_manager', email: 'manager@emsteel.ae', password: 'Mgr@123', color: COLORS.amber },
  { label: 'CastX Operator', role: 'castx_operator', email: 'castx@emsteel.ae', password: 'CastX@123', color: COLORS.green },
  { label: 'EAF Operator', role: 'eaf_operator', email: 'eaf@emsteel.ae', password: 'EAF@123', color: COLORS.blue },
  { label: 'DRI Operator', role: 'dri_operator', email: 'dri@emsteel.ae', password: 'DRI@123', color: '#a060ff' },
];

function SteelIQLockup({ size = 1 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: `${8 * size}px` }}>
      <svg width={36 * size} height={36 * size} viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill={COLORS.blue} />
        <path d="M8 16 L16 8 L24 16 L16 24 Z" fill="none" stroke="#fff" strokeWidth="2" />
        <circle cx="16" cy="16" r="3" fill="#fff" />
      </svg>
      <span style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        fontSize: `${22 * size}px`,
        color: '#fff',
        letterSpacing: '-0.5px',
      }}>
        Steel<span style={{ color: COLORS.blue }}>IQ</span>
      </span>
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/app');
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || 'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #060c1a 0%, #0d1629 50%, #0a1220 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Space Grotesk', sans-serif",
      position: 'relative',
      overflow: 'hidden',
      padding: '24px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(58,120,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(58,120,255,0.04) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />
      {/* Glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(58,120,255,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '40px 36px',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeIn 0.4s ease',
      }}>
        {/* Back link */}
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          fontSize: '13px', color: '#6070a0', marginBottom: '28px',
          textDecoration: 'none', transition: 'color 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#9090d0'}
          onMouseLeave={e => e.currentTarget.style.color = '#6070a0'}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Back to home
        </Link>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
          <SteelIQLockup size={1.2} />
        </div>
        <p style={{ textAlign: 'center', fontSize: '14px', color: '#5060a0', marginBottom: '32px' }}>
          Industrial AI Platform · Sign in to continue
        </p>

        {error && (
          <div style={{
            padding: '12px 16px',
            background: 'rgba(232,74,74,0.12)',
            border: '1px solid rgba(232,74,74,0.3)',
            borderRadius: '10px',
            color: COLORS.red,
            fontSize: '13px',
            fontWeight: 500,
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 5V8.5M8 11H8.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#8090b0', marginBottom: '8px' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="operator@plant.ae"
              autoComplete="username"
              style={{
                width: '100%', padding: '12px 16px',
                background: 'rgba(255,255,255,0.07)',
                border: '1.5px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: '#fff', fontSize: '15px',
                fontFamily: "'Space Grotesk', sans-serif",
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = COLORS.blue}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#8090b0', marginBottom: '8px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{
                  width: '100%', padding: '12px 48px 12px 16px',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1.5px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#fff', fontSize: '15px',
                  fontFamily: "'JetBrains Mono', monospace",
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = COLORS.blue}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#6070a0', padding: '4px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#9090c0'}
                onMouseLeave={e => e.currentTarget.style.color = '#6070a0'}
              >
                {showPw ? (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M2 2L16 16M7.5 7.6A2 2 0 0 0 10.4 10.5M4.2 4.3A8 8 0 0 0 1 9c1.5 3.3 4.8 5.5 8 5.5a8 8 0 0 0 4-1.1M7 3.6A8 8 0 0 1 9 3.5c3.2 0 6.5 2.2 8 5.5a8.2 8.2 0 0 1-1.4 2.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M1 9C2.5 5.7 5.8 3.5 9 3.5s6.5 2.2 8 5.5c-1.5 3.3-4.8 5.5-8 5.5S2.5 12.3 1 9Z" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px',
              background: loading ? 'rgba(58,120,255,0.5)' : COLORS.blue,
              color: '#fff', border: 'none', borderRadius: '10px',
              fontSize: '15px', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              transition: 'background 0.2s',
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '18px', height: '18px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                }} />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Demo accounts */}
        <div style={{ marginTop: '28px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px',
          }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#4a5880', letterSpacing: '1px' }}>DEMO ACCOUNTS</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {DEMO_ACCOUNTS.map(acc => (
              <button
                key={acc.role}
                onClick={() => fillDemo(acc)}
                style={{
                  padding: '7px 14px',
                  background: `${acc.color}15`,
                  border: `1px solid ${acc.color}35`,
                  borderRadius: '8px',
                  color: acc.color,
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s, transform 0.15s',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${acc.color}28`; e.currentTarget.style.transform = 'scale(1.03)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = `${acc.color}15`; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                {acc.label}
              </button>
            ))}
          </div>
          {email && (
            <div style={{
              marginTop: '12px',
              padding: '10px 14px',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#6070a0',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {email} · {password.replace(/./g, '•')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

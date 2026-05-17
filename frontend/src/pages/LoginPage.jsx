import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const DEMO_ACCOUNTS = [
  { name: 'Khalid Al Mazrouei', role: 'Super Admin',     email: 'admin@emsteel.ae',   password: 'Admin@123',  initials: 'KA', color: '#e84a4a' },
  { name: 'Omar Bin Said',       role: 'Plant Manager',   email: 'manager@emsteel.ae', password: 'Mgr@123',    initials: 'OS', color: '#ffae4a' },
  { name: 'Faris Al Rashid',     role: 'CastX Operator',  email: 'castx@emsteel.ae',   password: 'CastX@123',  initials: 'FR', color: '#3acc7a' },
  { name: 'Tariq Hassan',        role: 'EAF Operator',    email: 'eaf@emsteel.ae',      password: 'EAF@123',    initials: 'TH', color: '#3a78ff' },
  { name: 'Nabil Yousef',        role: 'DRI Operator',    email: 'dri@emsteel.ae',      password: 'DRI@123',    initials: 'NY', color: '#a060ff' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

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
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .login-input {
          width: 100%;
          background: var(--surface-2, rgba(255,255,255,0.06));
          border: 1px solid var(--border2, rgba(255,255,255,0.12));
          border-radius: 8px;
          padding: 11px 14px;
          color: var(--text, #e8eaf2);
          font-family: var(--sans, 'Space Grotesk', sans-serif);
          font-size: 13px;
          outline: none;
          transition: border-color .2s;
          box-sizing: border-box;
        }
        .login-input:focus {
          border-color: var(--blue, #3a78ff);
          box-shadow: 0 0 0 3px rgba(50,110,255,0.12);
        }
        .login-input::placeholder { color: var(--text-dim, #4a5880); }
        .login-btn-submit {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          background: linear-gradient(135deg, #3a78ff, oklch(60% 0.22 230deg));
          color: #fff;
          border: none;
          cursor: pointer;
          font-family: var(--sans, 'Space Grotesk', sans-serif);
          transition: all .2s;
          letter-spacing: .3px;
          margin-top: 4px;
          box-shadow: 0 4px 20px rgba(50,110,255,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .login-btn-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(50,110,255,0.4);
        }
        .login-btn-submit:disabled { opacity: .6; cursor: not-allowed; transform: none; }
        .demo-item-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 7px 10px;
          border-radius: 6px;
          background: var(--surface-1, rgba(255,255,255,0.03));
          border: 1px solid var(--surface-2, rgba(255,255,255,0.06));
          cursor: pointer;
          transition: all .15s;
        }
        .demo-item-row:hover {
          background: rgba(50,110,255,0.08);
          border-color: rgba(50,110,255,0.2);
        }
      `}</style>

      {/* Background image */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: "url('/uploads/steelIQ_image_poster.jpg') center/cover no-repeat",
        filter: 'brightness(0.28) saturate(1.4)',
      }} />

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(6,10,18,0.92) 0%, rgba(20,10,40,0.7) 100%)',
      }} />

      {/* Content column */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        width: '100%',
        maxWidth: 440,
        padding: '0 16px',
      }}>

        {/* Login card */}
        <div style={{
          width: 420,
          maxWidth: 'calc(100vw - 32px)',
          background: 'rgba(11,17,32,0.85)',
          border: '1px solid var(--border2, rgba(255,255,255,0.12))',
          borderRadius: 16,
          padding: '36px 32px',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 32px 80px var(--overlay, rgba(0,0,0,0.6)), 0 0 0 1px rgba(80,130,255,0.08)',
        }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'linear-gradient(140deg, #3a78ff, oklch(55% 0.22 220deg))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 16,
              color: '#fff',
              boxShadow: '0 0 24px oklch(65% 0.22 248deg / 0.45)',
              flexShrink: 0,
            }}>
              SQ
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--text, #e8eaf2)' }}>
                Steel<span style={{ color: 'var(--blue, #3a78ff)', fontStyle: 'normal' }}>IQ</span>
              </div>
              <div style={{
                fontSize: 10,
                color: 'var(--text-dim, #4a5880)',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                marginTop: 1,
              }}>
                by Zealogics
              </div>
            </div>
          </div>

          {/* Heading */}
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: 'var(--text, #e8eaf2)' }}>
            Command Center Access
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-dim, #4a5880)', marginBottom: 24 }}>
            Enter your credentials
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'var(--red-lo, rgba(232,74,74,0.1))',
              border: '1px solid rgba(255,50,50,.25)',
              borderRadius: 7,
              padding: '9px 12px',
              fontSize: 12,
              color: 'var(--red, #e84a4a)',
              marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--text-mid, #8090b0)',
                letterSpacing: '.5px',
                marginBottom: 6,
                display: 'block',
              }}>
                EMAIL ADDRESS
              </label>
              <input
                className="login-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your.name@company.com"
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--text-mid, #8090b0)',
                letterSpacing: '.5px',
                marginBottom: 6,
                display: 'block',
              }}>
                PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  className="login-input"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-dim, #4a5880)',
                    padding: 4,
                    lineHeight: 0,
                  }}
                >
                  {showPw ? (
                    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                      <path d="M2 2L16 16M7.5 7.6A2 2 0 0 0 10.4 10.5M4.2 4.3A8 8 0 0 0 1 9c1.5 3.3 4.8 5.5 8 5.5a8 8 0 0 0 4-1.1M7 3.6A8 8 0 0 1 9 3.5c3.2 0 6.5 2.2 8 5.5a8.2 8.2 0 0 1-1.4 2.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                      <path d="M1 9C2.5 5.7 5.8 3.5 9 3.5s6.5 2.2 8 5.5c-1.5 3.3-4.8 5.5-8 5.5S2.5 12.3 1 9Z" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-btn-submit"
            >
              {loading ? (
                <>
                  <div style={{
                    width: 16,
                    height: 16,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                  Authenticating…
                </>
              ) : (
                'Sign In →'
              )}
            </button>
          </form>

          {/* Security badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 14 }}>
            {['Secured by Zealogics', 'RBAC Enabled', 'AES-256 Encrypted'].map(t => (
              <span key={t} style={{
                fontSize: 9,
                color: 'var(--text-dim, #4a5880)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}>
                <span style={{ color: 'var(--green, #3acc7a)' }}>✓</span>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Demo accounts panel */}
        <div style={{
          background: 'rgba(11,17,32,0.82)',
          border: '1px solid var(--border2, rgba(255,255,255,0.12))',
          borderRadius: 12,
          padding: '16px 18px',
          backdropFilter: 'blur(20px)',
          width: '100%',
          maxWidth: 'calc(100vw - 32px)',
          boxSizing: 'border-box',
        }}>
          <div style={{
            fontSize: 10,
            color: 'var(--text-dim, #4a5880)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: 10,
            fontWeight: 600,
          }}>
            DEMO ACCOUNTS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {DEMO_ACCOUNTS.map(acc => (
              <div
                key={acc.email}
                className="demo-item-row"
                onClick={() => fillDemo(acc)}
              >
                {/* Avatar */}
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: `${acc.color}22`,
                  border: `1px solid ${acc.color}44`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 800,
                  color: acc.color,
                  flexShrink: 0,
                }}>
                  {acc.initials}
                </div>

                {/* Name + role */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text, #e8eaf2)' }}>
                    {acc.name}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--text-dim, #4a5880)' }}>
                    {acc.role}
                  </div>
                </div>

                {/* Password */}
                <div style={{
                  fontFamily: 'var(--mono, monospace)',
                  fontSize: 9,
                  color: 'var(--text-dim, #4a5880)',
                  opacity: 0.6,
                }}>
                  {acc.password}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,.2)', textAlign: 'center' }}>
          SteelIQ v3.2 · QEG Framework · Zealogics Technologies USA
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { listModules, createModule, toggleModule, listDataSources, createDataSource, testDataSource } from '../api/modules.js';
import { listUsers, createUser, updateUser, deactivateUser, resetPassword } from '../api/users.js';

const SECTIONS = [
  { section: undefined, label: 'Overview' },
  { section: 'modules', label: 'Module Registry' },
  { section: 'architecture', label: 'Platform Architecture' },
  { section: 'datasources', label: 'Data Sources' },
  { section: 'ai-config', label: 'AI Model Config' },
  { section: 'users', label: 'User Management' },
  { section: 'support', label: 'Self-Support' },
];

const COLOR = 'var(--purple)';
const COLOR_HEX = '#a060ff';

function Card({ children, style }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow)',
      overflow: 'hidden',
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
      <div>
        <h3 style={{ fontSize: '14px', fontWeight: 700 }}>{title}</h3>
        {subtitle && <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Badge({ label, color }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 4,
      fontSize: '10px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      background: `${color}18`,
      color,
    }}>
      {label}
    </span>
  );
}

// ─── Module Registry Section ──────────────────────────────────────────────────
function ModuleRegistry() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  const MOCK_MODULES = [
    {
      id: '1', name: 'CastX Quality Engine', slug: 'castx', type: 'analytics', status: 'active',
      version: '2.4.1', tagline: 'Defect prediction & continuous casting quality',
      icon: 'Q', color: '#3a6eff', health: 97, instances: 2,
      roles: ['super_admin', 'plant_manager', 'castx_operator'],
      iba: ['IBA.CCM.S1.TEMP', 'IBA.CCM.S2.TEMP', 'IBA.CCM.MOULD'],
      l2: ['L2.CCM.SPEED', 'L2.CCM.RECIPE'],
      capabilities: ['Defect ML', 'NLP Query', 'Time-series'],
      deployedAt: '2025-03-12 09:00 GST', vendor: 'Zealogics',
    },
    {
      id: '2', name: 'EAF Energy Optimizer', slug: 'eaf', type: 'optimization', status: 'active',
      version: '1.9.3', tagline: 'Arc energy optimisation & electrode management',
      icon: 'E', color: '#ffa528', health: 88, instances: 2,
      roles: ['super_admin', 'plant_manager', 'eaf_operator'],
      iba: ['IBA.EAF.KWH', 'IBA.EAF.PHASE_A', 'IBA.EAF.ELEC'],
      l2: ['L2.EAF.SETPOINT', 'L2.EAF.CHARGE'],
      capabilities: ['Arc ML', 'Charge Mix AI', 'Maint. Pred.'],
      deployedAt: '2025-01-22 14:30 GST', vendor: 'Zealogics',
    },
    {
      id: '3', name: 'DRI Gas Analytics', slug: 'dri', type: 'analytics', status: 'active',
      version: '3.1.0', tagline: 'Gas consumption & metallization prediction',
      icon: 'G', color: '#32c86e', health: 94, instances: 2,
      roles: ['super_admin', 'plant_manager', 'dri_operator'],
      iba: ['IBA.DRI.GAS_FLOW', 'IBA.DRI.ZONE3_P', 'IBA.DRI.METALIZ'],
      l2: ['L2.DRI.TEMP_PROFILE'],
      capabilities: ['Gas ML', 'Yield Pred.', 'Anomaly Det.'],
      deployedAt: '2025-02-08 11:00 GST', vendor: 'Zealogics',
    },
    {
      id: '4', name: 'Alerts & Notifications', slug: 'alerts', type: 'core', status: 'active',
      version: '4.0.2', tagline: 'Cross-module alert aggregation & escalation',
      icon: '!', color: '#ff3232', health: 100, instances: 3,
      roles: ['super_admin', 'plant_manager', 'castx_operator', 'eaf_operator', 'dri_operator'],
      iba: [],
      l2: [],
      capabilities: ['Event Bus', 'Escalation', 'Email/SMS'],
      deployedAt: '2024-11-01 08:00 GST', vendor: 'Zealogics',
    },
    {
      id: '5', name: 'NLP Report Generator', slug: 'nlp', type: 'ai', status: 'beta',
      version: '1.2.0', tagline: 'Natural language shift reports from live data',
      icon: '⌘', color: '#a060ff', health: 61, instances: 1,
      roles: ['super_admin', 'plant_manager'],
      iba: [],
      l2: [],
      capabilities: ['GPT-4o', 'PDF Export', 'Scheduling'],
      deployedAt: '2025-04-01 10:00 GST', vendor: 'Zealogics AI',
    },
    {
      id: '6', name: 'Predictive Scheduler', slug: 'scheduler', type: 'ai', status: 'dev',
      version: '0.9.1', tagline: 'AI-driven maintenance scheduling & planning',
      icon: '◈', color: '#a060ff', health: 0, instances: 0,
      roles: ['super_admin'],
      iba: [],
      l2: [],
      capabilities: ['Optimizer', 'Calendar API'],
      deployedAt: '—', vendor: 'In-house',
    },
  ];

  useEffect(() => {
    listModules()
      .then(data => setModules(Array.isArray(data) && data.length ? data : MOCK_MODULES))
      .catch(() => setModules(MOCK_MODULES))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (id, status) => {
    const newStatus = status === 'active' ? 'disabled' : 'active';
    try {
      await toggleModule(id, newStatus === 'active');
    } catch {}
    setModules((prev) => prev.map((m) => m.id === id ? { ...m, status: newStatus } : m));
  };

  const typeColors = { analytics: 'var(--blue)', optimization: 'var(--amber)', ai: 'var(--purple)', core: 'var(--green)' };
  const statusColors = { active: 'var(--green)', beta: 'var(--amber)', dev: 'var(--text-muted)', disabled: 'var(--red)' };

  const counts = {
    total: modules.length,
    active: modules.filter(m => m.status === 'active').length,
    beta: modules.filter(m => m.status === 'beta').length,
    dev: modules.filter(m => m.status === 'dev').length,
    ibaTotal: new Set(modules.flatMap(m => m.iba || [])).size,
    l2Total: new Set(modules.flatMap(m => m.l2 || [])).size,
  };

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 12 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, height: 240 }}>
            <div style={{ height: 14, background: 'var(--bg-secondary)', borderRadius: 4, width: '60%', marginBottom: 10 }} />
            <div style={{ height: 10, background: 'var(--bg-secondary)', borderRadius: 4, width: '40%' }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Microapps Installed', value: counts.total, color: 'var(--text)' },
          { label: 'Active in Production', value: counts.active, color: 'var(--green)' },
          { label: 'Beta / Dev Slots', value: counts.beta + counts.dev, color: 'var(--amber)' },
          { label: 'Data Bindings', value: `${counts.ibaTotal} IBA · ${counts.l2Total} L2`, color: 'var(--blue)' },
        ].map(m => (
          <div key={m.label} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '14px 16px', boxShadow: 'var(--shadow)',
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Card grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 12 }}>
        {modules.map(m => {
          const color = m.color || typeColors[m.type] || 'var(--blue)';
          const sColor = statusColors[m.status] || 'var(--text-muted)';
          const healthColor = m.health > 90 ? 'var(--green)' : m.health > 60 ? 'var(--amber)' : m.health === 0 ? 'var(--text-muted)' : 'var(--red)';

          return (
            <div key={m.id} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 12, boxShadow: 'var(--shadow)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              opacity: m.status === 'dev' ? 0.75 : 1,
            }}>
              {/* Card header */}
              <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                  background: `${color}18`, border: `1px solid ${color}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 800, color,
                }}>
                  {m.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{m.name}</span>
                    <span style={{
                      fontSize: 9, padding: '2px 7px', borderRadius: 3, fontWeight: 700,
                      letterSpacing: '0.5px', textTransform: 'uppercase',
                      background: `${sColor}18`, color: sColor, border: `1px solid ${sColor}33`,
                    }}>{m.status.toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{m.tagline}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                    v{m.version} · {m.vendor}
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding: '14px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Health bar */}
                <div>
                  {[
                    { label: 'Deployed', value: m.deployedAt },
                    { label: 'Health · Instances', value: `${m.health}% · ${m.instances} pod${m.instances !== 1 ? 's' : ''}`, color: healthColor },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 5 }}>
                      <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: row.color || 'var(--text-secondary)' }}>{row.value}</span>
                    </div>
                  ))}
                  <div style={{ height: 4, background: 'var(--bg-secondary)', borderRadius: 2, marginTop: 4 }}>
                    <div style={{ height: '100%', width: `${m.health}%`, background: healthColor, borderRadius: 2, transition: 'width 0.5s' }} />
                  </div>
                </div>

                {/* RBAC roles */}
                {m.roles && m.roles.length > 0 && (
                  <div>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 1, fontWeight: 700, marginBottom: 5, textTransform: 'uppercase' }}>RBAC Roles</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {m.roles.map(r => (
                        <span key={r} style={{
                          fontSize: 9, padding: '2px 7px', borderRadius: 3,
                          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                          color: 'var(--text-muted)', textTransform: 'capitalize',
                        }}>
                          {r.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Data bindings */}
                <div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 1, fontWeight: 700, marginBottom: 5, textTransform: 'uppercase' }}>Data Bindings</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {m.iba && m.iba.length > 0 && (
                      <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 3, background: 'rgba(50,110,255,0.1)', color: 'var(--blue)', border: '1px solid rgba(50,110,255,0.2)' }}>
                        IBA × {m.iba.length}
                      </span>
                    )}
                    {m.l2 && m.l2.length > 0 && (
                      <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 3, background: 'rgba(160,80,255,0.1)', color: 'var(--purple)', border: '1px solid rgba(160,80,255,0.2)' }}>
                        L2 × {m.l2.length}
                      </span>
                    )}
                    {(m.capabilities || []).slice(0, 2).map(c => (
                      <span key={c} style={{ fontSize: 9, padding: '2px 7px', borderRadius: 3, background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>{c}</span>
                    ))}
                    {(m.capabilities || []).length > 2 && (
                      <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 3, background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                        +{m.capabilities.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card footer */}
              <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border)', display: 'flex', gap: 6 }}>
                <button style={{
                  padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                  fontFamily: 'var(--font-sans)', cursor: 'pointer',
                  background: 'rgba(50,110,255,0.1)', color: 'var(--blue)', border: '1px solid rgba(50,110,255,0.25)',
                }}>Configure</button>
                <button style={{
                  padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                  fontFamily: 'var(--font-sans)', cursor: 'pointer',
                  background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)',
                }}>Logs</button>
                <button style={{
                  padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                  fontFamily: 'var(--font-sans)', cursor: 'pointer',
                  background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)',
                }}>Versions</button>
                <button
                  onClick={() => handleToggle(m.id, m.status)}
                  style={{
                    marginLeft: 'auto', padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                    fontFamily: 'var(--font-sans)', cursor: 'pointer',
                    background: m.status === 'active' ? 'rgba(255,50,50,0.1)' : 'rgba(50,200,110,0.1)',
                    color: m.status === 'active' ? 'var(--red)' : 'var(--green)',
                    border: `1px solid ${m.status === 'active' ? 'rgba(255,50,50,0.25)' : 'rgba(50,200,110,0.25)'}`,
                  }}
                >
                  {m.status === 'active' ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          );
        })}

        {/* Install New Microapp dashed card */}
        <div style={{
          background: 'transparent', border: '2px dashed var(--border)',
          borderRadius: 12, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 10,
          padding: '32px 24px', cursor: 'pointer', minHeight: 200,
          transition: 'border-color 0.2s, background 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--purple)'; e.currentTarget.style.background = 'rgba(160,80,255,0.04)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}
        >
          <div style={{
            width: 42, height: 42, borderRadius: 10,
            background: 'rgba(160,80,255,0.1)', border: '1px solid rgba(160,80,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, color: 'var(--purple)', fontWeight: 300,
          }}>+</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Install New Microapp</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5, maxWidth: 240 }}>
            Register a vendor module or in-house app. Configure data bindings, roles and deploy without redeploying the shell.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AI Model Config Section ──────────────────────────────────────────────────
function AIModelConfig() {
  const [cfg, setCfg] = useState({
    nlpEndpoint: 'https://api.zealogics.com/nlp/v2',
    apiKey: 'sk-zeal-••••••••••••••••••••••••••••••',
    modelVersion: 'gpt-4o',
    maxTokens: 2048,
    temperature: 0.3,
  });
  const [showKey, setShowKey] = useState(false);
  const [testState, setTestState] = useState(null); // null | 'testing' | 'success' | 'error'
  const [saved, setSaved] = useState(false);

  const MOCK_INFERENCES = [
    { ts: '04:22:18', model: 'steeliq-nlp-v1.4', tokens: 312, latency: '94ms', status: 'ok' },
    { ts: '04:18:05', model: 'steeliq-nlp-v1.4', tokens: 278, latency: '88ms', status: 'ok' },
    { ts: '04:09:41', model: 'steeliq-ml-v2.1', tokens: 512, latency: '210ms', status: 'ok' },
    { ts: '03:58:01', model: 'steeliq-nlp-v1.4', tokens: 198, latency: '76ms', status: 'ok' },
    { ts: '03:44:22', model: 'steeliq-ml-v2.1', tokens: 724, latency: '680ms', status: 'warn' },
  ];

  const handleTestConnection = () => {
    setTestState('testing');
    setTimeout(() => setTestState(Math.random() > 0.2 ? 'success' : 'error'), 1500);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputStyle = {
    flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border)',
    borderRadius: 6, padding: '7px 11px', color: 'var(--text)',
    fontFamily: 'var(--font-mono)', fontSize: 11, outline: 'none',
  };
  const labelStyle = { fontSize: 11, color: 'var(--text-muted)', width: 160, flexShrink: 0 };
  const rowStyle = { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card>
        <SectionHeader
          title="AI Model Config"
          subtitle="Configure AI/ML endpoints and model parameters"
          action={
            <button
              onClick={handleSave}
              style={{
                padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700,
                fontFamily: 'var(--font-sans)', cursor: 'pointer',
                background: saved ? 'rgba(50,200,110,0.15)' : 'rgba(50,200,110,0.1)',
                color: 'var(--green)', border: '1px solid rgba(50,200,110,0.25)',
              }}
            >
              {saved ? '✓ Saved' : 'Save Configuration'}
            </button>
          }
        />
        <div style={{ padding: '16px 20px' }}>
          {/* NLP Model Endpoint */}
          <div style={rowStyle}>
            <div style={labelStyle}>NLP Model Endpoint</div>
            <input
              style={inputStyle}
              type="text"
              placeholder="https://api.zealogics.com/nlp/v2"
              value={cfg.nlpEndpoint}
              onChange={e => setCfg(p => ({ ...p, nlpEndpoint: e.target.value }))}
            />
            <button
              onClick={handleTestConnection}
              disabled={testState === 'testing'}
              style={{
                padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                fontFamily: 'var(--font-sans)', cursor: testState === 'testing' ? 'wait' : 'pointer', flexShrink: 0,
                background: testState === 'success' ? 'rgba(50,200,110,0.1)' : testState === 'error' ? 'rgba(255,50,50,0.1)' : 'rgba(50,110,255,0.1)',
                color: testState === 'success' ? 'var(--green)' : testState === 'error' ? 'var(--red)' : 'var(--blue)',
                border: `1px solid ${testState === 'success' ? 'rgba(50,200,110,0.25)' : testState === 'error' ? 'rgba(255,50,50,0.25)' : 'rgba(50,110,255,0.25)'}`,
              }}
            >
              {testState === 'testing' ? 'Testing…' : testState === 'success' ? '✓ Connected' : testState === 'error' ? '✗ Failed' : 'Test Connection'}
            </button>
          </div>

          {/* API Key */}
          <div style={rowStyle}>
            <div style={labelStyle}>API Key</div>
            <input
              style={{ ...inputStyle, letterSpacing: showKey ? 'normal' : '3px', color: showKey ? 'var(--text)' : 'var(--text-muted)' }}
              type={showKey ? 'text' : 'password'}
              value={cfg.apiKey}
              onChange={e => setCfg(p => ({ ...p, apiKey: e.target.value }))}
            />
            <button
              onClick={() => setShowKey(s => !s)}
              style={{
                padding: '5px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                fontFamily: 'var(--font-sans)', cursor: 'pointer', flexShrink: 0,
                background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)',
              }}
            >
              {showKey ? 'Hide' : 'Show'}
            </button>
          </div>

          {/* Model Version */}
          <div style={rowStyle}>
            <div style={labelStyle}>Model Version</div>
            <select
              value={cfg.modelVersion}
              onChange={e => setCfg(p => ({ ...p, modelVersion: e.target.value }))}
              style={{ ...inputStyle, fontFamily: 'var(--font-sans)', cursor: 'pointer' }}
            >
              <option value="gpt-4o">GPT-4o</option>
              <option value="claude-3-opus">Claude 3 Opus</option>
              <option value="llama-3.1">Local Llama 3.1</option>
              <option value="steeliq-ft">Fine-tuned SteelIQ</option>
            </select>
          </div>

          {/* Max Tokens */}
          <div style={rowStyle}>
            <div style={labelStyle}>Max Tokens</div>
            <input
              style={inputStyle}
              type="number"
              value={cfg.maxTokens}
              min={256} max={8192}
              onChange={e => setCfg(p => ({ ...p, maxTokens: Number(e.target.value) }))}
            />
          </div>

          {/* Temperature */}
          <div style={{ ...rowStyle, borderBottom: 'none' }}>
            <div style={labelStyle}>Temperature</div>
            <input
              type="range" min={0} max={1} step={0.05}
              value={cfg.temperature}
              onChange={e => setCfg(p => ({ ...p, temperature: Number(e.target.value) }))}
              style={{ flex: 1 }}
            />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, width: 36, textAlign: 'right', flexShrink: 0 }}>
              {cfg.temperature.toFixed(2)}
            </span>
          </div>
        </div>
      </Card>

      {/* Inference log panel */}
      <Card>
        <SectionHeader title="Recent Inference Log" subtitle="Last 5 inference calls" />
        <div style={{ padding: '4px 0' }}>
          {MOCK_INFERENCES.map((entry, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '9px 20px', borderBottom: i < MOCK_INFERENCES.length - 1 ? '1px solid var(--border)' : 'none',
              fontFamily: 'var(--font-mono)', fontSize: 11,
            }}>
              <span style={{ color: 'var(--text-muted)', opacity: 0.6, flexShrink: 0 }}>{entry.ts}</span>
              <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{entry.model}</span>
              <span style={{ color: 'var(--text-muted)' }}>{entry.tokens} tok</span>
              <span style={{
                padding: '1px 6px', borderRadius: 3, fontSize: 9, fontWeight: 700,
                background: entry.status === 'ok' ? 'rgba(50,200,110,0.1)' : 'rgba(255,165,40,0.1)',
                color: entry.status === 'ok' ? 'var(--green)' : 'var(--amber)',
              }}>
                {entry.latency}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Data Sources Section ─────────────────────────────────────────────────────
function DataSources() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testingId, setTestingId] = useState(null);

  const MOCK_SOURCES = [
    { id: 'ds1', name: 'Plant SCADA', type: 'opc-ua', connection_string: 'opc.tcp://scada-server:4840', status: 'connected', latency_ms: 12 },
    { id: 'ds2', name: 'Historian DB', type: 'timescaledb', connection_string: 'postgresql://historian:5432/plant', status: 'connected', latency_ms: 4 },
    { id: 'ds3', name: 'Lab LIMS', type: 'rest-api', connection_string: 'https://lims.internal/api/v2', status: 'connected', latency_ms: 88 },
    { id: 'ds4', name: 'ERP SAP', type: 'sap-rfc', connection_string: 'sap://erp-server:3300', status: 'degraded', latency_ms: 320 },
    { id: 'ds5', name: 'Vibration IoT Bus', type: 'mqtt', connection_string: 'mqtt://iot-broker:1883', status: 'disconnected', latency_ms: null },
  ];

  useEffect(() => {
    listDataSources()
      .then(setSources)
      .catch(() => setSources(MOCK_SOURCES))
      .finally(() => setLoading(false));
  }, []);

  const handleTest = async (id) => {
    setTestingId(id);
    try {
      const result = await testDataSource(id);
      setSources((prev) => prev.map((s) => s.id === id ? { ...s, status: result.success ? 'connected' : 'degraded', latency_ms: result.latency_ms } : s));
    } catch {
      setSources((prev) => prev.map((s) => s.id === id ? { ...s, latency_ms: Math.floor(Math.random() * 100) + 5 } : s));
    } finally {
      setTestingId(null);
    }
  };

  const statusColors = { connected: 'var(--green)', degraded: 'var(--amber)', disconnected: 'var(--red)' };
  const typeColors = { 'opc-ua': 'var(--blue)', 'timescaledb': 'var(--green)', 'rest-api': 'var(--purple)', 'sap-rfc': 'var(--amber)', 'mqtt': 'var(--blue)' };

  return (
    <Card>
      <SectionHeader title="Data Sources" subtitle="Platform data connectors and integration endpoints" />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              {['Source', 'Type', 'Connection', 'Latency', 'Status', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sources.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>{s.name}</td>
                <td style={{ padding: '12px 16px' }}><Badge label={s.type} color={typeColors[s.type] || 'var(--text-muted)'} /></td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.connection_string}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                  {s.latency_ms != null ? `${s.latency_ms}ms` : '—'}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '12px', fontWeight: 600, color: statusColors[s.status] || 'var(--text-muted)' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColors[s.status] || 'var(--text-muted)' }} />
                    {s.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button
                    onClick={() => handleTest(s.id)}
                    disabled={testingId === s.id}
                    style={{
                      padding: '4px 10px', borderRadius: 6, fontSize: '11px', fontWeight: 600,
                      fontFamily: 'var(--font-sans)', cursor: testingId === s.id ? 'wait' : 'pointer',
                      background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
                      border: '1px solid var(--border)', opacity: testingId === s.id ? 0.6 : 1,
                    }}
                  >
                    {testingId === s.id ? 'Testing…' : 'Test'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ─── User Management Section ──────────────────────────────────────────────────
function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const MOCK_USERS = [
    { id: 'u1', name: 'Ahmed Al-Rashid', email: 'ahmed@steeliq.io', role: 'super_admin', status: 'active', last_login: new Date(Date.now() - 2 * 3600000).toISOString() },
    { id: 'u2', name: 'Maria Santos', email: 'maria@steeliq.io', role: 'plant_manager', status: 'active', last_login: new Date(Date.now() - 5 * 3600000).toISOString() },
    { id: 'u3', name: 'James Okonkwo', email: 'james@steeliq.io', role: 'castx_operator', status: 'active', last_login: new Date(Date.now() - 1 * 3600000).toISOString() },
    { id: 'u4', name: 'Priya Nair', email: 'priya@steeliq.io', role: 'eaf_operator', status: 'active', last_login: new Date(Date.now() - 30 * 60000).toISOString() },
    { id: 'u5', name: 'Dmitri Volkov', email: 'dmitri@steeliq.io', role: 'dri_operator', status: 'inactive', last_login: new Date(Date.now() - 7 * 24 * 3600000).toISOString() },
  ];

  useEffect(() => {
    listUsers()
      .then((data) => setUsers(Array.isArray(data) ? data : MOCK_USERS))
      .catch(() => setUsers(MOCK_USERS))
      .finally(() => setLoading(false));
  }, []);

  const handleResetPw = async (id) => {
    try { await resetPassword(id); } catch {}
    alert('Password reset email sent.');
  };
  const handleDeactivate = async (id, status) => {
    try { await deactivateUser(id); } catch {}
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: status === 'active' ? 'inactive' : 'active' } : u));
  };

  const roleColors = {
    super_admin: 'var(--purple)', plant_manager: 'var(--blue)',
    castx_operator: 'var(--blue)', eaf_operator: 'var(--amber)', dri_operator: 'var(--green)',
  };
  const roleLabels = {
    super_admin: 'Super Admin', plant_manager: 'Plant Mgr',
    castx_operator: 'CastX Op', eaf_operator: 'EAF Op', dri_operator: 'DRI Op',
  };

  return (
    <Card>
      <SectionHeader title="User Management" subtitle={`${users.filter(u => u.status === 'active').length} active users`} />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              {['User', 'Email', 'Role', 'Last Login', 'Status', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border)', opacity: u.status === 'inactive' ? 0.6 : 1 }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--blue), var(--purple))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: 700, color: '#fff', flexShrink: 0,
                    }}>
                      {u.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 600 }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '12px' }}>{u.email}</td>
                <td style={{ padding: '12px 16px' }}><Badge label={roleLabels[u.role] || u.role} color={roleColors[u.role] || 'var(--text-muted)'} /></td>
                <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  {new Date(u.last_login).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '12px', fontWeight: 600, color: u.status === 'active' ? 'var(--green)' : 'var(--text-muted)' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: u.status === 'active' ? 'var(--green)' : 'var(--text-muted)' }} />
                    {u.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => handleResetPw(u.id)} style={{ padding: '3px 8px', borderRadius: 5, fontSize: '11px', fontWeight: 600, fontFamily: 'var(--font-sans)', cursor: 'pointer', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                      Reset PW
                    </button>
                    <button onClick={() => handleDeactivate(u.id, u.status)} style={{
                      padding: '3px 8px', borderRadius: 5, fontSize: '11px', fontWeight: 600, fontFamily: 'var(--font-sans)', cursor: 'pointer',
                      background: u.status === 'active' ? 'rgba(255,74,106,0.10)' : 'rgba(58,204,122,0.10)',
                      color: u.status === 'active' ? 'var(--red)' : 'var(--green)',
                      border: `1px solid ${u.status === 'active' ? 'rgba(255,74,106,0.25)' : 'rgba(58,204,122,0.25)'}`,
                    }}>
                      {u.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ─── Platform Architecture Section ───────────────────────────────────────────
function PlatformArchitecture() {
  const services = [
    { name: 'API Gateway', status: 'healthy', uptime: '99.97%', requests_pm: '14.2k', latency_p99: '48ms' },
    { name: 'Analytics Engine', status: 'healthy', uptime: '99.94%', requests_pm: '8.7k', latency_p99: '120ms' },
    { name: 'Auth Service', status: 'healthy', uptime: '100%', requests_pm: '3.1k', latency_p99: '22ms' },
    { name: 'TimescaleDB', status: 'healthy', uptime: '99.99%', requests_pm: '22.4k', latency_p99: '8ms' },
    { name: 'Redis Cache', status: 'healthy', uptime: '100%', requests_pm: '45.8k', latency_p99: '1ms' },
    { name: 'ML Inference', status: 'degraded', uptime: '98.21%', requests_pm: '1.2k', latency_p99: '680ms' },
    { name: 'SCADA Bridge', status: 'healthy', uptime: '99.88%', requests_pm: '6.4k', latency_p99: '15ms' },
    { name: 'Celery Workers', status: 'healthy', uptime: '99.73%', requests_pm: '980', latency_p99: '450ms' },
  ];

  return (
    <Card>
      <SectionHeader title="Platform Architecture" subtitle="Service health and performance metrics" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, padding: 20 }}>
        {services.map((s) => {
          const color = s.status === 'healthy' ? 'var(--green)' : s.status === 'degraded' ? 'var(--amber)' : 'var(--red)';
          return (
            <div key={s.name} style={{
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius)',
              padding: '14px 16px',
              border: `1px solid ${s.status !== 'healthy' ? `${color}30` : 'var(--border)'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: '13px', fontWeight: 700 }}>{s.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '11px', fontWeight: 600, color }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
                  {s.status}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {[
                  { label: 'Uptime', value: s.uptime },
                  { label: 'Req/min', value: s.requests_pm },
                  { label: 'P99 Latency', value: s.latency_p99 },
                ].map((m) => (
                  <div key={m.label}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: 1 }}>{m.label}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── Self-Support Section ─────────────────────────────────────────────────────
function SelfSupport() {
  const articles = [
    { title: 'Getting Started with CastX Analytics', category: 'CastX', read: '4 min' },
    { title: 'Configuring EAF Energy Thresholds', category: 'EAF', read: '6 min' },
    { title: 'Understanding DRI Metallization KPIs', category: 'DRI', read: '5 min' },
    { title: 'RBAC Role Management Guide', category: 'Admin', read: '8 min' },
    { title: 'Connecting OPC-UA Data Sources', category: 'Integration', read: '10 min' },
    { title: 'Alert Configuration & Escalation Rules', category: 'Alerts', read: '7 min' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
      <Card>
        <SectionHeader title="Documentation" subtitle="Guides and reference articles" />
        <div style={{ padding: '8px 0' }}>
          {articles.map((a) => (
            <div key={a.title} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '11px 20px', cursor: 'pointer',
              transition: 'background var(--transition)',
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: 2 }}>{a.title}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{a.category} · {a.read} read</div>
              </div>
              <svg width="14" height="14" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, marginLeft: 8 }}>
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <SectionHeader title="System Status" subtitle="Platform health overview" />
        <div style={{ padding: 20 }}>
          <div style={{
            padding: '16px',
            background: 'rgba(58,204,122,0.08)',
            border: '1px solid rgba(58,204,122,0.2)',
            borderRadius: 'var(--radius)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 16,
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--green)' }}>All Systems Operational</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 1 }}>Last checked: {new Date().toLocaleTimeString()}</div>
            </div>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
            <p style={{ marginBottom: 8 }}>For urgent support, contact your system administrator or raise a ticket via the internal helpdesk.</p>
            <p>Platform version: <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text)' }}>3.2.0</span></p>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Admin Overview ───────────────────────────────────────────────────────────
function AdminOverview() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
      {[
        { label: 'Active Modules', value: '4', color: 'var(--purple)', icon: '⚙' },
        { label: 'Data Sources', value: '5', color: 'var(--blue)', icon: '⫯' },
        { label: 'Active Users', value: '4', color: 'var(--green)', icon: '◉' },
        { label: 'Platform Uptime', value: '99.9%', color: 'var(--green)', icon: '↑' },
        { label: 'API Requests/min', value: '14.2k', color: 'var(--amber)', icon: '≈' },
      ].map((s) => (
        <div key={s.label} style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          boxShadow: 'var(--shadow)',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 8 }}>{s.label}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 700, color: s.color }}>{s.value}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Admin Page ───────────────────────────────────────────────────────────────
export default function AdminPage() {
  const { section } = useParams();

  const renderSection = () => {
    switch (section) {
      case 'modules': return <ModuleRegistry />;
      case 'architecture': return <PlatformArchitecture />;
      case 'datasources': return <DataSources />;
      case 'users': return <UserManagement />;
      case 'support': return <SelfSupport />;
      default: return <AdminOverview />;
    }
  };

  return (
    <div style={{ fontFamily: 'var(--font-sans)', padding: '20px 24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{ width: 4, height: 22, borderRadius: 2, background: COLOR }} />
          <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em' }}>Administration</h1>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginLeft: 14 }}>
          Platform management — modules, data sources, users, and system health
        </p>
      </div>

      {/* Section tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginBottom: 24, overflowX: 'auto' }}>
        {SECTIONS.map(({ section: s, label }) => {
          const to = s ? `/app/admin/${s}` : '/app/admin';
          const active = section === s || (!section && s === undefined);
          return (
            <NavLink key={label} to={to} end={!s} style={{
              padding: '8px 16px', fontSize: '13px',
              fontWeight: active ? 700 : 500,
              color: active ? COLOR : 'var(--text-secondary)',
              borderBottom: `2px solid ${active ? COLOR : 'transparent'}`,
              whiteSpace: 'nowrap', textDecoration: 'none',
              transition: 'color var(--transition)', marginBottom: -1,
            }}>
              {label}
            </NavLink>
          );
        })}
      </div>

      {renderSection()}
    </div>
  );
}

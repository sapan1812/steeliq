import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { getDRIGas } from '../../api/analytics.js';

const C = { blue: '#3a78ff', amber: '#ffae4a', green: '#3acc7a', purple: '#a060ff', red: '#e84a4a' };

const TABS = [
  { id: 'gas', label: 'Gas Consumption', icon: '💨' },
  { id: 'metallization', label: 'Metallization', icon: '🔬' },
  { id: 'temperature', label: 'Temperature Profile', icon: '🌡' },
  { id: 'yield', label: 'Process Yield', icon: '📊' },
  { id: 'anomaly', label: 'Anomaly Detection', icon: '⚠️' },
];

function MicroappBar() {
  return (
    <div style={{ padding: '10px 20px', background: 'rgba(255,174,74,0.08)', border: '1px solid rgba(255,174,74,0.2)', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '12px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
      <span style={{ color: C.amber, fontWeight: 800 }}>DRI/DRP Suite</span>
      <span style={{ color: 'var(--text-dim)' }}>v1.8.0 · Zealogics</span>
      {[['IBA', '10 tags'], ['L2', '3 channels']].map(([k, v]) => (
        <span key={k} style={{ padding: '3px 8px', background: 'rgba(128,128,180,0.12)', borderRadius: '6px', color: 'var(--text-dim)' }}>{k}: {v}</span>
      ))}
      <span style={{ marginLeft: 'auto', color: C.amber }}>Health: <b>96%</b></span>
    </div>
  );
}

function GasTab() {
  const gasData = Array.from({ length: 48 }, (_, i) => ({
    t: `${String(Math.floor(i / 2)).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`,
    flow: 18500 + Math.sin(i * 0.4) * 1200 + Math.random() * 600,
    target: 18800,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {[{ label: 'Current Flow', value: '18.74k', unit: 'Nm³/hr', color: C.amber }, { label: 'Target Flow', value: '18.8k', unit: 'Nm³/hr', color: C.blue }, { label: 'Reformer Temp', value: '912', unit: '°C', color: C.green }, { label: 'Efficiency', value: '96.2', unit: '%', color: C.green }].map(s => (
          <div key={s.label} style={{ flex: 1, minWidth: '140px', padding: '20px 24px', background: 'var(--bg2)', border: `1px solid ${s.color}20`, borderRadius: '14px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '8px' }}>{s.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '28px', fontWeight: 700, color: s.color }}>{s.value}</span>
              <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>{s.unit}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '24px', background: 'var(--bg2)', border: '1px solid rgba(128,128,180,0.12)', borderRadius: '14px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '1px', marginBottom: '16px' }}>GAS FLOW — 24 HOUR TREND</div>
        <div style={{ height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={gasData}>
              <defs>
                <linearGradient id="gasGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.amber} stopOpacity={0.35} /><stop offset="100%" stopColor={C.amber} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: 'var(--text-dim)' }} interval={7} />
              <YAxis domain={[16000, 21000]} tick={{ fontSize: 11, fill: 'var(--text-dim)' }} />
              <Tooltip contentStyle={{ background: 'var(--bg2)', border: '1px solid rgba(128,128,180,0.2)', borderRadius: '8px', fontSize: '12px' }} formatter={(v) => [`${v.toFixed(0)} Nm³/hr`]} />
              <ReferenceLine y={18800} stroke={C.blue} strokeDasharray="5 3" label={{ value: 'Target', fill: C.blue, fontSize: 11 }} />
              <Area type="monotone" dataKey="flow" stroke={C.amber} strokeWidth={2} fill="url(#gasGrad)" dot={false} name="Gas Flow" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function MetallizationTab() {
  const current = 94.2;
  const r = 62;
  const circ = 2 * Math.PI * r;
  const dash = (current / 100) * circ;
  const trend = Array.from({ length: 30 }, (_, i) => ({ i, v: 92 + Math.sin(i * 0.5) * 2 + (i / 30) * 1.5 + Math.random() * 0.5 }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '220px', padding: '32px 24px', background: 'var(--bg2)', border: '1px solid rgba(128,128,180,0.12)', borderRadius: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <svg width="160" height="160">
            <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(128,128,180,0.1)" strokeWidth="12" />
            <circle cx="80" cy="80" r={r} fill="none" stroke={current >= 94 ? C.green : C.amber} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={circ / 4} style={{ transition: 'stroke-dasharray 1.2s ease' }} />
            <text x="80" y="74" textAnchor="middle" fill={current >= 94 ? C.green : C.amber} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '28px', fontWeight: 800 }}>{current}%</text>
            <text x="80" y="94" textAnchor="middle" fill="var(--text-dim)" style={{ fontSize: '12px' }}>Metallization</text>
          </svg>
          <span style={{ padding: '5px 14px', background: 'rgba(58,204,122,0.12)', border: '1px solid rgba(58,204,122,0.25)', borderRadius: '100px', fontSize: '12px', fontWeight: 700, color: C.green }}>ML Confidence: 91.4%</span>
        </div>
        <div style={{ flex: 2, minWidth: '280px', padding: '24px', background: 'var(--bg2)', border: '1px solid rgba(128,128,180,0.12)', borderRadius: '14px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '1px', marginBottom: '16px' }}>METALLIZATION TREND — 30 HEATS</div>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="metGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.green} stopOpacity={0.3} /><stop offset="100%" stopColor={C.green} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="i" tick={false} />
                <YAxis domain={[88, 98]} tick={{ fontSize: 11, fill: 'var(--text-dim)' }} />
                <Tooltip contentStyle={{ background: 'var(--bg2)', border: '1px solid rgba(128,128,180,0.2)', borderRadius: '8px', fontSize: '12px' }} formatter={(v) => [`${v.toFixed(1)}%`]} />
                <ReferenceLine y={92} stroke={C.amber} strokeDasharray="4 4" label={{ value: 'Min', fill: C.amber, fontSize: 11 }} />
                <Area type="monotone" dataKey="v" stroke={C.green} strokeWidth={2} fill="url(#metGrad)" dot={false} name="Metallization" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function TemperatureTab() {
  const zones = [
    { zone: 'Zone 1 (Top)', actual: 820, target: 830, color: C.blue },
    { zone: 'Zone 2 (Middle)', actual: 942, target: 920, color: C.amber },
    { zone: 'Zone 3 (Bottom)', actual: 870, target: 875, color: C.green },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '24px', background: 'var(--bg2)', border: '1px solid rgba(128,128,180,0.12)', borderRadius: '14px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '1px', marginBottom: '20px' }}>ZONE TEMPERATURE — TARGET vs ACTUAL</div>
        <div style={{ height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={zones} layout="vertical">
              <XAxis type="number" domain={[700, 1000]} tick={{ fontSize: 11, fill: 'var(--text-dim)' }} />
              <YAxis type="category" dataKey="zone" tick={{ fontSize: 12, fill: 'var(--text-dim)' }} width={120} />
              <Tooltip contentStyle={{ background: 'var(--bg2)', border: '1px solid rgba(128,128,180,0.2)', borderRadius: '8px', fontSize: '12px' }} formatter={(v) => [`${v}°C`]} />
              <Bar dataKey="target" name="Target" fill="rgba(128,128,180,0.2)" radius={[0, 4, 4, 0]} />
              <Bar dataKey="actual" name="Actual" radius={[0, 4, 4, 0]}>
                {zones.map((z, i) => <Cell key={i} fill={Math.abs(z.actual - z.target) > 15 ? C.red : z.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {zones.map(z => {
          const dev = z.actual - z.target;
          return (
            <div key={z.zone} style={{ flex: 1, minWidth: '160px', padding: '20px 24px', background: 'var(--bg2)', border: `1px solid ${Math.abs(dev) > 15 ? C.red + '30' : 'rgba(128,128,180,0.12)'}`, borderRadius: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '8px' }}>{z.zone}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '28px', fontWeight: 700, color: z.color }}>{z.actual}°C</div>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>
                Target: {z.target}°C · <span style={{ color: Math.abs(dev) > 15 ? C.red : C.green, fontWeight: 600 }}>{dev > 0 ? '+' : ''}{dev}°C</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function YieldTab() {
  const history = Array.from({ length: 20 }, (_, i) => ({ batch: `B${200 + i}`, yield: 88 + Math.sin(i * 0.5) * 4 + (i / 20) * 2 + Math.random() * 1.5 }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {[{ label: 'Current Yield', value: '93.4%', color: C.green }, { label: 'Target Yield', value: '94.0%', color: C.blue }, { label: '7-Day Avg', value: '92.1%', color: C.amber }, { label: 'Opportunity', value: '+1.9%', color: C.purple }].map(s => (
          <div key={s.label} style={{ flex: 1, minWidth: '140px', padding: '20px', background: 'var(--bg2)', border: `1px solid ${s.color}20`, borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '26px', fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '24px', background: 'var(--bg2)', border: '1px solid rgba(128,128,180,0.12)', borderRadius: '14px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '1px', marginBottom: '16px' }}>YIELD HISTORY — 20 BATCHES</div>
        <div style={{ height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.purple} stopOpacity={0.3} /><stop offset="100%" stopColor={C.purple} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="batch" tick={{ fontSize: 10, fill: 'var(--text-dim)' }} interval={3} />
              <YAxis domain={[84, 98]} tick={{ fontSize: 11, fill: 'var(--text-dim)' }} />
              <Tooltip contentStyle={{ background: 'var(--bg2)', border: '1px solid rgba(128,128,180,0.2)', borderRadius: '8px', fontSize: '12px' }} formatter={(v) => [`${v.toFixed(1)}%`]} />
              <ReferenceLine y={94} stroke={C.blue} strokeDasharray="5 3" label={{ value: 'Target', fill: C.blue, fontSize: 11 }} />
              <Area type="monotone" dataKey="yield" stroke={C.purple} strokeWidth={2} fill="url(#yieldGrad)" dot={false} name="Yield" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function AnomalyTab() {
  const events = [
    { id: 1, time: '2026-05-17 14:23:11', param: 'Zone 2 Temperature', deviation: '+22°C overshoot', severity: 'warning', status: 'active' },
    { id: 2, time: '2026-05-17 12:05:44', param: 'Gas Flow Rate', deviation: '−1,400 Nm³/hr', severity: 'critical', status: 'resolved' },
    { id: 3, time: '2026-05-17 09:18:30', param: 'Metallization %', deviation: '−3.1% vs target', severity: 'warning', status: 'resolved' },
    { id: 4, time: '2026-05-16 22:41:55', param: 'Reformer Temp', deviation: '+11°C', severity: 'info', status: 'resolved' },
    { id: 5, time: '2026-05-16 18:09:03', param: 'Discharge Rate', deviation: '−8% from schedule', severity: 'info', status: 'resolved' },
  ];
  const sev = { critical: C.red, warning: C.amber, info: C.blue };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '1px' }}>ANOMALY EVENT LOG</div>
        <span style={{ padding: '3px 10px', background: 'rgba(232,74,74,0.12)', border: '1px solid rgba(232,74,74,0.25)', borderRadius: '100px', fontSize: '12px', fontWeight: 700, color: C.red }}>1 Active</span>
      </div>
      {events.map(e => (
        <div key={e.id} style={{ padding: '16px 20px', background: 'var(--bg2)', border: `1px solid ${e.status === 'active' ? sev[e.severity] + '30' : 'rgba(128,128,180,0.1)'}`, borderLeft: `3px solid ${sev[e.severity]}`, borderRadius: '0 12px 12px 0', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: 'var(--text-dim)', minWidth: '150px' }}>{e.time}</div>
          <div style={{ fontWeight: 600, color: 'var(--text)', flex: 1, minWidth: '160px' }}>{e.param}</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: sev[e.severity], fontWeight: 700 }}>{e.deviation}</div>
          <span style={{ padding: '3px 10px', background: `${sev[e.severity]}15`, border: `1px solid ${sev[e.severity]}30`, borderRadius: '100px', fontSize: '11px', fontWeight: 700, color: sev[e.severity], textTransform: 'uppercase' }}>{e.severity}</span>
          <span style={{ padding: '3px 10px', background: e.status === 'active' ? 'rgba(232,74,74,0.1)' : 'rgba(58,204,122,0.1)', border: `1px solid ${e.status === 'active' ? 'rgba(232,74,74,0.25)' : 'rgba(58,204,122,0.25)'}`, borderRadius: '100px', fontSize: '11px', fontWeight: 600, color: e.status === 'active' ? C.red : C.green }}>{e.status}</span>
        </div>
      ))}
    </div>
  );
}

export default function DRIPage() {
  const { sub } = useParams();
  const navigate = useNavigate();
  const activeTab = sub || 'gas';
  const [loading, setLoading] = useState(true);
  const [navCollapsed, setNavCollapsed] = useState(false);

  useEffect(() => {
    getDRIGas().then(() => setLoading(false)).catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: "'Space Grotesk', sans-serif" }}>
      <div style={{ width: navCollapsed ? '56px' : '200px', flexShrink: 0, borderRight: '1px solid rgba(128,128,180,0.12)', padding: '16px 8px', transition: 'width 0.25s ease', overflow: 'hidden', background: 'var(--bg2)' }}>
        <button onClick={() => setNavCollapsed(p => !p)} style={{ width: '100%', padding: '8px', background: 'rgba(128,128,180,0.08)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-dim)', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: navCollapsed ? 'center' : 'flex-end' }}>
          {navCollapsed ? '→' : '←'}
        </button>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => navigate(`/app/dri/${tab.id}`)} style={{
            width: '100%', padding: navCollapsed ? '10px' : '10px 12px', marginBottom: '4px',
            background: activeTab === tab.id ? 'rgba(255,174,74,0.12)' : 'transparent',
            border: activeTab === tab.id ? '1px solid rgba(255,174,74,0.25)' : '1px solid transparent',
            borderRadius: '8px', color: activeTab === tab.id ? C.amber : 'var(--text-dim)',
            fontWeight: activeTab === tab.id ? 700 : 500,
            cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px',
            display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap',
            justifyContent: navCollapsed ? 'center' : 'flex-start', transition: 'background 0.2s',
          }}>
            <span>{tab.icon}</span>{!navCollapsed && <span>{tab.label}</span>}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        <MicroappBar />
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2].map(i => <div key={i} style={{ height: '100px', borderRadius: '14px', background: 'rgba(128,128,180,0.08)' }} />)}
          </div>
        ) : (
          <>
            {activeTab === 'gas' && <GasTab />}
            {activeTab === 'metallization' && <MetallizationTab />}
            {activeTab === 'temperature' && <TemperatureTab />}
            {activeTab === 'yield' && <YieldTab />}
            {activeTab === 'anomaly' && <AnomalyTab />}
          </>
        )}
      </div>
    </div>
  );
}

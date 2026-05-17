import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { getEAFEnergy } from '../../api/analytics.js';

const C = { blue: '#3a78ff', amber: '#ffae4a', green: '#3acc7a', purple: '#a060ff', red: '#e84a4a' };

const TABS = [
  { id: 'energy', label: 'Energy Optimization', icon: '⚡' },
  { id: 'arc', label: 'Arc Stability', icon: '🌡' },
  { id: 'charge', label: 'Charge Mix', icon: '⚖️' },
  { id: 'tap', label: 'Tap-to-Tap', icon: '⏱' },
  { id: 'maintenance', label: 'Predictive Maintenance', icon: '🔧' },
];

function MicroappBar() {
  return (
    <div style={{ padding: '10px 20px', background: 'rgba(58,120,255,0.08)', border: '1px solid rgba(58,120,255,0.2)', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '12px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
      <span style={{ color: C.blue, fontWeight: 800 }}>EAF Suite</span>
      <span style={{ color: 'var(--text-dim)' }}>v2.1.0 · Zealogics</span>
      {[['IBA', '12 tags'], ['L2', '5 channels']].map(([k, v]) => (
        <span key={k} style={{ padding: '3px 8px', background: 'rgba(128,128,180,0.12)', borderRadius: '6px', color: 'var(--text-dim)' }}>{k}: {v}</span>
      ))}
      <span style={{ marginLeft: 'auto', color: C.blue }}>Health: <b>94%</b></span>
    </div>
  );
}

function EnergyTab() {
  const heats = Array.from({ length: 20 }, (_, i) => ({ heat: `H${1830 + i}`, kwh: 400 + Math.sin(i * 0.6) * 25 + Math.random() * 15, target: 408 }));
  const currentKwh = 412;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: '280px', padding: '24px', background: 'var(--bg2)', border: '1px solid rgba(128,128,180,0.12)', borderRadius: '14px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '1px', marginBottom: '16px' }}>POWER CURVE — LAST 20 HEATS</div>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={heats}>
                <defs>
                  <linearGradient id="eafGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.blue} stopOpacity={0.35} /><stop offset="100%" stopColor={C.blue} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="heat" tick={{ fontSize: 10, fill: 'var(--text-dim)' }} interval={4} />
                <YAxis domain={[370, 450]} tick={{ fontSize: 11, fill: 'var(--text-dim)' }} />
                <Tooltip contentStyle={{ background: 'var(--bg2)', border: '1px solid rgba(128,128,180,0.2)', borderRadius: '8px', fontSize: '12px' }} formatter={(v) => [`${v.toFixed(1)} kWh/t`]} />
                <Area type="monotone" dataKey="kwh" stroke={C.blue} strokeWidth={2} fill="url(#eafGrad)" dot={false} name="kWh/t" />
                <Line type="monotone" dataKey="target" stroke={C.amber} strokeWidth={1.5} strokeDasharray="5 3" dot={false} name="Target" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: '200px', padding: '24px', background: 'var(--bg2)', border: '1px solid rgba(128,128,180,0.12)', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '1px' }}>EAF kWh/ton</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '52px', fontWeight: 800, color: currentKwh > 420 ? C.red : currentKwh > 410 ? C.amber : C.green, lineHeight: 1 }}>{currentKwh}</div>
            <div style={{ fontSize: '14px', color: 'var(--text-dim)', marginTop: '4px' }}>kWh/t</div>
          </div>
          <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(128,128,180,0.12)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(currentKwh / 450) * 100}%`, background: `linear-gradient(90deg, ${C.green}, ${C.amber}, ${C.red})`, borderRadius: '4px' }} />
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-dim)', textAlign: 'center' }}>Target: 408 kWh/t · Savings: 19 kWh/hr</div>
        </div>
      </div>
    </div>
  );
}

function ArcTab() {
  const phases = [
    { phase: 'A', voltage: 892, stability: 97.2, electrode: 82, color: C.blue },
    { phase: 'B', voltage: 887, stability: 95.8, electrode: 78, color: C.purple },
    { phase: 'C', voltage: 901, stability: 98.1, electrode: 85, color: C.green },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {phases.map(p => (
          <div key={p.phase} style={{ flex: 1, minWidth: '180px', padding: '24px', background: 'var(--bg2)', border: `1px solid ${p.color}25`, borderRadius: '14px', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${p.color}18`, border: `1.5px solid ${p.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '20px', color: p.color, margin: '0 auto 16px' }}>Φ{p.phase}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '28px', fontWeight: 700, color: p.color }}>{p.voltage}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '12px' }}>Volts</div>
            <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(128,128,180,0.12)', overflow: 'hidden', marginBottom: '8px' }}>
              <div style={{ height: '100%', width: `${p.stability}%`, background: p.color, borderRadius: '3px' }} />
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '16px', fontWeight: 700, color: p.color }}>{p.stability}%</div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '8px' }}>Electrode: {p.electrode}mm</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '20px 24px', background: 'var(--bg2)', border: '1px solid rgba(128,128,180,0.12)', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dim)' }}>OVERALL ARC STABILITY</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '32px', fontWeight: 800, color: C.green }}>97.3%</div>
        <div style={{ flex: 1, height: '10px', borderRadius: '5px', background: 'rgba(128,128,180,0.12)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '97.3%', background: `linear-gradient(90deg, ${C.blue}, ${C.green})`, borderRadius: '5px' }} />
        </div>
        <span style={{ padding: '4px 12px', background: 'rgba(58,204,122,0.12)', border: '1px solid rgba(58,204,122,0.25)', borderRadius: '100px', fontSize: '12px', fontWeight: 700, color: C.green }}>STABLE</span>
      </div>
    </div>
  );
}

function ChargeTab() {
  const composition = [
    { name: 'Scrap', value: 45, color: C.blue },
    { name: 'DRI', value: 35, color: C.amber },
    { name: 'Lime', value: 12, color: C.green },
    { name: 'Carbon', value: 8, color: C.purple },
  ];

  return (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '260px', padding: '24px', background: 'var(--bg2)', border: '1px solid rgba(128,128,180,0.12)', borderRadius: '14px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '1px', marginBottom: '16px' }}>CHARGE COMPOSITION</div>
        <div style={{ height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={composition} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                {composition.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg2)', border: '1px solid rgba(128,128,180,0.2)', borderRadius: '8px', fontSize: '12px' }} formatter={(v) => [`${v}%`]} />
              <Legend formatter={(v) => <span style={{ color: 'var(--text-dim)', fontSize: '12px' }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: '240px', padding: '24px', background: 'var(--bg2)', border: '1px solid rgba(58,120,255,0.15)', borderRadius: '14px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '1px', marginBottom: '16px' }}>AI CHARGE ADVISORY</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { text: 'Increase DRI ratio to 38% for target metallization ≥94%', type: 'suggest' },
            { text: 'Carbon addition optimal at current 8% for slag basicity 2.1', type: 'ok' },
            { text: 'Lime addition may be reduced by 1.5t given low sulfur input', type: 'suggest' },
            { text: 'Scrap grade B detected — monitor phosphorus closely', type: 'warn' },
          ].map((item, i) => (
            <div key={i} style={{
              padding: '10px 14px',
              background: item.type === 'warn' ? 'rgba(255,174,74,0.08)' : item.type === 'suggest' ? 'rgba(58,120,255,0.08)' : 'rgba(58,204,122,0.08)',
              border: `1px solid ${item.type === 'warn' ? 'rgba(255,174,74,0.2)' : item.type === 'suggest' ? 'rgba(58,120,255,0.2)' : 'rgba(58,204,122,0.2)'}`,
              borderRadius: '8px', fontSize: '13px',
              color: item.type === 'warn' ? C.amber : item.type === 'suggest' ? C.blue : C.green,
            }}>
              {item.type === 'warn' ? '⚠️' : item.type === 'suggest' ? '💡' : '✅'} {item.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TapTab() {
  const phases = [
    { name: 'Charging', start: 0, dur: 12, color: C.blue },
    { name: 'Melting', start: 12, dur: 18, color: C.amber },
    { name: 'Refining', start: 30, dur: 14, color: C.purple },
    { name: 'Tapping', start: 44, dur: 8, color: C.green },
  ];
  const total = 58; const now = 36;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '24px', background: 'var(--bg2)', border: '1px solid rgba(128,128,180,0.12)', borderRadius: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '1px' }}>HEAT #1848 — TAP-TO-TAP TIMELINE</div>
          <div style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', fontWeight: 700, color: C.amber }}>{now}/{total} min</div>
        </div>
        <div style={{ position: 'relative', height: '56px' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '8px', background: 'rgba(128,128,180,0.08)', overflow: 'hidden' }}>
            {phases.map(p => (
              <div key={p.name} style={{ position: 'absolute', left: `${(p.start / total) * 100}%`, width: `${(p.dur / total) * 100}%`, top: 0, bottom: 0, background: `${p.color}30`, borderRight: `1px solid ${p.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: p.color, whiteSpace: 'nowrap' }}>{p.name}</span>
              </div>
            ))}
            <div style={{ position: 'absolute', left: `${(now / total) * 100}%`, top: 0, bottom: 0, width: '2px', background: '#fff', boxShadow: '0 0 8px rgba(255,255,255,0.5)' }} />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {[{ label: 'Current Heat', value: `${now}m`, color: C.amber }, { label: 'Target T2T', value: '58m', color: C.blue }, { label: 'Last 5 Avg', value: '60.4m', color: 'var(--text)' }, { label: 'Improvement', value: '↓8%', color: C.green }].map(s => (
          <div key={s.label} style={{ flex: 1, minWidth: '120px', padding: '20px', background: 'var(--bg2)', border: '1px solid rgba(128,128,180,0.12)', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MaintenanceTab() {
  const items = [
    { name: 'Electrode A', wear: 34, nextService: '2026-05-22', color: C.blue },
    { name: 'Electrode B', wear: 61, nextService: '2026-05-19', color: C.amber },
    { name: 'Electrode C', wear: 28, nextService: '2026-05-24', color: C.green },
    { name: 'Transformer', wear: 68, nextService: '2026-06-15', color: C.purple, label: 'Temp %' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {items.map(item => {
        const critical = item.wear > 60;
        return (
          <div key={item.name} style={{ padding: '20px 24px', background: 'var(--bg2)', border: `1px solid ${critical ? C.red + '25' : 'rgba(128,128,180,0.12)'}`, borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ minWidth: '130px' }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '14px' }}>{item.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '2px' }}>Next: {item.nextService}</div>
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{item.label || 'Wear'}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontWeight: 700, color: critical ? C.red : item.wear > 50 ? C.amber : C.green }}>{item.wear}%</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(128,128,180,0.1)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${item.wear}%`, background: critical ? C.red : item.wear > 50 ? C.amber : C.green, borderRadius: '4px', transition: 'width 1s' }} />
              </div>
            </div>
            <span style={{ padding: '5px 12px', background: critical ? 'rgba(232,74,74,0.12)' : 'rgba(58,204,122,0.1)', border: `1px solid ${critical ? 'rgba(232,74,74,0.25)' : 'rgba(58,204,122,0.25)'}`, borderRadius: '100px', fontSize: '12px', fontWeight: 700, color: critical ? C.red : C.green }}>
              {critical ? 'SERVICE SOON' : 'NOMINAL'}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function EAFPage() {
  const { sub } = useParams();
  const navigate = useNavigate();
  const activeTab = sub || 'energy';
  const [loading, setLoading] = useState(true);
  const [navCollapsed, setNavCollapsed] = useState(false);

  useEffect(() => {
    getEAFEnergy().then(() => setLoading(false)).catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: "'Space Grotesk', sans-serif" }}>
      <div style={{ width: navCollapsed ? '56px' : '200px', flexShrink: 0, borderRight: '1px solid rgba(128,128,180,0.12)', padding: '16px 8px', transition: 'width 0.25s ease', overflow: 'hidden', background: 'var(--bg2)' }}>
        <button onClick={() => setNavCollapsed(p => !p)} style={{ width: '100%', padding: '8px', background: 'rgba(128,128,180,0.08)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-dim)', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: navCollapsed ? 'center' : 'flex-end' }}>
          {navCollapsed ? '→' : '←'}
        </button>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => navigate(`/app/eaf/${tab.id}`)} style={{
            width: '100%', padding: navCollapsed ? '10px' : '10px 12px', marginBottom: '4px',
            background: activeTab === tab.id ? 'rgba(58,120,255,0.12)' : 'transparent',
            border: activeTab === tab.id ? '1px solid rgba(58,120,255,0.25)' : '1px solid transparent',
            borderRadius: '8px', color: activeTab === tab.id ? C.blue : 'var(--text-dim)',
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
            {[1, 2].map(i => <div key={i} style={{ height: '100px', background: 'rgba(128,128,180,0.08)', borderRadius: '14px' }} />)}
          </div>
        ) : (
          <>
            {activeTab === 'energy' && <EnergyTab />}
            {activeTab === 'arc' && <ArcTab />}
            {activeTab === 'charge' && <ChargeTab />}
            {activeTab === 'tap' && <TapTab />}
            {activeTab === 'maintenance' && <MaintenanceTab />}
          </>
        )}
      </div>
    </div>
  );
}

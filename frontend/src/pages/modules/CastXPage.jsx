import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { getCastXSnapshot } from '../../api/analytics.js';

const C = { blue: '#3a78ff', amber: '#ffae4a', green: '#3acc7a', purple: '#a060ff', red: '#e84a4a' };

const TABS = [
  { id: 'snapshot', label: 'Snapshot', icon: '📊' },
  { id: 'outliers', label: 'Outlier Detection', icon: '🔍' },
  { id: 'defects', label: 'Defect Prediction', icon: '⚠️' },
  { id: 'nlp', label: 'NLP Analytics', icon: '💬' },
  { id: 'timeseries', label: 'Time-Series Forecast', icon: '📈' },
];

const NLP_PROMPTS = [
  'What caused the mould level spike on Strand 2?',
  'Show defect trend for last 24 hours',
  'Which strand has highest breakout risk?',
  'Summarize current cast quality score',
  'When was the last web crack detected?',
  'Recommend actions for shell thickness deviation',
];

function Skeleton({ w = '100%', h = 20, r = 8 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: 'linear-gradient(90deg, rgba(128,128,180,0.08) 25%, rgba(128,128,180,0.18) 50%, rgba(128,128,180,0.08) 75%)',
      backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite',
    }} />
  );
}

function ArcGauge({ value, max = 100, label, color, unit = '' }) {
  const pct = Math.min(value / max, 1);
  const r = 42;
  const circ = Math.PI * r;
  const dash = pct * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <svg width="110" height="70" viewBox="0 0 110 70">
        <path d="M 14 64 A 42 42 0 0 1 96 64" fill="none" stroke="rgba(128,128,180,0.15)" strokeWidth="10" strokeLinecap="round" />
        <path d="M 14 64 A 42 42 0 0 1 96 64" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${dash} ${circ - dash}`}
          style={{ transition: 'stroke-dasharray 1s ease' }} />
        <text x="55" y="58" textAnchor="middle" fill={color}
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '16px', fontWeight: 700 }}>
          {value}{unit}
        </text>
      </svg>
      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)' }}>{label}</span>
    </div>
  );
}

function MicroappBar() {
  return (
    <div style={{
      padding: '10px 20px', background: 'rgba(58,204,122,0.08)',
      border: '1px solid rgba(58,204,122,0.2)', borderRadius: '10px', marginBottom: '20px',
      display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
      fontSize: '12px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
    }}>
      <span style={{ color: C.green, fontWeight: 800 }}>CastX</span>
      <span style={{ color: 'var(--text-dim)' }}>v2.4.1 · Zealogics</span>
      {[['IBA', '12 tags'], ['L2', '5 channels']].map(([k, v]) => (
        <span key={k} style={{ padding: '3px 8px', background: 'rgba(128,128,180,0.12)', borderRadius: '6px', color: 'var(--text-dim)' }}>{k}: {v}</span>
      ))}
      <span style={{ marginLeft: 'auto', color: C.green }}>Health: <b>98%</b></span>
    </div>
  );
}

function SnapshotTab({ data }) {
  const strands = [
    { id: 'S1', castSpeed: 1.42, mouldLevel: 82, oilFlow: 0.31, shellThickness: 18.2, mouldDeltaT: 12.4, color: C.blue },
    { id: 'S2', castSpeed: 1.38, mouldLevel: 76, oilFlow: 0.28, shellThickness: 17.8, mouldDeltaT: 13.1, color: C.purple },
    { id: 'S3', castSpeed: 1.45, mouldLevel: 88, oilFlow: 0.33, shellThickness: 18.6, mouldDeltaT: 11.9, color: C.green },
  ];
  const tundishTemp = data?.tundish_temp || 1562;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '24px', background: 'var(--bg2)', border: '1px solid rgba(128,128,180,0.12)', borderRadius: '14px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '1px', marginBottom: '20px' }}>STRAND GAUGES — CAST SPEED & MOULD LEVEL</div>
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'space-around' }}>
          {strands.map(s => (
            <div key={s.id} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: s.color, marginBottom: '12px' }}>{s.id}</div>
              <div style={{ display: 'flex', gap: '24px' }}>
                <ArcGauge value={s.castSpeed} max={2} label="Cast Speed" color={s.color} />
                <ArcGauge value={s.mouldLevel} max={100} label="Mould Level" color={s.color} unit="%" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '24px', background: 'var(--bg2)', border: '1px solid rgba(128,128,180,0.12)', borderRadius: '14px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '1px', marginBottom: '16px' }}>TUNDISH TEMPERATURE</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '36px', fontWeight: 700, color: tundishTemp > 1580 ? C.red : tundishTemp < 1540 ? C.amber : C.green }}>{tundishTemp}°C</div>
          <div style={{ flex: 1, height: '12px', borderRadius: '6px', background: 'rgba(128,128,180,0.1)', overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: '100%', width: `${((tundishTemp - 1500) / 120) * 100}%`, background: `linear-gradient(90deg, ${C.blue}, ${tundishTemp > 1570 ? C.red : C.green})`, borderRadius: '6px', transition: 'width 1s' }} />
          </div>
          <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>Target: 1550–1570°C</span>
        </div>
      </div>
      <div style={{ padding: '24px', background: 'var(--bg2)', border: '1px solid rgba(128,128,180,0.12)', borderRadius: '14px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '1px', marginBottom: '16px' }}>PARAMETER GRID</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr>{['Strand', 'Oil Flow (L/min)', 'Shell Thickness (mm)', 'Mould ΔT (°C)'].map(h => (
              <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: 600, borderBottom: '1px solid rgba(128,128,180,0.12)' }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {strands.map((s, i) => (
              <tr key={s.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(128,128,180,0.04)' }}>
                <td style={{ padding: '10px 12px', fontWeight: 700, color: s.color }}>{s.id}</td>
                <td style={{ padding: '10px 12px', fontFamily: "'JetBrains Mono', monospace" }}>{s.oilFlow}</td>
                <td style={{ padding: '10px 12px', fontFamily: "'JetBrains Mono', monospace" }}>{s.shellThickness}</td>
                <td style={{ padding: '10px 12px', fontFamily: "'JetBrains Mono', monospace", color: s.mouldDeltaT > 13 ? C.amber : 'var(--text)' }}>{s.mouldDeltaT}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OutliersTab() {
  const mouldData = Array.from({ length: 60 }, (_, i) => ({
    t: i, S1: 80 + Math.sin(i * 0.3) * 5 + Math.random() * 3,
    S2: 75 + Math.sin(i * 0.25 + 1) * 6 + Math.random() * 3,
    S3: 85 + Math.sin(i * 0.35 + 2) * 4 + Math.random() * 2,
    anomaly: (i === 18 || i === 42) ? 60 : null,
  }));

  const rootCauses = [
    { time: '14:23:18', strand: 'S2', param: 'Mould Level', deviation: '-18%', cause: 'Stopper rod oscillation', severity: 'warning' },
    { time: '13:47:02', strand: 'S1', param: 'Cast Speed', deviation: '+12%', cause: 'Withdrawal roll speed variance', severity: 'info' },
    { time: '12:55:44', strand: 'S3', param: 'Mould ΔT', deviation: '+2.4°C', cause: 'Cooling water flow reduction', severity: 'critical' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '24px', background: 'var(--bg2)', border: '1px solid rgba(128,128,180,0.12)', borderRadius: '14px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '1px', marginBottom: '16px' }}>MOULD LEVEL — ANOMALY TIMELINE</div>
        <div style={{ height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mouldData}>
              <XAxis dataKey="t" tick={false} axisLine={false} />
              <YAxis domain={[55, 100]} tick={{ fontSize: 11, fill: 'var(--text-dim)' }} />
              <Tooltip contentStyle={{ background: 'var(--bg2)', border: '1px solid rgba(128,128,180,0.2)', borderRadius: '8px', fontSize: '12px' }} />
              <ReferenceLine y={70} stroke={C.amber} strokeDasharray="4 4" />
              <ReferenceLine y={95} stroke={C.amber} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="S1" stroke={C.blue} strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="S2" stroke={C.purple} strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="S3" stroke={C.green} strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="anomaly" stroke={C.red} strokeWidth={0} dot={{ r: 6, fill: C.red, stroke: '#fff', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ padding: '24px', background: 'var(--bg2)', border: '1px solid rgba(128,128,180,0.12)', borderRadius: '14px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '1px', marginBottom: '16px' }}>ROOT CAUSE ANALYSIS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {rootCauses.map((rc, i) => (
            <div key={i} style={{
              padding: '14px 16px',
              borderLeft: `3px solid ${rc.severity === 'critical' ? C.red : rc.severity === 'warning' ? C.amber : C.blue}`,
              background: `${rc.severity === 'critical' ? C.red : rc.severity === 'warning' ? C.amber : C.blue}08`,
              borderRadius: '0 10px 10px 0',
              display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap',
            }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: 'var(--text-dim)' }}>{rc.time}</span>
              <span style={{ fontWeight: 700, fontSize: '13px', color: rc.severity === 'critical' ? C.red : rc.severity === 'warning' ? C.amber : C.blue }}>{rc.strand}</span>
              <span style={{ fontSize: '13px', color: 'var(--text)' }}>{rc.param}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: C.red, fontWeight: 700 }}>{rc.deviation}</span>
              <span style={{ fontSize: '13px', color: 'var(--text-dim)', flex: 1 }}>→ {rc.cause}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DefectTab() {
  const defects = [
    { label: 'Web Cracks', S1: 12, S2: 28, S3: 8, color: C.red },
    { label: 'Seams', S1: 5, S2: 15, S3: 6, color: C.amber },
    { label: 'Surface Defects', S1: 18, S2: 22, S3: 11, color: C.purple },
    { label: 'Internal Defects', S1: 3, S2: 9, S3: 4, color: C.blue },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {['S1', 'S2', 'S3'].map((strand, si) => (
        <div key={strand} style={{ padding: '24px', background: 'var(--bg2)', border: '1px solid rgba(128,128,180,0.12)', borderRadius: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: [C.blue, C.purple, C.green][si], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', color: '#fff' }}>{strand}</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>Defect Risk Profile</div>
            <div style={{ marginLeft: 'auto' }}>
              <span style={{ padding: '4px 12px', background: 'rgba(58,204,122,0.12)', border: '1px solid rgba(58,204,122,0.25)', borderRadius: '100px', fontSize: '12px', fontWeight: 700, color: C.green }}>ML Confidence: {[92, 87, 95][si]}%</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {defects.map(d => {
              const val = d[strand];
              return (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-dim)', width: '130px', flexShrink: 0 }}>{d.label}</span>
                  <div style={{ flex: 1, height: '8px', borderRadius: '4px', background: 'rgba(128,128,180,0.1)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${val}%`, background: d.color, borderRadius: '4px', transition: 'width 1s' }} />
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 700, color: val > 20 ? C.red : val > 12 ? C.amber : C.green, width: '40px', textAlign: 'right', flexShrink: 0 }}>{val}%</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div style={{ padding: '14px 20px', background: 'rgba(58,120,255,0.06)', border: '1px solid rgba(58,120,255,0.15)', borderRadius: '10px', fontSize: '13px', color: 'var(--text-dim)' }}>
        Model: LSTM-Defect v3.1 · Trained on 2.4M heats · Last updated 2026-05-10 · P99 inference: 48ms
      </div>
    </div>
  );
}

function NLPTab() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuery = async (q) => {
    setQuery(q); setLoading(true); setResponse('');
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setResponse(`**Analysis Complete**\n\nBased on current process data:\n\n• Strand 2 Mould Level shows ±4.2mm variance over the last 30 minutes, exceeding the 3mm threshold.\n\n• Root Cause: L2 PLC cycle time increased to 450ms (normal: 200ms) at 14:23 UTC.\n\n• Recommendation: Check L2 communication latency and reduce stopper response gain from 0.8 to 0.6.\n\nConfidence: 94.2%`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', gap: '12px' }}>
        <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && query && handleQuery(query)}
          placeholder="Ask about CastX process data, defects, or anomalies..."
          style={{ flex: 1, padding: '12px 16px', background: 'var(--bg2)', border: '1.5px solid rgba(128,128,180,0.2)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', fontFamily: "'Space Grotesk', sans-serif", outline: 'none' }} />
        <button onClick={() => query && handleQuery(query)} style={{ padding: '12px 24px', background: C.blue, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>Analyze</button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {NLP_PROMPTS.map(p => (
          <button key={p} onClick={() => handleQuery(p)} style={{ padding: '7px 14px', background: 'rgba(58,120,255,0.08)', border: '1px solid rgba(58,120,255,0.2)', borderRadius: '100px', color: C.blue, fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif" }}>{p}</button>
        ))}
      </div>
      {loading && <div style={{ padding: '24px', background: 'var(--bg2)', border: '1px solid rgba(128,128,180,0.12)', borderRadius: '14px' }}><Skeleton h={16} r={6} /></div>}
      {response && !loading && (
        <div style={{ padding: '24px', background: 'var(--bg2)', border: '1px solid rgba(58,120,255,0.2)', borderRadius: '14px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: C.blue, letterSpacing: '1px', marginBottom: '12px' }}>AI ANALYSIS — CastX NLP</div>
          <div style={{ fontSize: '14px', color: 'var(--text)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{response}</div>
        </div>
      )}
    </div>
  );
}

function TimeSeriesTab() {
  const [horizon, setHorizon] = useState('30m');
  const data = Array.from({ length: 40 }, (_, i) => ({
    t: i,
    actualS1: i < 25 ? 1.40 + Math.sin(i * 0.4) * 0.08 + Math.random() * 0.04 : null,
    actualS2: i < 25 ? 1.37 + Math.sin(i * 0.35) * 0.06 + Math.random() * 0.03 : null,
    predS1: i >= 20 ? 1.42 + Math.sin(i * 0.4) * 0.06 : null,
    predS2: i >= 20 ? 1.38 + Math.sin(i * 0.35) * 0.05 : null,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-dim)', fontWeight: 600 }}>Forecast Horizon:</span>
        {['15m', '30m', '1h', '4h'].map(h => (
          <button key={h} onClick={() => setHorizon(h)} style={{
            padding: '6px 14px',
            background: horizon === h ? C.blue : 'rgba(128,128,180,0.1)',
            color: horizon === h ? '#fff' : 'var(--text-dim)',
            border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif",
          }}>{h}</button>
        ))}
      </div>
      <div style={{ padding: '24px', background: 'var(--bg2)', border: '1px solid rgba(128,128,180,0.12)', borderRadius: '14px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '1px', marginBottom: '16px' }}>CAST SPEED — ACTUAL vs PREDICTED ({horizon} horizon)</div>
        <div style={{ height: '260px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="gS1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.blue} stopOpacity={0.3} /><stop offset="100%" stopColor={C.blue} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gS2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.purple} stopOpacity={0.25} /><stop offset="100%" stopColor={C.purple} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="t" tick={false} axisLine={false} />
              <YAxis domain={[1.2, 1.6]} tick={{ fontSize: 11, fill: 'var(--text-dim)' }} />
              <Tooltip contentStyle={{ background: 'var(--bg2)', border: '1px solid rgba(128,128,180,0.2)', borderRadius: '8px', fontSize: '12px' }} />
              <ReferenceLine x={24} stroke="rgba(128,128,180,0.4)" strokeDasharray="4 4" label={{ value: 'Now', fill: 'var(--text-dim)', fontSize: 11 }} />
              <Area type="monotone" dataKey="actualS1" stroke={C.blue} strokeWidth={2} fill="url(#gS1)" dot={false} name="S1 Actual" />
              <Area type="monotone" dataKey="actualS2" stroke={C.purple} strokeWidth={2} fill="url(#gS2)" dot={false} name="S2 Actual" />
              <Area type="monotone" dataKey="predS1" stroke={C.blue} strokeWidth={2} strokeDasharray="6 3" fill="none" dot={false} name="S1 Forecast" />
              <Area type="monotone" dataKey="predS2" stroke={C.purple} strokeWidth={2} strokeDasharray="6 3" fill="none" dot={false} name="S2 Forecast" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default function CastXPage() {
  const { sub } = useParams();
  const navigate = useNavigate();
  const activeTab = sub || 'snapshot';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [navCollapsed, setNavCollapsed] = useState(false);

  useEffect(() => {
    getCastXSnapshot().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: "'Space Grotesk', sans-serif" }}>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
      <div style={{ width: navCollapsed ? '56px' : '200px', flexShrink: 0, borderRight: '1px solid rgba(128,128,180,0.12)', padding: '16px 8px', transition: 'width 0.25s ease', overflow: 'hidden', background: 'var(--bg2)' }}>
        <button onClick={() => setNavCollapsed(p => !p)} style={{ width: '100%', padding: '8px', background: 'rgba(128,128,180,0.08)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-dim)', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: navCollapsed ? 'center' : 'flex-end' }}>
          {navCollapsed ? '→' : '←'}
        </button>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => navigate(`/app/castx/${tab.id}`)} style={{
            width: '100%', padding: navCollapsed ? '10px' : '10px 12px', marginBottom: '4px',
            background: activeTab === tab.id ? 'rgba(58,204,122,0.12)' : 'transparent',
            border: activeTab === tab.id ? '1px solid rgba(58,204,122,0.25)' : '1px solid transparent',
            borderRadius: '8px', color: activeTab === tab.id ? C.green : 'var(--text-dim)',
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
            {[1, 2, 3].map(i => <Skeleton key={i} h={80} r={12} />)}
          </div>
        ) : (
          <>
            {activeTab === 'snapshot' && <SnapshotTab data={data} />}
            {activeTab === 'outliers' && <OutliersTab />}
            {activeTab === 'defects' && <DefectTab />}
            {activeTab === 'nlp' && <NLPTab />}
            {activeTab === 'timeseries' && <TimeSeriesTab />}
          </>
        )}
      </div>
    </div>
  );
}

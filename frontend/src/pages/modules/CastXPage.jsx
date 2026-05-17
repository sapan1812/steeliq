import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { getCastXSnapshot } from '../../api/analytics.js';

const C = { blue: '#3a78ff', amber: '#ffae4a', green: '#3acc7a', purple: '#a060ff', red: '#e84a4a' };
const MODULE_COLOR = C.blue;
const MODULE_COLOR_LO = 'rgba(50,110,255,0.12)';

const TABS = [
  { id: 'snapshot', label: 'Snapshot' },
  { id: 'outliers', label: 'Outlier Detection' },
  { id: 'defects', label: 'Defect Prediction' },
  { id: 'nlp', label: 'NLP Analytics' },
  { id: 'timeseries', label: 'Time-Series' },
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
      <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-dim)' }}>{label}</span>
    </div>
  );
}

function MicroappBar() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '14px',
      padding: '9px 20px',
      background: 'linear-gradient(90deg, rgba(50,110,255,0.06), rgba(50,110,255,0.02) 60%, transparent)',
      borderBottom: '1px solid var(--border)',
      flexShrink: 0,
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 7, background: MODULE_COLOR_LO,
        border: `1px solid ${MODULE_COLOR}`, color: MODULE_COLOR,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: 13,
      }}>Q</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ fontSize: 13, fontWeight: 700 }}>CastX</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-dim)', padding: '1px 5px', borderRadius: 3, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>v2.4.1</span>
      </div>
      <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>Zealogics</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--mono)', fontSize: '9.5px', fontWeight: 600, padding: '3px 9px', borderRadius: 11, background: 'rgba(50,110,255,0.08)', border: '1px solid rgba(50,110,255,0.22)', color: 'var(--blue)' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', animation: 'pgn 2s infinite' }} />
          IBA · 12 tags
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--mono)', fontSize: '9.5px', fontWeight: 600, padding: '3px 9px', borderRadius: 11, background: 'rgba(160,80,255,0.08)', border: '1px solid rgba(160,80,255,0.22)', color: 'var(--purple)' }}>
          L2 · 5 ch
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--mono)', fontSize: '9.5px', fontWeight: 600, padding: '3px 9px', borderRadius: 11, background: 'rgba(50,200,110,0.08)', border: '1px solid rgba(50,200,110,0.22)', color: 'var(--green)' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', animation: 'pgn 2s infinite' }} />
          Health: 98%
        </div>
      </div>
    </div>
  );
}

function TabBar({ active, setActive }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border)',
      padding: '0 20px', height: '40px', background: 'var(--tabs-bg)',
      overflowX: 'auto', gap: 0, flexShrink: 0,
    }}>
      {TABS.map(tab => (
        <button key={tab.id} onClick={() => setActive(tab.id)} style={{
          padding: '0 13px', height: '100%', fontSize: '11px', fontWeight: 500,
          color: active === tab.id ? MODULE_COLOR : 'var(--text-dim)',
          borderBottom: active === tab.id ? `2px solid ${MODULE_COLOR}` : '2px solid transparent',
          background: 'none', border: 'none',
          cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'var(--sans)',
          transition: 'all 0.18s',
        }}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function Card({ title, badge, badgeStyle, children, style }) {
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--card-shadow)', ...style }}>
      {title && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 15px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 7 }}>
            {badge && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, padding: '2px 6px', borderRadius: 3, textTransform: 'uppercase', background: 'rgba(50,110,255,0.1)', color: MODULE_COLOR, border: '1px solid rgba(50,110,255,0.22)', ...badgeStyle }}>{badge}</span>}
            {title}
          </div>
        </div>
      )}
      <div style={{ padding: 14 }}>{children}</div>
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
    <>
      <Card title="STRAND GAUGES — CAST SPEED & MOULD LEVEL" badge="LIVE">
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'space-around', paddingTop: 8 }}>
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
      </Card>
      <Card title="TUNDISH TEMPERATURE" badge="REAL-TIME">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: 4 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '36px', fontWeight: 700, color: tundishTemp > 1580 ? C.red : tundishTemp < 1540 ? C.amber : C.green }}>{tundishTemp}°C</div>
          <div style={{ flex: 1, height: '12px', borderRadius: '6px', background: 'var(--surface-2)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${((tundishTemp - 1500) / 120) * 100}%`, background: `linear-gradient(90deg, ${C.blue}, ${tundishTemp > 1570 ? C.red : C.green})`, borderRadius: '6px', transition: 'width 1s' }} />
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>Target: 1550–1570°C</span>
        </div>
      </Card>
      <Card title="PARAMETER GRID" badge="STRANDS">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr>{['Strand', 'Oil Flow (L/min)', 'Shell Thickness (mm)', 'Mould ΔT (°C)'].map(h => (
              <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: 600, borderBottom: '1px solid var(--border)', fontSize: 11 }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {strands.map((s, i) => (
              <tr key={s.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(128,128,180,0.04)' }}>
                <td style={{ padding: '9px 12px', fontWeight: 700, color: s.color, fontFamily: 'var(--mono)', fontSize: 12 }}>{s.id}</td>
                <td style={{ padding: '9px 12px', fontFamily: 'var(--mono)', fontSize: 12 }}>{s.oilFlow}</td>
                <td style={{ padding: '9px 12px', fontFamily: 'var(--mono)', fontSize: 12 }}>{s.shellThickness}</td>
                <td style={{ padding: '9px 12px', fontFamily: 'var(--mono)', fontSize: 12, color: s.mouldDeltaT > 13 ? C.amber : 'var(--text)' }}>{s.mouldDeltaT}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card title="HEAT INFO" badge="LIVE">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { l: 'Heat No.', v: '#2847' }, { l: 'Grade', v: 'B500B' }, { l: 'Section', v: '130×130mm' },
            { l: 'Length', v: '12.2m' }, { l: 'Strands', v: '3 / 3' }, { l: 'Elapsed', v: '00:44:12' },
          ].map(r => (
            <div key={r.l} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '9px 12px' }}>
              <div style={{ fontSize: 9, color: 'var(--text-dim)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{r.l}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 600, color: 'var(--text-mid)' }}>{r.v}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card title="BREAKOUT INDICATORS" badge="MONITOR">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {[
            { l: 'Sticker Alarm', v: 'None', c: C.green },
            { l: 'Friction Index', v: 'Normal', c: C.green },
            { l: 'Shell Thickness', v: '28.4mm', c: C.blue },
            { l: 'Mould ΔTemp', v: '±3.2°C', c: 'var(--text-mid)' },
          ].map(r => (
            <div key={r.l} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{r.l}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 600, color: r.c }}>{r.v}</span>
            </div>
          ))}
        </div>
      </Card>
    </>
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

  const outlierItems = [
    { p: 'Cast Speed', t: '02:07', v: '+0.18 m/min', sev: 'warning' },
    { p: 'Mould Oil Flow', t: '01:44', v: '2.6 L/min ↓', sev: 'warning' },
    { p: 'Tundish Temp', t: '01:12', v: '1582°C ↑', sev: 'critical' },
    { p: 'Arc Current', t: '00:58', v: 'Phase A +12%', sev: 'info' },
  ];

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Card title="TUNDISH TEMPERATURE — OUTLIER MONITOR" badge="Q">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>40 observations · ±2σ bounds</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--blue)' }}>1548°C</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 10 }}>
            {[{ l: 'Mean', v: '1548°C' }, { l: 'Std Dev', v: '±8.2°C' }, { l: 'Outliers (1h)', v: '2', c: C.amber }, { l: 'Status', v: 'Normal', c: C.green }].map(m => (
              <div key={m.l} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '9px 11px' }}>
                <div style={{ fontSize: 9, color: 'var(--text-dim)', marginBottom: 3 }}>{m.l}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 600, color: m.c || 'var(--text-mid)' }}>{m.v}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="DETECTED OUTLIERS" badge="ML" badgeStyle={{ background: 'rgba(0,210,210,0.1)', color: 'oklch(72% 0.15 190deg)', border: '1px solid rgba(0,210,210,0.2)' }}>
          {outlierItems.map(o => (
            <div key={o.p} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: o.sev === 'critical' ? C.red : o.sev === 'warning' ? C.amber : C.blue }}>{o.p}</div>
                <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>{o.t} ago</div>
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-mid)' }}>{o.v}</div>
            </div>
          ))}
        </Card>
      </div>
      <Card title="MOULD LEVEL — ANOMALY TIMELINE" badge="OUTLIER">
        <div style={{ height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mouldData}>
              <XAxis dataKey="t" tick={false} axisLine={false} />
              <YAxis domain={[55, 100]} tick={{ fontSize: 11, fill: 'var(--text-dim)' }} />
              <Tooltip contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} />
              <ReferenceLine y={70} stroke={C.amber} strokeDasharray="4 4" />
              <ReferenceLine y={95} stroke={C.amber} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="S1" stroke={C.blue} strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="S2" stroke={C.purple} strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="S3" stroke={C.green} strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="anomaly" stroke={C.red} strokeWidth={0} dot={{ r: 6, fill: C.red, stroke: '#fff', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card title="ROOT CAUSE ANALYSIS" badge="RCA">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {rootCauses.map((rc, i) => (
            <div key={i} style={{
              padding: '11px 14px',
              borderLeft: `3px solid ${rc.severity === 'critical' ? C.red : rc.severity === 'warning' ? C.amber : C.blue}`,
              background: rc.severity === 'critical' ? 'rgba(232,74,74,0.04)' : rc.severity === 'warning' ? 'rgba(255,174,74,0.04)' : 'rgba(58,120,255,0.04)',
              borderRadius: '0 8px 8px 0',
              display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap',
            }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-dim)' }}>{rc.time}</span>
              <span style={{ fontWeight: 700, fontSize: '12px', color: rc.severity === 'critical' ? C.red : rc.severity === 'warning' ? C.amber : C.blue }}>{rc.strand}</span>
              <span style={{ fontSize: '12px', color: 'var(--text)' }}>{rc.param}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: C.red, fontWeight: 700 }}>{rc.deviation}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-dim)', flex: 1 }}>→ {rc.cause}</span>
            </div>
          ))}
        </div>
      </Card>
      <div style={{ padding: '10px 14px', background: 'rgba(50,110,255,0.04)', border: '1px solid rgba(50,110,255,0.18)', borderRadius: 8, fontSize: '11px', color: 'var(--text-mid)' }}>
        <span style={{ color: C.blue, fontWeight: 600 }}>Root Cause:</span> Superheat exceeded 28°C at 01:12 · Oil flow drop + speed increase correlated · <span style={{ color: C.green, fontWeight: 600 }}>Action:</span> Reduce heat 8°C, oil flow → 3.1 L/min
      </div>
    </>
  );
}

function DefectTab() {
  const defects = [
    { label: 'Web Cracks', S1: 12, S2: 28, S3: 8, color: C.red },
    { label: 'Seams', S1: 5, S2: 15, S3: 6, color: C.amber },
    { label: 'Surface Defects', S1: 18, S2: 22, S3: 11, color: C.purple },
    { label: 'Internal Defects', S1: 3, S2: 9, S3: 4, color: C.blue },
  ];
  const strandColors = [C.blue, C.purple, C.green];

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {[
          { name: 'Web Cracks — Strand 2', risk: 28, hi: 60, desc: 'Elevated superheat driving surface crack formation on S2' },
          { name: 'Seam Defects', risk: 14, hi: 35, desc: 'Low risk. Oscillation marks within normal range' },
          { name: 'Surface Cracks', risk: 23, hi: 40, desc: 'Moderate. Monitor casting speed variation carefully' },
          { name: 'Internal Voids', risk: 8, hi: 25, desc: 'Low risk. Solidification profile normal across all strands' },
        ].map(d => {
          const col = d.risk > d.hi ? C.red : d.risk > d.hi * 0.6 ? C.amber : C.green;
          return (
            <div key={d.name} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 12 }}>
              <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 5 }}>{d.name}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 24, fontWeight: 700, color: col }}>{d.risk}%</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: col, marginTop: 2 }}>{d.risk > d.hi ? 'HIGH RISK' : d.risk > d.hi * 0.6 ? 'MODERATE' : 'LOW RISK'}</div>
              <div style={{ height: 3, background: 'var(--surface-2)', borderRadius: 2, marginTop: 8 }}>
                <div style={{ height: '100%', width: `${d.risk}%`, background: col, borderRadius: 2, transition: 'width 1.5s' }} />
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 8, lineHeight: 1.5 }}>{d.desc}</div>
            </div>
          );
        })}
      </div>
      {['S1', 'S2', 'S3'].map((strand, si) => (
        <Card key={strand} title={`${strand} — Defect Risk Profile`} badge={strand} badgeStyle={{ background: `${strandColors[si]}18`, color: strandColors[si], border: `1px solid ${strandColors[si]}40` }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <span style={{ padding: '3px 10px', background: 'rgba(58,204,122,0.1)', border: '1px solid rgba(58,204,122,0.25)', borderRadius: '100px', fontSize: '11px', fontWeight: 700, color: C.green }}>ML Confidence: {[92, 87, 95][si]}%</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {defects.map(d => {
              const val = d[strand];
              return (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)', width: '130px', flexShrink: 0 }}>{d.label}</span>
                  <div style={{ flex: 1, height: '5px', borderRadius: '3px', background: 'var(--surface-2)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${val}%`, background: d.color, borderRadius: '3px', transition: 'width 1s' }} />
                  </div>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: 700, color: val > 20 ? C.red : val > 12 ? C.amber : C.green, width: '40px', textAlign: 'right', flexShrink: 0 }}>{val}%</span>
                </div>
              );
            })}
          </div>
        </Card>
      ))}
      <div style={{ padding: '10px 14px', background: 'rgba(50,110,255,0.04)', border: '1px solid rgba(50,110,255,0.18)', borderRadius: 8, fontSize: '11px', color: 'var(--text-mid)' }}>
        Model: LSTM-Defect v3.1 · Trained on 2.4M heats · Last updated 2026-05-10 · P99 inference: 48ms
      </div>
    </>
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
    <>
      <Card title="NLP QUERY ENGINE" badge="AI · NLP" badgeStyle={{ background: 'rgba(0,210,210,0.1)', color: 'oklch(72% 0.15 190deg)', border: '1px solid rgba(0,210,210,0.2)' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: 10 }}>
          <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && query && handleQuery(query)}
            placeholder="Ask about CastX process data, defects, or anomalies..."
            style={{ flex: 1, padding: '8px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)', fontSize: '12px', fontFamily: 'var(--sans)', outline: 'none' }} />
          <button onClick={() => query && handleQuery(query)} style={{ padding: '8px 16px', background: MODULE_COLOR, color: '#fff', border: 'none', borderRadius: 6, fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)' }}>Analyze</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {NLP_PROMPTS.map(p => (
            <button key={p} onClick={() => handleQuery(p)} style={{ padding: '4px 10px', background: 'rgba(50,110,255,0.08)', border: '1px solid rgba(50,110,255,0.2)', borderRadius: 12, color: MODULE_COLOR, fontSize: '11px', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--sans)' }}>{p}</button>
          ))}
        </div>
      </Card>
      {loading && (
        <Card>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center', color: 'var(--text-dim)', fontSize: 11 }}>
            {[0, 1, 2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: MODULE_COLOR, animation: `pgn ${1.2 + i * 0.15}s infinite ${i * 0.15}s` }} />)}
            <span>Analyzing process data...</span>
          </div>
        </Card>
      )}
      {response && !loading && (
        <div style={{ padding: 14, background: 'var(--bg2)', border: '1px solid rgba(50,110,255,0.2)', borderRadius: 'var(--radius)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: MODULE_COLOR, letterSpacing: '1px', marginBottom: '10px', textTransform: 'uppercase' }}>AI Analysis — CastX NLP</div>
          <div style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{response}</div>
        </div>
      )}
      <Card title="RECENT QUERIES" badge="HISTORY">
        {[
          { q: 'Show mould level variation for last 3 heats', t: '02:11', u: 'Ops Shift A' },
          { q: 'What caused the temperature spike at 01:12?', t: '01:55', u: 'QA Engineer' },
          { q: 'Predict defect probability for next 2 heats', t: '01:30', u: 'ML System' },
          { q: 'Compare EAF energy consumption week over week', t: '00:45', u: 'Plant Manager' },
        ].map(r => (
          <div key={r.q} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 14, color: C.blue, flexShrink: 0 }}>⌘</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'var(--text-mid)' }}>{r.q}</div>
              <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>{r.u} · {r.t} ago</div>
            </div>
          </div>
        ))}
      </Card>
    </>
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
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600 }}>Forecast Horizon:</span>
        {['15m', '30m', '1h', '4h'].map(h => (
          <button key={h} onClick={() => setHorizon(h)} style={{
            padding: '4px 12px',
            background: horizon === h ? MODULE_COLOR : 'var(--surface-2)',
            color: horizon === h ? '#fff' : 'var(--text-dim)',
            border: `1px solid ${horizon === h ? MODULE_COLOR : 'var(--border)'}`,
            borderRadius: 5, fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)',
          }}>{h}</button>
        ))}
      </div>
      <Card title={`CAST SPEED — ACTUAL vs PREDICTED (${horizon} horizon)`} badge="FORECAST">
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
              <Tooltip contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} />
              <ReferenceLine x={24} stroke="rgba(128,128,180,0.4)" strokeDasharray="4 4" label={{ value: 'Now', fill: 'var(--text-dim)', fontSize: 11 }} />
              <Area type="monotone" dataKey="actualS1" stroke={C.blue} strokeWidth={2} fill="url(#gS1)" dot={false} name="S1 Actual" />
              <Area type="monotone" dataKey="actualS2" stroke={C.purple} strokeWidth={2} fill="url(#gS2)" dot={false} name="S2 Actual" />
              <Area type="monotone" dataKey="predS1" stroke={C.blue} strokeWidth={2} strokeDasharray="6 3" fill="none" dot={false} name="S1 Forecast" />
              <Area type="monotone" dataKey="predS2" stroke={C.purple} strokeWidth={2} strokeDasharray="6 3" fill="none" dot={false} name="S2 Forecast" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { l: 'Current', v: '1548°C' }, { l: 'Predicted (15m)', v: '1548°C' },
          { l: 'MAPE', v: '0.8%', c: C.green }, { l: 'Horizon', v: '60 min' },
        ].map(m => (
          <div key={m.l} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '9px 11px' }}>
            <div style={{ fontSize: 9, color: 'var(--text-dim)', marginBottom: 4 }}>{m.l}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 600, color: m.c || 'var(--text-mid)' }}>{m.v}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function CastXPage() {
  const [active, setActive] = useState('snapshot');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCastXSnapshot().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  function renderActiveTab() {
    if (loading) {
      return [1, 2, 3].map(i => <Skeleton key={i} h={80} r={8} />);
    }
    if (active === 'snapshot') return <SnapshotTab data={data} />;
    if (active === 'outliers') return <OutliersTab />;
    if (active === 'defects') return <DefectTab />;
    if (active === 'nlp') return <NLPTab />;
    if (active === 'timeseries') return <TimeSeriesTab />;
    return null;
  }

  return (
    <div style={{ fontFamily: 'var(--sans)', minHeight: '100%' }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes pgn { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg)' }}>
        <MicroappBar />
        <TabBar active={active} setActive={setActive} />
      </div>
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {renderActiveTab()}
      </div>
    </div>
  );
}

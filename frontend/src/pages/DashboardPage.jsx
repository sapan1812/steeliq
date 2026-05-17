import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  AreaChart, Area, Tooltip, XAxis, YAxis,
} from 'recharts';
import { useAuth } from '../hooks/useAuth.js';
import { getKPIs, getAlerts } from '../api/analytics.js';

const C = {
  blue: '#3a78ff', amber: '#ffae4a', green: '#3acc7a',
  purple: '#a060ff', red: '#e84a4a',
};

const PERSONA_BY_ROLE = {
  super_admin: {
    title: 'Platform Command Center',
    intent: 'Full visibility across EAF, DRI, and CastX operations. Monitor SLOs and manage platform health.',
    icon: '🛡',
  },
  plant_manager: {
    title: 'Plant Operations Overview',
    intent: 'Track yield, energy efficiency, and quality metrics across all production stages.',
    icon: '🏭',
  },
  castx_operator: {
    title: 'CastX Quality Focus',
    intent: 'Monitor strand health, mould levels, and defect predictions for active casts.',
    icon: '🎯',
  },
  eaf_operator: {
    title: 'EAF Energy & Arc Control',
    intent: 'Optimize power curve, track electrode wear, and minimize tap-to-tap time.',
    icon: '⚡',
  },
  dri_operator: {
    title: 'DRI/DRP Process Control',
    intent: 'Monitor gas consumption, metallization efficiency, and zone temperatures.',
    icon: '🔥',
  },
};

const MOCK_KPIS = {
  yield_rate: 94.7,
  eaf_kwh_per_t: 412,
  metallization_pct: 94.2,
  tundish_temp: 1562,
  tap_to_tap_min: 58,
  breakout_risk: 2.1,
  arc_stability: 97.3,
  gas_efficiency: 88.6,
};

const MOCK_ALERTS = [
  { id: 1, severity: 'warning', message: 'Mould level variance on Strand 2 exceeds threshold', module: 'CastX', time: '3m ago' },
  { id: 2, severity: 'info', message: 'EAF Heat #1847 completed — energy 408 kWh/t', module: 'EAF', time: '12m ago' },
  { id: 3, severity: 'critical', message: 'DRI Zone 2 temperature deviation detected', module: 'DRI', time: '28m ago' },
];

const FLOW_STAGES = [
  { id: 'dri', label: 'DRI/DRP', icon: '🔵', color: C.amber, route: '/app/dri' },
  { id: 'eaf', label: 'EAF', icon: '⚡', color: C.blue, route: '/app/eaf' },
  { id: 'ladle', label: 'Ladle Furnace', icon: '🏺', color: C.purple, route: null },
  { id: 'castx', label: 'CCM', icon: '🎯', color: C.green, route: '/app/castx' },
];

function QEGRing({ label, score, color, description }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div style={{
      flex: 1, minWidth: '160px',
      padding: '24px 20px',
      background: 'var(--bg2, #fff)',
      border: '1px solid rgba(128,128,180,0.15)',
      borderRadius: '16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
    }}>
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(128,128,180,0.1)" strokeWidth="10" />
        <circle
          cx="64" cy="64" r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          strokeDashoffset={circ / 4}
          style={{ transition: 'stroke-dasharray 1.2s ease' }}
        />
        <text x="64" y="58" textAnchor="middle" fill={color}
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '22px', fontWeight: 700 }}>
          {label}
        </text>
        <text x="64" y="78" textAnchor="middle" fill="var(--text-dim, #7a8aac)"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontWeight: 600 }}>
          {score}%
        </text>
      </svg>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text, #0f1a30)' }}>{description}</div>
        <div style={{
          marginTop: '6px', display: 'inline-block',
          padding: '3px 10px',
          background: `${color}18`,
          border: `1px solid ${color}35`,
          borderRadius: '100px',
          fontSize: '11px', fontWeight: 700, color,
        }}>
          {score >= 95 ? 'EXCELLENT' : score >= 85 ? 'GOOD' : 'ATTENTION'}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, unit, trend, color, sparkData }) {
  const upward = trend > 0;
  const trendColor = trend === 0 ? 'var(--text-dim)' : (
    ['Breakout Risk'].includes(label) ? (upward ? C.red : C.green) : (upward ? C.green : C.red)
  );

  return (
    <div style={{
      padding: '20px',
      background: 'var(--bg2, #fff)',
      border: '1px solid rgba(128,128,180,0.12)',
      borderRadius: '14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-dim, #7a8aac)', letterSpacing: '0.3px' }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '26px', fontWeight: 700,
          color: color || 'var(--text, #0f1a30)',
          lineHeight: 1,
        }}>{typeof value === 'number' ? value.toFixed(value % 1 === 0 ? 0 : 1) : value}</span>
        {unit && <span style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '2px' }}>{unit}</span>}
        {trend !== undefined && (
          <span style={{ fontSize: '13px', fontWeight: 700, color: trendColor, marginBottom: '2px' }}>
            {trend > 0 ? '▲' : trend < 0 ? '▼' : '—'} {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
      {sparkData && (
        <div style={{ height: '36px', marginTop: '4px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`sg-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color || C.blue} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color || C.blue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={color || C.blue} strokeWidth={1.5}
                fill={`url(#sg-${label})`} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function FlowDot({ delay }) {
  return (
    <div style={{
      position: 'absolute',
      width: '8px', height: '8px',
      borderRadius: '50%',
      background: C.blue,
      top: '50%', marginTop: '-4px',
      left: '-8px',
      animation: `flowDot 2.5s ${delay}s infinite linear`,
      boxShadow: `0 0 6px ${C.blue}`,
    }} />
  );
}

function generateSpark(base, count = 12) {
  return Array.from({ length: count }, (_, i) => ({
    i,
    v: base + (Math.random() - 0.5) * base * 0.06,
  }));
}

function Skeleton({ w = '100%', h = 20, r = 8 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: 'linear-gradient(90deg, rgba(128,128,180,0.1) 25%, rgba(128,128,180,0.2) 50%, rgba(128,128,180,0.1) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
    }} />
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [kpis, setKpis] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sparks, setSparks] = useState({});

  const persona = PERSONA_BY_ROLE[user?.role] || PERSONA_BY_ROLE.plant_manager;

  const fetchData = async () => {
    try {
      const [kpiData, alertData] = await Promise.all([getKPIs(), getAlerts()]);
      setKpis(kpiData);
      setAlerts(alertData?.slice(0, 3) || MOCK_ALERTS);
    } catch {
      setKpis(MOCK_KPIS);
      setAlerts(MOCK_ALERTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      setKpis(prev => {
        if (!prev) return prev;
        const jitter = (v, pct = 0.01) => +(v + (Math.random() - 0.5) * v * pct).toFixed(1);
        return {
          yield_rate: jitter(prev.yield_rate),
          eaf_kwh_per_t: jitter(prev.eaf_kwh_per_t, 0.005),
          metallization_pct: jitter(prev.metallization_pct),
          tundish_temp: jitter(prev.tundish_temp, 0.003),
          tap_to_tap_min: jitter(prev.tap_to_tap_min, 0.005),
          breakout_risk: Math.max(0, jitter(prev.breakout_risk, 0.1)),
          arc_stability: Math.min(100, jitter(prev.arc_stability)),
          gas_efficiency: jitter(prev.gas_efficiency),
        };
      });
      setSparks(prev => {
        const next = { ...prev };
        Object.keys(MOCK_KPIS).forEach(k => {
          const arr = prev[k] || generateSpark(MOCK_KPIS[k]);
          next[k] = [...arr.slice(1), { i: arr.length, v: MOCK_KPIS[k] + (Math.random() - 0.5) * MOCK_KPIS[k] * 0.04 }];
        });
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const s = {};
    Object.keys(MOCK_KPIS).forEach(k => { s[k] = generateSpark(MOCK_KPIS[k]); });
    setSparks(s);
  }, []);

  const k = kpis || MOCK_KPIS;

  const KPI_DEFS = [
    { key: 'yield_rate', label: 'Yield Rate', unit: '%', trend: 0.3, color: C.green },
    { key: 'eaf_kwh_per_t', label: 'EAF kWh/t', unit: 'kWh/t', trend: -1.2, color: C.blue },
    { key: 'metallization_pct', label: 'Metallization%', unit: '%', trend: 0.1, color: C.amber },
    { key: 'tundish_temp', label: 'Tundish Temp', unit: '°C', trend: 0, color: C.purple },
    { key: 'tap_to_tap_min', label: 'Tap-to-Tap', unit: 'min', trend: -2.1, color: C.blue },
    { key: 'breakout_risk', label: 'Breakout Risk', unit: '%', trend: 0.5, color: C.red },
    { key: 'arc_stability', label: 'Arc Stability', unit: '%', trend: 0.8, color: C.green },
    { key: 'gas_efficiency', label: 'Gas Efficiency', unit: '%', trend: 1.1, color: C.amber },
  ];

  const severityColor = { critical: C.red, warning: C.amber, info: C.blue };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes flowDot {
          0%{left:-8px;opacity:0} 15%{opacity:1} 85%{opacity:1} 100%{left:calc(100% + 8px);opacity:0}
        }
      `}</style>

      {/* Persona strip */}
      <div style={{
        padding: '16px 20px',
        background: 'var(--bg2, #fff)',
        border: '1px solid rgba(128,128,180,0.15)',
        borderRadius: '12px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        <span style={{ fontSize: '28px' }}>{persona.icon}</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text, #0f1a30)' }}>
            {persona.title}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-dim, #7a8aac)', marginTop: '2px' }}>
            {persona.intent}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: C.green, boxShadow: `0 0 6px ${C.green}` }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: C.green }}>LIVE</span>
        </div>
      </div>

      {/* Process flow */}
      <div style={{
        padding: '24px',
        background: 'var(--bg2, #fff)',
        border: '1px solid rgba(128,128,180,0.15)',
        borderRadius: '16px',
        marginBottom: '24px',
      }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '1px', marginBottom: '20px' }}>
          PROCESS FLOW
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0', overflowX: 'auto', paddingBottom: '4px' }}>
          {FLOW_STAGES.map((stage, i) => (
            <React.Fragment key={stage.id}>
              <div
                onClick={() => stage.route && navigate(stage.route)}
                style={{
                  flex: 'none',
                  padding: '16px 24px',
                  background: `${stage.color}12`,
                  border: `1.5px solid ${stage.color}30`,
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: stage.route ? 'pointer' : 'default',
                  minWidth: '120px',
                  transition: 'transform 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => { if (stage.route) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = `${stage.color}70`; }}}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = `${stage.color}30`; }}
              >
                <span style={{ fontSize: '28px' }}>{stage.icon}</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: stage.color, textAlign: 'center' }}>{stage.label}</span>
                {stage.route && (
                  <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: 500 }}>→ Open Module</span>
                )}
              </div>
              {i < FLOW_STAGES.length - 1 && (
                <div style={{
                  flex: 1, height: '2px', minWidth: '32px',
                  background: 'linear-gradient(90deg, rgba(58,120,255,0.2), rgba(58,120,255,0.5))',
                  position: 'relative', overflow: 'visible',
                }}>
                  <FlowDot delay={i * 0.8} />
                  <FlowDot delay={i * 0.8 + 1.3} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* QEG Health Rings */}
      <div style={{
        display: 'flex', gap: '20px', marginBottom: '24px', flexWrap: 'wrap',
      }}>
        <QEGRing label="Q" score={98} color={C.green} description="CastX — Strand Quality" />
        <QEGRing label="E" score={94} color={C.blue} description="EAF — Energy Efficiency" />
        <QEGRing label="G" score={96} color={C.amber} description="DRI — Gas Optimization" />
      </div>

      {/* KPI Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ padding: '20px', background: 'var(--bg2)', borderRadius: '14px' }}>
              <Skeleton h={12} w="60%" r={6} />
              <div style={{ marginTop: '12px' }}><Skeleton h={28} w="80%" r={6} /></div>
              <div style={{ marginTop: '12px' }}><Skeleton h={36} r={6} /></div>
            </div>
          ))
          : KPI_DEFS.map(d => (
            <KpiCard
              key={d.key}
              label={d.label}
              value={k[d.key]}
              unit={d.unit}
              trend={d.trend}
              color={d.color}
              sparkData={sparks[d.key]}
            />
          ))
        }
      </div>

      {/* Alerts preview */}
      <div style={{
        padding: '24px',
        background: 'var(--bg2, #fff)',
        border: '1px solid rgba(128,128,180,0.15)',
        borderRadius: '16px',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px',
        }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '1px' }}>
            RECENT ALERTS
          </div>
          <a href="/app/alerts" style={{
            fontSize: '13px', fontWeight: 600, color: C.blue, textDecoration: 'none',
          }}>View all →</a>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {alerts.map(alert => (
            <div key={alert.id} style={{
              padding: '14px 16px',
              borderLeft: `3px solid ${severityColor[alert.severity] || C.blue}`,
              background: `${severityColor[alert.severity] || C.blue}08`,
              borderRadius: '0 10px 10px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)', marginBottom: '4px' }}>
                  {alert.message}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{
                    padding: '2px 8px',
                    background: `${severityColor[alert.severity]}20`,
                    color: severityColor[alert.severity],
                    borderRadius: '100px', fontSize: '11px', fontWeight: 700,
                    textTransform: 'uppercase',
                  }}>{alert.severity}</span>
                  <span style={{
                    padding: '2px 8px',
                    background: 'rgba(128,128,180,0.1)',
                    color: 'var(--text-dim)',
                    borderRadius: '100px', fontSize: '11px', fontWeight: 600,
                  }}>{alert.module}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{alert.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

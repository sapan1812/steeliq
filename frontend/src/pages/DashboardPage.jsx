import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../hooks/useAuth.js';
import { getKPIs, getAlerts } from '../api/analytics.js';

const C = {
  blue: '#3a6eff', amber: '#ffa528', green: '#32c86e',
  purple: '#a060ff', red: '#ff3232',
};

const PERSONA_BY_ROLE = {
  super_admin: {
    title: 'Platform Command Center',
    intent: 'Full visibility across EAF, DRI, and CastX operations. Monitor SLOs and manage platform health.',
    icon: '⚙',
  },
  plant_manager: {
    title: 'Plant Operations Overview',
    intent: 'Track yield, energy efficiency, and quality metrics across all production stages.',
    icon: '◈',
  },
  castx_operator: {
    title: 'CastX Quality Focus',
    intent: 'Monitor strand health, mould levels, and defect predictions for active casts.',
    icon: 'Q',
  },
  eaf_operator: {
    title: 'EAF Energy & Arc Control',
    intent: 'Optimize power curve, track electrode wear, and minimize tap-to-tap time.',
    icon: 'E',
  },
  dri_operator: {
    title: 'DRI/DRP Process Control',
    intent: 'Monitor gas consumption, metallization efficiency, and zone temperatures.',
    icon: 'G',
  },
};

const MOCK_KPIS = {
  yield_rate: 94.7,
  eaf_kwh_per_t: 412,
  metallization_pct: 94.2,
  tundish_temp: 1562,
  tap_to_tap_min: 44,
  breakout_risk: 2.1,
  arc_stability: 97.3,
  gas_efficiency: 88.6,
};

const MOCK_ALERTS = [
  { id: 1, severity: 'critical', message: 'Web Crack Risk — Strand 2 at 63% probability', module: 'CastX', time: '2m ago' },
  { id: 2, severity: 'critical', message: 'EAF Electrode Set B wear at 68% — replacement in 3h 40m', module: 'EAF', time: '14m ago' },
  { id: 3, severity: 'warning', message: 'DRI Zone 3 pressure at 0.61 bar (limit 0.55)', module: 'DRI', time: '28m ago' },
];

const FLOW_STAGES = [
  { id: 'ore',    label: 'Iron Ore Input',         icon: '⬡',  color: C.amber,  route: null },
  { id: 'dri',    label: 'DRI Reactor',             icon: 'G',   color: C.green,  route: '/app/dri' },
  { id: 'eaf',    label: 'Electric Arc Furnace',    icon: 'E',   color: C.amber,  route: '/app/eaf' },
  { id: 'ladle',  label: 'Ladle Furnace',           icon: '◎',  color: C.purple, route: null },
  { id: 'castx',  label: 'Cont. Casting',           icon: 'Q',   color: C.blue,   route: '/app/castx' },
  { id: 'billet', label: 'Steel Billet',            icon: '▬',  color: C.green,  route: null },
];

const QEG_DEFS = [
  {
    letter: 'Q',
    module: 'CastX Quality Engine',
    path: '/app/castx',
    score: 88,
    color: C.blue,
    colorLo: 'rgba(50,110,255,0.08)',
    metrics: [
      { label: 'Defect Risk', value: '2.1%' },
      { label: 'Mould Stability', value: '97.4%' },
      { label: 'Superheat', value: '29 °C' },
    ],
  },
  {
    letter: 'E',
    module: 'EAF Energy Optimizer',
    path: '/app/eaf',
    score: 79,
    color: C.amber,
    colorLo: 'rgba(255,165,40,0.08)',
    metrics: [
      { label: 'kWh / ton', value: '412' },
      { label: 'Arc Stability', value: '88%' },
      { label: 'Tap-to-Tap', value: '44 min' },
    ],
  },
  {
    letter: 'G',
    module: 'DRI Gas Analytics',
    path: '/app/dri',
    score: 94,
    color: C.green,
    colorLo: 'rgba(50,200,110,0.08)',
    metrics: [
      { label: 'Metallization', value: '92.4%' },
      { label: 'Gas Flow', value: '28,400 Nm³/h' },
      { label: 'Yield Rate', value: '94.2%' },
    ],
  },
];

function QEGCard({ letter, module, score, color, colorLo, metrics, navigate, path }) {
  return (
    <div
      onClick={() => navigate(path)}
      style={{
        borderRadius: 10,
        padding: '18px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        background: `linear-gradient(140deg, ${colorLo.replace('0.08', '0.10')}, ${colorLo.replace('0.08', '0.04')})`,
        border: `1px solid ${color}38`,
        transition: 'transform 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color, marginBottom: 4 }}>{letter}</div>
      <div style={{ fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)', fontSize: 42, fontWeight: 700, lineHeight: 1, color: 'var(--text, #0f1a30)' }}>{score}</div>
      <div style={{ fontSize: 12, fontWeight: 700, marginTop: 6, marginBottom: 14, color: 'var(--text, #0f1a30)' }}>{module}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {metrics.map(m => (
          <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
            <span style={{ color: 'var(--text-muted, #7a8aac)' }}>{m.label}</span>
            <span style={{ fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)', fontWeight: 600, color: 'var(--text, #0f1a30)' }}>{m.value}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, fontSize: 11, color, fontWeight: 600 }}>Open {module} →</div>
    </div>
  );
}

function KpiCard({ label, value, unit, trend, color, sparkData }) {
  const upward = trend > 0;
  const trendColor = trend === 0 ? 'var(--text-muted)' : (
    ['Breakout Risk'].includes(label) ? (upward ? C.red : C.green) : (upward ? C.green : C.red)
  );

  return (
    <div style={{
      padding: '16px 18px',
      background: 'var(--bg2, #fff)',
      border: '1px solid rgba(128,128,180,0.12)',
      borderRadius: 10,
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted, #7a8aac)', letterSpacing: '1px', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
        <span style={{
          fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
          fontSize: '24px', fontWeight: 700,
          color: color || 'var(--text, #0f1a30)',
          lineHeight: 1,
        }}>{typeof value === 'number' ? value.toFixed(value % 1 === 0 ? 0 : 1) : value}</span>
        {unit && <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '2px' }}>{unit}</span>}
        {trend !== undefined && (
          <span style={{ fontSize: '12px', fontWeight: 700, color: trendColor, marginBottom: '2px' }}>
            {trend > 0 ? '▲' : trend < 0 ? '▼' : '—'} {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
      {sparkData && (
        <div style={{ height: '32px', marginTop: '2px' }}>
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

function FlowDot({ delay, color }) {
  return (
    <div style={{
      position: 'absolute',
      width: '7px', height: '7px',
      borderRadius: '50%',
      background: color || C.blue,
      top: '50%', marginTop: '-3.5px',
      left: '-7px',
      animation: `flowDot 2.5s ${delay}s infinite linear`,
      boxShadow: `0 0 5px ${color || C.blue}`,
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
    { key: 'yield_rate',       label: 'Yield Rate',      unit: '%',     trend: 0.3,  color: C.green },
    { key: 'eaf_kwh_per_t',    label: 'EAF kWh/t',       unit: 'kWh/t', trend: -1.2, color: C.amber },
    { key: 'metallization_pct',label: 'Metallization',   unit: '%',     trend: 0.1,  color: C.amber },
    { key: 'tundish_temp',     label: 'Tundish Temp',    unit: '°C',    trend: 0,    color: C.purple },
    { key: 'tap_to_tap_min',   label: 'Tap-to-Tap',      unit: 'min',   trend: -2.1, color: C.blue },
    { key: 'breakout_risk',    label: 'Breakout Risk',   unit: '%',     trend: 0.5,  color: C.red },
    { key: 'arc_stability',    label: 'Arc Stability',   unit: '%',     trend: 0.8,  color: C.green },
    { key: 'gas_efficiency',   label: 'Gas Efficiency',  unit: '%',     trend: 1.1,  color: C.amber },
  ];

  const severityColor = { critical: C.red, warning: C.amber, info: C.blue };

  return (
    <div style={{ padding: '20px 24px', maxWidth: '1400px', margin: '0 auto' }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes flowDot {
          0%{left:-7px;opacity:0} 15%{opacity:1} 85%{opacity:1} 100%{left:calc(100% + 7px);opacity:0}
        }
      `}</style>

      {/* Persona strip — prototype style */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '7px 12px',
        background: 'linear-gradient(90deg, rgba(160,80,255,0.06), transparent 80%)',
        border: '1px solid rgba(160,80,255,0.15)',
        borderRadius: 8,
        marginBottom: 10,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: 'rgba(160,80,255,0.1)',
          border: '1px solid rgba(160,80,255,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: C.purple, fontSize: 13, fontWeight: 700, flexShrink: 0,
        }}>
          {persona.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text, #0f1a30)' }}>{persona.title}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted, #7a8aac)', marginTop: 1 }}>{persona.intent}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.green, boxShadow: `0 0 5px ${C.green}` }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: C.green, letterSpacing: '1px' }}>LIVE</span>
        </div>
      </div>

      {/* Process flow */}
      <div style={{
        padding: '18px 20px',
        background: 'var(--bg2, #fff)',
        border: '1px solid rgba(128,128,180,0.13)',
        borderRadius: 12,
        marginBottom: 16,
      }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted, #7a8aac)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 14 }}>
          STEELMAKING PROCESS FLOW
        </div>
        <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', paddingBottom: 4 }}>
          {FLOW_STAGES.map((stage, i) => (
            <React.Fragment key={stage.id}>
              <div
                onClick={() => stage.route && navigate(stage.route)}
                style={{
                  flexShrink: 0,
                  padding: '12px 16px',
                  background: `${stage.color}10`,
                  border: `1px solid ${stage.color}28`,
                  borderRadius: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 5,
                  cursor: stage.route ? 'pointer' : 'default',
                  minWidth: 100,
                  transition: 'transform 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => { if (stage.route) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = `${stage.color}55`; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = `${stage.color}28`; }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: `${stage.color}18`,
                  border: `1px solid ${stage.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 800, color: stage.color,
                }}>
                  {stage.icon}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: stage.color, textAlign: 'center', whiteSpace: 'nowrap' }}>{stage.label}</span>
                {stage.route && (
                  <span style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 500 }}>→ Open</span>
                )}
              </div>
              {i < FLOW_STAGES.length - 1 && (
                <div style={{
                  flex: 1, height: '2px', minWidth: 24,
                  background: `linear-gradient(90deg, ${stage.color}30, ${FLOW_STAGES[i + 1].color}30)`,
                  position: 'relative', overflow: 'visible',
                }}>
                  <FlowDot delay={i * 0.7} color={stage.color} />
                  <FlowDot delay={i * 0.7 + 1.2} color={stage.color} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* QEG Cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 14,
        marginBottom: 16,
      }}>
        {QEG_DEFS.map(def => (
          <QEGCard
            key={def.letter}
            {...def}
            navigate={navigate}
          />
        ))}
      </div>

      {/* KPI Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))',
        gap: 12,
        marginBottom: 16,
      }}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ padding: '16px 18px', background: 'var(--bg2)', borderRadius: 10 }}>
              <Skeleton h={10} w="60%" r={5} />
              <div style={{ marginTop: 10 }}><Skeleton h={24} w="75%" r={5} /></div>
              <div style={{ marginTop: 10 }}><Skeleton h={32} r={5} /></div>
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
        padding: '18px 20px',
        background: 'var(--bg2, #fff)',
        border: '1px solid rgba(128,128,180,0.13)',
        borderRadius: 12,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14,
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            RECENT ALERTS
          </div>
          <a href="/app/alerts" style={{
            fontSize: 11, fontWeight: 600, color: C.blue, textDecoration: 'none',
          }}>View all →</a>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {alerts.map(alert => (
            <div key={alert.id} style={{
              padding: '12px 14px',
              borderLeft: `3px solid ${severityColor[alert.severity] || C.blue}`,
              background: `${severityColor[alert.severity] || C.blue}08`,
              borderRadius: '0 8px 8px 0',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
                  {alert.message}
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{
                    padding: '1px 7px',
                    background: `${severityColor[alert.severity]}18`,
                    color: severityColor[alert.severity],
                    borderRadius: 3, fontSize: 9, fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                  }}>{alert.severity}</span>
                  <span style={{
                    padding: '1px 7px',
                    background: 'rgba(128,128,180,0.1)',
                    color: 'var(--text-muted)',
                    borderRadius: 3, fontSize: 9, fontWeight: 600,
                  }}>{alert.module}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{alert.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

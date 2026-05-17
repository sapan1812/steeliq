import React, { useState, useEffect, useCallback } from 'react';
import { getAlerts } from '../api/analytics.js';

const SEVERITY_ORDER = { critical: 0, warning: 1, info: 2 };
const SEVERITY_COLORS = {
  critical: { bg: 'rgba(255,74,106,0.10)', text: 'var(--red)', dot: 'var(--red)' },
  warning:  { bg: 'rgba(255,174,74,0.10)', text: 'var(--amber)', dot: 'var(--amber)' },
  info:     { bg: 'rgba(58,120,255,0.10)', text: 'var(--blue)', dot: 'var(--blue)' },
};
const MODULE_COLORS = {
  castx: 'var(--blue)',
  eaf: 'var(--amber)',
  dri: 'var(--green)',
  system: 'var(--purple)',
};

// Fallback mock alerts when API is unavailable
const MOCK_ALERTS = [
  { id: 'a1', severity: 'critical', title: 'EAF Arc Instability Detected', message: 'Arc stability fell below 75% threshold in furnace B. Automatic power reduction triggered.', module: 'eaf', timestamp: new Date(Date.now() - 3 * 60000).toISOString(), status: 'active' },
  { id: 'a2', severity: 'warning', title: 'CastX Outlier Cluster — Heat H042', message: 'Anomalous surface roughness pattern detected in billet sequence 14–19. Review QC report.', module: 'castx', timestamp: new Date(Date.now() - 18 * 60000).toISOString(), status: 'active' },
  { id: 'a3', severity: 'warning', title: 'DRI Metallization Below Target', message: 'Metallization dropped to 88.3% (target ≥90%). Check reducing gas composition.', module: 'dri', timestamp: new Date(Date.now() - 32 * 60000).toISOString(), status: 'acknowledged' },
  { id: 'a4', severity: 'info', title: 'Scheduled Maintenance: EAF Electrode B', message: 'Electrode Arm B scheduled for inspection in 6 days. Health score: 78%.', module: 'eaf', timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), status: 'acknowledged' },
  { id: 'a5', severity: 'critical', title: 'DRI Slag Door Mechanism — Critical Wear', message: 'Slag door actuator health at 61%. Immediate inspection recommended to prevent unplanned downtime.', module: 'dri', timestamp: new Date(Date.now() - 4 * 3600000).toISOString(), status: 'active' },
  { id: 'a6', severity: 'info', title: 'CastX Model Retrained', message: 'Defect prediction model retrained on 847 new samples. Validation accuracy: 96.2%.', module: 'castx', timestamp: new Date(Date.now() - 6 * 3600000).toISOString(), status: 'resolved' },
  { id: 'a7', severity: 'warning', title: 'Gas Consumption Spike — DRI Zone 3', message: 'Natural gas consumption in reduction zone 3 exceeded target by 18% over last 2 hours.', module: 'dri', timestamp: new Date(Date.now() - 8 * 3600000).toISOString(), status: 'resolved' },
  { id: 'a8', severity: 'info', title: 'Shift Handover Report Ready', message: 'Automated shift summary generated for Day shift (06:00–14:00). 3 active items.', module: 'system', timestamp: new Date(Date.now() - 10 * 3600000).toISOString(), status: 'resolved' },
];

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function FilterPill({ label, active, color, count, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 14px',
        borderRadius: 20,
        fontSize: '13px',
        fontWeight: 600,
        fontFamily: 'var(--font-sans)',
        cursor: 'pointer',
        border: `1.5px solid ${active ? (color || 'var(--blue)') : 'var(--border)'}`,
        background: active ? `${color || 'var(--blue)'}12` : 'var(--bg-card)',
        color: active ? (color || 'var(--blue)') : 'var(--text-secondary)',
        transition: 'all var(--transition)',
      }}
    >
      {label}
      {count != null && (
        <span style={{
          background: active ? (color || 'var(--blue)') : 'var(--bg-secondary)',
          color: active ? '#fff' : 'var(--text-muted)',
          fontSize: '11px',
          fontWeight: 700,
          padding: '1px 6px',
          borderRadius: 8,
          minWidth: 20,
          textAlign: 'center',
        }}>
          {count}
        </span>
      )}
    </button>
  );
}

function AlertCard({ alert, onAcknowledge, onResolve }) {
  const sev = SEVERITY_COLORS[alert.severity] || SEVERITY_COLORS.info;
  const modColor = MODULE_COLORS[alert.module?.toLowerCase()] || 'var(--text-muted)';
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1px solid var(--border)`,
      borderLeft: `3px solid ${sev.dot}`,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow)',
      transition: 'box-shadow var(--transition-md)',
    }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow)'}
    >
      <div
        style={{ padding: '14px 18px', cursor: 'pointer', userSelect: 'none' }}
        onClick={() => setExpanded((v) => !v)}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          {/* Severity dot */}
          <div style={{
            width: 9, height: 9, borderRadius: '50%',
            background: sev.dot,
            flexShrink: 0,
            marginTop: 5,
            boxShadow: alert.status === 'active' ? `0 0 0 3px ${sev.dot}22` : 'none',
          }} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
                {alert.title || alert.message}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.05em', padding: '2px 7px', borderRadius: 4,
                background: sev.bg, color: sev.text,
              }}>
                {alert.severity}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: modColor, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {alert.module}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {timeAgo(alert.timestamp)}
              </span>
              <span style={{
                fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                padding: '2px 7px', borderRadius: 4,
                background: alert.status === 'active' ? 'rgba(255,74,106,0.08)' : alert.status === 'acknowledged' ? 'rgba(255,174,74,0.08)' : 'rgba(58,204,122,0.08)',
                color: alert.status === 'active' ? 'var(--red)' : alert.status === 'acknowledged' ? 'var(--amber)' : 'var(--green)',
              }}>
                {alert.status}
              </span>
            </div>
          </div>

          {/* Expand chevron */}
          <svg width="16" height="16" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24"
            style={{ flexShrink: 0, transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform var(--transition)' }}>
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </div>

      {expanded && (
        <div style={{
          padding: '0 18px 16px 39px',
          borderTop: '1px solid var(--border)',
          paddingTop: 12,
        }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 14 }}>
            {alert.message || alert.title}
          </p>
          {alert.status !== 'resolved' && (
            <div style={{ display: 'flex', gap: 8 }}>
              {alert.status === 'active' && (
                <button
                  onClick={(e) => { e.stopPropagation(); onAcknowledge(alert.id); }}
                  style={{
                    padding: '6px 14px', borderRadius: 6, fontSize: '12px', fontWeight: 600,
                    fontFamily: 'var(--font-sans)', cursor: 'pointer',
                    background: 'rgba(255,174,74,0.12)', color: 'var(--amber)',
                    border: '1px solid rgba(255,174,74,0.3)',
                    transition: 'background var(--transition)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,174,74,0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,174,74,0.12)'}
                >
                  Acknowledge
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); onResolve(alert.id); }}
                style={{
                  padding: '6px 14px', borderRadius: 6, fontSize: '12px', fontWeight: 600,
                  fontFamily: 'var(--font-sans)', cursor: 'pointer',
                  background: 'rgba(58,204,122,0.12)', color: 'var(--green)',
                  border: '1px solid rgba(58,204,122,0.3)',
                  transition: 'background var(--transition)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(58,204,122,0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(58,204,122,0.12)'}
              >
                Mark Resolved
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterModule, setFilterModule] = useState('all');
  const [search, setSearch] = useState('');

  const fetchAlerts = useCallback(async () => {
    try {
      const data = await getAlerts();
      setAlerts(Array.isArray(data) ? data : MOCK_ALERTS);
    } catch {
      setAlerts(MOCK_ALERTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    const id = setInterval(fetchAlerts, 15000);
    return () => clearInterval(id);
  }, [fetchAlerts]);

  const handleAcknowledge = (id) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status: 'acknowledged' } : a));
  };
  const handleResolve = (id) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status: 'resolved' } : a));
  };

  const filteredAlerts = alerts
    .filter((a) => {
      if (filterSeverity !== 'all' && a.severity !== filterSeverity) return false;
      if (filterStatus !== 'all' && a.status !== filterStatus) return false;
      if (filterModule !== 'all' && a.module?.toLowerCase() !== filterModule) return false;
      if (search && !(a.title?.toLowerCase().includes(search.toLowerCase()) || a.message?.toLowerCase().includes(search.toLowerCase()))) return false;
      return true;
    })
    .sort((a, b) => {
      const sd = (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9);
      if (sd !== 0) return sd;
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

  const counts = {
    critical: alerts.filter((a) => a.severity === 'critical').length,
    warning: alerts.filter((a) => a.severity === 'warning').length,
    info: alerts.filter((a) => a.severity === 'info').length,
    active: alerts.filter((a) => a.status === 'active').length,
    acknowledged: alerts.filter((a) => a.status === 'acknowledged').length,
    resolved: alerts.filter((a) => a.status === 'resolved').length,
  };

  return (
    <div style={{ fontFamily: 'var(--font-sans)', padding: '20px 24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{ width: 4, height: 22, borderRadius: 2, background: 'var(--red)' }} />
          <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Alerts & Events
            {counts.active > 0 && (
              <span style={{
                marginLeft: 10,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                background: 'var(--red)',
                color: '#fff',
                borderRadius: '50%',
                fontSize: '12px',
                fontWeight: 700,
                verticalAlign: 'middle',
              }}>
                {counts.active}
              </span>
            )}
          </h1>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginLeft: 14 }}>
          Cross-module alert feed — real-time anomalies, warnings & operational events
        </p>
      </div>

      {/* Summary stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: 10,
        marginBottom: 20,
      }}>
        {[
          { label: 'Active', count: counts.active, color: 'var(--red)' },
          { label: 'Acknowledged', count: counts.acknowledged, color: 'var(--amber)' },
          { label: 'Resolved', count: counts.resolved, color: 'var(--green)' },
          { label: 'Critical', count: counts.critical, color: 'var(--red)' },
          { label: 'Warning', count: counts.warning, color: 'var(--amber)' },
          { label: 'Info', count: counts.info, color: 'var(--blue)' },
        ].map((s) => (
          <div key={s.label} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '12px 16px',
            boxShadow: 'var(--shadow)',
          }}>
            <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 4 }}>
              {s.label}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 700, color: s.color, lineHeight: 1 }}>
              {s.count}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ marginBottom: 20 }}>
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <svg width="16" height="16" fill="none" stroke="var(--text-muted)" strokeWidth="1.75" viewBox="0 0 24 24"
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search alerts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 38px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: '13px',
              color: 'var(--text)',
              fontFamily: 'var(--font-sans)',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color var(--transition)',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--blue)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        {/* Severity filters */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
          <FilterPill label="All Severity" active={filterSeverity === 'all'} onClick={() => setFilterSeverity('all')} count={alerts.length} />
          <FilterPill label="Critical" active={filterSeverity === 'critical'} color="var(--red)" onClick={() => setFilterSeverity('critical')} count={counts.critical} />
          <FilterPill label="Warning" active={filterSeverity === 'warning'} color="var(--amber)" onClick={() => setFilterSeverity('warning')} count={counts.warning} />
          <FilterPill label="Info" active={filterSeverity === 'info'} color="var(--blue)" onClick={() => setFilterSeverity('info')} count={counts.info} />
        </div>

        {/* Status + Module filters */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <FilterPill label="All Status" active={filterStatus === 'all'} onClick={() => setFilterStatus('all')} />
          <FilterPill label="Active" active={filterStatus === 'active'} color="var(--red)" onClick={() => setFilterStatus('active')} />
          <FilterPill label="Acknowledged" active={filterStatus === 'acknowledged'} color="var(--amber)" onClick={() => setFilterStatus('acknowledged')} />
          <FilterPill label="Resolved" active={filterStatus === 'resolved'} color="var(--green)" onClick={() => setFilterStatus('resolved')} />
          <div style={{ width: 1, background: 'var(--border)', margin: '0 4px' }} />
          <FilterPill label="All Modules" active={filterModule === 'all'} onClick={() => setFilterModule('all')} />
          <FilterPill label="CastX" active={filterModule === 'castx'} color="var(--blue)" onClick={() => setFilterModule('castx')} />
          <FilterPill label="EAF" active={filterModule === 'eaf'} color="var(--amber)" onClick={() => setFilterModule('eaf')} />
          <FilterPill label="DRI" active={filterModule === 'dri'} color="var(--green)" onClick={() => setFilterModule('dri')} />
        </div>
      </div>

      {/* Alert list */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{
              height: 72, background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          ))}
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 24px',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          color: 'var(--text-muted)', fontSize: '14px',
        }}>
          <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ marginBottom: 12, opacity: 0.4 }}>
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>No alerts match your filters</div>
          <div style={{ fontSize: '13px' }}>Try adjusting your search or filter criteria</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: 2 }}>
            Showing {filteredAlerts.length} of {alerts.length} alerts
          </div>
          {filteredAlerts.map((a) => (
            <AlertCard
              key={a.id}
              alert={a}
              onAcknowledge={handleAcknowledge}
              onResolve={handleResolve}
            />
          ))}
        </div>
      )}
    </div>
  );
}

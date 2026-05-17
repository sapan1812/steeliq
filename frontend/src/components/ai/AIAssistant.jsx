import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────
   CSS INJECTION — mirrors prototype .ai-* classes exactly
───────────────────────────────────────────────────────── */
const AI_CSS = `
@keyframes ai-pulse {
  0%,100% { filter: drop-shadow(0 0 4px rgba(160,80,255,0.6)); }
  50%      { filter: drop-shadow(0 0 10px rgba(160,80,255,0.9)); }
}
@keyframes ai-think {
  0%,60%,100% { transform: translateY(0); opacity: 0.3; }
  30%          { transform: translateY(-4px); opacity: 1; }
}
.ai-tab {
  position:fixed; right:0; top:50%; transform:translateY(-50%);
  z-index:60; display:flex; flex-direction:column; align-items:center;
  justify-content:center; gap:6px;
  background:linear-gradient(180deg,rgba(80,40,255,0.18),rgba(120,60,255,0.22));
  border:1px solid rgba(160,80,255,0.35); border-right:none;
  border-radius:10px 0 0 10px; padding:14px 8px; cursor:pointer;
  transition:all .25s; backdrop-filter:blur(12px);
  box-shadow:-4px 0 24px rgba(120,60,255,0.18);
}
.ai-tab:hover {
  background:linear-gradient(180deg,rgba(100,50,255,0.28),rgba(140,70,255,0.32));
  box-shadow:-6px 0 32px rgba(120,60,255,0.3);
}
.ai-tab-label {
  writing-mode:vertical-rl; font-size:9px; font-weight:700;
  letter-spacing:2px; color:var(--purple); text-transform:uppercase; opacity:.85;
}
.ai-tab-icon { font-size:16px; animation:ai-pulse 3s infinite; }
.ai-panel {
  position:fixed; right:0; top:0; bottom:0; width:380px; z-index:59;
  background:var(--ai-bg, rgba(10,14,26,0.97));
  border-left:1px solid rgba(160,80,255,0.2);
  display:flex; flex-direction:column;
  transform:translateX(100%);
  transition:transform .3s cubic-bezier(.4,0,.2,1);
  backdrop-filter:blur(20px);
  box-shadow:-8px 0 48px rgba(0,0,0,0.4);
}
.ai-panel.open { transform:translateX(0); }
.ai-panel-header {
  padding:14px 16px 10px;
  border-bottom:1px solid rgba(160,80,255,0.15);
  flex-shrink:0;
  background:linear-gradient(180deg,rgba(120,60,255,0.08),transparent);
}
.ai-panel-title { display:flex; align-items:center; justify-content:space-between; margin-bottom:2px; }
.ai-panel-name  { font-size:14px; font-weight:700; display:flex; align-items:center; gap:8px; }
.ai-panel-sub   { font-size:10px; color:var(--text-dim); letter-spacing:.5px; }
.ai-close {
  background:none; border:none; color:var(--text-dim); cursor:pointer;
  font-size:18px; line-height:1; padding:2px 6px; border-radius:5px; transition:all .15s;
}
.ai-close:hover { color:var(--text); background:var(--surface-3, rgba(255,255,255,0.08)); }
.ai-search-wrap {
  padding:10px 14px; border-bottom:1px solid rgba(160,80,255,0.1); flex-shrink:0;
}
.ai-search {
  display:flex; align-items:center; gap:8px;
  background:rgba(160,80,255,0.07); border:1px solid rgba(160,80,255,0.2);
  border-radius:8px; padding:8px 12px; transition:border-color .2s;
}
.ai-search:focus-within {
  border-color:rgba(160,80,255,0.45);
  box-shadow:0 0 0 3px rgba(160,80,255,0.08);
}
.ai-search-input {
  background:none; border:none; outline:none; color:var(--text);
  font-family:var(--mono,'JetBrains Mono',monospace); font-size:11px; flex:1;
}
.ai-search-input::placeholder { color:var(--text-dim); }
.ai-ask-btn {
  padding:4px 11px; border-radius:5px; font-size:10px; font-weight:700;
  background:linear-gradient(135deg,var(--purple,#a060ff),oklch(60% 0.22 270deg));
  color:#fff; border:none; cursor:pointer; white-space:nowrap; transition:opacity .2s;
}
.ai-ask-btn:hover { opacity:.85; }
.ai-body { flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:0; }
.ai-section-head {
  display:flex; align-items:center; gap:8px; padding:10px 14px 6px;
  position:sticky; top:0;
  background:var(--ai-bg-sticky, rgba(10,14,26,0.97));
  z-index:1; backdrop-filter:blur(8px);
}
.ai-section-label {
  font-size:9px; font-weight:700; text-transform:uppercase;
  letter-spacing:1.5px; color:var(--text-dim); flex:1;
}
.ai-section-count {
  font-family:var(--mono,'JetBrains Mono',monospace); font-size:9px;
  color:var(--text-dim); background:var(--surface-2,rgba(255,255,255,0.06));
  padding:1px 6px; border-radius:3px;
}
.ai-module-group { margin-bottom:2px; }
.ai-module-head {
  display:flex; align-items:center; gap:9px; padding:8px 14px;
  cursor:pointer; transition:background .15s; border-left:2px solid transparent;
}
.ai-module-head:hover { background:var(--surface-1,rgba(255,255,255,0.04)); }
.ai-module-head.active-group {
  border-left-color:var(--purple,#a060ff);
  background:rgba(160,80,255,0.05);
}
.ai-module-icon {
  width:24px; height:24px; border-radius:6px; display:flex;
  align-items:center; justify-content:center; font-size:11px; font-weight:800; flex-shrink:0;
}
.ai-module-label { font-size:11px; font-weight:600; flex:1; color:var(--text-mid); }
.ai-module-badge { font-size:8px; font-weight:700; padding:1px 5px; border-radius:3px; letter-spacing:.5px; }
.ai-mod-chevron { font-size:9px; color:var(--text-dim); transition:transform .2s; opacity:.5; }
.ai-mod-chevron.open { transform:rotate(90deg); }
.ai-sub-list { overflow:hidden; max-height:0; transition:max-height .22s ease; }
.ai-sub-list.open { max-height:600px; }
.ai-sub-item {
  display:flex; align-items:center; gap:8px; padding:6px 14px 6px 47px;
  cursor:pointer; transition:all .12s; border-left:2px solid transparent;
}
.ai-sub-item:hover { background:var(--surface-1,rgba(255,255,255,0.04)); color:var(--text); }
.ai-sub-item.active {
  border-left-color:var(--purple,#a060ff);
  background:rgba(160,80,255,0.07); color:var(--purple,#a060ff);
}
.ai-sub-dot { width:4px; height:4px; border-radius:50%; background:currentColor; flex-shrink:0; opacity:.7; }
.ai-sub-label { font-size:11px; flex:1; }
.ai-sub-tag { font-size:8px; font-weight:600; padding:1px 5px; border-radius:2px; white-space:nowrap; }
.ai-result-box {
  margin:10px 0 0; background:rgba(160,80,255,0.05);
  border:1px solid rgba(160,80,255,0.18); border-radius:8px; padding:12px;
}
.ai-result-hd {
  font-size:10px; font-weight:700; color:var(--purple,#a060ff);
  margin-bottom:8px; display:flex; align-items:center; gap:5px;
}
.ai-result-body { font-size:11px; color:var(--text-mid); line-height:1.7; }
.ai-thinking { display:flex; gap:4px; align-items:center; padding:8px 0; }
.ai-thinking-dot {
  width:5px; height:5px; border-radius:50%;
  background:var(--purple,#a060ff); animation:ai-think 1.2s infinite;
}
.ai-insight-card {
  margin:0 14px 6px;
  background:var(--surface-1,rgba(255,255,255,0.04));
  border:1px solid var(--surface-3,rgba(255,255,255,0.08));
  border-radius:7px; padding:10px 12px; cursor:pointer; transition:all .15s;
}
.ai-insight-card:hover {
  background:var(--surface-2,rgba(255,255,255,0.06));
  border-color:rgba(160,80,255,0.2);
}
.ai-insight-head { display:flex; align-items:center; gap:6px; margin-bottom:4px; }
.ai-insight-title { font-size:11px; font-weight:600; }
.ai-insight-desc { font-size:10px; color:var(--text-dim); line-height:1.5; }
.ai-insight-sev { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
@media(max-width:700px) {
  .ai-panel { width:100vw; }
  .ai-tab   { display:none; }
}
`;

/* ─────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────── */
const ALL_MODULES_FLAT = [
  { mod:'overview', sub:null, label:'Command Center', icon:'◈', color:'var(--text-mid)', points:[
    {t:'Production Flow',d:'Full DRI→EAF→LF→Cast animated flow with live KPIs'},
    {t:'QEG Health Scores',d:'Quality, Energy & Gas composite score rings'},
    {t:'Active Alerts',d:'Critical event feed across all processes'},
  ]},
  { mod:'castx', sub:'outlier-detection', label:'Outlier Detection', icon:'Q', color:'var(--blue,#4a7fff)', points:[
    {t:'Tundish Temp Monitor',d:'Statistical ±2σ bounds on 40-sample window'},
    {t:'Mould Level Anomaly',d:'Oscillation tracking and deviation detection'},
    {t:'Root Cause Analysis',d:'Auto-correlated root cause with corrective actions'},
  ]},
  { mod:'castx', sub:'defect-prediction', label:'Defect Prediction', icon:'Q', color:'var(--blue,#4a7fff)', points:[
    {t:'Web Cracks Risk',d:'ML model predicting strand-level crack probability'},
    {t:'Seam & Surface Defects',d:'Supervised model trained on 18,400 heats'},
    {t:'Strand Comparison',d:'Side-by-side strand speed and risk scoring'},
  ]},
  { mod:'castx', sub:'snapshot', label:'Snapshot Visualization', icon:'Q', color:'var(--blue,#4a7fff)', points:[
    {t:'Live Arc Gauges',d:'Tundish temp, mould level, cast speed, oil flow'},
    {t:'Breakout Indicators',d:'Sticker alarm, friction, shell thickness monitoring'},
    {t:'Heat Info',d:'Grade, section, elapsed time, active strands'},
  ]},
  { mod:'castx', sub:'nlp-analytics', label:'NLP Analytics', icon:'Q', color:'var(--blue,#4a7fff)', points:[
    {t:'Natural Language Query',d:'Ask about any casting parameter in plain English'},
    {t:'Suggested Prompts',d:'Pre-built queries for common operational questions'},
    {t:'Query History',d:'Audit trail of all NLP interactions by user'},
  ]},
  { mod:'castx', sub:'time-series', label:'Time-Series Prediction', icon:'Q', color:'var(--blue,#4a7fff)', points:[
    {t:'Actual vs Predicted',d:'60-minute forecast horizon with MAPE <1%'},
    {t:'Per-Strand Forecast',d:'Individual speed & quality predictions per strand'},
    {t:'Dashed Prediction Line',d:'Probabilistic forecast with confidence bounds'},
  ]},
  { mod:'eaf', sub:'energy', label:'Energy Optimization', icon:'E', color:'var(--amber,#ffa528)', points:[
    {t:'Power Curve Monitor',d:'Live kWh/ton vs target 390 kWh/ton baseline'},
    {t:'Cycle Phase Analysis',d:'Bore-in, Main Melt, Flat Bath energy breakdown'},
    {t:'AI Recommendations',d:'Dynamic charge mix and power curve adjustments'},
  ]},
  { mod:'eaf', sub:'arc-stability', label:'Arc Stability', icon:'E', color:'var(--amber,#ffa528)', points:[
    {t:'3-Phase Monitoring',d:'Phase A/B/C stability gauges with live fluctuation'},
    {t:'Voltage Analysis',d:'THD harmonics, impedance and reactive power tracking'},
    {t:'Electrode Breakage Risk',d:'Predictive arc length and wear correlation'},
  ]},
  { mod:'eaf', sub:'charge-mix', label:'Charge Mix', icon:'E', color:'var(--amber,#ffa528)', points:[
    {t:'DRI vs Scrap Ratio',d:'Current vs AI-recommended charge composition'},
    {t:'Cost Optimization',d:'Energy saving projection from mix changes'},
    {t:'Hot Metal %',d:'Liquid iron percentage and its impact on efficiency'},
  ]},
  { mod:'eaf', sub:'tap-to-tap', label:'Tap-to-Tap Time', icon:'E', color:'var(--amber,#ffa528)', points:[
    {t:'Heat Duration Tracker',d:'Current vs target 42-minute cycle time'},
    {t:'Historical Comparison',d:'Last 8 heats color-coded against target'},
    {t:'Weekly Trend',d:'Average tap time vs previous week benchmark'},
  ]},
  { mod:'eaf', sub:'maintenance', label:'Predictive Maintenance', icon:'E', color:'var(--amber,#ffa528)', points:[
    {t:'Electrode Health',d:'Set A/B wear percentage with replacement windows'},
    {t:'Transformer Status',d:'T1/T2 health scores and inspection schedules'},
    {t:'Furnace Lining',d:'Refractory condition and remaining service life'},
  ]},
  { mod:'dri', sub:'gas-consumption', label:'Gas Consumption', icon:'G', color:'var(--green,#3acc7a)', points:[
    {t:'Real-time Flow Monitor',d:'Live Nm³/h vs optimal 26,500–29,000 range'},
    {t:'Zone Efficiency',d:'Reduction, transition & cooling zone performance'},
    {t:'Gas-to-Iron Ratio',d:'Consumption efficiency and daily cost tracking'},
  ]},
  { mod:'dri', sub:'metallization', label:'Metallization Prediction', icon:'G', color:'var(--green,#3acc7a)', points:[
    {t:'% Metallization Forecast',d:'1-hour ahead prediction with 96.4% confidence'},
    {t:'Actual vs Predicted',d:'Overlay chart with dashed forecast line'},
    {t:'Iron Ore Grade Input',d:'Fe% and reduction time correlation analysis'},
  ]},
  { mod:'dri', sub:'temperature', label:'Temperature Profile', icon:'G', color:'var(--green,#3acc7a)', points:[
    {t:'Zone 1–3 + Cooling',d:'Per-zone target vs actual temperature bars'},
    {t:'Deviation Alerts',d:'Color-coded deviation from optimal profile'},
    {t:'Profile Trend',d:'Historical zone temperature stability tracking'},
  ]},
  { mod:'dri', sub:'yield', label:'Process Yield', icon:'G', color:'var(--green,#3acc7a)', points:[
    {t:'Yield Rate',d:'Output iron vs input ore efficiency percentage'},
    {t:'Waste & Fines Loss',d:'Unreacted ore and fines tonnage breakdown'},
    {t:'Output Rate',d:'t/h production rate vs 145 t/h target'},
  ]},
  { mod:'dri', sub:'anomaly', label:'Anomaly Detection', icon:'G', color:'var(--green,#3acc7a)', points:[
    {t:'ML Anomaly Scores',d:'6 DRI parameters with real-time anomaly scoring'},
    {t:'Pressure Anomaly',d:'Zone 3 pressure deviation flagged at 0.61 bar'},
    {t:'Auto-Recovery',d:'Self-healing detection with corrective recommendations'},
  ]},
  { mod:'admin', sub:'module-registry', label:'Module Registry', icon:'⚙', color:'var(--purple,#a060ff)', points:[
    {t:'Installed Microapps',d:'CastX, EAF, DRI/DRP + planned LadleX & YardLogix'},
    {t:'Install New Module',d:'4-step wizard: identity, data bindings, RBAC, deploy'},
    {t:'Enable / Disable / Update',d:'Toggle module status without redeploying the shell'},
  ]},
  { mod:'admin', sub:'architecture', label:'Platform Architecture', icon:'⚙', color:'var(--purple,#a060ff)', points:[
    {t:'Shell → Microapps → Data',d:'Three-tier topology with live data flow lines'},
    {t:'Shell Mount Lifecycle',d:'Registry → RBAC → Manifest fetch → Data subscribe → AI register'},
    {t:'Platform SLOs',d:'Cold-mount <400ms · IBA→UI <350ms · Uptime 99.94%'},
  ]},
  { mod:'admin', sub:'data-sources', label:'Data Sources', icon:'⚙', color:'var(--purple,#a060ff)', points:[
    {t:'IBA Historian',d:'REST API / Direct URL / SQL Pull modes — sensor time-series'},
    {t:'Level 2 Systems',d:'OPC-UA / Direct URL / MQTT — recipes & setpoints'},
    {t:'Channel Routing',d:'Live IBA + L2 tag → microapp subscription map'},
  ]},
  { mod:'admin', sub:'ai-config', label:'AI Model Config', icon:'⚙', color:'var(--purple,#a060ff)', points:[
    {t:'Model Endpoint',d:'Configure REST API URL for ML inference engine'},
    {t:'API Key Management',d:'Masked key storage with test connection'},
    {t:'NLP Engine',d:'Separate endpoint config for natural language queries'},
  ]},
  { mod:'admin', sub:'users', label:'User Management', icon:'⚙', color:'var(--purple,#a060ff)', points:[
    {t:'Onboard Users',d:'Create accounts with role assignment and department'},
    {t:'Enable / Disable',d:'Toggle user access without deleting accounts'},
    {t:'RBAC Matrix',d:'5 roles controlling visibility of microapps'},
  ]},
  { mod:'admin', sub:'self-support', label:'Self-Support', icon:'⚙', color:'var(--purple,#a060ff)', points:[
    {t:'NLP Log Query',d:'Ask about errors, performance and connections'},
    {t:'Live App Logs',d:'Color-coded ERROR / WARN / INFO log feed'},
    {t:'ML Model Health',d:'Memory, accuracy and inference time monitoring'},
  ]},
  { mod:'alerts', sub:null, label:'Alerts', icon:'!', color:'var(--red,#ff4a4a)', points:[
    {t:'Critical Events',d:'3 active: Web Crack, Electrode Wear, Gas Pressure'},
    {t:'Warnings',d:'2 active: Arc Instability, Tundish Temp trending high'},
    {t:'Info Events',d:'AI charge mix optimization applied, T2 maintenance OK'},
  ]},
];

const GROUP_META = {
  overview: { label:'Command Center',    icon:'◈', color:'var(--text-mid)' },
  castx:    { label:'Quality — CastX',   icon:'Q', color:'var(--blue,#4a7fff)' },
  eaf:      { label:'Electrical — EAF',  icon:'E', color:'var(--amber,#ffa528)' },
  dri:      { label:'Gas — DRI',         icon:'G', color:'var(--green,#3acc7a)' },
  admin:    { label:'Administration',    icon:'⚙', color:'var(--purple,#a060ff)' },
  alerts:   { label:'Alerts',            icon:'!', color:'var(--red,#ff4a4a)' },
};

const AI_ANSWERS = {
  'web crack':   '🔬 Web Crack Analysis:\nStrand 2 showing 63% crack probability — elevated tundish superheat (31°C vs target 22–28°C) is the primary driver. ML model confidence: 94.2%.\nImmediate action: reduce heat input by 8–10°C.\nExpected risk drop: to <35% within 2 heats.',
  'energy':      '⚡ EAF Energy Deep Dive:\nCurrent 412 kWh/ton (+5.6% over 390 target). Main Melt phase consuming 238 vs 220 target kWh/t. Arc Phase B instability adding ~15 kWh/t.\nRecommended fix: increase DRI% to 72%, adjust power curve at minute 4.\nProjected saving: 14 kWh/ton.',
  'gas':         '🔥 DRI Gas Status:\nNatural gas at 28,400 Nm³/h — 1.4% above optimal ceiling. Zone 3 pressure at 0.61 bar (threshold: 0.55). Gas/iron ratio 1.42 within range. Daily consumption: 682,000 Nm³.\nRecommend: reduce flow by 380 Nm³/h, inspect Zone 3 distributor.',
  'metalliz':    '🔬 Metallization Forecast:\nCurrent: 92.4% (target >91%) ✓. Zone 3 temperature running 8°C below profile — minor intervention needed.\n1-hour forecast: 91.8% → 93.1% (improving trend). Iron ore grade: Fe 65.2%. Reduction time: 5.8 hours.\nNo action required if Zone 3 corrected.',
  'outlier':     '🔍 Active Outliers (CastX):\n• Cast speed spike Strand 1: +0.18 m/min @ 02:07 (resolved)\n• Mould oil flow: 2.6 L/min @ 01:44 (below 2.8 threshold)\n• Tundish temp: 1582°C @ 01:12 (upper limit breach)\n• EAF current Phase A: +12% @ 00:58 (auto-corrected)\nML model confidence: 97.2%',
  'electrode':   '🔧 Electrode Status:\nSet A: 82% health — 8h 20min to service. Set B: 32% health — CRITICAL — replacement in 3h 40min.\nRecommend staging replacement unit now. Phase B arc instability (±8% voltage) correlates with Set B degradation.',
  'yield':       '📊 Yield Analysis:\nCurrent DRI yield: 94.2% (↑ +0.3% vs baseline). Waste rate: 5.8%. Output: 142 t/h vs 145 t/h target.\nUnreacted ore: 4.8t, fines loss: 2.1t.\nImprovement lever: Zone 3 temperature correction would add ~0.5% yield.',
  'alert':       '🚨 Active Alerts Summary:\n3 Critical: Web Crack S2 (63%), Electrode Set B wear (68%), Gas Zone 3 pressure (0.61 bar)\n2 Warnings: Arc Instability Phase B, Tundish temp trending high\n2 Info: AI charge mix optimized (+DRI 71%), Transformer T2 health OK (94%)',
  'castx':       '📐 CastX Overview:\n5 active submodules monitoring continuous casting quality. Current heat #2847 (Grade B500B, 130×130mm). 3 strands active.\nKey concern: Strand 2 web crack risk 63%. Mould level stable at 144mm. Cast speed 1.4 m/min. Superheat: 29°C.',
  'eaf':         '⚡ EAF Overview:\nHeat #2847 in progress. 412 kWh/ton (+5.6% over target). Arc stability: Phase A 89%, Phase B 82% (↓), Phase C 91%. Tap-to-tap: 44 min (target 42).\nElectrode Set B at 32% health — critical. Transformer T1/T2 healthy.',
  'dri':         '🔥 DRI Overview:\nGas reduction active. Metallization: 92.4% ✓. Gas flow: 28,400 Nm³/h (slightly high). Zone 3 pressure anomaly at 0.61 bar.\nZone temperatures: Z1 820°C, Z2 890°C, Z3 956°C (−8°C deviation). Yield: 94.2%.',
  'arc':         '⚡ Arc Stability Report:\nPhase A: 89% stability. Phase B: 82% (degraded — Set B electrode wear). Phase C: 91%.\nVoltage fluctuation: ±8.2%. THD: 4.2% (normal). Arc length: 12.4mm.\nRecommend: prioritize electrode replacement to restore Phase B.',
  'heat':        '🔥 Heat #2847 Status:\nGrade B500B · Section 130×130mm · Elapsed 00:44:12.\nAll 3 strands active. Mould level: 144mm (stable). Cast speed: 1.40 m/min. Tundish: 1550°C.\nNet status: CAUTION — Strand 2 web crack risk elevated.',
  'charge':      '⚡ Charge Mix Recommendation:\nCurrent: DRI 68%, Scrap Heavy 22%, Scrap Light 8%, Hot Metal 2%.\nAI Recommended: DRI 72% (+4%), Scrap Heavy 18% (−4%).\nProjected benefit: save 14 kWh/ton · reduce tap-to-tap by 2.5 min.',
  'default':     '🤖 SteelIQ AI:\nAll systems monitored. 3 critical alerts active. Overall QEG scores: Quality 88/100, Energy 79/100, Gas 94/100.\nNext recommended action: address Strand 2 web crack risk by reducing tundish superheat.\nEAF electrode Set B replacement due in 3h 40min.',
};

const INSIGHTS = [
  { sev:'crit', title:'Strand 2 — Web Crack 63%',    desc:'Tundish superheat 31°C. Reduce by 8°C immediately.',      mod:'castx', sub:'defect-prediction' },
  { sev:'crit', title:'Electrode Set B Critical',     desc:'32% health. Replacement in 3h 40min. Stage unit now.',    mod:'eaf',   sub:'maintenance' },
  { sev:'warn', title:'EAF Over Target +5.6%',        desc:'412 kWh/t vs 390 target. Increase DRI to 72%.',          mod:'eaf',   sub:'energy' },
  { sev:'warn', title:'Zone 3 Pressure Anomaly',      desc:'0.61 bar — above 0.55 limit. Check distributor.',        mod:'dri',   sub:'anomaly' },
  { sev:'ok',   title:'Metallization On Track',       desc:'92.4% — above 91% target. Forecast improving.',         mod:'dri',   sub:'metallization' },
  { sev:'ok',   title:'AI Charge Mix Applied',        desc:'DRI 71% ratio saving 12 kWh/ton this heat.',            mod:'eaf',   sub:'charge-mix' },
];

const QUICK_PROMPTS = [
  'EAF power efficiency today',
  'Cast defect risk',
  'DRI metallization rate',
  'Arc stability score',
  'Active alerts summary',
  'Heat #2847 status',
  'Recommend charge mix',
  'Top energy savings',
];

/* ─────────────────────────────────────────────────────────
   MODULE → ROUTE MAPPING
───────────────────────────────────────────────────────── */
function toRoute(mod, sub) {
  if (mod === 'overview') return '/app';
  if (mod === 'alerts')   return '/app/alerts';
  if (mod === 'castx')    return sub ? `/app/castx/${sub}` : '/app/castx';
  if (mod === 'eaf')      return sub ? `/app/eaf/${sub}`   : '/app/eaf';
  if (mod === 'dri')      return sub ? `/app/dri/${sub}`   : '/app/dri';
  if (mod === 'admin')    return sub ? `/app/admin/${sub}` : '/app/admin';
  return '/app';
}

/* ─────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────── */
export default function AIAssistant() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const [open,       setOpen]       = useState(false);
  const [activeTab,  setActiveTab]  = useState('ask');   // 'ask' | 'modules'
  const [query,      setQuery]      = useState('');
  const [result,     setResult]     = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [expanded,   setExpanded]   = useState({});
  const [filter,     setFilter]     = useState('');

  const inputRef = useRef(null);

  // Inject CSS once
  useEffect(() => {
    const id = 'ai-assistant-css';
    if (!document.getElementById(id)) {
      const tag = document.createElement('style');
      tag.id = id;
      tag.textContent = AI_CSS;
      document.head.appendChild(tag);
    }
    return () => {};
  }, []);

  // Focus input when panel opens
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  // Derive active module/sub from route
  const activeMod = useMemo(() => {
    const p = location.pathname;
    if (p === '/app' || p === '/app/') return 'overview';
    if (p.startsWith('/app/castx')) return 'castx';
    if (p.startsWith('/app/eaf'))   return 'eaf';
    if (p.startsWith('/app/dri'))   return 'dri';
    if (p.startsWith('/app/admin')) return 'admin';
    if (p.startsWith('/app/alerts'))return 'alerts';
    return null;
  }, [location.pathname]);

  const activeSub = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    return parts[2] || null;
  }, [location.pathname]);

  // Ask AI
  const ask = useCallback((q = query) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const key = Object.keys(AI_ANSWERS).find(k => trimmed.toLowerCase().includes(k)) || 'default';
      setResult(AI_ANSWERS[key]);
      setLoading(false);
    }, 900);
  }, [query]);

  // Navigate to a module
  const goToModule = useCallback((mod, sub) => {
    navigate(toRoute(mod, sub));
    setOpen(false);
  }, [navigate]);

  // Build groups for the tree
  const groups = useMemo(() => {
    const g = {};
    ALL_MODULES_FLAT.forEach(m => {
      if (!g[m.mod]) {
        g[m.mod] = { ...GROUP_META[m.mod], mod: m.mod, items: [] };
      }
      g[m.mod].items.push(m);
    });
    return Object.values(g);
  }, []);

  // Filtered flat list for search
  const filteredItems = useMemo(() => {
    if (!filter) return [];
    const lf = filter.toLowerCase();
    return ALL_MODULES_FLAT.filter(m =>
      m.label.toLowerCase().includes(lf) ||
      m.points.some(p => p.t.toLowerCase().includes(lf))
    );
  }, [filter]);

  const sevColor = s => s === 'crit' ? 'var(--red,#ff4a4a)' : s === 'warn' ? 'var(--amber,#ffa528)' : 'var(--green,#3acc7a)';

  const critCount = INSIGHTS.filter(i => i.sev === 'crit').length;

  return (
    <>
      {/* ── Collapsed tab ── */}
      {!open && (
        <div className="ai-tab" onClick={() => setOpen(true)} title="Open SteelIQ AI Assistant">
          <div className="ai-tab-icon">✦</div>
          <div className="ai-tab-label">AI Assistant</div>
          {critCount > 0 && (
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              background: 'var(--red,#ff4a4a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 800, color: '#fff',
              border: '2px solid var(--bg2,#0f1726)',
              marginTop: 4,
            }}>
              {critCount}
            </div>
          )}
        </div>
      )}

      {/* ── Expanded panel ── */}
      <div className={`ai-panel${open ? ' open' : ''}`}>

        {/* Header */}
        <div className="ai-panel-header">
          <div className="ai-panel-title">
            <div className="ai-panel-name">
              <span style={{ fontSize: 16, animation: 'ai-pulse 3s infinite' }}>✦</span>
              <span>SteelIQ <span style={{ color: 'var(--purple,#a060ff)' }}>AI</span> Assistant</span>
            </div>
            <button className="ai-close" onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="ai-panel-sub">
            3 modules · 2 critical alerts · Heat #2847 active
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', borderBottom: '1px solid rgba(160,80,255,0.12)',
          flexShrink: 0,
        }}>
          {[
            { id: 'ask',     label: 'Ask AI' },
            { id: 'modules', label: 'Modules' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                flex: 1, padding: '9px 12px',
                background: 'none', border: 'none',
                borderBottom: `2px solid ${activeTab === t.id ? 'var(--purple,#a060ff)' : 'transparent'}`,
                color: activeTab === t.id ? 'var(--purple,#a060ff)' : 'var(--text-dim)',
                fontSize: 11, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'var(--sans,system-ui)', transition: 'all .2s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="ai-body">

          {/* ── ASK AI TAB ── */}
          {activeTab === 'ask' && (
            <>
              {/* Search bar */}
              <div className="ai-search-wrap">
                <div className="ai-search">
                  <span style={{ color: 'var(--purple,#a060ff)', fontSize: 14, flexShrink: 0 }}>⌘</span>
                  <input
                    ref={inputRef}
                    className="ai-search-input"
                    placeholder="Ask anything about the plant…"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && ask()}
                  />
                  <span style={{
                    fontSize: 9, color: 'var(--text-dim)', marginRight: 4,
                    fontFamily: 'var(--mono,monospace)',
                  }}>⌘K</span>
                  <button className="ai-ask-btn" onClick={() => ask()}>Ask</button>
                </div>

                {/* Quick prompts */}
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 7 }}>
                  {QUICK_PROMPTS.map(p => (
                    <span
                      key={p}
                      style={{
                        fontSize: 9, padding: '2px 8px', borderRadius: 12,
                        background: 'rgba(160,80,255,0.08)',
                        border: '1px solid rgba(160,80,255,0.18)',
                        color: 'var(--purple,#a060ff)', cursor: 'pointer',
                        transition: 'all .15s', whiteSpace: 'nowrap',
                      }}
                      onClick={() => { setQuery(p); ask(p); }}
                    >
                      {p}
                    </span>
                  ))}
                </div>

                {/* Thinking indicator */}
                {loading && (
                  <div className="ai-thinking">
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        className="ai-thinking-dot"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                    <span style={{ fontSize: 10, color: 'var(--text-dim)', marginLeft: 4 }}>
                      Analyzing plant data…
                    </span>
                  </div>
                )}

                {/* AI response */}
                {result && (
                  <div className="ai-result-box">
                    <div className="ai-result-hd">
                      <span>✦</span>
                      <span>AI Response</span>
                    </div>
                    <div className="ai-result-body">
                      {result.split('\n').map((line, i) => (
                        <div key={i} style={{ marginBottom: line.startsWith('•') ? 3 : 0 }}>
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* AI Insights section */}
              <div className="ai-section-head">
                <div className="ai-section-label">AI Insights</div>
                <div className="ai-section-count">{INSIGHTS.length}</div>
              </div>
              <div style={{ paddingBottom: 8 }}>
                {INSIGHTS.map((ins, i) => (
                  <div
                    key={i}
                    className="ai-insight-card"
                    onClick={() => goToModule(ins.mod, ins.sub)}
                  >
                    <div className="ai-insight-head">
                      <div
                        className="ai-insight-sev"
                        style={{
                          background: sevColor(ins.sev),
                          boxShadow: `0 0 6px ${sevColor(ins.sev)}66`,
                        }}
                      />
                      <div
                        className="ai-insight-title"
                        style={{ color: sevColor(ins.sev) }}
                      >
                        {ins.title}
                      </div>
                      <span style={{
                        marginLeft: 'auto', fontSize: 9,
                        color: 'var(--text-dim)',
                        fontFamily: 'var(--mono,monospace)',
                      }}>
                        {ins.mod.toUpperCase()}
                      </span>
                    </div>
                    <div className="ai-insight-desc">{ins.desc}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── MODULES TAB ── */}
          {activeTab === 'modules' && (
            <>
              {/* Filter input */}
              <div style={{ padding: '8px 14px', flexShrink: 0 }}>
                <input
                  style={{
                    width: '100%',
                    background: 'var(--surface-2,rgba(255,255,255,0.06))',
                    border: '1px solid var(--border,rgba(255,255,255,0.1))',
                    borderRadius: 6, padding: '6px 10px',
                    color: 'var(--text)', outline: 'none',
                    fontFamily: 'var(--mono,monospace)', fontSize: 11,
                    boxSizing: 'border-box',
                  }}
                  placeholder="Filter modules…"
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                />
              </div>

              {filter ? (
                /* Flat search results */
                <>
                  <div className="ai-section-head">
                    <div className="ai-section-label">Search Results</div>
                    <div className="ai-section-count">{filteredItems.length}</div>
                  </div>
                  {filteredItems.map((m, i) => (
                    <div
                      key={i}
                      className={`ai-sub-item${activeMod === m.mod && activeSub === m.sub ? ' active' : ''}`}
                      style={{ paddingLeft: 14 }}
                      onClick={() => { goToModule(m.mod, m.sub); setFilter(''); }}
                    >
                      <div style={{
                        width: 20, height: 20, borderRadius: 5,
                        background: `color-mix(in srgb, ${m.color} 15%, transparent)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 800, color: m.color, flexShrink: 0,
                      }}>
                        {m.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-mid)' }}>
                          {m.label}
                        </div>
                        <div style={{ fontSize: 9, color: 'var(--text-dim)' }}>
                          {m.points[0]?.t}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                /* Hierarchical tree */
                <>
                  <div className="ai-section-head">
                    <div className="ai-section-label">All Modules</div>
                    <div className="ai-section-count">{ALL_MODULES_FLAT.length}</div>
                  </div>

                  {groups.map(g => (
                    <div key={g.mod} className="ai-module-group">
                      <div
                        className={`ai-module-head${activeMod === g.mod ? ' active-group' : ''}`}
                        onClick={() => setExpanded(p => ({ ...p, [g.mod]: !p[g.mod] }))}
                      >
                        <div
                          className="ai-module-icon"
                          style={{
                            background: `rgba(0,0,0,0.15)`,
                            color: g.color,
                            border: `1px solid ${g.color}33`,
                          }}
                        >
                          {g.icon}
                        </div>
                        <div
                          className="ai-module-label"
                          style={{ color: activeMod === g.mod ? 'var(--text)' : 'var(--text-mid)' }}
                        >
                          {g.label}
                        </div>
                        <div style={{ fontSize: 9, color: 'var(--text-dim)', marginRight: 4 }}>
                          {g.items.length}
                        </div>
                        <div className={`ai-mod-chevron${expanded[g.mod] ? ' open' : ''}`}>▶</div>
                      </div>

                      <div className={`ai-sub-list${expanded[g.mod] ? ' open' : ''}`}>
                        {g.items.map((item, ii) => {
                          const isActive = activeMod === item.mod && activeSub === item.sub;
                          return (
                            <div key={ii}>
                              <div
                                className={`ai-sub-item${isActive ? ' active' : ''}`}
                                onClick={() => goToModule(item.mod, item.sub)}
                              >
                                <div className="ai-sub-dot" />
                                <div
                                  className="ai-sub-label"
                                  style={{ color: isActive ? item.color : 'var(--text-mid)' }}
                                >
                                  {item.label}
                                </div>
                              </div>

                              {/* Key points for active item */}
                              {isActive && item.points.map((pt, pi) => (
                                <div
                                  key={pi}
                                  style={{
                                    padding: '5px 14px 5px 60px',
                                    background: 'rgba(160,80,255,0.03)',
                                    borderLeft: '2px solid rgba(160,80,255,0.12)',
                                  }}
                                >
                                  <div style={{ fontSize: 10, fontWeight: 600, color: item.color, marginBottom: 1 }}>
                                    → {pt.t}
                                  </div>
                                  <div style={{ fontSize: 9, color: 'var(--text-dim)', lineHeight: 1.4 }}>
                                    {pt.d}
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* AI Insights below tree */}
              <div className="ai-section-head" style={{ marginTop: 8 }}>
                <div className="ai-section-label">AI Insights</div>
                <div className="ai-section-count">{INSIGHTS.length}</div>
              </div>
              <div style={{ paddingBottom: 14 }}>
                {INSIGHTS.map((ins, i) => (
                  <div
                    key={i}
                    className="ai-insight-card"
                    onClick={() => goToModule(ins.mod, ins.sub)}
                  >
                    <div className="ai-insight-head">
                      <div
                        className="ai-insight-sev"
                        style={{
                          background: sevColor(ins.sev),
                          boxShadow: `0 0 6px ${sevColor(ins.sev)}66`,
                        }}
                      />
                      <div
                        className="ai-insight-title"
                        style={{ color: sevColor(ins.sev) }}
                      >
                        {ins.title}
                      </div>
                      <span style={{
                        marginLeft: 'auto', fontSize: 9,
                        color: 'var(--text-dim)',
                        fontFamily: 'var(--mono,monospace)',
                      }}>
                        {ins.mod.toUpperCase()}
                      </span>
                    </div>
                    <div className="ai-insight-desc">{ins.desc}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

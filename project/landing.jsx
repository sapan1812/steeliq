/* ══════════════════════════════════════════════════════════════
   SteelIQ — Marketing Landing Page
   Zealogics product. Renders before login.
   Exported to window.LandingPage for the host shell to mount.
══════════════════════════════════════════════════════════════ */
const { useState: lpUseState, useEffect: lpUseEffect, useRef: lpUseRef } = React;

const lpScroll = (id) => {
  const page = document.querySelector('.lp-page');
  const target = document.getElementById(id);
  if (page && target) {
    page.scrollTo({ top: Math.max(0, target.offsetTop - 70), behavior: 'smooth' });
  }
};

function LandingPage({ onLogin }) {
  return (
    <div className="lp-page" data-theme="light" data-screen-label="01 Marketing Landing">
      <LPNav onLogin={onLogin}/>
      <LPHero onLogin={onLogin}/>
      <LPTrustStrip/>
      <LPProcessCoverage/>
      <LPCapabilities/>
      <LPOutcomes/>
      <LPHowItWorks/>
      <LPAISection/>
      <LPMicroapps/>
      <LPLifecycle/>
      <LPIntegrations/>
      <LPCloud/>
      <LPTrial onLogin={onLogin}/>
      <LPContact/>
      <LPFooter onLogin={onLogin}/>
    </div>
  );
}

/* ── Nav ── */
function LPNav({ onLogin }) {
  return (
    <nav className="lp-nav">
      <div className="lp-nav-inner">
        <div className="lp-logo" onClick={() => lpScroll('top')}>
          <div className="lp-logo-mark">SQ</div>
          <div>
            <div className="lp-logo-text">Steel<em>IQ</em></div>
            <div className="lp-logo-sub">by Zealogics</div>
          </div>
        </div>
        <div className="lp-nav-links">
          {[
            { id: 'capabilities', label: 'Platform' },
            { id: 'ai', label: 'AI' },
            { id: 'integrations', label: 'Integrations' },
            { id: 'cloud', label: 'Cloud' },
            { id: 'trial', label: 'Trial & Pricing' },
          ].map(l => (
            <button key={l.id} className="lp-nav-link" onClick={() => lpScroll(l.id)}>{l.label}</button>
          ))}
        </div>
        <div className="lp-nav-right">
          <button className="lp-nav-secondary" onClick={() => lpScroll('contact')}>Contact</button>
          <button className="lp-btn lp-btn-primary" onClick={onLogin}>Login →</button>
        </div>
      </div>
    </nav>
  );
}

/* ── Hero ── */
function LPHero({ onLogin }) {
  return (
    <section className="lp-hero" id="top" data-screen-label="Hero">
      <div className="lp-hero-floats" aria-hidden="true">
        <div className="lp-float f1"/>
        <div className="lp-float f2"/>
      </div>
      <div className="lp-hero-grid">
        <div>
          <div className="lp-eyebrow">Industrial AI · by Zealogics</div>
          <h1 className="lp-h1">Industrial AI for the next era of <em>Steel Manufacturing</em></h1>
          <p className="lp-lead">
            From new product inception to final sales and end-customer management — <strong>SteelIQ</strong> by Zealogics unifies
            EAF, DRI/DRP, continuous casting and every downstream line under one intelligent platform.
            Save <strong>up to 19 kWh per hour</strong> on EAF energy, reduce slag, improve casting quality, and
            intelligently regulate gas injection on DRP — accessible globally, engineered for Middle East steelmakers.
          </p>
          <div className="lp-hero-cta">
            <button className="lp-btn lp-btn-primary lp-btn-lg" onClick={() => lpScroll('trial')}>Start Free Trial →</button>
            <button className="lp-btn lp-btn-ghost lp-btn-lg" onClick={() => lpScroll('contact')}>Talk to an Engineer</button>
          </div>
          <div className="lp-hero-stats">
            {[
              { v: '19 kWh/hr', l: 'EAF Energy Saved' },
              { v: '94.2%', l: 'Defect Prediction Accuracy' },
              { v: 'End-to-End', l: 'Inception → Customer' },
              { v: '99.94%', l: 'Platform Uptime' },
            ].map(s => (
              <div key={s.l}>
                <div className="lp-stat-val">{s.v}</div>
                <div className="lp-stat-label">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <LPHeroMock/>
      </div>
      <div className="lp-scroll-cue" aria-hidden="true">
        <div className="lp-scroll-cue-dot"/>
        <span>Scroll</span>
      </div>
    </section>
  );
}

function LPHeroMock() {
  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox="0 0 520 380" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 14, boxShadow: '0 24px 80px rgba(20,40,100,0.18), 0 0 0 1px rgba(20,40,100,0.06)' }}>
        <defs>
          <linearGradient id="hg-chart" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a78ff" stopOpacity=".5"/>
            <stop offset="100%" stopColor="#3a78ff" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {/* Window chrome */}
        <rect x="0" y="0" width="520" height="380" rx="14" fill="#0b1120"/>
        <rect x="0" y="0" width="520" height="34" fill="#111a2c"/>
        <rect x="0" y="20" width="520" height="14" fill="#111a2c"/>
        <circle cx="18" cy="17" r="5" fill="#ff5f56"/>
        <circle cx="36" cy="17" r="5" fill="#ffbd2e"/>
        <circle cx="54" cy="17" r="5" fill="#28c940"/>
        <text x="260" y="22" textAnchor="middle" fill="#5a6a8a" fontSize="10" fontFamily="'JetBrains Mono',monospace">app.steeliq.zealogics.com · Command Center</text>
        {/* Tabs */}
        {[
          { l: 'CastX', c: '#3a78ff', x: 16, w: 60, active: true },
          { l: 'EAF', c: '#ffa528', x: 84, w: 50 },
          { l: 'DRI/DRP', c: '#3acc7a', x: 142, w: 64 },
        ].map(t => (
          <g key={t.l}>
            <rect x={t.x} y={46} width={t.w} height={24} rx={5} fill={t.active ? `${t.c}25` : 'transparent'} stroke={t.active ? t.c : '#1d2a44'} strokeWidth="1"/>
            <text x={t.x + t.w / 2} y={62} textAnchor="middle" fill={t.active ? t.c : '#5a6a8a'} fontSize="11" fontWeight="700">{t.l}</text>
          </g>
        ))}
        {/* KPI tiles */}
        {[
          { l: 'TUNDISH', v: '1548°C', c: '#3a78ff', x: 16 },
          { l: 'YIELD', v: '94.2%', c: '#3acc7a', x: 140 },
          { l: 'ENERGY', v: '408 kWh/t', c: '#ffa528', x: 264 },
          { l: 'DEFECT', v: '61%', c: '#ff7d8a', x: 388 },
        ].map(k => (
          <g key={k.l}>
            <rect x={k.x} y={82} width={116} height={56} rx={7} fill="#111a2c" stroke="#1d2a44"/>
            <text x={k.x + 10} y={97} fill="#5a6a8a" fontSize="8" fontWeight="700" letterSpacing="1">{k.l}</text>
            <text x={k.x + 10} y={120} fill={k.c} fontSize="17" fontWeight="700" fontFamily="'JetBrains Mono',monospace">{k.v}</text>
            <rect x={k.x + 10} y={127} width={96} height={3} rx={1.5} fill="#1d2a44"/>
            <rect x={k.x + 10} y={127} width={68} height={3} rx={1.5} fill={k.c}/>
          </g>
        ))}
        {/* Chart card */}
        <rect x={16} y={154} width={310} height={170} rx={9} fill="#111a2c" stroke="#1d2a44"/>
        <text x={30} y={174} fill="#e8edf8" fontSize="11" fontWeight="700">Tundish — Actual vs Predicted</text>
        <text x={312} y={174} textAnchor="end" fill="#3acc7a" fontSize="9" fontWeight="700">● LIVE</text>
        <path d="M30,280 Q70,220 110,235 T190,205 T260,225 T312,195" stroke="#3a78ff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M30,280 Q70,220 110,235 T190,205 T260,225 T312,195 L312,310 L30,310 Z" fill="url(#hg-chart)"/>
        <path d="M312,195 Q322,194 330,200" stroke="#3a78ff" strokeWidth="2" fill="none" strokeDasharray="4 3" opacity=".7"/>
        <circle cx="312" cy="195" r="4" fill="#3a78ff"/>
        {/* AI assistant card */}
        <rect x={338} y={154} width={166} height={170} rx={9} fill="#111a2c" stroke="#1d2a44"/>
        <rect x={350} y={166} width={26} height={26} rx={6} fill="rgba(160,80,255,0.18)" stroke="rgba(160,80,255,0.4)"/>
        <text x={363} y={184} textAnchor="middle" fill="#a060ff" fontSize="14" fontWeight="800">✦</text>
        <text x={384} y={178} fill="#e8edf8" fontSize="10.5" fontWeight="700">SteelIQ AI</text>
        <text x={384} y={190} fill="#5a6a8a" fontSize="8.5">Plant Insights</text>
        {[
          { sev: '#ff7d8a', t: 'Strand 2 web crack', d: '63% probability' },
          { sev: '#ffa528', t: 'EAF energy +5.6%', d: '412 vs 390 kWh/t' },
          { sev: '#3acc7a', t: 'Metallization OK', d: '92.4% improving' },
        ].map((ins, i) => (
          <g key={i}>
            <rect x={350} y={204 + i * 38} width={142} height={32} rx={5} fill="#0d1424" stroke="#1d2a44"/>
            <circle cx={361} cy={220 + i * 38} r={3.5} fill={ins.sev}/>
            <text x={371} y={218 + i * 38} fill="#e8edf8" fontSize="9" fontWeight="600">{ins.t}</text>
            <text x={371} y={229 + i * 38} fill="#5a6a8a" fontSize="8">{ins.d}</text>
          </g>
        ))}
        {/* Live ticker */}
        <rect x={16} y={338} width={488} height={26} rx={6} fill="#0d1424" stroke="#1d2a44"/>
        <circle cx={28} cy={351} r={3.5} fill="#3acc7a">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <text x={40} y={355} fill="#8a9bbf" fontSize="9" fontFamily="'JetBrains Mono',monospace">IBA · 1.2k tags/s</text>
        <text x={150} y={355} fill="#8a9bbf" fontSize="9" fontFamily="'JetBrains Mono',monospace">L2 · OPC-UA 240Hz</text>
        <text x={272} y={355} fill="#8a9bbf" fontSize="9" fontFamily="'JetBrains Mono',monospace">AI · 94ms p95</text>
        <text x={368} y={355} fill="#8a9bbf" fontSize="9" fontFamily="'JetBrains Mono',monospace">Uptime · 99.94%</text>
      </svg>
      {/* Floating callout */}
      <div style={{ position: 'absolute', right: -10, top: 32, background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 12px', boxShadow: '0 8px 24px rgba(20,40,100,0.12)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 0 3px rgba(50,200,110,0.18)' }}/>
        <span>Live · 12 plants</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   PROVEN OUTCOMES — specific industrial impact
────────────────────────────────────────────── */
function LPOutcomes() {
  const outs = [
    { v: '19 kWh', u: '/ hr', l: 'EAF Energy Saved', d: 'Power-curve tuning, charge mix AI advisory and arc stability optimization deliver measurable energy reduction every heat.', c: 'var(--amber)', icon: 'eaf' },
    { v: '↓ 38%', u: '', l: 'Casting Defects', d: 'Machine-learned crack, seam and surface-defect models cut quality escapes on continuous casting strands.', c: 'var(--blue)', icon: 'cast' },
    { v: '↓ Slag', u: '', l: 'Cleaner Heats', d: 'Real-time slag carry-over detection and AI deslagging guidance keep heats clean and reduce refractory wear.', c: 'var(--purple)', icon: 'slag' },
    { v: 'Smart', u: '', l: 'DRP Gas Injection', d: 'Intelligent regulation of natural-gas and reformer flow on DRI/DRP — auto-adjusts to feed quality, zone pressure and metallization target.', c: 'var(--green)', icon: 'gas' },
    { v: '↓ 8%', u: '', l: 'Tap-to-Tap Time', d: 'Cycle-time shortening through bottleneck detection in melting, refining and casting — more heats per shift, no capex.', c: 'var(--red)', icon: 'cycle' },
    { v: '24/7', u: '', l: 'Predictive Maintenance', d: 'Electrode wear, transformer health and motor signature monitoring catch failures days before they happen.', c: '#7aa0ff', icon: 'wrench' },
  ];
  return (
    <section className="lp-section lp-section-alt" id="outcomes">
      <div className="lp-section-inner">
        <div className="lp-section-head">
          <div className="lp-eyebrow">Proven Outcomes</div>
          <h2 className="lp-h2">Measurable industrial <em>impact</em>, heat after heat</h2>
          <p className="lp-lead">SteelIQ doesn't just monitor — it changes the numbers on your plant report. These are the outcomes our customers track in production.</p>
        </div>
        <div className="lp-out-grid">
          {outs.map(o => (
            <div key={o.l} className="lp-out-card" style={{ '--out-glow': `${o.c}1f` }}>
              <div className="lp-out-icon" style={{ background: `${o.c}18`, color: o.c, borderColor: `${o.c}55` }}>
                <LPOutcomeIcon name={o.icon} color={o.c}/>
              </div>
              <div className="lp-out-metric"><span style={{ color: o.c }}>{o.v}</span><span className="lp-out-unit">{o.u}</span></div>
              <h3 className="lp-h3" style={{ fontSize: 16, marginTop: 4 }}>{o.l}</h3>
              <div className="lp-out-desc">{o.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LPOutcomeIcon({ name, color }) {
  const sz = 28;
  if (name === 'eaf') return (
    <svg width={sz} height={sz} viewBox="0 0 40 40" fill="none">
      <path d="M8 32 L13 14 L27 14 L32 32 Z" stroke={color} strokeWidth="1.6"/>
      <line x1="15" y1="6" x2="15" y2="14" stroke={color} strokeWidth="2"/>
      <line x1="25" y1="6" x2="25" y2="14" stroke={color} strokeWidth="2"/>
      <circle cx="20" cy="22" r="3" fill={color}><animate attributeName="r" values="2;4;2" dur=".7s" repeatCount="indefinite"/></circle>
    </svg>
  );
  if (name === 'cast') return (
    <svg width={sz} height={sz} viewBox="0 0 40 40" fill="none">
      <rect x="10" y="6" width="20" height="10" rx="2" stroke={color} strokeWidth="1.6"/>
      {[14, 20, 26].map((x, i) => (
        <g key={x}>
          <line x1={x} y1="16" x2={x} y2="34" stroke={color} strokeWidth="2" opacity=".4"/>
          <circle cx={x} cy="20" r="1.8" fill="#ff8a30"><animate attributeName="cy" from="16" to="34" dur="1.6s" begin={`${i * 0.3}s`} repeatCount="indefinite"/></circle>
        </g>
      ))}
    </svg>
  );
  if (name === 'slag') return (
    <svg width={sz} height={sz} viewBox="0 0 40 40" fill="none">
      <path d="M10 28 Q 20 12 30 28" stroke={color} strokeWidth="1.6"/>
      <ellipse cx="20" cy="30" rx="14" ry="3" fill={color} opacity=".25"/>
      <circle cx="14" cy="22" r="2" fill={color} opacity=".6"/>
      <circle cx="26" cy="22" r="1.5" fill={color} opacity=".4"/>
    </svg>
  );
  if (name === 'gas') return (
    <svg width={sz} height={sz} viewBox="0 0 40 40" fill="none">
      <rect x="12" y="10" width="16" height="22" rx="2" stroke={color} strokeWidth="1.6"/>
      {[0, 1, 2].map(i => (
        <circle key={i} cx={16 + i * 4} cy="30" r="1.5" fill={color}>
          <animate attributeName="cy" from="30" to="6" dur="1.5s" begin={`${i * 0.4}s`} repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin={`${i * 0.4}s`} repeatCount="indefinite"/>
        </circle>
      ))}
    </svg>
  );
  if (name === 'cycle') return (
    <svg width={sz} height={sz} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="12" stroke={color} strokeWidth="1.6" strokeDasharray="50 25"><animateTransform attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="3s" repeatCount="indefinite"/></circle>
      <path d="M20 14 L20 20 L24 22" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
  if (name === 'wrench') return (
    <svg width={sz} height={sz} viewBox="0 0 40 40" fill="none">
      <path d="M14 14 a4 4 0 1 0 6 6 L30 30 L34 26 L24 16 a4 4 0 0 0 -6 -6 Z" stroke={color} strokeWidth="1.6"/>
      <circle cx="14" cy="14" r="1.5" fill={color}/>
    </svg>
  );
  return null;
}

/* ── Trust strip ── */
function LPTrustStrip() {
  return (
    <div className="lp-trust">
      <div className="lp-trust-inner">
        <div className="lp-trust-label">Built for</div>
        {['Integrated Steel Mills', 'Mini-Mills', 'Specialty Steel', 'Long Products', 'Flat Products', 'DRI / HBI Plants', 'Middle East', 'Global'].map(t => (
          <div key={t} className="lp-trust-item">{t}</div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   PROCESS COVERAGE — animated steel-mfg flow
   With small animated mini-illustrations per stage
────────────────────────────────────────────── */
function LPProcessCoverage() {
  const stages = [
    { id: 'raw',    label: 'Raw Materials',     tag: 'Iron Ore · Scrap', color: '#8a9bbf', x: 70 },
    { id: 'dri',    label: 'DRI / DRP',         tag: 'Direct Reduction', color: '#3acc7a', x: 210 },
    { id: 'eaf',    label: 'EAF',               tag: 'Electric Arc',     color: '#ffa528', x: 350 },
    { id: 'lf',     label: 'Ladle Furnace',     tag: 'Refining',         color: '#a060ff', x: 490 },
    { id: 'ccm',    label: 'Continuous Cast',   tag: 'CCM Strands',      color: '#3a78ff', x: 630 },
    { id: 'roll',   label: 'Rolling Mill',      tag: 'Hot / Cold Rolling', color: '#ff7d8a', x: 770 },
    { id: 'finish', label: 'Finishing',         tag: 'Coil · Plate · Bar', color: '#7aa0ff', x: 910 },
    { id: 'log',    label: 'Logistics',         tag: 'Yard · Shipping',  color: '#8a9bbf', x: 1050 },
  ];
  return (
    <section className="lp-section" id="process">
      <div className="lp-section-inner">
        <div className="lp-section-head">
          <div className="lp-eyebrow">Process Coverage</div>
          <h2 className="lp-h2">Built for every stage of <em>modern steelmaking</em></h2>
          <p className="lp-lead">SteelIQ covers the entire steel manufacturing chain — from raw materials through finished product and logistics. Add new processes anytime as independent microapps, no shell redeploy required.</p>
        </div>

        <div className="lp-proc-svg-wrap" role="img" aria-label="Steel manufacturing process flow from raw materials to logistics">
          <svg viewBox="0 0 1120 240" style={{ width: '100%', minWidth: 760, height: 'auto', display: 'block' }}>
            <defs>
              <linearGradient id="lp-flow-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3a78ff" stopOpacity=".3"/>
                <stop offset="50%" stopColor="#ffa528" stopOpacity=".5"/>
                <stop offset="100%" stopColor="#3acc7a" stopOpacity=".3"/>
              </linearGradient>
              <radialGradient id="lp-spark" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffd166" stopOpacity="1"/>
                <stop offset="100%" stopColor="#ffd166" stopOpacity="0"/>
              </radialGradient>
            </defs>

            {/* Conveyor / pipe baseline */}
            <line x1="60" y1="130" x2="1080" y2="130" stroke="url(#lp-flow-grad)" strokeWidth="4" strokeLinecap="round"/>
            <line x1="60" y1="130" x2="1080" y2="130" stroke="var(--border2)" strokeWidth="1" strokeDasharray="3 5"/>

            {/* Flowing steel particles */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
              <circle key={'p' + i} cx="60" cy="130" r="3.5" fill="#ff8a30">
                <animate attributeName="cx" from="60" to="1080" dur="8s" begin={`${i * 1}s`} repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.05;0.95;1" dur="8s" begin={`${i * 1}s`} repeatCount="indefinite"/>
              </circle>
            ))}

            {/* Stage cards */}
            {stages.map((s, i) => (
              <g key={s.id} transform={`translate(${s.x}, 60)`}>
                {/* Card */}
                <rect x="-58" y="0" width="116" height="140" rx="10" fill="var(--bg2)" stroke="var(--border)" strokeWidth="1.2"/>
                {/* Color tab */}
                <rect x="-58" y="0" width="116" height="3" rx="1.5" fill={s.color}/>
                {/* Mini icon area */}
                <g transform="translate(0, 18)">
                  <LPStageIcon stage={s.id} color={s.color}/>
                </g>
                {/* Label */}
                <text x="0" y="108" textAnchor="middle" fill="var(--text)" fontSize="11.5" fontWeight="700">{s.label}</text>
                <text x="0" y="124" textAnchor="middle" fill="var(--text-dim)" fontSize="9" fontFamily="'JetBrains Mono',monospace" letterSpacing=".5">{s.tag}</text>
                {/* Connector to baseline */}
                <line x1="0" y1="140" x2="0" y2="70" stroke={s.color} strokeWidth="1" strokeOpacity=".25"/>
                <circle cx="0" cy="70" r="3" fill={s.color} opacity=".5"/>
              </g>
            ))}
          </svg>
        </div>

        <div className="lp-proc-note">
          <div className="lp-proc-note-icon">+</div>
          <div>
            <div className="lp-proc-note-title">New processes can be injected anytime</div>
            <div className="lp-proc-note-desc">
              SteelIQ's microapp architecture means you can add a new line — Sintering, Pelletizing, Galvanizing,
              Pickling — by registering a manifest. Same data spine, same AI engine, same operator UI.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Per-stage mini illustration — animated SMIL */
function LPStageIcon({ stage, color }) {
  if (stage === 'raw') {
    return (
      <g>
        {[0, 1, 2].map(i => (
          <circle key={i} cx={-12 + i * 12} cy="34" r="6" fill={color} opacity={0.4 + i * 0.2}/>
        ))}
        <ellipse cx="0" cy="40" rx="22" ry="3" fill={color} opacity=".2"/>
      </g>
    );
  }
  if (stage === 'dri') {
    return (
      <g>
        {/* Vertical reactor */}
        <rect x="-12" y="2" width="24" height="44" rx="3" fill="none" stroke={color} strokeWidth="1.5"/>
        <rect x="-7" y="8" width="14" height="32" rx="2" fill={color} opacity=".15"/>
        {/* Gas particles rising */}
        {[0, 1, 2, 3].map(i => (
          <circle key={i} cx={-6 + i * 4} cy="42" r="1.5" fill={color}>
            <animate attributeName="cy" from="42" to="6" dur="2s" begin={`${i * 0.5}s`} repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0;1;0" dur="2s" begin={`${i * 0.5}s`} repeatCount="indefinite"/>
          </circle>
        ))}
      </g>
    );
  }
  if (stage === 'eaf') {
    return (
      <g>
        {/* Cone furnace */}
        <path d="M-18 44 L-12 18 L12 18 L18 44 Z" fill="none" stroke={color} strokeWidth="1.5"/>
        <path d="M-18 44 L-12 18 L12 18 L18 44 Z" fill={color} opacity=".15"/>
        {/* Electrodes */}
        {[-6, 0, 6].map(x => <line key={x} x1={x} y1="2" x2={x} y2="18" stroke={color} strokeWidth="2"/>)}
        {/* Arc spark */}
        <circle cx="0" cy="26" r="4" fill="url(#lp-spark)">
          <animate attributeName="r" values="3;6;3" dur="0.6s" repeatCount="indefinite"/>
        </circle>
        <circle cx="-6" cy="22" r="2" fill="#ffd166">
          <animate attributeName="opacity" values="0;1;0" dur="0.4s" begin="0s" repeatCount="indefinite"/>
        </circle>
        <circle cx="6" cy="22" r="2" fill="#ffd166">
          <animate attributeName="opacity" values="0;1;0" dur="0.4s" begin="0.2s" repeatCount="indefinite"/>
        </circle>
      </g>
    );
  }
  if (stage === 'lf') {
    return (
      <g>
        {/* Cylinder */}
        <ellipse cx="0" cy="10" rx="16" ry="4" fill="none" stroke={color} strokeWidth="1.5"/>
        <line x1="-16" y1="10" x2="-16" y2="40" stroke={color} strokeWidth="1.5"/>
        <line x1="16" y1="10" x2="16" y2="40" stroke={color} strokeWidth="1.5"/>
        <ellipse cx="0" cy="40" rx="16" ry="4" fill={color} opacity=".15" stroke={color} strokeWidth="1.5"/>
        {/* Stir swirl */}
        <path d="M-8 24 Q 0 18, 8 24 Q 0 32, -8 24" fill="none" stroke={color} strokeWidth="1.5">
          <animateTransform attributeName="transform" type="rotate" from="0 0 24" to="360 0 24" dur="3s" repeatCount="indefinite"/>
        </path>
      </g>
    );
  }
  if (stage === 'ccm') {
    return (
      <g>
        {/* Mold */}
        <rect x="-14" y="4" width="28" height="14" rx="2" fill={color} opacity=".15" stroke={color} strokeWidth="1.5"/>
        {/* Strands flowing down */}
        {[-7, 0, 7].map((x, i) => (
          <g key={i}>
            <line x1={x} y1="18" x2={x} y2="44" stroke={color} strokeWidth="2.5" opacity=".5"/>
            <circle cx={x} cy="22" r="2" fill="#ff8a30">
              <animate attributeName="cy" from="18" to="44" dur="1.5s" begin={`${i * 0.4}s`} repeatCount="indefinite"/>
              <animate attributeName="opacity" values="1;1;0" dur="1.5s" begin={`${i * 0.4}s`} repeatCount="indefinite"/>
            </circle>
          </g>
        ))}
      </g>
    );
  }
  if (stage === 'roll') {
    return (
      <g>
        {/* Two rolling cylinders */}
        <circle cx="-7" cy="22" r="9" fill="none" stroke={color} strokeWidth="1.5"/>
        <circle cx="7" cy="22" r="9" fill="none" stroke={color} strokeWidth="1.5"/>
        <circle cx="-7" cy="22" r="2.5" fill={color}>
          <animateTransform attributeName="transform" type="rotate" from="0 -7 22" to="360 -7 22" dur="2s" repeatCount="indefinite"/>
        </circle>
        <line x1="-7" y1="14" x2="-7" y2="22" stroke={color} strokeWidth="1.5">
          <animateTransform attributeName="transform" type="rotate" from="0 -7 22" to="360 -7 22" dur="2s" repeatCount="indefinite"/>
        </line>
        <line x1="7" y1="14" x2="7" y2="22" stroke={color} strokeWidth="1.5">
          <animateTransform attributeName="transform" type="rotate" from="360 7 22" to="0 7 22" dur="2s" repeatCount="indefinite"/>
        </line>
        {/* Steel sheet through */}
        <rect x="-22" y="20" width="44" height="4" fill={color} opacity=".3"/>
      </g>
    );
  }
  if (stage === 'finish') {
    return (
      <g>
        {/* Stacked coils */}
        <ellipse cx="-8" cy="32" rx="9" ry="4" fill={color} opacity=".25" stroke={color} strokeWidth="1.3"/>
        <ellipse cx="-8" cy="32" rx="2.5" ry="1" fill="var(--bg)"/>
        <ellipse cx="8" cy="32" rx="9" ry="4" fill={color} opacity=".25" stroke={color} strokeWidth="1.3"/>
        <ellipse cx="8" cy="32" rx="2.5" ry="1" fill="var(--bg)"/>
        <ellipse cx="0" cy="20" rx="9" ry="4" fill={color} opacity=".35" stroke={color} strokeWidth="1.3"/>
        <ellipse cx="0" cy="20" rx="2.5" ry="1" fill="var(--bg)"/>
      </g>
    );
  }
  if (stage === 'log') {
    return (
      <g>
        {/* Truck-ish silhouette */}
        <rect x="-18" y="14" width="20" height="14" rx="1.5" fill={color} opacity=".25" stroke={color} strokeWidth="1.3"/>
        <rect x="2" y="18" width="14" height="10" rx="1.5" fill={color} opacity=".15" stroke={color} strokeWidth="1.3"/>
        <circle cx="-10" cy="32" r="3.5" fill="var(--bg)" stroke={color} strokeWidth="1.3"/>
        <circle cx="10" cy="32" r="3.5" fill="var(--bg)" stroke={color} strokeWidth="1.3"/>
        <line x1="-14" y1="38" x2="14" y2="38" stroke={color} strokeWidth="1" strokeDasharray="2 2">
          <animate attributeName="stroke-dashoffset" from="0" to="-8" dur="1s" repeatCount="indefinite"/>
        </line>
      </g>
    );
  }
  return null;
}

/* ── Capabilities ── */
function LPCapabilities() {
  const caps = [
    { i: '◈', c: 'var(--blue)', t: 'Real-Time Process Monitoring', d: 'Sub-second telemetry from IBA historians, Level-2 OPC-UA, PLCs and DCS. Industrial-grade dashboards designed for 24/7 command-center operators.' },
    { i: '✦', c: 'var(--purple)', t: 'Predictive AI & ML', d: 'Pre-trained and fine-tunable models for defect prediction, energy optimization, breakout prevention, metallization forecasting and predictive maintenance.' },
    { i: '⊞', c: 'var(--amber)', t: 'Microapps Architecture', d: 'Every process domain — CastX, EAF, DRI/DRP, Rolling — is an independently versioned module. Install, update or disable without redeploying the platform shell.' },
    { i: '☁', c: 'var(--green)', t: 'Cloud-Scale, Edge-Ready', d: 'Hybrid by design. Edge gateways buffer plant data; the cloud handles AI workloads at scale across AWS, Azure, GCP, or your private cloud.' },
  ];
  return (
    <section className="lp-section" id="capabilities">
      <div className="lp-section-inner">
        <div className="lp-section-head">
          <div className="lp-eyebrow">Platform Capabilities</div>
          <h2 className="lp-h2">An <em>operating system</em> for the steel plant</h2>
          <p className="lp-lead">SteelIQ replaces a tangle of point tools with one composable platform. Built around the way steelmakers actually work — by process domain, by shift, by KPI.</p>
        </div>
        <div className="lp-cap-grid">
          {caps.map(c => (
            <div key={c.t} className="lp-cap-card">
              <div className="lp-cap-icon" style={{ background: `${c.c}18`, color: c.c, borderColor: `${c.c}40` }}>{c.i}</div>
              <h3 className="lp-h3">{c.t}</h3>
              <div className="lp-cap-desc">{c.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── How it works ── */
function LPHowItWorks() {
  const steps = [
    { n: 1, icon: 'sensors', t: 'Plant Sensors', d: 'IBA historians, Level-2 OPC-UA, PLCs, DCS, vibration & thermal sensors stream raw process data.', c: 'var(--blue)' },
    { n: 2, icon: 'edge', t: 'Edge Gateway', d: 'On-prem gateway buffers, encrypts and forwards. Survives WAN outages — no data loss on the plant floor.', c: 'var(--amber)' },
    { n: 3, icon: 'cloud', t: 'Cloud Ingestion', d: 'Time-series lake plus relational store on your cloud of choice. Multi-region replication and 30-day local cache.', c: 'var(--green)' },
    { n: 4, icon: 'ai', t: 'AI Engine', d: 'Domain-tuned ML for defect, energy, anomaly, breakout. NLP layer makes every model conversational.', c: 'var(--purple)' },
    { n: 5, icon: 'apps', t: 'Microapps & UI', d: 'Operators, reliability engineers and plant leadership consume insights through tailored microapp UIs.', c: '#ff7d8a' },
  ];
  return (
    <section className="lp-section lp-section-alt" id="how">
      <div className="lp-section-inner">
        <div className="lp-section-head">
          <div className="lp-eyebrow">How It Works</div>
          <h2 className="lp-h2">From plant floor sensor to <em>AI-driven</em> decision</h2>
          <p className="lp-lead">A five-stage data path engineered for industrial reliability. Bring your data in once — every microapp consumes the same canonical stream.</p>
        </div>
        <div className="lp-flow">
          {steps.map(s => (
            <div key={s.n} className="lp-flow-step">
              <div className="lp-flow-num" style={{ background: s.c }}>{s.n}</div>
              <div className="lp-flow-anim" style={{ background: `${s.c}10`, borderColor: `${s.c}40` }}>
                <LPFlowIcon name={s.icon} color={s.c}/>
              </div>
              <div className="lp-flow-title">{s.t}</div>
              <div className="lp-flow-desc">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LPFlowIcon({ name, color }) {
  if (name === 'sensors') return (
    <svg viewBox="0 0 60 60" width="60" height="60">
      <circle cx="30" cy="30" r="4" fill={color}/>
      {[0, 1].map(i => (
        <circle key={i} cx="30" cy="30" r="8" fill="none" stroke={color} strokeWidth="1.4">
          <animate attributeName="r" from="8" to="22" dur="2.4s" begin={`${i * 1.2}s`} repeatCount="indefinite"/>
          <animate attributeName="opacity" from=".7" to="0" dur="2.4s" begin={`${i * 1.2}s`} repeatCount="indefinite"/>
        </circle>
      ))}
    </svg>
  );
  if (name === 'edge') return (
    <svg viewBox="0 0 60 60" width="60" height="60">
      <rect x="20" y="22" width="20" height="16" rx="2" fill="none" stroke={color} strokeWidth="1.6"/>
      <line x1="22" y1="27" x2="38" y2="27" stroke={color} strokeWidth="1"/>
      <line x1="22" y1="31" x2="34" y2="31" stroke={color} strokeWidth="1" opacity=".6"/>
      <line x1="22" y1="35" x2="30" y2="35" stroke={color} strokeWidth="1" opacity=".4"/>
      {[0, 1].map(i => (
        <circle key={i} cx="0" cy="30" r="2.5" fill={color}>
          <animate attributeName="cx" from="-4" to="64" dur="2.4s" begin={`${i * 1.2}s`} repeatCount="indefinite"/>
        </circle>
      ))}
    </svg>
  );
  if (name === 'cloud') return (
    <svg viewBox="0 0 60 60" width="60" height="60">
      <path d="M16 36 a8 8 0 0 1 6 -14 a10 10 0 0 1 19 2 a6 6 0 0 1 1 12 z" fill="none" stroke={color} strokeWidth="1.6"/>
      {[0, 1, 2].map(i => (
        <circle key={i} cx={22 + i * 8} cy="48" r="1.8" fill={color}>
          <animate attributeName="cy" from="48" to="38" dur="1.6s" begin={`${i * 0.5}s`} repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0;1;0" dur="1.6s" begin={`${i * 0.5}s`} repeatCount="indefinite"/>
        </circle>
      ))}
    </svg>
  );
  if (name === 'ai') return (
    <svg viewBox="0 0 60 60" width="60" height="60">
      <circle cx="30" cy="30" r="14" fill="none" stroke={color} strokeWidth="1.4" strokeDasharray="3 3">
        <animateTransform attributeName="transform" type="rotate" from="0 30 30" to="360 30 30" dur="6s" repeatCount="indefinite"/>
      </circle>
      <circle cx="30" cy="30" r="6" fill={color} opacity=".25">
        <animate attributeName="r" values="6;9;6" dur="1.6s" repeatCount="indefinite"/>
      </circle>
      <text x="30" y="34" textAnchor="middle" fill={color} fontSize="14" fontWeight="800">✦</text>
    </svg>
  );
  if (name === 'apps') return (
    <svg viewBox="0 0 60 60" width="60" height="60">
      {[0, 1, 2, 3].map(i => (
        <rect key={i} x={20 + (i % 2) * 11} y={20 + Math.floor(i / 2) * 11} width="9" height="9" rx="1.5" fill={color} opacity=".4">
          <animate attributeName="opacity" values=".4;1;.4" dur="1.6s" begin={`${i * 0.35}s`} repeatCount="indefinite"/>
        </rect>
      ))}
    </svg>
  );
  return null;
}

/* ── AI Section ── */
function LPAISection() {
  return (
    <section className="lp-section" id="ai">
      <div className="lp-section-inner">
        <div className="lp-ai-grid">
          <div>
            <div className="lp-eyebrow">AI · Engineered for the Plant</div>
            <h2 className="lp-h2">Ask the plant in <em>plain English</em>. Get answers in seconds.</h2>
            <p className="lp-lead">SteelIQ's AI layer is purpose-built for steelmaking — every model is grounded in process physics, every answer is traceable to source signals on the plant floor.</p>
            <div className="lp-ai-features">
              {[
                { i: '⌘', t: 'Natural Language Analytics', d: 'Ask any KPI question. The AI translates intent into queries across IBA, Level-2 and ERP — and returns annotated trends.' },
                { i: '✦', t: 'Predictive Defect & Energy Models', d: 'Domain-specific ML for crack risk, breakout, electrode wear, energy per ton, metallization. 94%+ accuracy on validated datasets.' },
                { i: '⚠', t: 'Anomaly & Root-Cause', d: 'Live anomaly scoring across every channel. Auto-correlated root-cause walks with corrective actions, ranked by confidence.' },
                { i: '◷', t: 'Generative Reports & Briefings', d: 'Auto-generate shift handover, root-cause memos, and exec dashboards. Custom prompts per role — operator, engineer, manager.' },
              ].map(f => (
                <div key={f.t} className="lp-ai-feat">
                  <div className="lp-ai-feat-icon">{f.i}</div>
                  <div>
                    <div className="lp-h3" style={{ fontSize: 15, marginBottom: 4 }}>{f.t}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.55 }}>{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="lp-ai-demo">
              <div className="lp-ai-prompt-line">
                <span className="lp-ai-icon">⌘</span>
                <span>You · 14:22 GST</span>
                <span className="lp-ai-tag">NLP</span>
              </div>
              <div style={{ color: '#e8edf8', marginBottom: 18, fontSize: 13 }}>
                "Why did EAF energy go up this week? Show me the breakdown."
              </div>
              <div className="lp-ai-prompt-line"><span className="lp-ai-icon">✦</span><span>SteelIQ AI · 1.2s</span></div>
              <div className="lp-ai-response">
                EAF energy is averaging <strong>412 kWh/t</strong> this week — <span className="hl-amber">+5.6% over the 390 target</span>.
                Three drivers, ranked by contribution:
              </div>
              <div className="lp-ai-response" style={{ paddingLeft: 14 }}>
                <div>1. <strong>Arc Phase B instability</strong> — voltage ±8% adding <span className="hl-red">~15 kWh/t</span></div>
                <div>2. <strong>DRI mix drift</strong> — 68% vs 72% target (<span className="hl-amber">+6 kWh/t</span>)</div>
                <div>3. <strong>Cold-charge ratio</strong> — heavy scrap up 4% (<span className="hl-amber">+4 kWh/t</span>)</div>
              </div>
              <div className="lp-ai-response">
                <span className="hl-green">→ Recommended action:</span> raise DRI to 72% and reposition Phase B electrode +12mm.
                Projected saving: <strong>14 kWh/t</strong> next heat.
                <span className="lp-ai-cursor"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Microapps Catalog ── */
function LPMicroapps() {
  const mods = [
    { i: 'Q', c: 'var(--blue)', t: 'CastX', tag: 'Casting Quality', d: 'Continuous casting quality, ML defect prediction, breakout prevention, outlier and NLP analytics.', f: ['Defect prediction · 94.2% accuracy', 'Breakout risk scoring', 'Tundish & mould monitoring', 'NLP query interface'] },
    { i: 'E', c: 'var(--amber)', t: 'EAF Suite', tag: 'Electric Arc Furnace', d: 'Energy optimization, arc stability, charge mix, tap-to-tap reduction and predictive electrode/transformer maintenance.', f: ['Energy per ton optimizer', 'Arc stability monitor', 'Charge mix AI advisor', 'Electrode wear forecast'] },
    { i: 'G', c: 'var(--green)', t: 'DRI/DRP Suite', tag: 'Direct Reduction', d: 'Reduction gas optimization, metallization prediction, zone temperature profiling, yield analytics and anomaly detection.', f: ['Gas/iron ratio optimizer', '1h metallization forecast', 'Zone temperature ML', 'Reformer health monitor'] },
    { i: '+', c: 'var(--purple)', t: 'Build Your Own', tag: 'Open SDK', d: 'Use the SteelIQ SDK and registry API to ship your own microapp. Define data bindings, RBAC roles and AI hooks in a manifest — no shell redeploy.', f: ['Manifest-driven mount', 'IBA & L2 channel binding', 'Built-in RBAC gating', 'AI assistant auto-index'], special: true },
  ];
  return (
    <section className="lp-section lp-section-alt" id="microapps">
      <div className="lp-section-inner">
        <div className="lp-section-head">
          <div className="lp-eyebrow">Microapps Catalog</div>
          <h2 className="lp-h2">A growing library of <em>process-domain</em> microapps</h2>
          <p className="lp-lead">Each microapp is independently versioned and deployable. Mix and match what your plant needs today — extend with custom modules as you grow.</p>
        </div>
        <div className="lp-mod-grid">
          {mods.map(m => (
            <div key={m.t} className={`lp-mod-card${m.special ? ' special' : ''}`} style={{ '--mod-c': m.c }}>
              <div className="lp-mod-icon" style={{ background: `${m.c}18`, color: m.c, borderColor: `${m.c}55` }}>{m.i}</div>
              <div style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, marginBottom: 6 }}>{m.tag}</div>
              <h3 className="lp-h3">{m.t}</h3>
              <div style={{ fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.55, marginBottom: 16 }}>{m.d}</div>
              <div className="lp-mod-features">
                {m.f.map(ft => <div key={ft} className="lp-mod-feat" style={{ color: m.c }}><span style={{ color: 'var(--text-mid)' }}>{ft}</span></div>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   LIFECYCLE COVERAGE — Inception → Customer
────────────────────────────────────────────── */
function LPLifecycle() {
  const stages = [
    { n: 1, t: 'Product Inception', d: 'AI-assisted grade & specification design. Simulate metallurgical recipes before the first heat.', c: 'var(--blue)' },
    { n: 2, t: 'Plant & Process Design', d: 'Configure microapps to match your line — DRI, EAF, LF, CCM, Rolling, Finishing. Bind to IBA / L2 data.', c: 'var(--purple)' },
    { n: 3, t: 'Production Operations', d: 'Live command center, defect prediction, energy optimization, gas injection control and predictive maintenance.', c: 'var(--amber)' },
    { n: 4, t: 'Quality & Sales', d: 'Auto-generated quality certificates, customer-grade traceability, and order-to-billet linking through ERP integration.', c: 'var(--green)' },
    { n: 5, t: 'End-Customer Management', d: 'Customer portals, claim handling, batch-level traceability and after-sales analytics — closes the lifecycle.', c: '#ff7d8a' },
  ];
  return (
    <section className="lp-section" id="lifecycle">
      <div className="lp-section-inner">
        <div className="lp-section-head">
          <div className="lp-eyebrow">End-to-End Lifecycle</div>
          <h2 className="lp-h2">From <em>new product inception</em> to the end customer</h2>
          <p className="lp-lead">SteelIQ isn't just an operations tool — it's the digital backbone for the entire product lifecycle. One platform, one data spine, every stage of the journey.</p>
        </div>
        <div className="lp-life-flow">
          {stages.map((s, i) => (
            <div key={s.n} className="lp-life-step" style={{ '--life-c': s.c }}>
              <div className="lp-life-num" style={{ background: s.c }}>{s.n}</div>
              <div className="lp-life-title">{s.t}</div>
              <div className="lp-life-desc">{s.d}</div>
              {i < stages.length - 1 && <div className="lp-life-arrow" style={{ color: s.c }}>→</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Integrations ── */
function LPIntegrations() {
  const cats = [
    {
      label: 'Plant Historians', items: [
        { n: 'IBA Historian', t: 'Time-series' },
        { n: 'OSIsoft PI', t: 'Time-series' },
        { n: 'AVEVA Insight', t: 'Time-series' },
        { n: 'Wonderware', t: 'Time-series' },
      ]
    },
    {
      label: 'Level 2 / Automation', items: [
        { n: 'Siemens SIMATIC', t: 'OPC-UA' },
        { n: 'ABB Ability', t: 'OPC-UA' },
        { n: 'Rockwell Logix', t: 'OPC-UA' },
        { n: 'Danieli Automation', t: 'REST / OPC' },
        { n: 'Primetals', t: 'REST / OPC' },
        { n: 'Tenova', t: 'REST' },
      ]
    },
    {
      label: 'Enterprise & MES', items: [
        { n: 'SAP S/4HANA', t: 'RFC / OData' },
        { n: 'Oracle EBS', t: 'REST' },
        { n: 'Microsoft Dynamics', t: 'OData' },
        { n: 'Generic MES', t: 'REST / SQL' },
      ]
    },
    {
      label: 'Open Protocols', items: [
        { n: 'OPC-UA', t: 'Protocol' },
        { n: 'MQTT / Sparkplug B', t: 'Protocol' },
        { n: 'REST / GraphQL', t: 'Protocol' },
        { n: 'gRPC', t: 'Protocol' },
        { n: 'SQL / JDBC', t: 'Protocol' },
        { n: 'AMQP / Kafka', t: 'Protocol' },
      ]
    },
  ];
  return (
    <section className="lp-section" id="integrations">
      <div className="lp-section-inner">
        <div className="lp-section-head">
          <div className="lp-eyebrow">Integrations</div>
          <h2 className="lp-h2">Plug into the systems <em>you already run</em></h2>
          <p className="lp-lead">SteelIQ ingests plant data through whatever stack you have today. REST APIs, direct database URLs, OPC-UA, MQTT — all configured at runtime through the admin console.</p>
        </div>
        <div className="lp-int-cats">
          {cats.map(cat => (
            <div key={cat.label}>
              <div className="lp-int-cat-label">{cat.label}</div>
              <div className="lp-int-grid">
                {cat.items.map(it => (
                  <div key={it.n} className="lp-int-card">
                    <div className="lp-int-name">{it.n}</div>
                    <div className="lp-int-type">{it.t}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Cloud ── */
function LPCloud() {
  return (
    <section className="lp-section lp-section-dark" id="cloud">
      <div className="lp-section-inner">
        <div className="lp-cloud-grid">
          <div>
            <div className="lp-eyebrow">Cloud-Scale Deployment</div>
            <h2 className="lp-h2">Edge-to-cloud. <em>Multi-region.</em> Hybrid-ready.</h2>
            <p className="lp-lead">Deploy SteelIQ where your data lives. Public cloud for global scale, private cloud for regulatory boundaries, or fully on-prem for air-gapped operations.</p>
            <LPCloudArch/>
          </div>
          <div className="lp-cloud-points">
            {[
              { i: '☁', t: 'Multi-Cloud, Multi-Region', d: 'AWS, Azure, Google Cloud, or private cloud (OpenShift, VMware Tanzu). Active-active deployments across regions with sub-second failover.' },
              { i: '◷', t: 'Edge Gateway Buffering', d: 'Plant-side gateways run on industrial PC or virtualized. Buffer up to 30 days of telemetry if WAN drops — zero data loss.' },
              { i: '⚡', t: 'Elastic AI Workloads', d: 'GPU-backed ML inference scales with shift load. Train fine-tuned models on your data; serve at <200ms p95 latency.' },
              { i: '🔒', t: 'Enterprise Security', d: 'SOC 2 Type II–ready controls. AES-256 encryption in transit & at rest. RBAC, SSO/SAML, audit logging built in.' },
              { i: '◈', t: 'On-Prem & Air-Gapped', d: 'Run entirely inside your DMZ when compliance requires it. Same UX, same microapp catalog, no outbound dependencies.' },
            ].map(p => (
              <div key={p.t} className="lp-cloud-point">
                <div className="lp-cloud-pt-icon">{p.i}</div>
                <div>
                  <div className="lp-cloud-pt-title">{p.t}</div>
                  <div className="lp-cloud-pt-desc">{p.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LPCloudArch() {
  return (
    <div className="lp-cloud-card" style={{ marginTop: 28 }}>
      <svg viewBox="0 0 520 220" style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* Plant tier */}
        <rect x="10" y="80" width="120" height="100" rx="10" fill="rgba(80,130,255,0.08)" stroke="rgba(80,130,255,0.3)"/>
        <text x="70" y="102" textAnchor="middle" fill="#7aa0ff" fontSize="11" fontWeight="700">PLANT FLOOR</text>
        <text x="70" y="124" textAnchor="middle" fill="#a0aac4" fontSize="9">IBA · Level 2</text>
        <text x="70" y="138" textAnchor="middle" fill="#a0aac4" fontSize="9">PLCs · DCS</text>
        <text x="70" y="152" textAnchor="middle" fill="#a0aac4" fontSize="9">Sensors · Vision</text>
        <text x="70" y="172" textAnchor="middle" fill="#5e6a85" fontSize="8" fontFamily="'JetBrains Mono',monospace">on-prem</text>
        {/* Edge tier */}
        <rect x="160" y="80" width="120" height="100" rx="10" fill="rgba(255,165,40,0.08)" stroke="rgba(255,165,40,0.3)"/>
        <text x="220" y="102" textAnchor="middle" fill="#ffa528" fontSize="11" fontWeight="700">EDGE GATEWAY</text>
        <text x="220" y="124" textAnchor="middle" fill="#a0aac4" fontSize="9">Buffering</text>
        <text x="220" y="138" textAnchor="middle" fill="#a0aac4" fontSize="9">Encryption</text>
        <text x="220" y="152" textAnchor="middle" fill="#a0aac4" fontSize="9">Pre-processing</text>
        <text x="220" y="172" textAnchor="middle" fill="#5e6a85" fontSize="8" fontFamily="'JetBrains Mono',monospace">on-prem</text>
        {/* Cloud tier */}
        <rect x="310" y="22" width="200" height="160" rx="10" fill="rgba(160,80,255,0.08)" stroke="rgba(160,80,255,0.3)"/>
        <text x="410" y="44" textAnchor="middle" fill="#c599ff" fontSize="11" fontWeight="700">CLOUD / AI</text>
        <text x="410" y="64" textAnchor="middle" fill="#a0aac4" fontSize="9">Time-series Lake</text>
        <text x="410" y="78" textAnchor="middle" fill="#a0aac4" fontSize="9">ML Inference (GPU)</text>
        <text x="410" y="92" textAnchor="middle" fill="#a0aac4" fontSize="9">NLP &amp; Generative AI</text>
        <text x="410" y="106" textAnchor="middle" fill="#a0aac4" fontSize="9">Microapp Registry</text>
        <text x="410" y="120" textAnchor="middle" fill="#a0aac4" fontSize="9">RBAC &amp; Audit</text>
        <text x="410" y="146" textAnchor="middle" fill="#5e6a85" fontSize="8" fontFamily="'JetBrains Mono',monospace">AWS · Azure · GCP</text>
        <text x="410" y="160" textAnchor="middle" fill="#5e6a85" fontSize="8" fontFamily="'JetBrains Mono',monospace">private cloud · on-prem</text>
        {/* Connectors */}
        {[[130, 130], [280, 130]].map(([x, y], i) => (
          <g key={i}>
            <line x1={x} y1={y} x2={x + 30} y2={y} stroke="#7aa0ff" strokeWidth="1.5" strokeDasharray="3 3" opacity=".7">
              <animate attributeName="stroke-dashoffset" from="0" to="-12" dur="1s" repeatCount="indefinite"/>
            </line>
            <polygon points={`${x + 28},${y - 3} ${x + 28},${y + 3} ${x + 32},${y}`} fill="#7aa0ff"/>
          </g>
        ))}
        {/* User access labels */}
        <line x1="380" y1="180" x2="380" y2="208" stroke="#5e6a85" strokeWidth="1" strokeDasharray="2 3"/>
        <text x="440" y="208" textAnchor="middle" fill="#5e6a85" fontSize="8.5" fontFamily="'JetBrains Mono',monospace">Operators · Engineers · Leadership</text>
      </svg>
    </div>
  );
}

/* ── Trial / Pricing ── */
function LPTrial({ onLogin }) {
  const plans = [
    {
      n: 'Trial', price: 'Free', cycle: '30 days · no credit card', cta: 'Start Trial',
      features: ['Full CastX, EAF & DRI microapps', 'Sample plant data preloaded', 'AI assistant & NLP queries', 'Up to 3 user seats', 'Email support — 24h response'],
      action: onLogin,
    },
    {
      n: 'Plant Pro', price: 'Contact', cycle: 'per plant · annual contract', cta: 'Talk to Sales', featured: true,
      features: ['Unlimited microapps & seats', 'Live IBA / Level 2 connectors', 'Fine-tuned ML on your data', 'Dedicated success engineer', '99.9% SLA · 4h response', 'Quarterly model retraining'],
      action: () => lpScroll('contact'),
    },
    {
      n: 'Enterprise', price: 'Custom', cycle: 'multi-plant · global rollout', cta: 'Contact Us',
      features: ['Multi-plant deployment', 'Private cloud or on-prem', 'Custom microapp development', 'SOC 2 / ISO 27001 controls', 'White-label & branding', '24/7 priority support · 1h SLA'],
      action: () => lpScroll('contact'),
    },
  ];
  return (
    <section className="lp-section" id="trial">
      <div className="lp-section-inner">
        <div className="lp-section-head">
          <div className="lp-eyebrow">Trial & Pricing</div>
          <h2 className="lp-h2">Start free. <em>Scale</em> to your whole operation.</h2>
          <p className="lp-lead">Begin with a 30-day trial on sample data. When you're ready, our team integrates SteelIQ with your plant's IBA, Level-2 and ERP — typically in two weeks.</p>
        </div>
        <div className="lp-trial-grid">
          {plans.map(p => (
            <div key={p.n} className={`lp-trial-card${p.featured ? ' featured' : ''}`}>
              {p.featured && <div className="lp-trial-badge">MOST POPULAR</div>}
              <div className="lp-trial-name">{p.n}</div>
              <div className="lp-trial-price">{p.price}</div>
              <div className="lp-trial-cycle">{p.cycle}</div>
              <div className="lp-trial-features">
                {p.features.map(f => <div key={f} className="lp-trial-feat">{f}</div>)}
              </div>
              <button className={`lp-btn ${p.featured ? 'lp-btn-primary' : 'lp-btn-ghost'}`} style={{ width: '100%', justifyContent: 'center', padding: '12px' }} onClick={p.action}>{p.cta}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Contact ── */
function LPContact() {
  const [form, setForm] = lpUseState({ name: '', company: '', role: 'Plant Manager', email: '', phone: '', plantType: 'Integrated Mill', interest: 'Trial Access', message: '' });
  const [sent, setSent] = lpUseState(false);
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const submit = (e) => { e.preventDefault(); if (!form.name || !form.email || !form.company) return; setSent(true); };
  return (
    <section className="lp-section lp-section-alt" id="contact">
      <div className="lp-section-inner">
        <div className="lp-section-head">
          <div className="lp-eyebrow">Get in Touch</div>
          <h2 className="lp-h2">Talk to our <em>steel engineering</em> team</h2>
          <p className="lp-lead">Tell us about your plant — what processes you run, the systems you use today, and where you'd like AI to help. We typically respond within one business day.</p>
        </div>
        <div className="lp-contact-grid">
          <div className="lp-contact-info">
            {[
              { i: '✉', l: 'Sales · Demos · Partnerships', v: 'swapnil@zealogics.com', link: 'mailto:swapnil@zealogics.com?subject=SteelIQ%20Inquiry' },
              { i: '🌐', l: 'Production', v: 'steeliq.zealogics.info' },
              { i: '◷', l: 'Response Time', v: 'Within 24 business hours' },
              { i: '🗺', l: 'Service Regions', v: 'Middle East · MENA · Globally accessible' },
              { i: '🏢', l: 'Headquarters', v: 'Zealogics, Inc. · United States' },
            ].map(c => (
              <div key={c.l} className="lp-contact-item">
                <div className="lp-contact-icon">{c.i}</div>
                <div>
                  <div className="lp-contact-item-label">{c.l}</div>
                  {c.link
                    ? <a className="lp-contact-item-val" href={c.link} style={{ color: 'var(--blue)', textDecoration: 'none' }}>{c.v}</a>
                    : <div className="lp-contact-item-val">{c.v}</div>}
                </div>
              </div>
            ))}
            <div style={{ padding: '16px 18px', background: 'var(--blue-lo)', border: '1px solid var(--border2)', borderRadius: 10, fontSize: 12.5, color: 'var(--text-mid)', lineHeight: 1.55 }}>
              <strong style={{ color: 'var(--blue)' }}>What happens next?</strong><br/>
              Swapnil and the SteelIQ team review your use case, schedule a 30-minute discovery call, and within
              a week you'll have a working SteelIQ environment with your sample data — accessible on
              <strong> steeliq.zealogics.info</strong>.
            </div>
          </div>
          {sent ? (
            <div className="lp-form">
              <div className="lp-form-success">
                ✓ Thank you, {form.name.split(' ')[0]}. Your inquiry has been received.<br/>
                Swapnil from SteelIQ will reach out within 24 business hours at <strong>{form.email}</strong>.<br/>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-mid)' }}>Direct line: <a href="mailto:swapnil@zealogics.com" style={{ color: 'var(--green)', textDecoration: 'underline' }}>swapnil@zealogics.com</a></span>
              </div>
            </div>
          ) : (
            <form className="lp-form" onSubmit={submit}>
              <div className="lp-form-row">
                <label className="lp-label">Full Name *</label>
                <input className="lp-input" required value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your name"/>
              </div>
              <div className="lp-form-row">
                <label className="lp-label">Company *</label>
                <input className="lp-input" required value={form.company} onChange={e => update('company', e.target.value)} placeholder="Company name"/>
              </div>
              <div className="lp-form-row">
                <label className="lp-label">Work Email *</label>
                <input className="lp-input" type="email" required value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@company.com"/>
              </div>
              <div className="lp-form-row">
                <label className="lp-label">Phone</label>
                <input className="lp-input" type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="Optional"/>
              </div>
              <div className="lp-form-row">
                <label className="lp-label">Your Role</label>
                <select className="lp-select" value={form.role} onChange={e => update('role', e.target.value)}>
                  {['Plant Manager', 'Operations Director', 'Reliability / R&R Engineer', 'Process / R&D Engineer', 'Digital / IT Leader', 'Executive (C-Suite)', 'Other'].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="lp-form-row">
                <label className="lp-label">Plant Type</label>
                <select className="lp-select" value={form.plantType} onChange={e => update('plantType', e.target.value)}>
                  {['Integrated Mill', 'Mini Mill / EAF', 'Specialty Steel', 'DRI / HBI Plant', 'Rolling / Finishing', 'Multi-site'].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="lp-form-row full">
                <label className="lp-label">I'm interested in</label>
                <select className="lp-select" value={form.interest} onChange={e => update('interest', e.target.value)}>
                  {['Trial Access (30 days)', 'Live Demo with my data', 'Pricing & Plant Pro details', 'Custom microapp development', 'Partnership & integrations', 'General inquiry'].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="lp-form-row full">
                <label className="lp-label">Tell us about your plant & use case</label>
                <textarea className="lp-textarea" value={form.message} onChange={e => update('message', e.target.value)} placeholder="What processes do you run? What data systems are in place? Where could AI add the most value?"/>
              </div>
              <div className="lp-form-row full" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>By submitting, you agree to our privacy policy. We never share your data.</div>
                <button type="submit" className="lp-btn lp-btn-primary lp-btn-lg">Send Inquiry →</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function LPFooter({ onLogin }) {
  return (
    <footer className="lp-footer">
      <div className="lp-footer-grid">
        <div>
          <div className="lp-logo" style={{ cursor: 'default' }}>
            <div className="lp-logo-mark">SQ</div>
            <div>
              <div className="lp-logo-text" style={{ color: '#fff' }}>Steel<em style={{ color: '#7aa0ff' }}>IQ</em></div>
              <div className="lp-logo-sub" style={{ color: '#7a8aac' }}>by Zealogics</div>
            </div>
          </div>
          <div className="lp-footer-tagline">
            Zealogics' Industrial AI offering for steel manufacturing. Designed, developed, enhanced and maintained
            by Zealogics. Built for Middle East steelmakers, accessible globally.
          </div>
          <a href="mailto:swapnil@zealogics.com?subject=SteelIQ%20Inquiry" style={{ display: 'inline-block', marginTop: 14, fontSize: 13, color: '#7aa0ff', textDecoration: 'none', fontWeight: 600 }}>✉ swapnil@zealogics.com →</a>
        </div>
        <div>
          <div className="lp-foot-h">Platform</div>
          <button className="lp-foot-link" onClick={() => lpScroll('process')}>Process Coverage</button>
          <button className="lp-foot-link" onClick={() => lpScroll('capabilities')}>Capabilities</button>
          <button className="lp-foot-link" onClick={() => lpScroll('outcomes')}>Outcomes</button>
          <button className="lp-foot-link" onClick={() => lpScroll('ai')}>Industrial AI</button>
          <button className="lp-foot-link" onClick={() => lpScroll('microapps')}>Microapps</button>
          <button className="lp-foot-link" onClick={() => lpScroll('lifecycle')}>Lifecycle</button>
        </div>
        <div>
          <div className="lp-foot-h">Deploy</div>
          <button className="lp-foot-link" onClick={() => lpScroll('integrations')}>Integrations</button>
          <button className="lp-foot-link" onClick={() => lpScroll('cloud')}>Cloud & Edge</button>
          <button className="lp-foot-link" onClick={() => lpScroll('trial')}>Trial & Pricing</button>
          <button className="lp-foot-link" onClick={onLogin}>Customer Login</button>
          <a className="lp-foot-link" href="https://steeliq.zealogics.info/" target="_blank" rel="noopener">Production Site ↗</a>
        </div>
        <div>
          <div className="lp-foot-h">Company</div>
          <a className="lp-foot-link" href="https://zealogics.com/" target="_blank" rel="noopener">About Zealogics ↗</a>
          <button className="lp-foot-link" onClick={() => lpScroll('contact')}>Contact</button>
          <a className="lp-foot-link" href="mailto:swapnil@zealogics.com?subject=Partnership%20Inquiry">Partnerships</a>
          <a className="lp-foot-link" href="mailto:swapnil@zealogics.com?subject=Media%20Inquiry">Press & Media</a>
          <a className="lp-foot-link" href="mailto:swapnil@zealogics.com?subject=Careers%20at%20Zealogics">Careers</a>
        </div>
      </div>
      <div className="lp-footer-bottom">
        <div>© 2026 Zealogics, Inc. All rights reserved. SteelIQ is a registered product of Zealogics — Industrial AI for steel manufacturing.</div>
        <div className="lp-foot-bottom-links">
          <button className="lp-foot-link" style={{ margin: 0 }}>Privacy</button>
          <button className="lp-foot-link" style={{ margin: 0 }}>Terms</button>
          <button className="lp-foot-link" style={{ margin: 0 }}>Security</button>
          <button className="lp-foot-link" style={{ margin: 0 }}>Cookies</button>
        </div>
      </div>
    </footer>
  );
}

/* Export to window for the host shell */
window.LandingPage = LandingPage;

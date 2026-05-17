/* ══════════════════════════════════════════════════════════════
   SteelIQ — Brand Mark Components
   Crucible Q + alternative concepts. All scalable SVG.
══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────
   PRIMARY MARK — "Crucible Q"
   A rounded steel-blue container (the crucible) holding a
   molten Q (the IQ). Industrial AI in one geometric mark.
───────────────────────────────────────────────────────── */
function SteelIQMark({ size = 120, variant = 'full', cornerRadius }) {
  const uid = React.useId().replace(/:/g, '');
  const isMonoDark = variant === 'mono-dark';
  const isMonoLight = variant === 'mono-light';
  const isWarm = variant === 'warm';

  // Color resolution per variant
  const block = isMonoDark
    ? `url(#m-${uid})`
    : isMonoLight
      ? 'rgba(255,255,255,0)'
      : isWarm
        ? `url(#bw-${uid})`
        : `url(#b-${uid})`;
  const stroke = isMonoLight ? '#fff' : isMonoDark ? '#fff' : isWarm ? `url(#mw-${uid})` : `url(#m-${uid})`;
  const sheenColor = isMonoLight ? 'rgba(255,255,255,0.3)' : isMonoDark ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.16)';
  const innerDot = isMonoLight ? '#fff' : isMonoDark ? '#fff' : '#ffd166';
  const r = cornerRadius != null ? cornerRadius : 42;

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="SteelIQ logo mark" style={{ display: 'block' }}>
      <defs>
        {/* Block gradient — steel-blue depth */}
        <linearGradient id={`b-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2c3a64"/>
          <stop offset="42%" stopColor="#111a32"/>
          <stop offset="100%" stopColor="#0a0f1e"/>
        </linearGradient>
        {/* Mono dark */}
        <linearGradient id={`md-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a2540"/>
          <stop offset="100%" stopColor="#0b1120"/>
        </linearGradient>
        {/* Warm variant block */}
        <linearGradient id={`bw-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3a1a2e"/>
          <stop offset="50%" stopColor="#1a0f1c"/>
          <stop offset="100%" stopColor="#1a0a14"/>
        </linearGradient>
        {/* Molten gradient — gold to orange */}
        <linearGradient id={`m-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffd97a"/>
          <stop offset="42%" stopColor="#ffae4a"/>
          <stop offset="100%" stopColor="#ff6a2d"/>
        </linearGradient>
        {/* Warm-variant molten gradient (brighter) */}
        <linearGradient id={`mw-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe892"/>
          <stop offset="42%" stopColor="#ffc05a"/>
          <stop offset="100%" stopColor="#ff8230"/>
        </linearGradient>
        {/* Inner shadow for depth on the block */}
        <radialGradient id={`is-${uid}`} cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.08)"/>
          <stop offset="60%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>
        {/* Soft glow for the molten elements */}
        <filter id={`g-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.4" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Container block */}
      <rect x="10" y="10" width="180" height="180" rx={r} fill={block}/>

      {/* Mono-light reverse: outline only */}
      {isMonoLight && (
        <rect x="11" y="11" width="178" height="178" rx={r - 1} fill="none" stroke="#fff" strokeWidth="2.5"/>
      )}

      {/* Inner highlight gradient (depth) */}
      {!isMonoLight && (
        <rect x="10" y="10" width="180" height="180" rx={r} fill={`url(#is-${uid})`} opacity={isMonoDark ? .35 : .7}/>
      )}

      {/* Top sheen — polished metal hint */}
      <path
        d="M40 32 Q 100 22, 160 32"
        stroke={sheenColor}
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Q ring — the open circle */}
      <circle
        cx="90"
        cy="98"
        r="48"
        fill="none"
        stroke={stroke}
        strokeWidth="14"
        strokeLinecap="round"
        filter={!isMonoDark && !isMonoLight ? `url(#g-${uid})` : undefined}
      />

      {/* Q tail — the diagonal spark */}
      <line
        x1="124"
        y1="132"
        x2="158"
        y2="166"
        stroke={stroke}
        strokeWidth="14"
        strokeLinecap="round"
        filter={!isMonoDark && !isMonoLight ? `url(#g-${uid})` : undefined}
      />

      {/* Tail terminus — bright dot (only in colorful variants) */}
      {(variant === 'full' || isWarm) && (
        <circle cx="158" cy="166" r="3" fill="#ffe892" opacity=".95"/>
      )}

      {/* Inner pulse dot — the AI center */}
      <circle cx="90" cy="98" r="5.5" fill={innerDot} opacity={isMonoLight ? .85 : 1}/>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────
   WORDMARK — "SteelIQ"
   "Steel" in Space Grotesk Bold + "IQ" in Instrument Serif italic
───────────────────────────────────────────────────────── */
function SteelIQWordmark({ theme = 'light', size = 1 }) {
  const baseSize = 38 * size;
  const iqSize = 56 * size;
  const steelColor = theme === 'dark' ? '#f0f3fa' : '#0b1120';
  return (
    <div style={{ display: 'inline-flex', alignItems: 'baseline', lineHeight: 1, fontFamily: 'Space Grotesk', letterSpacing: -1.5 * size, color: steelColor }}>
      <span style={{ fontWeight: 700, fontSize: baseSize }}>Steel</span>
      <span
        style={{
          fontFamily: 'Instrument Serif',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: iqSize,
          letterSpacing: -0.5 * size,
          marginLeft: 2 * size,
          background: 'linear-gradient(135deg, #ffd97a 0%, #ffae4a 45%, #ff6a2d 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
          lineHeight: .9,
        }}
      >IQ</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   LOCKUP — Mark + Wordmark in horizontal / stacked layouts
───────────────────────────────────────────────────────── */
function SteelIQLockup({ variant = 'horizontal', theme = 'light', size = 1, tagline }) {
  const markSize = variant === 'stacked' ? 96 * size : 72 * size;
  const subColor = theme === 'dark' ? 'rgba(160,180,210,0.75)' : 'rgba(74,82,108,0.7)';
  const sub = (
    <div style={{ fontSize: 11 * size, color: subColor, letterSpacing: 2.5 * size, textTransform: 'uppercase', fontWeight: 700, fontFamily: 'Space Grotesk', marginTop: 4 * size }}>
      by Zealogics
    </div>
  );
  const taglineEl = tagline && (
    <div style={{ fontSize: 12 * size, color: subColor, letterSpacing: 0.5 * size, fontFamily: 'Instrument Serif', fontStyle: 'italic', marginTop: 6 * size, lineHeight: 1.3 }}>
      {tagline}
    </div>
  );

  if (variant === 'stacked') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 * size }}>
        <SteelIQMark size={markSize}/>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <SteelIQWordmark theme={theme} size={size}/>
          {sub}
          {taglineEl}
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 * size }}>
      <SteelIQMark size={markSize}/>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <SteelIQWordmark theme={theme} size={size}/>
        {sub}
        {taglineEl}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ALTERNATIVE CONCEPT B — "Strand Stack"
   Three vertical CCM strands + intelligence node above
───────────────────────────────────────────────────────── */
function AltStrand({ size = 120 }) {
  const uid = React.useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="SteelIQ alt mark — Strand Stack">
      <defs>
        <linearGradient id={`s-b-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a78ff"/>
          <stop offset="100%" stopColor="#1a2540"/>
        </linearGradient>
        <linearGradient id={`s-m-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffd97a"/>
          <stop offset="100%" stopColor="#ff6a2d"/>
        </linearGradient>
        <filter id={`s-g-${uid}`}><feGaussianBlur stdDeviation="2"/></filter>
      </defs>

      {/* AI node glow halo */}
      <circle cx="100" cy="38" r="22" fill={`url(#s-m-${uid})`} opacity=".25" filter={`url(#s-g-${uid})`}/>

      {/* Connecting lines from node to strands */}
      {[60, 100, 140].map((x, i) => (
        <line key={i} x1="100" y1="42" x2={x} y2="74" stroke="#1a2540" strokeWidth="2" strokeOpacity=".5" strokeDasharray="3 4"/>
      ))}

      {/* 3 vertical strands */}
      {[
        { x: 60, h: 100 },
        { x: 100, h: 120 },
        { x: 140, h: 90 },
      ].map((b, i) => (
        <rect key={i} x={b.x - 12} y={200 - b.h - 20} width="24" height={b.h} rx="12" fill={`url(#s-b-${uid})`}/>
      ))}

      {/* AI Node */}
      <circle cx="100" cy="38" r="16" fill={`url(#s-m-${uid})`}/>
      <circle cx="100" cy="38" r="5" fill="#fff" opacity=".9"/>

      {/* Strand tops (caps) */}
      {[
        { x: 60, h: 100 },
        { x: 100, h: 120 },
        { x: 140, h: 90 },
      ].map((b, i) => (
        <line key={i + 'cap'} x1={b.x - 6} y1={200 - b.h - 20} x2={b.x + 6} y2={200 - b.h - 20} stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".4"/>
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────
   ALTERNATIVE CONCEPT C — "Pulse Beam"
   Steel I-beam silhouette with a live data pulse
───────────────────────────────────────────────────────── */
function AltPulse({ size = 120 }) {
  const uid = React.useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="SteelIQ alt mark — Pulse Beam">
      <defs>
        <linearGradient id={`p-b-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3a4a72"/>
          <stop offset="100%" stopColor="#0b1120"/>
        </linearGradient>
        <linearGradient id={`p-m-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffd97a"/>
          <stop offset="100%" stopColor="#ff6a2d"/>
        </linearGradient>
        <filter id={`p-g-${uid}`}>
          <feGaussianBlur stdDeviation="2"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* I-beam (industrial steel beam silhouette) */}
      <path d="M30 32 L170 32 L170 60 L116 60 L116 140 L170 140 L170 168 L30 168 L30 140 L84 140 L84 60 L30 60 Z"
        fill={`url(#p-b-${uid})`}/>

      {/* Top sheen */}
      <line x1="36" y1="36" x2="164" y2="36" stroke="rgba(255,255,255,0.18)" strokeWidth="1.6" strokeLinecap="round"/>

      {/* Live pulse line — runs across the beam web */}
      <path
        d="M30 100 L70 100 L80 80 L92 120 L104 70 L116 100 L170 100"
        stroke={`url(#p-m-${uid})`}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#p-g-${uid})`}
      />
      <circle cx="170" cy="100" r="4" fill="#ffe892"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────
   ALTERNATIVE CONCEPT D — "Hex Crystal"
   Hexagonal steel-crystal frame holding an italic Q
───────────────────────────────────────────────────────── */
function AltHex({ size = 120 }) {
  const uid = React.useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="SteelIQ alt mark — Hex Crystal">
      <defs>
        <linearGradient id={`h-b-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2c3a64"/>
          <stop offset="100%" stopColor="#0b1120"/>
        </linearGradient>
        <linearGradient id={`h-m-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffd97a"/>
          <stop offset="100%" stopColor="#ff6a2d"/>
        </linearGradient>
      </defs>

      {/* Hexagon outer */}
      <polygon points="100,20 168,60 168,140 100,180 32,140 32,60"
        fill={`url(#h-b-${uid})`}
        stroke="rgba(122,160,255,0.3)"
        strokeWidth="1.5"/>

      {/* Inner hex faceting hint */}
      <polygon points="100,42 148,68 148,132 100,158 52,132 52,68"
        fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>

      {/* Top sheen */}
      <line x1="56" y1="42" x2="144" y2="42" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeLinecap="round"/>

      {/* Q centerpiece */}
      <circle cx="92" cy="98" r="32" fill="none" stroke={`url(#h-m-${uid})`} strokeWidth="10" strokeLinecap="round"/>
      <line x1="114" y1="120" x2="138" y2="144" stroke={`url(#h-m-${uid})`} strokeWidth="10" strokeLinecap="round"/>
      <circle cx="92" cy="98" r="4" fill="#ffd166"/>

      {/* Vertex node accents */}
      {[
        [100, 20], [168, 60], [168, 140], [100, 180], [32, 140], [32, 60],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#7aa0ff" opacity=".65"/>
      ))}
    </svg>
  );
}

/* Expose to other Babel scripts */
Object.assign(window, { SteelIQMark, SteelIQWordmark, SteelIQLockup, AltStrand, AltPulse, AltHex });

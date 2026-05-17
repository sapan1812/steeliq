import React from 'react';

/**
 * SteelIQMark — The iconic "Q" mark with molten gold ring and diagonal tail.
 *
 * Props:
 *   size      — pixel size of the square (default 32)
 *   variant   — 'full' | 'mono-dark' | 'mono-light' | 'warm'
 */
export default function SteelIQMark({ size = 32, variant = 'full' }) {
  const id = React.useId().replace(/:/g, '');

  // Color palettes per variant
  const palettes = {
    full: {
      bg: '#0d1b2e',
      ringStart: '#ffd060',
      ringMid: '#ffae4a',
      ringEnd: '#ff7a1a',
      tail: '#ffae4a',
      glow: 'rgba(255,174,74,0.35)',
    },
    'mono-dark': {
      bg: '#0d1b2e',
      ringStart: '#8a99b8',
      ringMid: '#6a7a98',
      ringEnd: '#4a5568',
      tail: '#8a99b8',
      glow: 'rgba(138,153,184,0.2)',
    },
    'mono-light': {
      bg: '#f4f6fb',
      ringStart: '#2a4a7f',
      ringMid: '#3a5a9f',
      ringEnd: '#1a3a6f',
      tail: '#2a4a7f',
      glow: 'rgba(42,74,127,0.15)',
    },
    warm: {
      bg: '#1a0a00',
      ringStart: '#ff9020',
      ringMid: '#ff6010',
      ringEnd: '#cc3000',
      tail: '#ff7010',
      glow: 'rgba(255,112,16,0.4)',
    },
  };

  const p = palettes[variant] || palettes.full;
  const r = size;
  const cx = r / 2;
  const cy = r / 2;
  const rounding = r * 0.22;

  // Ring geometry
  const ringOuter = r * 0.295;
  const ringInner = r * 0.175;
  // Tail: starts at ~5 o'clock on outer ring, extends diagonally
  const tailAngle = 42; // degrees from bottom-right
  const rad = (tailAngle * Math.PI) / 180;
  const tailStartX = cx + ringOuter * Math.sin(rad);
  const tailStartY = cy + ringOuter * Math.cos(rad);
  const tailEndX = cx + r * 0.44 * Math.sin(rad);
  const tailEndY = cy + r * 0.44 * Math.cos(rad);
  const tailW = r * 0.065;

  return (
    <svg
      width={r}
      height={r}
      viewBox={`0 0 ${r} ${r}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="SteelIQ mark"
      role="img"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <defs>
        {/* Ring gradient */}
        <linearGradient id={`${id}rg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={p.ringStart} />
          <stop offset="50%" stopColor={p.ringMid} />
          <stop offset="100%" stopColor={p.ringEnd} />
        </linearGradient>
        {/* Tail gradient */}
        <linearGradient id={`${id}tg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={p.ringMid} />
          <stop offset="100%" stopColor={p.ringEnd} />
        </linearGradient>
        {/* Glow filter */}
        <filter id={`${id}glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={r * 0.06} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background rounded rect */}
      <rect
        x="0" y="0"
        width={r} height={r}
        rx={rounding} ry={rounding}
        fill={p.bg}
      />

      {/* Subtle inner highlight */}
      <rect
        x="0" y="0"
        width={r} height={r}
        rx={rounding} ry={rounding}
        fill="url(#none)"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="0.5"
      />

      {/* Q ring — annulus made from two circles as a clip-path ring */}
      <g filter={`url(#${id}glow)`}>
        {/* Outer ring circle */}
        <circle
          cx={cx} cy={cy}
          r={ringOuter}
          stroke={`url(#${id}rg)`}
          strokeWidth={ringOuter - ringInner}
          fill="none"
          strokeOpacity="0.95"
        />
      </g>

      {/* Q tail — tapered diagonal stroke */}
      <line
        x1={tailStartX}
        y1={tailStartY}
        x2={tailEndX}
        y2={tailEndY}
        stroke={`url(#${id}tg)`}
        strokeWidth={tailW}
        strokeLinecap="round"
        filter={`url(#${id}glow)`}
      />

      {/* Specular highlight dot on ring top-left */}
      <circle
        cx={cx - ringOuter * 0.6}
        cy={cy - ringOuter * 0.6}
        r={r * 0.028}
        fill="rgba(255,255,255,0.55)"
      />
    </svg>
  );
}

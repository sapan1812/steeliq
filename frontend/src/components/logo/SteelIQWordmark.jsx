import React from 'react';

/**
 * SteelIQWordmark — "Steel" in Space Grotesk Bold + "IQ" in Instrument Serif italic
 * with a gold-orange gradient applied to "IQ".
 *
 * Props:
 *   theme  — 'light' | 'dark'  (affects "Steel" color)
 *   size   — multiplier, default 1 (base size = 20px font)
 */
export default function SteelIQWordmark({ theme = 'light', size = 1 }) {
  const id = React.useId().replace(/:/g, '');
  const fontSize = Math.round(20 * size);
  const steelColor = theme === 'dark' ? '#e8ecf5' : '#0f1623';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 0,
        lineHeight: 1,
        userSelect: 'none',
      }}
      aria-label="SteelIQ"
    >
      {/* "Steel" — Space Grotesk Bold */}
      <span
        style={{
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          fontWeight: 700,
          fontSize: `${fontSize}px`,
          letterSpacing: '-0.02em',
          color: steelColor,
          lineHeight: 1,
        }}
      >
        Steel
      </span>

      {/* "IQ" — Instrument Serif italic with gradient */}
      <svg
        width={Math.round(fontSize * 1.28)}
        height={Math.round(fontSize * 1.15)}
        viewBox={`0 0 ${Math.round(fontSize * 1.28)} ${Math.round(fontSize * 1.15)}`}
        style={{
          overflow: 'visible',
          display: 'inline-block',
          verticalAlign: 'baseline',
          marginBottom: `-${Math.round(fontSize * 0.12)}px`,
        }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`${id}wg`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd060" />
            <stop offset="45%" stopColor="#ffae4a" />
            <stop offset="100%" stopColor="#ff7a1a" />
          </linearGradient>
        </defs>
        <text
          x="0"
          y={Math.round(fontSize * 0.88)}
          fontFamily="'Instrument Serif', Georgia, serif"
          fontStyle="italic"
          fontWeight="400"
          fontSize={fontSize}
          fill={`url(#${id}wg)`}
          letterSpacing="-0.01em"
        >
          IQ
        </text>
      </svg>
    </span>
  );
}

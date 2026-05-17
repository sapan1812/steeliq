import React from 'react';
import SteelIQMark from './SteelIQMark.jsx';
import SteelIQWordmark from './SteelIQWordmark.jsx';

/**
 * SteelIQLockup — Mark + Wordmark + optional tagline in horizontal or stacked layout.
 *
 * Props:
 *   variant  — 'full' | 'mono-dark' | 'mono-light' | 'warm'  (passed to SteelIQMark)
 *   theme    — 'light' | 'dark'  (passed to SteelIQWordmark)
 *   size     — multiplier, default 1 (base mark = 32px, font = 20px)
 *   layout   — 'horizontal' | 'stacked' (default 'horizontal')
 *   tagline  — boolean, show "by Zealogics" subtitle (default false)
 */
export default function SteelIQLockup({
  variant = 'full',
  theme = 'light',
  size = 1,
  layout = 'horizontal',
  tagline = false,
}) {
  const markSize = Math.round(32 * size);
  const gap = Math.round(10 * size);
  const bySize = Math.round(11 * size);
  const zealSize = Math.round(12 * size);

  const subtitleColor = theme === 'dark' ? 'rgba(138,153,184,0.7)' : 'rgba(90,99,120,0.65)';
  const zealColor = theme === 'dark' ? '#8a99b8' : '#5a6378';

  if (layout === 'stacked') {
    return (
      <div
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: Math.round(8 * size),
          userSelect: 'none',
        }}
        aria-label="SteelIQ"
      >
        <SteelIQMark size={Math.round(48 * size)} variant={variant} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Math.round(3 * size) }}>
          <SteelIQWordmark theme={theme} size={size} />
          {tagline && (
            <span style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontSize: `${bySize}px`,
              fontWeight: 400,
              color: subtitleColor,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              by{' '}
              <span style={{ fontWeight: 600, color: zealColor }}>Zealogics</span>
            </span>
          )}
        </div>
      </div>
    );
  }

  // Horizontal layout (default)
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${gap}px`,
        userSelect: 'none',
      }}
      aria-label="SteelIQ"
    >
      <SteelIQMark size={markSize} variant={variant} />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: Math.round(1 * size) }}>
        <SteelIQWordmark theme={theme} size={size} />
        {tagline && (
          <span style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: `${bySize}px`,
            fontWeight: 400,
            color: subtitleColor,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            lineHeight: 1,
          }}>
            by{' '}
            <span style={{ fontWeight: 600, color: zealColor, fontSize: `${zealSize}px` }}>Zealogics</span>
          </span>
        )}
      </div>
    </div>
  );
}

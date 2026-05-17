import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ══════════════════════════════════════════════════════════════
   SteelIQ — Marketing Landing Page (Light Theme)
   Matches the SteelIQ prototype design.
══════════════════════════════════════════════════════════════ */

/* ── Smooth scroll helper ── */
const lpScroll = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

/* ── Global styles injected once ── */
const LP_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;600&display=swap');

  .lp-page {
    position: fixed; inset: 0; overflow-y: auto; overflow-x: hidden;
    background: var(--bg); color: var(--text); z-index: 1;
    font-family: var(--sans); scroll-behavior: smooth;
    --display: 'Instrument Serif', Georgia, serif;
    --hot: #ff6a2d;
    --shadow-soft: 0 1px 2px rgba(20,40,100,0.04), 0 8px 24px rgba(20,40,100,0.06);
    --shadow-hover: 0 20px 50px rgba(20,40,100,0.12), 0 4px 12px rgba(20,40,100,0.06);
    --shadow-cta: 0 8px 24px rgba(50,110,255,0.32), inset 0 1px 0 rgba(255,255,255,0.2);
    --shadow-cta-hover: 0 16px 44px rgba(50,110,255,0.45), inset 0 1px 0 rgba(255,255,255,0.28);
    --grad-primary: linear-gradient(135deg, oklch(56% 0.24 252deg) 0%, oklch(50% 0.27 280deg) 50%, oklch(58% 0.26 320deg) 100%);
  }
  .lp-page * { box-sizing: border-box; }

  /* Nav */
  .lp-nav {
    position: sticky; top: 0; z-index: 50;
    background: rgba(255,255,255,0.78);
    backdrop-filter: saturate(160%) blur(20px);
    border-bottom: 1px solid var(--border);
    height: 68px; display: flex; align-items: center;
  }
  .lp-nav-inner {
    max-width: 1280px; width: 100%; margin: 0 auto;
    display: flex; align-items: center; gap: 24px; padding: 0 32px;
  }
  .lp-logo { display: flex; align-items: center; gap: 10px; flex-shrink: 0; cursor: pointer; }
  .lp-logo-mark {
    width: 36px; height: 36px; border-radius: 9px;
    background: linear-gradient(140deg, oklch(60% 0.22 248deg), oklch(48% 0.24 268deg));
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 13px; color: #fff;
    box-shadow: 0 4px 14px rgba(50,110,255,0.25); letter-spacing: -.5px;
  }
  .lp-logo-text { font-size: 19px; font-weight: 700; letter-spacing: -.4px; line-height: 1.05; }
  .lp-logo-text em { color: var(--blue); font-style: normal; }
  .lp-logo-sub { font-size: 9px; color: var(--text-dim); letter-spacing: 1.8px; text-transform: uppercase; margin-top: 1px; font-weight: 600; }
  .lp-nav-links { display: flex; gap: 28px; flex: 1; justify-content: center; }
  .lp-nav-link {
    font-size: 13px; font-weight: 500; color: var(--text-mid);
    cursor: pointer; transition: color .15s; background: none; border: none;
    font-family: var(--sans); padding: 0; position: relative;
  }
  .lp-nav-link:hover { color: var(--text); }
  .lp-nav-link::after {
    content: ''; position: absolute; left: 0; right: 0; bottom: -22px;
    height: 2px; background: var(--blue); transform: scaleX(0); transition: transform .2s; border-radius: 1px;
  }
  .lp-nav-link:hover::after { transform: scaleX(1); }
  .lp-nav-right { display: flex; align-items: center; gap: 14px; flex-shrink: 0; }
  .lp-nav-secondary {
    font-size: 13px; color: var(--text-mid); font-weight: 500;
    cursor: pointer; background: none; border: none; font-family: var(--sans);
    transition: color .15s;
  }
  .lp-nav-secondary:hover { color: var(--text); }

  /* Buttons */
  .lp-btn {
    display: inline-flex; align-items: center; gap: 8px; padding: 9px 18px;
    border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;
    border: none; font-family: var(--sans); transition: transform .15s, box-shadow .15s; white-space: nowrap;
  }
  .lp-btn-primary {
    background: var(--grad-primary); color: #fff; box-shadow: var(--shadow-cta);
    background-size: 200% 200%; background-position: 0% 50%;
    transition: transform .2s, box-shadow .25s, background-position .4s ease;
  }
  .lp-btn-primary:hover { transform: translateY(-2px); box-shadow: var(--shadow-cta-hover); background-position: 100% 50%; }
  .lp-btn-ghost { background: var(--bg2); border: 1px solid var(--border2); color: var(--text); box-shadow: var(--shadow-soft); transition: all .2s; }
  .lp-btn-ghost:hover { border-color: var(--blue); color: var(--blue); box-shadow: 0 8px 24px rgba(50,110,255,0.12); transform: translateY(-2px); }
  .lp-btn-lg { padding: 15px 26px; font-size: 14.5px; letter-spacing: .2px; }

  /* Eyebrow */
  .lp-eyebrow {
    display: inline-flex; align-items: center; gap: 11px; padding: 6px 12px 6px 6px;
    background: var(--blue-lo); border: 1px solid var(--border2); border-radius: 999px;
    color: var(--blue); font-size: 10.5px; font-weight: 700; letter-spacing: 2px; margin-bottom: 18px;
  }
  .lp-eyebrow::before {
    content: ''; width: 18px; height: 6px; border-radius: 2px;
    background: linear-gradient(90deg, var(--blue), #ff6a2d); flex-shrink: 0;
  }

  /* Headlines */
  .lp-h1 { font-size: clamp(40px, 6.2vw, 76px); font-weight: 600; line-height: 1; letter-spacing: -2.2px; margin: 0 0 22px; }
  .lp-h1 em {
    font-family: var(--display); font-style: italic; font-weight: 400; letter-spacing: -1.5px;
    background: linear-gradient(135deg, oklch(58% 0.24 250deg) 0%, oklch(58% 0.26 290deg) 50%, oklch(62% 0.22 30deg) 100%);
    -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; padding-right: .05em;
  }
  .lp-h2 { font-size: clamp(30px, 3.8vw, 46px); font-weight: 600; letter-spacing: -1.1px; line-height: 1.08; margin: 0 0 14px; }
  .lp-h2 em { font-family: var(--display); font-style: italic; font-weight: 400; color: var(--blue); letter-spacing: -.6px; }
  .lp-h3 { font-size: 19px; font-weight: 700; line-height: 1.3; margin: 0 0 10px; }
  .lp-lead { font-size: 17.5px; color: var(--text-mid); line-height: 1.65; max-width: 640px; margin: 0 0 32px; }
  .lp-lead strong { color: var(--text); font-weight: 600; }

  /* Hero */
  .lp-hero {
    padding: 100px 32px 110px; position: relative; overflow: hidden;
    background:
      radial-gradient(ellipse 70% 50% at 78% 26%, rgba(50,110,255,0.18), transparent 60%),
      radial-gradient(ellipse 55% 45% at 8% 88%, rgba(160,80,255,0.13), transparent 60%),
      radial-gradient(ellipse 60% 50% at 100% 100%, rgba(255,110,40,0.1), transparent 55%),
      linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%);
  }
  .lp-hero::before {
    content: ''; position: absolute; inset: -2px;
    background-image: radial-gradient(circle, rgba(20,40,100,0.12) 1.2px, transparent 1.2px);
    background-size: 28px 28px;
    -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, #000, transparent 75%);
    mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, #000, transparent 75%);
    opacity: .7; pointer-events: none; z-index: 0;
  }
  .lp-hero::after {
    content: ''; position: absolute; top: -200px; right: -220px;
    width: 580px; height: 580px; border-radius: 50%;
    background: conic-gradient(from 220deg, rgba(50,110,255,0.18), rgba(160,80,255,0.12), rgba(255,110,40,0.12), rgba(50,110,255,0.18));
    filter: blur(80px); opacity: .7; pointer-events: none; z-index: 0;
    animation: lp-spin 24s linear infinite;
  }
  @keyframes lp-spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
  .lp-hero > * { position: relative; z-index: 1; }
  .lp-hero-grid {
    display: grid; grid-template-columns: 1.05fr 1fr; gap: 48px;
    align-items: center; max-width: 1280px; margin: 0 auto;
  }
  .lp-hero-cta { display: flex; gap: 12px; flex-wrap: wrap; }
  .lp-hero-stats {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;
    margin-top: 40px; padding-top: 28px; border-top: 1px solid var(--border);
  }
  .lp-stat-val {
    font-size: 34px; font-weight: 700; letter-spacing: -1px;
    background: linear-gradient(180deg, var(--text) 0%, var(--blue) 110%);
    -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
    line-height: 1;
  }
  .lp-stat-label { font-size: 11px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1.2px; margin-top: 6px; font-weight: 600; line-height: 1.4; }

  /* Trust strip */
  .lp-trust { background: linear-gradient(180deg, #fafbfd, #fff); padding: 44px 32px; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
  .lp-trust-inner { max-width: 1280px; margin: 0 auto; display: flex; align-items: center; gap: 20px; flex-wrap: wrap; justify-content: center; }
  .lp-trust-label { font-size: 11px; font-weight: 700; color: var(--text-dim); letter-spacing: 2px; text-transform: uppercase; }
  .lp-trust-item { font-size: 12.5px; color: var(--text-mid); font-weight: 600; letter-spacing: .3px; padding: 7px 14px; border: 1px solid var(--border); border-radius: 20px; background: var(--bg); }

  /* Sections */
  .lp-section { padding: 108px 32px; position: relative; }
  .lp-section-inner { max-width: 1280px; margin: 0 auto; }
  .lp-section-alt { background: linear-gradient(180deg, #f8f9fd 0%, var(--bg) 100%); position: relative; }
  .lp-section-alt::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--border2), transparent); }
  .lp-section-dark { background: #070b14; color: #e8edf8; }
  .lp-section-dark .lp-eyebrow { color: #7aa0ff; }
  .lp-section-dark .lp-lead { color: #a0aac4; }
  .lp-section-dark .lp-h2 { color: #fff; }
  .lp-section-head { text-align: center; max-width: 720px; margin: 0 auto 64px; }
  .lp-section-head .lp-lead { margin-left: auto; margin-right: auto; }

  /* How it works */
  .lp-flow { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; align-items: stretch; position: relative; margin-top: 20px; }
  .lp-flow-step {
    background: var(--bg2); border: 1px solid var(--border); border-radius: 12px;
    padding: 24px 18px 20px; padding-top: 24px; position: relative;
    display: flex; flex-direction: column; gap: 8px;
    box-shadow: var(--shadow-soft); transition: transform .25s, box-shadow .25s, border-color .25s;
  }
  .lp-flow-num {
    position: absolute; top: -12px; left: 18px; width: 26px; height: 26px;
    border-radius: 7px; background: var(--blue); color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--mono); font-size: 11px; font-weight: 700;
    box-shadow: 0 4px 12px rgba(50,110,255,0.3);
  }
  .lp-flow-anim {
    margin: 6px 0 4px; display: flex; align-items: center; justify-content: center;
    width: 64px; height: 64px; border-radius: 14px;
    border: 1px solid var(--border); background: var(--bg);
  }
  .lp-flow-title { font-size: 14px; font-weight: 700; }
  .lp-flow-desc { font-size: 11.5px; color: var(--text-dim); line-height: 1.55; }

  /* Capabilities */
  .lp-cap-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .lp-cap-card {
    background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; padding: 26px;
    transition: transform .25s, box-shadow .25s, border-color .25s;
    box-shadow: var(--shadow-soft);
  }
  .lp-cap-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-hover); }
  .lp-cap-icon {
    width: 46px; height: 46px; border-radius: 11px; display: flex; align-items: center;
    justify-content: center; font-size: 20px; margin-bottom: 18px; font-weight: 800;
    border: 1px solid currentColor; box-shadow: 0 4px 16px rgba(20,40,100,0.06), inset 0 1px 0 rgba(255,255,255,0.6);
  }
  .lp-cap-desc { font-size: 13px; color: var(--text-mid); line-height: 1.6; }

  /* Outcomes */
  .lp-out-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .lp-out-card {
    background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; padding: 24px;
    box-shadow: var(--shadow-soft); transition: transform .25s, box-shadow .25s, border-color .25s;
    display: flex; flex-direction: column; position: relative; overflow: hidden;
  }
  .lp-out-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-hover); }
  .lp-out-card::after {
    content: ''; position: absolute; right: -40px; bottom: -40px;
    width: 140px; height: 140px; border-radius: 50%;
    background: radial-gradient(circle, var(--out-glow, rgba(50,110,255,0.07)), transparent 70%);
    pointer-events: none;
  }
  .lp-out-icon {
    width: 48px; height: 48px; border-radius: 11px; display: flex; align-items: center;
    justify-content: center; margin-bottom: 16px; font-weight: 800; border: 1px solid currentColor;
    box-shadow: 0 4px 16px rgba(20,40,100,0.06), inset 0 1px 0 rgba(255,255,255,0.6);
  }
  .lp-out-metric { font-family: var(--display); font-weight: 400; font-style: italic; font-size: 48px; line-height: 1; letter-spacing: -1.5px; margin-bottom: 6px; }
  .lp-out-metric > span:first-child { font-family: var(--mono); font-style: normal; font-weight: 700; letter-spacing: -1px; }
  .lp-out-unit { font-size: 13px; color: var(--text-dim); margin-left: 4px; font-family: var(--mono); }
  .lp-out-desc { font-size: 13px; color: var(--text-mid); line-height: 1.6; margin-top: 8px; }

  /* AI Section */
  .lp-ai-grid { display: grid; grid-template-columns: 1.05fr 1fr; gap: 48px; align-items: center; }
  .lp-ai-demo {
    background: linear-gradient(180deg, #0b1120, #0f1726); border-radius: 14px; padding: 24px;
    color: #e8edf8; font-family: var(--mono); font-size: 12.5px; line-height: 1.7;
    box-shadow: 0 24px 60px rgba(20,40,100,0.18); position: relative; overflow: hidden;
    border: 1px solid #1d2a44;
  }
  .lp-ai-demo::before {
    content: ''; position: absolute; top: -40%; right: -40%; width: 80%; height: 80%;
    background: radial-gradient(circle, rgba(160,80,255,0.18), transparent 60%); pointer-events: none;
  }
  .lp-ai-prompt-line { color: #7aa0ff; display: flex; align-items: center; gap: 8px; margin-bottom: 12px; font-weight: 600; position: relative; }
  .lp-ai-prompt-line .lp-ai-icon { color: #a060ff; font-size: 14px; }
  .lp-ai-response { color: #a0aac4; margin-bottom: 14px; position: relative; }
  .lp-ai-response strong { color: #fff; font-weight: 600; }
  .lp-ai-response .hl-amber { color: #ffd166; }
  .lp-ai-response .hl-red { color: #ff7d8a; }
  .lp-ai-response .hl-green { color: #6dd58c; }
  .lp-ai-tag { display: inline-block; font-size: 9px; padding: 2px 7px; border-radius: 3px; background: rgba(160,80,255,0.18); color: #c599ff; letter-spacing: 1px; margin-left: 6px; font-weight: 700; }
  .lp-ai-cursor { display: inline-block; width: 7px; height: 14px; background: #a060ff; margin-left: 2px; vertical-align: middle; animation: lp-blink 1s infinite; }
  @keyframes lp-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
  .lp-ai-features { display: flex; flex-direction: column; gap: 18px; }
  .lp-ai-feat { display: flex; gap: 14px; align-items: flex-start; }
  .lp-ai-feat-icon {
    width: 40px; height: 40px; border-radius: 9px; background: var(--purple-lo);
    border: 1px solid rgba(160,80,255,0.25); display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0; color: var(--purple); font-weight: 800;
  }

  /* Microapps */
  .lp-mod-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
  .lp-mod-card {
    background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; padding: 24px;
    position: relative; overflow: hidden; transition: transform .25s, box-shadow .25s;
    box-shadow: var(--shadow-soft); min-height: 220px; display: flex; flex-direction: column;
  }
  .lp-mod-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--mod-c, var(--blue)); opacity: .8; }
  .lp-mod-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-hover); }
  .lp-mod-card.special { background: linear-gradient(140deg, var(--purple-lo), var(--bg2)); border-color: rgba(160,80,255,0.3); border-style: dashed; }
  .lp-mod-card.special::before { background: linear-gradient(90deg, var(--purple), #ff6a2d); }
  .lp-mod-icon {
    width: 46px; height: 46px; border-radius: 11px; display: flex; align-items: center;
    justify-content: center; font-size: 18px; font-weight: 800; margin-bottom: 16px; border: 1px solid currentColor;
    box-shadow: 0 4px 16px rgba(20,40,100,0.06), inset 0 1px 0 rgba(255,255,255,0.6);
  }
  .lp-mod-features { margin-top: auto; display: flex; flex-direction: column; gap: 5px; padding-top: 14px; border-top: 1px solid var(--border); }
  .lp-mod-feat { font-size: 11.5px; color: var(--text-mid); display: flex; align-items: center; gap: 8px; }
  .lp-mod-feat::before { content: ''; width: 4px; height: 4px; border-radius: 50%; background: currentColor; opacity: .6; flex-shrink: 0; }

  /* Integrations */
  .lp-int-cats { display: flex; flex-direction: column; gap: 28px; }
  .lp-int-cat-label { font-size: 11px; font-weight: 700; color: var(--text-dim); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; }
  .lp-int-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 10px; }
  .lp-int-card {
    background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; padding: 16px 14px;
    transition: transform .15s, border-color .15s, box-shadow .15s;
    display: flex; flex-direction: column; gap: 5px; box-shadow: var(--shadow-soft);
  }
  .lp-int-card:hover { border-color: var(--border2); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(20,40,100,0.06); }
  .lp-int-name { font-size: 13px; font-weight: 700; }
  .lp-int-type { font-size: 10px; color: var(--text-dim); letter-spacing: .5px; }

  /* Pricing */
  .lp-trial-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; align-items: stretch; }
  .lp-trial-card {
    background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; padding: 28px;
    display: flex; flex-direction: column; box-shadow: var(--shadow-soft);
    position: relative; transition: transform .25s, box-shadow .25s;
  }
  .lp-trial-card:hover { transform: translateY(-3px); }
  .lp-trial-card.featured {
    background: linear-gradient(180deg, #fff, #fafbff);
    border: 1px solid transparent; background-clip: padding-box;
    box-shadow: 0 24px 64px rgba(50,110,255,0.18), 0 0 0 2px var(--blue), inset 0 1px 0 #fff;
    transform: scale(1.02);
  }
  .lp-trial-card.featured:hover { transform: scale(1.02) translateY(-3px); }
  .lp-trial-badge {
    position: absolute; top: -10px; left: 50%; transform: translateX(-50%);
    background: var(--blue); color: #fff; font-size: 9.5px; font-weight: 700;
    letter-spacing: 1.5px; padding: 4px 12px; border-radius: 4px;
  }
  .lp-trial-name { font-size: 13px; font-weight: 700; color: var(--blue); letter-spacing: .8px; text-transform: uppercase; }
  .lp-trial-price { font-family: var(--display); font-style: italic; font-weight: 400; font-size: 42px; letter-spacing: -1px; line-height: 1; margin: 14px 0 6px; color: var(--text); }
  .lp-trial-cycle { font-size: 12px; color: var(--text-dim); margin-bottom: 20px; }
  .lp-trial-features { flex: 1; display: flex; flex-direction: column; gap: 9px; margin-bottom: 20px; padding-top: 18px; border-top: 1px solid var(--border); }
  .lp-trial-feat { font-size: 12.5px; color: var(--text-mid); display: flex; align-items: flex-start; gap: 9px; line-height: 1.5; }
  .lp-trial-feat::before { content: '✓'; color: var(--green); font-weight: 700; flex-shrink: 0; font-size: 12px; margin-top: 1px; }

  /* Contact */
  .lp-contact-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 48px; align-items: start; }
  .lp-contact-info { display: flex; flex-direction: column; gap: 22px; }
  .lp-contact-item { display: flex; gap: 14px; align-items: flex-start; }
  .lp-contact-icon { width: 38px; height: 38px; border-radius: 9px; background: var(--blue-lo); display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; color: var(--blue); }
  .lp-contact-item-label { font-size: 10.5px; color: var(--text-dim); letter-spacing: 1px; text-transform: uppercase; font-weight: 700; }
  .lp-contact-item-val { font-size: 14px; color: var(--text); margin-top: 3px; font-weight: 500; }
  .lp-form { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; padding: 28px; box-shadow: var(--shadow-soft); }
  .lp-form-row { display: flex; flex-direction: column; gap: 5px; }
  .lp-form-row.full { grid-column: span 2; }
  .lp-input, .lp-textarea, .lp-select {
    width: 100%; background: var(--bg); border: 1px solid var(--border2); border-radius: 8px;
    padding: 10px 13px; color: var(--text); font-family: var(--sans); font-size: 13px;
    outline: none; transition: border-color .15s, box-shadow .15s;
  }
  .lp-input:focus, .lp-textarea:focus, .lp-select:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(50,110,255,0.12); }
  .lp-textarea { min-height: 110px; resize: vertical; font-family: var(--sans); }
  .lp-label { font-size: 11px; font-weight: 600; color: var(--text-mid); letter-spacing: .3px; }
  .lp-form-success { grid-column: span 2; padding: 32px 20px; border: 1px solid rgba(50,200,110,0.3); background: var(--green-lo); border-radius: 10px; color: var(--green); font-size: 14px; font-weight: 600; text-align: center; line-height: 1.6; }

  /* Footer */
  .lp-footer { background: #0a0f1c; color: #a0aac4; padding: 56px 32px 28px; border-top: 1px solid #1a2540; }
  .lp-footer-grid { max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 36px; }
  .lp-footer-tagline { font-size: 13px; color: #a0aac4; margin-top: 16px; line-height: 1.6; max-width: 280px; }
  .lp-foot-h { font-size: 11.5px; font-weight: 700; color: #fff; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 16px; }
  .lp-foot-link {
    display: block; font-size: 13px; color: #a0aac4; margin-bottom: 9px;
    text-decoration: none; cursor: pointer; transition: color .15s;
    background: none; border: none; padding: 0; font-family: var(--sans); text-align: left;
  }
  .lp-foot-link:hover { color: #fff; }
  .lp-footer-bottom { max-width: 1280px; margin: 0 auto; padding-top: 24px; border-top: 1px solid #1a2540; display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #5e6a85; flex-wrap: wrap; gap: 14px; }
  .lp-foot-bottom-links { display: flex; gap: 20px; }

  /* Cloud section */
  .lp-cloud-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 48px; align-items: center; }
  .lp-cloud-points { display: flex; flex-direction: column; gap: 18px; }
  .lp-cloud-point { display: flex; gap: 14px; align-items: flex-start; }
  .lp-cloud-pt-icon { width: 36px; height: 36px; border-radius: 9px; background: rgba(80,150,255,0.12); border: 1px solid rgba(80,150,255,0.25); display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; color: #7aa0ff; font-weight: 800; }
  .lp-cloud-pt-title { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 3px; }
  .lp-cloud-pt-desc { font-size: 12.5px; color: #a0aac4; line-height: 1.6; }
  .lp-cloud-card { background: linear-gradient(180deg, #0e1626, #0a111e); border-radius: 16px; padding: 36px; border: 1px solid #1a2540; }

  /* Lifecycle */
  .lp-life-flow { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; align-items: stretch; }
  .lp-life-step {
    background: var(--bg2); border: 1px solid var(--border); border-radius: 12px;
    padding: 30px 18px 22px; position: relative; box-shadow: var(--shadow-soft);
    display: flex; flex-direction: column; gap: 8px;
    transition: transform .25s, box-shadow .25s;
  }
  .lp-life-step::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--life-c); border-radius: 12px 12px 0 0; }
  .lp-life-num { width: 30px; height: 30px; border-radius: 8px; color: #fff; display: flex; align-items: center; justify-content: center; font-family: var(--mono); font-size: 13px; font-weight: 700; margin-bottom: 6px; box-shadow: 0 6px 16px rgba(50,110,255,0.3), inset 0 1px 0 rgba(255,255,255,0.3); }
  .lp-life-title { font-size: 15px; font-weight: 700; color: var(--text); line-height: 1.25; }
  .lp-life-desc { font-size: 12px; color: var(--text-dim); line-height: 1.55; }
  .lp-life-arrow { position: absolute; right: -18px; top: 50%; transform: translateY(-50%); font-size: 20px; font-weight: 700; z-index: 1; background: var(--bg); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); }

  /* Process SVG */
  .lp-proc-svg-wrap { width: 100%; overflow-x: auto; padding: 24px 8px; background: linear-gradient(180deg, #fff 0%, #f4f7fc 100%); border-radius: 14px; border: 1px solid var(--border); box-shadow: var(--shadow-soft); }
  .lp-proc-note { display: flex; align-items: flex-start; gap: 14px; margin-top: 32px; padding: 18px 22px; background: var(--purple-lo); border: 1px dashed rgba(160,80,255,0.35); border-radius: 12px; }
  .lp-proc-note-icon { width: 36px; height: 36px; border-radius: 9px; background: rgba(160,80,255,0.18); border: 1px solid rgba(160,80,255,0.4); display: flex; align-items: center; justify-content: center; color: var(--purple); font-size: 18px; font-weight: 800; flex-shrink: 0; }
  .lp-proc-note-title { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 3px; }
  .lp-proc-note-desc { font-size: 12.5px; color: var(--text-mid); line-height: 1.6; }

  /* Responsive */
  @media (max-width: 1100px) {
    .lp-flow { grid-template-columns: repeat(3, 1fr); row-gap: 24px; }
    .lp-cap-grid { grid-template-columns: repeat(2, 1fr); }
    .lp-life-flow { grid-template-columns: repeat(2, 1fr); row-gap: 32px; }
    .lp-life-arrow { display: none; }
    .lp-out-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 768px) {
    .lp-nav-links { display: none; }
    .lp-hero-grid, .lp-ai-grid, .lp-cloud-grid, .lp-contact-grid { grid-template-columns: 1fr; gap: 40px; }
    .lp-trial-grid { grid-template-columns: 1fr; }
    .lp-trial-card.featured { transform: none; }
    .lp-trial-card.featured:hover { transform: translateY(-3px); }
    .lp-flow { grid-template-columns: 1fr; row-gap: 24px; }
    .lp-cap-grid { grid-template-columns: 1fr; }
    .lp-section { padding: 64px 22px; }
    .lp-hero { padding: 48px 22px 64px; }
    .lp-hero-stats { grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .lp-form { grid-template-columns: 1fr; }
    .lp-form-row.full { grid-column: span 1; }
    .lp-footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
    .lp-nav-inner { padding: 0 18px; }
    .lp-life-flow { grid-template-columns: 1fr; }
    .lp-out-grid { grid-template-columns: 1fr; }
  }
`;

/* ────────────────────────────────────────────── */
/* Hero Dashboard Mock (SVG)                      */
/* ────────────────────────────────────────────── */
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
        <rect x="0" y="0" width="520" height="380" rx="14" fill="#0b1120"/>
        <rect x="0" y="0" width="520" height="34" fill="#111a2c"/>
        <rect x="0" y="20" width="520" height="14" fill="#111a2c"/>
        <circle cx="18" cy="17" r="5" fill="#ff5f56"/>
        <circle cx="36" cy="17" r="5" fill="#ffbd2e"/>
        <circle cx="54" cy="17" r="5" fill="#28c940"/>
        <text x="260" y="22" textAnchor="middle" fill="#5a6a8a" fontSize="10" fontFamily="'JetBrains Mono',monospace">app.steeliq.zealogics.com · Command Center</text>
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
        <rect x={16} y={154} width={310} height={170} rx={9} fill="#111a2c" stroke="#1d2a44"/>
        <text x={30} y={174} fill="#e8edf8" fontSize="11" fontWeight="700">Tundish — Actual vs Predicted</text>
        <text x={312} y={174} textAnchor="end" fill="#3acc7a" fontSize="9" fontWeight="700">● LIVE</text>
        <path d="M30,280 Q70,220 110,235 T190,205 T260,225 T312,195" stroke="#3a78ff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M30,280 Q70,220 110,235 T190,205 T260,225 T312,195 L312,310 L30,310 Z" fill="url(#hg-chart)"/>
        <circle cx="312" cy="195" r="4" fill="#3a78ff"/>
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
        <rect x={16} y={338} width={488} height={26} rx={6} fill="#0d1424" stroke="#1d2a44"/>
        <circle cx={28} cy={351} r={3.5} fill="#3acc7a">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <text x={40} y={355} fill="#8a9bbf" fontSize="9" fontFamily="'JetBrains Mono',monospace">IBA · 1.2k tags/s</text>
        <text x={150} y={355} fill="#8a9bbf" fontSize="9" fontFamily="'JetBrains Mono',monospace">L2 · OPC-UA 240Hz</text>
        <text x={272} y={355} fill="#8a9bbf" fontSize="9" fontFamily="'JetBrains Mono',monospace">AI · 94ms p95</text>
        <text x={368} y={355} fill="#8a9bbf" fontSize="9" fontFamily="'JetBrains Mono',monospace">Uptime · 99.94%</text>
      </svg>
      <div style={{ position: 'absolute', right: -10, top: 32, background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 12px', boxShadow: '0 8px 24px rgba(20,40,100,0.12)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, color: 'var(--text)' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 0 3px rgba(50,200,110,0.18)' }}/>
        <span>Live · 12 plants</span>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────── */
/* Flow Step Icons (SVG animated)                 */
/* ────────────────────────────────────────────── */
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

/* ────────────────────────────────────────────── */
/* Cloud Architecture SVG                         */
/* ────────────────────────────────────────────── */
function LPCloudArch() {
  return (
    <div className="lp-cloud-card" style={{ marginTop: 28 }}>
      <svg viewBox="0 0 520 220" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <rect x="10" y="80" width="120" height="100" rx="10" fill="rgba(80,130,255,0.08)" stroke="rgba(80,130,255,0.3)"/>
        <text x="70" y="102" textAnchor="middle" fill="#7aa0ff" fontSize="11" fontWeight="700">PLANT FLOOR</text>
        <text x="70" y="124" textAnchor="middle" fill="#a0aac4" fontSize="9">IBA · Level 2</text>
        <text x="70" y="138" textAnchor="middle" fill="#a0aac4" fontSize="9">PLCs · DCS</text>
        <text x="70" y="152" textAnchor="middle" fill="#a0aac4" fontSize="9">Sensors · Vision</text>
        <text x="70" y="172" textAnchor="middle" fill="#5e6a85" fontSize="8" fontFamily="'JetBrains Mono',monospace">on-prem</text>
        <rect x="160" y="80" width="120" height="100" rx="10" fill="rgba(255,165,40,0.08)" stroke="rgba(255,165,40,0.3)"/>
        <text x="220" y="102" textAnchor="middle" fill="#ffa528" fontSize="11" fontWeight="700">EDGE GATEWAY</text>
        <text x="220" y="124" textAnchor="middle" fill="#a0aac4" fontSize="9">Buffering</text>
        <text x="220" y="138" textAnchor="middle" fill="#a0aac4" fontSize="9">Encryption</text>
        <text x="220" y="152" textAnchor="middle" fill="#a0aac4" fontSize="9">Pre-processing</text>
        <text x="220" y="172" textAnchor="middle" fill="#5e6a85" fontSize="8" fontFamily="'JetBrains Mono',monospace">on-prem</text>
        <rect x="310" y="22" width="200" height="160" rx="10" fill="rgba(160,80,255,0.08)" stroke="rgba(160,80,255,0.3)"/>
        <text x="410" y="44" textAnchor="middle" fill="#c599ff" fontSize="11" fontWeight="700">CLOUD / AI</text>
        <text x="410" y="64" textAnchor="middle" fill="#a0aac4" fontSize="9">Time-series Lake</text>
        <text x="410" y="78" textAnchor="middle" fill="#a0aac4" fontSize="9">ML Inference (GPU)</text>
        <text x="410" y="92" textAnchor="middle" fill="#a0aac4" fontSize="9">NLP &amp; Generative AI</text>
        <text x="410" y="106" textAnchor="middle" fill="#a0aac4" fontSize="9">Microapp Registry</text>
        <text x="410" y="120" textAnchor="middle" fill="#a0aac4" fontSize="9">RBAC &amp; Audit</text>
        <text x="410" y="146" textAnchor="middle" fill="#5e6a85" fontSize="8" fontFamily="'JetBrains Mono',monospace">AWS · Azure · GCP</text>
        <text x="410" y="160" textAnchor="middle" fill="#5e6a85" fontSize="8" fontFamily="'JetBrains Mono',monospace">private cloud · on-prem</text>
        {[[130, 130], [280, 130]].map(([x, y], i) => (
          <g key={i}>
            <line x1={x} y1={y} x2={x + 30} y2={y} stroke="#7aa0ff" strokeWidth="1.5" strokeDasharray="3 3" opacity=".7">
              <animate attributeName="strokeDashoffset" from="0" to="-12" dur="1s" repeatCount="indefinite"/>
            </line>
            <polygon points={`${x + 28},${y - 3} ${x + 28},${y + 3} ${x + 32},${y}`} fill="#7aa0ff"/>
          </g>
        ))}
        <text x="440" y="208" textAnchor="middle" fill="#5e6a85" fontSize="8.5" fontFamily="'JetBrains Mono',monospace">Operators · Engineers · Leadership</text>
      </svg>
    </div>
  );
}

/* ════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════ */
export default function LandingPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', company: '', role: 'Plant Manager', email: '', phone: '', plantType: 'Integrated Mill', interest: 'Trial Access', message: '' });
  const [formSent, setFormSent] = useState(false);
  const styleInjected = useRef(false);

  useEffect(() => {
    document.title = 'SteelIQ by Zealogics — Industrial AI for Steel Manufacturing';
    if (!styleInjected.current) {
      const tag = document.createElement('style');
      tag.id = 'lp-styles';
      tag.textContent = LP_STYLES;
      document.head.appendChild(tag);
      styleInjected.current = true;
    }
    return () => {
      const tag = document.getElementById('lp-styles');
      if (tag) tag.remove();
      styleInjected.current = false;
    };
  }, []);

  const updateForm = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.company) return;
    setFormSent(true);
  };

  return (
    <div className="lp-page" data-theme="light">

      {/* ── Nav ── */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <div className="lp-logo" onClick={() => lpScroll('lp-top')}>
            <div className="lp-logo-mark">SQ</div>
            <div>
              <div className="lp-logo-text">Steel<em>IQ</em></div>
              <div className="lp-logo-sub">by Zealogics</div>
            </div>
          </div>
          <div className="lp-nav-links">
            {[
              { id: 'lp-platform', label: 'Platform' },
              { id: 'lp-modules', label: 'Modules' },
              { id: 'lp-ai', label: 'AI' },
              { id: 'lp-integrations', label: 'Integrations' },
              { id: 'lp-pricing', label: 'Pricing' },
            ].map(l => (
              <button key={l.id} className="lp-nav-link" onClick={() => lpScroll(l.id)}>{l.label}</button>
            ))}
          </div>
          <div className="lp-nav-right">
            <button className="lp-nav-secondary" onClick={() => navigate('/login')}>Sign In</button>
            <button className="lp-btn lp-btn-primary" onClick={() => lpScroll('lp-pricing')}>Start Free Trial →</button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="lp-hero" id="lp-top">
        <div className="lp-hero-grid">
          <div>
            <div className="lp-eyebrow">Industrial AI · by Zealogics</div>
            <h1 className="lp-h1">Industrial <em>AI</em> for Steel Manufacturing</h1>
            <p className="lp-lead">
              From new product inception to final sales and end-customer management — <strong>SteelIQ</strong> by Zealogics
              unifies EAF, DRI/DRP, continuous casting and every downstream line under one intelligent platform.
              Save <strong>up to 19 kWh per hour</strong> on EAF energy, reduce slag, improve casting quality,
              and intelligently regulate gas injection on DRP.
            </p>
            <div className="lp-hero-cta">
              <button className="lp-btn lp-btn-primary lp-btn-lg" onClick={() => lpScroll('lp-pricing')}>Start Free Trial →</button>
              <button className="lp-btn lp-btn-ghost lp-btn-lg" onClick={() => lpScroll('lp-contact')}>Talk to an Engineer</button>
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
          <LPHeroMock />
        </div>
      </section>

      {/* ── Trust Strip ── */}
      <div className="lp-trust">
        <div className="lp-trust-inner">
          <div className="lp-trust-label">Trusted by steel leaders in</div>
          {['Emirates Steel', 'Tata Steel', 'NLMK', 'Ternium', 'ArcelorMittal', 'SSAB', 'voestalpine', 'Nucor'].map(t => (
            <div key={t} className="lp-trust-item">{t}</div>
          ))}
        </div>
      </div>

      {/* ── How It Works ── */}
      <section className="lp-section lp-section-alt" id="lp-platform">
        <div className="lp-section-inner">
          <div className="lp-section-head">
            <div className="lp-eyebrow">How It Works</div>
            <h2 className="lp-h2">From plant floor sensor to <em>AI-driven</em> decision</h2>
            <p className="lp-lead">A five-stage data path engineered for industrial reliability. Bring your data in once — every microapp consumes the same canonical stream.</p>
          </div>
          <div className="lp-flow">
            {[
              { n: 1, icon: 'sensors', t: 'Connect', d: 'IBA historians, Level-2 OPC-UA, PLCs, DCS and vibration sensors stream raw process data in real time.', c: 'var(--blue)' },
              { n: 2, icon: 'edge', t: 'Ingest', d: 'On-prem edge gateway buffers, encrypts and forwards. Survives WAN outages — no data loss on the plant floor.', c: 'var(--amber)' },
              { n: 3, icon: 'cloud', t: 'Analyze', d: 'Time-series lake plus relational store on your cloud of choice. Multi-region replication with 30-day local cache.', c: 'var(--green)' },
              { n: 4, icon: 'ai', t: 'Predict', d: 'Domain-tuned ML for defect, energy, anomaly, and breakout. NLP layer makes every model conversational.', c: 'var(--purple)' },
              { n: 5, icon: 'apps', t: 'Act', d: 'Operators, engineers and leadership consume insights through tailored microapp UIs with role-aware dashboards.', c: '#ff7d8a' },
            ].map(s => (
              <div key={s.n} className="lp-flow-step">
                <div className="lp-flow-num" style={{ background: s.c }}>{String(s.n).padStart(2, '0')}</div>
                <div className="lp-flow-anim" style={{ background: `${s.c}10`, borderColor: `${s.c}40` }}>
                  <LPFlowIcon name={s.icon} color={s.c === 'var(--blue)' ? '#3a78ff' : s.c === 'var(--amber)' ? '#ffa528' : s.c === 'var(--green)' ? '#3acc7a' : s.c === 'var(--purple)' ? '#a060ff' : s.c} />
                </div>
                <div className="lp-flow-title">{s.t}</div>
                <div className="lp-flow-desc">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Capabilities ── */}
      <section className="lp-section" id="lp-capabilities">
        <div className="lp-section-inner">
          <div className="lp-section-head">
            <div className="lp-eyebrow">Platform Capabilities</div>
            <h2 className="lp-h2">An <em>operating system</em> for the steel plant</h2>
            <p className="lp-lead">SteelIQ replaces a tangle of point tools with one composable platform. Built around the way steelmakers actually work — by process domain, by shift, by KPI.</p>
          </div>
          <div className="lp-cap-grid">
            {[
              { i: '◈', c: 'var(--blue)', t: 'Real-Time Process Monitoring', d: 'Sub-second telemetry from IBA historians, Level-2 OPC-UA, PLCs and DCS. Industrial-grade dashboards designed for 24/7 command-center operators.' },
              { i: '✦', c: 'var(--purple)', t: 'Predictive AI & ML', d: 'Pre-trained and fine-tunable models for defect prediction, energy optimization, breakout prevention, metallization forecasting and predictive maintenance.' },
              { i: '⊞', c: 'var(--amber)', t: 'Microapps Architecture', d: 'Every process domain — CastX, EAF, DRI/DRP, Rolling — is an independently versioned module. Install, update or disable without redeploying the platform shell.' },
              { i: '☁', c: 'var(--green)', t: 'Cloud-Scale, Edge-Ready', d: 'Hybrid by design. Edge gateways buffer plant data; the cloud handles AI workloads at scale across AWS, Azure, GCP, or your private cloud.' },
            ].map(cap => (
              <div key={cap.t} className="lp-cap-card">
                <div className="lp-cap-icon" style={{ background: `${cap.c}18`, color: cap.c, borderColor: `${cap.c}40` }}>{cap.i}</div>
                <h3 className="lp-h3">{cap.t}</h3>
                <div className="lp-cap-desc">{cap.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Section ── */}
      <section className="lp-section lp-section-alt" id="lp-ai">
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
                <div className="lp-ai-prompt-line">
                  <span className="lp-ai-icon">✦</span>
                  <span>SteelIQ AI · 1.2s</span>
                </div>
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

      {/* ── Microapps Catalog ── */}
      <section className="lp-section" id="lp-modules">
        <div className="lp-section-inner">
          <div className="lp-section-head">
            <div className="lp-eyebrow">Microapps Catalog</div>
            <h2 className="lp-h2">A growing library of <em>process-domain</em> microapps</h2>
            <p className="lp-lead">Each microapp is independently versioned and deployable. Mix and match what your plant needs today — extend with custom modules as you grow.</p>
          </div>
          <div className="lp-mod-grid">
            {[
              { i: 'Q', c: 'var(--blue)', t: 'CastX', tag: 'Casting Quality', d: 'Continuous casting quality, ML defect prediction, breakout prevention, outlier and NLP analytics.', f: ['Defect prediction · 94.2% accuracy', 'Breakout risk scoring', 'Tundish & mould monitoring', 'NLP query interface'] },
              { i: 'E', c: 'var(--amber)', t: 'EAF Suite', tag: 'Electric Arc Furnace', d: 'Energy optimization, arc stability, charge mix, tap-to-tap reduction and predictive electrode/transformer maintenance.', f: ['Energy per ton optimizer', 'Arc stability monitor', 'Charge mix AI advisor', 'Electrode wear forecast'] },
              { i: 'G', c: 'var(--green)', t: 'DRI/DRP Suite', tag: 'Direct Reduction', d: 'Reduction gas optimization, metallization prediction, zone temperature profiling, yield analytics and anomaly detection.', f: ['Gas/iron ratio optimizer', '1h metallization forecast', 'Zone temperature ML', 'Reformer health monitor'] },
              { i: '+', c: 'var(--purple)', t: 'Build Your Own', tag: 'Open SDK', d: 'Use the SteelIQ SDK and registry API to ship your own microapp. Define data bindings, RBAC roles and AI hooks in a manifest — no shell redeploy.', f: ['Manifest-driven mount', 'IBA & L2 channel binding', 'Built-in RBAC gating', 'AI assistant auto-index'], special: true },
            ].map(m => (
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

      {/* ── Integrations ── */}
      <section className="lp-section lp-section-alt" id="lp-integrations">
        <div className="lp-section-inner">
          <div className="lp-section-head">
            <div className="lp-eyebrow">Integrations</div>
            <h2 className="lp-h2">Plug into the systems <em>you already run</em></h2>
            <p className="lp-lead">SteelIQ ingests plant data through whatever stack you have today. REST APIs, direct database URLs, OPC-UA, MQTT — all configured at runtime through the admin console.</p>
          </div>
          <div className="lp-int-cats">
            {[
              { label: 'Plant Historians', items: [{ n: 'IBA Historian', t: 'Time-series' }, { n: 'OSIsoft PI', t: 'Time-series' }, { n: 'AVEVA Insight', t: 'Time-series' }, { n: 'Wonderware', t: 'Time-series' }] },
              { label: 'Level 2 / Automation', items: [{ n: 'Siemens SIMATIC', t: 'OPC-UA' }, { n: 'ABB Ability', t: 'OPC-UA' }, { n: 'Rockwell Logix', t: 'OPC-UA' }, { n: 'Danieli Automation', t: 'REST / OPC' }, { n: 'Primetals', t: 'REST / OPC' }, { n: 'Tenova', t: 'REST' }] },
              { label: 'Enterprise & MES', items: [{ n: 'SAP S/4HANA', t: 'RFC / OData' }, { n: 'Oracle EBS', t: 'REST' }, { n: 'Microsoft Dynamics', t: 'OData' }, { n: 'Generic MES', t: 'REST / SQL' }] },
              { label: 'Open Protocols', items: [{ n: 'OPC-UA', t: 'Protocol' }, { n: 'MQTT / Sparkplug B', t: 'Protocol' }, { n: 'REST / GraphQL', t: 'Protocol' }, { n: 'gRPC', t: 'Protocol' }, { n: 'SQL / JDBC', t: 'Protocol' }, { n: 'AMQP / Kafka', t: 'Protocol' }] },
            ].map(cat => (
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

      {/* ── Pricing ── */}
      <section className="lp-section" id="lp-pricing">
        <div className="lp-section-inner">
          <div className="lp-section-head">
            <div className="lp-eyebrow">Trial & Pricing</div>
            <h2 className="lp-h2">Start free. <em>Scale</em> to your whole operation.</h2>
            <p className="lp-lead">Begin with a 30-day trial on sample data. When you're ready, our team integrates SteelIQ with your plant's IBA, Level-2 and ERP — typically in two weeks.</p>
          </div>
          <div className="lp-trial-grid">
            {[
              {
                n: 'Starter', price: 'Free', cycle: '30 days · no credit card',
                cta: 'Start Trial', featured: false,
                features: ['Full CastX, EAF & DRI microapps', 'Sample plant data preloaded', 'AI assistant & NLP queries', 'Up to 3 user seats', 'Email support — 24h response'],
                action: () => navigate('/login'),
              },
              {
                n: 'Professional', price: 'Contact', cycle: 'per plant · annual contract',
                cta: 'Talk to Sales', featured: true,
                features: ['Unlimited microapps & seats', 'Live IBA / Level 2 connectors', 'Fine-tuned ML on your data', 'Dedicated success engineer', '99.9% SLA · 4h response', 'Quarterly model retraining'],
                action: () => lpScroll('lp-contact'),
              },
              {
                n: 'Enterprise', price: 'Custom', cycle: 'multi-plant · global rollout',
                cta: 'Contact Us', featured: false,
                features: ['Multi-plant deployment', 'Private cloud or on-prem', 'Custom microapp development', 'SOC 2 / ISO 27001 controls', 'White-label & branding', '24/7 priority support · 1h SLA'],
                action: () => lpScroll('lp-contact'),
              },
            ].map(p => (
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

      {/* ── Contact ── */}
      <section className="lp-section lp-section-alt" id="lp-contact">
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
            {formSent ? (
              <div className="lp-form">
                <div className="lp-form-success">
                  ✓ Thank you, {form.name.split(' ')[0]}. Your inquiry has been received.<br/>
                  Swapnil from SteelIQ will reach out within 24 business hours at <strong>{form.email}</strong>.<br/>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-mid)' }}>Direct line: <a href="mailto:swapnil@zealogics.com" style={{ color: 'var(--green)', textDecoration: 'underline' }}>swapnil@zealogics.com</a></span>
                </div>
              </div>
            ) : (
              <form className="lp-form" onSubmit={handleSubmit}>
                <div className="lp-form-row">
                  <label className="lp-label">Full Name *</label>
                  <input className="lp-input" required value={form.name} onChange={e => updateForm('name', e.target.value)} placeholder="Your name"/>
                </div>
                <div className="lp-form-row">
                  <label className="lp-label">Company *</label>
                  <input className="lp-input" required value={form.company} onChange={e => updateForm('company', e.target.value)} placeholder="Company name"/>
                </div>
                <div className="lp-form-row">
                  <label className="lp-label">Work Email *</label>
                  <input className="lp-input" type="email" required value={form.email} onChange={e => updateForm('email', e.target.value)} placeholder="you@company.com"/>
                </div>
                <div className="lp-form-row">
                  <label className="lp-label">Phone</label>
                  <input className="lp-input" type="tel" value={form.phone} onChange={e => updateForm('phone', e.target.value)} placeholder="Optional"/>
                </div>
                <div className="lp-form-row">
                  <label className="lp-label">Your Role</label>
                  <select className="lp-select" value={form.role} onChange={e => updateForm('role', e.target.value)}>
                    {['Plant Manager', 'Operations Director', 'Reliability / R&R Engineer', 'Process / R&D Engineer', 'Digital / IT Leader', 'Executive (C-Suite)', 'Other'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className="lp-form-row">
                  <label className="lp-label">Plant Type</label>
                  <select className="lp-select" value={form.plantType} onChange={e => updateForm('plantType', e.target.value)}>
                    {['Integrated Mill', 'Mini Mill / EAF', 'Specialty Steel', 'DRI / HBI Plant', 'Rolling / Finishing', 'Multi-site'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className="lp-form-row full">
                  <label className="lp-label">I'm interested in</label>
                  <select className="lp-select" value={form.interest} onChange={e => updateForm('interest', e.target.value)}>
                    {['Trial Access (30 days)', 'Live Demo with my data', 'Pricing & Plant Pro details', 'Custom microapp development', 'Partnership & integrations', 'General inquiry'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className="lp-form-row full">
                  <label className="lp-label">Tell us about your plant & use case</label>
                  <textarea className="lp-textarea" value={form.message} onChange={e => updateForm('message', e.target.value)} placeholder="What processes do you run? What data systems are in place? Where could AI add the most value?"/>
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

      {/* ── Footer ── */}
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
            <button className="lp-foot-link" onClick={() => lpScroll('lp-platform')}>How It Works</button>
            <button className="lp-foot-link" onClick={() => lpScroll('lp-capabilities')}>Capabilities</button>
            <button className="lp-foot-link" onClick={() => lpScroll('lp-ai')}>Industrial AI</button>
            <button className="lp-foot-link" onClick={() => lpScroll('lp-modules')}>Microapps</button>
          </div>
          <div>
            <div className="lp-foot-h">Deploy</div>
            <button className="lp-foot-link" onClick={() => lpScroll('lp-integrations')}>Integrations</button>
            <button className="lp-foot-link" onClick={() => lpScroll('lp-pricing')}>Trial & Pricing</button>
            <button className="lp-foot-link" onClick={() => navigate('/login')}>Customer Login</button>
            <a className="lp-foot-link" href="https://steeliq.zealogics.info/" target="_blank" rel="noopener noreferrer">Production Site ↗</a>
          </div>
          <div>
            <div className="lp-foot-h">Company</div>
            <a className="lp-foot-link" href="https://zealogics.com/" target="_blank" rel="noopener noreferrer">About Zealogics ↗</a>
            <button className="lp-foot-link" onClick={() => lpScroll('lp-contact')}>Contact</button>
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

    </div>
  );
}

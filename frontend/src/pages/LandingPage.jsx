import React, { useState, useEffect, useRef } from 'react';

const COLORS = {
  blue: '#3a78ff',
  amber: '#ffae4a',
  green: '#3acc7a',
  purple: '#a060ff',
  red: '#e84a4a',
};

function SteelIQLockup({ dark = false, size = 1 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: `${8 * size}px` }}>
      <svg width={32 * size} height={32 * size} viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill={COLORS.blue} />
        <path d="M8 16 L16 8 L24 16 L16 24 Z" fill="none" stroke="#fff" strokeWidth="2" />
        <circle cx="16" cy="16" r="3" fill="#fff" />
      </svg>
      <span style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        fontSize: `${20 * size}px`,
        color: dark ? '#fff' : '#0f1a30',
        letterSpacing: '-0.5px',
      }}>
        Steel<span style={{ color: COLORS.blue }}>IQ</span>
      </span>
    </div>
  );
}

function ProcessStage({ icon, label, color }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      minWidth: '90px',
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '12px',
        background: 'rgba(255,255,255,0.08)',
        border: `1.5px solid ${color}40`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '22px',
      }}>
        {icon}
      </div>
      <span style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '11px',
        fontWeight: 600,
        color: '#b0bcd4',
        textAlign: 'center',
        letterSpacing: '0.3px',
      }}>{label}</span>
    </div>
  );
}

function AnimatedArrow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
      <div style={{
        width: '40px',
        height: '2px',
        background: 'linear-gradient(90deg, #3a78ff40, #3a78ff)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, #fff, transparent)',
          animation: 'shimmer 2s infinite',
        }} />
      </div>
      <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
        <path d="M1 1L7 6L1 11" stroke="#3a78ff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

const CAPABILITIES = [
  {
    icon: '⚡',
    title: 'Real-Time Monitoring',
    desc: 'Sub-second data ingestion from IBA Historian and Level-2 systems. Live dashboards with 99.94% uptime SLA.',
    color: COLORS.blue,
  },
  {
    icon: '🧠',
    title: 'Predictive AI/ML',
    desc: 'LSTM and transformer models trained on millions of heat cycles. Predict defects, energy spikes, and equipment failures before they happen.',
    color: COLORS.purple,
  },
  {
    icon: '🔌',
    title: 'Microapps Architecture',
    desc: 'Composable, role-aware microapps (CastX, EAF Suite, DRI/DRP) deployable independently with zero downtime upgrades.',
    color: COLORS.amber,
  },
  {
    icon: '☁️',
    title: 'Cloud-Scale Edge-Ready',
    desc: 'Runs on-prem, hybrid, or full cloud. OPC-UA, REST, and direct historian integrations. Deploy at the edge for air-gapped plants.',
    color: COLORS.green,
  },
];

const OUTCOMES = [
  { value: '19 kWh/hr', label: 'EAF Energy Saved', sub: 'Per heat cycle optimization', color: COLORS.blue, icon: '⚡' },
  { value: '↓38%', label: 'Casting Defects', sub: 'Web cracks & surface seams', color: COLORS.green, icon: '🎯' },
  { value: '↓Slag', label: 'Cleaner Heats', sub: 'Automated slag detection & advisory', color: COLORS.amber, icon: '🔥' },
  { value: 'Smart', label: 'DRP Gas Injection', sub: 'ML-optimized reformer control', color: COLORS.purple, icon: '💨' },
  { value: '↓8%', label: 'Tap-to-Tap Time', sub: 'Heat phase optimization', color: COLORS.red, icon: '⏱' },
  { value: '24/7', label: 'Predictive Maintenance', sub: 'Electrode & equipment health', color: COLORS.green, icon: '🛡' },
];

const MICROAPPS = [
  {
    badge: 'Q',
    color: COLORS.green,
    name: 'CastX',
    version: 'v2.4.1',
    desc: 'Continuous casting intelligence. Strand-level defect prediction, mould level control, and NLP-powered process querying.',
    tags: ['Defect Prediction', 'Strand Analytics', 'NLP Queries', 'Outlier Detection'],
  },
  {
    badge: 'E',
    color: COLORS.blue,
    name: 'EAF Suite',
    version: 'v2.1.0',
    desc: 'Electric Arc Furnace energy and arc stability optimization. Charge mix advisory, electrode wear, and tap-to-tap analytics.',
    tags: ['Energy Optimization', 'Arc Stability', 'Charge Mix', 'Predictive Maintenance'],
  },
  {
    badge: 'G',
    color: COLORS.amber,
    name: 'DRI/DRP Suite',
    version: 'v1.8.0',
    desc: 'Direct Reduced Iron process intelligence. Gas consumption optimization, metallization prediction, and zone temperature control.',
    tags: ['Gas Optimization', 'Metallization', 'Temperature Zones', 'Anomaly Detection'],
  },
  {
    badge: '+',
    color: COLORS.purple,
    name: 'Build Your Own',
    version: 'SDK',
    desc: 'Extend SteelIQ with custom microapps using our open SDK. Bind to any IBA tag, L2 channel, or REST endpoint.',
    tags: ['Open SDK', 'Custom Bindings', 'RBAC Ready', 'No-Code Config'],
  },
];

export default function LandingPage() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: '', company: '', role: '', message: '' });
  const [formSent, setFormSent] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    document.title = 'SteelIQ by Zealogics — Industrial AI for Steel Manufacturing';
    const handleScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`SteelIQ Contact: ${formData.name} from ${formData.company}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nCompany: ${formData.company}\nRole: ${formData.role}\n\nMessage:\n${formData.message}`);
    window.location.href = `mailto:swapnil@zealogics.com?subject=${subject}&body=${body}`;
    setFormSent(true);
  };

  return (
    <div style={{
      fontFamily: "'Space Grotesk', sans-serif",
      background: '#0a0f1e',
      color: '#fff',
      minHeight: '100vh',
      overflowX: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;600&display=swap');
        @keyframes shimmer { 0%{left:-100%} 100%{left:200%} }
        @keyframes blob { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.05)} 66%{transform:translate(-20px,30px) scale(0.97)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes flowDot { 0%{left:-8px;opacity:0} 20%{opacity:1} 80%{opacity:1} 100%{left:calc(100% + 8px);opacity:0} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* Sticky Nav */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '0 40px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: navScrolled ? 'rgba(10,15,30,0.95)' : 'transparent',
        backdropFilter: navScrolled ? 'blur(12px)' : 'none',
        borderBottom: navScrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <SteelIQLockup dark size={1} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {['Capabilities', 'How It Works', 'Microapps', 'Pricing'].map(link => (
            <a key={link} href={`#${link.toLowerCase().replace(/ /g, '-')}`} style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#b0bcd4',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = '#b0bcd4'}
            >{link}</a>
          ))}
          <a href="/login" style={{
            padding: '8px 20px',
            background: COLORS.blue,
            color: '#fff',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            transition: 'background 0.2s',
          }}>Login</a>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '120px 40px 80px',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        {/* Background blobs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', top: '20%', left: '15%', width: '500px', height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(58,120,255,0.15) 0%, transparent 70%)',
            animation: 'blob 12s infinite ease-in-out',
          }} />
          <div style={{
            position: 'absolute', top: '40%', right: '10%', width: '400px', height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(160,96,255,0.12) 0%, transparent 70%)',
            animation: 'blob 15s infinite ease-in-out reverse',
          }} />
          <div style={{
            position: 'absolute', bottom: '10%', left: '35%', width: '350px', height: '350px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(58,204,122,0.1) 0%, transparent 70%)',
            animation: 'blob 18s infinite ease-in-out',
          }} />
          {/* Grid overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        </div>

        <div style={{ position: 'relative', maxWidth: '900px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            background: 'rgba(58,120,255,0.15)',
            border: '1px solid rgba(58,120,255,0.3)',
            borderRadius: '100px',
            fontSize: '13px',
            fontWeight: 600,
            color: COLORS.blue,
            marginBottom: '28px',
            letterSpacing: '0.5px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: COLORS.green, display: 'inline-block', animation: 'float 2s infinite' }} />
            NOW LIVE · SteelIQ Platform v3.2
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 68px)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-2px',
            marginBottom: '24px',
            color: '#fff',
          }}>
            Industrial AI for the{' '}
            <em style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: 'italic',
              fontWeight: 400,
              color: COLORS.amber,
              letterSpacing: '-1px',
            }}>next era</em>{' '}
            of Steel Manufacturing
          </h1>

          <p style={{
            fontSize: '18px',
            color: '#8090b0',
            lineHeight: 1.7,
            maxWidth: '640px',
            margin: '0 auto 40px',
            fontWeight: 400,
          }}>
            SteelIQ unifies real-time process data, predictive AI/ML, and composable microapps
            into a single intelligent platform — purpose-built for EAF, DRI, and continuous casting operations.
          </p>

          {/* Stat chips */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '44px',
          }}>
            {[
              { v: '19 kWh/hr', l: 'EAF Saved', c: COLORS.blue },
              { v: '94.2%', l: 'Defect Accuracy', c: COLORS.green },
              { v: 'End-to-End', l: 'Coverage', c: COLORS.purple },
              { v: '99.94%', l: 'Uptime', c: COLORS.amber },
            ].map(chip => (
              <div key={chip.l} style={{
                padding: '12px 20px',
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${chip.c}30`,
                borderRadius: '12px',
                backdropFilter: 'blur(8px)',
                textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '20px',
                  fontWeight: 700,
                  color: chip.c,
                  lineHeight: 1.2,
                }}>{chip.v}</div>
                <div style={{ fontSize: '12px', color: '#6070a0', marginTop: '2px', fontWeight: 500 }}>{chip.l}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:swapnil@zealogics.com?subject=SteelIQ%20Demo%20Request" style={{
              padding: '14px 32px',
              background: COLORS.blue,
              color: '#fff',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: `0 0 30px ${COLORS.blue}40`,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 30px ${COLORS.blue}60`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 0 30px ${COLORS.blue}40`; }}
            >
              Request Demo
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </a>
            <a href="/login" style={{
              padding: '14px 32px',
              background: 'rgba(255,255,255,0.07)',
              color: '#fff',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.12)',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
            >
              View Login →
            </a>
          </div>
        </div>
      </section>

      {/* How It Works – Process Flow */}
      <section id="how-it-works" style={{
        padding: '80px 40px',
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '2px', color: COLORS.blue, marginBottom: '12px' }}>
            HOW IT WORKS
          </p>
          <h2 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-1px', marginBottom: '12px' }}>
            Full-Plant Process Intelligence
          </h2>
          <p style={{ color: '#6070a0', fontSize: '16px', marginBottom: '56px' }}>
            SteelIQ monitors every stage of your steel production process in real time.
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0',
            flexWrap: 'wrap',
            rowGap: '24px',
          }}>
            <ProcessStage icon="⛏️" label="Raw Materials" color={COLORS.amber} />
            <AnimatedArrow />
            <ProcessStage icon="🔵" label="DRI/DRP" color={COLORS.amber} />
            <AnimatedArrow />
            <ProcessStage icon="⚡" label="EAF" color={COLORS.blue} />
            <AnimatedArrow />
            <ProcessStage icon="🏺" label="Ladle Furnace" color={COLORS.purple} />
            <AnimatedArrow />
            <ProcessStage icon="🧊" label="CCM" color={COLORS.green} />
            <AnimatedArrow />
            <ProcessStage icon="🔄" label="Rolling" color={COLORS.amber} />
            <AnimatedArrow />
            <ProcessStage icon="✅" label="Finishing" color={COLORS.green} />
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" style={{ padding: '100px 40px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '2px', color: COLORS.purple, marginBottom: '12px' }}>
              CAPABILITIES
            </p>
            <h2 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-1px' }}>
              Built for the Steel Plant Floor
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
          }}>
            {CAPABILITIES.map(cap => (
              <div key={cap.title} style={{
                padding: '32px 28px',
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${cap.color}20`,
                borderRadius: '16px',
                transition: 'transform 0.2s, border-color 0.2s',
                cursor: 'default',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = `${cap.color}50`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = `${cap.color}20`; }}
              >
                <div style={{
                  width: '52px', height: '52px', borderRadius: '12px',
                  background: `${cap.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px', marginBottom: '20px',
                }}>{cap.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>{cap.title}</h3>
                <p style={{ fontSize: '14px', color: '#6070a0', lineHeight: 1.7 }}>{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section style={{
        padding: '100px 40px',
        background: 'linear-gradient(180deg, rgba(58,120,255,0.04) 0%, transparent 100%)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '2px', color: COLORS.green, marginBottom: '12px' }}>
              PROVEN OUTCOMES
            </p>
            <h2 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-1px' }}>
              Results That Move the Needle
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
          }}>
            {OUTCOMES.map(o => (
              <div key={o.label} style={{
                padding: '28px 24px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '14px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{o.icon}</div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '28px',
                  fontWeight: 700,
                  color: o.color,
                  marginBottom: '6px',
                  letterSpacing: '-1px',
                }}>{o.value}</div>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{o.label}</div>
                <div style={{ fontSize: '12px', color: '#5060a0' }}>{o.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Microapps */}
      <section id="microapps" style={{ padding: '100px 40px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '2px', color: COLORS.amber, marginBottom: '12px' }}>
              MICROAPPS CATALOG
            </p>
            <h2 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-1px' }}>
              Composable Intelligence
            </h2>
            <p style={{ color: '#6070a0', fontSize: '16px', marginTop: '12px' }}>
              Deploy only what you need. Upgrade without disruption.
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
          }}>
            {MICROAPPS.map(app => (
              <div key={app.name} style={{
                padding: '32px 28px',
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${app.color}25`,
                borderRadius: '16px',
                transition: 'transform 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '10px',
                    background: app.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 800, fontSize: '18px', color: '#fff',
                  }}>{app.badge}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '18px' }}>{app.name}</div>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '11px', color: app.color, fontWeight: 600,
                    }}>{app.version}</div>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: '#6070a0', lineHeight: 1.7, marginBottom: '20px' }}>{app.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {app.tags.map(tag => (
                    <span key={tag} style={{
                      padding: '4px 10px',
                      background: `${app.color}15`,
                      border: `1px solid ${app.color}30`,
                      borderRadius: '100px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: app.color,
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing placeholder */}
      <section id="pricing" style={{
        padding: '80px 40px',
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '2px', color: COLORS.blue, marginBottom: '12px' }}>PRICING</p>
        <h2 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-1px', marginBottom: '16px' }}>Enterprise Licensing</h2>
        <p style={{ color: '#6070a0', fontSize: '16px', maxWidth: '520px', margin: '0 auto 32px' }}>
          SteelIQ is priced per plant site with unlimited users and microapps. Contact us for enterprise terms and pilot programs.
        </p>
        <a href="mailto:swapnil@zealogics.com?subject=SteelIQ%20Pricing%20Inquiry" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '14px 32px',
          background: COLORS.blue,
          color: '#fff',
          borderRadius: '10px',
          fontSize: '15px',
          fontWeight: 700,
        }}>
          Contact Sales
        </a>
      </section>

      {/* Contact */}
      <section id="contact" style={{ padding: '100px 40px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '2px', color: COLORS.green, marginBottom: '12px' }}>CONTACT</p>
            <h2 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-1px' }}>Let's Talk Steel</h2>
            <p style={{ color: '#6070a0', marginTop: '12px' }}>
              Reach us at{' '}
              <a href="mailto:swapnil@zealogics.com" style={{ color: COLORS.blue, fontWeight: 600 }}>
                swapnil@zealogics.com
              </a>
            </p>
          </div>

          {formSent ? (
            <div style={{
              textAlign: 'center', padding: '48px',
              background: 'rgba(58,204,122,0.1)',
              border: '1px solid rgba(58,204,122,0.3)',
              borderRadius: '16px',
            }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>✅</div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Message Sent!</h3>
              <p style={{ color: '#6070a0' }}>Your email client should have opened. We'll get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { k: 'name', label: 'Full Name', placeholder: 'Jane Smith' },
                { k: 'company', label: 'Company', placeholder: 'Emirates Steel' },
                { k: 'role', label: 'Role', placeholder: 'Plant Manager / VP Operations' },
              ].map(f => (
                <div key={f.k}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#8090b0', display: 'block', marginBottom: '6px' }}>
                    {f.label}
                  </label>
                  <input
                    type="text"
                    placeholder={f.placeholder}
                    value={formData[f.k]}
                    onChange={e => setFormData(p => ({ ...p, [f.k]: e.target.value }))}
                    style={{
                      width: '100%', padding: '12px 16px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '10px', color: '#fff',
                      fontSize: '15px', fontFamily: "'Space Grotesk', sans-serif",
                      outline: 'none',
                    }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#8090b0', display: 'block', marginBottom: '6px' }}>
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Tell us about your plant and what you're looking to optimize..."
                  value={formData.message}
                  onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                  style={{
                    width: '100%', padding: '12px 16px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '10px', color: '#fff',
                    fontSize: '15px', fontFamily: "'Space Grotesk', sans-serif",
                    outline: 'none', resize: 'vertical',
                  }}
                />
              </div>
              <button type="submit" style={{
                padding: '14px',
                background: COLORS.blue,
                color: '#fff',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}>
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        background: '#050a14',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <SteelIQLockup dark size={0.9} />
        <p style={{ fontSize: '13px', color: '#3a4060' }}>
          © 2026 Zealogics, Inc. · steeliq.zealogics.info
        </p>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['Privacy', 'Terms', 'Security'].map(l => (
            <a key={l} href="#" style={{ fontSize: '13px', color: '#3a4060', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#6070a0'}
              onMouseLeave={e => e.target.style.color = '#3a4060'}
            >{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}

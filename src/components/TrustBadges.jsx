import { useEffect, useRef, useState } from 'react';

const badges = [
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
        <rect x="2" y="8" width="4" height="8" rx="1"/><rect x="18" y="8" width="4" height="8" rx="1"/>
      </svg>
    ),
    title: "Free Delivery",
    desc: "On orders above Rs. 2,000",
    gradient: 'linear-gradient(135deg, #141e28 0%, #1a2a3a 100%)',
    accent: '#3498db',
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
      </svg>
    ),
    title: "Size/Color Exchange",
    desc: "Customer pays delivery charges",
    gradient: 'linear-gradient(135deg, #141e18 0%, #1a281f 100%)',
    accent: '#2ecc71',
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    ),
    title: "100% Authentic",
    desc: "Genuine quality guaranteed",
    gradient: 'linear-gradient(135deg, #241c14 0%, #2a2018 100%)',
    accent: '#e67e22',
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
    title: "Secure Payment",
    desc: "JazzCash, EasyPaisa, COD, Visa",
    gradient: 'linear-gradient(135deg, #1a1422 0%, #221a2c 100%)',
    accent: '#9b59b6',
  },
];

export default function TrustBadges() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'linear-gradient(180deg, #0d0d16 0%, #0f0f1a 50%, #0c0c14 100%)',
        padding: '100px 0 110px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '-30%', left: '50%',
        transform: 'translateX(-50%)',
        width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(184,151,42,0.08) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* Section Heading */}
      <div className="container" style={{ textAlign: 'center', marginBottom: 56, position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
          <div style={{ width: 35, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
          <span style={{
            color: 'var(--gold)', fontSize: '0.78rem', fontWeight: 800,
            letterSpacing: '0.22em', textTransform: 'uppercase',
          }}>Why Choose Us</span>
          <div style={{ width: 35, height: 1, background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
        </div>
        <h2 style={{
          fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 2.8rem)',
          fontWeight: 600, color: '#fff', margin: 0, letterSpacing: '-0.01em',
        }}>
          Shop With Confidence
        </h2>
        <p style={{ color: '#7a7a85', fontSize: '0.9rem', margin: '10px 0 0', fontWeight: 400 }}>
          Every purchase is backed by our commitment to quality
        </p>
      </div>

      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'clamp(14px, 2.5vw, 24px)',
          }}
          className="trust-grid"
        >
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className={`trust-card ${isVisible ? 'trust-visible' : ''}`}
              style={{
                background: badge.gradient,
                borderRadius: 20,
                padding: '40px 24px 34px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                border: '1px solid rgba(255,255,255,0.06)',
                transform: 'translateY(30px)',
                opacity: 0,
                transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${isVisible ? idx * 0.1 : 0}s`,
                cursor: 'default',
                overflow: 'hidden',
              }}
            >
              {/* Subtle inner glow */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: `radial-gradient(circle at 50% 0%, ${badge.accent}10 0%, transparent 60%)`,
                opacity: 0, transition: 'opacity 0.5s ease',
                borderRadius: 20,
              }} className="trust-card-glow" />

              {/* Icon in glowing circle */}
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: `rgba(255,255,255,0.04)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 22,
                color: badge.accent,
                transition: 'all 0.45s ease',
                border: `2px solid rgba(255,255,255,0.06)`,
                position: 'relative',
              }} className="trust-icon-wrap">
                {/* Icon glow ring */}
                <div style={{
                  position: 'absolute', inset: -4, borderRadius: '50%',
                  background: 'transparent',
                  border: `2px solid ${badge.accent}30`,
                  opacity: 0, transition: 'opacity 0.5s ease',
                }} className="trust-icon-ring" />
                {badge.icon}
              </div>

              {/* Title */}
              <h4 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#f0ede8',
                margin: '0 0 10px 0',
                transition: 'color 0.3s ease',
              }}>
                {badge.title}
              </h4>

              {/* Description */}
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.82rem',
                color: '#888',
                margin: 0,
                lineHeight: 1.65,
                fontWeight: 400,
                transition: 'color 0.3s ease',
              }}>
                {badge.desc}
              </p>

              {/* Bottom accent bar */}
              <div style={{
                width: 0, height: 3,
                background: badge.accent,
                marginTop: 22, borderRadius: 2,
                transition: 'width 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }} className="trust-accent-bar" />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .trust-card.trust-visible {
          transform: translateY(0) !important;
          opacity: 1 !important;
        }

        .trust-card:hover {
          transform: translateY(-10px) !important;
          box-shadow: 0 24px 55px rgba(0,0,0,0.4), 0 6px 18px rgba(0,0,0,0.2) !important;
          border-color: rgba(255,255,255,0.15) !important;
        }
        .trust-card:hover .trust-card-glow {
          opacity: 1 !important;
        }
        .trust-card:hover .trust-icon-wrap {
          transform: scale(1.1);
          border-color: rgba(255,255,255,0.2) !important;
        }
        .trust-card:hover .trust-icon-ring {
          opacity: 1 !important;
        }
        .trust-card:hover .trust-accent-bar {
          width: 50px !important;
        }

        @media (max-width: 900px) {
          .trust-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 820px) {
          .trust-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
        }
        @media (max-width: 560px) {
          .trust-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

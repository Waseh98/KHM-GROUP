import React, { useEffect, useRef, useState } from 'react';

const badges = [
  {
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
        <rect x="2" y="8" width="4" height="8" rx="1"/><rect x="18" y="8" width="4" height="8" rx="1"/>
      </svg>
    ),
    title: "Free Delivery",
    desc: "On orders above Rs. 2,000",
  },
  {
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
      </svg>
    ),
    title: "Size/Color Exchange",
    desc: "Customer pays delivery charges",
  },
  {
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    ),
    title: "100% Authentic",
    desc: "Genuine quality guaranteed",
  },
  {
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
        <line x1="7" y1="16" x2="7" y2="16"/><line x1="11" y1="16" x2="11" y2="16"/>
      </svg>
    ),
    title: "Secure Payment",
    desc: "JazzCash, EasyPaisa, COD, Visa",
  },
];

export default function TrustBadges() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: 'var(--bg)',
        padding: '90px 0',
        position: 'relative',
      }}
    >
      {/* Section Heading */}
      <div className="container" style={{ textAlign: 'center', marginBottom: 56 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
          <div style={{ width: 30, height: 1, backgroundColor: 'var(--gold)', opacity: 0.5 }} />
          <span style={{
            color: 'var(--gold)', fontSize: '0.78rem', fontWeight: 800,
            letterSpacing: '0.2em', textTransform: 'uppercase',
          }}>Why Choose Us</span>
          <div style={{ width: 30, height: 1, backgroundColor: 'var(--gold)', opacity: 0.5 }} />
        </div>
        <h2 style={{
          fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 2.8rem)',
          fontWeight: 600, color: 'var(--black)', margin: 0,
        }}>
          Shop With Confidence
        </h2>
      </div>

      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'clamp(16px, 3vw, 28px)',
          }}
          className="trust-grid"
        >
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className={`trust-card ${isVisible ? 'trust-visible' : ''}`}
              style={{
                backgroundColor: 'var(--white)',
                borderRadius: 16,
                padding: '36px 22px 32px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                border: '1px solid #eeebe3',
                transform: 'translateY(30px)',
                opacity: 0,
                transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${isVisible ? idx * 0.1 : 0}s`,
                cursor: 'default',
              }}
            >
              {/* Hover gradient overlay */}
              <div style={{
                position: 'absolute', inset: 0, borderRadius: 16,
                background: 'radial-gradient(circle at 50% 0%, rgba(184,151,42,0.06) 0%, transparent 60%)',
                opacity: 0, transition: 'opacity 0.4s ease',
              }} className="trust-hover-glow" />

              {/* Icon Circle */}
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'linear-gradient(135deg, #FAF8F3 0%, #F0ECE0 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
                color: 'var(--gold)',
                transition: 'all 0.4s ease',
                border: '2px solid #e8e3d6',
              }} className="trust-icon-circle">
                {badge.icon}
              </div>

              {/* Title */}
              <h4 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.2rem',
                fontWeight: 600,
                color: 'var(--black)',
                margin: '0 0 8px 0',
                transition: 'color 0.3s ease',
              }} className="trust-title">
                {badge.title}
              </h4>

              {/* Description */}
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.84rem',
                color: 'var(--mid-gray)',
                margin: 0,
                lineHeight: 1.6,
                transition: 'color 0.3s ease',
              }}>
                {badge.desc}
              </p>

              {/* Bottom accent line */}
              <div style={{
                width: 0, height: 2,
                background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
                marginTop: 18,
                transition: 'width 0.4s ease',
                borderRadius: 1,
              }} className="trust-accent" />
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
          transform: translateY(-8px) !important;
          box-shadow: 0 20px 50px rgba(0,0,0,0.08), 0 4px 15px rgba(0,0,0,0.04) !important;
          border-color: #ddd4b8 !important;
        }
        .trust-card:hover .trust-hover-glow {
          opacity: 1 !important;
        }
        .trust-card:hover .trust-icon-circle {
          background: linear-gradient(135deg, var(--gold) 0%, #D4AF5A 100%) !important;
          color: #fff !important;
          border-color: var(--gold) !important;
          transform: scale(1.08);
          box-shadow: 0 8px 25px rgba(184,151,42,0.25);
        }
        .trust-card:hover .trust-title {
          color: var(--gold) !important;
        }
        .trust-card:hover .trust-accent {
          width: 60px !important;
        }

        @media (max-width: 900px) {
          .trust-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .trust-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

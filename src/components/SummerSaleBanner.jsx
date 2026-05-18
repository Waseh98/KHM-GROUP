import { useState, useEffect, useRef } from 'react';

const videoCards = [
  {
    id: 1,
    title: 'Summer Collection 2026',
    thumbnail: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80',
    video: 'https://videos.pexels.com/video-files/3205916/3205916-uhd_1440_2732_25fps.mp4',
  },
  {
    id: 2,
    title: 'Polo Styling Guide',
    thumbnail: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&q=80',
    video: 'https://videos.pexels.com/video-files/4058359/4058359-uhd_1440_2732_30fps.mp4',
  },
  {
    id: 3,
    title: 'Behind the Brand',
    thumbnail: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&q=80',
    video: 'https://videos.pexels.com/video-files/6939430/6939430-uhd_1440_2732_25fps.mp4',
  },
  {
    id: 4,
    title: 'Fabric Quality Test',
    thumbnail: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&q=80',
    video: 'https://videos.pexels.com/video-files/5682248/5682248-uhd_1440_2732_25fps.mp4',
  },
  {
    id: 5,
    title: 'Customer Favorites',
    thumbnail: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80',
    video: 'https://videos.pexels.com/video-files/7696503/7696503-uhd_1440_2732_25fps.mp4',
  },
];

export default function SummerSaleBanner() {
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 12, minutes: 45, seconds: 30 });
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const videoRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      videoRefs.current.forEach(vid => {
        if (vid) {
          vid.play().catch(() => {});
        }
      });
    }
  }, [isVisible]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'linear-gradient(135deg, #0d0d12 0%, #1a1520 30%, #2a1525 60%, #0d0d12 100%)',
        padding: '80px 0 100px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute', top: '-50%', left: '-20%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(220,50,50,0.15) 0%, transparent 70%)',
        animation: 'pulse 4s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-30%', right: '-15%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(184,151,42,0.1) 0%, transparent 70%)',
        animation: 'pulse 5s ease-in-out infinite 1s',
        pointerEvents: 'none',
      }} />

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: 4, height: 4, borderRadius: '50%',
          background: 'rgba(184,151,42,0.3)',
          top: `${15 + i * 15}%`,
          left: `${10 + i * 16}%`,
          animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
          pointerEvents: 'none',
        }} />
      ))}

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Sale Banner Box */}
        <div className={`sale-banner-box ${isVisible ? 'fade-up' : ''}`} style={{
          background: 'linear-gradient(135deg, rgba(220,50,50,0.15) 0%, rgba(184,151,42,0.1) 50%, rgba(220,50,50,0.08) 100%)',
          border: '2px solid rgba(220,50,50,0.3)',
          borderRadius: 24,
          padding: 'clamp(30px, 5vw, 60px)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: 70,
        }}>
          {/* Corner Accents */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: 60, height: 60, borderTop: '3px solid var(--gold)', borderLeft: '3px solid var(--gold)', borderRadius: '24px 0 0 0' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, borderTop: '3px solid var(--gold)', borderRight: '3px solid var(--gold)', borderRadius: '0 24px 0 0' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 60, height: 60, borderBottom: '3px solid var(--gold)', borderLeft: '3px solid var(--gold)', borderRadius: '0 0 0 24px' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 60, height: 60, borderBottom: '3px solid var(--gold)', borderRight: '3px solid var(--gold)', borderRadius: '0 0 24px 0' }} />

          {/* Limited Time Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(220,50,50,0.2)', border: '1px solid rgba(220,50,50,0.4)',
            padding: '8px 20px', borderRadius: 50, marginBottom: 20,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span style={{ color: '#ff6b6b', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Limited Time
            </span>
          </div>

          {/* FLAT 30% OFF */}
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #ff4444 0%, #ff6b6b 30%, var(--gold) 70%, #D4AF5A 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 10px',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}>
            FLAT 30% OFF
          </h2>

          {/* Summer Sale Live Now */}
          <p style={{
            color: '#e0d6bc',
            fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
            fontWeight: 600,
            margin: '0 0 30px',
            letterSpacing: '0.05em',
          }}>
            Summer Sale Live Now
          </p>

          {/* Countdown Timer */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 'clamp(10px, 2vw, 20px)',
            marginBottom: 35,
          }}>
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Min', value: timeLeft.minutes },
              { label: 'Sec', value: timeLeft.seconds },
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(184,151,42,0.2)',
                borderRadius: 12,
                padding: '12px 16px',
                minWidth: 'clamp(60px, 10vw, 80px)',
              }}>
                <div style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 900,
                  color: '#fff',
                  fontFamily: 'var(--font-heading)',
                  lineHeight: 1,
                }}>{String(item.value).padStart(2, '0')}</div>
                <div style={{
                  fontSize: '0.65rem',
                  color: 'var(--gold)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginTop: 4,
                }}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* Shop Sale Button */}
          <a href="/sale" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'linear-gradient(135deg, #ff4444, #ff6b6b)',
            color: '#fff', padding: '16px 40px', borderRadius: 12,
            fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: '0.1em', textDecoration: 'none',
            boxShadow: '0 8px 30px rgba(255,68,68,0.4)',
            transition: 'all 0.3s ease',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,68,68,0.6)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,68,68,0.4)';
            }}
          >
            Shop Sale
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

        {/* 5 Video Cards Section */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{
            display: 'inline-block', color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10,
          }}>Watch & Shop</span>
          <h3 style={{
            fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 700, color: '#fff', margin: 0,
          }}>Featured Videos</h3>
        </div>

        <div className="video-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 20,
        }}>
          {videoCards.map((card, i) => (
            <div
              key={card.id}
              className={`video-card ${isVisible ? `fade-up-${i + 1}` : ''}`}
              style={{
                position: 'relative',
                borderRadius: 16,
                overflow: 'hidden',
                background: '#000',
                border: '1px solid rgba(184,151,42,0.15)',
                cursor: 'pointer',
                transition: 'all 0.4s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(184,151,42,0.4)';
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(184,151,42,0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(184,151,42,0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Video Element */}
              <video
                ref={el => videoRefs.current[i] = el}
                src={card.video}
                muted
                loop
                playsInline
                preload="auto"
                poster={card.thumbnail}
                style={{
                  width: '100%',
                  aspectRatio: '9/16',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              
              {/* Play Button Overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}>
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'rgba(184,151,42,0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(184,151,42,0.4)',
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#000">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>

              {/* Title at Bottom */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '16px 12px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
              }}>
                <p style={{
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  margin: 0,
                  lineHeight: 1.3,
                  textAlign: 'center',
                }}>{card.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-20px); opacity: 0.8; }
        }
        @media (max-width: 1024px) {
          .video-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .video-grid {
            display: flex !important;
            gap: 14px !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            -webkit-overflow-scrolling: touch !important;
            padding-bottom: 8px !important;
            scrollbar-width: none !important;
          }
          .video-grid::-webkit-scrollbar { display: none !important; }
          .video-grid .video-card {
            flex: 0 0 55% !important;
            scroll-snap-align: start !important;
          }
        }
      `}</style>
    </section>
  );
}

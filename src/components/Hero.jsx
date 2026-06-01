import { useState, useEffect } from 'react';

const HERO_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=1600&q=80&fm=webp',
    fallback: 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=1600&q=80',
  },
  {
    src: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1600&q=80&fm=webp',
    fallback: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1600&q=80',
  },
  {
    src: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1600&q=80&fm=webp',
    fallback: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1600&q=80',
  },
];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-desktop">
        {HERO_IMAGES.map((img, index) => (
          <img
            key={index}
            src={img.src}
            alt={`K-TEX Premium Collection ${index + 1}`}
            className="hero-image"
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchpriority={index === 0 ? 'high' : 'low'}
            style={{
              opacity: currentImageIndex === index ? 1 : 0,
              animation: currentImageIndex === index ? 'slowZoom 10s ease-out forwards' : 'none',
            }}
          />
        ))}
        <div className="hero-overlay">
          <div className="hero-content">
            <div className="hero-badge-wrapper">
              <span className="hero-badge-line" />
              <span className="hero-badge">★ Est. 2024 • Pakistan</span>
              <span className="hero-badge-line" />
            </div>
            <h1 className="hero-title">
              <span className="hero-title-line">Own Your</span>
              <span className="hero-title-highlight">Signature Look</span>
            </h1>
            <p className="hero-subtitle">
              Premium polo shirts &mdash; crafted for the <strong>modern Pakistani gentleman</strong>.<br />
              Where <span className="subtitle-gold">luxury</span> meets <span className="subtitle-gold">everyday comfort</span>.
            </p>
            <div className="hero-actions">
              <a href="/men" className="hero-btn-primary">
                <span>Men</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <a href="/women" className="hero-btn-secondary">Women</a>
            </div>
            <div className="hero-scroll-indicator">
              <span className="hero-scroll-text">Scroll</span>
              <div className="hero-scroll-dot" />
            </div>
          </div>
        </div>
      </div>

      <div className="hero-mobile-img">
        {HERO_IMAGES.map((img, index) => (
          <img
            key={index}
            src={img.src.replace('w=1600', 'w=800')}
            alt={`K-TEX Premium Collection ${index + 1}`}
            className="hero-mobile-image"
            loading={index === 0 ? 'eager' : 'lazy'}
            style={{
              opacity: currentImageIndex === index ? 1 : 0,
            }}
          />
        ))}
        <div className="hero-mobile-overlay">
          <div className="hero-badge-wrapper">
            <span className="hero-badge-line" />
            <span className="hero-badge">★ Est. 2024 • Pakistan</span>
            <span className="hero-badge-line" />
          </div>
          <h1 className="hero-mobile-title">
            <span>Own Your</span>
            <span className="hero-title-highlight">Signature Look</span>
          </h1>
          <p className="hero-mobile-subtitle">Premium polo shirts crafted for <span className="subtitle-gold">Pakistan</span></p>
          <div className="hero-actions">
            <a href="/men" className="hero-btn-primary">
              <span>Men</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="/women" className="hero-btn-secondary">Women</a>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@300;400;600;700&display=swap');

        .hero-section {
          position: relative;
          width: 100%;
          height: 100dvh;
          max-height: 900px;
          overflow: hidden;
        }
        .hero-desktop {
          position: absolute;
          inset: 0;
          z-index: 1;
          overflow: hidden;
          background-color: #000;
        }
        .hero-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          transition: opacity 1.5s ease-in-out;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          z-index: 3;
          background:
            radial-gradient(ellipse at 30% 50%, rgba(184,151,42,0.08) 0%, transparent 60%),
            radial-gradient(ellipse at 70% 30%, rgba(212,175,90,0.06) 0%, transparent 50%),
            linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.5) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-content {
          text-align: center;
          max-width: 800px;
          padding: 0 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 70vh;
        }

        .hero-badge-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-bottom: 32px;
          opacity: 0;
          animation: fadeUp 0.8s 0.3s ease forwards;
        }
        .hero-badge-line {
          width: 40px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold));
        }
        .hero-badge-line:last-child {
          background: linear-gradient(90deg, var(--gold), transparent);
        }
        .hero-badge {
          font-family: 'Inter', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--gold);
          text-shadow: 0 0 20px rgba(184,151,42,0.5), 0 0 40px rgba(184,151,42,0.2);
          animation: badgeGlow 2s ease-in-out infinite;
        }

        @keyframes badgeGlow {
          0%, 100% { text-shadow: 0 0 15px rgba(184,151,42,0.4), 0 0 30px rgba(184,151,42,0.15); }
          50% { text-shadow: 0 0 25px rgba(184,151,42,0.7), 0 0 50px rgba(184,151,42,0.3); }
        }

        .hero-title {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-bottom: 20px;
          opacity: 0;
          animation: fadeUp 0.8s 0.5s ease forwards;
        }
        .hero-title-line {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.2rem, 5vw, 4.5rem);
          font-weight: 700;
          background: linear-gradient(180deg, #FFFFFF 0%, #E8D5A3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.08;
          letter-spacing: 0.02em;
          text-shadow: none;
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.4));
        }
        .hero-title-highlight {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3rem, 7vw, 6rem);
          font-weight: 900;
          font-style: italic;
          background: linear-gradient(135deg, #FFD700 0%, #FFF8DC 25%, #DAA520 50%, #FFE066 75%, #B8860B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.05;
          letter-spacing: -0.02em;
          text-shadow: none;
          filter: drop-shadow(0 0 30px rgba(255,215,0,0.4)) drop-shadow(0 6px 20px rgba(0,0,0,0.5));
          animation: shimmer 3s ease-in-out infinite;
        }

        .hero-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: clamp(1rem, 1.5vw, 1.15rem);
          font-weight: 400;
          color: rgba(255,255,255,0.85);
          margin: 0 auto 40px;
          line-height: 1.7;
          max-width: 560px;
          opacity: 0;
          animation: fadeUp 0.8s 0.7s ease forwards;
          letter-spacing: 0.01em;
        }
        .subtitle-gold {
          font-weight: 700;
          color: #F0C040;
          text-shadow: 0 0 15px rgba(240,192,64,0.4);
        }

        @keyframes shimmer {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(255,215,0,0.3)) drop-shadow(0 4px 16px rgba(0,0,0,0.4)); }
          50% { filter: drop-shadow(0 0 40px rgba(255,215,0,0.6)) drop-shadow(0 6px 24px rgba(0,0,0,0.5)); }
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
          opacity: 0;
          animation: fadeUp 0.8s 0.9s ease forwards;
        }
        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #D4AF5A 0%, #F5D98B 40%, #C9A227 70%, #E8C86B 100%);
          color: #0D0D0D;
          padding: 16px 36px;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          box-shadow: 0 4px 24px rgba(184,151,42,0.4), inset 0 1px 0 rgba(255,255,255,0.3);
          position: relative;
          overflow: hidden;
        }
        .hero-btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
          transition: left 0.5s ease;
          transform: skewX(-15deg);
        }
        .hero-btn-primary:hover::before {
          left: 150%;
        }
        .hero-btn-primary:hover {
          transform: translateY(-4px) scale(1.04);
          box-shadow: 0 12px 40px rgba(212,175,90,0.6), 0 0 60px rgba(255,215,0,0.2), inset 0 1px 0 rgba(255,255,255,0.4);
          background: linear-gradient(135deg, #FFE57F 0%, #FFF3C7 40%, #E8C86B 70%, #FFD700 100%);
        }
        .hero-btn-primary:active {
          transform: translateY(-1px) scale(1.01);
          box-shadow: 0 4px 20px rgba(184,151,42,0.4);
        }

        .hero-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Inter', sans-serif;
          background: transparent;
          color: #fff;
          padding: 16px 32px;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          text-decoration: none;
          border: 2px solid rgba(255,255,255,0.4);
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
          overflow: hidden;
        }
        .hero-btn-secondary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(212,175,90,0.15), rgba(255,215,0,0.1));
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .hero-btn-secondary:hover::before {
          opacity: 1;
        }
        .hero-btn-secondary:hover {
          border-color: #F0C040;
          color: #F0C040;
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 8px 30px rgba(240,192,64,0.3), 0 0 40px rgba(255,215,0,0.1);
          text-shadow: 0 0 20px rgba(255,215,0,0.4);
        }
        .hero-btn-secondary:active {
          transform: translateY(-1px) scale(1.01);
        }

        .hero-scroll-indicator {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0;
          animation: fadeUp 0.8s 1.2s ease forwards;
        }
        .hero-scroll-text {
          font-family: 'Inter', sans-serif;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }
        .hero-scroll-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--gold);
          animation: bounceDown 2s ease-in-out infinite;
        }

        .hero-mobile-img {
          position: relative;
          inset: 0;
          z-index: 2;
          overflow: hidden;
          background-color: #000;
          display: none;
        }
        .hero-mobile-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          transition: opacity 1.5s ease-in-out;
          animation: kenBurns 12s ease-in-out infinite alternate;
          transform-origin: center center;
        }

        @keyframes kenBurns {
          0% { transform: scale(1.0) translateX(0); }
          50% { transform: scale(1.1) translateX(-1%); }
          100% { transform: scale(1.05) translateX(1%); }
        }
        .hero-mobile-overlay {
          position: absolute;
          inset: 0;
          z-index: 3;
          background:
            radial-gradient(ellipse at 50% 80%, rgba(184,151,42,0.12) 0%, transparent 60%),
            radial-gradient(ellipse at 50% 20%, rgba(212,175,90,0.08) 0%, transparent 50%),
            linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.15) 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 24px 50px;
          text-align: center;
        }
        .hero-mobile-title {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-bottom: 12px;
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          line-height: 1.1;
        }
        .hero-mobile-title span:first-child {
          background: linear-gradient(180deg, #FFFFFF 0%, #E8D5A3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));
        }
        .hero-mobile-title .hero-title-highlight {
          font-size: 2.2rem;
          animation: shimmer 3s ease-in-out infinite;
        }
        .hero-mobile-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          font-weight: 400;
          color: rgba(255,255,255,0.85);
          margin-bottom: 24px;
          letter-spacing: 0.01em;
        }

        @keyframes slowZoom {
          0% { transform: scale(1) translateX(0); }
          100% { transform: scale(1.12) translateX(-1%); }
        }
        @keyframes bounceDown {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(8px); opacity: 1; }
        }

        @media (max-width: 768px) {
          .hero-section {
            min-height: 90dvh !important;
            max-height: none !important;
            height: auto !important;
          }
          .hero-desktop {
            display: none !important;
          }
          .hero-mobile-img {
            display: flex !important;
            position: relative !important;
            min-height: 90dvh !important;
          }
          .hero-mobile-image {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            display: block !important;
            position: absolute !important;
            inset: 0 !important;
          }
          .hero-btn-primary {
            padding: 18px 40px !important;
            font-size: 0.85rem !important;
            min-height: 56px !important;
            min-width: 180px !important;
            border-radius: 50px !important;
          }
          .hero-btn-secondary {
            padding: 18px 32px !important;
            font-size: 0.8rem !important;
            min-height: 56px !important;
            border-radius: 50px !important;
          }
          .hero-actions {
            gap: 12px !important;
          }
        }
      `}</style>
    </section>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1600&q=80",
  "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=1600&q=80",
  "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1600&q=80"
];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      maxHeight: '900px',
      minHeight: '500px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }} className="hero-section">
      
      {/* Background Images Carousel */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        overflow: 'hidden',
        backgroundColor: '#000'
      }}>
        {HERO_IMAGES.map((imgUrl, idx) => (
          <img 
            key={idx}
            src={imgUrl} 
            alt={`Premium Polo Collection ${idx + 1}`}
            className="hero-image"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              opacity: idx === currentImageIndex ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
              animation: idx === currentImageIndex ? 'slowZoom 10s ease-out forwards' : 'none',
              transform: 'scale(1)'
            }}
          />
        ))}
        {/* Luxurious dark overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(13,13,13,0.8) 100%)',
        }} />
      </div>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        padding: '0 24px',
        maxWidth: '900px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        
        <span className="fade-up" style={{
          fontFamily: "var(--font-body)",
          color: 'var(--white)',
          textTransform: 'uppercase',
          letterSpacing: '0.25em',
          fontSize: '0.8rem',
          fontWeight: 600,
          display: 'block',
          marginBottom: '24px',
          padding: '6px 16px',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '30px',
          backdropFilter: 'blur(4px)'
        }}>
          New Season Collection
        </span>
        
        <h1 className="fade-up-1 hero-heading" style={{
          fontFamily: "var(--font-heading)",
          fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
          lineHeight: 1.05,
          color: 'var(--white)',
          margin: '0 0 24px 0',
          fontWeight: 500,
          textShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
          The Art of the <span style={{ fontStyle: 'italic', fontWeight: 300 }}>Polo</span>
        </h1>
        
        <p className="fade-up-2 hero-subtitle" style={{
          fontFamily: "var(--font-body)",
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: 'rgba(255,255,255,0.85)',
          marginBottom: '48px',
          maxWidth: '600px',
          lineHeight: 1.6,
          fontWeight: 300,
        }}>
          Experience the perfect blend of luxury and comfort. Meticulously tailored for the modern gentleman, delivered right to your doorstep.
        </p>
        
        <div className="fade-up-3" style={{
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <Link to="/men" style={{
            backgroundColor: 'var(--white)',
            color: 'var(--black)',
            padding: '16px 40px',
            fontSize: '0.95rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'inline-block',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-4px)';
            e.target.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
          }}
          >
            Shop Men's
          </Link>
          <a href="#collections" style={{
            backgroundColor: 'transparent',
            color: 'var(--white)',
            padding: '16px 40px',
            fontSize: '0.95rem',
            fontWeight: 500,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            border: '1px solid rgba(255,255,255,0.5)',
            transition: 'all 0.3s ease',
            display: 'inline-block',
            backdropFilter: 'blur(4px)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--white)';
            e.target.style.color = 'var(--black)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = 'var(--white)';
          }}
          >
            Explore Collections
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="fade-up-4" style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{
          color: 'rgba(255,255,255,0.6)',
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          fontFamily: "var(--font-body)"
        }}>Scroll to Explore</span>
        <div style={{
          width: '1px',
          height: '40px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '100%',
            height: '50%',
            backgroundColor: 'var(--white)',
            animation: 'scrollDown 2s ease-in-out infinite'
          }} />
        </div>
      </div>

      <style>{`
        @keyframes slowZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        @keyframes scrollDown {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }

        /* Desktop — show more of the image, shift focal point down slightly */
        @media (min-width: 769px) {
          .hero-image {
            object-position: center 20% !important;
          }
        }

        /* Tablet */
        @media (max-width: 768px) {
          .hero-image {
            object-position: center top !important;
          }
          .hero-heading {
            font-size: clamp(2.5rem, 7vw, 4rem) !important;
          }
        }

        /* Small mobile */
        @media (max-width: 480px) {
          .hero-section {
            height: 100vh !important;
            max-height: 700px !important;
          }
          .hero-image {
            object-position: center 15% !important;
          }
          .hero-heading {
            font-size: 2.2rem !important;
            line-height: 1.1 !important;
          }
          .hero-subtitle {
            font-size: 0.9rem !important;
            margin-bottom: 32px !important;
          }
        }
      `}</style>
    </section>
  );
}

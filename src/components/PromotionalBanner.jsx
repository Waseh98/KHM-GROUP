import React from 'react';

export default function PromotionalBanner() {
  return (
    <section style={{ 
      backgroundColor: '#0a0a0a', 
      width: '100%', 
      padding: '60px 20px',
      overflow: 'hidden',
      position: 'relative'
    }} id="sale">
      
      {/* Animated Glowing Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(184,151,42,0.15) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%',
        animation: 'pulseGlow 6s infinite alternate',
        zIndex: 0
      }} />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'row',
        minHeight: '400px',
        backgroundColor: '#111',
        borderRadius: '24px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)',
        position: 'relative',
        zIndex: 1,
        animation: 'float3D 6s ease-in-out infinite',
        transformStyle: 'preserve-3d',
        border: '1px solid #222'
      }} className="promo-banner">
        
        {/* Content Side */}
        <div style={{
          flex: 1,
          padding: '60px 5%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          transform: 'translateZ(30px)' // 3D pop effect
        }} className="promo-content">
          <div style={{
            backgroundColor: 'var(--gold)',
            color: 'var(--white)',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '6px 16px',
            borderRadius: '30px',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginBottom: '24px',
            display: 'inline-block',
            animation: 'pulseBadge 2s infinite',
            boxShadow: '0 0 15px rgba(184,151,42,0.6)'
          }}>
            Limited Time
          </div>
          
          <h2 style={{
            fontFamily: "var(--font-heading)",
            fontSize: 'clamp(3rem, 5vw, 4.5rem)',
            color: 'var(--white)',
            lineHeight: 1.1,
            margin: '0 0 16px 0',
            fontWeight: 700,
            letterSpacing: '0.02em',
            textShadow: `
              1px 1px 0 #333,
              2px 2px 0 #2a2a2a,
              3px 3px 0 #222,
              4px 4px 0 #1a1a1a,
              5px 5px 0 #111,
              6px 6px 20px rgba(0,0,0,0.8)
            `,
            transform: 'translateZ(50px)' // More 3D pop
          }}>
            FLAT <span style={{ color: 'var(--gold)' }}>30%</span> OFF
          </h2>
          
          <p style={{ 
            color: '#aaa', 
            fontFamily: "var(--font-body)",
            fontSize: '1.2rem',
            marginBottom: '32px',
            transform: 'translateZ(20px)'
          }}>
            Summer Sale Live Now
          </p>
          
          <button style={{
            backgroundColor: 'var(--white)',
            color: 'var(--black)',
            padding: '16px 40px',
            fontSize: '1rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
            transform: 'translateZ(40px)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateZ(40px) translateY(-4px)';
            e.target.style.boxShadow = '0 15px 25px rgba(184,151,42,0.4)';
            e.target.style.backgroundColor = 'var(--gold)';
            e.target.style.color = 'var(--white)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateZ(40px)';
            e.target.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
            e.target.style.backgroundColor = 'var(--white)';
            e.target.style.color = 'var(--black)';
          }}
          >
            Shop Sale
          </button>
        </div>


        {/* Image Side */}
        <div style={{
          flex: 1,
          position: 'relative',
          borderRadius: '0 24px 24px 0',
          overflow: 'hidden'
        }} className="promo-image">
          {/* Gradient to blend image smoothly */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, #111 0%, transparent 40%)',
            zIndex: 1
          }} className="promo-gradient" />
          
          <img 
            src="https://images.unsplash.com/photo-1618517047829-64a9a8563eb9?w=1000&q=80" 
            alt="Summer Sale"
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              transform: 'scale(1.05)',
              transition: 'transform 0.5s ease'
            }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1.05)'}
          />
        </div>

      </div>

      <style>{`
        @keyframes float3D {
          0% { transform: perspective(1000px) rotateY(-2deg) rotateX(1deg) translateY(0); }
          50% { transform: perspective(1000px) rotateY(2deg) rotateX(-1deg) translateY(-10px); }
          100% { transform: perspective(1000px) rotateY(-2deg) rotateX(1deg) translateY(0); }
        }
        
        @keyframes pulseBadge {
          0% { box-shadow: 0 0 0 0 rgba(184,151,42,0.7); }
          70% { box-shadow: 0 0 0 10px rgba(184,151,42,0); }
          100% { box-shadow: 0 0 0 0 rgba(184,151,42,0); }
        }

        @keyframes pulseGlow {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.2); opacity: 1; }
        }

        @media (max-width: 900px) {
          .promo-banner {
            flex-direction: column !important;
            animation: none !important;
            transform: none !important;
          }
          .promo-content {
            order: 2;
            padding: 40px 24px !important;
            align-items: center;
            text-align: center;
            transform: none !important;
          }
          .promo-image {
            order: 1;
            height: 300px;
            borderRadius: 24px 24px 0 0 !important;
          }
          .promo-gradient {
            background: linear-gradient(to bottom, transparent 50%, #111 100%) !important;
          }
        }
      `}</style>
    </section>
  );
}

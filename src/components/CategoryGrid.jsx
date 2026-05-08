import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../data';

function slugify(name) {
  return String(name || '')
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function CategoryGrid() {
  return (
    <section style={{ padding: '100px 0', backgroundColor: 'var(--bg)' }} id="collections">
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }} className="fade-up">
          <span style={{ 
            display: 'inline-block',
            color: 'var(--gold)', 
            fontSize: '0.85rem', 
            fontWeight: 700, 
            letterSpacing: '0.15em', 
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>
            Explore Our Collections
          </span>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 600,
            color: 'var(--black)',
            margin: '0 0 20px 0',
            lineHeight: 1.1
          }}>Shop by Category</h2>
          <div style={{ width: '60px', height: '2px', backgroundColor: 'var(--gold)', margin: '0 auto' }}></div>
        </div>

        <div className="category-grid" style={{
          display: 'grid',
          gap: '24px',
        }}>
          {categories.map((cat, idx) => {
            const isTall = cat.tall;
            return (
              <Link 
                to={`/collections/${slugify(cat.name)}`}
                key={cat.id} 
                className={`cat-card ${idx === 0 ? 'tall-card' : 'small-card'} fade-up-${(idx % 5) + 1}`}
                style={{
                  position: 'relative',
                  display: 'block',
                  overflow: 'hidden',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-sm)',
                  backgroundColor: '#000', // Base color for image loading
                }}
              >
                <img 
                  src={cat.image} 
                  alt={cat.name}
                  loading="lazy"
                  className="cat-img"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    opacity: 0.9 // Slightly dim the image by default
                  }}
                />
                
                {/* Gradient Overlay */}
                <div 
                  className="cat-overlay"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)',
                    transition: 'background 0.4s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: 'clamp(20px, 4vw, 40px)',
                    zIndex: 2
                  }}
                >
                  <div className="cat-content" style={{ transition: 'transform 0.4s ease' }}>
                    <p style={{
                      fontFamily: "var(--font-body)",
                      color: 'var(--gold)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      margin: '0 0 8px 0',
                    }}>{cat.subtitle}</p>
                    <h3 style={{
                      fontFamily: "var(--font-heading)",
                      color: 'var(--white)',
                      fontSize: isTall ? 'clamp(2rem, 4vw, 3.5rem)' : 'clamp(1.5rem, 3vw, 2.5rem)',
                      fontWeight: 600,
                      margin: '0 0 16px 0',
                      lineHeight: 1.1
                    }}>{cat.name}</h3>
                    
                    {/* Shop Now Link (Animated) */}
                    <div className="shop-link" style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      color: 'var(--white)',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      position: 'relative',
                      overflow: 'hidden',
                      paddingBottom: '4px'
                    }}>
                      <span>Shop Now</span>
                      <svg className="shop-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                      <span className="shop-underline" style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '2px',
                        backgroundColor: 'var(--gold)',
                        transform: 'translateX(-100%)',
                        transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                      }}></span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`
        /* Category Grid Layout */
        .category-grid {
          grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: 320px;
        }
        
        .tall-card {
          grid-column: span 2;
          grid-row: span 2;
        }
        
        .small-card {
          grid-column: span 1;
          grid-row: span 1;
        }

        /* Hover Effects */
        .cat-card .shop-arrow {
          transform: translateX(-10px);
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .cat-card:hover .cat-img {
          transform: scale(1.08);
          opacity: 1 !important;
        }

        .cat-card:hover .cat-overlay {
          background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.1) 100%) !important;
        }

        .cat-card:hover .cat-content {
          transform: translateY(-8px);
        }

        .cat-card:hover .shop-arrow {
          transform: translateX(0);
          opacity: 1;
        }
        
        .cat-card:hover .shop-underline {
          transform: translateX(0) !important;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .category-grid {
            grid-template-columns: repeat(3, 1fr);
            grid-auto-rows: 280px;
          }
          .tall-card {
            grid-column: span 2;
            grid-row: span 2;
          }
          .small-card {
            grid-column: span 1;
          }
        }

        @media (max-width: 768px) {
          .category-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-auto-rows: 260px;
            gap: 16px !important;
          }
          .tall-card {
            grid-column: span 2;
            grid-row: span 1;
          }
          .small-card {
            grid-column: span 1;
          }
        }

        @media (max-width: 480px) {
          .category-grid {
            grid-template-columns: 1fr;
            grid-auto-rows: 300px;
            gap: 12px !important;
          }
          .tall-card, .small-card {
            grid-column: span 1;
            grid-row: span 1;
          }
          .cat-card:hover .cat-content {
            transform: none; /* Disable content shift on mobile */
          }
        }
        
        /* Touch Device Optimizations */
        @media (hover: none) and (pointer: coarse) {
          .cat-card .shop-arrow {
            transform: translateX(0);
            opacity: 1;
          }
          .cat-card .shop-underline {
            transform: translateX(0) !important;
          }
          .cat-card .cat-img {
            opacity: 1 !important;
          }
        }
      `}</style>
    </section>
  );
}

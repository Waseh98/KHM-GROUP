import React from 'react';
import { categories } from '../data';

export default function CategoryGrid() {
  return (
    <section style={{ padding: '80px 0', backgroundColor: 'var(--white)' }} id="collections">
      <div className="container">
        <h2 style={{
          fontFamily: "var(--font-heading)",
          fontSize: '2.5rem',
          fontWeight: 600,
          textAlign: 'center',
          marginBottom: '48px',
          color: 'var(--black)'
        }}>Shop by Category</h2>

        <div className="category-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '20px',
          gridAutoRows: 'minmax(250px, auto)'
        }}>
          {categories.map((cat, idx) => {
            // Asymmetric grid logic for desktop
            const isTall = cat.tall;
            const gridColumn = isTall ? 'span 5' : 'span 3';
            const gridColumnAlt = isTall ? 'span 5' : 'span 4'; // adjusted for 12 cols
            
            // Layout: 1 tall left (5 cols), 4 smaller right (7 cols total, split roughly 3.5 each, but CSS grid needs integers, let's do 1 tall (6 cols), 4 small (3 cols each, 2 rows))
            
            return (
              <a 
                href={`#${cat.name.toLowerCase().replace(' ', '-')}`}
                key={cat.id} 
                className={`cat-card ${idx === 0 ? 'tall-card' : 'small-card'}`}
                style={{
                  position: 'relative',
                  display: 'block',
                  overflow: 'hidden',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-sm)',
                }}
                onMouseEnter={(e) => {
                  const img = e.currentTarget.querySelector('.cat-img');
                  const overlay = e.currentTarget.querySelector('.cat-overlay');
                  if(img) img.style.transform = 'scale(1.06)';
                  if(overlay) overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
                }}
                onMouseLeave={(e) => {
                  const img = e.currentTarget.querySelector('.cat-img');
                  const overlay = e.currentTarget.querySelector('.cat-overlay');
                  if(img) img.style.transform = 'scale(1)';
                  if(overlay) overlay.style.backgroundColor = 'rgba(0,0,0,0.3)';
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
                    transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                  }}
                />
                
                {/* Gradient Overlay */}
                <div 
                  className="cat-overlay"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.1) 100%)',
                    transition: 'background-color 0.4s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '30px'
                  }}
                >
                  <h3 style={{
                    fontFamily: "var(--font-heading)",
                    color: 'var(--white)',
                    fontSize: isTall ? '2.5rem' : '1.5rem',
                    fontWeight: 600,
                    margin: '0 0 4px 0',
                    lineHeight: 1.1
                  }}>{cat.name}</h3>
                  <p style={{
                    fontFamily: "var(--font-body)",
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    margin: 0
                  }}>{cat.subtitle}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <style>{`
        /* Default grid setup (Desktop) */
        .category-grid {
          grid-template-columns: repeat(4, 1fr) !important;
          grid-template-rows: repeat(2, 300px);
        }
        .tall-card {
          grid-column: span 2;
          grid-row: span 2;
        }
        .small-card {
          grid-column: span 1;
          grid-row: span 1;
        }

        /* Tablet */
        @media (max-width: 900px) {
          .category-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-template-rows: auto;
            grid-auto-rows: 250px;
          }
          .tall-card {
            grid-column: span 2;
            grid-row: span 1;
            height: 350px;
          }
          .small-card {
            grid-column: span 1;
          }
        }

        /* Mobile */
        @media (max-width: 600px) {
          .category-grid {
            grid-template-columns: 1fr !important;
            grid-auto-rows: 250px;
          }
          .tall-card, .small-card {
            grid-column: span 1;
            grid-row: span 1;
          }
        }
      `}</style>
    </section>
  );
}

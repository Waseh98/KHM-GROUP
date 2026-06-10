import { Link } from 'react-router-dom';

const shopCategories = [
  { id: 'polo', name: 'Polo Shirts', subtitle: 'Timeless Classic', image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80', link: '/men?cat=sub_men_polo' },
  { id: 'tshirt', name: 'T-Shirts', subtitle: 'Everyday Essential', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80', link: '/men?cat=sub_men_tshirt' },
  { id: 'roundneck', name: 'Round Neck', subtitle: 'Casual Comfort', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80', link: '/men?cat=sub_men_roundneck' },
  { id: 'women-kurti', name: "Women's Kurti", subtitle: 'Elegant Style', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80', link: '/women?cat=sub_women_kurti' },
  { id: 'mens-casual', name: "Men's Casual", subtitle: 'Modern Comfort', image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&q=80', link: '/men' },
  { id: 'sale', name: 'Sale', subtitle: 'Up to 50% Off', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80', link: '/sale' },
];

export default function CategoryGrid() {
  return (
    <section style={{
      padding: '100px 0',
      background: 'linear-gradient(180deg, #FAF8F3 0%, #F5F0E8 50%, #EFE9DD 100%)',
      position: 'relative',
      overflow: 'hidden',
    }} id="collections">

      {/* Decorative */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(184,151,42,0.3), transparent)',
      }} />
      <div style={{
        position: 'absolute', top: '15%', right: '-10%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(184,151,42,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{
            display: 'inline-block', color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '14px',
            padding: '6px 20px', background: 'rgba(184,151,42,0.08)',
            border: '1px solid rgba(184,151,42,0.15)', borderRadius: 20,
          }}>Browse Collection</span>
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            fontWeight: 700, color: 'var(--black)', margin: '10px 0 20px', lineHeight: 1.1,
          }}>Shop by Collection</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 2, background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)' }} />
            <div style={{ width: 40, height: 2, background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
          </div>
        </div>

        {/* Grid */}
        <div className="category-grid" style={{
          display: 'grid', gap: 16,
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(2, 300px)',
        }}>
          {shopCategories.map((cat) => (
            <Link
              to={cat.link}
              key={cat.id}
              className="cat-card"
              style={{
                position: 'relative', display: 'block', overflow: 'hidden',
                borderRadius: 16, background: '#000',
                border: '1px solid rgba(184,151,42,0.15)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(184,151,42,0.5)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(184,151,42,0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(184,151,42,0.15)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="cat-img"
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  transition: 'transform 0.7s ease', willChange: 'transform',
                }}
              />
              <div className="cat-overlay" style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                padding: 'clamp(16px, 3vw, 32px)', zIndex: 2,
              }}>
                <div className="cat-content">
                  <p style={{
                    fontFamily: 'var(--font-body)', color: 'var(--gold)',
                    fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.15em', margin: '0 0 8px',
                  }}>{cat.subtitle}</p>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)', color: '#fff',
                    fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', fontWeight: 700,
                    margin: '0 0 14px', lineHeight: 1.15,
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  }}>{cat.name}</h3>
                  <div className="shop-btn" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: 'linear-gradient(135deg, var(--gold), var(--light-gold))',
                    color: '#1a1510', padding: '9px 18px', borderRadius: 8,
                    fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    boxShadow: '0 4px 16px rgba(184,151,42,0.3)',
                  }}>
                    <span>Shop Now</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="cat-shine" style={{
                position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(184,151,42,0.1), transparent)',
                transform: 'skewX(-20deg)', transition: 'left 0.6s ease', zIndex: 1, pointerEvents: 'none',
              }} />
            </Link>
          ))}
        </div>

        {/* View All */}
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <Link to="/collections" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'linear-gradient(135deg, rgba(184,151,42,0.1), rgba(184,151,42,0.05))',
            color: 'var(--black)', padding: '14px 32px', borderRadius: 12,
            fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.08em', border: '1.5px solid rgba(184,151,42,0.25)',
            textDecoration: 'none', transition: 'all 0.3s ease',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, var(--gold), var(--light-gold))';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(184,151,42,0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(184,151,42,0.1), rgba(184,151,42,0.05))';
              e.currentTarget.style.color = 'var(--black)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            View All Categories <span style={{ fontSize: '1.1rem' }}>&rarr;</span>
          </Link>
        </div>
      </div>

      <style>{`
        .cat-card:hover .cat-img { transform: scale(1.1); }
        .cat-card:hover .cat-shine { left: 150%; }
        .shop-btn { transition: all 0.3s ease; }
        .cat-card:hover .shop-btn { transform: scale(1.05); box-shadow: 0 8px 24px rgba(184,151,42,0.5); }
        @media (max-width: 1024px) {
          .category-grid { grid-template-columns: repeat(3, 1fr) !important; grid-template-rows: repeat(2, 280px) !important; gap: 16px !important; }
        }
        @media (max-width: 820px) {
          .category-grid { grid-template-columns: repeat(2, 1fr) !important; grid-template-rows: repeat(3, 260px) !important; gap: 14px !important; }
        }
        @media (max-width: 768px) {
          .category-grid { 
            grid-template-columns: repeat(2, 1fr) !important; 
            grid-template-rows: repeat(3, 240px) !important; 
            gap: 12px !important; 
          }
          .cat-overlay {
            padding: 16px !important;
          }
          .cat-content h3 {
            font-size: 1.25rem !important;
            margin-bottom: 10px !important;
          }
          .shop-btn {
            padding: 7px 14px !important;
            font-size: 0.72rem !important;
          }
        }
        @media (max-width: 480px) {
          .category-grid { 
            grid-template-columns: repeat(2, 1fr) !important; 
            grid-template-rows: 240px !important; 
            gap: 12px !important; 
          }
          .cat-card:nth-child(n+3) { display: none !important; }
          
          .cat-overlay {
            padding: 14px !important;
            background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, transparent 100%) !important;
          }
          .cat-content p {
            font-size: 0.62rem !important;
            margin-bottom: 4px !important;
            letter-spacing: 0.12em !important;
          }
          .cat-content h3 {
            font-size: 1.12rem !important;
            margin-bottom: 10px !important;
          }
          .shop-btn {
            padding: 6px 12px !important;
            font-size: 0.68rem !important;
            border-radius: 6px !important;
            gap: 4px !important;
          }
          .shop-btn svg {
            width: 10px !important;
            height: 10px !important;
            stroke-width: 3px !important;
          }
        }
      `}</style>
    </section>
  );
}

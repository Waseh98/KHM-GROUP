import { Link } from 'react-router-dom';
import { categories } from '../data';

function slugify(name) {
  return String(name || '').toLowerCase().trim().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function CategoryGrid() {
  return (
    <section style={{ padding: '100px 0', background: 'linear-gradient(180deg, #fafafa 0%, #f0f0f0 100%)' }} id="collections">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '50px', position: 'relative' }}>
          <span style={{ display: 'inline-block', color: '#b8860b', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '10px', background: 'rgba(184,151,42,0.1)', padding: '6px 16px', borderRadius: 20 }}>🛍️ New Collection</span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 900, color: '#1a1a1a', margin: '10px 0 20px 0', lineHeight: 1.1, letterSpacing: '-0.02em' }}>Shop by Category</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 2, background: 'linear-gradient(90deg, #b8860b, #d4af5a)' }}></div>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#b8860b' }}></div>
            <div style={{ width: 40, height: 2, background: 'linear-gradient(90deg, #d4af5a, #b8860b)' }}></div>
          </div>
        </div>

        <div className="category-grid" style={{ display: 'grid', gap: 20 }}>
          {categories.map((cat, idx) => {
            const isTall = cat.tall;
            return (
              <Link to={`/collections/${slugify(cat.name)}`} key={cat.id} className={`cat-card ${isTall ? 'tall-card' : 'small-card'}`} style={{ position: 'relative', display: 'block', overflow: 'hidden', borderRadius: 20, background: '#000' }}>
                <img src={cat.image} alt={cat.name} loading="lazy" className="cat-img" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease', willChange: 'transform' }} />
                <div className="cat-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'clamp(16px, 3vw, 32px)', zIndex: 2 }}>
                  <div className="cat-content">
                    <p style={{ fontFamily: 'var(--font-body)', color: '#d4af5a', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 8px 0' }}>{cat.subtitle}</p>
                    <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: isTall ? 'clamp(1.8rem, 4vw, 2.8rem)' : 'clamp(1.3rem, 2.5vw, 2rem)', fontWeight: 800, margin: '0 0 12px 0', lineHeight: 1.1, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>{cat.name}</h3>
                    <div className="shop-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#d4af5a', color: '#000', padding: '10px 20px', borderRadius: 30, fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <span>Shop Now</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  </div>
                </div>
                <div className="cat-shine" style={{ position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)', transform: 'skewX(-20deg)', transition: 'left 0.6s ease', zIndex: 1, pointerEvents: 'none' }}></div>
              </Link>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <Link to="/collections" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'transparent', color: '#1a1a1a', padding: '14px 32px', borderRadius: 50, fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', border: '2px solid #1a1a1a', textDecoration: 'none', transition: 'all 0.3s ease' }}>View All Categories →</Link>
        </div>
      </div>

      <style>{`
        .category-grid { grid-template-columns: repeat(7, 1fr); grid-auto-rows: 280px; }
        .tall-card { grid-column: span 3; grid-row: span 2; }
        .small-card { grid-column: span 2; grid-row: span 1; }
        .cat-card:hover .cat-img { transform: scale(1.1); }
        .cat-card:hover .cat-shine { left: 150%; }
        .cat-card:hover .shop-btn { background: '#fff !important'; transform: scale(1.05); box-shadow: 0 10px 30px rgba(212,175,90,0.4); }
        .shop-btn { transition: all 0.3s ease; }
        @media (max-width: 1400px) { .category-grid { grid-template-columns: repeat(6, 1fr); } .tall-card { grid-column: span 3; } }
        @media (max-width: 1024px) { .category-grid { grid-template-columns: repeat(4, 1fr); grid-auto-rows: 260px; } .tall-card { grid-column: span 2; grid-row: span 2; } .small-card { grid-column: span 1; } }
        @media (max-width: 768px) { .category-grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 240px; gap: 14px !important; } .tall-card { grid-column: span 2; grid-row: span 1; } .small-card { grid-column: span 1; } }
        @media (max-width: 480px) { .category-grid { grid-template-columns: 1fr; grid-auto-rows: 280px; gap: 12px !important; } .tall-card, .small-card { grid-column: span 1; grid-row: span 1; } }
      `}</style>
    </section>
  );
}

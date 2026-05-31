import Hero from '../components/Hero';
import CategoryGrid from '../components/CategoryGrid';
import NewArrivals from '../components/NewArrivals';
import SummerSaleBanner from '../components/SummerSaleBanner';
import TrustBadges from '../components/TrustBadges';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';

export default function Home() {
  return (
    <main>
      <Hero />

      <CategoryGrid />

      <NewArrivals />
      <SummerSaleBanner />
      <Testimonials />
      <TrustBadges />

      {/* Instagram Feed */}
      <section style={{ padding: '70px 0', background: '#0d0d0d', color: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Follow Us</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 700, margin: '0 0 8px' }}>@ktexstore.pk</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', margin: 0 }}>Tag us in your K-TEX fits for a chance to be featured</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }} className="insta-grid">
            {[
              { img: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&q=80', likes: '2,847' },
              { img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&q=80', likes: '1,923' },
              { img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80', likes: '3,156' },
              { img: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&q=80', likes: '2,441' },
              { img: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400&q=80', likes: '1,782' },
              { img: 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=400&q=80', likes: '2,634' },
              { img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80', likes: '3,892' },
              { img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80', likes: '2,108' },
            ].map((post, i) => (
              <a key={i} href="https://www.instagram.com/ktexstore.pk/" target="_blank" rel="noopener noreferrer"
                style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '1', display: 'block', textDecoration: 'none' }}
                className="insta-item"
                onMouseEnter={e => { e.currentTarget.querySelector('.insta-overlay').style.opacity = '1'; e.currentTarget.querySelector('.insta-img').style.transform = 'scale(1.05)'; }}
                onMouseLeave={e => { e.currentTarget.querySelector('.insta-overlay').style.opacity = '0'; e.currentTarget.querySelector('.insta-img').style.transform = 'scale(1)'; }}
              >
                <img src={post.img} alt={`K-TEX Instagram ${i+1}`} loading="lazy" className="insta-img"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }} />
                <div className="insta-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s ease' }}>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    {post.likes}
                  </span>
                </div>
              </a>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '28px' }}>
            <a href="https://www.instagram.com/ktexstore.pk/" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', borderRadius: '8px', background: 'linear-gradient(135deg, #f58529, #dd2a7b, #8134af)', color: '#fff', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              Follow on Instagram
            </a>
          </div>
        </div>
      </section>

      <Newsletter />

      <style>{`
        .insta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        @media (max-width: 768px) { .insta-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px) { .insta-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px; } }
      `}</style>
    </main>
  );
}

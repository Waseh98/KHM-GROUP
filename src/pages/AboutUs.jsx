import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const teamValues = [
  {
    icon: '🏆',
    title: 'Uncompromising Quality',
    desc: 'Every polo shirt goes through a 12-step quality check before it reaches your doorstep. We use only premium combed cotton that gets softer with every wash.',
  },
  {
    icon: '🌍',
    title: 'Made for Pakistan',
    desc: 'Our fabrics are chosen specifically for Pakistan\'s climate — breathable in summer, warm enough for cool evenings. Designed here, worn everywhere.',
  },
  {
    icon: '🤝',
    title: 'Customer First',
    desc: 'We believe in building long-term relationships, not just sales. From easy size exchanges to fast responses — your satisfaction is our promise.',
  },
  {
    icon: '💡',
    title: 'Timeless Design',
    desc: 'No gimmicks, no fast-fashion trends. Our collections are rooted in classic silhouettes that stay stylish for years, not just a season.',
  },
];

const stats = [
  { number: '10,000+', label: 'Happy Customers' },
  { number: '50+', label: 'Polo Styles' },
  { number: '4.9★', label: 'Average Rating' },
  { number: '3–5 Days', label: 'Nationwide Delivery' },
];

export default function AboutUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "About Us — Our Story & Textile Heritage | K-TEX";
  }, []);

  return (
    <main style={{ backgroundColor: 'var(--bg)' }}>

      {/* Hero */}
      <section style={{
        position: 'relative', backgroundColor: 'var(--black)',
        padding: '100px 0 80px', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-20%', right: '-5%',
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(184,151,42,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="container fade-up" style={{ maxWidth: 760, textAlign: 'center' }}>
          <p style={{
            fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16
          }}>Our Story</p>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.8rem, 5vw, 5rem)',
            color: 'var(--white)', margin: '0 0 24px', lineHeight: 1.05
          }}>
            Crafted with Passion,<br />
            <span style={{ fontStyle: 'italic', fontWeight: 300 }}>Worn with Pride</span>
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.65)', fontSize: '1.1rem',
            lineHeight: 1.7, maxWidth: 600, margin: '0 auto'
          }}>
            K-TEX was born from a simple belief: every person in Pakistan deserves access to world-class polo shirts at honest prices. We started in Rawalpindi in 2021, and have since grown into a brand trusted by over 10,000 customers nationwide.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ backgroundColor: 'var(--white)', borderBottom: '1px solid #eee' }}>
        <div className="container">
          <div className="about-stats-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            textAlign: 'center',
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                padding: '40px 20px',
                borderRight: i < stats.length - 1 ? '1px solid #eee' : 'none'
              }} className="about-stat-item">
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2rem, 3vw, 2.8rem)',
                  fontWeight: 700, color: 'var(--black)', marginBottom: 8
                }}>{s.number}</div>
                <div style={{ color: 'var(--mid-gray)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="about-story-grid" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center'
          }}>
            {/* Image */}
            <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-lg)', aspectRatio: '4/3' }}>
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                alt="K-TEX workshop"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Text */}
            <div>
              <p style={{
                fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16
              }}>How We Started</p>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 3vw, 2.8rem)',
                color: 'var(--black)', margin: '0 0 20px', lineHeight: 1.15
              }}>A Family Business<br />Built on Quality</h2>
              <p style={{ color: 'var(--mid-gray)', lineHeight: 1.8, marginBottom: 16 }}>
                K-TEX started in a small workshop in Rawalpindi's textile district. Our founder, Khalid Mehmood, spent 15 years in Pakistan's garment industry before deciding to create a brand that truly prioritized the customer — not just production volume.
              </p>
              <p style={{ color: 'var(--mid-gray)', lineHeight: 1.8, marginBottom: 32 }}>
                Today, we operate with a small but passionate team of 12 people, all dedicated to crafting polo shirts that look premium, feel incredible, and last for years. We source our fabrics locally and internationally to ensure the perfect blend of comfort and durability.
              </p>
              <Link to="/contact" style={{
                display: 'inline-block',
                backgroundColor: 'var(--black)', color: 'var(--white)',
                padding: '14px 32px', borderRadius: 8,
                fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                fontSize: '0.9rem', transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--gold)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--black)'}
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section style={{ backgroundColor: 'var(--white)', padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{
              fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12
            }}>What Drives Us</p>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              color: 'var(--black)', margin: 0
            }}>Our Core Values</h2>
          </div>

          <div className="about-values-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24
          }}>
            {teamValues.map((val, i) => (
              <div key={i} style={{
                padding: 32, borderRadius: 12,
                border: '1px solid #eee', backgroundColor: 'var(--bg)',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{val.icon}</div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)', fontSize: '1.5rem',
                  margin: '0 0 10px', color: 'var(--black)'
                }}>{val.title}</h3>
                <p style={{ color: 'var(--mid-gray)', lineHeight: 1.7, margin: 0 }}>{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: 'linear-gradient(135deg, #0d0d0d, #1a1510)',
        padding: '80px 0', textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: 'var(--white)', margin: '0 0 16px'
          }}>Ready to Experience K-TEX?</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 32, fontSize: '1rem' }}>
            Browse our latest collections and find your perfect polo.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/men" style={{
              backgroundColor: 'var(--white)', color: 'var(--black)',
              padding: '14px 32px', borderRadius: 8,
              fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--white)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--white)'; e.currentTarget.style.color = 'var(--black)'; }}
            >Shop Men's</Link>
            <Link to="/women" style={{
              backgroundColor: 'transparent', color: 'var(--white)',
              padding: '14px 32px', borderRadius: 8,
              border: '2px solid rgba(255,255,255,0.3)',
              fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = 'var(--white)'; }}
            >Shop Women's</Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .about-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .about-stat-item { border-right: none !important; border-bottom: 1px solid #eee; }
          .about-stat-item:nth-child(n+3) { border-bottom: none; }
          .about-story-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          .about-values-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 820px) {
          .about-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .about-story-grid { grid-template-columns: 1fr !important; gap: 30px !important; }
        }
        @media (max-width: 600px) {
          .about-stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </main>
  );
}

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section style={{
      background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1510 50%, #0d0d0d 100%)',
      padding: '80px 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative gold glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600, height: 300,
        background: 'radial-gradient(ellipse, rgba(184,151,42,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
        {/* Eyebrow */}
        <p style={{
          fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14
        }}>Exclusive Offers</p>

        {/* Heading */}
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
          color: 'var(--white)', margin: '0 0 16px', lineHeight: 1.1
        }}>
          Join the K-TEX Family
        </h2>
        <p style={{
          color: 'rgba(255,255,255,0.6)', maxWidth: 480,
          margin: '0 auto 36px', fontSize: '1rem', lineHeight: 1.6
        }}>
          Subscribe and get <strong style={{ color: 'var(--gold)' }}>10% off</strong> your first order, plus early access to new arrivals and exclusive sale events.
        </p>

        {submitted ? (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            backgroundColor: 'rgba(46,125,50,0.15)',
            border: '1px solid rgba(46,125,50,0.4)',
            color: '#81c784', padding: '16px 32px', borderRadius: 50,
            animation: 'fadeIn 0.5s ease',
          }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span style={{ fontWeight: 700 }}>You're subscribed! Welcome to K-TEX 🎉</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex', gap: 0,
              maxWidth: 480, margin: '0 auto',
              borderRadius: 8, overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
            className="newsletter-form"
          >
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
              style={{
                flex: 1, padding: '16px 20px',
                border: 'none', outline: 'none',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-body)',
                backgroundColor: '#fff',
                color: 'var(--black)',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '16px 28px',
                backgroundColor: 'var(--gold)', color: 'var(--white)',
                border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: '0.9rem',
                textTransform: 'uppercase', letterSpacing: '0.05em',
                fontFamily: 'var(--font-body)',
                transition: 'background-color 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => e.target.style.backgroundColor = '#a07820'}
              onMouseLeave={e => e.target.style.backgroundColor = 'var(--gold)'}
            >
              Subscribe
            </button>
          </form>
        )}

        {/* Trust note */}
        <p style={{
          color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem',
          marginTop: 20, letterSpacing: '0.04em'
        }}>
          No spam, ever. Unsubscribe anytime. 🔒 Privacy guaranteed.
        </p>

        {/* Social links */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 40 }}>
          {[
            { name: 'Instagram', href: '#', icon: '📸' },
            { name: 'Facebook', href: '#', icon: '👍' },
            { name: 'TikTok', href: '#', icon: '🎵' },
            { name: 'WhatsApp', href: '#', icon: '💬' },
          ].map(s => (
            <a key={s.name} href={s.href} style={{
              color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem',
              transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: 6
            }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
            >
              {s.name}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .newsletter-form { flex-direction: column !important; border-radius: 8px !important; }
          .newsletter-form input { border-radius: 8px 8px 0 0 !important; }
          .newsletter-form button { border-radius: 0 0 8px 8px !important; }
        }
        @media (max-width: 600px) {
          .newsletter-form { flex-direction: column !important; border-radius: 8px !important; }
          .newsletter-form input { border-radius: 8px 8px 0 0 !important; }
          .newsletter-form button { border-radius: 0 0 8px 8px !important; }
        }
      `}</style>
    </section>
  );
}

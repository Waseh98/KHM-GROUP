import { useState, useEffect, useRef } from 'react';

const reviews = [
  {
    name: 'Ahmed Raza',
    city: 'Lahore',
    rating: 5,
    review: 'Absolutely premium quality! The piqué fabric is incredibly soft and the stitching is flawless. Ordered 3 shirts and every single one is perfect. Will definitely be a repeat customer.',
    product: 'Classic Piqué Polo',
    date: 'April 2025',
    avatar: 'A',
    verified: true,
  },
  {
    name: 'Sara Malik',
    city: 'Karachi',
    rating: 5,
    review: 'The women\'s slim polo is exactly what I was looking for. Fits beautifully, the colors are vibrant and delivery was super fast. K-TEX has won a loyal customer!',
    product: "Women's Slim Polo",
    date: 'March 2025',
    avatar: 'S',
    verified: true,
  },
  {
    name: 'Bilal Hassan',
    city: 'Islamabad',
    rating: 5,
    review: 'Wore the Corporate Classic to the office and got so many compliments. The cut is modern, professional, and very comfortable even in Islamabad heat.',
    product: 'Corporate Classic Polo',
    date: 'April 2025',
    avatar: 'B',
    verified: true,
  },
  {
    name: 'Usman Tariq',
    city: 'Rawalpindi',
    rating: 4,
    review: 'Great quality for the price. Fabric is thick and durable — feels much more expensive than it is. Delivery was in 3 days. Highly recommended!',
    product: 'Signature Striped Polo',
    date: 'May 2025',
    avatar: 'U',
    verified: true,
  },
  {
    name: 'Fatima Javed',
    city: 'Faisalabad',
    rating: 5,
    review: 'Bought as a gift for my husband and he absolutely loves it. The packaging was neat and the product quality is outstanding. Will order more colors!',
    product: 'Golf Edition Polo',
    date: 'April 2025',
    avatar: 'F',
    verified: true,
  },
  {
    name: 'Hamza Ali',
    city: 'Multan',
    rating: 5,
    review: 'Best polo shirts in Pakistan hands down! The customer service is exceptional and the quality speaks for itself. My entire family now wears K-TEX.',
    product: 'Premium Mesh Polo',
    date: 'May 2025',
    avatar: 'H',
    verified: true,
  },
];

function StarRating({ rating, small }) {
  const s = small ? 14 : 18;
  return (
    <div style={{ display: 'flex', gap: small ? 2 : 3 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <svg key={star} width={s} height={s} viewBox="0 0 24 24" fill={star <= rating ? '#B8972A' : '#e0dbd0'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function QuoteIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 12C8 12 6 18 6 22C6 28 10 32 16 32C16 32 14 38 10 40" stroke="#B8972A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.35"/>
      <path d="M34 12C28 12 26 18 26 22C26 28 30 32 36 32C36 32 34 38 30 40" stroke="#B8972A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.35"/>
    </svg>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slideDirection, setSlideDirection] = useState('next');
  const [animKey, setAnimKey] = useState(0);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || hovered !== null) return;
    const timer = setInterval(() => {
      setSlideDirection('next');
      setAnimKey(k => k + 1);
      setActive(a => (a + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, hovered]);

  const getVisibleIndexes = (base) => {
    const len = reviews.length;
    return [
      (base - 1 + len) % len,
      base,
      (base + 1) % len,
    ];
  };

  const [left, center, right] = getVisibleIndexes(active);

  const handlePrev = () => {
    setHovered(null);
    setIsAutoPlaying(false);
    setSlideDirection('prev');
    setAnimKey(k => k + 1);
    setActive(a => (a - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setHovered(null);
    setIsAutoPlaying(false);
    setSlideDirection('next');
    setAnimKey(k => k + 1);
    setActive(a => (a + 1) % reviews.length);
  };

  const handleDot = (i) => {
    setHovered(null);
    setIsAutoPlaying(false);
    setSlideDirection(i > active ? 'next' : 'prev');
    setAnimKey(k => k + 1);
    setActive(i);
  };

  const cardOrder = [left, center, right];

  const isProminent = (cardIndex) => {
    if (hovered !== null) return hovered === cardIndex;
    return cardIndex === center;
  };

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'linear-gradient(180deg, #FAF8F3 0%, #F5F0E8 40%, #EFE9DD 100%)',
        padding: '120px 0 100px',
        position: 'relative',
        overflow: 'hidden',
      }}
      id="testimonials"
    >
      {/* Golden Background Shades */}
      <div style={{
        position: 'absolute', top: -80, right: -120,
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(184,151,42,0.06) 0%, rgba(212,175,90,0.02) 40%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -60, left: -100,
        width: 350, height: 350, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(184,151,42,0.07) 0%, rgba(212,175,90,0.03) 40%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 50 }} className={isVisible ? 'fade-up' : ''}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{ width: 40, height: 1, backgroundColor: 'var(--gold)', opacity: 0.6 }} />
            <span style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Customer Love
            </span>
            <div style={{ width: 40, height: 1, backgroundColor: 'var(--gold)', opacity: 0.6 }} />
          </div>

          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
            fontWeight: 600, color: 'var(--black)',
            margin: '0 0 16px 0', lineHeight: 1.15, letterSpacing: '-0.01em',
          }}>
            What Our Customers Say
          </h2>

          <p style={{ color: 'var(--mid-gray)', maxWidth: 540, margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.7, fontWeight: 400 }}>
            Real stories from real people who trust K-TEX for premium quality and unmatched style.
          </p>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            backgroundColor: 'var(--white)', border: '1px solid #e8e3d9',
            padding: '10px 24px', borderRadius: 50, marginTop: 28,
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          }}>
            <StarRating rating={5} />
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--black)', fontFamily: 'var(--font-heading)' }}>4.9</span>
            <span style={{ color: 'var(--mid-gray)', fontSize: '0.85rem', fontWeight: 500 }}>/ 5.0</span>
            <div style={{ width: 1, height: 18, backgroundColor: '#ddd8cd', margin: '0 4px' }} />
            <span style={{ color: 'var(--black)', fontSize: '0.85rem', fontWeight: 600 }}>200+ Reviews</span>
          </div>

        </div>

        {/* Testimonials Carousel */}
        <div
          key={animKey}
          className={`testimonial-carousel fade-${slideDirection === 'next' ? 'right' : 'left'}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(8px, 2.5vw, 24px)',
            position: 'relative',
            padding: '20px 0',
          }}
        >
          {cardOrder.map((reviewIndex) => {
            const prominent = isProminent(reviewIndex);
            const review = reviews[reviewIndex];

            return (
              <div
                key={reviewIndex}
                className={`testimonial-card ${prominent ? 'prominent' : 'side'}`}
                onMouseEnter={() => { setHovered(reviewIndex); setIsAutoPlaying(false); }}
                onMouseLeave={() => setHovered(null)}
                onClick={() => { setHovered(null); setIsAutoPlaying(false); setActive(reviewIndex); }}
                style={{
                  backgroundColor: 'var(--white)',
                  border: prominent ? '1.5px solid var(--gold)' : '1.5px solid #ede8db',
                  borderRadius: 16,
                  padding: prominent ? '40px 32px' : '28px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: prominent ? '0 0 clamp(300px, 32vw, 380px)' : '0 0 clamp(250px, 26vw, 320px)',
                  minHeight: prominent ? 400 : 350,
                  position: 'relative',
                  cursor: 'pointer',
                  transform: prominent
                    ? 'scale(1.06) translateY(-14px)'
                    : 'scale(0.9) translateY(4px)',
                  boxShadow: prominent
                    ? '0 30px 80px rgba(184,151,42,0.18), 0 12px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(184,151,42,0.1)'
                    : '0 6px 25px rgba(184,151,42,0.08), 0 2px 10px rgba(0,0,0,0.04)',
                  zIndex: prominent ? 5 : 1,
                  opacity: prominent ? 1 : 0.55,
                  filter: prominent ? 'blur(0)' : 'blur(1.2px)',
                  transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  overflow: 'hidden',
                }}
              >
                {/* Golden glow background for side cards */}
                {!prominent && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(ellipse at center, rgba(184,151,42,0.1) 0%, rgba(212,175,90,0.04) 40%, transparent 70%)',
                    pointerEvents: 'none',
                    borderRadius: 16,
                  }} />
                )}

                {/* Gold top accent bar for prominent */}
                {prominent && (
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                    background: 'linear-gradient(90deg, #B8972A, #D4AF5A, #B8972A)',
                  }} />
                )}

                {/* Quote Icon */}
                <div style={{ marginBottom: prominent ? 16 : 10, opacity: prominent ? 1 : 0.5 }}>
                  <QuoteIcon />
                </div>

                {/* Review Text */}
                <p style={{
                  fontSize: prominent ? '1.05rem' : '0.85rem',
                  lineHeight: prominent ? 1.8 : 1.65,
                  color: 'var(--black)',
                  margin: '0 0 18px',
                  flex: 1,
                  fontWeight: 400,
                  fontStyle: 'italic',
                }}>
                  "{review.review}"
                </p>

                {/* Stars */}
                <div style={{ marginBottom: prominent ? 16 : 12 }}>
                  <StarRating rating={review.rating} small={!prominent} />
                </div>

                {/* Divider */}
                <div style={{
                  height: 1,
                  backgroundColor: prominent ? '#e0d6bc' : '#eeeadf',
                  marginBottom: prominent ? 16 : 12,
                }} />

                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', gap: prominent ? 14 : 10 }}>
                  <div style={{
                    width: prominent ? 50 : 40,
                    height: prominent ? 50 : 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--black) 0%, #2a2a2a 100%)',
                    color: 'var(--white)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: prominent ? '1.15rem' : '0.95rem',
                    fontFamily: 'var(--font-heading)',
                    flexShrink: 0,
                    boxShadow: prominent ? '0 0 0 3px rgba(184,151,42,0.15), 0 8px 20px rgba(0,0,0,0.15)' : 'none',
                    transition: 'all 0.4s ease',
                  }}>
                    {review.avatar}
                  </div>
                  <div>
                    <div style={{
                      fontWeight: 700,
                      fontSize: prominent ? '0.95rem' : '0.82rem',
                      color: 'var(--black)',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      {review.name}
                      {review.verified && prominent && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#2e7d32">
                          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      )}
                    </div>
                    <div style={{
                      fontSize: prominent ? '0.82rem' : '0.72rem',
                      color: 'var(--mid-gray)', marginTop: 2,
                    }}>
                      {review.city}
                    </div>
                    <div style={{
                      fontSize: prominent ? '0.78rem' : '0.7rem',
                      color: 'var(--gold)', marginTop: 3,
                      fontWeight: 700, letterSpacing: '0.03em',
                      textTransform: 'uppercase',
                    }}>
                      {review.product}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation - Moved Below Cards */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24, marginTop: 50 }}>
          <button onClick={handlePrev} className="testimonial-nav-btn" aria-label="Previous review">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDot(i)}
                className="testimonial-dot"
                style={{
                  width: i === active ? 32 : 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: i === active ? 'var(--gold)' : '#d5d1c8',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  boxShadow: i === active ? '0 2px 8px rgba(184,151,42,0.35)' : 'none',
                }}
                aria-label={`Go to review ${i + 1}`}
              />
            ))}
          </div>

          <button onClick={handleNext} className="testimonial-nav-btn" aria-label="Next review">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <style>{`
        .testimonial-carousel {
          animation: slideIn 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        @keyframes slideIn {
          0% { opacity: 0; transform: translateX(60px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInLeft {
          0% { opacity: 0; transform: translateX(-60px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        .fade-right {
          animation: slideIn 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .fade-left {
          animation: slideInLeft 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .testimonial-nav-btn {
          width: 50px; height: 50px; border-radius: 50%;
          border: 2px solid var(--black); background: transparent; color: var(--black);
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.35s ease;
        }
        .testimonial-nav-btn:hover {
          background: var(--black); color: var(--white);
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }
        .testimonial-dot:hover {
          background: #c4a83a !important;
          transform: scale(1.25);
        }

        @media (max-width: 900px) {
          .testimonial-card.side { display: none !important; }
          .testimonial-card.prominent {
            transform: scale(1) !important;
            flex: 0 0 90% !important;
          }
        }
        @media (max-width: 820px) {
          .testimonial-card.side { display: none !important; }
          .testimonial-card.prominent {
            transform: scale(1) !important;
            flex: 0 0 95% !important;
          }
        }
        @media (max-width: 600px) {
          .testimonial-card.prominent {
            transform: scale(0.95) !important;
          }
        }
      `}</style>
    </section>
  );
}

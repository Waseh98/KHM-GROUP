import React, { useState } from 'react';

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
];

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill={star <= rating ? '#B8972A' : '#e0dbd0'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const handlePrev = () => setActive(a => (a - 1 + reviews.length) % reviews.length);
  const handleNext = () => setActive(a => (a + 1) % reviews.length);

  const visibleReviews = [
    reviews[active % reviews.length],
    reviews[(active + 1) % reviews.length],
    reviews[(active + 2) % reviews.length],
  ];

  return (
    <section style={{ backgroundColor: 'var(--bg)', padding: '100px 0' }} id="testimonials">
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
            Real Experiences
          </span>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 600,
            color: 'var(--black)',
            margin: '0 0 20px 0',
            lineHeight: 1.1
          }}>What Our Customers Say</h2>
          <div style={{ width: '60px', height: '2px', backgroundColor: 'var(--gold)', margin: '0 auto 24px auto' }}></div>
          
          <p style={{ color: 'var(--mid-gray)', maxWidth: 500, margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Trusted by thousands of customers across Pakistan. Read what they have to say about our premium polos.
          </p>

          {/* Rating Summary */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            backgroundColor: 'var(--white)', border: '1px solid #f0eee9',
            padding: '12px 28px', borderRadius: 40, marginTop: 32,
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
          }}>
            <StarRating rating={5} />
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--black)' }}>4.9</span>
            <span style={{ color: 'var(--mid-gray)', fontSize: '0.9rem' }}>from 200+ reviews</span>
          </div>
        </div>

        {/* Cards */}
        <div className="testimonials-grid fade-up-1" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(16px, 3vw, 30px)', marginBottom: 50
        }}>
          {visibleReviews.map((review, i) => (
            <div key={i} className="testimonial-card" style={{
              backgroundColor: 'var(--white)', border: '1px solid #f0eee9',
              borderRadius: '12px', padding: '32px 28px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease',
              display: 'flex', flexDirection: 'column'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)'; }}
            >
              {/* Stars */}
              <div style={{ marginBottom: 20 }}><StarRating rating={review.rating} /></div>

              {/* Quote */}
              <p style={{
                fontSize: '1rem', lineHeight: 1.7, color: 'var(--black)',
                margin: '0 0 24px', flex: 1, fontStyle: 'italic', fontWeight: 300
              }}>
                "{review.review}"
              </p>

              {/* Divider */}
              <div style={{ height: 1, backgroundColor: '#f0eee9', marginBottom: 20 }} />

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: '50%',
                  backgroundColor: 'var(--black)', color: 'var(--white)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '1.1rem', fontFamily: 'var(--font-heading)',
                  flexShrink: 0,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}>
                  {review.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--black)' }}>
                    {review.name}
                    {review.verified && (
                      <span style={{
                        marginLeft: 8, backgroundColor: '#e8f5e9', color: '#2e7d32',
                        fontSize: '0.65rem', padding: '3px 8px', borderRadius: 20,
                        fontWeight: 700, verticalAlign: 'middle', letterSpacing: '0.05em', textTransform: 'uppercase'
                      }}>✓ Verified</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--mid-gray)', marginTop: 2 }}>{review.city} · {review.date}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gold)', marginTop: 4, fontWeight: 600 }}>{review.product}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
          <button
            onClick={handlePrev}
            style={{
              width: 48, height: 48, borderRadius: '50%',
              border: '2px solid var(--black)', backgroundColor: 'transparent', color: 'var(--black)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--black)'; e.currentTarget.style.color = 'var(--white)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--black)'; }}
            aria-label="Previous review"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>

          {/* Dots */}
          <div style={{ display: 'flex', gap: 8 }}>
            {reviews.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} style={{
                width: i === active ? 28 : 8, height: 8,
                borderRadius: 4,
                backgroundColor: i === active ? 'var(--gold)' : '#d5d3ce',
                border: 'none', cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }} aria-label={`Go to review ${i + 1}`} />
            ))}
          </div>

          <button
            onClick={handleNext}
            style={{
              width: 48, height: 48, borderRadius: '50%',
              border: '2px solid var(--black)', backgroundColor: 'transparent', color: 'var(--black)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--black)'; e.currentTarget.style.color = 'var(--white)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--black)'; }}
            aria-label="Next review"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .testimonials-grid { grid-template-columns: 1fr 1fr !important; }
          .testimonials-grid .testimonial-card:last-child { display: none; }
        }
        @media (max-width: 600px) {
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .testimonials-grid .testimonial-card:nth-child(n+2) { display: none; }
        }
      `}</style>
    </section>
  );
}

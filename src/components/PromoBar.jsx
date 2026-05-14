import React from 'react';

const messages = [
  'Free Express Shipping on orders over Rs. 5,000',
  'New Arrivals Dropping Weekly — Shop the Latest',
  'Join KHM Club & Earn 10% Cashback on Every Order',
];

export default function PromoBar() {
  const doubled = [...messages, ...messages];

  return (
    <div
      style={{
        background: '#D4AF5A',
        color: 'black',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        height: 30,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          animation: 'promoScroll 20s linear infinite',
          willChange: 'transform',
        }}
      >
        {doubled.map((text, i) => (
          <span
            key={i}
            style={{
              margin: '0 2.5rem',
              fontWeight: 600,
              fontSize: '0.8rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <span style={{
              display: 'inline-block',
              width: 5,
              height: 5,
              borderRadius: '50%',
              backgroundColor: '#000',
              opacity: 0.35,
              flexShrink: 0,
            }} />
            {text}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes promoScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

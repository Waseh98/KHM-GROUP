import React from 'react';

export default function PromoBar() {
  return (
    <div style={{
      backgroundColor: 'var(--gold)',
      color: 'var(--white)',
      padding: '8px 20px',
      textAlign: 'center',
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      position: 'relative',
      zIndex: 1001
    }}>
      Free Express Shipping on orders over Rs. 5,000 — Use Code: <span style={{ fontWeight: 800 }}>KTEX15</span>
    </div>
  );
}

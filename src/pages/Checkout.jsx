import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Checkout() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main style={{ minHeight: '60vh', padding: '80px 20px', backgroundColor: 'var(--light-gray)' }}>
      <div className="container" style={{ maxWidth: '600px', backgroundColor: 'var(--white)', padding: '40px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛍️</div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: '2.5rem', color: 'var(--black)', margin: '0 0 16px 0' }}>Secure Checkout</h1>
          <p style={{ color: 'var(--mid-gray)', fontFamily: "var(--font-body)" }}>Please provide your details to complete the order.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); alert('Order placed successfully!'); window.location.href = '/'; }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Full Name</label>
            <input type="text" required style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '4px', fontFamily: "var(--font-body)" }} placeholder="John Doe" />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Phone Number</label>
            <input type="tel" required style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '4px', fontFamily: "var(--font-body)" }} placeholder="0300 1234567" />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Delivery Address</label>
            <textarea required rows="3" style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '4px', fontFamily: "var(--font-body)", resize: 'vertical' }} placeholder="House/Apt, Street, City"></textarea>
          </div>

          <button type="submit" style={{
            width: '100%', padding: '16px', backgroundColor: 'var(--gold)', color: 'var(--white)',
            fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
            border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s'
          }}
          onMouseEnter={e => e.target.style.backgroundColor = '#a30d25'}
          onMouseLeave={e => e.target.style.backgroundColor = 'var(--gold)'}
          >
            Confirm Order (Cash on Delivery)
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link to="/" style={{ color: 'var(--mid-gray)', textDecoration: 'underline', fontSize: '0.9rem' }}>Return to Home</Link>
        </div>
      </div>
    </main>
  );
}

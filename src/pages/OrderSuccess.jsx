import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function OrderSuccess() {
  const location = useLocation();
  const orderNumber = location.state?.orderNumber || '';
  const orderStatus = location.state?.orderStatus || 'pending';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main
      style={{
        minHeight: '60vh',
        padding: '80px 20px',
        backgroundColor: 'var(--light-gray)',
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: '760px',
          backgroundColor: 'var(--white)',
          padding: '44px',
          borderRadius: '14px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{ fontSize: '3.25rem', marginBottom: '12px' }}>✅</div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.5rem',
              color: 'var(--black)',
              margin: '0 0 10px 0',
            }}
          >
            Order Placed Successfully
          </h1>
          <p style={{ color: 'var(--mid-gray)', fontFamily: 'var(--font-body)', margin: 0 }}>
            Thank you! We’ve received your order and will contact you soon.
          </p>
        </div>

        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '18px',
            background: 'rgba(184, 151, 42, 0.06)',
            marginBottom: '22px',
          }}
        >
          <div style={{ display: 'grid', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <span style={{ color: 'var(--mid-gray)' }}>Payment</span>
              <span style={{ fontWeight: 700 }}>Cash on Delivery</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <span style={{ color: 'var(--mid-gray)' }}>Status</span>
              <span style={{ fontWeight: 700, color: 'var(--gold)', textTransform: 'capitalize' }}>{orderStatus}</span>
            </div>
            {orderNumber && (
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                <span style={{ color: 'var(--mid-gray)' }}>Tracking ID</span>
                <span style={{ fontWeight: 700 }}>{orderNumber}</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {orderNumber && (
            <Link
              to={`/track-order?id=${encodeURIComponent(orderNumber)}`}
              style={{
                padding: '14px 18px',
                borderRadius: '8px',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                border: '1px solid var(--border)',
                color: 'var(--black)',
                display: 'inline-block',
              }}
            >
              Track Order
            </Link>
          )}
          <Link
            to="/"
            style={{
              padding: '14px 18px',
              borderRadius: '8px',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              backgroundColor: 'var(--gold)',
              color: 'var(--white)',
              display: 'inline-block',
            }}
          >
            Back to Home
          </Link>
          <Link
            to="/men"
            style={{
              padding: '14px 18px',
              borderRadius: '8px',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              border: '1px solid var(--border)',
              color: 'var(--black)',
              display: 'inline-block',
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}


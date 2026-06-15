import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function OrderSuccess() {
  const location = useLocation();
  const orderNumber = location.state?.orderNumber || '';
  const orderStatus = location.state?.orderStatus || 'pending';
  const paymentMethod = location.state?.paymentMethod || 'cod';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(16px, 4vw, 40px)',
        background: 'linear-gradient(135deg, #faf8f3 0%, #f5f0e8 50%, #f0ece0 100%)',
      }}
    >
      <div
        style={{
          maxWidth: '460px',
          width: '100%',
          background: '#fff',
          padding: 'clamp(28px, 5vw, 48px)',
          borderRadius: '24px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative top accent */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
          background: 'linear-gradient(90deg, #d4af5a, #f0d78c, #d4af5a)',
        }} />

        {/* Success Icon */}
        <div style={{
          width: 'clamp(64px, 12vw, 88px)',
          height: 'clamp(64px, 12vw, 88px)',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #d4af5a 0%, #a08040 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto clamp(16px, 3vw, 24px)',
          boxShadow: '0 8px 30px rgba(212,175,90,0.3)',
          animation: 'osPop 0.5s ease',
        }}>
          <svg width="clamp(28px, 5vw, 40px)" height="clamp(28px, 5vw, 40px)" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(22px, 5vw, 32px)',
          fontWeight: 900,
          margin: '0 0 8px',
          color: '#0D0D0D',
          letterSpacing: '-0.02em',
        }}>
          Order Placed!
        </h1>
        <p style={{
          color: '#888',
          fontSize: 'clamp(13px, 2.5vw, 15px)',
          lineHeight: 1.5,
          margin: '0 0 clamp(20px, 4vw, 32px)',
        }}>
          Thank you for your order. We'll confirm it shortly.
        </p>

        {/* Order Details Card */}
        <div style={{
          background: 'linear-gradient(135deg, #faf8f3 0%, #f5f0e8 100%)',
          borderRadius: '16px',
          padding: 'clamp(16px, 3vw, 24px)',
          marginBottom: 'clamp(20px, 4vw, 32px)',
          border: '1px solid rgba(184,151,42,0.15)',
        }}>
          <div style={{ display: 'grid', gap: 'clamp(8px, 1.5vw, 12px)' }}>
            <Row label="Payment" value={paymentMethod === 'cod' ? 'COD' : 'Paid'} />
            <Row label="Status" value={orderStatus} gold />
            {orderNumber && <Row label="Tracking ID" value={orderNumber} />}
          </div>
        </div>

        {/* Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          {orderNumber && (
            <Link
              to={`/track-order?id=${encodeURIComponent(orderNumber)}`}
              style={btnStyle.outline}
            >
              📦 Track Order
            </Link>
          )}
          <Link to="/" style={btnStyle.primary}>
            🏠 Back to Home
          </Link>
          <Link to="/men" style={btnStyle.ghost}>
            🛍️ Continue Shopping
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes osPop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </main>
  );
}

function Row({ label, value, gold }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      gap: '12px',
      fontSize: 'clamp(13px, 2.5vw, 14px)',
    }}>
      <span style={{ color: '#888', fontWeight: 600 }}>{label}</span>
      <span style={{
        fontWeight: 800,
        color: gold ? '#d4af5a' : '#0D0D0D',
        textTransform: gold ? 'capitalize' : 'none',
        textAlign: 'right',
        wordBreak: 'break-all',
      }}>
        {value || '—'}
      </span>
    </div>
  );
}

const btnStyle = {
  primary: {
    padding: 'clamp(14px, 2.5vw, 16px) 24px',
    borderRadius: '12px',
    fontWeight: 800,
    fontSize: 'clamp(13px, 2.5vw, 14px)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    background: 'linear-gradient(135deg, #d4af5a 0%, #a08040 100%)',
    color: '#fff',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 15px rgba(212,175,90,0.3)',
    transition: 'all 0.2s',
  },
  outline: {
    padding: 'clamp(14px, 2.5vw, 16px) 24px',
    borderRadius: '12px',
    fontWeight: 800,
    fontSize: 'clamp(13px, 2.5vw, 14px)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    border: '2px solid #d4af5a',
    color: '#d4af5a',
    background: 'transparent',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s',
  },
  ghost: {
    padding: 'clamp(12px, 2vw, 14px) 24px',
    borderRadius: '12px',
    fontWeight: 700,
    fontSize: 'clamp(12px, 2.5vw, 13px)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: '#888',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s',
  },
};

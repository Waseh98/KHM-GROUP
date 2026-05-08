import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

// Check localStorage for offline orders
function findOfflineOrder(id) {
  try {
    const saved = JSON.parse(localStorage.getItem('ktex_offline_orders') || '[]');
    const val = String(id || '').trim().toLowerCase();
    return saved.find(o =>
      String(o.orderNumber || '').toLowerCase() === val ||
      String(o.trackingNumber || '').toLowerCase() === val
    ) || null;
  } catch {
    return null;
  }
}

// Check if error is a gateway/network issue
function isGatewayError(msg) {
  const raw = String(msg || '').toLowerCase();
  return (
    raw.includes('502') ||
    raw.includes('503') ||
    raw.includes('504') ||
    raw.includes('failed to fetch') ||
    raw.includes('networkerror') ||
    raw.includes('load failed') ||
    raw.includes('net::') ||
    raw.includes('ssl')
  );
}

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [trackingId, setTrackingId] = useState(searchParams.get('id') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  async function lookupOrder(id) {
    const value = String(id || '').trim();
    if (!value) {
      setError('Please enter a tracking ID or order number.');
      setOrder(null);
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);
    setIsOffline(false);

    // 1. Check localStorage first (offline orders)
    const localOrder = findOfflineOrder(value);
    if (localOrder) {
      setOrder({
        orderNumber: localOrder.orderNumber,
        trackingNumber: localOrder.orderNumber,
        orderStatus: localOrder.status || 'pending',
        updatedAt: localOrder.placedAt,
        createdAt: localOrder.placedAt,
        fullName: localOrder.fullName,
        isLocal: true,
      });
      setLoading(false);
      return;
    }

    // 2. Try backend API
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(`/api/orders/track/${encodeURIComponent(value)}`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      // Gateway errors — backend is down
      if ([502, 503, 504].includes(res.status)) {
        setIsOffline(true);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `Order not found`);
      }

      const data = await res.json();
      setOrder(data?.data || data || null);
    } catch (e) {
      if (e.name === 'AbortError' || isGatewayError(e.message)) {
        setIsOffline(true);
      } else {
        setError(e.message || 'Order not found. Please check your order number.');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    const qId = searchParams.get('id');
    if (qId) lookupOrder(qId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main style={{ minHeight: '70vh', padding: '80px 20px', backgroundColor: 'var(--light-gray)' }}>
      <div className="container" style={{
        maxWidth: '720px', backgroundColor: 'var(--white)',
        padding: '40px', borderRadius: '16px', boxShadow: 'var(--shadow-md)'
      }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📦</div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '2.2rem' }}>Track Your Order</h1>
          <p style={{ color: 'var(--mid-gray)', marginTop: 8, fontSize: '0.95rem' }}>
            Enter your order number (e.g. <strong>KTX-C77REN</strong>) to see its latest status.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => { e.preventDefault(); lookupOrder(trackingId); }}
          style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}
        >
          <input
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="e.g. KTX-C77REN"
            style={{
              flex: '1 1 280px', padding: '13px 16px',
              borderRadius: 8, border: '1.5px solid var(--border)',
              fontFamily: 'var(--font-body)', fontSize: '1rem',
              outline: 'none', transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--black)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '13px 28px', border: 'none', borderRadius: 8,
              backgroundColor: loading ? '#ccc' : 'var(--gold)',
              color: '#fff', fontWeight: 800, letterSpacing: '0.06em',
              textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-body)', transition: 'background 0.2s',
            }}
            onMouseEnter={e => { if (!loading) e.target.style.backgroundColor = '#a07820'; }}
            onMouseLeave={e => { if (!loading) e.target.style.backgroundColor = 'var(--gold)'; }}
          >
            {loading ? 'Checking…' : 'Track Order'}
          </button>
        </form>

        {/* Server offline message */}
        {isOffline && !order && (
          <div style={{
            padding: '20px 24px', borderRadius: 12,
            backgroundColor: '#fffbeb', border: '1px solid #fde68a',
            color: '#92400e', marginBottom: 16,
          }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 8 }}>
              ⚠️ Tracking server is temporarily unavailable
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6 }}>
              Our backend is currently offline. If you placed an order recently, it has been saved and will be processed once the server is back online.
              <br /><br />
              <strong>Your order number has been emailed to you (if email was provided).</strong>
              <br />
              Please try tracking again in a few minutes, or contact us at{' '}
              <a href="mailto:hello@ktex.com" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>
                hello@ktex.com
              </a>
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div style={{
            padding: '14px 18px', borderRadius: 10, marginBottom: 16,
            border: '1px solid #f2b8b5', background: '#fdecea',
            color: '#611a15', fontWeight: 700, fontSize: '0.95rem',
          }}>
            ❌ {error}
          </div>
        )}

        {/* Order result */}
        {order && (
          <div style={{
            border: `2px solid ${order.isLocal ? '#fde68a' : '#d1fae5'}`,
            borderRadius: 12, overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
          }}>
            {/* Status banner */}
            <div style={{
              padding: '16px 20px',
              backgroundColor: order.isLocal ? '#fffbeb' : '#ecfdf5',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: '1.5rem' }}>{order.isLocal ? '🕐' : '✅'}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#065f46' }}>
                  {order.isLocal ? 'Order Saved Locally' : 'Order Found'}
                </div>
                {order.isLocal && (
                  <div style={{ fontSize: '0.82rem', color: '#92400e' }}>
                    Will sync with server when backend is online
                  </div>
                )}
              </div>
            </div>

            {/* Order details */}
            <div style={{ padding: '16px 20px' }}>
              <Row label="Order Number" value={order.orderNumber || '—'} />
              <Row label="Tracking ID" value={order.trackingNumber || order.orderNumber || '—'} />
              <Row label="Status" value={(order.orderStatus || 'pending').toUpperCase()} accent />
              {order.fullName && <Row label="Customer" value={order.fullName} />}
              <Row
                label="Placed On"
                value={order.createdAt ? new Date(order.createdAt).toLocaleString('en-PK') : '—'}
              />
              {!order.isLocal && order.updatedAt && (
                <Row
                  label="Last Updated"
                  value={new Date(order.updatedAt).toLocaleString('en-PK')}
                />
              )}
            </div>
          </div>
        )}

        {/* Back link */}
        <div style={{ marginTop: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: 'var(--mid-gray)', textDecoration: 'underline', fontSize: '0.9rem' }}>
            ← Back to Home
          </Link>
          <Link to="/contact" style={{ color: 'var(--gold)', textDecoration: 'underline', fontSize: '0.9rem' }}>
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
}

function Row({ label, value, accent = false }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', gap: 12,
      padding: '10px 0', borderBottom: '1px dashed #eee',
    }}>
      <span style={{ color: 'var(--mid-gray)', fontWeight: 600, fontSize: '0.9rem' }}>{label}</span>
      <span style={{ fontWeight: 800, color: accent ? 'var(--gold)' : 'var(--black)', fontSize: '0.9rem' }}>{value}</span>
    </div>
  );
}

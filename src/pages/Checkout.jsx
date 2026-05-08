import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts } from '../data';

// ─── Order Number Generator ────────────────────────────────────
function generateOrderNumber() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let suffix = '';
  for (let i = 0; i < 6; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `KTX-${suffix}`;
}

// ─── Try backend, fall back gracefully ────────────────────────
async function submitOrderToBackend(payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout
  try {
    const res = await fetch('/api/orders/guest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    // 502/503/504 = gateway/server unavailable → use offline fallback
    const isGatewayError = [502, 503, 504].includes(res.status);
    if (isGatewayError) {
      return { source: 'offline', data: null };
    }

    const isJson = (res.headers.get('content-type') || '').includes('application/json');
    const data = isJson ? await res.json() : await res.text();
    if (!res.ok) {
      const msg = typeof data === 'object' && data?.message ? data.message : `Server error (${res.status})`;
      throw new Error(msg);
    }
    return { source: 'server', data };
  } catch (err) {
    clearTimeout(timeout);
    // If it's a network / SSL / timeout / fetch error — use offline fallback
    const raw = (err.message || '').toLowerCase();
    const isNetworkError =
      err.name === 'AbortError' ||
      raw.includes('ssl') ||
      raw.includes('failed to fetch') ||
      raw.includes('networkerror') ||
      raw.includes('econnrefused') ||
      raw.includes('net::') ||
      raw.includes('load failed') ||
      raw.includes('502') ||
      raw.includes('503') ||
      raw.includes('504');
    if (isNetworkError) {
      return { source: 'offline', data: null };
    }
    throw err; // re-throw real server validation errors only
  }
}


export default function Checkout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  function buildOrderItems() {
    const p = getProducts()?.[0];
    if (!p) return [];
    const pId = String(p.id);
    const validObjectId = /^[0-9a-fA-F]{24}$/.test(pId) ? pId : '5f8d04b3a4f8913b8c4c7f0b';

    return [{
      product: validObjectId,
      name: p.name,
      image: p.image,
      price: p.price,
      quantity: 1,
      size: 'M',
      color: 'Default',
    }];
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const fd = new FormData(e.currentTarget);
    const fullName = String(fd.get('fullName') || '').trim();
    const phone    = String(fd.get('phone')    || '').trim();
    const email    = String(fd.get('email')    || '').trim();
    const street   = String(fd.get('street')   || '').trim();

    if (!fullName || !phone || !street) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await submitOrderToBackend({
        email: email || undefined,
        orderItems: buildOrderItems(),
        shippingAddress: { fullName, phone, street, city: '—', province: '—', country: 'Pakistan' },
        paymentInfo: { method: 'cod', status: 'pending' },
      });

      let orderNumber, orderStatus;

      if (result.source === 'server') {
        // Backend responded successfully
        orderNumber = result.data?.data?.orderNumber || result.data?.orderNumber || generateOrderNumber();
        orderStatus = result.data?.data?.orderStatus || result.data?.orderStatus || 'pending';
      } else {
        // Offline fallback — generate local order number
        orderNumber = generateOrderNumber();
        orderStatus = 'pending';
        // Save to localStorage so admin can view later
        const saved = JSON.parse(localStorage.getItem('ktex_offline_orders') || '[]');
        saved.push({
          orderNumber,
          fullName, phone, email, street,
          items: buildOrderItems(),
          placedAt: new Date().toISOString(),
          status: 'pending',
        });
        localStorage.setItem('ktex_offline_orders', JSON.stringify(saved));
      }

      navigate('/order-success', { state: { orderNumber, orderStatus } });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '60vh', padding: 'clamp(40px, 8vw, 80px) 16px', backgroundColor: 'var(--light-gray)' }}>
      <div className="container" style={{
        maxWidth: '600px', backgroundColor: 'var(--white)',
        padding: 'clamp(24px, 5vw, 40px)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🛍️</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', color: 'var(--black)', margin: '0 0 10px 0' }}>
            Secure Checkout
          </h1>
          <p style={{ color: 'var(--mid-gray)', fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>
            Please provide your details to complete the order.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
              Full Name <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              name="fullName"
              type="text"
              required
              style={{ width: '100%', padding: '13px', border: '1.5px solid var(--border)', borderRadius: '6px', fontFamily: 'var(--font-body)', fontSize: '1rem', boxSizing: 'border-box', outline: 'none' }}
              placeholder="Abdul Wasay"
              onFocus={e => e.target.style.borderColor = 'var(--black)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Phone */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
              Phone Number <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              name="phone"
              type="tel"
              required
              style={{ width: '100%', padding: '13px', border: '1.5px solid var(--border)', borderRadius: '6px', fontFamily: 'var(--font-body)', fontSize: '1rem', boxSizing: 'border-box', outline: 'none' }}
              placeholder="0300 1234567"
              onFocus={e => e.target.style.borderColor = 'var(--black)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
              Email (optional)
            </label>
            <input
              name="email"
              type="email"
              style={{ width: '100%', padding: '13px', border: '1.5px solid var(--border)', borderRadius: '6px', fontFamily: 'var(--font-body)', fontSize: '1rem', boxSizing: 'border-box', outline: 'none' }}
              placeholder="name@example.com"
              onFocus={e => e.target.style.borderColor = 'var(--black)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Address */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
              Delivery Address <span style={{ color: 'red' }}>*</span>
            </label>
            <textarea
              name="street"
              required
              rows="3"
              style={{ width: '100%', padding: '13px', border: '1.5px solid var(--border)', borderRadius: '6px', fontFamily: 'var(--font-body)', fontSize: '1rem', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }}
              placeholder="House/Apt, Street, City"
              onFocus={e => e.target.style.borderColor = 'var(--black)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* COD Badge */}
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.5rem' }}>💵</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#15803d' }}>Cash on Delivery</div>
              <div style={{ fontSize: '0.8rem', color: '#166534' }}>Pay when your order arrives. No advance payment needed.</div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom: 16,
              border: '1px solid #f2b8b5', background: '#fdecea',
              color: '#611a15', padding: '12px 16px',
              borderRadius: 8, fontWeight: 600, fontSize: '0.9rem',
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '16px',
              backgroundColor: loading ? '#ccc' : 'var(--gold)',
              color: 'var(--white)',
              fontSize: '0.95rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              border: 'none', borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#96771e'; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = 'var(--gold)'; }}
          >
            {loading ? '⏳ Placing Order…' : 'Confirm Order (Cash on Delivery)'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/" style={{ color: 'var(--mid-gray)', textDecoration: 'underline', fontSize: '0.9rem' }}>
            Return to Home
          </Link>
        </div>
      </div>
    </main>
  );
}


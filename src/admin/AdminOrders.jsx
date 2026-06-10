import { useEffect, useMemo, useState } from 'react';
import { API_BASE, getImageUrl } from '../utils/api';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];

function getOfflineOrders() {
  try { return JSON.parse(localStorage.getItem('ktex_offline_orders') || '[]'); } catch { return []; }
}
function saveOfflineOrders(list) { localStorage.setItem('ktex_offline_orders', JSON.stringify(list)); }
function isGatewayErr(msg) {
  const r = String(msg || '').toLowerCase();
  return r.includes('502') || r.includes('503') || r.includes('504') || r.includes('failed to fetch') || r.includes('networkerror') || r.includes('load failed') || r.includes('net::');
}

function normalizeOfflineOrder(o) {
  return {
    _id: o.orderNumber, orderNumber: o.orderNumber, isLocal: true,
    createdAt: o.placedAt || new Date().toISOString(),
    shippingAddress: { fullName: o.fullName || '—', phone: o.phone || '—', street: o.street || '—' },
    guestEmail: o.email || '—',
    orderItems: (o.items || []).map(i => ({ name: i.name, quantity: i.quantity, size: i.size || 'M', image: i.image })),
    totalPrice: 'COD', orderStatus: o.status || 'pending',
    paymentScreenshot: o.paymentScreenshot || '',
    paymentMethod: o.paymentMethod || 'cod',
  };
}

export default function AdminOrders() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [savingId, setSavingId] = useState('');
  const [isOffline, setIsOffline] = useState(false);
  const [error, setError] = useState('');
  const [viewScreenshot, setViewScreenshot] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);

  const token = useMemo(() => localStorage.getItem('ktex_admin_token') || '', []);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const q = statusFilter ? `?status=${encodeURIComponent(statusFilter)}&limit=100` : '?limit=100';
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);
      const res = await fetch(`${API_BASE}/api/orders${q}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if ([502, 503, 504].includes(res.status)) throw new Error('502');
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setOrders(data?.data || []);
      setIsOffline(false);
    } catch (e) {
      if (isGatewayErr(e.message) || e.name === 'AbortError') {
        const offline = getOfflineOrders().map(normalizeOfflineOrder);
        const filtered = statusFilter ? offline.filter(o => o.orderStatus === statusFilter) : offline;
        setOrders(filtered);
        setIsOffline(true);
      } else {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [statusFilter]);

  function updateStatusOffline(orderId, status) {
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: status } : o));
    const saved = getOfflineOrders();
    const updated = saved.map(o => o.orderNumber === orderId ? { ...o, status } : o);
    saveOfflineOrders(updated);
  }

  async function updateStatus(orderId, status) {
    setSavingId(orderId);
    setError('');
    if (isOffline) {
      updateStatusOffline(orderId, status);
      setSavingId('');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if ([502, 503, 504].includes(res.status)) { updateStatusOffline(orderId, status); setIsOffline(true); return; }
      if (!res.ok) throw new Error(`Failed to update (${res.status})`);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: status } : o));
    } catch (e) {
      if (isGatewayErr(e.message)) { updateStatusOffline(orderId, status); setIsOffline(true); }
      else setError(e.message || 'Failed to update status');
    } finally {
      setSavingId('');
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 900, color: '#0D0D0D' }}>Orders</h1>
          <p style={{ margin: '8px 0 0', color: '#666', fontSize: 'clamp(12px, 2vw, 14px)' }}>{isOffline ? '⚡ Offline Mode — Showing locally saved orders' : 'All website orders. Confirm / update status from here.'}</p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {isOffline && (<span style={{ padding: '8px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: 'linear-gradient(135deg, rgba(184,151,42,0.15) 0%, rgba(184,151,42,0.05) 100%)', border: '1px solid rgba(184,151,42,0.3)', color: '#B8972A' }}>⚡ Offline</span>)}
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid #E2DDD6', background: '#fff', color: '#0D0D0D', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            <option value="">All statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={load} style={{ padding: '12px 18px', borderRadius: 12, border: '1px solid #B8972A', background: 'linear-gradient(135deg, #B8972A, #D4AF5A)', color: '#fff', fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 12, cursor: 'pointer', transition: 'all 0.3s ease' }}>🔄 Refresh</button>
        </div>
      </div>

      {error && (<div style={{ marginBottom: 16, border: '1px solid rgba(200,16,46,0.3)', background: 'rgba(200,16,46,0.08)', padding: 14, borderRadius: 12, color: '#C8102E', fontWeight: 600 }}>{error}</div>)}

      <div style={{ border: '1px solid #E2DDD6', borderRadius: 20, overflow: 'hidden', background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <div style={{ background: 'linear-gradient(180deg, #FAF8F3 0%, #F5F0E8 100%)', padding: '14px 20px', borderBottom: '1px solid #E2DDD6', color: '#666', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: 12, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span>{loading ? '⏳ Loading…' : ` ${orders.length} order${orders.length !== 1 ? 's' : ''}`}</span>
          {isOffline && <span style={{ color: '#B8972A' }}>📡 Local Data</span>}
        </div>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}><div style={{ fontSize: '3rem', marginBottom: 16 }}>⏳</div>Loading orders…</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>{isOffline ? '📦 No offline orders found. Orders placed when backend is down will appear here.' : '📭 No orders found.'}</div>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1200 }}>
              <thead>
                <tr style={{ background: '#FAF8F3' }}>
                  {['Order', 'Customer', 'Phone', 'Items', 'Total', 'Payment', 'Receipt', 'Status', 'Update', ''].map(h => <Th key={h}>{h}</Th>)}
                </tr>
              </thead>
              <tbody>
                {orders.map((o, idx) => (
                  <tr key={o._id} style={{ borderTop: '1px solid #E2DDD6', background: idx % 2 === 0 ? '#fff' : '#FAF8F3' }}>
                    <Td>
                      <div style={{ fontWeight: 900, color: o.isLocal ? '#B8972A' : '#0D0D0D', fontSize: 14 }}>{o.orderNumber || o._id}</div>
                      <div style={{ color: '#888', fontSize: 11, marginTop: 4 }}>{o.isLocal ? '⚡ Offline' : new Date(o.createdAt).toLocaleString('en-PK')}</div>
                    </Td>
                    <Td>
                      <div style={{ fontWeight: 800, color: '#0D0D0D' }}>{o.shippingAddress?.fullName || o.user?.name || '—'}</div>
                      <div style={{ color: '#888', fontSize: 12, marginTop: 2 }}>{o.user?.email || o.guestEmail || 'Guest'}</div>
                    </Td>
                    <Td>
                      <div style={{ fontWeight: 700, color: '#B8972A', fontSize: 13 }}>
                        {o.shippingAddress?.phone || '—'}
                      </div>
                    </Td>
                    <Td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {(o.orderItems || []).map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                            {getImageUrl(item.image) && <img src={getImageUrl(item.image)} alt={item.name} style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 6, border: '1px solid #E2DDD6' }} />}
                            <div style={{ fontSize: 12, color: '#555' }}>
                              <span style={{ fontWeight: 600, color: '#0D0D0D' }}>{item.name}</span>
                              <span style={{ color: '#888', marginLeft: 6 }}>×{item.quantity}</span>
                              <span style={{ color: '#B8972A', marginLeft: 6, fontWeight: 700 }}>{item.size || ''}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Td>
                    <Td style={{ fontWeight: 900, fontSize: 15, color: '#0D0D0D' }}>{typeof o.totalPrice === 'number' ? `PKR ${o.totalPrice.toLocaleString()}` : o.totalPrice}</Td>
                    <Td style={{ color: '#555', textTransform: 'capitalize' }}>{o.paymentMethod || (o.paymentInfo && o.paymentInfo.method) || 'cod'}</Td>
                    <Td>
                      {o.paymentScreenshot || o.paymentInfo?.screenshot ? (
                        <button
                          onClick={() => setViewScreenshot(o.paymentScreenshot || o.paymentInfo?.screenshot)}
                          style={{
                            padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(184,151,42,0.3)',
                            background: 'rgba(184,151,42,0.08)', color: '#B8972A',
                            fontSize: 11, fontWeight: 700, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 4,
                          }}
                        >
                          📸 View
                        </button>
                      ) : (
                        <span style={{ color: '#aaa', fontSize: 11 }}>No receipt</span>
                      )}
                    </Td>
                    <Td><Badge status={o.orderStatus} /></Td>
                    <Td>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                        <select defaultValue={o.orderStatus} onChange={e => updateStatus(o._id, e.target.value)} disabled={savingId === o._id} style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #E2DDD6', background: '#fff', color: '#0D0D0D', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {savingId === o._id && <span style={{ color: '#B8972A', fontSize: 11, fontWeight: 600 }}>Saving…</span>}
                      </div>
                    </Td>
                    <Td>
                      <button onClick={() => setViewOrder(o)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #B8972A', background: 'transparent', color: '#B8972A', fontSize: 11, fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.background = '#B8972A'; e.currentTarget.style.color = '#fff'; }} onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#B8972A'; }}>
                        👁️ Details
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {viewOrder && (
        <div onClick={() => setViewOrder(null)} style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, maxWidth: 700, width: '100%', maxHeight: '90vh', overflow: 'auto', border: '1px solid #E2DDD6', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ position: 'sticky', top: 0, background: '#fff', borderBottom: '1px solid #E2DDD6', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
              <h3 style={{ margin: 0, color: '#B8972A', fontSize: 16, fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                📋 {viewOrder.orderNumber || viewOrder._id}
              </h3>
              <button onClick={() => setViewOrder(null)} style={{ background: '#f5f5f5', border: '1px solid #E2DDD6', color: '#0D0D0D', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            <div style={{ padding: 24, display: 'grid', gap: 24 }}>
              {/* Status Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <Badge status={viewOrder.orderStatus} />
                <span style={{ color: '#888', fontSize: 12 }}>{new Date(viewOrder.createdAt).toLocaleString('en-PK')}</span>
              </div>

              {/* Customer Details */}
              <Section title="👤 Customer">
                <Row label="Name" value={viewOrder.shippingAddress?.fullName || viewOrder.user?.name || '—'} />
                <Row label="Email" value={viewOrder.user?.email || viewOrder.guestEmail || '—'} />
                <Row label="Phone" value={viewOrder.shippingAddress?.phone || '—'} />
              </Section>

              {/* Shipping Address */}
              <Section title="📍 Shipping Address">
                <Row label="Street" value={viewOrder.shippingAddress?.street || '—'} />
                <Row label="City" value={viewOrder.shippingAddress?.city || '—'} />
                <Row label="State" value={viewOrder.shippingAddress?.state || '—'} />
                <Row label="Zip Code" value={viewOrder.shippingAddress?.zipCode || viewOrder.shippingAddress?.zip || '—'} />
                <Row label="Country" value={viewOrder.shippingAddress?.country || '—'} />
              </Section>

              {/* Order Items */}
              <Section title="🛒 Items ({viewOrder.orderItems?.length || 0})">
                {(viewOrder.orderItems || []).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: idx < viewOrder.orderItems.length - 1 ? '1px solid #f0ede8' : 'none' }}>
                    {item.image && <img src={getImageUrl(item.image)} alt={item.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid #E2DDD6' }} />}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: '#0D0D0D', fontSize: 14 }}>{item.name}</div>
                      <div style={{ color: '#888', fontSize: 12, marginTop: 2 }}>
                        Size: {item.size || 'N/A'} &middot; Qty: {item.quantity} &middot; PKR {item.price || 'N/A'}
                      </div>
                    </div>
                  </div>
                ))}
              </Section>

              {/* Payment Details */}
              <Section title="💳 Payment">
                <Row label="Method" value={viewOrder.paymentMethod || (viewOrder.paymentInfo?.method) || 'cod'} />
                <Row label="Total" value={typeof viewOrder.totalPrice === 'number' ? `PKR ${viewOrder.totalPrice.toLocaleString()}` : (viewOrder.totalPrice || '—')} />
                {viewOrder.paymentScreenshot && (
                  <div style={{ marginTop: 8 }}>
                    <button onClick={() => setViewScreenshot(viewOrder.paymentScreenshot)} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(184,151,42,0.3)', background: 'rgba(184,151,42,0.08)', color: '#B8972A', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                      📸 View Receipt
                    </button>
                  </div>
                )}
              </Section>

              {/* Notes */}
              {viewOrder.notes && (
                <Section title="📝 Notes">
                  <p style={{ margin: 0, color: '#555', fontSize: 13, whiteSpace: 'pre-wrap' }}>{viewOrder.notes}</p>
                </Section>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Screenshot Modal */}
      {viewScreenshot && (
        <div
          onClick={() => setViewScreenshot(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 20, padding: 24,
              maxWidth: '90vw', maxHeight: '90vh', overflow: 'auto',
              border: '1px solid #E2DDD6',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, color: '#B8972A', fontSize: 16, fontWeight: 800 }}>📸 Payment Receipt</h3>
              <button
                onClick={() => setViewScreenshot(null)}
                style={{
                  background: '#f5f5f5', border: '1px solid #E2DDD6', color: '#0D0D0D',
                  width: 36, height: 36, borderRadius: '50%', cursor: 'pointer',
                  fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>
            <img
              src={viewScreenshot}
              alt="Payment Receipt"
              style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: 12 }}
            />
            <div style={{ marginTop: 16, display: 'flex', gap: 12, justifyContent: 'center' }}>
              <a
                href={viewScreenshot}
                download="payment-receipt.png"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '10px 20px', borderRadius: 10,
                  background: 'linear-gradient(135deg, #B8972A, #D4AF5A)',
                  color: '#fff', fontWeight: 700, fontSize: 13,
                  textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                ⬇️ Download / Open
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Th({ children }) {
  return (
    <th style={{ textAlign: 'left', padding: '14px 12px', color: '#555', fontSize: 'clamp(10px, 2vw, 11px)', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '2px solid #D4AF5A', fontWeight: 900, whiteSpace: 'nowrap' }}>
      {children}
    </th>
  );
}

function Td({ children, style }) {
  return <td style={{ padding: '14px 12px', color: '#0D0D0D', verticalAlign: 'middle', borderBottom: '1px solid #E8E3DA', ...style }}>{children}</td>;
}

function Badge({ status }) {
  const color =
    status === 'delivered' ? '#2ecc71' :
    status === 'cancelled' ? '#e74c3c' :
    status === 'confirmed' ? '#B8972A' :
    status === 'shipped' ? '#4da6ff' : '#888';
  const bg =
    status === 'delivered' ? 'rgba(46,204,113,0.1)' :
    status === 'cancelled' ? 'rgba(231,76,60,0.1)' :
    status === 'confirmed' ? 'rgba(184,151,42,0.1)' :
    status === 'shipped' ? 'rgba(77,166,255,0.1)' : 'rgba(136,136,136,0.1)';
  return (
    <span style={{ display: 'inline-flex', padding: '5px 10px', borderRadius: 999, border: `1px solid ${color}30`, background: bg, color, fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 11, whiteSpace: 'nowrap' }}>
      {status}
    </span>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h4 style={{ margin: '0 0 12px', color: '#B8972A', fontSize: 13, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{title}</h4>
      <div style={{ background: '#FAF8F3', borderRadius: 12, padding: '12px 16px', display: 'grid', gap: 8 }}>
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13 }}>
      <span style={{ color: '#888', fontWeight: 600, flexShrink: 0 }}>{label}</span>
      <span style={{ color: '#0D0D0D', fontWeight: 700, textAlign: 'right' }}>{value || '—'}</span>
    </div>
  );
}

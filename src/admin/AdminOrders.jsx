import React, { useEffect, useMemo, useState } from 'react';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];

// ─── localStorage helpers ─────────────────────────────────────
function getOfflineOrders() {
  try { return JSON.parse(localStorage.getItem('ktex_offline_orders') || '[]'); } catch { return []; }
}
function saveOfflineOrders(list) {
  localStorage.setItem('ktex_offline_orders', JSON.stringify(list));
}
function isGatewayErr(msg) {
  const r = String(msg || '').toLowerCase();
  return r.includes('502') || r.includes('503') || r.includes('504') ||
    r.includes('failed to fetch') || r.includes('networkerror') ||
    r.includes('load failed') || r.includes('net::');
}

// Convert offline order format to display format
function normalizeOfflineOrder(o) {
  return {
    _id: o.orderNumber,
    orderNumber: o.orderNumber,
    isLocal: true,
    createdAt: o.placedAt || new Date().toISOString(),
    shippingAddress: { fullName: o.fullName || '—', phone: o.phone || '—', street: o.street || '—' },
    guestEmail: o.email || '—',
    orderItems: (o.items || []).map(i => ({ name: i.name, quantity: i.quantity, size: i.size || 'M', image: i.image })),
    totalPrice: 'COD',
    orderStatus: o.status || 'pending',
  };
}

export default function AdminOrders() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [savingId, setSavingId] = useState('');
  const [isOffline, setIsOffline] = useState(false);
  const [error, setError] = useState('');

  const token = useMemo(() => localStorage.getItem('ktex_admin_token') || '', []);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const q = statusFilter ? `?status=${encodeURIComponent(statusFilter)}&limit=100` : '?limit=100';
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);
      const res = await fetch(`/api/orders${q}`, {
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
        // Use localStorage offline orders
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
    // Update in state
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: status } : o));
    // Update in localStorage
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
      const res = await fetch(`/api/orders/${orderId}/status`, {
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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 5vw, 34px)' }}>Orders</h1>
          <p style={{ margin: '6px 0 0', color: '#c9c6bf', fontSize: 'clamp(12px, 2vw, 14px)' }}>
            {isOffline ? '⚡ Offline Mode — Showing locally saved orders' : 'All website orders. Confirm / update status from here.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {isOffline && (
            <span style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
              backgroundColor: 'rgba(184,151,42,0.15)', border: '1px solid rgba(184,151,42,0.3)',
              color: '#d4af5a',
            }}>⚡ Offline Mode</span>
          )}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #2a2a2a', background: '#0d0d0d', color: '#fff', fontWeight: 700 }}
          >
            <option value="">All statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            onClick={load}
            style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #2a2a2a', background: 'rgba(184,151,42,0.18)', color: '#fff', fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 12, cursor: 'pointer' }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ marginBottom: 12, border: '1px solid #5b2a2a', background: '#1c0f10', padding: 12, borderRadius: 12, color: '#ff8a80' }}>
          {error}
        </div>
      )}

      {/* Table */}
      <div style={{ border: '1px solid #1f1f1f', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ background: '#0d0d0d', padding: '12px 16px', borderBottom: '1px solid #1f1f1f', color: '#c9c6bf', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: 12, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span>{loading ? 'Loading…' : `${orders.length} order${orders.length !== 1 ? 's' : ''}`}</span>
          {isOffline && <span style={{ color: '#d4af5a' }}>Locally saved only</span>}
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#c9c6bf' }}>⏳ Loading orders…</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#c9c6bf' }}>
            {isOffline ? '📦 No offline orders found. Orders placed when backend is down will appear here.' : 'No orders found.'}
          </div>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto', background: '#0b0b0b' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
              <thead>
                <tr style={{ background: '#0b0b0b' }}>
                  {['Order', 'Customer', 'Items', 'Total', 'Status', 'Update'].map(h => (
                    <Th key={h}>{h}</Th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id} style={{ borderTop: '1px solid #1f1f1f' }}>
                    <Td>
                      <div style={{ fontWeight: 900, color: o.isLocal ? '#d4af5a' : '#fff' }}>{o.orderNumber || o._id}</div>
                      <div style={{ color: '#c9c6bf', fontSize: 11, marginTop: 2 }}>
                        {o.isLocal ? '⚡ Offline' : new Date(o.createdAt).toLocaleString('en-PK')}
                      </div>
                      <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>{o.shippingAddress?.phone || '—'}</div>
                    </Td>
                    <Td>
                      <div style={{ fontWeight: 800 }}>{o.shippingAddress?.fullName || o.user?.name || '—'}</div>
                      <div style={{ color: '#c9c6bf', fontSize: 12 }}>{o.user?.email || o.guestEmail || 'Guest'}</div>
                    </Td>
                    <Td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {(o.orderItems || []).map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                            {item.image && <img src={item.image} alt={item.name} style={{ width: 28, height: 28, objectFit: 'cover', borderRadius: 3 }} />}
                            <div style={{ fontSize: 11, color: '#c9c6bf' }}>
                              <span style={{ fontWeight: 600, color: '#fff' }}>{item.name}</span>
                              <span style={{ color: '#888', marginLeft: 4 }}>×{item.quantity}</span>
                              <span style={{ color: '#d4af5a', marginLeft: 4, fontWeight: 700 }}>{item.size || ''}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Td>
                    <Td style={{ fontWeight: 900 }}>{typeof o.totalPrice === 'number' ? `PKR ${o.totalPrice.toLocaleString()}` : o.totalPrice}</Td>
                    <Td><Badge status={o.orderStatus} /></Td>
                    <Td>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                        <select
                          defaultValue={o.orderStatus}
                          onChange={e => updateStatus(o._id, e.target.value)}
                          disabled={savingId === o._id}
                          style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #2a2a2a', background: '#0d0d0d', color: '#fff', fontWeight: 700, fontSize: 12 }}
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {savingId === o._id && <span style={{ color: '#c9c6bf', fontSize: 11 }}>Saving…</span>}
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Th({ children }) {
  return (
    <th style={{ textAlign: 'left', padding: '12px', color: '#c9c6bf', fontSize: 'clamp(10px, 2vw, 11px)', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid #1f1f1f', fontWeight: 900, whiteSpace: 'nowrap' }}>
      {children}
    </th>
  );
}

function Td({ children, style }) {
  return <td style={{ padding: '12px', color: '#fff', verticalAlign: 'middle', ...style }}>{children}</td>;
}

function Badge({ status }) {
  const color =
    status === 'delivered' ? '#2ecc71' :
    status === 'cancelled' ? '#e74c3c' :
    status === 'confirmed' ? 'var(--gold)' :
    status === 'shipped' ? '#4da6ff' : '#c9c6bf';
  return (
    <span style={{ display: 'inline-flex', padding: '5px 10px', borderRadius: 999, border: '1px solid #2a2a2a', background: '#0d0d0d', color, fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 11, whiteSpace: 'nowrap' }}>
      {status}
    </span>
  );
}

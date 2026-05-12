import { useEffect, useMemo, useState } from 'react';

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
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 900, background: 'linear-gradient(135deg, #fff 0%, #d4af5a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Orders</h1>
          <p style={{ margin: '8px 0 0', color: '#888', fontSize: 'clamp(12px, 2vw, 14px)' }}>{isOffline ? '⚡ Offline Mode — Showing locally saved orders' : 'All website orders. Confirm / update status from here.'}</p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {isOffline && (<span style={{ padding: '8px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: 'linear-gradient(135deg, rgba(212,175,42,0.2) 0%, rgba(212,175,42,0.1) 100%)', border: '1px solid rgba(212,175,42,0.4)', color: '#d4af5a' }}>⚡ Offline</span>)}
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            <option value="">All statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={load} style={{ padding: '12px 18px', borderRadius: 12, border: '1px solid rgba(212,175,42,0.4)', background: 'linear-gradient(135deg, rgba(212,175,42,0.2) 0%, rgba(212,175,42,0.1) 100%)', color: '#d4af5a', fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 12, cursor: 'pointer', transition: 'all 0.3s ease' }}>🔄 Refresh</button>
        </div>
      </div>

      {error && (<div style={{ marginBottom: 16, border: '1px solid rgba(255,100,100,0.3)', background: 'rgba(255,100,100,0.1)', padding: 14, borderRadius: 12, color: '#ff6b6b', fontWeight: 600 }}>{error}</div>)}

      <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden', background: 'linear-gradient(180deg, rgba(15,15,15,0.9) 0%, rgba(10,10,10,0.95) 100%)', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
        <div style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #111 100%)', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#888', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: 12, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span>{loading ? '⏳ Loading…' : `📦 ${orders.length} order${orders.length !== 1 ? 's' : ''}`}</span>
          {isOffline && <span style={{ color: '#d4af5a' }}>📡 Local Data</span>}
        </div>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#666' }}><div style={{ fontSize: '3rem', marginBottom: 16 }}>⏳</div>Loading orders…</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#666' }}>{isOffline ? '📦 No offline orders found. Orders placed when backend is down will appear here.' : '📭 No orders found.'}</div>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  {['Order', 'Customer', 'Items', 'Total', 'Status', 'Update'].map(h => <Th key={h}>{h}</Th>)}
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <Td>
                      <div style={{ fontWeight: 900, color: o.isLocal ? '#d4af5a' : '#fff', fontSize: 14 }}>{o.orderNumber || o._id}</div>
                      <div style={{ color: '#666', fontSize: 11, marginTop: 4 }}>{o.isLocal ? '⚡ Offline' : new Date(o.createdAt).toLocaleString('en-PK')}</div>
                      <div style={{ fontSize: 11, color: '#555', marginTop: 4 }}>{o.shippingAddress?.phone || '—'}</div>
                    </Td>
                    <Td>
                      <div style={{ fontWeight: 800, color: '#fff' }}>{o.shippingAddress?.fullName || o.user?.name || '—'}</div>
                      <div style={{ color: '#666', fontSize: 12, marginTop: 2 }}>{o.user?.email || o.guestEmail || 'Guest'}</div>
                    </Td>
                    <Td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {(o.orderItems || []).map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                            {item.image && <img src={item.image} alt={item.name} style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)' }} />}
                            <div style={{ fontSize: 12, color: '#aaa' }}>
                              <span style={{ fontWeight: 600, color: '#fff' }}>{item.name}</span>
                              <span style={{ color: '#666', marginLeft: 6 }}>×{item.quantity}</span>
                              <span style={{ color: '#d4af5a', marginLeft: 6, fontWeight: 700 }}>{item.size || ''}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Td>
                    <Td style={{ fontWeight: 900, fontSize: 15, color: '#fff' }}>{typeof o.totalPrice === 'number' ? `PKR ${o.totalPrice.toLocaleString()}` : o.totalPrice}</Td>
                    <Td><Badge status={o.orderStatus} /></Td>
                    <Td>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                        <select defaultValue={o.orderStatus} onChange={e => updateStatus(o._id, e.target.value)} disabled={savingId === o._id} style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)', color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {savingId === o._id && <span style={{ color: '#d4af5a', fontSize: 11, fontWeight: 600 }}>Saving…</span>}
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

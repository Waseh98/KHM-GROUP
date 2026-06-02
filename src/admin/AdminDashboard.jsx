import { useEffect, useState } from 'react';
import { getProducts } from '../data';

const API_BASE = 'https://khm-group-production.up.railway.app';

function getOfflineOrders() {
  try { return JSON.parse(localStorage.getItem('ktex_offline_orders') || '[]'); } catch { return []; }
}

function isGatewayErr(msg) {
  const r = String(msg || '').toLowerCase();
  return r.includes('502') || r.includes('503') || r.includes('504') ||
    r.includes('failed to fetch') || r.includes('networkerror') ||
    r.includes('load failed') || r.includes('net::');
}

function buildLocalStats() {
  const offlineOrders = getOfflineOrders();
  const products = getProducts();
  return {
    overview: { totalOrders: offlineOrders.length, totalUsers: 0, totalRevenue: 0, avgOrderValue: 0 },
    orders: { pending: offlineOrders.filter(o => o.status === 'pending').length, delivered: 0 },
    recentOrders: offlineOrders.slice(-5).reverse().map(o => ({
      _id: o.orderNumber, orderNumber: o.orderNumber, guestEmail: o.email || 'Guest',
      totalPrice: 'COD', orderStatus: o.status || 'pending',
    })),
    productCount: products.length,
    isLocal: true,
  };
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      try {
        const token = localStorage.getItem('ktex_admin_token') || '';
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);
        const res = await fetch(`${API_BASE}/api/admin/dashboard`, { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal });
        clearTimeout(timeout);
        if ([502, 503, 504].includes(res.status)) throw new Error('502');
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const data = await res.json();
        if (alive) { setStats(data?.data || null); setIsOffline(false); }
      } catch (e) {
        if (!alive) return;
        if (isGatewayErr(e.message) || e.name === 'AbortError') { setStats(buildLocalStats()); setIsOffline(true); }
        else { setStats(buildLocalStats()); setIsOffline(true); }
      } finally { if (alive) setLoading(false); }
    }
    load();
    return () => { alive = false; };
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 900, background: 'linear-gradient(135deg, #fff 0%, #d4af5a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dashboard</h1>
          <p style={{ margin: '8px 0 0', color: '#888', fontSize: 'clamp(12px, 2vw, 14px)' }}>Overview of orders and store health.</p>
        </div>
        {isOffline && (
          <div style={{ padding: '10px 18px', borderRadius: 25, background: 'linear-gradient(135deg, rgba(212,175,42,0.2) 0%, rgba(212,175,42,0.1) 100%)', border: '1px solid rgba(212,175,42,0.4)', color: '#d4af5a', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 15px rgba(212,175,42,0.2)' }}>
            <span style={{ fontSize: 16 }}>⚡</span> Offline Mode
          </div>
        )}
      </div>

      {loading && (
        <div style={{ color: '#666', padding: '60px 0', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16, animation: 'pulse 1.5s infinite' }}>⏳</div>
          Loading dashboard...
        </div>
      )}

      {!loading && stats && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
            <Card label="Total Orders" value={stats.overview?.totalOrders ?? 0} icon="📦" color="#d4af5a" />
            <Card label="Pending" value={stats.orders?.pending ?? 0} icon="⏳" color="#f39c12" />
            <Card label="Delivered" value={stats.orders?.delivered ?? 0} icon="✅" color="#2ecc71" />
            <Card label="Products" value={stats.productCount ?? getProducts().length} icon="👕" color="#3498db" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 20 }}>
            <Panel title="📦 Recent Orders">
              {(stats.recentOrders || []).length === 0 ? (
                <div style={{ color: '#666', padding: '30px 0', textAlign: 'center' }}>{isOffline ? 'No offline orders yet.' : 'No recent orders.'}</div>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {stats.recentOrders.map((o) => (
                    <div key={o._id} className="dashboard-order-item" style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 16, display: 'flex', justifyContent: 'space-between', gap: 12, background: 'linear-gradient(135deg, rgba(20,20,20,0.8) 0%, rgba(10,10,10,0.9) 100%)', transition: 'all 0.3s ease' }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 900, letterSpacing: '0.06em', color: '#d4af5a', fontSize: 14 }}>{o.orderNumber || o._id}</div>
                        <div style={{ color: '#888', fontSize: 13, marginTop: 4 }}>{o.user?.name ? `${o.user.name}` : o.guestEmail || 'Guest'}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontWeight: 900, color: '#fff' }}>{typeof o.totalPrice === 'number' ? `PKR ${o.totalPrice.toLocaleString()}` : o.totalPrice}</div>
                        <div style={{ color: o.orderStatus === 'pending' ? '#f39c12' : '#2ecc71', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginTop: 4 }}>{o.orderStatus || 'pending'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            <Panel title="📊 Store Info">
              <div style={{ display: 'grid', gap: 12 }}>
                <StatLine label="Total Products" value={getProducts().length} icon="👕" />
                <StatLine label="Backend Status" value={isOffline ? '🔴 Offline' : '🟢 Online'} icon={isOffline ? '📡' : '🌐'} />
                <StatLine label="Order Mode" value={isOffline ? 'Local Storage' : 'Live Database'} icon="💾" />
                {!isOffline && (<><StatLine label="Total Revenue" value={`PKR ${(stats.overview?.totalRevenue || 0).toLocaleString()}`} icon="💰" /><StatLine label="Avg Order Value" value={`PKR ${(stats.overview?.avgOrderValue || 0).toLocaleString()}`} icon="📈" /></>)}
              </div>
            </Panel>
          </div>

          {isOffline && (
            <div style={{ marginTop: 24, padding: '20px 24px', borderRadius: 16, background: 'linear-gradient(135deg, rgba(212,175,42,0.1) 0%, rgba(212,175,42,0.05) 100%)', border: '1px solid rgba(212,175,42,0.2)', color: '#aaa', fontSize: 14, lineHeight: 1.7 }}>
              <strong style={{ color: '#d4af5a' }}>ℹ️ Offline Mode Active:</strong> Backend server is currently unavailable. All data shown is from your local browser storage. Products and orders placed on this device are still visible.
            </div>
          )}
        </>
      )}
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .dashboard-order-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: repeat(auto-fit"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function Card({ label, value, icon, color = '#fff' }) {
  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24, background: 'linear-gradient(135deg, rgba(20,20,20,0.9) 0%, rgba(15,15,15,0.95) 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `radial-gradient(circle, ${color}20 0%, transparent 70%)` }} />
      <div style={{ color: '#666', fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 16 }}>{icon}</span> {label}</div>
      <div style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 900, marginTop: 12, color, textShadow: `0 0 30px ${color}40` }}>{value}</div>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 20, background: 'linear-gradient(180deg, rgba(15,15,15,0.9) 0%, rgba(10,10,10,0.95) 100%)', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
      <div style={{ fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: 13, color: '#d4af5a', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid rgba(212,175,42,0.2)' }}>{title}</div>
      {children}
    </div>
  );
}
function StatLine({ label, value, icon }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 16px', background: 'rgba(255,255,255,0.02)' }}>
      <span style={{ color: '#888', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 14 }}>{icon}</span> {label}</span>
      <span style={{ fontWeight: 900, fontSize: 14, color: '#fff' }}>{value}</span>
    </div>
  );
}

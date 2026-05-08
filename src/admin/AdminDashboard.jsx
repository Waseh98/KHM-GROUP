import React, { useEffect, useState } from 'react';
import { getProducts } from '../data';

// ─── Helpers ──────────────────────────────────────────────────
function getOfflineOrders() {
  try { return JSON.parse(localStorage.getItem('ktex_offline_orders') || '[]'); } catch { return []; }
}

function isGatewayErr(msg) {
  const r = String(msg || '').toLowerCase();
  return r.includes('502') || r.includes('503') || r.includes('504') ||
    r.includes('failed to fetch') || r.includes('networkerror') ||
    r.includes('load failed') || r.includes('net::');
}

// Build local stats from localStorage
function buildLocalStats() {
  const offlineOrders = getOfflineOrders();
  const products = getProducts();
  return {
    overview: {
      totalOrders: offlineOrders.length,
      totalUsers: 0,
      totalRevenue: 0,
      avgOrderValue: 0,
    },
    orders: {
      pending: offlineOrders.filter(o => o.status === 'pending').length,
      delivered: 0,
    },
    recentOrders: offlineOrders.slice(-5).reverse().map(o => ({
      _id: o.orderNumber,
      orderNumber: o.orderNumber,
      guestEmail: o.email || 'Guest',
      totalPrice: 'COD',
      orderStatus: o.status || 'pending',
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
        const res = await fetch('/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if ([502, 503, 504].includes(res.status)) throw new Error('502');
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const data = await res.json();
        if (alive) { setStats(data?.data || null); setIsOffline(false); }
      } catch (e) {
        if (!alive) return;
        if (isGatewayErr(e.message) || e.name === 'AbortError') {
          setStats(buildLocalStats());
          setIsOffline(true);
        } else {
          setStats(buildLocalStats());
          setIsOffline(true);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 34 }}>Dashboard</h1>
          <p style={{ margin: '6px 0 0', color: '#c9c6bf' }}>Overview of orders and store health.</p>
        </div>
        {isOffline && (
          <div style={{
            padding: '8px 16px', borderRadius: 20,
            backgroundColor: 'rgba(184,151,42,0.15)',
            border: '1px solid rgba(184,151,42,0.35)',
            color: '#d4af5a', fontSize: 13, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span>⚡</span> Offline Mode — Showing Local Data
          </div>
        )}
      </div>

      {loading && (
        <div style={{ color: '#c9c6bf', padding: '40px 0', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>⏳</div>
          Loading dashboard…
        </div>
      )}

      {!loading && stats && (
        <>
          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 12 }}>
            <Card label="Total Orders" value={stats.overview?.totalOrders ?? 0} />
            <Card label="Pending" value={stats.orders?.pending ?? 0} color="#d4af5a" />
            <Card label="Delivered" value={stats.orders?.delivered ?? 0} color="#2ecc71" />
            <Card label="Products" value={stats.productCount ?? getProducts().length} color="#4da6ff" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 12, marginTop: 12 }}>
            {/* Recent Orders */}
            <Panel title={isOffline ? '📦 Recent Offline Orders' : '📦 Recent Orders'}>
              {(stats.recentOrders || []).length === 0 ? (
                <div style={{ color: '#c9c6bf', padding: '20px 0', textAlign: 'center' }}>
                  {isOffline ? 'No offline orders yet.' : 'No recent orders.'}
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 10 }}>
                  {stats.recentOrders.map((o) => (
                    <div key={o._id} style={{
                      border: '1px solid #1f1f1f', borderRadius: 12, padding: 12,
                      display: 'flex', justifyContent: 'space-between', gap: 12, background: '#0d0d0d',
                    }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 900, letterSpacing: '0.04em', color: '#d4af5a' }}>{o.orderNumber || o._id}</div>
                        <div style={{ color: '#c9c6bf', fontSize: 13, marginTop: 2 }}>
                          {o.user?.name ? `${o.user.name} (${o.user.email})` : o.guestEmail || 'Guest'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontWeight: 900 }}>{typeof o.totalPrice === 'number' ? `PKR ${o.totalPrice}` : o.totalPrice}</div>
                        <div style={{ color: '#c9c6bf', fontSize: 12, marginTop: 2 }}>{o.orderStatus || 'pending'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            {/* Info Panel */}
            <Panel title="📊 Store Info">
              <div style={{ display: 'grid', gap: 10 }}>
                <StatLine label="Total Products" value={getProducts().length} />
                <StatLine label="Backend Status" value={isOffline ? '🔴 Offline' : '🟢 Online'} />
                <StatLine label="Order Mode" value={isOffline ? 'Local Storage' : 'Live Database'} />
                {!isOffline && (
                  <>
                    <StatLine label="Total Revenue" value={`PKR ${stats.overview?.totalRevenue ?? 0}`} />
                    <StatLine label="Avg Order Value" value={`PKR ${stats.overview?.avgOrderValue ?? 0}`} />
                  </>
                )}
              </div>
            </Panel>
          </div>

          {isOffline && (
            <div style={{
              marginTop: 16, padding: '16px 20px', borderRadius: 12,
              backgroundColor: 'rgba(184,151,42,0.08)', border: '1px solid rgba(184,151,42,0.2)',
              color: '#c9c6bf', fontSize: 14, lineHeight: 1.6,
            }}>
              <strong style={{ color: '#d4af5a' }}>ℹ️ Offline Mode Active:</strong> Backend server is currently unavailable.
              All data shown is from your local browser storage.
              Products and orders placed on this device are still visible.
              Once the backend is online, full live data will be loaded automatically.
            </div>
          )}
        </>
      )}

      <style>{`
        @media (max-width: 900px) {
          div[style*="repeat(4, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
          div[style*="1.2fr 0.8fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function Card({ label, value, color = '#fff' }) {
  return (
    <div style={{ border: '1px solid #1f1f1f', borderRadius: 14, padding: 18, background: '#0d0d0d' }}>
      <div style={{ color: '#c9c6bf', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 900, marginTop: 8, color }}>{value}</div>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div style={{ border: '1px solid #1f1f1f', borderRadius: 14, padding: 16, background: '#0b0b0b' }}>
      <div style={{ fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 12, color: '#d7d4ce', marginBottom: 12 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function StatLine({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, border: '1px solid #1f1f1f', borderRadius: 10, padding: '10px 12px', background: '#0d0d0d' }}>
      <span style={{ color: '#c9c6bf', fontSize: 13 }}>{label}</span>
      <span style={{ fontWeight: 900, fontSize: 13 }}>{value}</span>
    </div>
  );
}

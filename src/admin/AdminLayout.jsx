import React, { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { clearAdminAuth, getAdminUser } from './adminAuth';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getAdminUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const navItems = useMemo(
    () => [
      { to: '/admin/dashboard', label: 'Dashboard' },
      { to: '/admin/orders', label: 'Orders' },
      { to: '/admin/products', label: 'Products' },
      { to: '/admin/categories', label: 'Categories' },
      { to: '/admin/messages', label: 'Messages' },
    ],
    []
  );

  function logout() {
    clearAdminAuth();
    navigate('/admin/login', { replace: true });
  }

  const isActive = (to) => location.pathname === to;

  return (
    <div style={{ minHeight: '100vh', background: '#0b0b0b', color: '#fff' }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          background: '#0d0d0d',
          borderBottom: '1px solid #1a1a1a',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setMobileOpen((s) => !s)}
              style={{
                display: 'none',
                padding: 8,
                borderRadius: 10,
                border: '1px solid #2a2a2a',
                color: '#fff',
              }}
              className="admin-hamburger"
              aria-label="Toggle menu"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <Link
              to="/admin/dashboard"
              style={{
                fontFamily: 'var(--font-heading)',
                letterSpacing: '0.14em',
                fontWeight: 900,
                textTransform: 'uppercase',
              }}
            >
              KHM Admin
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#c9c6bf', fontSize: 13 }}>
              {user?.name || 'Admin'} ({user?.email || ''})
            </span>
            <button
              onClick={logout}
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid #2a2a2a',
                color: '#fff',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontSize: 12,
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '260px 1fr' }}>
        <aside
          style={{
            borderRight: '1px solid #1a1a1a',
            padding: 18,
            position: 'sticky',
            top: 60,
            height: 'calc(100vh - 60px)',
            background: '#0b0b0b',
          }}
          className="admin-sidebar"
        >
          <nav style={{ display: 'grid', gap: 10 }}>
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  padding: '12px 12px',
                  borderRadius: 12,
                  border: '1px solid #1f1f1f',
                  background: isActive(item.to) ? 'rgba(184,151,42,0.18)' : 'transparent',
                  color: isActive(item.to) ? '#fff' : '#d7d4ce',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  fontSize: 12,
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main style={{ padding: 18 }}>
          <Outlet />
        </main>
      </div>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1200 }}
        />
      )}

      <style>{`
        @media (max-width: 900px) {
          .admin-hamburger { display: inline-flex !important; }
          .admin-sidebar {
            position: fixed !important;
            left: 0;
            top: 60px;
            height: calc(100vh - 60px) !important;
            width: 280px;
            transform: translateX(${mobileOpen ? '0' : '-105%'});
            transition: transform 0.25s ease;
            z-index: 1300;
            box-shadow: 10px 0 40px rgba(0,0,0,0.35);
          }
          main { padding: 14px !important; }
          div[style*="grid-template-columns: 260px 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}


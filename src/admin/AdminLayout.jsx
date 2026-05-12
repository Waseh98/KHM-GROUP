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
      { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
      { to: '/admin/orders', label: 'Orders', icon: '📦' },
      { to: '/admin/products', label: 'Products', icon: '👕' },
      { to: '/admin/categories', label: 'Categories', icon: '🏷️' },
      { to: '/admin/messages', label: 'Messages', icon: '💬' },
    ],
    []
  );

  function logout() {
    clearAdminAuth();
    navigate('/admin/login', { replace: true });
  }

  const isActive = (to) => location.pathname === to;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0d0d0d 100%)', color: '#fff' }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          background: 'linear-gradient(180deg, rgba(20,20,20,0.98) 0%, rgba(15,15,15,0.95) 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(184,151,42,0.2)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: '0 auto',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setMobileOpen((s) => !s)}
              style={{
                display: 'none',
                padding: 10,
                borderRadius: 12,
                border: '1px solid rgba(184,151,42,0.3)',
                background: 'rgba(184,151,42,0.1)',
                color: '#d4af5a',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              className="admin-hamburger"
              aria-label="Toggle menu"
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <Link
              to="/admin/dashboard"
              style={{
                fontFamily: 'var(--font-heading)',
                letterSpacing: '0.18em',
                fontWeight: 900,
                textTransform: 'uppercase',
                fontSize: 'clamp(16px, 3vw, 20px)',
                background: 'linear-gradient(135deg, #d4af5a 0%, #f0d78c 50%, #d4af5a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(212,175,90,0.3)',
              }}
            >
              KHM Admin
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="admin-user-info" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #d4af5a 0%, #a08040 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: 14,
                boxShadow: '0 2px 10px rgba(212,175,90,0.3)',
              }}>
                {(user?.name || 'Admin')[0].toUpperCase()}
              </div>
              <span style={{ color: '#c9c6bf', fontSize: 'clamp(11px, 2vw, 14px)', display: 'none', '@media (min-width: 600px)': { display: 'block' } }} className="admin-user-name">
                {user?.name || 'Admin'}
              </span>
            </div>
            <button
              onClick={logout}
              style={{
                padding: '10px 16px',
                borderRadius: 10,
                border: '1px solid rgba(255,100,100,0.3)',
                background: 'rgba(255,100,100,0.1)',
                color: '#ff6b6b',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontSize: 11,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '280px 1fr' }} className="admin-layout-grid">
        <aside
          style={{
            borderRight: '1px solid rgba(184,151,42,0.1)',
            padding: 20,
            position: 'sticky',
            top: 60,
            height: 'calc(100vh - 60px)',
            background: 'linear-gradient(180deg, rgba(15,15,15,0.8) 0%, rgba(10,10,10,0.9) 100%)',
            backdropFilter: 'blur(5px)',
          }}
          className="admin-sidebar"
        >
          <nav style={{ display: 'grid', gap: 8 }}>
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  padding: '14px 16px',
                  borderRadius: 14,
                  border: '1px solid',
                  borderColor: isActive(item.to) ? 'rgba(184,151,42,0.5)' : 'transparent',
                  background: isActive(item.to)
                    ? 'linear-gradient(135deg, rgba(184,151,42,0.2) 0%, rgba(184,151,42,0.08) 100%)'
                    : 'transparent',
                  color: isActive(item.to) ? '#fff' : '#a0a0a0',
                  fontWeight: isActive(item.to) ? 900 : 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  transition: 'all 0.3s ease',
                  boxShadow: isActive(item.to) ? '0 4px 15px rgba(184,151,42,0.2)' : 'none',
                }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main style={{ padding: 24 }}>
          <Outlet />
        </main>
      </div>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1200, backdropFilter: 'blur(4px)' }}
        />
      )}

      <style>{`
        @media (max-width: 1024px) {
          .admin-hamburger { display: inline-flex !important; }
          .admin-sidebar {
            position: fixed !important;
            left: 0;
            top: 60px;
            height: calc(100vh - 60px) !important;
            width: 280px;
            transform: translateX(${mobileOpen ? '0' : '-105%'});
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 1300;
            box-shadow: ${mobileOpen ? '20px 0 60px rgba(0,0,0,0.5)' : 'none'};
          }
          main { padding: 16px !important; }
          .admin-layout-grid { grid-template-columns: 1fr !important; }
          .admin-user-name { display: block !important; }
        }
        @media (max-width: 600px) {
          .admin-user-info { display: none !important; }
          header > div { padding: 10px 14px !important; }
          main { padding: 12px !important; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}


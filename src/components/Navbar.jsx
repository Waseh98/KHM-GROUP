import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const links = ['Men', 'Women', 'New Arrivals', 'Collections', 'Sale'];

export default function Navbar({ cartCount }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navStyle = {
    position: 'sticky', top: 0, zIndex: 999,
    backgroundColor: '#0d0d0d',
    boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.35)' : 'none',
    transition: 'box-shadow 0.3s ease',
  };

  const innerStyle = {
    maxWidth: 1280, margin: '0 auto', padding: '0 24px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: 68,
  };

  const logoStyle = {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 26, fontWeight: 700, letterSpacing: '0.12em',
    color: '#fff', cursor: 'pointer',
    userSelect: 'none',
  };

  const linkListStyle = {
    display: 'flex', gap: 32, listStyle: 'none',
    alignItems: 'center',
  };

  const linkStyle = (isSale) => ({
    fontFamily: "var(--font-body)",
    fontSize: 13, fontWeight: 500,
    letterSpacing: '0.08em', color: isSale ? 'var(--gold)' : '#e8e6e1',
    cursor: 'pointer', textTransform: 'uppercase',
    position: 'relative', padding: '4px 0',
    transition: 'color 0.2s',
  });

  const iconBtnStyle = {
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#fff', display: 'flex', alignItems: 'center',
    padding: '6px', position: 'relative',
  };

  return (
    <>
      <nav style={navStyle} role="navigation" aria-label="Main navigation">
        <div style={innerStyle}>
          {/* Logo */}
          <div style={logoStyle} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            K-TEX
          </div>

          {/* Desktop Links */}
          <ul style={{ ...linkListStyle, display: 'flex' }} className="nav-links-desktop">
            {links.map(link => {
              const toPath = link === 'Men' ? '/men' : `/#${link.toLowerCase().replace(' ', '-')}`;
              const isPage = link === 'Men';
              
              return (
                <li key={link}>
                  {isPage ? (
                    <Link to={toPath}
                       style={linkStyle(link === 'Sale')}
                       onMouseEnter={e => e.target.style.color = link === 'Sale' ? 'var(--light-gold)' : '#fff'}
                       onMouseLeave={e => e.target.style.color = link === 'Sale' ? 'var(--gold)' : '#e8e6e1'}>
                      {link}
                    </Link>
                  ) : (
                    <a href={toPath}
                       style={linkStyle(link === 'Sale')}
                       onMouseEnter={e => e.target.style.color = link === 'Sale' ? 'var(--light-gold)' : '#fff'}
                       onMouseLeave={e => e.target.style.color = link === 'Sale' ? 'var(--gold)' : '#e8e6e1'}>
                      {link}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {/* Search */}
            <button style={iconBtnStyle} aria-label="Search" onClick={() => setSearchOpen(s => !s)}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            {/* Wishlist */}
            <button style={iconBtnStyle} aria-label="Wishlist">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>

            {/* Cart */}
            <button style={{ ...iconBtnStyle, marginLeft: 4 }} aria-label={`Cart, ${cartCount} items`}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: 0, right: 0,
                  backgroundColor: 'var(--gold)', color: '#fff',
                  borderRadius: '50%', width: 17, height: 17,
                  fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  lineHeight: 1,
                }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Hamburger */}
            <button
              style={{ ...iconBtnStyle, marginLeft: 8, display: 'none' }}
              className="hamburger-btn"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div style={{
            backgroundColor: '#1a1a1a', padding: '12px 24px',
            borderTop: '1px solid #2a2a2a',
          }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
              <input
                autoFocus
                type="text"
                placeholder="Search polo shirts, collections…"
                style={{
                  width: '100%', padding: '10px 44px 10px 16px',
                  backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a',
                  borderRadius: 6, color: '#fff', fontSize: 14,
                  fontFamily: "var(--font-body)", outline: 'none',
                }}
              />
              <span style={{
                position: 'absolute', right: 14, top: '50%',
                transform: 'translateY(-50%)', color: '#6b6b6b',
              }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </span>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            backgroundColor: 'rgba(0,0,0,0.6)',
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 10000,
        width: 300, backgroundColor: '#0d0d0d',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column', padding: '0',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.4)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid #1e1e1e',
        }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '0.12em',
          }}>K-TEX</span>
          <button
            onClick={() => setMenuOpen(false)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <nav style={{ flex: 1, padding: '24px 0' }}>
          {links.map((link, i) => {
            const toPath = link === 'Men' ? '/men' : `/#${link.toLowerCase().replace(' ', '-')}`;
            const isPage = link === 'Men';
            const commonStyle = {
                 display: 'block', padding: '14px 28px',
                 fontFamily: "var(--font-body)",
                 fontSize: 15, fontWeight: 500, letterSpacing: '0.1em',
                 color: link === 'Sale' ? 'var(--gold)' : '#e8e6e1',
                 textTransform: 'uppercase',
                 borderBottom: '1px solid #1a1a1a',
                 transition: 'background 0.2s, color 0.2s',
               };
               
            return isPage ? (
              <Link key={link} to={toPath}
                 onClick={() => setMenuOpen(false)}
                 style={commonStyle}
                 onMouseEnter={e => { e.target.style.backgroundColor = '#1a1a1a'; }}
                 onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; }}
              >
                {link}
              </Link>
            ) : (
              <a key={link} href={toPath}
                 onClick={() => setMenuOpen(false)}
                 style={commonStyle}
                 onMouseEnter={e => { e.target.style.backgroundColor = '#1a1a1a'; }}
                 onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; }}
              >
                {link}
              </a>
            );
          })}
        </nav>
        <div style={{ padding: '24px 28px', borderTop: '1px solid #1e1e1e' }}>
          <p style={{ color: '#6b6b6b', fontSize: 12, letterSpacing: '0.06em' }}>
            📞 0300-1234567 | hello@ktex.com
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .nav-links-desktop { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}

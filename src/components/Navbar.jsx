import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts } from '../data';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getImageUrl } from '../utils/api';
import { useAuth } from '../context/useAuth';

const links = ['Home', 'Men', 'Women', 'Kids', 'New Arrivals', 'Collections', 'Sale'];

function getPath(link) {
  if (link === 'Home') return '/';
  if (link === 'Men') return '/men';
  if (link === 'Women') return '/women';
  if (link === 'Kids') return '/kids';
  if (link === 'New Arrivals') return '/new-arrivals';
  if (link === 'Collections') return '/collections';
  if (link === 'Sale') return '/sale';
  return `/#${link.toLowerCase().replace(' ', '-')}`;
}

/* ─── Live Search Bar Component ─────────────────────────────── */
function SearchBar({ open, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Reset query & focus when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  const results = query.trim().length > 0
    ? getProducts().filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.tag?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (product) => {
    navigate(`/product/${product.id}`);
    onClose();
    setQuery('');
  };

  if (!open) return null;

  return (
    <div style={{
      backgroundColor: '#111', borderTop: '1px solid #222',
      padding: '14px 24px 16px',
      animation: 'slideDown 0.22s ease',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        {/* Input Row */}
        <div style={{ position: 'relative' }}>
          {/* Search Icon */}
          <span style={{
            position: 'absolute', left: 14, top: '50%',
            transform: 'translateY(-50%)', color: '#888', pointerEvents: 'none',
          }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </span>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search polo shirts, collections, categories…"
            style={{
              width: '100%', padding: '11px 44px 11px 42px',
              backgroundColor: '#1c1c1c', border: '1px solid #2e2e2e',
              borderRadius: 8, color: '#f0ede8', fontSize: 14,
              fontFamily: "var(--font-body)", outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--gold)'}
            onBlur={e => e.target.style.borderColor = '#2e2e2e'}
          />

          {/* Clear button */}
          {query && (
            <button
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              style={{
                position: 'absolute', right: 12, top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: '#666',
                cursor: 'pointer', padding: 4, display: 'flex',
              }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        {/* Results Dropdown */}
        {results.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            backgroundColor: '#161616', border: '1px solid #2a2a2a',
            borderTop: 'none', borderRadius: '0 0 10px 10px',
            zIndex: 9999, overflow: 'hidden',
            boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
            animation: 'fadeIn 0.15s ease',
          }}>
            {results.slice(0, 5).map((product, i) => (
              <div
                key={product.id}
                onClick={() => handleSelect(product)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '10px 16px',
                  borderBottom: i < Math.min(results.length, 5) - 1 ? '1px solid #1e1e1e' : 'none',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1f1f1f'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {/* Product Thumbnail */}
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  style={{
                    width: 46, height: 46, objectFit: 'cover',
                    borderRadius: 6, flexShrink: 0,
                    border: '1px solid #2a2a2a',
                  }}
                />
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    color: '#e8e6e1', fontSize: 13, fontWeight: 500,
                    fontFamily: "var(--font-body)",
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {product.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                    <span style={{ color: 'var(--gold)', fontSize: 12, fontWeight: 600 }}>
                      Rs. {product.price.toLocaleString()}
                    </span>
                    <span style={{
                      fontSize: 11, color: '#555', backgroundColor: '#1e1e1e',
                      padding: '1px 7px', borderRadius: 4, letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}>
                      {product.tag}
                    </span>
                  </div>
                </div>
                {/* Arrow */}
                <svg width="14" height="14" fill="none" stroke="#444" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            ))}

            {/* Footer hint */}
            <div style={{
              padding: '8px 16px',
              backgroundColor: '#0f0f0f',
              borderTop: '1px solid #1e1e1e',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ color: '#555', fontSize: 11, fontFamily: "var(--font-body)" }}>
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </span>
              <span style={{ color: '#444', fontSize: 11 }}>Press ESC to close</span>
            </div>
          </div>
        )}

        {/* No Results */}
        {query.trim().length > 1 && results.length === 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            backgroundColor: '#161616', border: '1px solid #2a2a2a',
            borderTop: 'none', borderRadius: '0 0 10px 10px',
            padding: '20px', textAlign: 'center',
            boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
          }}>
            <div style={{ color: '#555', fontSize: 13, fontFamily: "var(--font-body)" }}>
              No products found for <span style={{ color: 'var(--gold)' }}>"{query}"</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ─── Main Navbar ─────────────────────────────────────────────── */
export default function Navbar() {
  const { totalItems, setDrawerOpen } = useCart();
  const { totalItems: wishlistCount, setWishlistOpen } = useWishlist();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');

  const mobileSearchResults = mobileSearchQuery.trim().length > 0
    ? getProducts().filter(p =>
        p.name.toLowerCase().includes(mobileSearchQuery.toLowerCase()) ||
        p.tag?.toLowerCase().includes(mobileSearchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setSearchOpen(false); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

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
    fontFamily: "'Playfair Display', serif",
    fontSize: 26, fontWeight: 700, letterSpacing: '0.08em',
    color: '#fff', cursor: 'pointer', userSelect: 'none',
  };

  const linkListStyle = {
    display: 'flex', gap: 32, listStyle: 'none', alignItems: 'center',
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
    transition: 'color 0.2s',
  };

  return (
    <>
      <nav style={navStyle} role="navigation" aria-label="Main navigation">
        <div style={innerStyle}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none' }} aria-label="K-TEX Home">
            <div style={logoStyle}>
              K-TEX
            </div>
          </Link>

          {/* Desktop Links */}
          <ul className="nav-links-desktop" style={linkListStyle}>
            {links.map(link => {
              const toPath = getPath(link);
              const isPage = link === 'Home' || link === 'Men' || link === 'Women' || link === 'Kids' || link === 'New Arrivals' || link === 'Collections' || link === 'Sale';
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
            {/* User Account */}
            <Link to={user ? '/dashboard' : '/login'}
              style={{
                ...iconBtnStyle,
                textDecoration: 'none',
              }}
              aria-label={user ? 'My Account' : 'Sign In'}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>

            {/* Search Toggle — icon becomes X when open */}
            <button
              style={{ ...iconBtnStyle, color: searchOpen ? 'var(--gold)' : '#fff' }}
              aria-label={searchOpen ? 'Close Search' : 'Open Search'}
              onClick={() => setSearchOpen(s => !s)}
            >
              {searchOpen ? (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              )}
            </button>

            {/* Wishlist */}
            <button style={iconBtnStyle} aria-label={`Wishlist, ${wishlistCount} items`}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
              onMouseLeave={e => e.currentTarget.style.color = '#fff'}
              onClick={() => setWishlistOpen(true)}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wishlistCount > 0 && (
                <span style={{
                  position: 'absolute', top: 0, right: 0,
                  backgroundColor: 'var(--red)', color: '#fff',
                  borderRadius: '50%', width: 17, height: 17,
                  fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button style={{ ...iconBtnStyle, marginLeft: 4 }} aria-label={`Cart, ${totalItems} items`}
              onClick={() => setDrawerOpen(true)}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
              onMouseLeave={e => e.currentTarget.style.color = '#fff'}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute', top: 0, right: 0,
                  backgroundColor: 'var(--gold)', color: '#fff',
                  borderRadius: '50%', width: 17, height: 17,
                  fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  lineHeight: 1,
                }}>
                  {totalItems > 9 ? '9+' : totalItems}
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

        {/* Animated Search Panel */}
        <SearchBar open={searchOpen} onClose={() => setSearchOpen(false)} />
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 10000,
        width: 'min(320px, 85vw)', backgroundColor: '#0d0d0d',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column', padding: '0',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.5)',
        borderLeft: '1px solid rgba(184,151,42,0.1)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid rgba(184,151,42,0.15)',
        }}>
            <Link to="/" style={{ textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 22, fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.08em',
            }}>K-TEX</span>
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        {/* Mobile search bar */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#666', pointerEvents: 'none', display: 'flex' }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
            <input
              type="text"
              value={mobileSearchQuery}
              onChange={e => setMobileSearchQuery(e.target.value)}
              placeholder="Search products..."
              style={{
                width: '100%', padding: '8px 12px 8px 30px',
                backgroundColor: '#161616', border: '1px solid #2e2e2e',
                borderRadius: '6px', color: '#fff', fontSize: '0.85rem',
                fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box'
              }}
            />
            {mobileSearchQuery && (
              <button
                onClick={() => setMobileSearchQuery('')}
                style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', color: '#888', cursor: 'pointer', padding: 2, display: 'flex' }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Results in Drawer */}
          {mobileSearchResults.length > 0 && (
            <div style={{
              marginTop: '10px', backgroundColor: '#161616', borderRadius: '6px',
              border: '1px solid #2a2a2a', overflow: 'hidden', maxHeight: '180px', overflowY: 'auto'
            }}>
              {mobileSearchResults.slice(0, 4).map(product => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  onClick={() => { setMenuOpen(false); setMobileSearchQuery(''); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                    borderBottom: '1px solid #222', textDecoration: 'none'
                  }}
                >
                  <img src={getImageUrl(product.image)} alt={product.name} style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: '4px' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#fff', fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</div>
                    <div style={{ color: 'var(--gold)', fontSize: '0.72rem', fontWeight: 700 }}>Rs. {product.price.toLocaleString()}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        <nav style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
          {links.map((link) => {
            const toPath = getPath(link);
            const isPage = link === 'Home' || link === 'Men' || link === 'Women' || link === 'Kids' || link === 'New Arrivals' || link === 'Collections' || link === 'Sale';
            const commonStyle = {
              display: 'flex', alignItems: 'center', padding: '14px 28px',
              fontFamily: "var(--font-body)",
              fontSize: 14, fontWeight: 500, letterSpacing: '0.1em',
              color: link === 'Sale' ? 'var(--gold)' : '#e8e6e1',
              textTransform: 'uppercase',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              transition: 'all 0.2s',
              textDecoration: 'none',
              minHeight: '48px',
            };
            return isPage ? (
              <Link key={link} to={toPath}
                onClick={() => setMenuOpen(false)}
                style={commonStyle}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(184,151,42,0.08)'; e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.paddingLeft = '36px'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = link === 'Sale' ? 'var(--gold)' : '#e8e6e1'; e.currentTarget.style.paddingLeft = '28px'; }}
              >
                {link}
              </Link>
            ) : (
              <a key={link} href={toPath}
                onClick={() => setMenuOpen(false)}
                style={commonStyle}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(184,151,42,0.08)'; e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.paddingLeft = '36px'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = link === 'Sale' ? 'var(--gold)' : '#e8e6e1'; e.currentTarget.style.paddingLeft = '28px'; }}
              >
                {link}
              </a>
            );
          })}
        </nav>
        <div style={{ padding: '20px 28px', borderTop: '1px solid rgba(184,151,42,0.15)' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
            {['Instagram', 'Facebook', 'WhatsApp'].map(s => (
              <a key={s} href="#" style={{
                padding: '6px 14px', borderRadius: 6,
                background: 'rgba(184,151,42,0.08)', border: '1px solid rgba(184,151,42,0.15)',
                color: 'var(--gold)', fontSize: '0.72rem', fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.05em',
                textDecoration: 'none', transition: 'all 0.2s',
              }}>{s}</a>
            ))}
          </div>
          <p style={{ color: '#6b6b6b', fontSize: 11, letterSpacing: '0.06em' }}>
            0333-0557783 | abdulwasay@khm.ae
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  );
}

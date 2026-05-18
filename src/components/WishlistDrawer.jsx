import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

export default function WishlistDrawer() {
  const { items, wishlistOpen, setWishlistOpen, toggle } = useWishlist();

  if (!wishlistOpen) return null;

  return (
    <>
      <div
        onClick={() => setWishlistOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(2px)',
          animation: 'fadeIn 0.2s ease',
        }}
      />

      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(420px, 95vw)',
        backgroundColor: 'var(--white)',
        zIndex: 10001,
        display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.2)',
        animation: 'slideInRight 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid #eee',
          backgroundColor: 'var(--black)',
        }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--white)', margin: 0, fontSize: '1.5rem' }}>
              My Wishlist
            </h2>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginTop: 2 }}>
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            onClick={() => setWishlistOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--white)', cursor: 'pointer', padding: 8 }}
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
              <svg width="56" height="56" fill="none" stroke="#ccc" strokeWidth="1.5" viewBox="0 0 24 24" style={{ marginBottom: 16 }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <p style={{ color: 'var(--mid-gray)', fontSize: '1rem', marginBottom: 8 }}>Your wishlist is empty</p>
              <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: 24 }}>Tap the heart icon on any product to save it here.</p>
              <button
                onClick={() => setWishlistOpen(false)}
                style={{
                  padding: '12px 28px',
                  backgroundColor: 'var(--black)',
                  color: 'var(--white)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderRadius: 4,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} style={{
                display: 'flex', gap: 14, padding: '16px 24px',
                borderBottom: '1px solid #f5f3ef',
                alignItems: 'center',
              }}>
                <Link to={`/product/${item.id}`} onClick={() => setWishlistOpen(false)}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: 72, height: 96, objectFit: 'cover',
                      borderRadius: 6, border: '1px solid #eee',
                    }}
                  />
                </Link>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link
                    to={`/product/${item.id}`}
                    onClick={() => setWishlistOpen(false)}
                    style={{ textDecoration: 'none' }}
                  >
                    <h4 style={{
                      fontFamily: 'var(--font-heading)', fontSize: '1.05rem',
                      fontWeight: 600, color: 'var(--black)', margin: '0 0 4px',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      transition: 'color 0.2s',
                    }}
                      onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                      onMouseLeave={e => e.target.style.color = 'var(--black)'}
                    >{item.name}</h4>
                  </Link>
                  <div style={{
                    fontWeight: 700, fontSize: '1rem', color: 'var(--gold)',
                    marginBottom: 8,
                  }}>
                    Rs. {item.price?.toLocaleString()}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link
                      to={`/product/${item.id}`}
                      onClick={() => setWishlistOpen(false)}
                      style={{
                        padding: '6px 14px',
                        backgroundColor: 'var(--black)',
                        color: 'var(--white)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        borderRadius: 4,
                        border: 'none',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={e => e.target.style.backgroundColor = 'var(--gold)'}
                      onMouseLeave={e => e.target.style.backgroundColor = 'var(--black)'}
                    >
                      View Item
                    </Link>
                    <button
                      onClick={() => toggle(item)}
                      style={{
                        padding: '6px 14px',
                        backgroundColor: 'transparent',
                        color: 'var(--red)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: '1px solid var(--red)',
                        borderRadius: 4,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { e.target.style.backgroundColor = 'var(--red)'; e.target.style.color = '#fff'; }}
                      onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = 'var(--red)'; }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            borderTop: '1px solid #eee', padding: '16px 24px',
          }}>
            <button
              onClick={() => {
                setWishlistOpen(false);
              }}
              style={{
                width: '100%', padding: '14px',
                backgroundColor: 'var(--black)',
                color: 'var(--white)',
                fontWeight: 700,
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                borderRadius: 4,
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.target.style.backgroundColor = 'var(--gold)'}
              onMouseLeave={e => e.target.style.backgroundColor = 'var(--black)'}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}

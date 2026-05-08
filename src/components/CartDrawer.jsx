import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { items, drawerOpen, setDrawerOpen, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

  if (!drawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(2px)',
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Drawer */}
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
              Your Cart
            </h2>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginTop: 2 }}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--white)', cursor: 'pointer', padding: 8 }}
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: items.length ? '0' : '40px 24px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🛍️</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: '0 0 8px' }}>Your cart is empty</h3>
              <p style={{ color: 'var(--mid-gray)', marginBottom: '24px', fontSize: '0.9rem' }}>
                Add some premium polo shirts to get started.
              </p>
              <Link
                to="/men"
                onClick={() => setDrawerOpen(false)}
                style={{
                  display: 'inline-block',
                  backgroundColor: 'var(--black)', color: 'var(--white)',
                  padding: '12px 28px', borderRadius: 6,
                  fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                }}
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <div>
              {items.map((item, index) => (
                <div key={item._key} style={{
                  display: 'flex', gap: '14px', padding: '16px 24px',
                  borderBottom: '1px solid #f0f0f0',
                  backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa',
                }}>
                  {/* Image */}
                  <Link to={`/product/${item.id}`} onClick={() => setDrawerOpen(false)}>
                    <img
                      src={item.image} alt={item.name}
                      style={{ width: 80, height: 100, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
                    />
                  </Link>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link
                      to={`/product/${item.id}`}
                      onClick={() => setDrawerOpen(false)}
                      style={{ textDecoration: 'none' }}
                    >
                      <h4 style={{
                        fontFamily: 'var(--font-heading)', fontSize: '1.1rem',
                        margin: '0 0 4px', color: 'var(--black)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                      }}>
                        {item.name}
                      </h4>
                    </Link>
                    <div style={{ fontSize: '0.8rem', color: 'var(--mid-gray)', marginBottom: 8 }}>
                      Size: <strong>{item.size}</strong>
                      {item.color && <> &nbsp;|&nbsp; Color: <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color, verticalAlign: 'middle', marginLeft: 2 }}/></>}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--black)', marginBottom: 10 }}>
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </div>

                    {/* Qty + Remove */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: 6, overflow: 'hidden' }}>
                        <button
                          onClick={() => updateQuantity(item._key, item.quantity - 1)}
                          style={{ padding: '4px 10px', fontSize: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--black)' }}
                        >−</button>
                        <span style={{ padding: '4px 10px', fontWeight: 700, fontSize: '0.9rem' }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._key, item.quantity + 1)}
                          style={{ padding: '4px 10px', fontSize: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--black)' }}
                        >+</button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._key)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                        onMouseLeave={e => e.currentTarget.style.color = '#aaa'}
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer — only if cart has items */}
        {items.length > 0 && (
          <div style={{ borderTop: '1px solid #eee', padding: '20px 24px', backgroundColor: '#fff' }}>
            {/* Subtotal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: 'var(--mid-gray)', fontSize: '0.9rem' }}>Subtotal ({totalItems} items)</span>
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Rs. {totalPrice.toLocaleString()}</span>
            </div>
            <p style={{ color: 'var(--mid-gray)', fontSize: '0.8rem', marginBottom: 16 }}>
              Shipping calculated at checkout
            </p>

            {/* Checkout Button */}
            <Link
              to="/checkout"
              onClick={() => setDrawerOpen(false)}
              style={{
                display: 'block', width: '100%', padding: '16px',
                backgroundColor: 'var(--black)', color: 'var(--white)',
                textAlign: 'center', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.05em',
                borderRadius: 8, fontSize: '0.95rem',
                transition: 'background 0.2s',
                boxSizing: 'border-box',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--gold)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--black)'}
            >
              Proceed to Checkout
            </Link>

            {/* Continue Shopping */}
            <button
              onClick={() => setDrawerOpen(false)}
              style={{
                display: 'block', width: '100%', padding: '12px',
                background: 'none', border: 'none',
                color: 'var(--mid-gray)', fontSize: '0.85rem',
                cursor: 'pointer', marginTop: 10,
                textDecoration: 'underline',
              }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}

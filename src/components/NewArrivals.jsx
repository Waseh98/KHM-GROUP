import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../data';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function NewArrivals() {
  const [activeTab, setActiveTab] = useState('All');
  const { addToCart } = useCart();
  const { toggle: toggleWishlist, isWishlisted } = useWishlist();

  const tabs = ['All', 'Men', 'Women', 'Sale'];

  const filteredProducts = getProducts().filter(p => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Sale') return p.tag === 'Sale';
    return p.tag === activeTab;
  });

  const toggleWishlistLocal = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    const btn = e.currentTarget;
    btn.style.animation = 'none';
    void btn.offsetWidth;
    btn.style.animation = 'heartPop 0.3s ease';
  };

  return (
    <section style={{
      background: 'linear-gradient(180deg, #0d0d12 0%, #151318 30%, #1a1715 60%, #0d0d12 100%)',
      padding: '100px 0',
      position: 'relative',
      overflow: 'hidden',
    }} id="new-arrivals">

      {/* Decorative Elements */}
      <div style={{
        position: 'absolute', top: '0', left: '0', right: '0',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(184,151,42,0.3), transparent)',
      }} />
      <div style={{
        position: 'absolute', top: '10%', left: '-5%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(184,151,42,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '-5%',
        width: '350px', height: '350px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(184,151,42,0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }} className="fade-up">
          <span style={{
            display: 'inline-block',
            color: 'var(--gold)',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '14px',
            padding: '6px 20px',
            background: 'rgba(184,151,42,0.08)',
            border: '1px solid rgba(184,151,42,0.15)',
            borderRadius: '20px',
          }}>
            Discover What's New
          </span>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 600,
            color: '#ffffff',
            margin: '0 0 20px 0',
            lineHeight: 1.1,
          }}>
            New Arrivals
          </h2>
          <div style={{
            width: '80px', height: '3px',
            background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
            margin: '0 auto 40px auto',
            borderRadius: '2px',
          }} />

          {/* Tabs */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            flexWrap: 'wrap',
          }}>
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  fontWeight: activeTab === tab ? 700 : 500,
                  color: activeTab === tab ? '#1a1510' : '#a89b7d',
                  background: activeTab === tab
                    ? 'linear-gradient(135deg, var(--gold), var(--light-gold))'
                    : 'rgba(184,151,42,0.06)',
                  border: activeTab === tab
                    ? '1px solid var(--gold)'
                    : '1px solid rgba(184,151,42,0.15)',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  boxShadow: activeTab === tab
                    ? '0 4px 16px rgba(184,151,42,0.3)'
                    : 'none',
                }}
                onMouseEnter={e => {
                  if (activeTab !== tab) {
                    e.currentTarget.style.background = 'rgba(184,151,42,0.12)';
                    e.currentTarget.style.color = 'var(--gold)';
                    e.currentTarget.style.borderColor = 'rgba(184,151,42,0.3)';
                  }
                }}
                onMouseLeave={e => {
                  if (activeTab !== tab) {
                    e.currentTarget.style.background = 'rgba(184,151,42,0.06)';
                    e.currentTarget.style.color = '#a89b7d';
                    e.currentTarget.style.borderColor = 'rgba(184,151,42,0.15)';
                  }
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="product-grid fade-up-1" style={{
          display: 'grid',
          gap: 'clamp(16px, 3vw, 24px)',
        }}>
          {filteredProducts.slice(0, 8).map((product, idx) => (
            <div
              key={product.id}
              className={`product-card fade-up-${(idx % 5) + 1}`}
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease, border-color 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
                e.currentTarget.style.borderColor = 'rgba(184,151,42,0.2)';
                const wb = e.currentTarget.querySelector('.wishlist-btn');
                if (wb) { wb.style.opacity = '1'; wb.style.transform = 'translateY(0)'; }
                const img = e.currentTarget.querySelector('.prod-img');
                if (img) img.style.transform = 'scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                const wb = e.currentTarget.querySelector('.wishlist-btn');
                if (wb) { wb.style.opacity = '0'; wb.style.transform = 'translateY(-10px)'; }
                const img = e.currentTarget.querySelector('.prod-img');
                if (img) img.style.transform = 'scale(1)';
              }}
            >
              {/* Image Container */}
              <Link to={`/product/${product.id}`} style={{
                position: 'relative', aspectRatio: '3/4', overflow: 'hidden',
                background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                display: 'block',
              }}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="prod-img"
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}
                />

                {/* Badge */}
                {product.badge && (
                  <div style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    background: product.badge === 'NEW'
                      ? 'linear-gradient(135deg, var(--gold), var(--light-gold))'
                      : product.badgeColor,
                    color: product.badge === 'NEW' ? '#1a1510' : '#fff',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '5px 12px',
                    borderRadius: '6px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    zIndex: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  }}>
                    {product.badge}
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  className="wishlist-btn"
                  onClick={(e) => toggleWishlistLocal(e, product)}
                  style={{
                    position: 'absolute',
                    top: '14px',
                    right: '14px',
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(10px)',
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.1)',
                    opacity: 0,
                    transform: 'translateY(-10px)',
                    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    color: isWishlisted(product.id) ? 'var(--red)' : '#fff',
                    zIndex: 2,
                  }}
                >
                  <svg width="18" height="18" fill={isWishlisted(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </Link>

              {/* Details Container */}
              <div style={{
                padding: '20px 18px',
                display: 'flex', flexDirection: 'column', flex: 1,
                background: 'transparent',
              }}>

                {/* Colors */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  {product.colors.map((c, i) => (
                    <div key={i} style={{
                      width: '14px', height: '14px', borderRadius: '50%',
                      backgroundColor: c,
                      border: '2px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    }} />
                  ))}
                  <span style={{
                    fontSize: '0.75rem', color: '#8a7d65',
                    marginLeft: '6px', fontWeight: 500,
                  }}>
                    {product.colorCount} Colors
                  </span>
                </div>

                {/* Name */}
                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    margin: '0 0 8px 0',
                    color: '#e8e0d0',
                    transition: 'color 0.2s',
                    lineHeight: 1.25,
                  }}
                    onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                    onMouseLeave={e => e.target.style.color = '#e8e0d0'}
                  >{product.name}</h3>
                </Link>

                {/* Price */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
                    Rs. {product.price.toLocaleString()}
                  </span>
                  {product.oldPrice && (
                    <span style={{
                      textDecoration: 'line-through', color: '#6a6050',
                      fontSize: '0.85rem',
                    }}>
                      Rs. {product.oldPrice.toLocaleString()}
                    </span>
                  )}
                  {product.discount && (
                    <span style={{
                      color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 800,
                      background: 'rgba(184,151,42,0.1)',
                      padding: '2px 8px', borderRadius: '4px',
                    }}>
                      -{product.discount}%
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(product, { size: 'M' })}
                  style={{
                    marginTop: 'auto',
                    width: '100%',
                    background: 'linear-gradient(135deg, rgba(184,151,42,0.1), rgba(184,151,42,0.05))',
                    color: 'var(--gold)',
                    border: '1px solid rgba(184,151,42,0.25)',
                    padding: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, var(--gold), var(--light-gold))';
                    e.currentTarget.style.color = '#1a1510';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(184,151,42,0.3)';
                    e.currentTarget.style.borderColor = 'var(--gold)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(184,151,42,0.1), rgba(184,151,42,0.05))';
                    e.currentTarget.style.color = 'var(--gold)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'rgba(184,151,42,0.25)';
                  }}
                >
                  Quick Add
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div style={{ textAlign: 'center', margin: '60px 0 20px 0' }}>
          <Link to="/collections" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            fontFamily: 'var(--font-body)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '16px 36px',
            background: 'linear-gradient(135deg, rgba(184,151,42,0.1), rgba(184,151,42,0.05))',
            border: '1.5px solid rgba(184,151,42,0.25)',
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            textDecoration: 'none',
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, var(--gold), var(--light-gold))';
              e.currentTarget.style.color = '#1a1510';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(184,151,42,0.3)';
              e.currentTarget.style.borderColor = 'var(--gold)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(184,151,42,0.1), rgba(184,151,42,0.05))';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(184,151,42,0.25)';
            }}
          >
            View All Products <span style={{ fontSize: '1.2rem' }}>&rarr;</span>
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .product-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
          .prod-img { object-fit: contain !important; }
        }
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 14px !important; }
          .prod-img { object-fit: contain !important; }
          .wishlist-btn { opacity: 1 !important; transform: translateY(0) !important; }
        }
        @media (max-width: 480px) {
          .wishlist-btn {
            opacity: 1 !important;
            transform: translateY(0) !important;
            width: 34px !important;
            height: 34px !important;
          }
          .wishlist-btn svg {
            width: 16px !important;
            height: 16px !important;
          }
          .prod-img {
            object-fit: contain !important;
            background: linear-gradient(135deg, #1a1a2e, #16213e) !important;
          }
          .product-card > a {
            aspect-ratio: auto !important;
            min-height: 280px !important;
          }
        }
      `}</style>
    </section>
  );
}

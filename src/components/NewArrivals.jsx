import React, { useState } from 'react';
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
    <section style={{ backgroundColor: 'var(--light-gray)', padding: '100px 0' }} id="new-arrivals">
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }} className="fade-up">
          <span style={{ 
            display: 'inline-block',
            color: 'var(--gold)', 
            fontSize: '0.85rem', 
            fontWeight: 700, 
            letterSpacing: '0.15em', 
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>
            Discover What's New
          </span>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 600,
            color: 'var(--white)',
            margin: '0 0 20px 0',
            lineHeight: 1.1
          }}>New Arrivals</h2>
          <div style={{ width: '60px', height: '2px', backgroundColor: 'var(--gold)', margin: '0 auto 40px auto' }}></div>

          {/* Tabs */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 'clamp(16px, 4vw, 40px)',
            flexWrap: 'wrap'
          }}>
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="category-tab"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: '1.05rem',
                  fontWeight: activeTab === tab ? 700 : 500,
                  color: activeTab === tab ? 'var(--white)' : '#a09e99',
                  position: 'relative',
                  paddingBottom: '8px',
                  transition: 'color 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                {tab}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '2px',
                  backgroundColor: 'var(--gold)',
                  transform: activeTab === tab ? 'scaleX(1)' : 'scaleX(0)',
                  transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transformOrigin: 'left center'
                }} />
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="product-grid fade-up-1" style={{
          display: 'grid',
          gap: 'clamp(16px, 3vw, 30px)',
        }}>
          {filteredProducts.slice(0, 8).map((product, idx) => (
            <div 
              key={product.id}
              className={`product-card fade-up-${(idx % 5) + 1}`}
              style={{
                backgroundColor: 'var(--white)',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                border: '1px solid #f0eee9'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.querySelector('.wishlist-btn').style.opacity = '1';
                e.currentTarget.querySelector('.wishlist-btn').style.transform = 'translateY(0)';
                e.currentTarget.querySelector('.prod-img').style.transform = 'scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.querySelector('.wishlist-btn').style.opacity = '0';
                e.currentTarget.querySelector('.wishlist-btn').style.transform = 'translateY(-10px)';
                e.currentTarget.querySelector('.prod-img').style.transform = 'scale(1)';
              }}
            >
              {/* Image Container */}
              <Link to={`/product/${product.id}`} style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', backgroundColor: '#f9f9f9', display: 'block' }}>
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="prod-img"
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                  }}
                />
                
                {/* Badge */}
                {product.badge && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    backgroundColor: product.badgeColor,
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '6px 12px',
                    borderRadius: '4px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    zIndex: 2,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
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
                    top: '16px',
                    right: '16px',
                    backgroundColor: 'var(--white)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                    opacity: 0,
                    transform: 'translateY(-10px)',
                    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    color: isWishlisted(product.id) ? 'var(--red)' : 'var(--black)',
                    zIndex: 2
                  }}
                >
                  <svg width="20" height="20" fill={isWishlisted(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </Link>

              {/* Details Container */}
              <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: 'var(--white)' }}>
                
                {/* Colors */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                  {product.colors.map((c, i) => (
                    <div key={i} style={{
                      width: '14px', height: '14px', borderRadius: '50%',
                      backgroundColor: c, border: '1px solid #ddd',
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
                    }}/>
                  ))}
                  <span style={{ fontSize: '0.8rem', color: 'var(--mid-gray)', marginLeft: '6px', fontWeight: 500 }}>
                    {product.colorCount} Colors
                  </span>
                </div>

                {/* Name */}
                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: '1.35rem',
                    fontWeight: 600,
                    margin: '0 0 8px 0',
                    color: 'var(--black)',
                    transition: 'color 0.2s',
                    lineHeight: 1.2
                  }}
                  onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                  onMouseLeave={e => e.target.style.color = 'var(--black)'}
                  >{product.name}</h3>
                </Link>

                {/* Price */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.15rem' }}>Rs. {product.price.toLocaleString()}</span>
                  {product.oldPrice && (
                    <span style={{ textDecoration: 'line-through', color: 'var(--mid-gray)', fontSize: '0.9rem' }}>
                      Rs. {product.oldPrice.toLocaleString()}
                    </span>
                  )}
                  {product.discount && (
                    <span style={{ color: 'var(--red)', fontSize: '0.85rem', fontWeight: 800 }}>
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
                    backgroundColor: 'transparent',
                    color: 'var(--black)',
                    border: '2px solid var(--black)',
                    padding: '14px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    borderRadius: '6px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--black)';
                    e.target.style.color = 'var(--white)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = 'var(--black)';
                  }}
                >
                  Quick Add
                </button>

              </div>
            </div>
          ))}
        </div>
        
        {/* View All Link */}
        <div style={{ textAlign: 'center', margin: '50px 0 20px 0' }}>
          <Link to="/collections" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: "var(--font-body)",
            color: 'var(--white)',
            fontWeight: 700,
            fontSize: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            paddingBottom: '4px',
            borderBottom: '2px solid var(--white)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--gold)';
            e.currentTarget.style.borderColor = 'var(--gold)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--white)';
            e.currentTarget.style.borderColor = 'var(--white)';
          }}
          >
            View All Products &rarr;
          </Link>
        </div>

      </div>

      <style>{`
        /* Responsive Grid */
        .product-grid {
          grid-template-columns: repeat(4, 1fr);
        }
        
        @media (max-width: 1024px) {
          .product-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 20px !important; }
        }
        @media (max-width: 480px) {
          .product-grid { gap: 12px !important; }
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
        }
        
        /* Category Tab Hover */
        .category-tab:hover {
          color: var(--white) !important;
        }
      `}</style>
    </section>
  );
}

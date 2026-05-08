import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data';

export default function NewArrivals({ onAddToCart }) {
  const [activeTab, setActiveTab] = useState('All');
  const [wishlist, setWishlist] = useState({});

  const tabs = ['All', 'Men', 'Women', 'Sale'];

  const filteredProducts = products.filter(p => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Sale') return p.tag === 'Sale';
    return p.tag === activeTab;
  });

  const toggleWishlist = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(prev => ({...prev, [id]: !prev[id]}));
    
    // Add pop animation effect
    const btn = e.currentTarget;
    btn.style.animation = 'none';
    void btn.offsetWidth; // trigger reflow
    btn.style.animation = 'heartPop 0.3s ease';
  };

  return (
    <section style={{ backgroundColor: 'var(--light-gray)', padding: '80px 0' }} id="new-arrivals">
      <div className="container">
        
        {/* Header Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h2 style={{
              fontFamily: "var(--font-heading)",
              fontSize: '2.5rem',
              fontWeight: 600,
              color: 'var(--black)',
              margin: '0 0 16px 0'
            }}>New Arrivals</h2>
            
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '24px' }}>
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: '1rem',
                    fontWeight: activeTab === tab ? 600 : 400,
                    color: activeTab === tab ? 'var(--black)' : 'var(--mid-gray)',
                    position: 'relative',
                    paddingBottom: '8px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if(activeTab !== tab) e.target.style.color = 'var(--black)';
                  }}
                  onMouseLeave={(e) => {
                    if(activeTab !== tab) e.target.style.color = 'var(--mid-gray)';
                  }}
                >
                  {tab}
                  {/* Underline Indicator */}
                  {activeTab === tab && (
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      backgroundColor: 'var(--gold)',
                      animation: 'fadeIn 0.3s ease'
                    }} />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <a href="#shop-all" style={{
            fontFamily: "var(--font-body)",
            color: 'var(--gold)',
            fontWeight: 500,
            textDecoration: 'underline',
            textUnderlineOffset: '4px',
            fontSize: '0.95rem'
          }}>View All &rarr;</a>
        </div>

        {/* Product Grid */}
        <div className="product-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '30px',
        }}>
          {filteredProducts.map(product => (
            <div 
              key={product.id}
              className="product-card"
              style={{
                backgroundColor: 'var(--white)',
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.querySelector('.wishlist-btn').style.opacity = '1';
                e.currentTarget.querySelector('.prod-img').style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.querySelector('.wishlist-btn').style.opacity = '0';
                e.currentTarget.querySelector('.prod-img').style.transform = 'scale(1)';
              }}
            >
              {/* Image Container */}
              <Link to={`/product/${product.id}`} style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', backgroundColor: '#eef', display: 'block' }}>
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="prod-img"
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                />
                
                {/* Badge */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: product.badgeColor,
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '4px 8px',
                  borderRadius: '2px',
                  letterSpacing: '0.05em',
                  zIndex: 2
                }}>
                  {product.badge}
                </div>

                {/* Wishlist Button */}
                <button
                  className="wishlist-btn"
                  onClick={(e) => toggleWishlist(e, product.id)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'var(--white)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)',
                    opacity: 0,
                    transition: 'opacity 0.2s, transform 0.2s',
                    color: wishlist[product.id] ? 'var(--red)' : 'var(--black)',
                    zIndex: 2
                  }}
                >
                  <svg width="18" height="18" fill={wishlist[product.id] ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </Link>

              {/* Details Container */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                
                {/* Colors */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  {product.colors.map((c, i) => (
                    <div key={i} style={{
                      width: '12px', height: '12px', borderRadius: '50%',
                      backgroundColor: c, border: '1px solid #ddd'
                    }}/>
                  ))}
                  <span style={{ fontSize: '0.75rem', color: 'var(--mid-gray)', marginLeft: '4px' }}>
                    {product.colorCount} Colors
                  </span>
                </div>

                {/* Name */}
                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    margin: '0 0 8px 0',
                    color: 'var(--black)',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={e => e.target.style.color = 'var(--red)'}
                  onMouseLeave={e => e.target.style.color = 'var(--black)'}
                  >{product.name}</h3>
                </Link>

                {/* Price */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Rs. {product.price.toLocaleString()}</span>
                  <span style={{ textDecoration: 'line-through', color: 'var(--mid-gray)', fontSize: '0.9rem' }}>
                    Rs. {product.oldPrice.toLocaleString()}
                  </span>
                  <span style={{ color: 'var(--red)', fontSize: '0.8rem', fontWeight: 600 }}>
                    -{product.discount}%
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => onAddToCart()}
                  style={{
                    marginTop: 'auto',
                    width: '100%',
                    backgroundColor: 'var(--black)',
                    color: 'var(--white)',
                    padding: '12px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderRadius: '4px',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--red)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--black)'}
                >
                  Add to Cart
                </button>

              </div>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .product-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .product-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
          .wishlist-btn { opacity: 1 !important; } /* Always show on mobile */
        }
      `}</style>
    </section>
  );
}

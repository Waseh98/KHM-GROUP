import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data';
import TrustBadges from '../components/TrustBadges';

export default function Men({ onAddToCart }) {
  const [wishlist, setWishlist] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const menProducts = products.filter(p => p.tag === 'Men' || p.name.toLowerCase().includes('men') || p.name.toLowerCase().includes('polo') && !p.tag.includes('Women'));

  const toggleWishlist = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(prev => ({...prev, [id]: !prev[id]}));
    
    const btn = e.currentTarget;
    btn.style.animation = 'none';
    void btn.offsetWidth;
    btn.style.animation = 'heartPop 0.3s ease';
  };

  return (
    <main>
      {/* Men's Banner */}
      <section style={{
        position: 'relative',
        width: '100%',
        height: '40vh',
        minHeight: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: 'var(--black)'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.6
        }} />
        <div style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          color: 'var(--white)'
        }}>
          <h1 className="fade-up" style={{
            fontFamily: "var(--font-heading)",
            fontSize: 'clamp(3rem, 5vw, 4.5rem)',
            fontWeight: 700,
            letterSpacing: '0.05em',
            margin: '0 0 16px 0'
          }}>Men's Collection</h1>
          <p className="fade-up-1" style={{
            fontFamily: "var(--font-body)",
            fontSize: '1.1rem',
            maxWidth: '500px',
            margin: '0 auto',
            color: '#e0dfdb'
          }}>
            Discover our premium range of polo shirts designed for the modern gentleman. Perfect fit, exceptional comfort.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section style={{ backgroundColor: 'var(--light-gray)', padding: '80px 0' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '16px'
          }}>
            <h2 style={{
              fontFamily: "var(--font-heading)",
              fontSize: '2rem',
              fontWeight: 600,
              color: 'var(--black)',
              margin: 0
            }}>All Men's Polos</h2>
            <span style={{ fontFamily: "var(--font-body)", color: 'var(--mid-gray)', fontSize: '0.9rem' }}>
              Showing {menProducts.length} items
            </span>
          </div>

          <div className="product-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '30px',
          }}>
            {menProducts.map(product => (
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
                  
                  {product.badge && (
                    <div style={{
                      position: 'absolute', top: '12px', left: '12px',
                      backgroundColor: product.badgeColor, color: '#fff',
                      fontSize: '0.7rem', fontWeight: 700, padding: '4px 8px',
                      borderRadius: '2px', letterSpacing: '0.05em', zIndex: 2
                    }}>{product.badge}</div>
                  )}

                  <button
                    className="wishlist-btn"
                    onClick={(e) => toggleWishlist(e, product.id)}
                    style={{
                      position: 'absolute', top: '12px', right: '12px',
                      backgroundColor: 'var(--white)', width: '32px', height: '32px',
                      borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: 'var(--shadow-sm)', opacity: 0, transition: 'opacity 0.2s, transform 0.2s',
                      color: wishlist[product.id] ? 'var(--gold)' : 'var(--black)', zIndex: 2
                    }}
                  >
                    <svg width="18" height="18" fill={wishlist[product.id] ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </Link>

                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    {product.colors.map((c, i) => (
                      <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: c, border: '1px solid #ddd' }}/>
                    ))}
                    <span style={{ fontSize: '0.75rem', color: 'var(--mid-gray)', marginLeft: '4px' }}>{product.colorCount} Colors</span>
                  </div>

                  <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ 
                      fontFamily: "var(--font-heading)", fontSize: '1.25rem', fontWeight: 600, 
                      margin: '0 0 8px 0', color: 'var(--black)', transition: 'color 0.2s'
                    }}
                    onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                    onMouseLeave={e => e.target.style.color = 'var(--black)'}
                    >{product.name}</h3>
                  </Link>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Rs. {product.price.toLocaleString()}</span>
                    <span style={{ textDecoration: 'line-through', color: 'var(--mid-gray)', fontSize: '0.9rem' }}>Rs. {product.oldPrice.toLocaleString()}</span>
                    <span style={{ color: 'var(--red)', fontSize: '0.8rem', fontWeight: 600 }}>-{product.discount}%</span>
                  </div>

                  <button
                    onClick={() => onAddToCart()}
                    style={{
                      marginTop: 'auto', width: '100%', backgroundColor: 'var(--black)', color: 'var(--white)',
                      padding: '12px', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase',
                      letterSpacing: '0.05em', borderRadius: '4px', transition: 'background-color 0.3s ease',
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
          @media (max-width: 900px) { .product-grid { grid-template-columns: repeat(3, 1fr) !important; } }
          @media (max-width: 600px) { 
            .product-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
            .wishlist-btn { opacity: 1 !important; }
          }
        `}</style>
      </section>
      
      <TrustBadges />
    </main>
  );
}

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data';
import TrustBadges from '../components/TrustBadges';

export default function Product({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === parseInt(id));
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <h2>Product not found</h2>
        <Link to="/" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>Return to Home</Link>
      </div>
    );
  }

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart();
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart();
    }
    navigate('/checkout');
  };

  return (
    <main style={{ backgroundColor: 'var(--white)' }}>
      {/* Breadcrumbs */}
      <div className="container" style={{ padding: '24px 24px 0' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--mid-gray)', fontFamily: "var(--font-body)" }}>
          <Link to="/" style={{ color: 'var(--black)' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <Link to={`/${product.tag.toLowerCase()}`} style={{ color: 'var(--black)' }}>{product.tag}</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span>{product.name}</span>
        </div>
      </div>

      <section style={{ padding: '40px 0 80px' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap' }} className="product-layout">
            
            {/* Left: Images */}
            <div style={{ flex: '1 1 500px' }} className="product-images">
              <div style={{ 
                backgroundColor: '#f4f3f0', 
                borderRadius: '12px', 
                overflow: 'hidden',
                aspectRatio: '3/4',
                position: 'relative'
              }}>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {product.badge && (
                  <div style={{
                    position: 'absolute', top: '20px', left: '20px',
                    backgroundColor: product.badgeColor, color: '#fff',
                    fontSize: '0.75rem', fontWeight: 700, padding: '6px 12px',
                    borderRadius: '2px', letterSpacing: '0.05em'
                  }}>{product.badge}</div>
                )}
              </div>
            </div>

            {/* Right: Details */}
            <div style={{ flex: '1 1 400px', padding: '20px 0' }} className="product-details">
              <h1 style={{
                fontFamily: "var(--font-heading)",
                fontSize: 'clamp(2rem, 3vw, 2.75rem)',
                fontWeight: 600,
                color: 'var(--black)',
                margin: '0 0 16px 0',
                lineHeight: 1.2
              }}>{product.name}</h1>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <span style={{ fontWeight: 600, fontSize: '1.5rem' }}>Rs. {product.price.toLocaleString()}</span>
                {product.oldPrice && (
                  <span style={{ textDecoration: 'line-through', color: 'var(--mid-gray)', fontSize: '1.1rem' }}>
                    Rs. {product.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <p style={{
                color: 'var(--mid-gray)',
                fontSize: '1rem',
                lineHeight: 1.6,
                marginBottom: '32px'
              }}>
                Crafted from premium Egyptian cotton for unmatched comfort and breathability. Featuring a tailored fit, ribbed collar, and signature reinforced stitching.
              </p>

              {/* Color Selection */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                  Color: <span style={{ color: 'var(--mid-gray)', fontWeight: 400 }}>Selected Option</span>
                </h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {product.colors.map((color, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedColor(idx)}
                      style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        backgroundColor: color,
                        border: selectedColor === idx ? '2px solid var(--black)' : '1px solid #ddd',
                        outline: selectedColor === idx ? '2px solid var(--white)' : 'none',
                        outlineOffset: '-4px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        transform: selectedColor === idx ? 'scale(1.1)' : 'scale(1)'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Size</h3>
                  <button style={{ color: 'var(--mid-gray)', fontSize: '0.85rem', textDecoration: 'underline' }}>Size Guide</button>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        width: '50px', height: '50px',
                        border: selectedSize === size ? '2px solid var(--black)' : '1px solid var(--border)',
                        backgroundColor: selectedSize === size ? 'var(--black)' : 'var(--white)',
                        color: selectedSize === size ? 'var(--white)' : 'var(--black)',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        transition: 'all 0.2s ease',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', flexWrap: 'wrap' }}>
                {/* Quantity Selector */}
                <div style={{
                  display: 'flex', alignItems: 'center', border: '1px solid var(--border)',
                  borderRadius: '4px', height: '54px'
                }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '0 20px', fontSize: '1.2rem', cursor: 'pointer' }}>-</button>
                  <span style={{ padding: '0 10px', fontWeight: 600, minWidth: '40px', textAlign: 'center' }}>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} style={{ padding: '0 20px', fontSize: '1.2rem', cursor: 'pointer' }}>+</button>
                </div>
                
                {/* Action Buttons Container */}
                <div style={{ display: 'flex', gap: '16px', flex: 1, minWidth: '300px' }}>
                  {/* Add to Cart - Outline */}
                  <button
                    onClick={handleAdd}
                    style={{
                      flex: 1, height: '54px',
                      backgroundColor: added ? 'var(--black)' : 'transparent',
                      color: added ? 'var(--white)' : 'var(--black)',
                      border: '2px solid var(--black)',
                      fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                      transition: 'all 0.3s ease', borderRadius: '4px', cursor: 'pointer'
                    }}
                    onMouseEnter={e => {
                      if (!added) {
                        e.target.style.backgroundColor = 'var(--black)';
                        e.target.style.color = 'var(--white)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!added) {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = 'var(--black)';
                      }
                    }}
                  >
                    {added ? 'Added to Cart ✓' : 'Add to Cart'}
                  </button>

                  {/* Buy Now - Solid */}
                  <button
                    onClick={handleBuyNow}
                    style={{
                      flex: 1, height: '54px',
                      backgroundColor: 'var(--gold)', color: 'var(--white)', border: '2px solid var(--red)',
                      fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                      transition: 'all 0.3s ease', borderRadius: '4px', cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(200,16,46,0.3)'
                    }}
                    onMouseEnter={e => {
                      e.target.style.backgroundColor = '#a30d25';
                      e.target.style.borderColor = '#a30d25';
                      e.target.style.boxShadow = '0 6px 20px rgba(200,16,46,0.5)';
                    }}
                    onMouseLeave={e => {
                      e.target.style.backgroundColor = 'var(--red)';
                      e.target.style.borderColor = 'var(--red)';
                      e.target.style.boxShadow = '0 4px 15px rgba(200,16,46,0.3)';
                    }}
                  >
                    Buy It Now
                  </button>
                </div>
              </div>

              {/* Accordions */}
              <div style={{ borderTop: '1px solid var(--border)' }}>
                {['details', 'shipping', 'returns'].map(tab => (
                  <div key={tab} style={{ borderBottom: '1px solid var(--border)' }}>
                    <button 
                      onClick={() => setActiveTab(activeTab === tab ? '' : tab)}
                      style={{
                        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '20px 0', fontSize: '1rem', fontWeight: 600, textTransform: 'capitalize'
                      }}
                    >
                      {tab === 'details' ? 'Product Details' : tab === 'shipping' ? 'Shipping & Delivery' : 'Returns & Exchanges'}
                      <span style={{ fontSize: '1.5rem', fontWeight: 300, color: 'var(--mid-gray)' }}>
                        {activeTab === tab ? '−' : '+'}
                      </span>
                    </button>
                    {activeTab === tab && (
                      <div style={{ paddingBottom: '20px', color: 'var(--mid-gray)', fontSize: '0.95rem', lineHeight: 1.6, animation: 'fadeIn 0.3s ease' }}>
                        {tab === 'details' && (
                          <ul style={{ paddingLeft: '20px', margin: 0 }}>
                            <li>100% Premium Combed Cotton</li>
                            <li>Classic Piqué knit texture</li>
                            <li>Two-button placket with pearlized buttons</li>
                            <li>Machine wash cold, tumble dry low</li>
                          </ul>
                        )}
                        {tab === 'shipping' && 'Free shipping on all orders over Rs. 2,000. Standard delivery takes 3-5 business days. Cash on Delivery is available across Pakistan.'}
                        {tab === 'returns' && 'We accept returns within 7 days of delivery. Items must be unworn with original tags attached. A return pickup fee may apply.'}
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      <TrustBadges />

      <style>{`
        @media (max-width: 900px) {
          .product-layout { flex-direction: column; gap: 40px !important; }
          .product-images { flex: 1 1 auto; }
          .product-details { padding-top: 0 !important; }
        }
      `}</style>
    </main>
  );
}

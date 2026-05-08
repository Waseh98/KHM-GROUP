import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProducts } from '../data';
import TrustBadges from '../components/TrustBadges';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const allProducts = getProducts();
  const product = allProducts.find(p => String(p.id) === String(id));
  const { addToCart } = useCart();
  const { toggle: toggleWishlist, isWishlisted } = useWishlist();
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [added, setAdded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const productImages = product?.images && product.images.filter(img => img !== '').length > 0 
    ? product.images.filter(img => img !== '') 
    : [product?.image];

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
  const relatedProducts = allProducts.filter(p => p.id !== product?.id && p.tag === product?.tag).slice(0, 4);

  const handleAdd = () => {
    const selectedColorValue = product.colors?.[selectedColor] || null;
    addToCart(product, { size: selectedSize, color: selectedColorValue, colorIndex: selectedColor, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    const selectedColorValue = product.colors?.[selectedColor] || null;
    addToCart(product, { size: selectedSize, color: selectedColorValue, colorIndex: selectedColor, quantity });
    navigate('/checkout');
  };

  return (
    <main style={{ backgroundColor: 'var(--white)' }}>
      {/* Breadcrumbs */}
      <div className="container" style={{ padding: '16px 24px 0' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--mid-gray)', fontFamily: 'var(--font-body)', display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'var(--black)' }}>Home</Link>
          <span style={{ margin: '0 4px' }}>/</span>
          <Link to={`/${product.tag.toLowerCase()}`} style={{ color: 'var(--black)' }}>{product.tag}</Link>
          <span style={{ margin: '0 4px' }}>/</span>
          <span style={{ color: 'var(--mid-gray)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>{product.name}</span>
        </div>
      </div>

      <section style={{ padding: '24px 0 80px' }}>
        <div className="container">
          <div className="product-layout">
            {/* Left: Images */}
            <div className="product-images">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ 
                  backgroundColor: '#f4f3f0', 
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  aspectRatio: '3/4',
                  position: 'relative'
                }}>
                  <img 
                    src={productImages[selectedImageIndex] || productImages[0]} 
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
                {/* Thumbnails */}
                {productImages.length > 1 && (
                  <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {productImages.map((img, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        style={{
                          width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden',
                          border: selectedImageIndex === idx ? '2px solid var(--black)' : '2px solid transparent',
                          cursor: 'pointer', flexShrink: 0, opacity: selectedImageIndex === idx ? 1 : 0.6,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Details */}
            <div className="product-details">
              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.8rem, 4vw, 2.75rem)',
                fontWeight: 600,
                color: 'var(--black)',
                margin: '0 0 12px 0',
                lineHeight: 1.15
              }}>{product.name}</h1>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, fontSize: 'clamp(1.3rem, 3vw, 1.5rem)' }}>Rs. {product.price.toLocaleString()}</span>
                {product.oldPrice && (
                  <span style={{ textDecoration: 'line-through', color: 'var(--mid-gray)', fontSize: '1rem' }}>
                    Rs. {product.oldPrice.toLocaleString()}
                  </span>
                )}
                {product.discount && (
                  <span style={{ backgroundColor: 'var(--red)', color: '#fff', fontSize: '0.75rem', fontWeight: 800, padding: '3px 8px', borderRadius: 4 }}>
                    -{product.discount}% OFF
                  </span>
                )}
              </div>

              <p style={{
                color: 'var(--mid-gray)',
                fontSize: '0.9rem',
                lineHeight: 1.7,
                marginBottom: '24px'
              }}>
                Crafted from premium Egyptian cotton for unmatched comfort and breathability. Featuring a tailored fit, ribbed collar, and signature reinforced stitching.
              </p>

              {/* Color Selection */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                  Color: <span style={{ color: 'var(--mid-gray)', fontWeight: 400 }}>Selected Option</span>
                </h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {product.colors.map((color, idx) => {
                    // Only show color if there's a corresponding image
                    if (!product.images || !product.images[idx]) return null;
                    
                    return (
                      <button 
                        key={idx}
                        onClick={() => {
                          setSelectedColor(idx);
                          setSelectedImageIndex(idx);
                        }}
                        title={`Select color ${idx + 1}`}
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
                    );
                  })}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                {/* Row 1: Qty + Wishlist */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {/* Quantity Selector */}
                  <div style={{
                    display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)',
                    borderRadius: '6px', height: '50px', overflow: 'hidden'
                  }}>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '0 16px', fontSize: '1.3rem', cursor: 'pointer', color: 'var(--black)', height: '100%' }}>−</button>
                    <span style={{ padding: '0 8px', fontWeight: 700, minWidth: '36px', textAlign: 'center', fontSize: '1rem' }}>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} style={{ padding: '0 16px', fontSize: '1.3rem', cursor: 'pointer', color: 'var(--black)', height: '100%' }}>+</button>
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    style={{
                      height: '50px', padding: '0 16px',
                      border: `1.5px solid ${isWishlisted(product.id) ? 'var(--red)' : 'var(--border)'}`,
                      backgroundColor: isWishlisted(product.id) ? '#fff0f2' : 'transparent',
                      color: isWishlisted(product.id) ? 'var(--red)' : 'var(--mid-gray)',
                      borderRadius: '6px', cursor: 'pointer',
                      transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: 6,
                      fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap',
                    }}
                  >
                    <svg width="16" height="16" fill={isWishlisted(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    {isWishlisted(product.id) ? 'Wishlisted' : 'Wishlist'}
                  </button>
                </div>

                {/* Row 2: Add to Cart + Buy Now */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleAdd}
                    style={{
                      flex: 1, height: '52px',
                      backgroundColor: added ? 'var(--black)' : 'transparent',
                      color: added ? 'var(--white)' : 'var(--black)',
                      border: '2px solid var(--black)',
                      fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                      transition: 'all 0.3s ease', borderRadius: '6px', cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => { if (!added) { e.currentTarget.style.backgroundColor = 'var(--black)'; e.currentTarget.style.color = 'var(--white)'; }}}
                    onMouseLeave={e => { if (!added) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--black)'; }}}
                  >
                    {added ? '✓ Added' : 'Add to Cart'}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    style={{
                      flex: 1, height: '52px',
                      backgroundColor: 'var(--gold)', color: 'var(--white)', border: '2px solid var(--gold)',
                      fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                      transition: 'all 0.3s ease', borderRadius: '6px', cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 15px rgba(184,151,42,0.3)'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--black)'; e.currentTarget.style.borderColor = 'var(--black)'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--gold)'; e.currentTarget.style.borderColor = 'var(--gold)'; }}
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
                        {tab === 'returns' && 'Exchange is available only for size or color change. The item must be unused with original tags attached, and all exchange delivery charges are paid by the customer.'}
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

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section style={{ padding: '60px 0', backgroundColor: 'var(--bg)' }}>
          <div className="container">
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              marginBottom: 24, color: 'var(--black)'
            }}>You May Also Like</h2>
            <div className="product-grid">
              {relatedProducts.map(p => (
                <Link key={p.id} to={`/product/${p.id}`} style={{
                  display: 'block', backgroundColor: 'var(--white)',
                  borderRadius: 10, overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)', textDecoration: 'none',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                >
                  <div style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
                    <img src={p.image} alt={p.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    />
                  </div>
                  <div style={{ padding: '14px' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', margin: '0 0 6px', color: 'var(--black)' }}>{p.name}</h3>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Rs. {p.price.toLocaleString()}</span>
                      <span style={{ textDecoration: 'line-through', color: 'var(--mid-gray)', fontSize: '0.8rem' }}>Rs. {p.oldPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sticky Mobile CTA */}
      <div className="mobile-sticky-cta" style={{
        display: 'none',
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999,
        backgroundColor: 'var(--white)',
        padding: '12px 16px',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.12)',
        gap: '10px',
        alignItems: 'center',
        borderTop: '1px solid var(--border)',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700 }}>{product.name}</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--gold)' }}>Rs. {product.price.toLocaleString()}</div>
        </div>
        <button
          onClick={handleAdd}
          style={{
            padding: '12px 20px', backgroundColor: added ? 'var(--black)' : 'var(--gold)',
            color: 'var(--white)', border: 'none', borderRadius: 6,
            fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em',
            cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
          }}
        >
          {added ? '✓ Added' : 'Add to Cart'}
        </button>
      </div>

      <style>{`
        /* Mobile sticky CTA */
        @media (max-width: 768px) {
          .mobile-sticky-cta { display: flex !important; }
          main { padding-bottom: 80px; }
        }
        /* Product page thumbnails on mobile */
        @media (max-width: 480px) {
          .product-images div[style*="aspectRatio"] { border-radius: 8px; }
        }
      `}</style>
    </main>
  );
}

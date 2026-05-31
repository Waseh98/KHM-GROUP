import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProducts } from '../data';
import TrustBadges from '../components/TrustBadges';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const DEFAULT_DESC = 'Crafted from premium-quality fabric for unmatched comfort and breathability. Featuring a tailored fit and signature reinforced stitching for lasting durability.';

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const allProducts = getProducts();
  const product = allProducts.find(p => String(p.id) === String(id));
  const { addToCart } = useCart();
  const { toggle: toggleWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [added, setAdded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [imageZoom, setImageZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageRef = useRef(null);

  // Reviews integration states
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');
  const [reviewErrorMsg, setReviewErrorMsg] = useState('');

  const productImages = product?.images && product.images.filter(img => img !== '').length > 0
    ? product.images.filter(img => img !== '')
    : [product?.image];

  const sizes = product?.sizes && product.sizes.length > 0
    ? product.sizes.map(s => typeof s === 'string' ? s : s.size).filter(Boolean)
    : ['S', 'M', 'L', 'XL', 'XXL'];

  const currentColorName = product?.colorNames?.[selectedColor] || 'Selected Option';
  const description = product?.description || DEFAULT_DESC;

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await fetch(`/api/reviews/${id}`);
      const data = await res.json();
      if (data.success && data.data) {
        setReviews(data.data);
      }
    } catch (e) {
      console.warn("Failed to fetch reviews:", e.message);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedImageIndex(0);
    setSelectedColor(0);
    setSelectedSize(sizes[0] || 'M');
    setQuantity(1);
    setActiveTab('details');
    setAdded(false);
    setReviewComment('');
    setReviewTitle('');
    setReviewSuccessMsg('');
    setReviewErrorMsg('');
    
    if (product) {
      document.title = `${product.name} — Premium Polo Shirts | K-TEX`;
    }

    fetchReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (submittingReview) return;
    setReviewSuccessMsg('');
    setReviewErrorMsg('');

    if (!reviewComment.trim()) {
      setReviewErrorMsg('Review comment cannot be empty.');
      return;
    }

    const reviewerEmail = user ? user.email : reviewEmail;
    const reviewerName = user ? (user.user_metadata?.full_name || user.email.split('@')[0]) : reviewName;

    if (!reviewerEmail || !reviewerName) {
      setReviewErrorMsg('Your name and email are required to submit a review.');
      return;
    }

    setSubmittingReview(true);

    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: reviewRating,
          title: reviewTitle || '',
          comment: reviewComment.trim(),
          name: reviewerName,
          email: reviewerEmail,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setReviewSuccessMsg('Thank you! Your review has been submitted successfully.');
        setReviewComment('');
        setReviewTitle('');
        setReviewName('');
        setReviewEmail('');
        fetchReviews(); // Refresh reviews list
      } else {
        setReviewErrorMsg(data.message || 'Failed to submit review.');
      }
    } catch (err) {
      setReviewErrorMsg(err.message || 'Error occurred while submitting review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const activeReviewsCount = reviews.length;
  const activeAvgRating = activeReviewsCount > 0
    ? Math.round((reviews.reduce((acc, r) => acc + r.rating, 0) / activeReviewsCount) * 10) / 10
    : (product?.ratings || 0);
  const activeReviewsDisplayCount = activeReviewsCount > 0 ? activeReviewsCount : (product?.numOfReviews || 0);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  if (!product) {
    return (
      <main style={{ padding: '120px 20px', textAlign: 'center', minHeight: '60vh', backgroundColor: 'var(--white)' }}>
        <div style={{ maxWidth: 420, margin: '0 auto' }}>
          <svg width="64" height="64" fill="none" stroke="var(--mid-gray)" strokeWidth="1.5" viewBox="0 0 24 24" style={{ marginBottom: 20 }}>
            <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
          </svg>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: 12 }}>Product Not Found</h2>
          <p style={{ color: 'var(--mid-gray)', marginBottom: 24, lineHeight: 1.6 }}>
            The product you are looking for may have been removed or is temporarily unavailable.
          </p>
          <Link to="/" style={{
            display: 'inline-block', padding: '14px 32px',
            backgroundColor: 'var(--black)', color: 'var(--white)',
            fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase',
            letterSpacing: '0.05em', borderRadius: 6, transition: 'background 0.2s',
          }}>Back to Home</Link>
        </div>
      </main>
    );
  }

  const relatedProducts = allProducts
    .filter(p => p.id !== product?.id && p.tag === product?.tag)
    .slice(0, 4);

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

  const handleImageNav = (dir) => {
    setSelectedImageIndex(prev => {
      if (dir === 'prev') return prev === 0 ? productImages.length - 1 : prev - 1;
      return prev === productImages.length - 1 ? 0 : prev + 1;
    });
  };

  const sizeChart = [
    { size: 'S',  chest: '36-38"', length: '27"', shoulder: '16.5"' },
    { size: 'M',  chest: '39-41"', length: '28"', shoulder: '17.5"' },
    { size: 'L',  chest: '42-44"', length: '29"', shoulder: '18.5"' },
    { size: 'XL', chest: '45-47"', length: '30"', shoulder: '19.5"' },
    { size: 'XXL', chest: '48-50"', length: '31"', shoulder: '20.5"' },
  ];

  const stockWarning = product.stock !== undefined && product.stock <= 5 && product.stock > 0;
  const outOfStock = product.stock !== undefined && product.stock <= 0;
  const sellingFast = product.stock !== undefined && product.stock <= 3 && product.stock > 0;

  const renderStars = (rating, count) => {
    if (!rating && !count) return null;
    const stars = Math.round(rating || 0);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ display: 'flex', gap: 2 }}>
          {[1, 2, 3, 4, 5].map(i => (
            <svg key={i} width="16" height="16" fill={i <= stars ? 'var(--gold)' : '#ddd'} viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          ))}
        </div>
        {count > 0 && <span style={{ fontSize: '0.8rem', color: 'var(--mid-gray)' }}>({count})</span>}
      </div>
    );
  };

  return (
    <main style={{ backgroundColor: 'var(--white)' }}>
      {/* Breadcrumbs */}
      <div className="container" style={{ padding: '16px 24px 0' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--mid-gray)', fontFamily: 'var(--font-body)', display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'var(--black)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--gold)'}
            onMouseLeave={e => e.target.style.color = 'var(--black)'}
          >Home</Link>
          <span style={{ margin: '0 4px' }}>/</span>
          <Link to={`/${product.tag.toLowerCase()}`} style={{ color: 'var(--black)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--gold)'}
            onMouseLeave={e => e.target.style.color = 'var(--black)'}
          >{product.tag}</Link>
          <span style={{ margin: '0 4px' }}>/</span>
          <span style={{ color: 'var(--mid-gray)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{product.name}</span>
        </div>
      </div>

      <section style={{ padding: '24px 0 80px' }}>
        <div className="container">
          <div className="product-layout">
            {/* Left: Images */}
            <div className="product-images">
              <div style={{ display: 'flex', gap: '14px' }}>
                {/* Side Thumbnails */}
                {productImages.length > 1 && (
                  <div className="thumb-sidebar" style={{
                    display: 'flex', flexDirection: 'column', gap: '10px',
                    overflowY: 'auto', maxHeight: '500px', flexShrink: 0,
                    paddingRight: '4px',
                  }}>
                    {productImages.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        style={{
                          width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden',
                          border: selectedImageIndex === idx ? '2px solid var(--gold)' : '2px solid rgba(0,0,0,0.08)',
                          cursor: 'pointer', flexShrink: 0,
                          opacity: selectedImageIndex === idx ? 1 : 0.55,
                          transition: 'all 0.2s ease',
                          boxShadow: selectedImageIndex === idx ? '0 0 0 1px var(--gold)' : 'none',
                        }}
                        onMouseEnter={e => { if (selectedImageIndex !== idx) e.currentTarget.style.opacity = '0.85'; }}
                        onMouseLeave={e => { if (selectedImageIndex !== idx) e.currentTarget.style.opacity = '0.55'; }}
                      >
                        <img src={img} alt={`${product.name} view ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Main Image */}
                <div className="main-image-wrap"
                  ref={imageRef}
                  style={{
                    backgroundColor: '#f4f3f0',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    aspectRatio: '3/4',
                    position: 'relative',
                    cursor: imageZoom ? 'zoom-out' : 'zoom-in',
                    flex: 1,
                    maxHeight: '500px',
                  }}
                  onMouseEnter={() => setImageZoom(true)}
                  onMouseLeave={() => setImageZoom(false)}
                  onMouseMove={handleMouseMove}
                >
                  <img
                    src={productImages[selectedImageIndex] || productImages[0]}
                    alt={product.name}
                    style={{
                      width: '100%', height: '100%', objectFit: 'cover',
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transform: imageZoom ? 'scale(1.8)' : 'scale(1)',
                      transition: 'transform 0.1s ease-out',
                    }}
                    draggable="false"
                  />
                  {product.badge && (
                    <div style={{
                      position: 'absolute', top: '16px', left: '16px',
                      backgroundColor: product.badgeColor, color: '#fff',
                      fontSize: '0.72rem', fontWeight: 700, padding: '5px 10px',
                      borderRadius: '4px', letterSpacing: '0.05em',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}>{product.badge}</div>
                  )}
                  {sellingFast && (
                    <div style={{
                      position: 'absolute', top: '16px', right: '16px',
                      background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                      color: '#fff', fontSize: '0.65rem', fontWeight: 800,
                      padding: '5px 10px', borderRadius: '4px',
                      letterSpacing: '0.05em', textTransform: 'uppercase',
                      boxShadow: '0 2px 12px rgba(231,76,60,0.4)',
                      animation: 'pulse 2s infinite',
                    }}>Selling Fast</div>
                  )}

                  {/* Image Nav Arrows */}
                  {productImages.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleImageNav('prev'); }}
                        aria-label="Previous image"
                        style={{
                          position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)',
                          width: '36px', height: '36px', borderRadius: '50%',
                          backgroundColor: 'rgba(255,255,255,0.9)', color: 'var(--black)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          zIndex: 3, border: 'none', cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleImageNav('next'); }}
                        aria-label="Next image"
                        style={{
                          position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)',
                          width: '36px', height: '36px', borderRadius: '50%',
                          backgroundColor: 'rgba(255,255,255,0.9)', color: 'var(--black)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          zIndex: 3, border: 'none', cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
                      </button>

                      {/* Dots indicator */}
                      <div style={{
                        position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)',
                        display: 'flex', gap: '5px', zIndex: 3,
                        background: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: '20px',
                      }}>
                        {productImages.map((_, idx) => (
                          <div key={idx} style={{
                            width: '7px', height: '7px', borderRadius: '50%',
                            backgroundColor: selectedImageIndex === idx ? 'var(--gold)' : 'rgba(255,255,255,0.5)',
                            transition: 'all 0.2s ease',
                          }} />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Out of Stock Overlay */}
                  {outOfStock && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{
                        backgroundColor: 'var(--black)', color: 'var(--white)',
                        padding: '10px 24px', fontWeight: 700, fontSize: '0.9rem',
                        textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: 4,
                      }}>Out of Stock</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Details */}
            <div className="product-details">
              {/* Brand / SKU */}
              {(product.brand || product.sku) && (
                <div style={{ display: 'flex', gap: '16px', marginBottom: '10px', fontSize: '0.75rem', color: 'var(--mid-gray)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {product.brand && <span>{product.brand}</span>}
                  {product.brand && product.sku && <span style={{ color: 'var(--border)' }}>|</span>}
                  {product.sku && <span>SKU: {product.sku}</span>}
                </div>
              )}

              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.8rem, 4vw, 2.75rem)',
                fontWeight: 600,
                color: 'var(--black)',
                margin: '0 0 10px 0',
                lineHeight: 1.15
              }}>{product.name}</h1>

              {/* Ratings */}
              {renderStars(activeAvgRating, activeReviewsDisplayCount)}

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, fontSize: 'clamp(1.3rem, 3vw, 1.5rem)', color: 'var(--gold)' }}>
                  Rs. {product.price.toLocaleString()}
                </span>
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

              {/* Description */}
              <p style={{
                color: 'var(--mid-gray)',
                fontSize: '0.92rem',
                lineHeight: 1.7,
                marginBottom: '24px'
              }}>{description}</p>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                    Color: <span style={{ color: 'var(--mid-gray)', fontWeight: 400, textTransform: 'none' }}>{currentColorName}</span>
                  </h3>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {product.colors.map((color, idx) => {
                      if (!product.images || !product.images[idx]) return null;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedColor(idx);
                            setSelectedImageIndex(idx);
                          }}
                          aria-label={`Color: ${product.colorNames?.[idx] || `option ${idx + 1}`}`}
                          style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            backgroundColor: color,
                            border: selectedColor === idx ? '2px solid var(--black)' : '1px solid #ddd',
                            outline: selectedColor === idx ? '2px solid var(--white)' : 'none',
                            outlineOffset: '-4px',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            transform: selectedColor === idx ? 'scale(1.1)' : 'scale(1)',
                            boxShadow: selectedColor === idx ? '0 0 0 2px var(--black)' : 'none',
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                    Size: <span style={{ color: 'var(--mid-gray)', fontWeight: 400 }}>{selectedSize}</span>
                  </h3>
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    style={{ color: 'var(--mid-gray)', fontSize: '0.85rem', textDecoration: 'underline', cursor: 'pointer' }}
                  >Size Guide</button>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {sizes.map(size => {
                    const sizeInfo = product.sizes?.find(s => (typeof s === 'string' ? s : s.size) === size);
                    const sizeOutOfStock = sizeInfo && typeof sizeInfo === 'object' && sizeInfo.stock !== undefined && sizeInfo.stock <= 0;
                    return (
                      <button
                        key={size}
                        onClick={() => !sizeOutOfStock && setSelectedSize(size)}
                        disabled={sizeOutOfStock}
                        style={{
                          width: '52px', height: '50px',
                          border: selectedSize === size ? '2px solid var(--black)' : '1px solid var(--border)',
                          backgroundColor: selectedSize === size ? 'var(--black)' : 'var(--white)',
                          color: selectedSize === size ? 'var(--white)' : sizeOutOfStock ? 'var(--mid-gray)' : 'var(--black)',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          transition: 'all 0.2s ease',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          borderRadius: '6px',
                          cursor: sizeOutOfStock ? 'not-allowed' : 'pointer',
                          opacity: sizeOutOfStock ? 0.4 : 1,
                          textDecoration: sizeOutOfStock ? 'line-through' : 'none',
                        }}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stock Warning */}
              {stockWarning && (
                <div style={{
                  padding: '10px 16px', backgroundColor: '#fff8e1', color: '#e67e22',
                  fontSize: '0.85rem', fontWeight: 600, borderRadius: 6,
                  marginBottom: '20px', display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                  </svg>
                  Only {product.stock} left in stock — order soon!
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                {/* Row 1: Qty + Wishlist */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)',
                    borderRadius: '6px', height: '50px', overflow: 'hidden',
                  }}>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '0 16px', fontSize: '1.3rem', cursor: 'pointer', color: 'var(--black)', height: '100%', border: 'none', backgroundColor: 'transparent' }}>−</button>
                    <span style={{ padding: '0 4px', fontWeight: 700, minWidth: '32px', textAlign: 'center', fontSize: '1rem' }}>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} style={{ padding: '0 16px', fontSize: '1.3rem', cursor: 'pointer', color: 'var(--black)', height: '100%', border: 'none', backgroundColor: 'transparent' }}>+</button>
                  </div>

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
                    disabled={outOfStock}
                    style={{
                      flex: 1, height: '52px',
                      backgroundColor: outOfStock ? 'var(--border)' : added ? 'var(--black)' : 'transparent',
                      color: outOfStock ? 'var(--mid-gray)' : added ? 'var(--white)' : 'var(--black)',
                      border: `2px solid ${outOfStock ? 'var(--border)' : 'var(--black)'}`,
                      fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                      transition: 'all 0.3s ease', borderRadius: '6px', cursor: outOfStock ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => { if (!added && !outOfStock) { e.currentTarget.style.backgroundColor = 'var(--black)'; e.currentTarget.style.color = 'var(--white)'; }}}
                    onMouseLeave={e => { if (!added && !outOfStock) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--black)'; }}}
                  >
                    {outOfStock ? 'Out of Stock' : added ? 'Added to Cart' : 'Add to Cart'}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={outOfStock}
                    style={{
                      flex: 1, height: '52px',
                      backgroundColor: outOfStock ? 'var(--border)' : 'var(--gold)',
                      color: outOfStock ? 'var(--mid-gray)' : 'var(--white)',
                      border: `2px solid ${outOfStock ? 'var(--border)' : 'var(--gold)'}`,
                      fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                      transition: 'all 0.3s ease', borderRadius: '6px', cursor: outOfStock ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap',
                      boxShadow: outOfStock ? 'none' : '0 4px 15px rgba(184,151,42,0.3)',
                    }}
                    onMouseEnter={e => { if (!outOfStock) { e.currentTarget.style.backgroundColor = 'var(--black)'; e.currentTarget.style.borderColor = 'var(--black)'; }}}
                    onMouseLeave={e => { if (!outOfStock) { e.currentTarget.style.backgroundColor = 'var(--gold)'; e.currentTarget.style.borderColor = 'var(--gold)'; }}}
                  >
                    Buy It Now
                  </button>
                </div>
              </div>

              {/* Product Meta Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', padding: '16px', backgroundColor: 'var(--bg)', borderRadius: '8px' }}>
                {product.fabric && (
                  <div style={{ display: 'flex', gap: '10px', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600, minWidth: 70 }}>Fabric:</span>
                    <span style={{ color: 'var(--mid-gray)' }}>{product.fabric}</span>
                  </div>
                )}
                {product.subCategory && (
                  <div style={{ display: 'flex', gap: '10px', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600, minWidth: 70 }}>Category:</span>
                    <span style={{ color: 'var(--mid-gray)' }}>{product.subCategory}</span>
                  </div>
                )}
                {product.stock !== undefined && product.stock > 0 && (
                  <div style={{ display: 'flex', gap: '10px', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600, minWidth: 70 }}>Availability:</span>
                    <span style={{ color: stockWarning ? '#e67e22' : '#27ae60', fontWeight: 600 }}>
                      {stockWarning ? `${product.stock} in stock` : 'In Stock'}
                    </span>
                  </div>
                )}
              </div>

              {/* Accordions */}
              <div style={{ marginTop: '8px' }}>
                {[
                  { key: 'details', icon: '📋', label: 'Product Details', color: '#B8972A', bg: 'rgba(184,151,42,0.08)', border: 'rgba(184,151,42,0.25)' },
                  { key: 'shipping', icon: '🚚', label: 'Shipping & Delivery', color: '#27ae60', bg: 'rgba(39,174,96,0.08)', border: 'rgba(39,174,96,0.25)' },
                  { key: 'returns', icon: '↩️', label: 'Returns & Exchanges', color: '#2980b9', bg: 'rgba(41,128,185,0.08)', border: 'rgba(41,128,185,0.25)' },
                  { key: 'faq', icon: '❓', label: 'FAQs', color: '#8e44ad', bg: 'rgba(142,68,173,0.08)', border: 'rgba(142,68,173,0.25)' },
                  { key: 'reviews', icon: '⭐', label: `Reviews (${activeReviewsDisplayCount})`, color: '#f39c12', bg: 'rgba(243,156,18,0.08)', border: 'rgba(243,156,18,0.25)' },
                ].map((tab) => {
                  const isOpen = activeTab === tab.key;
                  return (
                    <div key={tab.key} style={{
                      marginBottom: '10px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: isOpen ? `1px solid ${tab.border}` : '1px solid rgba(0,0,0,0.06)',
                      background: isOpen ? tab.bg : 'transparent',
                      transition: 'all 0.3s ease',
                    }}>
                      <button
                        onClick={() => setActiveTab(isOpen ? '' : tab.key)}
                        style={{
                          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '16px 18px', fontSize: '0.95rem', fontWeight: 600,
                          backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                          color: isOpen ? tab.color : 'var(--black)',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => { if (!isOpen) e.currentTarget.style.color = tab.color; }}
                        onMouseLeave={e => { if (!isOpen) e.currentTarget.style.color = 'var(--black)'; }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: isOpen ? `${tab.color}20` : 'rgba(0,0,0,0.04)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1rem', transition: 'all 0.3s ease',
                          }}>{tab.icon}</span>
                          {tab.label}
                        </span>
                        <span style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          background: isOpen ? tab.color : 'rgba(0,0,0,0.05)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: isOpen ? '#fff' : 'var(--mid-gray)',
                          transition: 'all 0.3s ease',
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}>
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                        </span>
                      </button>
                      {isOpen && (
                        <div style={{
                          padding: '0 18px 18px',
                          color: 'var(--mid-gray)', fontSize: '0.88rem', lineHeight: 1.8,
                          animation: 'fadeIn 0.3s ease',
                          borderTop: `1px solid ${tab.border}`,
                          marginTop: 0, paddingTop: '16px',
                        }}>
                          {tab.key === 'details' && (
                            <div>
                              <ul style={{ paddingLeft: '20px', margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {product.fabric && <li><span style={{ fontWeight: 600, color: 'var(--black)' }}>Fabric:</span> {product.fabric}</li>}
                                <li>Classic Piqué knit texture for premium feel and breathability</li>
                                <li>Two-button placket with pearlized buttons</li>
                                <li>Reinforced stitching for lasting durability</li>
                                {product.sku && <li style={{ color: '#aaa' }}>SKU: {product.sku}</li>}
                              </ul>

                              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--black)', marginBottom: '10px' }}>🧺 Care Instructions</div>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
                                {[
                                  { icon: '🚿', label: 'Machine Wash', detail: 'Cold wash with similar colors' },
                                  { icon: '🧴', label: 'Detergent', detail: 'Mild detergent, avoid bleach' },
                                  { icon: '🌀', label: 'Drying', detail: 'Tumble dry low or air dry' },
                                  { icon: '🔥', label: 'Ironing', detail: 'Medium heat, avoid prints' },
                                  { icon: '🚫', label: 'Do Not', detail: 'Dry clean or use fabric softener' },
                                  { icon: '☀️', label: 'Storage', detail: 'Fold neatly, avoid wire hangers' },
                                ].map(c => (
                                  <div key={c.label} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                                    <div style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{c.icon}</div>
                                    <div style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--black)', marginBottom: '2px' }}>{c.label}</div>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--mid-gray)' }}>{c.detail}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {tab.key === 'shipping' && (
                            <div>
                              <div style={{
                                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                gap: '10px', marginBottom: '16px',
                              }}>
                                {[
                                  { icon: '📦', title: 'Standard', time: '3-5 days', price: 'Free over Rs. 2,000' },
                                  { icon: '⚡', title: 'Express', time: '1-2 days', price: 'Rs. 350' },
                                  { icon: '💵', title: 'COD', time: 'Nationwide', price: 'Available' },
                                ].map(opt => (
                                  <div key={opt.title} style={{
                                    padding: '12px', borderRadius: '10px',
                                    background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)',
                                  }}>
                                    <div style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{opt.icon}</div>
                                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--black)', marginBottom: '2px' }}>{opt.title}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--mid-gray)' }}>{opt.time} — {opt.price}</div>
                                  </div>
                                ))}
                              </div>
                              <p style={{ fontSize: '0.82rem', color: '#aaa' }}>Free shipping on all orders over Rs. 2,000 across Pakistan.</p>
                            </div>
                          )}
                          {tab.key === 'returns' && (
                            <div>
                              <div style={{
                                padding: '14px 16px', borderRadius: '10px',
                                background: `${tab.color}10`, border: `1px solid ${tab.color}20`,
                                marginBottom: '14px',
                              }}>
                                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: tab.color, marginBottom: '6px' }}>
                                  Exchange Policy
                                </div>
                                <div style={{ fontSize: '0.82rem', color: 'var(--mid-gray)', lineHeight: 1.7 }}>
                                  Exchange available for size or color change only. Item must be unused with original tags attached.
                                </div>
                              </div>
                              <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
                                <li>Initiate exchange within 7 days of delivery</li>
                                <li>Item must be unworn with original tags</li>
                                <li>Exchange delivery charges apply</li>
                                <li>No cash refunds — exchange or store credit only</li>
                              </ul>
                            </div>
                          )}

                          {tab.key === 'faq' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                              {[
                                { q: 'What fabric are K-TEX polo shirts made of?', a: 'Our polos are crafted from premium-quality cotton piqué fabric, known for its breathability, durability, and structured look. Selected styles also feature a touch of elastane for a comfortable stretch.' },
                                { q: 'How do I choose the right size?', a: 'Refer to our Size Guide above for detailed chest, length, and shoulder measurements. If you are between sizes, we recommend sizing up for a relaxed fit or down for a slim fit.' },
                                { q: 'How should I wash my K-TEX polo?', a: 'Machine wash cold with similar colors, do not bleach, tumble dry low, and iron on medium heat. Avoid fabric softeners to maintain the fabric\'s piqué texture.' },
                                { q: 'Can I exchange my order?', a: 'Yes! Exchanges are accepted for size or color changes within 7 days of delivery. Item must be unused with original tags. Customer pays delivery charges for exchange.' },
                                { q: 'How long does delivery take?', a: 'Orders are processed within 24 hours. Delivery takes 1-2 days within Rawalpindi/Islamabad, 2-4 days to major cities, and 4-7 days to remote areas.' },
                                { q: 'Is Cash on Delivery available?', a: 'Yes, COD is available nationwide. You can pay in full when your order arrives.' },
                              ].map((faq, i) => (
                                <div key={i} style={{ padding: '14px 16px', borderRadius: '10px', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
                                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--black)', marginBottom: '6px' }}>{faq.q}</div>
                                  <div style={{ fontSize: '0.82rem', color: 'var(--mid-gray)', lineHeight: 1.7 }}>{faq.a}</div>
                                </div>
                              ))}
                            </div>
                          )}

                          {tab.key === 'reviews' && (
                            <div>
                              {/* Submit Review Form */}
                              <div style={{
                                padding: '20px', borderRadius: '12px',
                                background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)',
                                marginBottom: '24px',
                              }}>
                                <h4 style={{ color: 'var(--black)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '14px', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                  Write a Customer Review
                                </h4>
                                <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                  {/* Stars selection */}
                                  <div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--black)', display: 'block', marginBottom: '6px' }}>Your Rating:</span>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                      {[1, 2, 3, 4, 5].map((num) => (
                                        <button
                                          key={num}
                                          type="button"
                                          onClick={() => setReviewRating(num)}
                                          style={{ cursor: 'pointer', display: 'flex', padding: 0, border: 'none', background: 'none' }}
                                        >
                                          <svg width="24" height="24" fill={num <= reviewRating ? '#f39c12' : '#ddd'} viewBox="0 0 24 24">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                          </svg>
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  {!user && (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                                      <div>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--black)', display: 'block', marginBottom: '4px' }}>Your Name *</label>
                                        <input
                                          type="text"
                                          required
                                          placeholder="e.g. Ali Ahmed"
                                          value={reviewName}
                                          onChange={e => setReviewName(e.target.value)}
                                          style={{
                                            width: '100%', padding: '10px 14px', borderRadius: '8px',
                                            border: '1.5px solid var(--border)', fontSize: '0.88rem',
                                            fontFamily: 'var(--font-body)', outline: 'none', background: 'var(--white)',
                                            boxSizing: 'border-box'
                                          }}
                                        />
                                      </div>
                                      <div>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--black)', display: 'block', marginBottom: '4px' }}>Email Address *</label>
                                        <input
                                          type="email"
                                          required
                                          placeholder="you@example.com"
                                          value={reviewEmail}
                                          onChange={e => setReviewEmail(e.target.value)}
                                          style={{
                                            width: '100%', padding: '10px 14px', borderRadius: '8px',
                                            border: '1.5px solid var(--border)', fontSize: '0.88rem',
                                            fontFamily: 'var(--font-body)', outline: 'none', background: 'var(--white)',
                                            boxSizing: 'border-box'
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--black)', display: 'block', marginBottom: '4px' }}>Review Title</label>
                                    <input
                                      type="text"
                                      placeholder="Summarize your review"
                                      value={reviewTitle}
                                      onChange={e => setReviewTitle(e.target.value)}
                                      style={{
                                        width: '100%', padding: '10px 14px', borderRadius: '8px',
                                        border: '1.5px solid var(--border)', fontSize: '0.88rem',
                                        fontFamily: 'var(--font-body)', outline: 'none', background: 'var(--white)',
                                        boxSizing: 'border-box'
                                      }}
                                    />
                                  </div>

                                  <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--black)', display: 'block', marginBottom: '4px' }}>Review Comment *</label>
                                    <textarea
                                      required
                                      rows="3"
                                      placeholder="What did you think of the fabric, color, or fit?"
                                      value={reviewComment}
                                      onChange={e => setReviewComment(e.target.value)}
                                      style={{
                                        width: '100%', padding: '10px 14px', borderRadius: '8px',
                                        border: '1.5px solid var(--border)', fontSize: '0.88rem',
                                        fontFamily: 'var(--font-body)', outline: 'none', background: 'var(--white)',
                                        resize: 'vertical', boxSizing: 'border-box'
                                      }}
                                    />
                                  </div>

                                  {reviewSuccessMsg && (
                                    <div style={{ color: '#27ae60', fontSize: '0.85rem', fontWeight: 600, background: '#e8f7f0', padding: '10px 14px', borderRadius: '6px' }}>
                                      ✓ {reviewSuccessMsg}
                                    </div>
                                  )}

                                  {reviewErrorMsg && (
                                    <div style={{ color: 'var(--red)', fontSize: '0.85rem', fontWeight: 600, background: '#fdf2f2', padding: '10px 14px', borderRadius: '6px' }}>
                                      ⚠ {reviewErrorMsg}
                                    </div>
                                  )}

                                  <button
                                    type="submit"
                                    disabled={submittingReview}
                                    style={{
                                      alignSelf: 'flex-start', padding: '12px 28px',
                                      backgroundColor: 'var(--black)', color: 'var(--white)',
                                      border: 'none', borderRadius: '8px', fontWeight: 700,
                                      fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em',
                                      cursor: submittingReview ? 'not-allowed' : 'pointer',
                                      transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={e => { if(!submittingReview) e.currentTarget.style.backgroundColor = 'var(--gold)'; }}
                                    onMouseLeave={e => { if(!submittingReview) e.currentTarget.style.backgroundColor = 'var(--black)'; }}
                                  >
                                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                                  </button>
                                </form>
                              </div>

                              {/* Review List */}
                              <div>
                                <h4 style={{ color: 'var(--black)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '16px', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                  Customer Reviews ({reviews.length})
                                </h4>
                                {reviewsLoading ? (
                                  <div style={{ color: 'var(--mid-gray)', fontSize: '0.88rem', padding: '10px 0' }}>Loading reviews...</div>
                                ) : reviews.length === 0 ? (
                                  <div style={{ color: 'var(--mid-gray)', fontSize: '0.88rem', fontStyle: 'italic', padding: '10px 0' }}>
                                    No reviews yet. Be the first to share your experience with K-TEX!
                                  </div>
                                ) : (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                    {reviews.map((rev) => (
                                      <div key={rev._id} style={{
                                        padding: '16px', border: '1px solid rgba(0,0,0,0.04)',
                                        borderRadius: '10px', backgroundColor: 'rgba(0,0,0,0.01)'
                                      }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                          <span style={{ fontWeight: 700, color: 'var(--black)', fontSize: '0.88rem' }}>
                                            {rev.user?.name || 'Customer'}
                                          </span>
                                          <span style={{ color: 'var(--mid-gray)', fontSize: '0.78rem' }}>
                                            {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                          </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', alignItems: 'center' }}>
                                          <div style={{ display: 'flex', gap: '2px' }}>
                                            {[1, 2, 3, 4, 5].map(i => (
                                              <svg key={i} width="14" height="14" fill={i <= rev.rating ? '#f39c12' : '#ddd'} viewBox="0 0 24 24">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                              </svg>
                                            ))}
                                          </div>
                                          {rev.isVerifiedPurchase && (
                                            <span style={{ color: '#27ae60', fontSize: '0.72rem', fontWeight: 700, marginLeft: '8px', backgroundColor: '#e8f7f0', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                              ✓ Verified Purchase
                                            </span>
                                          )}
                                        </div>
                                        {rev.title && (
                                          <div style={{ fontWeight: 700, color: 'var(--black)', fontSize: '0.9rem', marginBottom: '6px' }}>
                                            {rev.title}
                                          </div>
                                        )}
                                        <p style={{ color: 'var(--mid-gray)', fontSize: '0.88rem', margin: 0, lineHeight: 1.6 }}>
                                          {rev.comment}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
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
              marginBottom: 24, color: 'var(--black)',
            }}>You May Also Like</h2>
            <div className="product-grid">
              {relatedProducts.map(p => (
                <Link key={p.id} to={`/product/${p.id}`} style={{
                  display: 'block', backgroundColor: 'var(--white)',
                  borderRadius: 10, overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)', textDecoration: 'none',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  position: 'relative',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                >
                  <div style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
                    <img src={p.image} alt={p.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    />
                    {p.badge && (
                      <div style={{
                        position: 'absolute', top: '10px', left: '10px',
                        backgroundColor: p.badgeColor, color: '#fff',
                        fontSize: '0.65rem', fontWeight: 700, padding: '4px 10px',
                        borderRadius: '2px', letterSpacing: '0.05em',
                      }}>{p.badge}</div>
                    )}
                  </div>
                  <div style={{ padding: '14px' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', margin: '0 0 6px', color: 'var(--black)' }}>{p.name}</h3>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Rs. {p.price.toLocaleString()}</span>
                      {p.oldPrice && (
                        <span style={{ textDecoration: 'line-through', color: 'var(--mid-gray)', fontSize: '0.8rem' }}>Rs. {p.oldPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div
          onClick={() => setSizeGuideOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--white)', borderRadius: '12px',
              maxWidth: '560px', width: '100%', maxHeight: '90vh', overflow: 'auto',
              padding: '32px', position: 'relative',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <button
              onClick={() => setSizeGuideOpen(false)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                width: '32px', height: '32px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: 'var(--bg)', border: 'none', cursor: 'pointer',
                fontSize: '1.2rem', color: 'var(--mid-gray)',
              }}
            >
              ✕
            </button>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '8px' }}>Size Guide</h3>
            <p style={{ color: 'var(--mid-gray)', fontSize: '0.9rem', marginBottom: '24px' }}>All measurements are in inches. If you are between sizes, we recommend sizing up for a comfortable fit.</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--black)' }}>
                    <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 700 }}>Size</th>
                    <th style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 700 }}>Chest</th>
                    <th style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 700 }}>Length</th>
                    <th style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 700 }}>Shoulder</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeChart.map((row, idx) => (
                    <tr key={row.size} style={{ borderBottom: '1px solid var(--border)', backgroundColor: idx % 2 === 0 ? 'var(--bg)' : 'transparent' }}>
                      <td style={{ padding: '10px 8px', fontWeight: 700 }}>{row.size}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'center' }}>{row.chest}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'center' }}>{row.length}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'center' }}>{row.shoulder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ marginTop: '20px', fontSize: '0.8rem', color: 'var(--mid-gray)' }}>
              Need help with sizing? <Link to="/contact" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>Contact us</Link>
            </p>
          </div>
        </div>
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
          disabled={outOfStock}
          style={{
            padding: '12px 20px',
            backgroundColor: outOfStock ? 'var(--border)' : added ? 'var(--black)' : 'var(--gold)',
            color: outOfStock ? 'var(--mid-gray)' : 'var(--white)',
            border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.85rem',
            textTransform: 'uppercase', letterSpacing: '0.05em',
            cursor: outOfStock ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
          }}
        >
          {outOfStock ? 'Out of Stock' : added ? 'Added' : 'Add to Cart'}
        </button>
      </div>

        <style>{`
        @media (max-width: 820px) {
          .mobile-sticky-cta { display: flex !important; }
          main { padding-bottom: 80px; }
        }
        @media (max-width: 768px) {
          .mobile-sticky-cta { display: flex !important; }
          main { padding-bottom: 80px; }
          .product-images > div {
            flex-direction: column !important;
            width: 100% !important;
            gap: 10px !important;
          }
          .product-images .main-image-wrap {
            width: 100% !important;
            max-height: none !important;
            min-height: 300px;
            flex: none !important;
          }
          .product-images .main-image-wrap img {
            object-fit: contain !important;
          }
          .thumb-sidebar {
            flex-direction: row !important;
            overflow-x: auto !important;
            overflow-y: visible !important;
            max-height: none !important;
            order: 2 !important;
            padding-right: 0 !important;
            flex-shrink: 0 !important;
          }
          .thumb-sidebar > div {
            width: 60px !important;
            height: 60px !important;
            flex-shrink: 0;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(231,76,60,0.4); }
          70% { box-shadow: 0 0 0 10px rgba(231,76,60,0); }
          100% { box-shadow: 0 0 0 0 rgba(231,76,60,0); }
        }
      `}</style>
    </main>
  );
}

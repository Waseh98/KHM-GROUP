import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, categories } from '../data';
import TrustBadges from '../components/TrustBadges';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

function getMenSubCategories() {
  const cats = typeof window !== 'undefined'
    ? (() => { try { const s = localStorage.getItem('ktex_categories'); return s ? JSON.parse(s) : categories; } catch { return categories; } })()
    : categories;
  const menCat = cats.find(c => c.name === 'Men' || c.id === 'cat_men');
  return menCat?.subcategories || [];
}

function ProductCard({ product, onWishlist, isWishlisted }) {
  const { addToCart } = useCart();

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onWishlist(product);
    const btn = e.currentTarget;
    btn.style.animation = 'none';
    void btn.offsetWidth;
    btn.style.animation = 'heartPop 0.3s ease';
  };

  return (
    <div
      className="product-card"
      style={{
        backgroundColor: 'var(--white)',
        borderRadius: 8,
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
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
        />
        {product.badge && (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            backgroundColor: product.badgeColor, color: '#fff',
            fontSize: '0.7rem', fontWeight: 700, padding: '4px 8px',
            borderRadius: 2, letterSpacing: '0.05em', zIndex: 2
          }}>{product.badge}</div>
        )}
        <button
          className="wishlist-btn"
          onClick={handleWishlist}
          style={{
            position: 'absolute', top: 12, right: 12,
            backgroundColor: 'var(--white)', width: 32, height: 32,
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)', opacity: 0, transition: 'opacity 0.2s, transform 0.2s',
            color: isWishlisted(product.id) ? 'var(--red)' : 'var(--black)', zIndex: 2
          }}
        >
          <svg width="18" height="18" fill={isWishlisted(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </Link>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          {product.colors.map((c, i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: c, border: '1px solid #ddd' }}/>
          ))}
          <span style={{ fontSize: '0.75rem', color: 'var(--mid-gray)', marginLeft: 4 }}>{product.colorCount} Colors</span>
        </div>
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600,
            margin: '0 0 8px 0', color: 'var(--black)', transition: 'color 0.2s'
          }}
            onMouseEnter={e => e.target.style.color = 'var(--gold)'}
            onMouseLeave={e => e.target.style.color = 'var(--black)'}
          >{product.name}</h3>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Rs. {product.price.toLocaleString()}</span>
          <span style={{ textDecoration: 'line-through', color: 'var(--mid-gray)', fontSize: '0.9rem' }}>Rs. {product.oldPrice.toLocaleString()}</span>
          <span style={{ color: 'var(--red)', fontSize: '0.8rem', fontWeight: 600 }}>-{product.discount}%</span>
        </div>
        <button
          onClick={() => addToCart(product, { size: 'M' })}
          style={{
            marginTop: 'auto', width: '100%', backgroundColor: 'var(--black)', color: 'var(--white)',
            padding: 12, fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.05em', borderRadius: 4, transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--red)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--black)'}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

function ProductSegment({ title, subtitle, products, toggleWishlist, isWishlisted, image }) {
  if (products.length === 0) return null;

  return (
    <section style={{ padding: '50px 0' }}>
      <div className="container">
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 32, borderBottom: '1px solid var(--border)', paddingBottom: 16
        }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 600,
              color: 'var(--black)', margin: 0
            }}>{title}</h2>
            {subtitle && (
              <p style={{ margin: '4px 0 0', color: 'var(--mid-gray)', fontSize: '0.9rem' }}>
                {subtitle}
              </p>
            )}
          </div>
          <span style={{ color: 'var(--mid-gray)', fontSize: '0.9rem', fontWeight: 500 }}>
            {products.length} Items
          </span>
        </div>

        <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 30 }}>
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onWishlist={toggleWishlist}
              isWishlisted={isWishlisted}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Men() {
  const { toggle: toggleWishlist, isWishlisted } = useWishlist();
  const [selected, setSelected] = useState('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const menSubs = getMenSubCategories();
  const allProducts = getProducts();

  const segmentProducts = menSubs.map(sub => ({
    id: sub.id,
    name: sub.name,
    image: sub.image || '',
    products: allProducts.filter(p =>
      p.tag === sub.name ||
      p.tag === sub.name.replace(/\s+/g, '-') ||
      (p.name.toLowerCase().includes(sub.name.toLowerCase()) && p.tag !== 'Women')
    ),
  }));

  const allMenProducts = allProducts.filter(p =>
    p.tag === 'Men' ||
    segmentProducts.some(seg => seg.products.some(sp => sp.id === p.id))
  );

  const filterCategories = [
    { key: 'all', label: 'All Products' },
    ...menSubs.map(sub => ({ key: sub.id, label: sub.name })),
  ];

  const getFiltered = () => {
    const seg = segmentProducts.find(s => s.id === selected);
    if (!seg) return null;
    return { title: seg.name, subtitle: '', products: seg.products };
  };

  const filtered = getFiltered();

  return (
    <main>
      {/* Hero Banner */}
      <section style={{
        position: 'relative',
        width: '100%',
        height: '35vh',
        minHeight: 260,
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
          opacity: 0.5
        }} />
        <div style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          color: 'var(--white)'
        }}>
          <h1 className="fade-up" style={{
            fontFamily: "var(--font-heading)",
            fontSize: 'clamp(2.6rem, 5vw, 4rem)',
            fontWeight: 700,
            letterSpacing: '0.05em',
            margin: '0 0 12px 0'
          }}>Men's Collection</h1>
          <p className="fade-up-1" style={{
            fontFamily: "var(--font-body)",
            fontSize: '1.05rem',
            maxWidth: 500,
            margin: '0 auto',
            color: '#e0dfdb'
          }}>
            Premium polos, tees & round necks — crafted for the modern gentleman.
          </p>
        </div>
      </section>

      {/* Category Filter Bar */}
      <div style={{
        backgroundColor: 'var(--white)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 'var(--navbar-h)',
        zIndex: 40,
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          padding: '12px 24px',
        }}>
          {/* Desktop Tabs */}
          <div className="cat-tabs" style={{ display: 'flex', gap: 4 }}>
            {filterCategories.map(cat => (
              <button
                key={cat.key}
                onClick={() => {
                  setSelected(cat.key);
                  document.getElementById('men-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                style={{
                  padding: '10px 22px',
                  borderRadius: 6,
                  fontSize: '0.85rem',
                  fontWeight: selected === cat.key ? 700 : 500,
                  border: selected === cat.key ? '2px solid var(--black)' : '2px solid transparent',
                  backgroundColor: selected === cat.key ? 'var(--black)' : 'transparent',
                  color: selected === cat.key ? 'var(--white)' : 'var(--black)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  letterSpacing: '0.03em',
                }}
                onMouseEnter={e => {
                  if (selected !== cat.key) {
                    e.target.style.borderColor = 'var(--black)';
                    e.target.style.color = 'var(--black)';
                  }
                }}
                onMouseLeave={e => {
                  if (selected !== cat.key) {
                    e.target.style.borderColor = 'transparent';
                  }
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Mobile Dropdown */}
          <select
            value={selected}
            onChange={e => setSelected(e.target.value)}
            className="category-dropdown"
            style={{
              display: 'none',
              padding: '10px 16px',
              borderRadius: 6,
              border: '2px solid var(--black)',
              backgroundColor: 'var(--white)',
              color: 'var(--black)',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
              width: '100%',
              appearance: 'auto',
            }}
          >
            {filterCategories.map(cat => (
              <option key={cat.key} value={cat.key}>{cat.label}</option>
            ))}
          </select>

          <span style={{ color: 'var(--mid-gray)', fontSize: '0.85rem', fontWeight: 500 }}>
            {selected === 'all'
              ? `${allMenProducts.length} Products`
              : `${filtered?.products.length ?? 0} Products`
            }
          </span>
        </div>
      </div>

      {/* Products */}
      <div id="men-products" style={{ backgroundColor: 'var(--bg)', padding: '10px 0 40px' }}>
        {selected === 'all' ? (
          segmentProducts.map(seg => (
            <ProductSegment
              key={seg.id}
              title={seg.name}
              subtitle=""
              products={seg.products}
              toggleWishlist={toggleWishlist}
              isWishlisted={isWishlisted}
              image={seg.image}
            />
          ))
        ) : (
          <ProductSegment
            title={filtered.title}
            subtitle={filtered.subtitle}
            products={filtered.products}
            toggleWishlist={toggleWishlist}
            isWishlisted={isWishlisted}
          />
        )}
      </div>

      <TrustBadges />

      <style>{`
        @media (max-width: 900px) { .product-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 768px) {
          .cat-tabs { display: none !important; }
          .category-dropdown { display: block !important; }
        }
        @media (max-width: 600px) { 
          .product-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
          .wishlist-btn { opacity: 1 !important; }
        }
      `}</style>
    </main>
  );
}

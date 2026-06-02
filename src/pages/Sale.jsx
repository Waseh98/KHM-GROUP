import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../data';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/api';

export default function Sale() {
  const { addToCart } = useCart();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Special Sale Collection — Premium Polos | K-TEX";
  }, []);

  const saleProducts = getProducts().filter((p) => p.tag === 'Sale');

  return (
    <main>
      <section
        style={{
          position: 'relative',
          width: '100%',
          height: '38vh',
          minHeight: 280,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: 'var(--black)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'url(https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?w=1600&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.55,
          }}
        />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: '#fff' }}>
          <p
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
              fontSize: 11,
              margin: 0,
              color: 'rgba(255,255,255,0.76)',
            }}
          >
            Limited Time Offers
          </p>
          <h1
            style={{
              margin: '10px 0 6px',
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.8rem, 4.2vw, 3.6rem)',
              letterSpacing: '0.06em',
            }}
          >
            Sale Collection
          </h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.86)' }}>
            Save more on polos you love. Discounts auto‑applied on checkout.
          </p>
        </div>
      </section>

      <section style={{ backgroundColor: 'var(--light-gray)', padding: '70px 0' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 32,
              borderBottom: '1px solid var(--border)',
              paddingBottom: 14,
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                color: 'var(--black)',
              }}
            >
              Extra Savings
            </h2>
            <span style={{ color: 'var(--mid-gray)', fontFamily: 'var(--font-body)', fontSize: 14 }}>
              Showing {saleProducts.length} sale items
            </span>
          </div>

          <div
            className="product-grid"
            style={{
              display: 'grid',
              gap: 30,
            }}
          >
            {saleProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  backgroundColor: 'var(--white)',
                  borderRadius: 10,
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Link
                  to={`/product/${product.id}`}
                  style={{
                    position: 'relative',
                    aspectRatio: '3/4',
                    overflow: 'hidden',
                    backgroundColor: '#eef',
                    display: 'block',
                  }}
                >
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      backgroundColor: 'var(--gold)',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      padding: '4px 8px',
                      textTransform: 'uppercase',
                      borderRadius: 2,
                    }}
                  >
                    Sale -{product.discount}%
                  </div>
                </Link>

                <div style={{ padding: 18, display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <Link
                    to={`/product/${product.id}`}
                    style={{ textDecoration: 'none', color: 'var(--black)' }}
                  >
                    <h3
                      style={{
                        margin: '0 0 8px',
                        fontFamily: 'var(--font-heading)',
                        fontSize: 18,
                        fontWeight: 600,
                      }}
                    >
                      {product.name}
                    </h3>
                  </Link>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <span style={{ fontWeight: 700, fontSize: 16 }}>
                      Rs. {product.price.toLocaleString()}
                    </span>
                    {product.oldPrice && (
                      <span
                        style={{
                          textDecoration: 'line-through',
                          color: 'var(--mid-gray)',
                          fontSize: 13,
                        }}
                      >
                        Rs. {product.oldPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(product, { size: 'M' })}
                    style={{
                      marginTop: 'auto',
                      width: '100%',
                      backgroundColor: 'var(--black)',
                      color: '#fff',
                      padding: '12px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      borderRadius: 6,
                      transition: 'background-color 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--red)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'var(--black)';
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          <style>{`
          `}</style>
        </div>
      </section>
    </main>
  );
}


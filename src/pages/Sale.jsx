import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getProducts, getCollections, getPageSubCategories, syncCollectionsFromBackend, syncPageSubCategoriesFromBackend } from '../data';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/api';

export default function Sale() {
  const { addToCart } = useCart();
  const location = useLocation();
  const [activeSub, setActiveSub] = useState('all');
  const [activeCollection, setActiveCollection] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [collectionData, setCollectionData] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Special Sale Collection — Premium Polos | K-TEX";
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const collectionSlug = params.get('collection');
    if (collectionSlug) {
      const col = getCollections().find(c => (c.slug || '') === collectionSlug || c.id === collectionSlug);
      setActiveCollection(col || null);
    } else {
      setActiveCollection(null);
    }
  }, [location.search]);

  useEffect(() => {
    setSubCategories(getPageSubCategories('Sale'));
    syncCollectionsFromBackend().then(() => {
      const params = new URLSearchParams(location.search);
      const collectionSlug = params.get('collection');
      if (collectionSlug) {
        const col = getCollections().find(c => (c.slug || '') === collectionSlug || c.id === collectionSlug);
        setActiveCollection(col || null);
      }
    }).catch(() => {});
    syncPageSubCategoriesFromBackend().then(() => {
      setSubCategories(getPageSubCategories('Sale'));
    }).catch(() => {});
  }, [location.search]);

  useEffect(() => {
    function handler() {
      setSubCategories(getPageSubCategories('Sale'));
    }
    window.addEventListener('page-subcategories-updated', handler);
    return () => window.removeEventListener('page-subcategories-updated', handler);
  }, []);

  const saleProducts = useMemo(() => {
    const all = getProducts();
    let pool = all.filter((p) => p.tag === 'Sale' || p.pageType === 'Sale' || p.mainCategory === 'Sale' || p.category === 'Sale');

    if (activeCollection && Array.isArray(activeCollection.categories) && activeCollection.categories.length > 0) {
      const collectionNames = activeCollection.categories
        .map(c => (c.name || c || '').toLowerCase().trim())
        .filter(Boolean);
      if (collectionNames.length > 0) {
        const filtered = pool.filter(p => {
          const pName = (p.name || '').toLowerCase();
          const pSub = (p.subCategory || '').toLowerCase();
          const pCat = (p.category || '').toLowerCase();
          const pTag = (p.tag || '').toLowerCase();
          const pMain = (p.mainCategory || '').toLowerCase();
          return collectionNames.some(n =>
            pSub === n || pCat === n || pTag === n || pMain === n ||
            pName.includes(n) || n.includes(pSub) || n.includes(pCat)
          );
        });
        if (filtered.length > 0) pool = filtered;
      }
    }

    if (activeSub !== 'all' && subCategories.length > 0) {
      const sub = subCategories.find(s => s.id === activeSub || s.slug === activeSub);
      if (sub) {
        const subName = sub.name.toLowerCase();
        pool = pool.filter(p => {
          const pName = (p.name || '').toLowerCase();
          const pSub = (p.subCategory || '').toLowerCase();
          const pCat = (p.category || '').toLowerCase();
          return pName.includes(subName) || pSub.includes(subName) || pCat.includes(subName);
        });
      }
    }

    return pool;
  }, [activeCollection, activeSub, subCategories]);

  useEffect(() => {
    setCollectionData(activeCollection);
  }, [activeCollection]);

  const heroTitle = collectionData ? collectionData.name : 'Sale Collection';
  const heroDescription = collectionData
    ? collectionData.description
    : 'Save more on polos you love. Discounts auto‑applied on checkout.';

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
        {collectionData?.image ? (
          <div
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${getImageUrl(collectionData.image)})`,
              backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.55,
            }}
          />
        ) : (
          <div
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'url(https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?w=1600&q=80)',
              backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.55,
            }}
          />
        )}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: '#fff', padding: '0 20px' }}>
          <p
            style={{
              textTransform: 'uppercase', letterSpacing: '0.25em', fontSize: 11, margin: 0,
              color: 'rgba(255,255,255,0.76)',
            }}
          >
            {collectionData ? 'Curated Collection' : 'Limited Time Offers'}
          </p>
          <h1
            style={{
              margin: '10px 0 6px', fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.4rem, 4.2vw, 3.6rem)', letterSpacing: '0.06em',
            }}
          >
            {heroTitle}
          </h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.86)', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
            {heroDescription}
          </p>
          {collectionData && (
            <div style={{ marginTop: 14, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
              <Link to="/collections" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                ← Back to all collections
              </Link>
            </div>
          )}
        </div>
      </section>

      <section style={{ backgroundColor: 'var(--light-gray)', padding: '70px 0' }}>
        <div className="container">
          {subCategories.length > 0 && (
            <div
              style={{
                display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24,
                padding: 14, background: '#fff', borderRadius: 12,
                border: '1px solid var(--border)', alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--mid-gray)', textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: 6 }}>
                Sub-Category:
              </span>
              <button
                onClick={() => setActiveSub('all')}
                style={{
                  padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                  border: `1px solid ${activeSub === 'all' ? 'var(--gold)' : 'var(--border)'}`,
                  background: activeSub === 'all' ? 'var(--gold)' : 'transparent',
                  color: activeSub === 'all' ? '#fff' : 'var(--black)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                All
              </button>
              {subCategories.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveSub(s.id)}
                  style={{
                    padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                    border: `1px solid ${activeSub === s.id ? 'var(--gold)' : 'var(--border)'}`,
                    background: activeSub === s.id ? 'var(--gold)' : 'transparent',
                    color: activeSub === s.id ? '#fff' : 'var(--black)',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}

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
                margin: 0, fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--black)',
              }}
            >
              {collectionData ? collectionData.name : 'Extra Savings'}
            </h2>
            <span style={{ color: 'var(--mid-gray)', fontFamily: 'var(--font-body)', fontSize: 14 }}>
              Showing {saleProducts.length} {saleProducts.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {saleProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--mid-gray)' }}>
              <p style={{ fontSize: '1.1rem' }}>No products match the current filters.</p>
              {subCategories.length > 0 && (
                <button
                  onClick={() => setActiveSub('all')}
                  style={{
                    marginTop: 12, padding: '8px 18px', borderRadius: 8,
                    border: '1px solid var(--gold)', background: 'transparent', color: 'var(--gold)',
                    cursor: 'pointer', fontWeight: 700,
                  }}
                >
                  Show all sub-categories
                </button>
              )}
            </div>
          ) : (
            <div
              className="product-grid"
              style={{ display: 'grid', gap: 30 }}
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
                      position: 'relative', aspectRatio: '3/4', overflow: 'hidden',
                      backgroundColor: '#eef', display: 'block',
                    }}
                  >
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      loading="lazy"
                      style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    />
                    {product.discount > 0 && (
                      <div
                        style={{
                          position: 'absolute', top: 12, left: 12,
                          backgroundColor: 'var(--gold)', color: '#fff',
                          fontSize: 11, fontWeight: 800, letterSpacing: '0.08em',
                          padding: '4px 8px', textTransform: 'uppercase', borderRadius: 2,
                        }}
                      >
                        Sale -{product.discount}%
                      </div>
                    )}
                  </Link>

                  <div style={{ padding: 18, display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <Link
                      to={`/product/${product.id}`}
                      style={{ textDecoration: 'none', color: 'var(--black)' }}
                    >
                      <h3
                        style={{
                          margin: '0 0 8px', fontFamily: 'var(--font-heading)',
                          fontSize: 18, fontWeight: 600,
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
                            textDecoration: 'line-through', color: 'var(--mid-gray)', fontSize: 13,
                          }}
                        >
                          Rs. {product.oldPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(product, { size: 'M' })}
                      style={{
                        marginTop: 'auto', width: '100%', backgroundColor: 'var(--black)',
                        color: '#fff', padding: '12px', fontSize: '0.85rem', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.06em', borderRadius: 6,
                        transition: 'background-color 0.3s ease', border: 'none', cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => { e.target.style.backgroundColor = 'var(--red)'; }}
                      onMouseLeave={(e) => { e.target.style.backgroundColor = 'var(--black)'; }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

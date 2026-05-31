import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCollections, getProducts, syncCollectionsFromBackend, syncProductsFromBackend } from '../data';
import { useCart } from '../context/CartContext';

function slugify(name) {
  return String(name || '')
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function CollectionDetail() {
  const { addToCart } = useCart();
  const { slug } = useParams();
  const [collection, setCollection] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const col = getCollections().find((c) => slugify(c.name) === slug) || null;
    setCollection(col);
    syncCollectionsFromBackend().then(() => {
      const updated = getCollections().find((c) => slugify(c.name) === slug) || null;
      setCollection(updated);
    }).catch(() => {});
    syncProductsFromBackend();
  }, [slug]);

  const collectionProducts = useMemo(() => {
    if (!collection) return [];
    const all = getProducts();
    const catNames = (collection.categories || []).map(c =>
      (c.name || '').toLowerCase().replace(/[\s-]/g, '')
    ).filter(Boolean);

    if (catNames.length === 0) return [];

    return all.filter(p => {
      const pSub = (p.subCategory || '').toLowerCase().replace(/[\s-]/g, '');
      const pCat = (p.category || '').toLowerCase().replace(/[\s-]/g, '');
      const pTag = (p.tag || '').toLowerCase().replace(/[\s-]/g, '');
      const pName = (p.name || '').toLowerCase().replace(/[\s-]/g, '');
      const pMainCat = (p.mainCategory || '').toLowerCase().replace(/[\s-]/g, '');
      return catNames.some(n => pSub === n || pCat === n || pTag === n || pName === n || pMainCat === n);
    });
  }, [collection]);

  if (!collection) {
    return (
      <main style={{ minHeight: '60vh', padding: '80px 20px', backgroundColor: 'var(--light-gray)' }}>
        <div className="container" style={{ maxWidth: 760, background: '#fff', padding: 28, borderRadius: 12, boxShadow: 'var(--shadow-sm)' }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 34 }}>Collection not found</h1>
          <p style={{ marginTop: 8, color: 'var(--mid-gray)' }}>
            This collection page doesn&apos;t exist. Go back and choose another collection.
          </p>
          <Link to="/collections" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>
            Back to Collections
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <section
        style={{
          position: 'relative',
          width: '100%',
          height: '42vh',
          minHeight: 320,
          display: 'flex',
          alignItems: 'flex-end',
          overflow: 'hidden',
          backgroundColor: 'var(--black)',
        }}
      >
        <img
          src={collection.image}
          alt={collection.name}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0.08) 100%)',
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 2, paddingBottom: 34, color: '#fff' }}>
          <Link to="/collections" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'underline', textUnderlineOffset: 4 }}>
            ← Back to Collections
          </Link>
          <h1 style={{ margin: '12px 0 6px', fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.4rem, 4vw, 3.6rem)' }}>
            {collection.name}
          </h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.86)', letterSpacing: '0.06em' }}>{collection.description}</p>
        </div>
      </section>

      <section style={{ backgroundColor: 'var(--light-gray)', padding: '70px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--border)', paddingBottom: 14 }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>Featured Items</h2>
            <span style={{ color: 'var(--mid-gray)' }}>{collectionProducts.length} items</span>
          </div>

          {(collection.categories || []).length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
              {(collection.categories || []).map((cat, i) => (
                <span key={i} style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: 'rgba(212,175,90,0.12)', color: '#d4af5a', border: '1px solid rgba(212,175,90,0.25)' }}>
                  {cat.name || cat}
                </span>
              ))}
            </div>
          )}

          {collectionProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--mid-gray)' }}>
              <p style={{ fontSize: '1.1rem' }}>No products found in this collection yet.</p>
              <p style={{ fontSize: '0.9rem', marginTop: 8 }}>Link categories to this collection in the admin panel to show matching products.</p>
            </div>
          ) : (
            <div className="product-grid" style={{ display: 'grid', gap: 30, marginTop: 26 }}>
              {collectionProducts.map((p) => (
                <div key={p.id} style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
                  <Link to={`/product/${p.id}`} style={{ display: 'block', aspectRatio: '3/4', overflow: 'hidden', background: '#eef' }}>
                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  </Link>
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <Link to={`/product/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700 }}>{p.name}</div>
                    </Link>
                    <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontWeight: 800 }}>Rs. {p.price.toLocaleString()}</span>
                      {p.oldPrice && (
                        <span style={{ color: 'var(--mid-gray)', textDecoration: 'line-through' }}>Rs. {p.oldPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(p, { size: 'M' })}
                      style={{
                        marginTop: 'auto',
                        width: '100%',
                        backgroundColor: 'var(--black)',
                        color: '#fff',
                        padding: '12px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        borderRadius: 8,
                        transition: 'background-color 0.3s ease',
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = 'var(--red)')}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = 'var(--black)')}
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

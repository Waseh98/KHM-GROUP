import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../data';
import { useCollectionFromUrl, usePageSubCategories } from '../hooks/useCollectionFilters';
import TrustBadges from '../components/TrustBadges';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getImageUrl } from '../utils/api';

function DarkProductCard({ product, onWishlist, isWishlisted }) {
  const { addToCart } = useCart();
  return (
    <div
      className="product-card"
      style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: '16px', overflow: 'hidden',
        transition: 'transform 0.4s ease, box-shadow 0.4s ease, border-color 0.3s ease',
        display: 'flex', flexDirection: 'column', position: 'relative',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
        e.currentTarget.style.borderColor = 'rgba(184,151,42,0.2)';
        const wb = e.currentTarget.querySelector('.wishlist-btn');
        if (wb) { wb.style.opacity = '1'; wb.style.transform = 'translateY(0)'; }
        const img = e.currentTarget.querySelector('.prod-img');
        if (img) img.style.transform = 'scale(1.08)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
        const wb = e.currentTarget.querySelector('.wishlist-btn');
        if (wb) { wb.style.opacity = '0'; wb.style.transform = 'translateY(-10px)'; }
        const img = e.currentTarget.querySelector('.prod-img');
        if (img) img.style.transform = 'scale(1)';
      }}
    >
      <Link to={`/product/${product.id}`} style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: 'linear-gradient(135deg, #1a1a2e, #16213e)', display: 'block' }}>
        <img src={getImageUrl(product.image)} alt={product.name} className="prod-img" loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s ease' }} />
        {product.badge && (
          <div style={{
            position: 'absolute', top: 14, left: 14,
            background: product.badge === 'NEW' ? 'linear-gradient(135deg, var(--gold), var(--light-gold))' : product.badgeColor,
            color: product.badge === 'NEW' ? '#1a1510' : '#fff',
            fontSize: '0.7rem', fontWeight: 800, padding: '5px 12px', borderRadius: '6px',
            letterSpacing: '0.1em', textTransform: 'uppercase', zIndex: 2,
          }}>{product.badge}</div>
        )}
        <button className="wishlist-btn" onClick={e => { e.preventDefault(); e.stopPropagation(); onWishlist(product); }}
          style={{
            position: 'absolute', top: 14, right: 14,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
            width: 38, height: 38, borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.1)',
            opacity: 0, transform: 'translateY(-10px)', transition: 'all 0.4s ease',
            color: isWishlisted(product.id) ? 'var(--red)' : '#fff', zIndex: 2,
          }}>
          <svg width="18" height="18" fill={isWishlisted(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </Link>
      <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          {product.colors.map((c, i) => (
            <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: c, border: '2px solid rgba(255,255,255,0.1)' }}/>
          ))}
          <span style={{ fontSize: '0.75rem', color: '#8a7d65', marginLeft: 6 }}>{product.colorCount} Colors</span>
        </div>
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 600, margin: '0 0 8px', color: '#e8e0d0', transition: 'color 0.2s', lineHeight: 1.25 }}
            onMouseEnter={e => e.target.style.color = 'var(--gold)'}
            onMouseLeave={e => e.target.style.color = '#e8e0d0'}
          >{product.name}</h3>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>Rs. {product.price.toLocaleString()}</span>
          {product.oldPrice && <span style={{ textDecoration: 'line-through', color: '#6a6050', fontSize: '0.85rem' }}>Rs. {product.oldPrice.toLocaleString()}</span>}
          {product.discount && <span style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 800, background: 'rgba(184,151,42,0.1)', padding: '2px 8px', borderRadius: 4 }}>-{product.discount}%</span>}
        </div>
        <button onClick={() => addToCart(product, { size: 'M' })}
          style={{
            marginTop: 'auto', width: '100%',
            background: 'linear-gradient(135deg, rgba(184,151,42,0.1), rgba(184,151,42,0.05))',
            color: 'var(--gold)', border: '1px solid rgba(184,151,42,0.25)',
            padding: '12px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.08em', borderRadius: '10px', transition: 'all 0.3s ease', cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, var(--gold), var(--light-gold))'; e.currentTarget.style.color = '#1a1510'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(184,151,42,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(184,151,42,0.1), rgba(184,151,42,0.05))'; e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.boxShadow = 'none'; }}
        >Quick Add</button>
      </div>
    </div>
  );
}

function ProductSegment({ title, products, toggleWishlist, isWishlisted }) {
  if (products.length === 0) return null;
  return (
    <section style={{ padding: '50px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, borderBottom: '1px solid rgba(184,151,42,0.15)', paddingBottom: 16 }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 600, color: '#fff', margin: 0 }}>{title}</h2>
          <span style={{ color: '#8a7d65', fontSize: '0.85rem', fontWeight: 600, padding: '4px 14px', background: 'rgba(184,151,42,0.08)', borderRadius: 20, border: '1px solid rgba(184,151,42,0.15)' }}>{products.length} Items</span>
        </div>
        <div className="product-grid" style={{ display: 'grid', gap: 'clamp(16px, 3vw, 24px)' }}>
          {products.map(p => <DarkProductCard key={p.id} product={p} onWishlist={toggleWishlist} isWishlisted={isWishlisted} />)}
        </div>
      </div>
    </section>
  );
}

export default function NewArrivals() {
  const { toggle: toggleWishlist, isWishlisted } = useWishlist();
  const [selected, setSelected] = useState('all');
  const collection = useCollectionFromUrl();
  const pageSubs = usePageSubCategories('NewArrivals');
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = collection ? `${collection.name} — New Arrivals | K-TEX` : "New Arrivals — Fresh Drops & Polos | K-TEX";
  }, [collection]);

  const allProducts = getProducts();

  const filterByCollection = (products) => {
    if (!collection || !Array.isArray(collection.categories) || collection.categories.length === 0) return products;
    const names = collection.categories.map(c => (c.name || c || '').toLowerCase()).filter(Boolean);
    if (names.length === 0) return products;
    return products.filter(p => {
      const pSub = (p.subCategory || '').toLowerCase();
      const pCat = (p.category || '').toLowerCase();
      const pTag = (p.tag || '').toLowerCase();
      const pMain = (p.mainCategory || '').toLowerCase();
      const pName = (p.name || '').toLowerCase();
      return names.some(n => pSub === n || pCat === n || pTag === n || pMain === n || pName.includes(n));
    });
  };

  const categories = [
    { key: 'all', label: 'All Products' },
    { key: 'Men', label: "Men's" },
    { key: 'Women', label: "Women's" },
    { key: 'Kids', label: "Kids'" },
    { key: 'Sale', label: 'Sale' },
    ...pageSubs.map(s => ({ key: `page_${s.id}`, label: s.name })),
  ];

  const newProducts = allProducts.filter(p => {
    const tag = (p.tag || '').toLowerCase();
    return ['men', 'women', 'kids', 'sale', 't-shirt', 'round-neck', 'new'].includes(tag) || p.badge === 'NEW' || p.isNewArrival;
  });

  const allNew = filterByCollection(newProducts);

  const menNew = allNew.filter(p => p.tag === 'Men');
  const womenNew = allNew.filter(p => p.tag === 'Women');
  const kidsNew = allNew.filter(p => p.tag === 'Kids' || p.tag === 'kids');
  const saleNew = allNew.filter(p => p.tag === 'Sale');

  const segmentProducts = [
    { id: 'Men', name: "Men's Collection", products: menNew },
    { id: 'Women', name: "Women's Collection", products: womenNew },
    { id: 'Kids', name: "Kids' Collection", products: kidsNew },
    { id: 'Sale', name: 'Sale', products: saleNew },
  ].filter(s => s.products.length > 0);

  const filtered = selected === 'all' ? null : (() => {
    if (typeof selected === 'string' && selected.startsWith('page_')) {
      const subId = selected.replace('page_', '');
      const sub = pageSubs.find(s => s.id === subId);
      if (sub) {
        const subName = sub.name.toLowerCase();
        const products = allNew.filter(p => {
          const pName = (p.name || '').toLowerCase();
          const pSub = (p.subCategory || '').toLowerCase();
          const pCat = (p.category || '').toLowerCase();
          return pName.includes(subName) || pSub.includes(subName) || pCat.includes(subName);
        });
        return { title: sub.name, products };
      }
    }
    const seg = segmentProducts.find(s => s.id === selected);
    return seg ? { title: seg.name, products: seg.products } : null;
  })();

  return (
    <main style={{ background: 'linear-gradient(180deg, #0d0d12, #151318, #0d0d12)' }}>
      {/* Hero */}
      <section style={{ position: 'relative', width: '100%', height: '40vh', minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {collection?.image ? (
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${getImageUrl(collection.image)})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3 }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3 }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,13,18,0.3), rgba(13,13,18,0.9))' }} />
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#fff', padding: '0 20px' }}>
          <span className="fade-up" style={{ display: 'inline-block', color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14, padding: '6px 20px', background: 'rgba(184,151,42,0.1)', border: '1px solid rgba(184,151,42,0.2)', borderRadius: 20 }}>{collection ? 'Curated Collection' : 'K-TEX New Arrivals'}</span>
          <h1 className="fade-up" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, letterSpacing: '0.05em', margin: '0 0 12px' }}>{collection ? collection.name : 'New Arrivals'}</h1>
          <p className="fade-up-1" style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', maxWidth: 500, margin: '0 auto', color: 'rgba(255,255,255,0.6)' }}>
            {collection ? collection.description : 'Discover the latest drops — fresh styles, premium quality, just arrived.'}
          </p>
          {collection && (
            <div style={{ marginTop: 14 }}>
              <Link to="/collections" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'underline', textUnderlineOffset: 3, fontSize: 12 }}>
                ← Back to all collections
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Filter Bar */}
      <div style={{
        background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 'var(--navbar-h)', zIndex: 40, backdropFilter: 'blur(20px)',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, padding: '12px 24px' }}>
          <div className="cat-tabs" style={{ display: 'flex', gap: 6 }}>
            {categories.map(cat => (
              <button key={cat.key} onClick={() => { setSelected(cat.key); document.getElementById('new-arrivals-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                style={{
                  padding: '8px 20px', borderRadius: 8, fontSize: '0.82rem', fontWeight: selected === cat.key ? 700 : 500,
                  border: selected === cat.key ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.1)',
                  background: selected === cat.key ? 'linear-gradient(135deg, var(--gold), var(--light-gold))' : 'rgba(255,255,255,0.03)',
                  color: selected === cat.key ? '#1a1510' : '#a89b7d',
                  cursor: 'pointer', transition: 'all 0.3s ease', letterSpacing: '0.03em',
                  boxShadow: selected === cat.key ? '0 4px 16px rgba(184,151,42,0.3)' : 'none',
                }}
                onMouseEnter={e => { if (selected !== cat.key) { e.currentTarget.style.background = 'rgba(184,151,42,0.1)'; e.currentTarget.style.color = 'var(--gold)'; } }}
                onMouseLeave={e => { if (selected !== cat.key) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#a89b7d'; } }}
              >{cat.label}</button>
            ))}
          </div>
          <select value={selected} onChange={e => setSelected(e.target.value)} className="category-dropdown"
            style={{ display: 'none', padding: '10px 16px', borderRadius: 8, border: '1px solid rgba(184,151,42,0.3)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', outline: 'none', width: '100%' }}>
            {categories.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
          <span style={{ color: '#8a7d65', fontSize: '0.82rem', fontWeight: 600 }}>
            {selected === 'all' ? `${allNew.length} Products` : `${filtered?.products.length ?? 0} Products`}
          </span>
        </div>
      </div>

      {/* Products */}
      <div id="new-arrivals-products" style={{ padding: '10px 0 40px' }}>
        {selected === 'all'
          ? segmentProducts.map(seg => <ProductSegment key={seg.id} title={seg.name} products={seg.products} toggleWishlist={toggleWishlist} isWishlisted={isWishlisted} />)
          : filtered && <ProductSegment title={filtered.title} products={filtered.products} toggleWishlist={toggleWishlist} isWishlisted={isWishlisted} />
        }
      </div>

      <TrustBadges />
      <style>{`
        @media (max-width: 820px) { .cat-tabs { display: none !important; } .category-dropdown { display: block !important; } }
        @media (max-width: 768px) { .cat-tabs { display: none !important; } .category-dropdown { display: block !important; } }
        @media (max-width: 600px) { .wishlist-btn { opacity: 1 !important; transform: translateY(0) !important; } }
      `}</style>
    </main>
  );
}

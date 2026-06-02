import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getProducts, categories } from '../data';
import TrustBadges from '../components/TrustBadges';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getImageUrl } from '../utils/api';

function getMenSubCategories() {
  const defaultSubs = [
    { id: 'sub_men_polo', name: 'Polo Shirts', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&q=80' },
    { id: 'sub_men_tshirt', name: 'T-Shirts', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80' },
    { id: 'sub_men_roundneck', name: 'Round Neck', image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&q=80' },
  ];
  try {
    const cats = typeof window !== 'undefined'
      ? (() => { try { const s = localStorage.getItem('ktex_categories'); return s ? JSON.parse(s) : null; } catch { return null; } })()
      : null;
    const source = cats || categories;
    const menSubs = source.filter(c => (c.pageTypes || []).includes('Men') || (!c.pageTypes && c.name));
    if (menSubs.length > 0) return menSubs.map(c => ({ id: c.id || c.slug, name: c.name, image: c.image || '' }));
    return defaultSubs;
  } catch { return defaultSubs; }
}

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

export default function Men() {
  const location = useLocation();
  const { toggle: toggleWishlist, isWishlisted } = useWishlist();
  const [selected, setSelected] = useState('all');
  const [showDropdown, setShowDropdown] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Men's Collection — Premium Polo Shirts | K-TEX";
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('cat');
    if (cat) {
      let matchedId = cat;
      const menSubs = getMenSubCategories();
      const seg = menSubs.find(s => s.id === cat);
      if (!seg) {
        const catLower = cat.toLowerCase();
        const found = menSubs.find(s => {
          const idLower = s.id.toLowerCase();
          const nameLower = s.name.toLowerCase();
          return idLower.includes(catLower) || 
                 catLower.includes(idLower) || 
                 nameLower.includes(catLower.replace('sub_men_', '').replace('sub_women_', '')) ||
                 catLower.includes(nameLower.replace(' shirts', '').replace(' tops', ''));
        });
        if (found) matchedId = found.id;
      }
      setSelected(matchedId);
      setTimeout(() => {
        document.getElementById('men-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      setSelected('all');
    }
  }, [location.search]);

  const menSubs = getMenSubCategories();
  const allProducts = getProducts();
  const normalize = s => (s || '').toLowerCase().replace(/[\s-]/g, '');

  const matchesSubcategory = (p, subName) => {
    const name = p.name.toLowerCase();
    if (name.includes(subName)) return true;
    if (subName.endsWith('s') && name.includes(subName.slice(0, -1))) return true;
    return false;
  };

  const segmentProducts = menSubs.length > 0
    ? menSubs.map((sub, idx) => ({
        id: sub.id, name: sub.name, image: sub.image || '',
        products: allProducts.filter(p => {
          const isMen = p.pageType === 'Men' || p.tag === 'Men' || p.tag === 'men' || p.tag === 'T-Shirt';
          if (!isMen) return false;
          const pSub = (p.subCategory || '').toLowerCase();
          const subName = sub.name.toLowerCase();
          if (pSub === subName || normalize(pSub) === normalize(subName)) return true;
          if (matchesSubcategory(p, subName)) return true;
          if (idx === 0 && !p.subCategory && p.name.toLowerCase().includes('polo')) return true;
          return false;
        }),
      }))
    : [{ id: 'all-men', name: "Men's Collection", image: '', products: allProducts.filter(p => p.tag === 'Men' || p.tag === 'men' || p.tag === 'T-Shirt') }];

  const allMenProducts = allProducts.filter(p =>
    p.pageType === 'Men' || p.tag === 'Men' || p.tag === 'men' || p.tag === 'T-Shirt' ||
    segmentProducts.some(seg => seg.products.some(sp => sp.id === p.id))
  );

  const filterCategories = [{ key: 'all', label: 'Category' }, ...menSubs.map(s => ({ key: s.id, label: s.name }))];
  
  const filtered = selected === 'all' ? null : (() => {
    let seg = segmentProducts.find(s => s.id === selected);
    if (!seg) {
      const selLower = selected.toLowerCase();
      seg = segmentProducts.find(s => {
        const idLower = s.id.toLowerCase();
        const nameLower = s.name.toLowerCase();
        return idLower.includes(selLower) || 
               selLower.includes(idLower) || 
               nameLower.includes(selLower.replace('sub_men_', '').replace('sub_women_', '')) ||
               selLower.includes(nameLower.replace(' shirts', '').replace(' tops', ''));
      });
    }
    return seg ? { title: seg.name, products: seg.products } : null;
  })();

  return (
    <main style={{ background: 'linear-gradient(180deg, #0d0d12, #151318, #0d0d12)' }}>
      {/* Hero */}
      <section style={{ position: 'relative', width: '100%', height: '40vh', minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.4 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,13,18,0.3), rgba(13,13,18,0.9))' }} />
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#fff' }}>
          <span className="fade-up" style={{ display: 'inline-block', color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14, padding: '6px 20px', background: 'rgba(184,151,42,0.1)', border: '1px solid rgba(184,151,42,0.2)', borderRadius: 20 }}>K-TEX Men</span>
          <h1 className="fade-up" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, letterSpacing: '0.05em', margin: '0 0 12px' }}>Men's Collection</h1>
          <p className="fade-up-1" style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', maxWidth: 500, margin: '0 auto', color: 'rgba(255,255,255,0.6)' }}>
            Premium polos, tees & round necks — crafted for the modern gentleman.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="filter-bar" style={{
        background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 'var(--navbar-h)', zIndex: 40, backdropFilter: 'blur(20px)',
      }}>
        <div className="filter-bar-wrapper container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, padding: '12px 24px' }}>
          <div className="cat-tabs" style={{ display: 'flex', gap: 6 }}>
            {filterCategories.map(cat => (
              <button key={cat.key} onClick={() => { setSelected(cat.key); document.getElementById('men-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
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
          <div className="category-dropdown" style={{ position: 'relative', display: 'none' }}>
            <button onClick={() => setShowDropdown(!showDropdown)}
              style={{
                padding: '10px 16px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, width: '100%',
                border: '1px solid rgba(184,151,42,0.3)', background: 'rgba(255,255,255,0.05)', color: '#fff',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              }}>
              <span>{selected === 'all' ? 'Category' : filterCategories.find(c => c.key === selected)?.label}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            {showDropdown && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setShowDropdown(false)} />
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, zIndex: 50,
                  background: '#1a1a2e', border: '1px solid rgba(184,151,42,0.2)', borderRadius: 10,
                  overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                }}>
                  {filterCategories.map(cat => (
                    <button key={cat.key} onClick={() => { setSelected(cat.key); setShowDropdown(false); document.getElementById('men-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left', padding: '10px 18px', fontSize: '0.82rem',
                        fontWeight: selected === cat.key ? 700 : 500, border: 'none',
                        background: selected === cat.key ? 'rgba(184,151,42,0.12)' : 'transparent',
                        color: selected === cat.key ? 'var(--gold)' : '#a89b7d', cursor: 'pointer',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(184,151,42,0.08)'; e.currentTarget.style.color = 'var(--gold)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = selected === cat.key ? 'rgba(184,151,42,0.12)' : 'transparent'; e.currentTarget.style.color = selected === cat.key ? 'var(--gold)' : '#a89b7d'; }}
                    >{cat.label}</button>
                  ))}
                </div>
              </>
            )}
          </div>
          <span className="product-count" style={{ color: '#8a7d65', fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {selected === 'all' ? `${allMenProducts.length} Products` : `${filtered?.products.length ?? 0} Products`}
          </span>
        </div>
      </div>

      {/* Products */}
      <div id="men-products" style={{ padding: '10px 0 40px' }}>
        {selected === 'all'
          ? segmentProducts.map(seg => <ProductSegment key={seg.id} title={seg.name} products={seg.products} toggleWishlist={toggleWishlist} isWishlisted={isWishlisted} />)
          : filtered && <ProductSegment title={filtered.title} products={filtered.products} toggleWishlist={toggleWishlist} isWishlisted={isWishlisted} />
        }
      </div>

      <TrustBadges />
      <style>{`
        @media (max-width: 1024px) { .cat-tabs { gap: 4px !important; } .cat-tabs button { padding: 8px 14px !important; font-size: 0.78rem !important; } }
        @media (max-width: 768px) {
          .cat-tabs { display: none !important; }
          .category-dropdown { display: block !important; width: 100% !important; max-width: 220px !important; }
          .filter-bar-wrapper { flex-direction: column !important; align-items: stretch !important; gap: 10px !important; }
          .filter-bar-wrapper .container { flex-direction: column !important; align-items: stretch !important; }
        }
        @media (max-width: 600px) {
          .wishlist-btn { opacity: 1 !important; transform: translateY(0) !important; }
        }
      `}</style>
    </main>
  );
}

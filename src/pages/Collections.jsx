import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCollections, syncCollectionsFromBackend } from '../data';

function slugify(name) {
  return String(name || '')
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function Collections() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Curated Collections — Premium Polo Apparel | K-TEX";
    setItems(getCollections());
    syncCollectionsFromBackend().then(() => {
      setItems(getCollections());
    }).catch(() => {
      setItems(getCollections());
    });
  }, []);

  return (
    <main style={{ backgroundColor: 'var(--white)' }}>
      <section style={{ padding: '76px 0 26px' }}>
        <div className="container">
          <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '2.6rem', color: 'var(--black)' }}>
            Collections
          </h1>
          <p style={{ margin: '10px 0 0', color: 'var(--mid-gray)', maxWidth: 760 }}>
            Choose a collection to explore curated looks. Click any image to open its page.
          </p>
        </div>
      </section>

      <section style={{ padding: '26px 0 90px', backgroundColor: 'var(--light-gray)' }}>
        <div className="container">
          <div className="collection-grid" style={{ display: 'grid', gap: 16 }}>
            {items.map((c) => {
              const slug = slugify(c.name);
              return (
                <Link key={c.id} to={`/collections/${slug}`} className="collection-card"
                  style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', boxShadow: 'var(--shadow-sm)', minHeight: 280, background: '#eee', textDecoration: 'none' }}
                  onMouseEnter={(e) => { const img = e.currentTarget.querySelector('img'); if (img) img.style.transform = 'scale(1.08)'; }}
                  onMouseLeave={(e) => { const img = e.currentTarget.querySelector('img'); if (img) img.style.transform = 'scale(1)'; }}>
                  <img src={c.image} alt={c.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: 24, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }}>
                    <div>
                      <div style={{ color: '#d4af5a', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>Shop Now</div>
                      <div style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 800 }}>{c.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4 }}>{c.description}</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <style>{`
          .collection-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .collection-grid .collection-card:first-child { grid-column: span 2; grid-row: span 2; min-height: 440px !important; }
          @media (max-width: 820px) { .collection-grid { grid-template-columns: repeat(2, 1fr) !important; } .collection-grid a { min-height: 220px !important; } .collection-grid .collection-card:first-child { grid-column: span 2 !important; grid-row: span 1 !important; min-height: 260px !important; } }
        `}</style>
      </section>
    </main>
  );
}

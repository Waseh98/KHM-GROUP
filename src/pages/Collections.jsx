import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collections as cachedCollections, syncCollectionsFromBackend } from '../data';

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
    syncCollectionsFromBackend().then(() => {
      setItems([...cachedCollections]);
    }).catch(() => {
      setItems([...cachedCollections]);
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
            {items.map((c, idx) => {
              const isRow1 = idx < 3;
              const isTall = isRow1 && (idx === 0);
              const colSpan = isTall ? 3 : (isRow1 ? 3 : 3);
              const rowSpan = isTall ? 2 : 1;
              const slug = slugify(c.name);

              return (
                <Link key={c.id} to={`/collections/${slug}`} style={{ gridColumn: `span ${colSpan}`, gridRow: `span ${rowSpan}`, borderRadius: 16, overflow: 'hidden', position: 'relative', boxShadow: 'var(--shadow-sm)', minHeight: isTall ? 440 : 210, background: '#eee', textDecoration: 'none' }}
                  onMouseEnter={(e) => { const img = e.currentTarget.querySelector('img'); if (img) img.style.transform = 'scale(1.08)'; }}
                  onMouseLeave={(e) => { const img = e.currentTarget.querySelector('img'); if (img) img.style.transform = 'scale(1)'; }}>
                  <img src={c.image} alt={c.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: 24, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }}>
                    <div>
                      <div style={{ color: '#d4af5a', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>Shop Now</div>
                      <div style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontSize: isTall ? 28 : 20, fontWeight: 800 }}>{c.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4 }}>{c.description}</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <style>{`
          @media (max-width: 1024px) { .collection-grid a { min-height: 200px !important; } }
          @media (max-width: 820px) { .collection-grid { grid-template-columns: repeat(2, 1fr) !important; } .collection-grid a { min-height: 220px !important; } }
        `}</style>
      </section>
    </main>
  );
}

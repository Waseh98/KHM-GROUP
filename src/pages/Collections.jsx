import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../data';

function slugify(name) {
  return String(name || '')
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function Collections() {
  useEffect(() => {
    window.scrollTo(0, 0);
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
          <div
            className="collection-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: 18,
            }}
          >
            {categories.map((c, idx) => {
              const tall = Boolean(c.tall);
              const colSpan = tall ? 6 : 3;
              const rowSpan = tall ? 2 : 1;
              const slug = slugify(c.name);

              return (
                <Link
                  key={c.id}
                  to={`/collections/${slug}`}
                  style={{
                    gridColumn: `span ${colSpan}`,
                    gridRow: `span ${rowSpan}`,
                    borderRadius: 14,
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: 'var(--shadow-sm)',
                    minHeight: tall ? 420 : 200,
                    background: '#eee',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    const img = e.currentTarget.querySelector('img');
                    const overlay = e.currentTarget.querySelector('[data-overlay]');
                    if (img) img.style.transform = 'scale(1.06)';
                    if (overlay) overlay.style.backgroundColor = 'rgba(0,0,0,0.55)';
                  }}
                  onMouseLeave={(e) => {
                    const img = e.currentTarget.querySelector('img');
                    const overlay = e.currentTarget.querySelector('[data-overlay]');
                    if (img) img.style.transform = 'scale(1)';
                    if (overlay) overlay.style.backgroundColor = 'rgba(0,0,0,0.35)';
                  }}
                >
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    }}
                  />
                  <div
                    data-overlay
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: 22,
                      background:
                        'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.18) 55%, rgba(0,0,0,0.08) 100%)',
                      transition: 'background-color 0.35s ease',
                    }}
                  >
                    <div>
                      <div style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontSize: tall ? 34 : 22, fontWeight: 700 }}>
                        {c.name}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.86)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4 }}>
                        {c.subtitle}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .collection-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .collection-grid a { grid-column: span 1 !important; grid-row: span 1 !important; min-height: 240px !important; }
          }
          @media (max-width: 600px) {
            .collection-grid { grid-template-columns: 1fr !important; }
            .collection-grid a { min-height: 240px !important; }
          }
        `}</style>
      </section>
    </main>
  );
}


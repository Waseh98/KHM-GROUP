import { Link } from 'react-router-dom';

const SocialIcon = ({ type }) => {
  const icons = {
    instagram: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
    facebook: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
    tiktok: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
    whatsapp: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  };
  return icons[type] || null;
};

export default function Footer() {
  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'Men', to: '/men' },
    { label: 'Women', to: '/women' },
    { label: 'Kids', to: '/kids' },
    { label: 'New Arrivals', to: '/#new-arrivals' },
    { label: 'Sale', to: '/sale' },
    { label: 'About Us', to: '/about' },
    { label: 'Collections', to: '/collections' },
  ];

  const helpLinks = [
    { label: 'Track Order', to: '/track-order' },
    { label: 'Return Policy', to: '/return-policy' },
    { label: 'FAQs', to: '/faqs' },
    { label: 'Contact Us', to: '/contact' },
  ];

  const socials = [
    { name: 'Instagram', icon: 'instagram', href: '#' },
    { name: 'Facebook', icon: 'facebook', href: '#' },
    { name: 'TikTok', icon: 'tiktok', href: '#' },
    { name: 'WhatsApp', icon: 'whatsapp', href: '#' },
  ];

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #1a1510 0%, #2a2015 30%, #1e1812 60%, #15120d 100%)',
      color: '#c4b89a',
      paddingTop: '80px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative top border */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, transparent, var(--gold), var(--light-gold), var(--gold), transparent)',
      }} />

      {/* Subtle glow */}
      <div style={{
        position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '200px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(184,151,42,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '40px',
          marginBottom: '60px',
        }} className="footer-grid">

          {/* Col 1 - Brand */}
          <div>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--gold)',
              letterSpacing: '0.15em',
              margin: '0 0 16px 0',
            }}>
              K-TEX
            </h3>
            <p style={{
              fontSize: '0.88rem', lineHeight: 1.7,
              marginBottom: '28px', color: '#a89b7d',
            }}>
              Premium polo shirts crafted for Pakistan. Elevating everyday essentials with uncompromising quality.
            </p>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {socials.map(s => (
                <a
                  key={s.name}
                  href={s.href}
                  title={s.name}
                  style={{
                    width: '42px', height: '42px',
                    borderRadius: '10px',
                    background: 'rgba(184,151,42,0.1)',
                    border: '1px solid rgba(184,151,42,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--gold)',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--gold)';
                    e.currentTarget.style.color = '#1a1510';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(184,151,42,0.3)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(184,151,42,0.1)';
                    e.currentTarget.style.color = 'var(--gold)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <SocialIcon type={s.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 - Quick Links */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="quick-links-grid" style={{
              listStyle: 'none', padding: 0, margin: 0,
            }}>
              {quickLinks.map(link => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="footer-link"
                    style={{
                      fontSize: '0.88rem', color: '#a89b7d',
                      textDecoration: 'none', transition: 'all 0.2s ease',
                      display: 'inline-block', lineHeight: 1.6,
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 - Help */}
          <div>
            <h4 className="footer-heading">Help</h4>
            <ul style={{
              listStyle: 'none', padding: 0, margin: 0,
              display: 'flex', flexDirection: 'column', gap: '12px',
            }}>
              {helpLinks.map(link => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="footer-link"
                    style={{
                      fontSize: '0.88rem', color: '#a89b7d',
                      textDecoration: 'none', transition: 'all 0.2s ease',
                      display: 'inline-block', lineHeight: 1.6,
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 - Contact */}
          <div>
            <h4 className="footer-heading">Contact Info</h4>
            <ul style={{
              listStyle: 'none', padding: 0, margin: 0,
              display: 'flex', flexDirection: 'column', gap: '16px',
            }}>
              {[
                { icon: '📞', text: '0333-0557783' },
                { icon: '✉️', text: 'abdulwasay@khm.ae' },
                { icon: '📍', text: 'Islamabad, Pakistan' },
              ].map((item, i) => (
                <li key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  fontSize: '0.88rem', color: '#a89b7d',
                }}>
                  <span style={{
                    width: '36px', height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(184,151,42,0.1)',
                    border: '1px solid rgba(184,151,42,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem', flexShrink: 0,
                  }}>
                    {item.icon}
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(184,151,42,0.15)',
          padding: '24px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }} className="footer-bottom">
          <p style={{ fontSize: '0.83rem', margin: 0, color: '#8a7d65' }}>
            &copy; {new Date().getFullYear()} K-TEX. All rights reserved.
          </p>
          <div style={{
            display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap',
          }}>
            {['JazzCash', 'EasyPaisa', 'Bank Transfer', 'Visa', 'Mastercard'].map((method) => (
              <span key={method} style={{
                padding: '4px 12px',
                borderRadius: '6px',
                background: 'rgba(184,151,42,0.08)',
                border: '1px solid rgba(184,151,42,0.15)',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--gold)',
                letterSpacing: '0.03em',
              }}>
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .footer-heading {
          font-family: var(--font-heading);
          color: var(--gold);
          font-size: 1.15rem;
          margin: 0 0 24px 0;
          font-weight: 600;
        }
        .footer-link:hover {
          color: var(--gold) !important;
          padding-left: 6px;
        }
        .quick-links-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px 24px;
        }
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 820px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 24px !important;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
          .quick-links-grid {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
        }
      `}</style>
    </footer>
  );
}

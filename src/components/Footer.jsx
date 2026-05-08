import React from 'react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--black)', color: '#a09e99', paddingTop: '80px' }}>
      <div className="container">
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '40px',
          marginBottom: '60px'
        }} className="footer-grid">
          
          {/* Col 1 */}
          <div>
            <h3 style={{
              fontFamily: "var(--font-heading)",
              fontSize: '1.75rem',
              fontWeight: 700,
              color: 'var(--white)',
              letterSpacing: '0.12em',
              margin: '0 0 20px 0'
            }}>K-TEX</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Premium polo shirts crafted for Pakistan. Elevating everyday essentials with uncompromising quality.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              {['Instagram', 'Facebook', 'TikTok', 'WhatsApp'].map(social => (
                <a key={social} href="#" style={{ color: 'var(--white)', fontSize: '0.85rem' }} className="hover-white">
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Home', 'Men', 'Women', 'New Arrivals', 'Sale', 'About Us'].map(link => (
                <li key={link}>
                  <a href="#" className="hover-white" style={{ fontSize: '0.9rem' }}>{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="footer-heading">Help</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Track Order', 'Returns', 'Size Guide', 'FAQs', 'Contact Us'].map(link => (
                <li key={link}>
                  <a href="#" className="hover-white" style={{ fontSize: '0.9rem' }}>{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="footer-heading">Contact Info</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
                <span style={{ fontSize: '1.2rem' }}>📞</span> 0300-1234567
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
                <span style={{ fontSize: '1.2rem' }}>✉️</span> hello@ktex.com
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
                <span style={{ fontSize: '1.2rem' }}>📍</span> Rawalpindi, Pakistan
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #1e1e1e',
          padding: '24px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }} className="footer-bottom">
          <p style={{ fontSize: '0.85rem', margin: 0 }}>
            &copy; {new Date().getFullYear()} K-TEX. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '12px', color: 'var(--white)', fontSize: '0.85rem', fontWeight: 600 }}>
            <span>JazzCash</span> • <span>EasyPaisa</span> • <span>COD</span> • <span>Visa</span> • <span>Mastercard</span>
          </div>
        </div>

      </div>

      <style>{`
        .footer-heading {
          font-family: var(--font-heading);
          color: var(--white);
          font-size: 1.25rem;
          margin: 0 0 24px 0;
          font-weight: 500;
        }
        .hover-white {
          transition: color 0.2s;
        }
        .hover-white:hover {
          color: var(--white) !important;
        }
        
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}

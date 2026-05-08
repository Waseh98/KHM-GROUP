export default function TrustBadges() {
  const badges = [
    {
      icon: "🚚",
      title: "Free Delivery",
      desc: "On orders above Rs. 2,000"
    },
    {
      icon: "🔄",
      title: "Size/Color Exchange",
      desc: "Customer pays delivery charges"
    },
    {
      icon: "🛡️",
      title: "100% Authentic",
      desc: "Genuine quality guaranteed"
    },
    {
      icon: "💳",
      title: "Secure Payment",
      desc: "JazzCash, EasyPaisa, COD, Visa"
    }
  ];

  return (
    <section style={{ backgroundColor: 'var(--white)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
        }} className="trust-grid">
          
          {badges.map((badge, idx) => (
            <div key={idx} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '40px 20px',
              borderRight: idx !== badges.length - 1 ? '1px solid var(--border)' : 'none'
            }} className={`trust-item ${idx % 2 !== 0 ? 'no-border-mobile' : ''}`}>
              
              <div style={{ fontSize: '2rem', marginBottom: '16px' }}>
                {badge.icon}
              </div>
              
              <h4 style={{
                fontFamily: "var(--font-heading)",
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--black)',
                margin: '0 0 8px 0'
              }}>{badge.title}</h4>
              
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: '0.85rem',
                color: 'var(--mid-gray)',
                margin: 0
              }}>{badge.desc}</p>

            </div>
          ))}

        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .trust-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .trust-item {
            border-bottom: 1px solid var(--border);
          }
          .trust-item:nth-last-child(-n+2) {
            border-bottom: none;
          }
          .no-border-mobile {
            border-right: none !important;
          }
        }
        @media (max-width: 600px) {
          .trust-grid {
            grid-template-columns: 1fr !important;
          }
          .trust-item {
            border-right: none !important;
            border-bottom: 1px solid var(--border);
            padding: 30px 20px !important;
          }
          .trust-item:last-child {
            border-bottom: none;
          }
        }
      `}</style>
    </section>
  );
}

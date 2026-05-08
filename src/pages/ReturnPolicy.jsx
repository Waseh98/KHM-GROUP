import { Link } from 'react-router-dom';

const policyPoints = [
  {
    title: 'Exchange reason',
    text: 'Products can be exchanged only for size change or color change.',
  },
  {
    title: 'Delivery charges',
    text: 'All exchange delivery charges must be paid by the customer.',
  },
  {
    title: 'Product condition',
    text: 'The item must be unused, unwashed, undamaged, and returned with original tags and packaging.',
  },
  {
    title: 'Refunds',
    text: 'Refund returns are not available for change of mind. Eligible requests are handled as size or color exchanges only.',
  },
];

export default function ReturnPolicy() {
  return (
    <main className="return-page">
      <section className="return-hero">
        <div className="container return-hero-grid">
          <div>
            <p>Customer policy</p>
            <h1>Return and exchange policy</h1>
            <span>
              Please read this policy before placing your order. K-TEX accepts exchanges only for size or color changes.
            </span>
          </div>
          <div className="return-highlight">
            Size or color exchange only. Customer pays delivery charges.
          </div>
        </div>
      </section>

      <section className="return-section">
        <div className="container return-grid">
          <div className="return-card">
            <h2>Policy details</h2>
            <div className="return-point-grid">
              {policyPoints.map((point) => (
                <article key={point.title}>
                  <strong>{point.title}</strong>
                  <p>{point.text}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="return-steps">
            <h2>How to request an exchange</h2>
            <ol>
              <li>Contact support with your order number.</li>
              <li>Tell us the required size or color change.</li>
              <li>Keep the product unused with tags attached.</li>
              <li>Pay the applicable delivery charges for the exchange shipment.</li>
            </ol>
            <Link to="/contact">Contact support</Link>
          </aside>
        </div>
      </section>

      <style>{`
        .return-page {
          min-height: 100vh;
          background: var(--bg);
        }
        .return-hero {
          background: #0d0d0d;
          color: var(--white);
          padding: 82px 0 64px;
        }
        .return-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
          gap: 34px;
          align-items: end;
        }
        .return-hero p {
          color: var(--gold);
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin: 0 0 14px;
        }
        .return-hero h1 {
          font-family: var(--font-heading);
          font-size: clamp(2.4rem, 5vw, 4.6rem);
          line-height: 1;
          margin: 0 0 18px;
        }
        .return-hero span {
          display: block;
          max-width: 680px;
          color: #d8d4ca;
          font-size: 1rem;
        }
        .return-highlight {
          border: 1px solid #3a3320;
          background: #16140f;
          color: #f3ead2;
          border-radius: 8px;
          padding: 26px;
          font-size: 1.25rem;
          line-height: 1.45;
          font-weight: 800;
          box-shadow: var(--shadow-lg);
        }
        .return-section {
          padding: 54px 0 84px;
        }
        .return-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 360px;
          gap: 28px;
          align-items: start;
        }
        .return-card,
        .return-steps {
          background: var(--white);
          border: 1px solid #e8e2d6;
          border-radius: 8px;
          padding: 32px;
          box-shadow: 0 14px 36px rgba(13, 13, 13, 0.07);
        }
        .return-card h2,
        .return-steps h2 {
          font-family: var(--font-heading);
          font-size: 2rem;
          line-height: 1.1;
          margin: 0 0 22px;
        }
        .return-point-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }
        .return-point-grid article {
          border: 1px solid #eee6d8;
          border-radius: 8px;
          padding: 22px;
          min-height: 154px;
          background: #fbfaf7;
        }
        .return-point-grid strong {
          display: block;
          color: var(--black);
          font-size: 1rem;
          margin-bottom: 8px;
        }
        .return-point-grid p {
          color: var(--mid-gray);
          margin: 0;
          line-height: 1.65;
          font-size: 0.93rem;
        }
        .return-steps {
          position: sticky;
          top: 100px;
        }
        .return-steps ol {
          margin: 0 0 22px;
          padding-left: 20px;
          color: var(--mid-gray);
          line-height: 1.8;
        }
        .return-steps li {
          padding-left: 4px;
        }
        .return-steps a {
          display: block;
          background: var(--black);
          color: var(--white);
          border-radius: 8px;
          padding: 13px 16px;
          text-align: center;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: var(--transition);
        }
        .return-steps a:hover {
          background: var(--gold);
        }
        @media (max-width: 900px) {
          .return-hero-grid,
          .return-grid {
            grid-template-columns: 1fr;
          }
          .return-steps {
            position: static;
          }
        }
        @media (max-width: 600px) {
          .return-hero {
            padding: 56px 0 42px;
          }
          .return-section {
            padding: 34px 0 58px;
          }
          .return-card,
          .return-steps {
            padding: 24px;
          }
          .return-point-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

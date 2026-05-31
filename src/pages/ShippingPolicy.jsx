import { Link } from 'react-router-dom';

export default function ShippingPolicy() {
  return (
    <main className="policy-page">
      <section className="policy-hero">
        <div className="container">
          <p>K-TEX Policy</p>
          <h1>Shipping Policy</h1>
          <span>We deliver across Pakistan with speed and care. Here&apos;s everything you need to know.</span>
        </div>
      </section>

      <section className="policy-section">
        <div className="container policy-grid">
          <div className="policy-card">
            <h2>Delivery timeline</h2>
            <div className="policy-list">
              <article><strong>Within Rawalpindi / Islamabad</strong><p>1–2 working days</p></article>
              <article><strong>Major cities (Karachi, Lahore, Faisalabad, etc.)</strong><p>2–4 working days</p></article>
              <article><strong>Smaller cities / remote areas</strong><p>4–7 working days</p></article>
            </div>
          </div>

          <div className="policy-card">
            <h2>Shipping charges</h2>
            <div className="policy-list">
              <article><strong>Orders above Rs. 2,000</strong><p>Free express shipping</p></article>
              <article><strong>Orders below Rs. 2,000</strong><p>A flat Rs. 150 shipping fee applies</p></article>
            </div>
          </div>

          <div className="policy-card">
            <h2>Order processing</h2>
            <div className="policy-list">
              <article><strong>Processing time</strong><p>Orders are processed within 24 hours of confirmation (excluding Sundays &amp; public holidays)</p></article>
              <article><strong>Dispatch</strong><p>You will receive a tracking number via WhatsApp / SMS once your order is dispatched</p></article>
            </div>
          </div>

          <div className="policy-card">
            <h2>Delivery partners</h2>
            <div className="policy-list">
              <article><strong>Leopards Courier</strong><p>Primary partner for most cities across Pakistan</p></article>
              <article><strong>TCS / Trax / BlueEx</strong><p>Used for specific regions and remote areas</p></article>
            </div>
          </div>

          <div className="policy-card full-width">
            <h2>Important notes</h2>
            <ul>
              <li>Delivery times are estimates and may vary during peak seasons (Eid, Black Friday, etc.)</li>
              <li>A signature may be required upon delivery</li>
              <li>If you are unavailable, the courier will attempt re-delivery or hold at the nearest hub</li>
              <li>Cash on Delivery orders require payment in full before opening the parcel</li>
            </ul>
          </div>
        </div>

        <aside className="policy-cta">
          <p>Have a question about shipping?</p>
          <Link to="/contact">Contact support</Link>
        </aside>
      </section>

      <style>{`
        .policy-page { min-height: 100vh; background: var(--bg); }
        .policy-hero { background: #0d0d0d; color: var(--white); padding: 82px 0 64px; }
        .policy-hero p { color: var(--gold); font-size: 0.78rem; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; margin: 0 0 14px; }
        .policy-hero h1 { font-family: var(--font-heading); font-size: clamp(2.4rem, 5vw, 4.6rem); line-height: 1; margin: 0 0 18px; }
        .policy-hero span { display: block; max-width: 680px; color: #d8d4ca; font-size: 1rem; }
        .policy-section { padding: 54px 0 84px; }
        .policy-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 40px; }
        .policy-card { background: var(--white); border: 1px solid #e8e2d6; border-radius: 8px; padding: 28px; box-shadow: 0 14px 36px rgba(13,13,13,0.07); }
        .policy-card.full-width { grid-column: 1 / -1; }
        .policy-card h2 { font-family: var(--font-heading); font-size: 1.6rem; line-height: 1.1; margin: 0 0 18px; }
        .policy-list { display: flex; flex-direction: column; gap: 14px; }
        .policy-list article { border: 1px solid #eee6d8; border-radius: 8px; padding: 16px; background: #fbfaf7; }
        .policy-list strong { display: block; color: var(--black); font-size: 0.95rem; margin-bottom: 4px; }
        .policy-list p { color: var(--mid-gray); margin: 0; line-height: 1.55; font-size: 0.88rem; }
        .policy-card ul { margin: 0; padding-left: 20px; color: var(--mid-gray); line-height: 1.8; }
        .policy-card ul li { margin-bottom: 8px; }
        .policy-cta { text-align: center; background: var(--white); border: 1px solid #e8e2d6; border-radius: 8px; padding: 32px; box-shadow: 0 14px 36px rgba(13,13,13,0.07); }
        .policy-cta p { font-size: 1.1rem; margin: 0 0 16px; color: var(--black); font-weight: 600; }
        .policy-cta a { display: inline-block; background: var(--black); color: var(--white); border-radius: 8px; padding: 13px 32px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; transition: var(--transition); text-decoration: none; }
        .policy-cta a:hover { background: var(--gold); }
        @media (max-width: 820px) { .policy-grid { grid-template-columns: 1fr; } }
        @media (max-width: 600px) { .policy-hero { padding: 56px 0 42px; } .policy-section { padding: 34px 0 58px; } .policy-card { padding: 20px; } }
      `}</style>
    </main>
  );
}

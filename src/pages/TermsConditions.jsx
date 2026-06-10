import { Link } from 'react-router-dom';

export default function TermsConditions() {
  return (
    <main className="policy-page">
      <section className="policy-hero">
        <div className="container">
          <p>K-TEX Policy</p>
          <h1>Terms &amp; Conditions</h1>
          <span>Please read these terms carefully before using our website or placing an order.</span>
        </div>
      </section>

      <section className="policy-section">
        <div className="container policy-stack">
          <div className="policy-card">
            <h2>General</h2>
            <p>By accessing or purchasing from ktexstore.com, you agree to be bound by these Terms &amp; Conditions. If you do not agree, please do not use our site. K-TEX reserves the right to update these terms at any time.</p>
          </div>

          <div className="policy-card">
            <h2>Products &amp; pricing</h2>
            <ul>
              <li>All prices are listed in Pakistani Rupees (PKR) and inclusive of applicable taxes</li>
              <li>Product images are for illustration; actual product may vary slightly</li>
              <li>We strive for accurate color representation, but screen variations may occur</li>
              <li>Prices and promotions are subject to change without prior notice</li>
            </ul>
          </div>

          <div className="policy-card">
            <h2>Orders &amp; payment</h2>
            <ul>
              <li>Order placement constitutes an offer to purchase; we reserve the right to accept or decline</li>
              <li>Payment must be completed before order processing begins</li>
              <li>We accept EasyPaisa, JazzCash, Bank Transfer, and Cash on Delivery</li>
              <li>Orders are subject to stock availability; if an item is out of stock, we will notify you</li>
            </ul>
          </div>

          <div className="policy-card">
            <h2>Cancellations</h2>
            <p>Orders can be cancelled within 2 hours of placement. After processing has begun, cancellations may not be possible. Please contact support immediately if you need to cancel.</p>
          </div>

          <div className="policy-card">
            <h2>Intellectual property</h2>
            <p>All content on ktexstore.com — including logos, text, images, and product designs — is the property of K-TEX and may not be reproduced, distributed, or used without written permission.</p>
          </div>

          <div className="policy-card">
            <h2>Limitation of liability</h2>
            <p>K-TEX shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products. Our total liability is limited to the purchase price of the product in question.</p>
          </div>

          <div className="policy-card">
            <h2>Governing law</h2>
            <p>These terms are governed by the laws of Pakistan. Any disputes shall be subject to the jurisdiction of courts in Rawalpindi/Islamabad, Pakistan.</p>
          </div>

          <div className="policy-card">
            <h2>Contact</h2>
            <p>For questions regarding these terms, reach out at <strong>ktexstore.pk@gmail.com</strong> or via our <Link to="/contact" style={{color: 'var(--gold)', textDecoration: 'underline'}}>contact page</Link>.</p>
          </div>
        </div>
      </section>

      <style>{`
        .policy-page { min-height: 100vh; background: var(--bg); }
        .policy-hero { background: #0d0d0d; color: var(--white); padding: 82px 0 64px; }
        .policy-hero p { color: var(--gold); font-size: 0.78rem; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; margin: 0 0 14px; }
        .policy-hero h1 { font-family: var(--font-heading); font-size: clamp(2.4rem, 5vw, 4.6rem); line-height: 1; margin: 0 0 18px; }
        .policy-hero span { display: block; max-width: 680px; color: #d8d4ca; font-size: 1rem; }
        .policy-section { padding: 54px 0 84px; }
        .policy-stack { display: flex; flex-direction: column; gap: 20px; max-width: 860px; margin: 0 auto; }
        .policy-card { background: var(--white); border: 1px solid #e8e2d6; border-radius: 8px; padding: 28px; box-shadow: 0 14px 36px rgba(13,13,13,0.07); }
        .policy-card h2 { font-family: var(--font-heading); font-size: 1.6rem; line-height: 1.1; margin: 0 0 14px; }
        .policy-card p { color: var(--mid-gray); line-height: 1.65; margin: 0 0 12px; font-size: 0.95rem; }
        .policy-card ul { margin: 0; padding-left: 20px; color: var(--mid-gray); line-height: 1.8; }
        .policy-card ul li { margin-bottom: 6px; }
        @media (max-width: 600px) { .policy-hero { padding: 56px 0 42px; } .policy-section { padding: 34px 0 58px; } .policy-card { padding: 20px; } }
      `}</style>
    </main>
  );
}

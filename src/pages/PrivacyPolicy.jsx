import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <main className="policy-page">
      <section className="policy-hero">
        <div className="container">
          <p>K-TEX Policy</p>
          <h1>Privacy Policy</h1>
          <span>We respect your privacy. This policy explains how we collect, use, and protect your personal data.</span>
        </div>
      </section>

      <section className="policy-section">
        <div className="container policy-stack">
          <div className="policy-card">
            <h2>Information we collect</h2>
            <p>When you place an order or create an account, we collect:</p>
            <ul>
              <li><strong>Personal details:</strong> full name, email address, phone number, shipping address</li>
              <li><strong>Order data:</strong> products purchased, payment method, order history</li>
              <li><strong>Communication:</strong> messages sent via our contact form or WhatsApp</li>
              <li><strong>Technical data:</strong> IP address, browser type, device information for analytics</li>
            </ul>
          </div>

          <div className="policy-card">
            <h2>How we use your information</h2>
            <ul>
              <li>To process and deliver your orders</li>
              <li>To communicate order updates via WhatsApp, SMS, or email</li>
              <li>To improve our products, website, and customer experience</li>
              <li>To send promotional offers (only with your consent)</li>
              <li>To prevent fraud and ensure secure transactions</li>
            </ul>
          </div>

          <div className="policy-card">
            <h2>Data protection</h2>
            <p>We implement industry-standard security measures including SSL encryption, secure payment gateways, and restricted data access. Your payment details are processed securely through third-party providers and are never stored on our servers.</p>
          </div>

          <div className="policy-card">
            <h2>Data sharing</h2>
            <p>We do not sell, trade, or share your personal data with third parties except:</p>
            <ul>
              <li>Courier &amp; logistics partners for order delivery</li>
              <li>Payment processors for transaction handling</li>
              <li>When required by law or to protect our legal rights</li>
            </ul>
          </div>

          <div className="policy-card">
            <h2>Your rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data held by us</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data (subject to legal obligations)</li>
              <li>Withdraw consent for marketing communications at any time</li>
            </ul>
          </div>

          <div className="policy-card">
            <h2>Contact</h2>
            <p>For any privacy-related inquiries, please contact us at <strong>ktexstore.pk@gmail.com</strong> or via our <Link to="/contact" style={{color: 'var(--gold)', textDecoration: 'underline'}}>contact page</Link>.</p>
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

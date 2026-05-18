import { useState } from 'react';
import { Link } from 'react-router-dom';

const contactCards = [
  {
    label: 'Call us',
    title: '0333-0557783',
    text: 'Monday to Saturday, 9:00 AM - 6:00 PM',
    path: 'tel:0333-0557783',
  },
  {
    label: 'Email',
    title: 'abdulwasay@khm.ae',
    text: 'For orders, exchanges, and product questions',
    path: 'mailto:hello@ktex.com',
  },
  {
    label: 'Location',
    title: 'Islamabad Pakistan',
    text: 'Serving customers across Pakistan',
    path: '#contact-form',
  },
];

const quickHelp = [
  { title: 'Track your order', text: 'Check your latest order status with your tracking ID.', to: '/track-order' },
  { title: 'FAQs', text: 'Find answers about orders, delivery, payment, and sizing.', to: '/faqs' },
  { title: 'Return policy', text: 'Read our size and color exchange policy before ordering.', to: '/return-policy' },
];

function ContactIcon() {
  return (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.91.33 1.79.62 2.63a2 2 0 0 1-.45 2.11L8 9.74a16 16 0 0 0 6.26 6.26l1.28-1.28a2 2 0 0 1 2.11-.45c.84.29 1.72.5 2.63.62A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Save message to localStorage for Admin panel
    const existingMessages = JSON.parse(localStorage.getItem('ktex_messages') || '[]');
    const newMessage = {
      id: Date.now().toString(),
      ...formData,
      date: new Date().toISOString(),
      status: 'unread'
    };
    localStorage.setItem('ktex_messages', JSON.stringify([newMessage, ...existingMessages]));

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="container contact-hero-grid">
          <div className="fade-up">
            <p className="contact-kicker">Customer support</p>
            <h1>Contact K-TEX</h1>
            <p>
              Need help with an order, size, color, or exchange request? Send us a message and our team will guide you with clear next steps.
            </p>
          </div>

          <div className="contact-hero-panel fade-up-1">
            <ContactIcon />
            <span>Fast support for orders, delivery updates, sizing help, and exchange requests.</span>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="container">
          <div className="contact-card-grid fade-up-1">
            {contactCards.map((item) => (
              <a className="contact-info-card" href={item.path} key={item.label}>
                <span>{item.label}</span>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </a>
            ))}
          </div>

          <div className="contact-main-grid">
            <div className="contact-form-card fade-up-2" id="contact-form">
              <div className="contact-section-heading">
                <h2>Send a message</h2>
                <p>Share your order number if your question is about an existing order.</p>
              </div>

              {submitted ? (
                <div className="contact-success">
                  <strong>Message received.</strong>
                  <span>Thank you. Our team will contact you shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="contact-form-row">
                    <label>
                      Name
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your name" />
                    </label>
                    <label>
                      Email
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" />
                    </label>
                  </div>

                  <div className="contact-form-row">
                    <label>
                      Phone
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="0300-1234567" />
                    </label>
                    <label>
                      Subject
                      <input type="text" name="subject" value={formData.subject} onChange={handleChange} required placeholder="Order, exchange, or sizing" />
                    </label>
                  </div>

                  <label>
                    Message
                    <textarea name="message" value={formData.message} onChange={handleChange} required rows="6" placeholder="How can we help you?" />
                  </label>

                  <button type="submit">Send message</button>
                </form>
              )}
            </div>

            <aside className="contact-help-card fade-up-3">
              <h2>Quick help</h2>
              <p className="contact-help-intro">Most common customer questions are covered here.</p>
              <div className="contact-help-list">
                {quickHelp.map((item) => (
                  <Link to={item.to} key={item.title}>
                    <strong>{item.title}</strong>
                    <span>{item.text}</span>
                  </Link>
                ))}
              </div>
              <div className="contact-note">
                Exchange note: size or color exchange is available only when the item is unused and eligible. Delivery charges are paid by the customer.
              </div>
            </aside>
          </div>
        </div>
      </section>

      <style>{`
        .contact-page {
          background: var(--bg);
          min-height: 100vh;
        }
        .contact-hero {
          background: #0d0d0d;
          color: var(--white);
          padding: 88px 0 70px;
        }
        .contact-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
          gap: 40px;
          align-items: end;
        }
        .contact-kicker {
          color: var(--gold);
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin: 0 0 14px;
        }
        .contact-hero h1 {
          font-family: var(--font-heading);
          font-size: clamp(2.6rem, 6vw, 5.2rem);
          line-height: 0.95;
          margin: 0 0 22px;
          font-weight: 700;
        }
        .contact-hero p {
          max-width: 680px;
          color: #d8d4ca;
          font-size: 1.02rem;
          margin: 0;
        }
        .contact-hero-panel {
          border: 1px solid #2b2b2b;
          background: #151515;
          border-radius: 8px;
          padding: 24px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
          color: #ebe7dd;
          box-shadow: var(--shadow-lg);
        }
        .contact-hero-panel svg {
          color: var(--gold);
          flex: 0 0 auto;
          margin-top: 2px;
        }
        .contact-section {
          padding: 56px 0 86px;
        }
        .contact-card-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-bottom: 34px;
        }
        .contact-info-card {
          background: var(--white);
          border: 1px solid #e8e2d6;
          border-radius: 8px;
          padding: 24px;
          min-height: 150px;
          transition: var(--transition);
          box-shadow: 0 10px 30px rgba(13, 13, 13, 0.06);
        }
        .contact-info-card:hover {
          transform: translateY(-3px);
          border-color: var(--gold);
        }
        .contact-info-card span {
          display: block;
          color: var(--gold);
          font-size: 0.78rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 10px;
        }
        .contact-info-card strong {
          display: block;
          font-family: var(--font-heading);
          color: var(--black);
          font-size: 1.45rem;
          line-height: 1.1;
          margin-bottom: 10px;
        }
        .contact-info-card p {
          color: var(--mid-gray);
          font-size: 0.92rem;
          margin: 0;
        }
        .contact-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.55fr) minmax(300px, 0.85fr);
          gap: 28px;
          align-items: start;
        }
        .contact-form-card,
        .contact-help-card {
          background: var(--white);
          border: 1px solid #e8e2d6;
          border-radius: 8px;
          padding: 34px;
          box-shadow: 0 14px 36px rgba(13, 13, 13, 0.07);
        }
        .contact-section-heading h2,
        .contact-help-card h2 {
          font-family: var(--font-heading);
          font-size: 2rem;
          line-height: 1.1;
          margin: 0 0 8px;
        }
        .contact-section-heading p,
        .contact-help-intro {
          color: var(--mid-gray);
          margin: 0 0 24px;
          font-size: 0.95rem;
        }
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .contact-form-row {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }
        .contact-form label {
          display: flex;
          flex-direction: column;
          gap: 8px;
          color: var(--black);
          font-size: 0.86rem;
          font-weight: 800;
          letter-spacing: 0.02em;
        }
        .contact-form input,
        .contact-form textarea {
          width: 100%;
          border: 1px solid #ddd5c8;
          background: #fbfaf7;
          border-radius: 8px;
          padding: 14px 15px;
          color: var(--black);
          font-family: var(--font-body);
          font-size: 0.96rem;
          outline: none;
          transition: var(--transition);
        }
        .contact-form textarea {
          resize: vertical;
          min-height: 150px;
        }
        .contact-form input:focus,
        .contact-form textarea:focus {
          border-color: var(--gold);
          background: var(--white);
          box-shadow: 0 0 0 3px rgba(184, 151, 42, 0.14);
        }
        .contact-form button {
          align-self: flex-start;
          background: var(--black);
          color: var(--white);
          border-radius: 8px;
          padding: 15px 24px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: var(--transition);
        }
        .contact-form button:hover {
          background: var(--gold);
          transform: translateY(-2px);
        }
        .contact-success {
          border: 1px solid #bbf7d0;
          background: #f0fdf4;
          color: #166534;
          border-radius: 8px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .contact-help-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .contact-help-list a {
          border: 1px solid #ece6d9;
          border-radius: 8px;
          padding: 16px;
          transition: var(--transition);
        }
        .contact-help-list a:hover {
          border-color: var(--gold);
          background: #fbfaf7;
        }
        .contact-help-list strong {
          display: block;
          color: var(--black);
          margin-bottom: 4px;
        }
        .contact-help-list span {
          display: block;
          color: var(--mid-gray);
          font-size: 0.88rem;
          line-height: 1.55;
        }
        .contact-note {
          margin-top: 20px;
          background: #0d0d0d;
          color: #efe9da;
          border-radius: 8px;
          padding: 18px;
          font-size: 0.9rem;
          line-height: 1.6;
        }
        @media (max-width: 900px) {
          .contact-hero-grid,
          .contact-main-grid {
            grid-template-columns: 1fr;
          }
          .contact-card-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 820px) {
          .contact-hero-grid,
          .contact-main-grid {
            grid-template-columns: 1fr;
          }
          .contact-card-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .contact-hero {
            padding: 58px 0 46px;
          }
          .contact-section {
            padding: 34px 0 58px;
          }
          .contact-form-card,
          .contact-help-card {
            padding: 24px;
          }
          .contact-form-row {
            grid-template-columns: 1fr;
          }
          .contact-form button {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}

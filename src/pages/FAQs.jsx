import { useState } from 'react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: 'How long does delivery take?',
    answer: 'Standard delivery usually takes 3 to 5 business days after order confirmation. Delivery time can vary by city and courier schedule.',
  },
  {
    question: 'Do you offer Cash on Delivery?',
    answer: 'Yes, Cash on Delivery is available across Pakistan. JazzCash, EasyPaisa, Visa, and Mastercard options may also be available at checkout.',
  },
  {
    question: 'Can I exchange my polo shirt?',
    answer: 'Yes. Exchange is available only for size or color change, and the item must be unused, unwashed, and in original condition with tags.',
  },
  {
    question: 'Who pays delivery charges for an exchange?',
    answer: 'The customer pays all delivery charges for size or color exchange requests.',
  },
  {
    question: 'Can I return a product for a refund?',
    answer: 'Refund returns are not offered for change of mind. We only support eligible size or color exchanges.',
  },
  {
    question: 'How do I track my order?',
    answer: 'Use the Track Order page and enter your tracking ID or order number to see the latest status.',
  },
  {
    question: 'How do I choose the right size?',
    answer: 'Check the product size guide before ordering. If you are between two sizes, choose the larger size for a more relaxed polo fit.',
  },
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <main className="info-page faq-page">
      <section className="info-hero">
        <div className="container">
          <p>Help center</p>
          <h1>Frequently asked questions</h1>
          <span>Quick answers about ordering, payment, delivery, sizing, and exchanges.</span>
        </div>
      </section>

      <section className="info-section">
        <div className="container info-grid">
          <div className="faq-list">
            {faqs.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <article className="faq-item" key={item.question}>
                  <button onClick={() => setOpenIndex(isOpen ? -1 : index)} aria-expanded={isOpen}>
                    <span>{item.question}</span>
                    <strong>{isOpen ? '-' : '+'}</strong>
                  </button>
                  {isOpen && <p>{item.answer}</p>}
                </article>
              );
            })}
          </div>

          <aside className="info-side-card">
            <h2>Still need help?</h2>
            <p>Send us your order number and question. We will guide you with the next step.</p>
            <Link to="/contact">Contact support</Link>
            <Link to="/track-order" className="secondary-link">Track order</Link>
          </aside>
        </div>
      </section>

      <style>{`
        .info-page {
          min-height: 100vh;
          background: var(--bg);
        }
        .info-hero {
          background: #0d0d0d;
          color: var(--white);
          padding: 82px 0 62px;
        }
        .info-hero p {
          color: var(--gold);
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin: 0 0 14px;
        }
        .info-hero h1 {
          font-family: var(--font-heading);
          font-size: clamp(2.4rem, 5vw, 4.6rem);
          line-height: 1;
          margin: 0 0 18px;
        }
        .info-hero span {
          display: block;
          max-width: 680px;
          color: #d8d4ca;
          font-size: 1rem;
        }
        .info-section {
          padding: 54px 0 84px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 340px;
          gap: 28px;
          align-items: start;
        }
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .faq-item {
          background: var(--white);
          border: 1px solid #e8e2d6;
          border-radius: 8px;
          box-shadow: 0 12px 32px rgba(13, 13, 13, 0.06);
          overflow: hidden;
        }
        .faq-item button {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 22px 24px;
          color: var(--black);
          text-align: left;
          font-weight: 800;
          font-size: 1rem;
        }
        .faq-item button strong {
          color: var(--gold);
          font-size: 1.5rem;
          line-height: 1;
          min-width: 18px;
          text-align: center;
        }
        .faq-item p {
          color: var(--mid-gray);
          margin: 0;
          padding: 0 24px 24px;
          line-height: 1.7;
        }
        .info-side-card {
          background: var(--white);
          border: 1px solid #e8e2d6;
          border-radius: 8px;
          padding: 28px;
          box-shadow: 0 14px 36px rgba(13, 13, 13, 0.07);
          position: sticky;
          top: 100px;
        }
        .info-side-card h2 {
          font-family: var(--font-heading);
          font-size: 2rem;
          line-height: 1.1;
          margin: 0 0 10px;
        }
        .info-side-card p {
          color: var(--mid-gray);
          margin: 0 0 20px;
        }
        .info-side-card a {
          display: block;
          background: var(--black);
          color: var(--white);
          border-radius: 8px;
          padding: 13px 16px;
          text-align: center;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 12px;
          transition: var(--transition);
        }
        .info-side-card a:hover {
          background: var(--gold);
        }
        .info-side-card .secondary-link {
          background: transparent;
          color: var(--black);
          border: 1px solid #d8cfbd;
        }
        .info-side-card .secondary-link:hover {
          color: var(--white);
          border-color: var(--gold);
        }
        @media (max-width: 900px) {
          .info-grid {
            grid-template-columns: 1fr;
          }
          .info-side-card {
            position: static;
          }
        }
        @media (max-width: 600px) {
          .info-hero {
            padding: 56px 0 42px;
          }
          .info-section {
            padding: 34px 0 58px;
          }
          .faq-item button {
            padding: 18px;
          }
          .faq-item p {
            padding: 0 18px 18px;
          }
        }
      `}</style>
    </main>
  );
}

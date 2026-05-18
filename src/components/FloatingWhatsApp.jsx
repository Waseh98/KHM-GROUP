import { useState } from 'react';

const FloatingWhatsApp = () => {
  const [isHovered, setIsHovered] = useState(false);

  const phoneNumber = '923330557783';
  const defaultMessage = `✨ Assalam O Alaikum!
I visited your website and I have a query regarding your products/services. Please guide me.`;

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <>
      <style>{`
        @keyframes whatsappPing {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .whatsapp-pulse {
          animation: whatsappPing 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .whatsapp-tooltip {
          display: none;
        }
        @media (min-width: 641px) {
          .whatsapp-tooltip {
            display: block;
          }
          .whatsapp-btn {
            width: 56px !important;
            height: 56px !important;
          }
        }
        @media (max-width: 820px) {
          .whatsapp-btn {
            width: 52px !important;
            height: 52px !important;
          }
        }
        @media (max-width: 640px) {
          .whatsapp-btn {
            width: 48px !important;
            height: 48px !important;
          }
        }
      `}</style>

      <div style={{
        position: 'fixed',
        bottom: '30px',
        right: '20px',
        zIndex: 99999,
      }}>
        {/* Tooltip — desktop only */}
        {isHovered && (
          <div
            className="whatsapp-tooltip"
            style={{
              position: 'absolute',
              right: '100%',
              top: '50%',
              transform: 'translateY(-50%)',
              marginRight: '12px',
              padding: '8px 16px',
              backgroundColor: '#1f2937',
              color: '#fff',
              fontSize: '14px',
              borderRadius: '8px',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            Chat with us on WhatsApp
          </div>
        )}

        {/* WhatsApp Button */}
        <button
          onClick={() => window.open(whatsappUrl, '_blank')}
          onMouseEnter={(e) => {
            setIsHovered(true);
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            setIsHovered(false);
            e.currentTarget.style.transform = 'scale(1)';
          }}
          className="whatsapp-btn"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#25D366',
            boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
            transition: 'transform 0.2s ease',
            cursor: 'pointer',
            border: 'none',
            outline: 'none',
          }}
          aria-label="Chat on WhatsApp"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.498 14.382c-.301-.15-1.767-.867-2.03-.967-.273-.1-.472-.148-.67.15-.199.296-.767.967-.94 1.164-.174.199-.347.224-.644.074-.3-.149-1.255-.464-2.391-1.477-.883-.788-1.48-1.761-1.654-2.059-.174-.298-.02-.458.13-.607.134-.134.3-.348.447-.521.15-.174.199-.298.298-.497.1-.199.05-.372-.026-.521-.075-.15-.67-1.613-.917-2.207-.243-.58-.488-.5-.67-.51-.174-.009-.372-.01-.571-.01-.199 0-.521.075-.792.373-.273.298-1.04 1.017-1.04 2.48 0 1.463 1.066 2.876 1.214 3.074.15.199 2.097 3.2 5.078 4.488.71.306 1.263.49 1.694.626.713.228 1.36.196 1.872.118.572-.086 1.758-.72 2.007-1.414.249-.694.249-1.29.174-1.414-.075-.125-.273-.199-.571-.348m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.002-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>

          {/* Pulsing ring */}
          <span
            className="whatsapp-pulse"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              backgroundColor: '#25D366',
              opacity: 0.4,
            }}
          />
        </button>
      </div>
    </>
  );
};

export default FloatingWhatsApp;

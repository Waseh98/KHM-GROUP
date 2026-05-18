import { useState, useEffect } from 'react';
import hero1 from './hero-1.jpeg';
import hero2 from './hero-2.jpeg';
import heroChatgpt from './hero-chatgpt.png';
import heroMobile from './hero-mobile-2.png';

const HERO_IMAGES = [
  heroChatgpt,
  hero2,
  hero1,
];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-section">
      
      {/* Desktop Hero Images */}
      <div className="hero-desktop">
        {HERO_IMAGES.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`KHM Group Premium Collection ${index + 1}`}
            className="hero-image"
            style={{
              opacity: currentImageIndex === index ? 1 : 0,
              animation: currentImageIndex === index ? 'slowZoom 10s ease-out forwards' : 'none'
            }}
          />
        ))}
      </div>

      {/* Mobile Hero Image */}
      <div className="hero-mobile-img">
        <img
          src={heroMobile}
          alt="KHM Group Mobile Collection"
          className="hero-mobile-image"
        />
      </div>

      <style>{`
        .hero-section {
          position: relative;
          width: 100%;
          height: 100dvh;
          max-height: 900px;
          min-height: 500px;
          overflow: hidden;
        }

        .hero-desktop {
          position: absolute;
          inset: 0;
          z-index: 1;
          overflow: hidden;
          background-color: #000;
        }

        .hero-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          transition: opacity 1.5s ease-in-out;
        }

        .hero-mobile-img {
          position: absolute;
          inset: 0;
          z-index: 2;
          overflow: hidden;
          background-color: #000;
          display: none;
        }

        .hero-mobile-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
        }

        @keyframes slowZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }

        @media (max-width: 768px) {
          .hero-section {
            min-height: 100dvh !important;
            max-height: none !important;
            height: auto !important;
          }
          .hero-desktop {
            display: none !important;
          }
          .hero-mobile-img {
            display: block !important;
            position: relative !important;
          }
          .hero-mobile-image {
            width: 100% !important;
            height: auto !important;
            object-fit: contain !important;
            display: block !important;
          }
        }

        @media (max-width: 480px) {
          .hero-section {
            min-height: 100dvh !important;
          }
        }
      `}</style>
    </section>
  );
}
